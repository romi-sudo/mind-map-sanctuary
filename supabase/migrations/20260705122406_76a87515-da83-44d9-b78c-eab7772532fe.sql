ALTER TABLE public.early_access_signups 
ADD COLUMN IF NOT EXISTS specialty text,
ADD COLUMN IF NOT EXISTS years_experience text,
ADD COLUMN IF NOT EXISTS bio text;