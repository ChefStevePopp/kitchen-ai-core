export interface FoodCategoryGroup {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FoodCategory {
  id: string;
  group_id: string;
  name: string;
  description?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FoodSubCategory {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FoodRelationshipsStore {
  groups: FoodCategoryGroup[];
  categories: FoodCategory[];
  subCategories: FoodSubCategory[];
  isLoading: boolean;
  error: string | null;
  
  // Fetch methods
  fetchGroups: () => Promise<void>;
  fetchCategories: (groupId: string) => Promise<void>;
  fetchSubCategories: (categoryId: string) => Promise<void>;
  
  // Group methods
  addGroup: (group: Omit<FoodCategoryGroup, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGroup: (id: string, updates: Partial<FoodCategoryGroup>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  
  // Category methods
  addCategory: (category: Omit<FoodCategory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<FoodCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Sub-category methods
  addSubCategory: (subCategory: Omit<FoodSubCategory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSubCategory: (id: string, updates: Partial<FoodSubCategory>) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<void>;
}