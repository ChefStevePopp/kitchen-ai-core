// Core required columns for master ingredients import
export const MASTER_INGREDIENT_COLUMNS = [
  // Core fields
  { name: 'Item Code', key: 'item_code', required: true, type: 'text', width: 120 },
  { name: 'Product Name', key: 'product', required: true, type: 'text', width: 200 },
  { name: 'Major Group', key: 'major_group', required: true, type: 'text', width: 120 },
  { name: 'Category', key: 'category', required: true, type: 'text', width: 120 },
  { name: 'Sub-Category', key: 'sub_category', required: true, type: 'text', width: 120 },
  { name: 'Vendor', key: 'vendor', required: true, type: 'text', width: 120 },
  { name: 'Case Size', key: 'case_size', required: true, type: 'text', width: 100 },
  { name: 'Units/Case', key: 'units_per_case', required: true, type: 'text', width: 100 },
  { name: 'Case Price', key: 'current_price', required: true, type: 'currency', width: 100 },
  { name: 'Unit of Measure', key: 'unit_of_measure', required: true, type: 'text', width: 120 },
  { name: 'Recipe Units/Case', key: 'recipe_unit_per_purchase_unit', required: true, type: 'number', width: 120 },
  { name: 'Recipe Unit Type', key: 'recipe_unit_type', required: true, type: 'text', width: 120 },
  { name: 'Yield %', key: 'yield_percent', required: true, type: 'percent', width: 80 },
  { name: 'Storage Area', key: 'storage_area', required: true, type: 'text', width: 120 },
  { name: 'Image URL', key: 'image_url', required: false, type: 'text', width: 200 }
] as const;

// Allergen columns with validation rules
export const ALLERGEN_COLUMNS = {
  'Peanut': { key: 'allergen_peanut', width: 80, severity: 'high' },
  'Crustacean': { key: 'allergen_crustacean', width: 80, severity: 'high' },
  'Tree Nut': { key: 'allergen_treenut', width: 80, severity: 'high' },
  'Shellfish': { key: 'allergen_shellfish', width: 80, severity: 'high' },
  'Sesame': { key: 'allergen_sesame', width: 80, severity: 'high' },
  'Soy': { key: 'allergen_soy', width: 80, severity: 'medium' },
  'Fish': { key: 'allergen_fish', width: 80, severity: 'high' },
  'Wheat': { key: 'allergen_wheat', width: 80, severity: 'medium' },
  'Milk': { key: 'allergen_milk', width: 80, severity: 'medium' },
  'Sulphite': { key: 'allergen_sulphite', width: 80, severity: 'medium' },
  'Egg': { key: 'allergen_egg', width: 80, severity: 'medium' },
  'Gluten': { key: 'allergen_gluten', width: 80, severity: 'medium' },
  'Mustard': { key: 'allergen_mustard', width: 80, severity: 'medium' },
  'Celery': { key: 'allergen_celery', width: 80, severity: 'low' },
  'Garlic': { key: 'allergen_garlic', width: 80, severity: 'low' },
  'Onion': { key: 'allergen_onion', width: 80, severity: 'low' },
  'Nitrite': { key: 'allergen_nitrite', width: 80, severity: 'low' },
  'Mushroom': { key: 'allergen_mushroom', width: 80, severity: 'low' },
  'Hot Pepper': { key: 'allergen_hot_pepper', width: 80, severity: 'low' },
  'Citrus': { key: 'allergen_citrus', width: 80, severity: 'low' },
  'Pork': { key: 'allergen_pork', width: 80, severity: 'medium' }
} as const;

// Custom allergen fields with validation
export const CUSTOM_ALLERGEN_COLUMNS = {
  'Custom Allergen 1 Name': { key: 'allergen_custom1_name', width: 150 },
  'Custom Allergen 1 Active': { key: 'allergen_custom1_active', width: 80 },
  'Custom Allergen 2 Name': { key: 'allergen_custom2_name', width: 150 },
  'Custom Allergen 2 Active': { key: 'allergen_custom2_active', width: 80 },
  'Custom Allergen 3 Name': { key: 'allergen_custom3_name', width: 150 },
  'Custom Allergen 3 Active': { key: 'allergen_custom3_active', width: 80 },
  'Allergen Notes': { key: 'allergen_notes', width: 200 }
} as const;

// Helper to get all columns for grid display
export const getAllColumns = () => [
  ...MASTER_INGREDIENT_COLUMNS,
  ...Object.entries(ALLERGEN_COLUMNS).map(([name, config]) => ({
    name,
    key: config.key,
    type: 'boolean' as const,
    width: config.width
  })),
  ...Object.entries(CUSTOM_ALLERGEN_COLUMNS).map(([name, config]) => ({
    name,
    key: config.key,
    type: name.includes('Active') ? 'boolean' as const : 'text' as const,
    width: config.width
  }))
];