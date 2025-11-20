import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const parseBoolean = (value: unknown): boolean => {
  if (value === true || value === false) return value;
  if (!value || (typeof value === 'string' && value.trim() === "")) return false;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === "yes" || lower === "true" || lower === "currently enrolled in cohort";
  }
  return false;
};

const extractPrimaryField = (fieldObj: unknown): string | null => {
  if (!fieldObj) return null;
  if (typeof fieldObj === 'string') return fieldObj;
  
  // Handle nested structure: { " Area of Expertise...": { "UI, etc.)": "value" } }
  try {
    if (typeof fieldObj === 'object' && fieldObj !== null) {
      const keys = Object.keys(fieldObj);
      if (keys.length > 0) {
        const firstValue = (fieldObj as Record<string, unknown>)[keys[0]];
        if (typeof firstValue === 'string') return firstValue;
        if (typeof firstValue === 'object' && firstValue !== null) {
          const nestedKeys = Object.keys(firstValue);
          if (nestedKeys.length > 0) {
            return (firstValue as Record<string, string>)[nestedKeys[0]];
          }
        }
      }
    }
  } catch (e) {
    console.error('Error extracting primary field:', e);
  }
  return null;
};

const downloadAndUploadFile = async (
  fileUrl: string,
  fileName: string,
  supabase: ReturnType<typeof createClient>
): Promise<string | null> => {
  try {
    if (!fileUrl || fileUrl.trim() === "") return null;
    
    console.log(`Downloading file from: ${fileUrl}`);
    
    const response = await fetch(fileUrl);
    if (!response.ok) {
      console.error(`Failed to download file: ${response.statusText}`);
      return null;
    }
    
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
    
    const { error } = await supabase.storage
      .from("form_uploads")
      .upload(uniqueFileName, fileData, {
        contentType: blob.type,
        upsert: false,
      });
    
    if (error) {
      console.error("Error uploading to Supabase storage:", error);
      return null;
    }
    
    const { data: publicUrlData } = supabase.storage
      .from("form_uploads")
      .getPublicUrl(uniqueFileName);
    
    console.log(`File uploaded successfully: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in downloadAndUploadFile:", error);
    return null;
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const fileContent = await file.text();
    
    interface SubmissionData {
      "Submission ID"?: string;
      "Full Name"?: string;
      "Email"?: string;
      [key: string]: unknown;
    }
    
    let submissions: SubmissionData[];
    
    try {
      const parsed = JSON.parse(fileContent);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array");
      }
      submissions = parsed;
    } catch (parseError) {
      const errorMessage = parseError instanceof Error ? parseError.message : "Invalid JSON format";
      return new Response(
        JSON.stringify({ success: false, error: `Invalid JSON: ${errorMessage}` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    if (submissions.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "JSON array is empty" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing ${submissions.length} submissions from JSON`);

    interface ImportError {
      row: number;
      error: string;
      submissionId?: string;
      submission?: string;
    }

    const errors: ImportError[] = [];
    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      const rowNum = i + 1;
      
      try {
        const submissionId = submission["Submission ID"]?.trim();
        
        if (!submissionId) {
          console.log(`Skipping row ${rowNum}: no submission ID`);
          console.log(`Submission data:`, JSON.stringify(submission).substring(0, 200));
          skipCount++;
          continue;
        }

        console.log(`Processing row ${rowNum}: ${submissionId}`);

        // Check for duplicate
        const { data: existing } = await supabase
          .from("gen_ai_global_admissions")
          .select("id")
          .eq("submission_id", submissionId)
          .maybeSingle();

        if (existing) {
          console.log(`Skipping row ${rowNum}: duplicate submission ID ${submissionId}`);
          skipCount++;
          continue;
        }

        // Extract primary field from nested structure
        const primaryField = extractPrimaryField(submission["Primary Field "]);

        const insertData: Record<string, unknown> = {
          submission_id: submissionId,
          full_name: submission["Full Name"]?.toString().trim() || null,
          email: submission["Email"]?.toString().trim() || null,
          linkedin_profile_url: submission["LinkedIn Profile URL"]?.toString().trim() || null,
          primary_field_of_expertise: primaryField,
          taken_mit_course: parseBoolean(
            submission['Have you taken an MIT course with Dr. Sanchez or another M.I.T P.E Instructor (e.g., "AI for Digital Professionals")?']
          ),
          willing_to_volunteer: parseBoolean(
            submission["Since you're not part of the MIT Professional Education course, the only way to join is by volunteering in one of our teams for 30 minutes a day. Are you willing to volunteer?"]
          ),
          motivation: submission["Why do you want to join Gen AI Global?Briefly share your motivation and what you hope to contribute or gain."]?.toString().trim() || null,
          ai_tools_experience: submission["What is your current level of experience with AI tools (e.g., ChatGPT, Claude, Midjourney, etc.)?"]?.toString().trim() || null,
          coding_experience: submission["What is your current level of coding or technical experience?"]?.toString().trim() || null,
          interested_in_volunteering: parseBoolean(
            submission["Would you be interested in volunteering to help run or support one of our teams? (e.g., Cybersecurity, Agile & Community Ops, Agent Dev Instructor, I.T, etc.)"]
          ),
          discord_sharing_consent: parseBoolean(
            submission["I understand that my information may be shared in the Gen AI Global Discord community as part of our open-source structure."]
          ),
          admission_understanding: parseBoolean(
            submission["I understand that not all applicants are accepted and that final admission is based on a curated review process."]
          ),
          submitted_at: new Date().toISOString(),
        };

        // Handle certificate URL
        const certificateUrl = submission["If yes, please submit your certificate"]?.toString().trim();
        if (certificateUrl && certificateUrl.startsWith("http")) {
          console.log(`Downloading certificate for ${submissionId}...`);
          const fileName = certificateUrl.split("/").pop() || "certificate.pdf";
          insertData.certificate_url = await downloadAndUploadFile(certificateUrl, fileName, supabase);
        } else {
          insertData.certificate_url = null;
        }

        // Handle CV/Resume URL
        const cvUrl = submission["To apply for a Gen AI Global volunteer role, or general member position, please upload your CV or resume (PDF preferred)"]?.toString().trim();
        if (cvUrl && cvUrl.startsWith("http")) {
          console.log(`Downloading CV/resume for ${submissionId}...`);
          const fileName = cvUrl.split("/").pop() || "resume.pdf";
          insertData.cv_resume_url = await downloadAndUploadFile(cvUrl, fileName, supabase);
        } else {
          insertData.cv_resume_url = null;
        }

        const { error } = await supabase
          .from("gen_ai_global_admissions")
          .insert(insertData);

        if (error) {
          console.error(`Error inserting row ${rowNum} (${submissionId}):`, error);
          errors.push({ row: rowNum, submissionId, error: error.message });
        } else {
          successCount++;
          console.log(`✓ Successfully imported row ${rowNum}: ${submissionId}`);
        }
      } catch (error) {
        console.error(`Error processing row ${rowNum}:`, error);
        console.error(`Submission data:`, JSON.stringify(submission).substring(0, 300));
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        errors.push({ row: rowNum, error: errorMessage, submission: submission["Submission ID"]?.toString() });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "JSON import completed",
        stats: {
          total: submissions.length,
          success: successCount,
          skipped: skipCount,
          errors: errors.length,
        },
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error processing import:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
