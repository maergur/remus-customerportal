-- Create storage bucket for onboarding illustrations
INSERT INTO storage.buckets (id, name, public)
VALUES ('onboarding-illustrations', 'onboarding-illustrations', true);

-- Allow public read access to illustrations
CREATE POLICY "Public read access for onboarding illustrations"
ON storage.objects
FOR SELECT
USING (bucket_id = 'onboarding-illustrations');

-- Allow service role to insert illustrations (edge function uses service role)
CREATE POLICY "Service role can upload illustrations"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'onboarding-illustrations');