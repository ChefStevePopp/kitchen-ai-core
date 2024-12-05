-- Drop existing policies
DROP POLICY IF EXISTS "View master ingredients" ON master_ingredients;
DROP POLICY IF EXISTS "Manage master ingredients" ON master_ingredients;

-- Create new simplified policies
CREATE POLICY "View master ingredients"
  ON master_ingredients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Manage master ingredients"
  ON master_ingredients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND (
        -- Check if user is dev
        u.raw_user_meta_data->>'role' = 'dev'
        OR
        -- Check if user owns this organization
        EXISTS (
          SELECT 1 FROM organizations o
          WHERE o.id = master_ingredients.organization_id
          AND o.owner_id = u.id
        )
        OR
        -- Check organization ID in metadata
        u.raw_user_meta_data->>'organizationId' = master_ingredients.organization_id::text
      )
    )
  );

-- Add helpful comments
COMMENT ON POLICY "View master ingredients" ON master_ingredients IS 
'Allow all authenticated users to view master ingredients';

COMMENT ON POLICY "Manage master ingredients" ON master_ingredients IS 
'Allow organization owners and devs to manage master ingredients';