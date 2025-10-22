-- Create gen_ai_global_admissions table
CREATE TABLE public.gen_ai_global_admissions (
  id BIGSERIAL PRIMARY KEY,
  submission_id TEXT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  linkedin_profile_url TEXT,
  primary_field_of_expertise TEXT,
  taken_mit_course BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,
  willing_to_volunteer BOOLEAN DEFAULT FALSE,
  motivation TEXT,
  ai_tools_experience TEXT,
  coding_experience TEXT,
  interested_in_volunteering BOOLEAN DEFAULT FALSE,
  cv_resume_url TEXT,
  discord_sharing_consent BOOLEAN DEFAULT FALSE,
  admission_understanding BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP DEFAULT NOW(),
  timezone TEXT,
  time_to_complete DECIMAL,
  raw_payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.gen_ai_global_admissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (for webhook)
CREATE POLICY "Allow webhook insert" 
ON public.gen_ai_global_admissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow authenticated users to read
CREATE POLICY "Allow authenticated users to read" 
ON public.gen_ai_global_admissions 
FOR SELECT 
USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('form_uploads', 'form_uploads', true),
  ('certificates', 'certificates', true);

-- Create storage policies for form_uploads bucket
CREATE POLICY "Allow public read access to form_uploads" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'form_uploads');

CREATE POLICY "Allow public insert to form_uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'form_uploads');

-- Create storage policies for certificates bucket
CREATE POLICY "Allow public read access to certificates" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'certificates');

CREATE POLICY "Allow public insert to certificates" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'certificates');

-- Create index on submission_id for faster lookups
CREATE INDEX idx_submission_id ON public.gen_ai_global_admissions(submission_id);

-- Create index on submitted_at for sorting
CREATE INDEX idx_submitted_at ON public.gen_ai_global_admissions(submitted_at DESC);