import { create } from 'zustand';
import type { MasterIngredient, MasterIngredientsStore } from '../types';

const validateIngredientData = (data: any[]): MasterIngredient[] => {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: Expected an array');
  }

  return data
    .filter(row => {
      const product = row['PRODUCT']?.toString().trim();
      return product && product !== '0';
    })
    .map(row => ({
      uniqueId: row['UNIQ ID']?.toString() || '',
      category: row['CATEGORY'] || '',
      product: row['PRODUCT'] || '',
      vendor: row['VENDOR'] || '',
      subCategory: row['SUB-CATEGORY'] || '',
      itemCode: row['ITEM # | CODE'] || '',
      caseSize: row['P/U CASE SIZE'] || '',
      unitsPerCase: row['P/U# PER CASE']?.toString() || '',
      currentPrice: parseFloat(row['CURRENT PRICE']?.toString().replace(/[$,]/g, '') || '0') || 0,
      unitOfMeasure: row['UNIT OF MEASURE'] || '',
      ratioPerUnit: parseFloat(row['R/U PER P/U']?.toString() || '0') || 0,
      yieldPercent: parseFloat(row['YIELD %']?.toString().replace('%', '') || '100') || 0,
      pricePerRatioUnit: parseFloat(row['$ PER R/U']?.toString().replace(/[$,]/g, '') || '0') || 0,
      lastUpdated: new Date().toISOString()
    }));
};

// Initial mock data - first few items from your dataset
const INITIAL_DATA: MasterIngredient[] = [
  {
    uniqueId: 'ITEM-85544',
    category: 'DAIRY',
    product: 'EGGS, WHOLE, SHELL-ON',
    vendor: 'GFS',
    subCategory: 'EGGS',
    itemCode: '9875405',
    caseSize: 'CASE / DOZEN',
    unitsPerCase: 'EACH',
    currentPrice: 50.11,
    unitOfMeasure: 'EACH',
    ratioPerUnit: 180,
    yieldPercent: 1,
    pricePerRatioUnit: 0.278388889,
    lastUpdated: new Date().toISOString()
  },
  {
    uniqueId: 'ITEM-81175',
    category: 'DAIRY',
    product: 'EGGS, YOLKS, PASTEURIZED',
    vendor: 'GFS',
    subCategory: 'EGGS',
    itemCode: '2551868',
    caseSize: 'CASE / 12',
    unitsPerCase: '12',
    currentPrice: 116.7,
    unitOfMeasure: 'EACH',
    ratioPerUnit: 12,
    yieldPercent: 1,
    pricePerRatioUnit: 9.725,
    lastUpdated: new Date().toISOString()
  }
];

export const useMasterIngredientsStore = create<MasterIngredientsStore>((set) => ({
  ingredients: INITIAL_DATA,
  isLoading: false,
  isImporting: false,

  importIngredients: async (data: any[]) => {
    set({ isImporting: true });
    try {
      const validatedData = validateIngredientData(data);
      set({ ingredients: validatedData });
    } finally {
      set({ isImporting: false });
    }
  },

  clearIngredients: () => set({ ingredients: [] }),

  saveIngredients: async () => {
    // Implement save functionality here
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  addIngredient: (ingredient) => set((state) => ({
    ingredients: [...state.ingredients, ingredient]
  })),

  updateIngredient: (id, updates) => set((state) => ({
    ingredients: state.ingredients.map(ingredient =>
      ingredient.uniqueId === id ? { ...ingredient, ...updates } : ingredient
    )
  })),

  deleteIngredient: (id) => set((state) => ({
    ingredients: state.ingredients.filter(ingredient => ingredient.uniqueId !== id)
  }))
}));