-- Drop existing policies
DROP POLICY IF EXISTS "View master ingredients" ON master_ingredients;
DROP POLICY IF EXISTS "Manage master ingredients" ON master_ingredients;

-- Create new scoped policies
CREATE POLICY "View master ingredients"
  ON master_ingredients FOR SELECT
  TO authenticated
  USING (
    -- Users can only view ingredients in their organization
    EXISTS (
      SELECT 1 FROM organization_roles
      WHERE organization_id = master_ingredients.organization_id
      AND user_id = auth.uid()
    )
    OR
    -- Devs can view all ingredients
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'dev'
    )
  );

CREATE POLICY "Manage master ingredients"
  ON master_ingredients FOR ALL
  TO authenticated
  USING (
    -- Organization admins can manage their ingredients
    EXISTS (
      SELECT 1 FROM organization_roles
      WHERE organization_id = master_ingredients.organization_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
    OR
    -- Devs can manage all ingredients
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'dev'
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_master_ingredients_org_id 
ON master_ingredients(organization_id);

-- Add helpful comments
COMMENT ON POLICY "View master ingredients" ON master_ingredients IS 
'Allow users to view ingredients only in their organization, with full access for devs';

COMMENT ON POLICY "Manage master ingredients" ON master_ingredients IS 
'Allow organization admins to manage their ingredients, with full access for devs';