// Core required columns for master ingredients import
export const CORE_COLUMNS = {
  // Identification
  'Item Code': { 
    dbColumn: 'item_code',
    description: 'Unique identifier/vendor code',
    required: true
  },
  'Product Name': {
    dbColumn: 'product',
    description: 'Common name of the ingredient',
    required: true
  },

  // Classification
  'Major Group': {
    dbColumn: 'major_group',
    description: 'Top-level category group',
    required: true
  },
  'Category': {
    dbColumn: 'category',
    description: 'Category within major group',
    required: true
  },
  'Sub-Category': {
    dbColumn: 'sub_category',
    description: 'Sub-category within category',
    required: true
  },

  // Purchasing Info
  'Vendor': {
    dbColumn: 'vendor',
    description: 'Supplier name',
    required: true
  },
  'Case Size': {
    dbColumn: 'case_size',
    description: 'Size of purchase unit (e.g. 6x1kg)',
    required: true
  },
  'Units/Case': {
    dbColumn: 'units_per_case',
    description: 'Number of units per case',
    required: true
  },
  'Case Price': {
    dbColumn: 'current_price',
    description: 'Current price per case',
    required: true,
    type: 'currency'
  },

  // Units & Measurements  
  'Unit of Measure': {
    dbColumn: 'unit_of_measure',
    description: 'Base unit for inventory',
    required: true
  },
  'Recipe Units/Case': {
    dbColumn: 'recipe_unit_per_purchase_unit',
    description: 'Number of recipe units per case',
    required: true,
    type: 'number'
  },
  'Recipe Unit Type': {
    dbColumn: 'recipe_unit_type',
    description: 'Unit used in recipes',
    required: true
  },
  'Yield %': {
    dbColumn: 'yield_percent',
    description: 'Usable percentage after waste',
    required: true,
    type: 'percent'
  },

  // Storage & Image
  'Storage Area': {
    dbColumn: 'storage_area',
    description: 'Default storage location',
    required: true
  },
  'Image URL': {
    dbColumn: 'image_url',
    description: 'URL to product image',
    required: false
  }
} as const;

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

// Custom allergen fields with validation
export const CUSTOM_ALLERGEN_COLUMNS = {
  'Custom Allergen 1 Name': {
    dbColumn: 'allergen_custom1_name',
    required: false
  },
  'Custom Allergen 1 Active': {
    dbColumn: 'allergen_custom1_active',
    required: false,
    type: 'boolean'
  },
  'Custom Allergen 2 Name': {
    dbColumn: 'allergen_custom2_name',
    required: false
  },
  'Custom Allergen 2 Active': {
    dbColumn: 'allergen_custom2_active',
    required: false,
    type: 'boolean'
  },
  'Custom Allergen 3 Name': {
    dbColumn: 'allergen_custom3_name',
    required: false
  },
  'Custom Allergen 3 Active': {
    dbColumn: 'allergen_custom3_active',
    required: false,
    type: 'boolean'
  },
  'Allergen Notes': {
    dbColumn: 'allergen_notes',
    required: false
  }
} as const;