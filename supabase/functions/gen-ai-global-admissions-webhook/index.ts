import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FilloutField {
  value: any;
  selectedOptionIds?: string[];
}

interface FilloutPayload {
  mode: string;
  sessionToken: string;
  stepId: string;
  model: {
    [key: string]: {
      [fieldId: string]: FilloutField;
    };
  };
  globals: {
    submissionId: string;
  };
  metadata: {
    timeToCompleteInSeconds: number;
    timezone: string;
  };
}

// Field ID to database column mapping
const FIELD_MAPPING: Record<string, string> = {
  "3Q4U": "full_name",
  "3gMg": "taken_mit_course",
  "5ZLy": "email",
  "6vhu": "willing_to_volunteer",
  "8xUt": "primary_field_of_expertise",
  "bAiY": "interested_in_volunteering",
  "cRVh": "certificate_url",
  "eK9t": "motivation",
  "ioT3": "ai_tools_experience",
  "jEcc": "coding_experience",
  "sZNa": "cv_resume_url",
  "sxJB": "linkedin_profile_url",
  "vCg5": "discord_sharing_consent",
};

const parseBoolean = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    return lower === "yes" || lower === "true";
  }
  return false;
};

const downloadAndUploadFile = async (
  fileUrl: string,
  fileName: string,
  supabase: any
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
  field: FilloutField,
  supabase: any
): Promise<string | null> => {
  if (!field.value || !Array.isArray(field.value) || field.value.length === 0) {
    return null;
  }
  
  // Handle multiple files - upload first file
  const file = field.value[0];
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

    const submissionId = payload.globals?.submissionId;
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

    // Extract form data from the model
    const stepData = payload.model["7Fdi"] || {};
    
    // Initialize data object
    const formData: any = {
      submission_id: submissionId,
      raw_payload: payload,
      timezone: payload.metadata?.timezone || null,
      time_to_complete: payload.metadata?.timeToCompleteInSeconds || null,
    };

    // Process each field
    for (const [fieldId, dbColumn] of Object.entries(FIELD_MAPPING)) {
      const field = stepData[fieldId];
      
      if (!field) {
        formData[dbColumn] = null;
        continue;
      }

      // Handle file uploads
      if (fieldId === "cRVh" || fieldId === "sZNa") {
        formData[dbColumn] = await processFileField(field, supabase);
        continue;
      }

      // Handle boolean fields
      if (
        dbColumn === "taken_mit_course" ||
        dbColumn === "willing_to_volunteer" ||
        dbColumn === "interested_in_volunteering" ||
        dbColumn === "discord_sharing_consent"
      ) {
        formData[dbColumn] = parseBoolean(field.value);
        continue;
      }

      // Handle text fields with selectedOptionIds (use the value, not IDs)
      if (field.selectedOptionIds && field.selectedOptionIds.length > 0) {
        formData[dbColumn] = field.value || null;
        continue;
      }

      // Default: store the value as-is
      formData[dbColumn] = field.value || null;
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
  } catch (error: any) {
    console.error("Error processing webhook:", error);
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
