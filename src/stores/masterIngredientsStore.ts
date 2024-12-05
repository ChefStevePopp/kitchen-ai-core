import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { validateMasterIngredients } from '@/utils/excel/masterIngredients/validation';
import type { MasterIngredient } from '@/types/master-ingredient';
import toast from 'react-hot-toast';

interface MasterIngredientsStore {
  ingredients: MasterIngredient[];
  isLoading: boolean;
  error: string | null;
  fetchIngredients: () => Promise<void>;
  importIngredients: (data: any[]) => Promise<void>;
  clearIngredients: () => Promise<void>;
  saveIngredients: () => Promise<void>;
}

export const useMasterIngredientsStore = create<MasterIngredientsStore>((set, get) => ({
  ingredients: [],
  isLoading: false,
  error: null,

  fetchIngredients: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { data, error } = await supabase
        .from('master_ingredients')
        .select('*')
        .eq('organization_id', user.user_metadata.organizationId);

      if (error) throw error;
      set({ ingredients: data || [], error: null });
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      set({ error: 'Failed to load ingredients', ingredients: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  importIngredients: async (data: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const loadingToast = toast.loading('Validating ingredients...');

      // First validate all data
      const validatedData = await validateMasterIngredients(data, user.user_metadata.organizationId);

      // Insert all validated data at once
      const { error: insertError } = await supabase
        .from('master_ingredients')
        .upsert(validatedData, {
          onConflict: 'organization_id,item_code',
          ignoreDuplicates: false
        });

      if (insertError) throw insertError;

      toast.success('Import completed successfully!', { id: loadingToast });
      await get().fetchIngredients();
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to import data');
      throw error;
    }
  },

  clearIngredients: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('master_ingredients')
        .delete()
        .eq('organization_id', user.user_metadata.organizationId);

      if (error) throw error;
      
      set({ ingredients: [] });
      toast.success('Ingredients cleared successfully');
    } catch (error) {
      console.error('Error clearing ingredients:', error);
      toast.error('Failed to clear ingredients');
    }
  },

  saveIngredients: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { ingredients } = get();
      const loadingToast = toast.loading('Saving ingredients...');

      // Update all ingredients at once
      const { error } = await supabase
        .from('master_ingredients')
        .upsert(
          ingredients.map(ingredient => ({
            ...ingredient,
            organization_id: user.user_metadata.organizationId,
            updated_at: new Date().toISOString()
          })),
          {
            onConflict: 'organization_id,item_code',
            ignoreDuplicates: false
          }
        );

      if (error) throw error;

      toast.success('All ingredients saved successfully!', { id: loadingToast });
      await get().fetchIngredients();
    } catch (error) {
      console.error('Error saving ingredients:', error);
      toast.error('Failed to save ingredients');
    }
  }
}));