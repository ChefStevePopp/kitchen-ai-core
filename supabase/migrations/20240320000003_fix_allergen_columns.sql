-- Drop and recreate master_ingredients table with proper allergen columns
DROP TABLE IF EXISTS master_ingredients CASCADE;

CREATE TABLE master_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  item_code TEXT NOT NULL,
  major_group UUID,
  category UUID,
  sub_category UUID,
  product TEXT NOT NULL,
  vendor TEXT NOT NULL,
  case_size TEXT,
  units_per_case TEXT,
  current_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit_of_measure TEXT NOT NULL,
  recipe_unit_per_purchase_unit DECIMAL(10,3) NOT NULL DEFAULT 0,
  recipe_unit_type TEXT,
  yield_percent DECIMAL(5,2) NOT NULL DEFAULT 100,
  cost_per_recipe_unit DECIMAL(10,4) NOT NULL DEFAULT 0,
  image_url TEXT,
  storage_area TEXT,
  
  -- Allergen columns with consistent naming
  allergen_peanut BOOLEAN NOT NULL DEFAULT false,
  allergen_crustacean BOOLEAN NOT NULL DEFAULT false,
  allergen_treenut BOOLEAN NOT NULL DEFAULT false,
  allergen_shellfish BOOLEAN NOT NULL DEFAULT false,
  allergen_sesame BOOLEAN NOT NULL DEFAULT false,
  allergen_soy BOOLEAN NOT NULL DEFAULT false,
  allergen_fish BOOLEAN NOT NULL DEFAULT false,
  allergen_wheat BOOLEAN NOT NULL DEFAULT false,
  allergen_milk BOOLEAN NOT NULL DEFAULT false,
  allergen_sulphite BOOLEAN NOT NULL DEFAULT false,
  allergen_egg BOOLEAN NOT NULL DEFAULT false,
  allergen_gluten BOOLEAN NOT NULL DEFAULT false,
  allergen_mustard BOOLEAN NOT NULL DEFAULT false,
  allergen_celery BOOLEAN NOT NULL DEFAULT false,
  allergen_garlic BOOLEAN NOT NULL DEFAULT false,
  allergen_onion BOOLEAN NOT NULL DEFAULT false,
  allergen_nitrite BOOLEAN NOT NULL DEFAULT false,
  allergen_mushroom BOOLEAN NOT NULL DEFAULT false,
  allergen_hot_pepper BOOLEAN NOT NULL DEFAULT false, -- Fixed column name
  allergen_citrus BOOLEAN NOT NULL DEFAULT false,
  allergen_pork BOOLEAN NOT NULL DEFAULT false,
  
  -- Custom allergen fields
  allergen_custom1_name TEXT,
  allergen_custom1_active BOOLEAN DEFAULT false,
  allergen_custom2_name TEXT,
  allergen_custom2_active BOOLEAN DEFAULT false,
  allergen_custom3_name TEXT,
  allergen_custom3_active BOOLEAN DEFAULT false,
  allergen_notes TEXT,

  -- Constraints
  UNIQUE(organization_id, item_code),
  FOREIGN KEY (major_group, organization_id) REFERENCES food_category_groups(id, organization_id) ON DELETE SET NULL,
  FOREIGN KEY (category, organization_id) REFERENCES food_categories(id, organization_id) ON DELETE SET NULL,
  FOREIGN KEY (sub_category, organization_id) REFERENCES food_sub_categories(id, organization_id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE master_ingredients ENABLE ROW LEVEL SECURITY;

-- Add helpful comments
COMMENT ON TABLE master_ingredients IS 'Stores master ingredient data including allergen information';
COMMENT ON COLUMN master_ingredients.allergen_hot_pepper IS 'Indicates if ingredient contains hot peppers';