-- Drop existing view if it exists
DROP VIEW IF EXISTS master_ingredients_with_categories;
DROP VIEW IF EXISTS master_ingredients_with_groups;

-- Drop existing policies
DROP POLICY IF EXISTS "View master ingredients" ON master_ingredients;
DROP POLICY IF EXISTS "Manage master ingredients" ON master_ingredients;

-- Create new simplified policies
CREATE POLICY "View master ingredients"
  ON master_ingredients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_roles
      WHERE organization_id = master_ingredients.organization_id
      AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'dev'
    )
  );

CREATE POLICY "Manage master ingredients"
  ON master_ingredients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_roles
      WHERE organization_id = master_ingredients.organization_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'dev'
    )
  );

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_master_ingredients_org_id 
ON master_ingredients(organization_id);

CREATE INDEX IF NOT EXISTS idx_master_ingredients_item_code 
ON master_ingredients(item_code);

CREATE INDEX IF NOT EXISTS idx_master_ingredients_major_group 
ON master_ingredients(major_group);

CREATE INDEX IF NOT EXISTS idx_master_ingredients_category 
ON master_ingredients(category);

CREATE INDEX IF NOT EXISTS idx_master_ingredients_sub_category 
ON master_ingredients(sub_category);

-- Add helpful comments
COMMENT ON TABLE master_ingredients IS 'Stores master ingredient data including allergen information';
COMMENT ON COLUMN master_ingredients.item_code IS 'Unique identifier for the ingredient within an organization';
COMMENT ON COLUMN master_ingredients.organization_id IS 'Reference to owning organization';