-- Drop and recreate organizations table with proper owner relationship
DROP TABLE IF EXISTS organizations CASCADE;

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  legal_name TEXT,
  tax_id TEXT,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  owner_id UUID NOT NULL,
  settings JSONB DEFAULT jsonb_build_object(
    'business_type', 'restaurant',
    'default_timezone', 'America/Toronto',
    'multi_unit', false,
    'currency', 'CAD',
    'date_format', 'MM/DD/YYYY',
    'time_format', '12h'
  ),
  UNIQUE(name),
  CONSTRAINT organizations_owner_fk FOREIGN KEY (owner_id) 
    REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "View organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_roles
      WHERE organization_id = organizations.id
      AND user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND system_role = 'dev'
    )
  );

CREATE POLICY "Manage organizations"
  ON organizations FOR ALL
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND system_role = 'dev'
    )
  );

-- Recreate Memphis Fire BBQ organization
DO $$
DECLARE
  steve_id uuid;
BEGIN
  -- Get Steve's user ID
  SELECT id INTO steve_id
  FROM auth.users
  WHERE email = 'office@memphisfirebbq.com';

  IF steve_id IS NOT NULL THEN
    INSERT INTO organizations (
      id,
      name,
      legal_name,
      tax_id,
      website,
      contact_email,
      contact_phone,
      owner_id,
      settings
    )
    VALUES (
      'c1e1f1b1-1e1e-1e1e-1e1e-1e1e1e1e1e1e',
      'Memphis Fire Barbeque Company Inc.',
      'Memphis Fire Barbeque Company Inc.',
      null,
      null,
      'office@memphisfirebbq.com',
      null,
      steve_id,
      jsonb_build_object(
        'business_type', 'restaurant',
        'cuisine_type', 'BBQ',
        'default_timezone', 'America/Toronto',
        'multi_unit', false,
        'currency', 'CAD',
        'date_format', 'MM/DD/YYYY',
        'time_format', '12h',
        'operating_schedule', jsonb_build_object(
          'Monday', jsonb_build_array(
            jsonb_build_object('open', '11:00', 'close', '20:00')
          ),
          'Tuesday', jsonb_build_array(
            jsonb_build_object('open', '11:00', 'close', '20:00')
          ),
          'Wednesday', jsonb_build_array(
            jsonb_build_object('open', '11:00', 'close', '20:00')
          ),
          'Thursday', jsonb_build_array(
            jsonb_build_object('open', '11:00', 'close', '20:00')
          ),
          'Friday', jsonb_build_array(
            jsonb_build_object('open', '11:00', 'close', '21:00')
          ),
          'Saturday', jsonb_build_array(
            jsonb_build_object('open', '11:00', 'close', '21:00')
          ),
          'Sunday', jsonb_build_array(
            jsonb_build_object('open', '11:00', 'close', '20:00')
          )
        )
      )
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      name = EXCLUDED.name,
      legal_name = EXCLUDED.legal_name,
      tax_id = EXCLUDED.tax_id,
      website = EXCLUDED.website,
      contact_email = EXCLUDED.contact_email,
      contact_phone = EXCLUDED.contact_phone,
      owner_id = EXCLUDED.owner_id,
      settings = EXCLUDED.settings,
      updated_at = CURRENT_TIMESTAMP;
  END IF;
END $$;