import { type MasterIngredient } from '@/types/master-ingredient';

// Core required columns for master ingredients import
export const MASTER_INGREDIENT_COLUMNS = [
  { key: 'item_code', name: 'Item Code', type: 'text', width: 120, required: true },
  { key: 'product', name: 'Product Name', type: 'text', width: 200, required: true },
  { key: 'major_group', name: 'Major Group', type: 'text', width: 120, required: true },
  { key: 'category', name: 'Category', type: 'text', width: 120, required: true },
  { key: 'sub_category', name: 'Sub-Category', type: 'text', width: 120, required: true },
  { key: 'vendor', name: 'Vendor', type: 'text', width: 120, required: true },
  { key: 'case_size', name: 'Case Size', type: 'text', width: 100, required: true },
  { key: 'units_per_case', name: 'Units/Case', type: 'text', width: 100, required: true },
  { key: 'current_price', name: 'Case Price', type: 'currency', width: 100, required: true },
  { key: 'unit_of_measure', name: 'Unit of Measure', type: 'text', width: 120, required: true },
  { key: 'recipe_unit_per_purchase_unit', name: 'Recipe Units/Case', type: 'number', width: 120, required: true },
  { key: 'recipe_unit_type', name: 'Recipe Unit Type', type: 'text', width: 120, required: true },
  { key: 'yield_percent', name: 'Yield %', type: 'percent', width: 80, required: true },
  { key: 'storage_area', name: 'Storage Area', type: 'text', width: 120, required: true }
];

// Allergen columns with validation rules
export const ALLERGEN_COLUMNS = {
  'Peanut': { dbColumn: 'allergen_peanut', severity: 'high' },
  'Crustacean': { dbColumn: 'allergen_crustacean', severity: 'high' },
  'Tree Nut': { dbColumn: 'allergen_treenut', severity: 'high' },
  'Shellfish': { dbColumn: 'allergen_shellfish', severity: 'high' },
  'Sesame': { dbColumn: 'allergen_sesame', severity: 'high' },
  'Soy': { dbColumn: 'allergen_soy', severity: 'medium' },
  'Fish': { dbColumn: 'allergen_fish', severity: 'high' },
  'Wheat': { dbColumn: 'allergen_wheat', severity: 'medium' },
  'Milk': { dbColumn: 'allergen_milk', severity: 'medium' },
  'Sulphite': { dbColumn: 'allergen_sulphite', severity: 'medium' },
  'Egg': { dbColumn: 'allergen_egg', severity: 'medium' },
  'Gluten': { dbColumn: 'allergen_gluten', severity: 'medium' },
  'Mustard': { dbColumn: 'allergen_mustard', severity: 'medium' },
  'Celery': { dbColumn: 'allergen_celery', severity: 'low' },
  'Garlic': { dbColumn: 'allergen_garlic', severity: 'low' },
  'Onion': { dbColumn: 'allergen_onion', severity: 'low' },
  'Nitrite': { dbColumn: 'allergen_nitrite', severity: 'low' },
  'Mushroom': { dbColumn: 'allergen_mushroom', severity: 'low' },
  'Hot Pepper': { dbColumn: 'allergen_hot_pepper', severity: 'low' },
  'Citrus': { dbColumn: 'allergen_citrus', severity: 'low' },
  'Pork': { dbColumn: 'allergen_pork', severity: 'medium' }
} as const;

export async function validateMasterIngredients(data: any[], organizationId: string): Promise<Omit<MasterIngredient, 'id'> & { organization_id: string }[]> {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: Expected an array');
  }

  const firstRow = data[0];
  if (!firstRow || typeof firstRow !== 'object') {
    throw new Error('Invalid data format: No valid rows found');
  }

  // Check for missing required columns
  const missingColumns = MASTER_INGREDIENT_COLUMNS
    .filter(col => col.required && !(col.name in firstRow))
    .map(col => col.name);

  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  return data
    .filter(row => {
      const productName = row['Product Name']?.toString().trim();
      const itemCode = row['Item Code']?.toString().trim();
      return productName && itemCode && productName !== '0' && itemCode !== '0';
    })
    .map(row => {
      // Process allergens
      const allergens = Object.entries(ALLERGEN_COLUMNS).reduce((acc, [excelName, config]) => {
        const value = row[excelName]?.toString().trim();
        acc[config.dbColumn] = value === '1' || value === 'true';
        return acc;
      }, {} as Record<string, boolean>);

      return {
        organization_id: organizationId,
        item_code: row['Item Code']?.toString().trim() || '',
        major_group: row['Major Group']?.toString().trim() || null,
        category: row['Category']?.toString().trim() || null,
        sub_category: row['Sub-Category']?.toString().trim() || null,
        product: row['Product Name']?.toString().trim() || '',
        vendor: row['Vendor']?.toString().trim() || '',
        case_size: row['Case Size']?.toString().trim() || '',
        units_per_case: row['Units/Case']?.toString().trim() || '',
        current_price: parseFloat(row['Case Price']?.toString().replace(/[$,]/g, '') || '0'),
        unit_of_measure: row['Unit of Measure']?.toString().trim() || '',
        recipe_unit_per_purchase_unit: parseFloat(row['Recipe Units/Case']?.toString() || '0'),
        recipe_unit_type: row['Recipe Unit Type']?.toString().trim() || '',
        yield_percent: parseFloat(row['Yield %']?.toString().replace(/%/g, '') || '100'),
        storage_area: row['Storage Area']?.toString().trim() || '',
        ...allergens,
        allergen_custom1_name: '',
        allergen_custom1_active: false,
        allergen_custom2_name: '',
        allergen_custom2_active: false,
        allergen_custom3_name: '',
        allergen_custom3_active: false,
        allergen_notes: '',
        updated_at: new Date().toISOString()
      };
    });
}