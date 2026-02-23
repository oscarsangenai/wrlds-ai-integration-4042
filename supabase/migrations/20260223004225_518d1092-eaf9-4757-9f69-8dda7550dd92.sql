-- Fix storage: drop any public read policies, add admin-only read
DROP POLICY IF EXISTS "Allow public read access to form_uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to certificates" ON storage.objects;
DROP POLICY IF EXISTS "Public read form_uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public read certificates" ON storage.objects;

-- Ensure buckets are private
UPDATE storage.buckets SET public = false WHERE id IN ('form_uploads', 'certificates');

-- Admin-only read access for form_uploads
CREATE POLICY "Admins can read form_uploads"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'form_uploads' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Admin-only read access for certificates
CREATE POLICY "Admins can read certificates"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'certificates' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);