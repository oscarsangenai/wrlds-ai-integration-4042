import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

interface FilloutQuestion {
  id: string;
  name: string;
  type: string;
  value: unknown;
}

interface FilloutPayload {
  formId: string;
  formName: string;
  submission: {
    submissionId: string;
    submissionTime: string;
    lastUpdatedAt: string;
    questions: FilloutQuestion[];
  };
}

// Field ID to database column mapping
const FIELD_MAPPING: Record<string, string> = {
  "3Q4U": "full_name",
  "5ZLy": "email",
  "sxJB": "linkedin_profile_url",
  "eK9t": "primary_field_of_expertise",
  "rqeQ": "taken_mit_course",
  "cRVh": "certificate_url",
  "3gMg": "willing_to_volunteer",
  "8xUt": "motivation",
  "jEcc": "ai_tools_experience",
  "ioT3": "coding_experience",
  "vCg5": "interested_in_volunteering",
  "sZNa": "cv_resume_url",
  "bAiY": "discord_sharing_consent",
  "6vhu": "admission_understanding",
};

const BOOLEAN_COLUMNS = new Set([
  "taken_mit_course",
  "willing_to_volunteer",
  "interested_in_volunteering",
  "discord_sharing_consent",
  "admission_understanding",
]);

const FILE_FIELD_IDS = new Set(["cRVh", "sZNa"]);

const MAX_STRING_LENGTH = 5000;
const MAX_QUESTIONS = 100;

const sanitizeString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str.substring(0, MAX_STRING_LENGTH) || null;
};

const parseBoolean = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    return lower === "yes" || lower === "true" || lower === "currently enrolled in cohort";
  }
  return false;
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
    if (!isValidFileUrl(fileUrl)) {
      console.error(`Invalid file URL rejected: ${fileUrl}`);
      return null;
    }

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

const processFileField = async (
  value: unknown,
  supabase: ReturnType<typeof createClient>
): Promise<string | null> => {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null;
  }

  const file = value[0] as { url?: string; filename?: string };
  if (file.url && typeof file.url === "string" && file.filename && typeof file.filename === "string") {
    return await downloadAndUploadFile(file.url, file.filename, supabase);
  }

  return null;
};

const validatePayload = (body: unknown): FilloutPayload => {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid payload: expected JSON object");
  }

  const payload = body as Record<string, unknown>;

  if (!payload.submission || typeof payload.submission !== "object") {
    throw new Error("Invalid payload: missing submission object");
  }

  const submission = payload.submission as Record<string, unknown>;

  if (!submission.submissionId || typeof submission.submissionId !== "string") {
    throw new Error("Invalid payload: missing or invalid submissionId");
  }

  if (submission.submissionId.length > 255) {
    throw new Error("Invalid payload: submissionId too long");
  }

  if (!Array.isArray(submission.questions)) {
    throw new Error("Invalid payload: questions must be an array");
  }

  if (submission.questions.length > MAX_QUESTIONS) {
    throw new Error(`Invalid payload: too many questions (max ${MAX_QUESTIONS})`);
  }

  return body as FilloutPayload;
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin") ?? undefined;
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate webhook secret
    const webhookSecret = req.headers.get("x-webhook-secret") || req.headers.get("x-fillout-webhook-secret");
    const expectedSecret = Deno.env.get("FILLOUT_API_KEY");

    if (!expectedSecret || !webhookSecret || webhookSecret !== expectedSecret) {
      console.error("Webhook authentication failed");
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const rawBody = await req.json();
    const payload = validatePayload(rawBody);

    const submissionId = payload.submission.submissionId;

    // Check for duplicate submission
    const { data: existingSubmission } = await supabase
      .from("gen_ai_global_admissions")
      .select("id")
      .eq("submission_id", submissionId)
      .single();

    if (existingSubmission) {
      console.log(`Duplicate submission detected: ${submissionId}`);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Submission already processed",
          submissionId,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const questionsMap = new Map(
      payload.submission.questions.map((q) => [q.id, q.value])
    );

    const formData: Record<string, unknown> = {
      submission_id: submissionId,
      raw_payload: payload,
      submitted_at: payload.submission.submissionTime || new Date().toISOString(),
    };

    for (const [fieldId, dbColumn] of Object.entries(FIELD_MAPPING)) {
      const value = questionsMap.get(fieldId);

      if (value === undefined || value === null) {
        formData[dbColumn] = null;
        continue;
      }

      if (FILE_FIELD_IDS.has(fieldId)) {
        formData[dbColumn] = await processFileField(value, supabase);
        continue;
      }

      if (BOOLEAN_COLUMNS.has(dbColumn)) {
        formData[dbColumn] = parseBoolean(value);
        continue;
      }

      formData[dbColumn] = sanitizeString(value);
    }

    const { data, error } = await supabase
      .from("gen_ai_global_admissions")
      .insert(formData)
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      throw error;
    }

    console.log("Submission stored successfully:", data.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Submission received and stored",
        submissionId: data.submission_id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to process submission",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
