import type { ExcelColumn } from '@/types';

// Core required columns for master ingredients import
export const CORE_COLUMNS: ExcelColumn[] = [
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
  { key: 'storage_area', name: 'Storage Area', type: 'text', width: 120, required: true },
  { key: 'image_url', name: 'Image URL', type: 'text', width: 200, required: false }
];

// Allergen columns
export const ALLERGEN_COLUMNS: ExcelColumn[] = [
  { key: 'allergen_peanut', name: 'Peanut', type: 'boolean', width: 80 },
  { key: 'allergen_crustacean', name: 'Crustacean', type: 'boolean', width: 80 },
  { key: 'allergen_treenut', name: 'Tree Nut', type: 'boolean', width: 80 },
  { key: 'allergen_shellfish', name: 'Shellfish', type: 'boolean', width: 80 },
  { key: 'allergen_sesame', name: 'Sesame', type: 'boolean', width: 80 },
  { key: 'allergen_soy', name: 'Soy', type: 'boolean', width: 80 },
  { key: 'allergen_fish', name: 'Fish', type: 'boolean', width: 80 },
  { key: 'allergen_wheat', name: 'Wheat', type: 'boolean', width: 80 },
  { key: 'allergen_milk', name: 'Milk', type: 'boolean', width: 80 },
  { key: 'allergen_sulphite', name: 'Sulphite', type: 'boolean', width: 80 },
  { key: 'allergen_egg', name: 'Egg', type: 'boolean', width: 80 },
  { key: 'allergen_gluten', name: 'Gluten', type: 'boolean', width: 80 },
  { key: 'allergen_mustard', name: 'Mustard', type: 'boolean', width: 80 },
  { key: 'allergen_celery', name: 'Celery', type: 'boolean', width: 80 },
  { key: 'allergen_garlic', name: 'Garlic', type: 'boolean', width: 80 },
  { key: 'allergen_onion', name: 'Onion', type: 'boolean', width: 80 },
  { key: 'allergen_nitrite', name: 'Nitrite', type: 'boolean', width: 80 },
  { key: 'allergen_mushroom', name: 'Mushroom', type: 'boolean', width: 80 },
  { key: 'allergen_hot_pepper', name: 'Hot Pepper', type: 'boolean', width: 80 },
  { key: 'allergen_citrus', name: 'Citrus', type: 'boolean', width: 80 },
  { key: 'allergen_pork', name: 'Pork', type: 'boolean', width: 80 }
];

// Custom allergen columns
export const CUSTOM_ALLERGEN_COLUMNS: ExcelColumn[] = [
  { key: 'allergen_custom1_name', name: 'Custom Allergen 1 Name', type: 'text', width: 150 },
  { key: 'allergen_custom1_active', name: 'Custom Allergen 1 Active', type: 'boolean', width: 80 },
  { key: 'allergen_custom2_name', name: 'Custom Allergen 2 Name', type: 'text', width: 150 },
  { key: 'allergen_custom2_active', name: 'Custom Allergen 2 Active', type: 'boolean', width: 80 },
  { key: 'allergen_custom3_name', name: 'Custom Allergen 3 Name', type: 'text', width: 150 },
  { key: 'allergen_custom3_active', name: 'Custom Allergen 3 Active', type: 'boolean', width: 80 },
  { key: 'allergen_notes', name: 'Allergen Notes', type: 'text', width: 200 }
];

// All columns combined for display
export const ALL_COLUMNS: ExcelColumn[] = [
  ...CORE_COLUMNS,
  ...ALLERGEN_COLUMNS,
  ...CUSTOM_ALLERGEN_COLUMNS
];

// Excel column name to database field mapping
export const COLUMN_MAPPING: Record<string, string> = {
  'Item Code': 'item_code',
  'Product Name': 'product',
  'Major Group': 'major_group',
  'Category': 'category', 
  'Sub-Category': 'sub_category',
  'Vendor': 'vendor',
  'Case Size': 'case_size',
  'Units/Case': 'units_per_case',
  'Case Price': 'current_price',
  'Unit of Measure': 'unit_of_measure',
  'Recipe Units/Case': 'recipe_unit_per_purchase_unit',
  'Recipe Unit Type': 'recipe_unit_type',
  'Yield %': 'yield_percent',
  'Storage Area': 'storage_area',
  'Image URL': 'image_url',
  'Peanut': 'allergen_peanut',
  'Crustacean': 'allergen_crustacean',
  'Tree Nut': 'allergen_treenut',
  'Shellfish': 'allergen_shellfish',
  'Sesame': 'allergen_sesame',
  'Soy': 'allergen_soy',
  'Fish': 'allergen_fish',
  'Wheat': 'allergen_wheat',
  'Milk': 'allergen_milk',
  'Sulphite': 'allergen_sulphite',
  'Egg': 'allergen_egg',
  'Gluten': 'allergen_gluten',
  'Mustard': 'allergen_mustard',
  'Celery': 'allergen_celery',
  'Garlic': 'allergen_garlic',
  'Onion': 'allergen_onion',
  'Nitrite': 'allergen_nitrite',
  'Mushroom': 'allergen_mushroom',
  'Hot Pepper': 'allergen_hot_pepper',
  'Citrus': 'allergen_citrus',
  'Pork': 'allergen_pork',
  'Custom Allergen 1 Name': 'allergen_custom1_name',
  'Custom Allergen 1 Active': 'allergen_custom1_active',
  'Custom Allergen 2 Name': 'allergen_custom2_name',
  'Custom Allergen 2 Active': 'allergen_custom2_active',
  'Custom Allergen 3 Name': 'allergen_custom3_name',
  'Custom Allergen 3 Active': 'allergen_custom3_active',
  'Allergen Notes': 'allergen_notes'
};