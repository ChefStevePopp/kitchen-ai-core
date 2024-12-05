import { utils, writeFile } from 'xlsx';
import { MASTER_INGREDIENT_COLUMNS } from './masterIngredients';

export function generateMasterIngredientsTemplate() {
  // Create headers with exact required names
  const headers = [
    // Core fields
    'Item Code',
    'Product Name',
    'Major Group',
    'Category',
    'Sub-Category',
    'Vendor',
    'Case Size',
    'Units/Case',
    'Case Price',
    'Unit of Measure',
    'Recipe Units/Case',
    'Recipe Unit Type',
    'Yield %',
    'Storage Area',
    'Image URL',

    // Standard allergens
    'Peanut',
    'Crustacean',
    'Tree Nut',
    'Shellfish',
    'Sesame',
    'Soy',
    'Fish',
    'Wheat',
    'Milk',
    'Sulphite',
    'Egg',
    'Gluten',
    'Mustard',
    'Celery',
    'Garlic',
    'Onion',
    'Nitrite',
    'Mushroom',
    'Hot Pepper',
    'Citrus',
    'Pork',

    // Custom allergen fields
    'Custom Allergen 1 Name',
    'Custom Allergen 1 Active',
    'Custom Allergen 2 Name',
    'Custom Allergen 2 Active',
    'Custom Allergen 3 Name',
    'Custom Allergen 3 Active',
    'Allergen Notes'
  ];

  // Create example data
  const exampleData = [
    {
      'Item Code': 'BEEF-001',
      'Product Name': 'Beef Brisket',
      'Major Group': 'Food',
      'Category': 'Proteins',
      'Sub-Category': 'Beef',
      'Vendor': 'US Foods',
      'Case Size': '2x5kg',
      'Units/Case': '2',
      'Case Price': '125.99',
      'Unit of Measure': 'kg',
      'Recipe Units/Case': '10',
      'Recipe Unit Type': 'portion',
      'Yield %': '85',
      'Storage Area': 'Walk-in Cooler',
      'Image URL': 'https://images.unsplash.com/photo-1588347818036-558601350947',
      // Allergens
      'Peanut': '0',
      'Crustacean': '0',
      'Tree Nut': '0',
      'Shellfish': '0',
      'Sesame': '0',
      'Soy': '0',
      'Fish': '0',
      'Wheat': '0',
      'Milk': '0',
      'Sulphite': '0',
      'Egg': '0',
      'Gluten': '0',
      'Mustard': '0',
      'Celery': '0',
      'Garlic': '0',
      'Onion': '0',
      'Nitrite': '0',
      'Mushroom': '0',
      'Hot Pepper': '0',
      'Citrus': '0',
      'Pork': '0',
      // Custom allergens
      'Custom Allergen 1 Name': '',
      'Custom Allergen 1 Active': '0',
      'Custom Allergen 2 Name': '',
      'Custom Allergen 2 Active': '0',
      'Custom Allergen 3 Name': '',
      'Custom Allergen 3 Active': '0',
      'Allergen Notes': ''
    }
  ];

  // Create workbook
  const wb = utils.book_new();

  // Create main data sheet
  const ws = utils.json_to_sheet([
    headers.reduce((acc, header) => ({ ...acc, [header]: header }), {}),
    ...exampleData
  ], {
    header: headers
  });

  // Add column widths
  ws['!cols'] = headers.map(header => ({
    wch: Math.max(header.length, 15)
  }));

  // Add instructions sheet
  const instructionsWs = utils.aoa_to_sheet([
    ['Master Ingredients Import Template Instructions'],
    [''],
    ['Required Fields:'],
    ['Core Fields:'],
    ['- Item Code: Unique identifier for the ingredient'],
    ['- Product Name: Common name of the ingredient'],
    ['- Major Group: Must match an existing food category group'],
    ['- Category: Must match an existing category within the group'],
    ['- Sub-Category: Must match an existing sub-category within the category'],
    ['- Vendor: Supplier name'],
    ['- Case Size: Size of purchase unit (e.g. 6x1kg)'],
    ['- Units/Case: Number of units per case'],
    ['- Case Price: Current price per case'],
    ['- Unit of Measure: Base unit for inventory'],
    ['- Recipe Units/Case: Number of recipe units per case'],
    ['- Recipe Unit Type: Unit used in recipes'],
    ['- Yield %: Usable percentage after waste'],
    ['- Storage Area: Default storage location'],
    ['- Image URL: URL to product image'],
    [''],
    ['Allergen Fields (Use 1 for Yes, 0 for No):'],
    ['- Standard Allergens:'],
    ['  Peanut, Crustacean, Tree Nut, Shellfish, Sesame'],
    ['  Soy, Fish, Wheat, Milk, Sulphite'],
    ['  Egg, Gluten, Mustard, Celery, Garlic'],
    ['  Onion, Nitrite, Mushroom, Hot Pepper'],
    ['  Citrus, Pork'],
    [''],
    ['- Custom Allergens:'],
    ['  Custom Allergen 1-3 Name: Name of custom allergen'],
    ['  Custom Allergen 1-3 Active: 1 for active, 0 for inactive'],
    ['  Allergen Notes: Additional allergen information'],
    [''],
    ['Tips:'],
    ['- Fill out one complete row as a reference'],
    ['- Use consistent units and formatting'],
    ['- Double-check all measurements'],
    ['- Remove any empty rows before importing'],
    ['- Image URLs must be valid and accessible'],
    ['- Mark all applicable allergens accurately'],
    ['- Include relevant allergen notes for clarity']
  ]);

  instructionsWs['!cols'] = [{ wch: 80 }];

  // Add sheets to workbook
  utils.book_append_sheet(wb, ws, 'Master Ingredients');
  utils.book_append_sheet(wb, instructionsWs, 'Instructions');

  // Save file
  writeFile(wb, 'master-ingredients-template.xlsx');
}