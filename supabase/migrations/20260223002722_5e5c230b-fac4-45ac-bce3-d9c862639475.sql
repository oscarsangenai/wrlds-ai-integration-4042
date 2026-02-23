-- Fix overly permissive SELECT policy on gen_ai_global_admissions
-- Currently USING (true) allows any authenticated user to read all PII
DROP POLICY IF EXISTS "Allow authenticated users to read" ON public.gen_ai_global_admissions;

-- Only admins can read submissions
CREATE POLICY "Allow admins to read submissions"
ON public.gen_ai_global_admissions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));