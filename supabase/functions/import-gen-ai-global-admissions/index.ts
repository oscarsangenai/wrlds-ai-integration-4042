import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

const MAX_SUBMISSIONS = 2000;
const MAX_STRING_LENGTH = 5000;

const sanitizeString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str.substring(0, MAX_STRING_LENGTH) || null;
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
  if (typeof fieldObj === 'string') return fieldObj.substring(0, MAX_STRING_LENGTH);
  
  try {
    if (typeof fieldObj === 'object' && fieldObj !== null) {
      const keys = Object.keys(fieldObj);
      if (keys.length > 0) {
        const firstValue = (fieldObj as Record<string, unknown>)[keys[0]];
        if (typeof firstValue === 'string') return firstValue.substring(0, MAX_STRING_LENGTH);
        if (typeof firstValue === 'object' && firstValue !== null) {
          const nestedKeys = Object.keys(firstValue);
          if (nestedKeys.length > 0) {
            const val = (firstValue as Record<string, string>)[nestedKeys[0]];
            return typeof val === 'string' ? val.substring(0, MAX_STRING_LENGTH) : null;
          }
        }
      }
    }
  } catch (e) {
    console.error('Error extracting primary field:', e);
  }
  return null;
};

const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

const isValidFileUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const hostname = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTNAME_PATTERNS.some((p) => p.test(hostname))) return false;
    return true;
  } catch {
    return false;
  }
};

const downloadAndUploadFile = async (
  fileUrl: string,
  fileName: string,
  supabase: ReturnType<typeof createClient>
): Promise<string | null> => {
  try {
    if (!fileUrl || !isValidFileUrl(fileUrl)) return null;
    
    console.log(`Downloading file from: ${fileUrl}`);
    
    const response = await fetch(fileUrl);
    if (!response.ok) {
      console.error(`Failed to download file: ${response.statusText}`);
      return null;
    }
    
    const blob = await response.blob();
    if (blob.size > 50 * 1024 * 1024) {
      console.error(`File too large: ${blob.size} bytes`);
      return null;
    }

    const arrayBuffer = await blob.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_").substring(0, 200);
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
    
    // Store just the file path — buckets are private, admins use signed URLs
    return uniqueFileName;
  } catch (error) {
    console.error("Error in downloadAndUploadFile:", error);
    return null;
  }
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin") ?? undefined;
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // JWT Authentication — admin only
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing authorization" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await authSupabase.auth.getUser(token);
    if (claimsError || !claimsData?.user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check admin role using service role client
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", claimsData.user.id)
      .eq("role", "admin");

    if (!roleRows || roleRows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden - admin role required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ success: false, error: "File too large (max 10MB)" }),
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
      const errorMessage = parseError instanceof Error ? parseError.message : "Invalid format";
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

    if (submissions.length > MAX_SUBMISSIONS) {
      return new Response(
        JSON.stringify({ success: false, error: `Too many submissions (max ${MAX_SUBMISSIONS})` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate required columns
    const firstRow = submissions[0];
    if (!firstRow["Submission ID"]) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required column: Submission ID" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing ${submissions.length} submissions from JSON`);

    interface ImportError {
      row: number;
      error: string;
      submissionId?: string;
    }

    const errors: ImportError[] = [];
    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      const rowNum = i + 1;
      
      try {
        const submissionId = sanitizeString(submission["Submission ID"]);
        
        if (!submissionId) {
          skipCount++;
          continue;
        }

        const { data: existing } = await supabase
          .from("gen_ai_global_admissions")
          .select("id")
          .eq("submission_id", submissionId)
          .maybeSingle();

        if (existing) {
          skipCount++;
          continue;
        }

        const primaryField = extractPrimaryField(submission["Primary Field "]);

        const insertData: Record<string, unknown> = {
          submission_id: submissionId,
          full_name: sanitizeString(submission["Full Name"]),
          email: sanitizeString(submission["Email"]),
          linkedin_profile_url: sanitizeString(submission["LinkedIn Profile URL"]),
          primary_field_of_expertise: primaryField,
          taken_mit_course: parseBoolean(
            submission['Have you taken an MIT course with Dr. Sanchez or another M.I.T P.E Instructor (e.g., "AI for Digital Professionals")?']
          ),
          willing_to_volunteer: parseBoolean(
            submission["Since you're not part of the MIT Professional Education course, the only way to join is by volunteering in one of our teams for 30 minutes a day. Are you willing to volunteer?"]
          ),
          motivation: sanitizeString(submission["Why do you want to join Gen AI Global?Briefly share your motivation and what you hope to contribute or gain."]),
          ai_tools_experience: sanitizeString(submission["What is your current level of experience with AI tools (e.g., ChatGPT, Claude, Midjourney, etc.)?"]),
          coding_experience: sanitizeString(submission["What is your current level of coding or technical experience?"]),
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

        const certificateUrl = sanitizeString(submission["If yes, please submit your certificate"]);
        if (certificateUrl && isValidFileUrl(certificateUrl)) {
          const fileName = certificateUrl.split("/").pop()?.substring(0, 200) || "certificate.pdf";
          insertData.certificate_url = await downloadAndUploadFile(certificateUrl, fileName, supabase);
        } else {
          insertData.certificate_url = null;
        }

        const cvUrl = sanitizeString(submission["To apply for a Gen AI Global volunteer role, or general member position, please upload your CV or resume (PDF preferred)"]);
        if (cvUrl && isValidFileUrl(cvUrl)) {
          const fileName = cvUrl.split("/").pop()?.substring(0, 200) || "resume.pdf";
          insertData.cv_resume_url = await downloadAndUploadFile(cvUrl, fileName, supabase);
        } else {
          insertData.cv_resume_url = null;
        }

        const { error } = await supabase
          .from("gen_ai_global_admissions")
          .insert(insertData);

        if (error) {
          console.error(`Error inserting row ${rowNum}:`, error);
          errors.push({ row: rowNum, submissionId, error: error.message });
        } else {
          successCount++;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        errors.push({ row: rowNum, error: errorMessage });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Import completed",
        stats: {
          total: submissions.length,
          success: successCount,
          skipped: skipCount,
          errors: errors.length,
        },
        errors: errors.length > 0 ? errors.slice(0, 20) : undefined,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error processing import:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to process import",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
