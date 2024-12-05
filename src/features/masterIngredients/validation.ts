import { CORE_COLUMNS, ALLERGEN_COLUMNS, CUSTOM_ALLERGEN_COLUMNS } from './constants';

interface ValidationError {
  type: 'missing' | 'invalid';
  column: string;
  message: string;
}

export const validateImportData = (data: any[]): any[] => {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: Expected an array');
  }

  const firstRow = data[0];
  if (!firstRow || typeof firstRow !== 'object') {
    throw new Error('Invalid data format: No valid rows found');
  }

  const errors: ValidationError[] = [];

  // Validate core columns
  Object.entries(CORE_COLUMNS).forEach(([colName, config]) => {
    if (config.required && !(colName in firstRow)) {
      errors.push({
        type: 'missing',
        column: colName,
        message: config.description
      });
    }
  });

  // Validate allergen columns
  Object.keys(ALLERGEN_COLUMNS).forEach(colName => {
    if (!(colName in firstRow)) {
      errors.push({
        type: 'missing',
        column: colName,
        message: 'Required allergen field'
      });
    }
  });

  // Validate custom allergen columns
  Object.entries(CUSTOM_ALLERGEN_COLUMNS).forEach(([colName, config]) => {
    if (config.required && !(colName in firstRow)) {
      errors.push({
        type: 'missing',
        column: colName,
        message: 'Required custom allergen field'
      });
    }
  });

  if (errors.length > 0) {
    const errorMessage = formatValidationErrors(errors);
    throw new Error(errorMessage);
  }

  // Generate unique IDs using timestamp and index
  const timestamp = Date.now();
  
  return data
    .filter(row => {
      const productName = row['Product Name']?.toString().trim();
      return productName && productName !== '0';
    })
    .map((row, index) => {
      // Process core fields
      const coreFields = Object.entries(CORE_COLUMNS).reduce((acc, [excelName, config]) => {
        let value = row[excelName]?.toString().trim() || '';
        
        // Handle special field types
        switch (config.type) {
          case 'currency':
            value = parseFloat(value.replace(/[$,]/g, '') || '0');
            break;
          case 'number':
            value = parseFloat(value || '0');
            break;
          case 'percent':
            value = parseFloat(value.replace(/%/g, '') || '100');
            break;
          default:
            // Keep as string
            break;
        }
        
        acc[config.dbColumn] = value;
        return acc;
      }, {} as Record<string, any>);

      // Process allergens
      const allergens = Object.entries(ALLERGEN_COLUMNS).reduce((acc, [excelName, config]) => {
        const value = row[excelName]?.toString().trim();
        acc[config.dbColumn] = value === '1' || (parseFloat(value) > 0);
        return acc;
      }, {} as Record<string, boolean>);

      // Process custom allergens
      const customAllergens = Object.entries(CUSTOM_ALLERGEN_COLUMNS).reduce((acc, [excelName, config]) => {
        const value = row[excelName];
        if (config.type === 'boolean') {
          acc[config.dbColumn] = value === '1' || value === 'true';
        } else {
          acc[config.dbColumn] = value?.toString() || '';
        }
        return acc;
      }, {} as Record<string, any>);

      return {
        id: `ingredient-${timestamp}-${index}`,
        ...coreFields,
        ...allergens,
        ...customAllergens,
        last_updated: new Date().toISOString()
      };
    });
};

function formatValidationErrors(errors: ValidationError[]): string {
  const missingRequired = errors.filter(e => e.type === 'missing' && e.column in CORE_COLUMNS);
  const missingAllergens = errors.filter(e => e.type === 'missing' && e.column in ALLERGEN_COLUMNS);
  const missingCustom = errors.filter(e => e.type === 'missing' && e.column in CUSTOM_ALLERGEN_COLUMNS);

  let message = 'Import validation failed:\n\n';

  if (missingRequired.length > 0) {
    message += 'Required Core Fields Missing:\n';
    missingRequired.forEach(error => {
      message += `- ${error.column}: ${error.message}\n`;
    });
    message += '\n';
  }

  if (missingAllergens.length > 0) {
    message += 'Required Allergen Fields Missing:\n';
    missingAllergens.forEach(error => {
      message += `- ${error.column}\n`;
    });
    message += '\n';
  }

  if (missingCustom.length > 0) {
    message += 'Custom Allergen Fields Missing:\n';
    missingCustom.forEach(error => {
      message += `- ${error.column}\n`;
    });
  }

  message += '\nPlease ensure your import file contains all required columns.\n';
  message += 'Download the template for the correct format.';

  return message;
}