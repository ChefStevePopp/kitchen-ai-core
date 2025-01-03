-- Drop existing policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "View organizations" ON organizations;
  DROP POLICY IF EXISTS "Manage organizations" ON organizations;
  DROP POLICY IF EXISTS "View organization roles" ON organization_roles;
  DROP POLICY IF EXISTS "Manage organization roles" ON organization_roles;
END $$;

-- Create new simplified policies
CREATE POLICY "View organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Manage organizations"
  ON organizations FOR ALL
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' IN ('dev', 'owner')
    )
  );

CREATE POLICY "View organization roles"
  ON organization_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Manage organization roles"
  ON organization_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organizations o
      WHERE o.id = organization_roles.organization_id
      AND (
        o.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM auth.users
          WHERE id = auth.uid()
          AND raw_user_meta_data->>'role' = 'dev'
        )
      )
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON auth.users USING gin ((raw_user_meta_data->'role'));
CREATE INDEX IF NOT EXISTS idx_users_org_id ON auth.users USING gin ((raw_user_meta_data->'organizationId'));

-- Add helpful comments
COMMENT ON POLICY "View organizations" ON organizations IS 
'Allow all authenticated users to view organizations';

COMMENT ON POLICY "Manage organizations" ON organizations IS 
'Allow organization owners and devs to manage organizations';

COMMENT ON POLICY "View organization roles" ON organization_roles IS 
'Allow all authenticated users to view organization roles';

COMMENT ON POLICY "Manage organization roles" ON organization_roles IS 
'Allow organization owners and devs to manage organization roles';