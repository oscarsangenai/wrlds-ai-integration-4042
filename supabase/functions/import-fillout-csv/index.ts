import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// CSV column index to database column mapping
const COLUMN_MAPPING: Record<number, string> = {
  0: "submission_id",           // "Submission ID"
  5: "full_name",               // "Full Name"
  6: "email",                   // "Email"
  7: "linkedin_profile_url",    // "LinkedIn Profile URL"
  8: "primary_field_of_expertise", // "Primary Field / Area of Expertise"
  9: "taken_mit_course",        // "Have you taken an MIT course"
  10: "certificate_url",        // "If yes, please submit your certificate"
  11: "willing_to_volunteer",   // "Are you willing to volunteer?"
  13: "motivation",             // "Why do you want to join"
  14: "ai_tools_experience",    // AI tools experience
  15: "coding_experience",      // coding experience
  16: "interested_in_volunteering", // interested in volunteering
  17: "cv_resume_url",          // CV/Resume URL
  18: "discord_sharing_consent", // discord sharing consent
  19: "admission_understanding", // admission understanding
};

const parseBoolean = (value: string): boolean => {
  if (!value || value.trim() === "") return false;
  const lower = value.toLowerCase().trim();
  return lower === "yes" || lower === "true" || lower === "currently enrolled in cohort";
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

const downloadAndUploadFile = async (
  fileUrl: string,
  fileName: string,
  supabase: any
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
    
    const { data, error } = await supabase.storage
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

    const csvContent = await file.text();
    const lines = csvContent.split("\n").filter(line => line.trim() !== "");
    
    if (lines.length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: "CSV file is empty or invalid" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const records = [];
    const errors = [];
    let successCount = 0;
    let skipCount = 0;

    // Skip header row, process data rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const columns = parseCSVLine(lines[i]);
        
        if (columns.length < 20) {
          console.log(`Skipping row ${i + 1}: insufficient columns (has ${columns.length}, needs 20)`);
          console.log(`Row content: ${lines[i].substring(0, 200)}...`);
          console.log(`Parsed columns:`, JSON.stringify(columns.slice(0, 10)));
          skipCount++;
          continue;
        }

        const submissionId = columns[0]?.trim();
        if (!submissionId) {
          console.log(`Skipping row ${i + 1}: no submission ID`);
          console.log(`Row content: ${lines[i].substring(0, 200)}...`);
          skipCount++;
          continue;
        }

        // Check for duplicate
        const { data: existing } = await supabase
          .from("gen_ai_global_admissions")
          .select("id")
          .eq("submission_id", submissionId)
          .single();

        if (existing) {
          console.log(`Skipping row ${i + 1}: duplicate submission ID ${submissionId}`);
          skipCount++;
          continue;
        }

        const formData: any = {
          submission_id: submissionId,
          full_name: columns[5]?.trim() || null,
          email: columns[6]?.trim() || null,
          linkedin_profile_url: columns[7]?.trim() || null,
          primary_field_of_expertise: columns[8]?.trim() || null,
          taken_mit_course: parseBoolean(columns[9]),
          willing_to_volunteer: parseBoolean(columns[11]),
          motivation: columns[13]?.trim() || null,
          ai_tools_experience: columns[14]?.trim() || null,
          coding_experience: columns[15]?.trim() || null,
          interested_in_volunteering: parseBoolean(columns[16]),
          discord_sharing_consent: parseBoolean(columns[18]),
          admission_understanding: parseBoolean(columns[19]),
          submitted_at: new Date().toISOString(),
        };

        // Handle certificate URL
        const certificateUrl = columns[10]?.trim();
        if (certificateUrl && certificateUrl.startsWith("http")) {
          const fileName = certificateUrl.split("/").pop() || "certificate.pdf";
          formData.certificate_url = await downloadAndUploadFile(certificateUrl, fileName, supabase);
        } else {
          formData.certificate_url = null;
        }

        // Handle CV/Resume URL
        const cvUrl = columns[17]?.trim();
        if (cvUrl && cvUrl.startsWith("http")) {
          const fileName = cvUrl.split("/").pop() || "resume.pdf";
          formData.cv_resume_url = await downloadAndUploadFile(cvUrl, fileName, supabase);
        } else {
          formData.cv_resume_url = null;
        }

        const { error } = await supabase
          .from("gen_ai_global_admissions")
          .insert(formData);

        if (error) {
          console.error(`Error inserting row ${i + 1}:`, error);
          errors.push({ row: i + 1, error: error.message });
        } else {
          successCount++;
          console.log(`Successfully imported row ${i + 1}: ${submissionId}`);
        }
      } catch (error: any) {
        console.error(`Error processing row ${i + 1}:`, error);
        errors.push({ row: i + 1, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "CSV import completed",
        stats: {
          total: lines.length - 1,
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
  } catch (error: any) {
    console.error("Error processing CSV import:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
