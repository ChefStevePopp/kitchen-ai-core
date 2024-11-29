import { create } from 'zustand';
import type { InventoryStore } from '../types';

export const useInventoryStore = create<InventoryStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  addItem: (item) => set((state) => ({
    items: [...state.items, {
      ...item,
      id: `inv-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    }]
  })),

  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item =>
      item.id === id
        ? { ...item, ...updates, lastUpdated: new Date().toISOString() }
        : item
    )
  })),

  deleteItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  importItems: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // Process and validate data here
      set({ items: data });
    } catch (error) {
      set({ error: 'Failed to import inventory data' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));