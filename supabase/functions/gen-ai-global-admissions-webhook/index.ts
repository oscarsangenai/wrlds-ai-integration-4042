import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

const parseBoolean = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    return lower === "yes" || lower === "true" || lower === "currently enrolled in cohort";
  }
  return false;
};

const downloadAndUploadFile = async (
  fileUrl: string,
  fileName: string,
  supabase: ReturnType<typeof createClient>
): Promise<string | null> => {
  try {
    console.log(`Downloading file from: ${fileUrl}`);
    
    // Download file from Fillout
    const response = await fetch(fileUrl);
    if (!response.ok) {
      console.error(`Failed to download file: ${response.statusText}`);
      return null;
    }
    
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
    
    // Upload to Supabase storage
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
    
    // Get public URL
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

const processFileField = async (
  value: unknown,
  supabase: ReturnType<typeof createClient>
): Promise<string | null> => {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null;
  }
  
  // Handle multiple files - upload first file
  const file = value[0] as { url?: string; filename?: string };
  if (file.url && file.filename) {
    return await downloadAndUploadFile(file.url, file.filename, supabase);
  }
  
  return null;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse webhook payload
    const payload: FilloutPayload = await req.json();
    console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

    const submissionId = payload.submission?.submissionId;
    if (!submissionId) {
      throw new Error("Missing submission ID");
    }

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

    // Create a map of question ID to value
    const questionsMap = new Map(
      payload.submission.questions.map(q => [q.id, q.value])
    );
    
    // Initialize data object
    const formData: Record<string, unknown> = {
      submission_id: submissionId,
      raw_payload: payload,
      submitted_at: payload.submission.submissionTime || new Date().toISOString(),
    };

    // Process each field
    for (const [fieldId, dbColumn] of Object.entries(FIELD_MAPPING)) {
      const value = questionsMap.get(fieldId);
      
      if (value === undefined || value === null) {
        formData[dbColumn] = null;
        continue;
      }

      // Handle file uploads
      if (fieldId === "cRVh" || fieldId === "sZNa") {
        formData[dbColumn] = await processFileField(value, supabase);
        continue;
      }

      // Handle boolean fields
      if (
        dbColumn === "taken_mit_course" ||
        dbColumn === "willing_to_volunteer" ||
        dbColumn === "interested_in_volunteering" ||
        dbColumn === "discord_sharing_consent" ||
        dbColumn === "admission_understanding"
      ) {
        formData[dbColumn] = parseBoolean(value);
        continue;
      }

      // Default: store the value as-is
      formData[dbColumn] = value;
    }

    console.log("Processed form data:", JSON.stringify(formData, null, 2));

    // Insert into database
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
