-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Make storage buckets private
UPDATE storage.buckets 
SET public = false 
WHERE id IN ('form_uploads', 'certificates');

-- Drop existing public storage policies
DROP POLICY IF EXISTS "Allow public read access to form_uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert to form_uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to certificates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert to certificates" ON storage.objects;

-- Allow service role to insert (for webhook)
CREATE POLICY "Service role can insert to form_uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'form_uploads');

CREATE POLICY "Service role can insert to certificates" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'certificates');

-- Only admins can read files
CREATE POLICY "Only admins can read form_uploads" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'form_uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can read certificates" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'certificates' AND public.has_role(auth.uid(), 'admin'));