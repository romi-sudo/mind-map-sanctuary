ALTER TABLE public.practitioner_applications
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

ALTER TABLE public.practitioner_applications
DROP CONSTRAINT IF EXISTS practitioner_applications_status_check;

ALTER TABLE public.practitioner_applications
ADD CONSTRAINT practitioner_applications_status_check
CHECK (status IN ('pending', 'approved', 'rejected'));