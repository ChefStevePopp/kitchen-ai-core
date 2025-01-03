-- Add unique constraint to master_ingredients
ALTER TABLE master_ingredients
ADD CONSTRAINT master_ingredients_id_org_unique 
UNIQUE (id, organization_id);

-- Add comment explaining the constraint
COMMENT ON CONSTRAINT master_ingredients_id_org_unique 
ON master_ingredients 
IS 'Ensures unique combination of id and organization_id for foreign key references';

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_master_ingredients_id_org 
ON master_ingredients(id, organization_id);