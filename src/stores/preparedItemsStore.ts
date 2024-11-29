import { create } from 'zustand';
import type { PreparedItem, PreparedItemsStore } from '../types';
import toast from 'react-hot-toast';

// Allergen mapping from Excel headers to internal names
const ALLERGEN_EXCEL_MAP = {
  'Peanut': 'peanut',
  'Crustacean': 'crustacean',
  'Treenut': 'treenut', 
  'Shellfish': 'shellfish',
  'Sesame': 'sesame',
  'Soy': 'soy',
  'Fish': 'fish',
  'Wheat': 'wheat',
  'Milk': 'milk',
  'Sulphite': 'sulphite',
  'Egg': 'egg',
  'Gluten': 'gluten',
  'Mustard': 'mustard',
  'Celery': 'celery',
  'Garlic': 'garlic',
  'Onion': 'onion',
  'Nitrite': 'nitrite',
  'Mushroom': 'mushroom',
  'Hot Pepper': 'hot_pepper',
  'Citrus': 'citrus',
  'Pork': 'pork'
};

const validatePreparedItemsData = (data: any[]): PreparedItem[] => {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: Expected an array');
  }

  const firstRow = data[0];
  if (!firstRow || typeof firstRow !== 'object') {
    throw new Error('Invalid data format: No valid rows found');
  }

  // Required columns including allergens
  const requiredColumns = [
    'Item ID',
    'CATEGORY',
    'PRODUCT',
    'STATION',
    'SUB CATEGORY',
    'STORAGE AREA',
    'CONTAINER',
    'CONTAINER TYPE',
    'SHELF LIFE',
    'RECIPE UNIT (R/U)',
    'COST PER R/U',
    'YIELD %',
    'FINAL $',
    ...Object.keys(ALLERGEN_EXCEL_MAP)
  ];

  const missingColumns = requiredColumns.filter(col => !(col in firstRow));
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  // Generate unique IDs using timestamp and index
  const timestamp = Date.now();
  
  return data
    .filter(row => {
      const productName = row['PRODUCT']?.toString().trim();
      return productName && productName !== '0';
    })
    .map((row, index) => {
      // Process allergens - collect those marked with '1' or any positive number
      const allergens = Object.entries(ALLERGEN_EXCEL_MAP)
        .filter(([excelName]) => {
          const value = row[excelName]?.toString().trim();
          return value === '1' || (parseFloat(value) > 0);
        })
        .map(([_, normalizedName]) => normalizedName);

      return {
        id: `prepared-${timestamp}-${index}`,
        itemId: row['Item ID']?.toString() || '',
        category: row['CATEGORY']?.toString() || '',
        product: row['PRODUCT']?.toString() || '',
        station: row['STATION']?.toString() || '',
        subCategory: row['SUB CATEGORY']?.toString() || '',
        storageArea: row['STORAGE AREA']?.toString() || '',
        container: row['CONTAINER']?.toString() || '',
        containerType: row['CONTAINER TYPE']?.toString() || '',
        shelfLife: row['SHELF LIFE']?.toString() || '',
        recipeUnitRatio: row['RECIPE UNIT (R/U)']?.toString() || '',
        costPerRatioUnit: parseFloat(row['COST PER R/U']?.toString().replace(/[$,]/g, '') || '0'),
        yieldPercent: parseFloat(row['YIELD %']?.toString().replace(/%/g, '') || '0'),
        finalCost: parseFloat(row['FINAL $']?.toString().replace(/[$,]/g, '') || '0'),
        lastUpdated: new Date().toISOString(),
        allergens,
        excelData: row // Store original Excel data
      };
    });
};

export const usePreparedItemsStore = create<PreparedItemsStore>((set) => ({
  items: [],
  isLoading: false,
  isImporting: false,

  setItems: (items) => set({ items }),
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  
  deleteItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  importItems: async (data: any[]) => {
    set({ isImporting: true });
    try {
      const validatedData = validatePreparedItemsData(data);
      set({ items: validatedData });
      toast.success('Data imported successfully');
    } catch (error) {
      console.error('Import error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to import data');
      }
      throw error;
    } finally {
      set({ isImporting: false });
    }
  },

  clearItems: () => {
    set({ items: [] });
    toast.success('Data cleared successfully');
  },

  saveItems: async () => {
    try {
      // Save functionality here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Data saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save data');
      throw error;
    }
  }
}));