export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

export interface InventoryStore {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  importItems: (data: any[]) => Promise<void>;
}