import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OperationsSettings {
  storageAreas: string[];
  stations: string[];
  shelfLife: string[];
  batchUnits: string[];
  prepCategories: string[];
  ingredientCategories: string[];
  ingredientSubCategories: string[];
  volumeMeasures: string[];
  weightMeasures: string[];
  recipeUnits: string[];
  storageContainers: string[];
  containerTypes: string[];
  vendors: string[];
}

interface OperationsStore {
  settings: OperationsSettings;
  isLoading: boolean;
  updateSettings: (settings: OperationsSettings) => Promise<void>;
}

const DEFAULT_SETTINGS: OperationsSettings = {
  storageAreas: [
    'Walk-in Cooler',
    'Walk-in Freezer',
    'Dry Storage',
    'Line Cooler',
    'Prep Station'
  ],
  stations: [
    'Grill',
    'Sauté',
    'Fry',
    'Prep',
    'Pantry',
    'Pizza',
    'Salad',
    'Dessert'
  ],
  shelfLife: [
    '1 Day',
    '2 Days',
    '3 Days',
    '5 Days',
    '1 Week',
    '2 Weeks',
    '1 Month'
  ],
  batchUnits: [
    'Each',
    'Batch',
    'Recipe',
    'Pan',
    'Sheet',
    'Container'
  ],
  prepCategories: [
    'Sauces',
    'Dressings',
    'Marinades',
    'Vegetables',
    'Proteins',
    'Starches'
  ],
  ingredientCategories: [
    'Dairy',
    'Protein',
    'Dry Goods',
    'Produce',
    'Bakery',
    'Beverages',
    'Alcohol',
    'Spices'
  ],
  ingredientSubCategories: [
    'Fresh',
    'Frozen',
    'Canned',
    'Dried',
    'Processed',
    'Raw'
  ],
  volumeMeasures: [
    'mL',
    'L',
    'fl oz',
    'cup',
    'pint',
    'quart',
    'gallon'
  ],
  weightMeasures: [
    'g',
    'kg',
    'oz',
    'lb'
  ],
  recipeUnits: [
    'portion',
    'serving',
    'each',
    'dozen',
    'batch'
  ],
  storageContainers: [
    'Cambro',
    'Hotel Pan',
    'Lexan',
    'Sheet Pan',
    'Deli Container'
  ],
  containerTypes: [
    '1/6 Pan',
    '1/4 Pan',
    '1/3 Pan',
    '1/2 Pan',
    'Full Pan',
    '2 Qt',
    '4 Qt',
    '6 Qt',
    '8 Qt',
    '12 Qt',
    '22 Qt'
  ],
  vendors: [
    'US Foods',
    'Sysco',
    'Gordon Food Service',
    'Performance Food Group'
  ]
};

export const useOperationsStore = create<OperationsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      isLoading: false,

      updateSettings: async (newSettings) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ settings: newSettings });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'operations-storage',
      partialize: (state) => ({ settings: state.settings })
    }
  )
);