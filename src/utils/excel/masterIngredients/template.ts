import { utils, writeFile } from 'xlsx';
import { CORE_COLUMNS, ALLERGEN_COLUMNS, CUSTOM_ALLERGEN_COLUMNS } from './columns';

export function generateMasterIngredientsTemplate() {
  // Create headers from all column definitions
  const headers = [
    ...CORE_COLUMNS,
    ...ALLERGEN_COLUMNS,
    ...CUSTOM_ALLERGEN_COLUMNS
  ].map(col => col.name);

  // Create example data
  const exampleData = [{
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
  }];

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
    ...CORE_COLUMNS
      .filter(col => col.required)
      .map(col => [`- ${col.name}: ${col.type === 'currency' ? 'Price value (e.g. 125.99)' : 
                                   col.type === 'percent' ? 'Percentage value (e.g. 85)' :
                                   'Text value'}`]),
    [''],
    ['Allergen Fields (Use 1 for Yes, 0 for No):'],
    ['- Standard Allergens:'],
    ...ALLERGEN_COLUMNS.map(col => [`  ${col.name}`]),
    [''],
    ['- Custom Allergens:'],
    ...CUSTOM_ALLERGEN_COLUMNS.map(col => [`  ${col.name}`]),
    [''],
    ['Tips:'],
    ['- Fill out one complete row as a reference'],
    ['- Use consistent units and formatting'],
    ['- Double-check all measurements'],
    ['- Remove any empty rows before importing']
  ]);

  instructionsWs['!cols'] = [{ wch: 80 }];

  // Add sheets to workbook
  utils.book_append_sheet(wb, ws, 'Master Ingredients');
  utils.book_append_sheet(wb, instructionsWs, 'Instructions');

  // Save file
  writeFile(wb, 'master-ingredients-template.xlsx');
}