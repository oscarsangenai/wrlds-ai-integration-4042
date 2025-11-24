import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * Application Submission API Endpoint
 * 
 * Production-ready endpoint that stores applications in Supabase.
 * Integrates with the gen_ai_global_admissions table for both member and volunteer applications.
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Supabase anonymous key for client operations
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key for backend operations (optional, for enhanced features)
 * - ALLOWED_ORIGINS: Comma-separated list of allowed origins for CORS
 */

interface ApplicationData {
  type: 'member' | 'volunteer';
  form: {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    timezone: string;
    linkedin?: string;
    motivation: string;
    agreeTerms: boolean;
    // Member-specific
    course?: string;
    experience?: string;
    // Volunteer-specific
    department?: string;
    skills?: string[];
    availability?: string;
    previousVolunteer?: string;
  };
  files: Array<{
    id: string;
    name: string;
    url?: string;
  }>;
}

interface ApplicationRecord {
  submission_id: string;
  full_name: string;
  email: string;
  linkedin_profile_url: string | null;
  primary_field_of_expertise: string | null;
  taken_mit_course: boolean;
  certificate_url: string | null;
  willing_to_volunteer: boolean;
  motivation: string;
  ai_tools_experience: string | null;
  coding_experience: string | null;
  interested_in_volunteering: boolean;
  cv_resume_url: string | null;
  discord_sharing_consent: boolean;
  admission_understanding: boolean;
  submitted_at: string;
  timezone: string;
  raw_payload: unknown;
}

// Validate environment configuration
const validateConfig = (): { isValid: boolean; error?: string } => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      isValid: false,
      error: 'Server configuration error. Missing Supabase credentials.',
    };
  }

  return { isValid: true };
};

// Get allowed origins from environment
const getAllowedOrigins = (): string[] => {
  const origins = process.env.ALLOWED_ORIGINS || 'https://genaiglobal.org,http://localhost:8080,http://localhost:5173';
  return origins.split(',').map(o => o.trim());
};

// Validate request origin
const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true; // Allow requests without origin header
  const allowed = getAllowedOrigins();
  return allowed.includes(origin) || allowed.includes('*');
};

// Validate application data structure
const validateApplicationData = (data: unknown): data is ApplicationData => {
  if (!data || typeof data !== 'object') return false;
  
  const app = data as Partial<ApplicationData>;
  
  if (!app.type || !['member', 'volunteer'].includes(app.type)) return false;
  if (!app.form || typeof app.form !== 'object') return false;
  
  const form = app.form;
  const requiredFields = ['firstName', 'lastName', 'email', 'country', 'timezone', 'motivation', 'agreeTerms'];
  
  for (const field of requiredFields) {
    if (!(field in form)) return false;
  }
  
  if (!form.email.includes('@')) return false;
  if (!form.agreeTerms) return false;
  
  return true;
};

// Map application data to database schema
const mapToDbRecord = (data: ApplicationData): Partial<ApplicationRecord> => {
  const submissionId = `app-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  const fullName = `${data.form.firstName} ${data.form.lastName}`;
  
  const record: Partial<ApplicationRecord> = {
    submission_id: submissionId,
    full_name: fullName,
    email: data.form.email,
    linkedin_profile_url: data.form.linkedin || null,
    motivation: data.form.motivation,
    submitted_at: new Date().toISOString(),
    timezone: data.form.timezone,
    raw_payload: data,
    discord_sharing_consent: data.form.agreeTerms,
    admission_understanding: data.form.agreeTerms,
  };
  
  // Member-specific fields
  if (data.type === 'member') {
    record.primary_field_of_expertise = data.form.course || null;
    record.ai_tools_experience = data.form.experience || null;
    record.taken_mit_course = !!data.form.course;
    record.interested_in_volunteering = false;
    record.willing_to_volunteer = false;
    
    // Find certificate URL from uploaded files
    const certFile = data.files.find(f => 
      f.name.toLowerCase().includes('cert') || 
      f.name.toLowerCase().includes('certificate')
    );
    record.certificate_url = certFile?.url || null;
  }
  
  // Volunteer-specific fields
  if (data.type === 'volunteer') {
    record.primary_field_of_expertise = data.form.department || null;
    record.coding_experience = data.form.skills?.join(', ') || null;
    record.ai_tools_experience = data.form.availability || null;
    record.interested_in_volunteering = true;
    record.willing_to_volunteer = true;
    record.taken_mit_course = false;
    
    // Find CV/Resume URL from uploaded files
    const cvFile = data.files.find(f => 
      f.name.toLowerCase().includes('cv') || 
      f.name.toLowerCase().includes('resume')
    );
    record.cv_resume_url = cvFile?.url || null;
  }
  
  return record;
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const origin = req.headers.origin;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  // Validate origin
  if (!isOriginAllowed(origin)) {
    return res.status(403).json({ 
      success: false,
      error: 'Origin not allowed' 
    });
  }

  try {
    // Validate environment configuration
    const configCheck = validateConfig();
    if (!configCheck.isValid) {
      console.error('Configuration error:', configCheck.error);
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error. Please contact support.' 
      });
    }

    // Parse and validate request data
    const data = req.body;
    
    if (!validateApplicationData(data)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid application data. Please check all required fields.' 
      });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Map to database record
    const dbRecord = mapToDbRecord(data);

    // Check for duplicate submission (by email + recent timestamp)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: existingSubmission } = await supabase
      .from('gen_ai_global_admissions')
      .select('id, email')
      .eq('email', data.form.email)
      .gte('submitted_at', fiveMinutesAgo)
      .limit(1);

    if (existingSubmission && existingSubmission.length > 0) {
      console.log('Duplicate submission detected:', data.form.email);
      return res.status(409).json({ 
        success: false,
        error: 'A recent application from this email already exists. Please wait before resubmitting.' 
      });
    }

    // Insert application into database
    const { data: insertedData, error: insertError } = await supabase
      .from('gen_ai_global_admissions')
      .insert(dbRecord)
      .select('submission_id')
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to store application data');
    }

    console.log('Application stored successfully:', {
      submissionId: insertedData.submission_id,
      type: data.type,
      email: data.form.email,
      name: `${data.form.firstName} ${data.form.lastName}`,
    });

    // Return success response
    return res.status(200).json({
      success: true,
      applicationId: insertedData.submission_id,
      message: 'Application submitted successfully',
      type: data.type,
    });

  } catch (error) {
    console.error('Application submission error:', error);
    
    // Return safe error message to client
    const errorMessage = error instanceof Error ? error.message : 'Application submission failed';
    return res.status(500).json({
      success: false,
      error: errorMessage,
      message: 'An error occurred while processing your application. Please try again later.'
    });
  }
}
