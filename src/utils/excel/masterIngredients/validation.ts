import { type MasterIngredient } from '@/types/master-ingredient';
import { supabase } from '@/lib/supabase';
import { COLUMN_MAPPING } from './columns';

interface CategoryMapping {
  id: string;
  name: string;
}

interface CategoryMappings {
  majorGroups: Map<string, string>;
  categories: Map<string, string>;
  subCategories: Map<string, string>;
}

async function getCategoryMappings(organizationId: string): Promise<CategoryMappings> {
  // Get all category data
  const { data: groups } = await supabase
    .from('food_category_groups')
    .select('id, name')
    .eq('organization_id', organizationId);

  const { data: categories } = await supabase
    .from('food_categories')
    .select('id, name')
    .eq('organization_id', organizationId);

  const { data: subCategories } = await supabase
    .from('food_sub_categories')
    .select('id, name')
    .eq('organization_id', organizationId);

  // Create lookup maps
  return {
    majorGroups: new Map((groups || []).map(g => [g.name.toLowerCase(), g.id])),
    categories: new Map((categories || []).map(c => [c.name.toLowerCase(), c.id])),
    subCategories: new Map((subCategories || []).map(s => [s.name.toLowerCase(), s.id]))
  };
}

export async function validateMasterIngredients(data: any[], organizationId: string): Promise<Omit<MasterIngredient, 'id'> & { organization_id: string }[]> {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: Expected an array');
  }

  const firstRow = data[0];
  if (!firstRow || typeof firstRow !== 'object') {
    throw new Error('Invalid data format: No valid rows found');
  }

  // Validate required columns exist
  const missingColumns = Object.keys(COLUMN_MAPPING).filter(col => 
    !(col in firstRow) && COLUMN_MAPPING[col].required
  );

  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  // Get category mappings
  const mappings = await getCategoryMappings(organizationId);

  // Track unique item codes to prevent duplicates
  const seenItemCodes = new Set<string>();

  return data
    .filter(row => {
      const productName = row['Product Name']?.toString().trim();
      const itemCode = row['Item Code']?.toString().trim();
      
      // Skip invalid rows
      if (!productName || !itemCode || productName === '0' || itemCode === '0') {
        return false;
      }

      // Skip duplicate item codes
      if (seenItemCodes.has(itemCode)) {
        console.warn(`Skipping duplicate item code: ${itemCode}`);
        return false;
      }

      seenItemCodes.add(itemCode);
      return true;
    })
    .map(row => {
      // Get UUIDs for categories
      const majorGroupName = row['Major Group']?.toString().trim().toLowerCase();
      const categoryName = row['Category']?.toString().trim().toLowerCase();
      const subCategoryName = row['Sub-Category']?.toString().trim().toLowerCase();

      const majorGroupId = majorGroupName ? mappings.majorGroups.get(majorGroupName) : null;
      const categoryId = categoryName ? mappings.categories.get(categoryName) : null;
      const subCategoryId = subCategoryName ? mappings.subCategories.get(subCategoryName) : null;

      // Initialize base object with required fields
      const mappedData: Record<string, any> = {
        organization_id: organizationId,
        updated_at: new Date().toISOString(),
        item_code: row['Item Code']?.toString().trim(),
        product: row['Product Name']?.toString().trim(),
        major_group: majorGroupId || null,
        category: categoryId || null,
        sub_category: subCategoryId || null,
        vendor: row['Vendor']?.toString().trim(),
        case_size: row['Case Size']?.toString().trim(),
        units_per_case: row['Units/Case']?.toString().trim(),
        current_price: parseFloat(row['Case Price']?.toString().replace(/[$,]/g, '') || '0'),
        unit_of_measure: row['Unit of Measure']?.toString().trim(),
        recipe_unit_per_purchase_unit: parseFloat(row['Recipe Units/Case']?.toString() || '0'),
        recipe_unit_type: row['Recipe Unit Type']?.toString().trim(),
        yield_percent: parseFloat(row['Yield %']?.toString().replace(/%/g, '') || '100'),
        storage_area: row['Storage Area']?.toString().trim(),
        image_url: row['Image URL']?.toString().trim() || null,

        // Allergens
        allergen_peanut: row['Peanut'] === '1' || row['Peanut'] === 'true',
        allergen_crustacean: row['Crustacean'] === '1' || row['Crustacean'] === 'true',
        allergen_treenut: row['Tree Nut'] === '1' || row['Tree Nut'] === 'true',
        allergen_shellfish: row['Shellfish'] === '1' || row['Shellfish'] === 'true',
        allergen_sesame: row['Sesame'] === '1' || row['Sesame'] === 'true',
        allergen_soy: row['Soy'] === '1' || row['Soy'] === 'true',
        allergen_fish: row['Fish'] === '1' || row['Fish'] === 'true',
        allergen_wheat: row['Wheat'] === '1' || row['Wheat'] === 'true',
        allergen_milk: row['Milk'] === '1' || row['Milk'] === 'true',
        allergen_sulphite: row['Sulphite'] === '1' || row['Sulphite'] === 'true',
        allergen_egg: row['Egg'] === '1' || row['Egg'] === 'true',
        allergen_gluten: row['Gluten'] === '1' || row['Gluten'] === 'true',
        allergen_mustard: row['Mustard'] === '1' || row['Mustard'] === 'true',
        allergen_celery: row['Celery'] === '1' || row['Celery'] === 'true',
        allergen_garlic: row['Garlic'] === '1' || row['Garlic'] === 'true',
        allergen_onion: row['Onion'] === '1' || row['Onion'] === 'true',
        allergen_nitrite: row['Nitrite'] === '1' || row['Nitrite'] === 'true',
        allergen_mushroom: row['Mushroom'] === '1' || row['Mushroom'] === 'true',
        allergen_hot_pepper: row['Hot Pepper'] === '1' || row['Hot Pepper'] === 'true',
        allergen_citrus: row['Citrus'] === '1' || row['Citrus'] === 'true',
        allergen_pork: row['Pork'] === '1' || row['Pork'] === 'true',

        // Custom allergens
        allergen_custom1_name: row['Custom Allergen 1 Name']?.toString().trim() || null,
        allergen_custom1_active: row['Custom Allergen 1 Active'] === '1' || row['Custom Allergen 1 Active'] === 'true',
        allergen_custom2_name: row['Custom Allergen 2 Name']?.toString().trim() || null,
        allergen_custom2_active: row['Custom Allergen 2 Active'] === '1' || row['Custom Allergen 2 Active'] === 'true',
        allergen_custom3_name: row['Custom Allergen 3 Name']?.toString().trim() || null,
        allergen_custom3_active: row['Custom Allergen 3 Active'] === '1' || row['Custom Allergen 3 Active'] === 'true',
        allergen_notes: row['Allergen Notes']?.toString().trim() || null
      };

      return mappedData;
    });
}