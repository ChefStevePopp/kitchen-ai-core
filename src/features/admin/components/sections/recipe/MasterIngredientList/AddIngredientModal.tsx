import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useOperationsStore } from '@/stores/operationsStore';
import { AllergenSelector } from '@/features/allergens/components/AllergenSelector';
import { useMasterIngredientsStore } from '@/stores/masterIngredientsStore';
import type { MasterIngredient } from '@/types';
import toast from 'react-hot-toast';

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  isOpen,
  onClose
}) => {
  const { settings } = useOperationsStore();
  const { addIngredient } = useMasterIngredientsStore();
  const [formData, setFormData] = useState<Partial<MasterIngredient>>({
    item_code: '',
    category: '',
    product: '',
    vendor: '',
    sub_category: '',
    case_size: '',
    units_per_case: '',
    current_price: 0,
    unit_of_measure: '',
    recipe_unit_per_purchase_unit: 0,
    yield_percent: 100,
    cost_per_recipe_unit: 0,
    storage_area: '',
    allergen_peanut: false,
    allergen_crustacean: false,
    allergen_treenut: false,
    allergen_shellfish: false,
    allergen_sesame: false,
    allergen_soy: false,
    allergen_fish: false,
    allergen_wheat: false,
    allergen_milk: false,
    allergen_sulphite: false,
    allergen_egg: false,
    allergen_gluten: false,
    allergen_mustard: false,
    allergen_celery: false,
    allergen_garlic: false,
    allergen_onion: false,
    allergen_nitrite: false,
    allergen_mushroom: false,
    allergen_hot_pepper: false,
    allergen_citrus: false,
    allergen_pork: false,
    allergen_custom1_active: false,
    allergen_custom1_name: '',
    allergen_custom2_active: false,
    allergen_custom2_name: '',
    allergen_custom3_active: false,
    allergen_custom3_name: '',
    allergen_notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addIngredient(formData);
      toast.success('Ingredient created successfully');
      onClose();
    } catch (error) {
      console.error('Error creating ingredient:', error);
      toast.error('Failed to create ingredient');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add Master Ingredient</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Item Code
                </label>
                <input
                  type="text"
                  value={formData.item_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, item_code: e.target.value }))}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
                  className="input w-full"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, sub_category: '' }))}
                  className="input w-full"
                  required
                >
                  <option value="">Select category...</option>
                  {settings?.ingredient_categories?.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Sub-Category
                </label>
                <select
                  value={formData.sub_category}
                  onChange={(e) => setFormData(prev => ({ ...prev, sub_category: e.target.value }))}
                  className="input w-full"
                  disabled={!formData.category}
                >
                  <option value="">Select sub-category...</option>
                  {settings?.ingredient_sub_categories[formData.category || '']?.map(subCategory => (
                    <option key={subCategory} value={subCategory}>{subCategory}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Vendor
                </label>
                <select
                  value={formData.vendor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                  className="input w-full"
                  required
                >
                  <option value="">Select vendor...</option>
                  {settings?.vendors?.map(vendor => (
                    <option key={vendor} value={vendor}>{vendor}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Storage Area
                </label>
                <select
                  value={formData.storage_area}
                  onChange={(e) => setFormData(prev => ({ ...prev, storage_area: e.target.value }))}
                  className="input w-full"
                  required
                >
                  <option value="">Select storage area...</option>
                  {settings?.storage_areas?.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Purchase Units */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Purchase Units</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Case Size
                </label>
                <input
                  type="text"
                  value={formData.case_size}
                  onChange={(e) => setFormData(prev => ({ ...prev, case_size: e.target.value }))}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Units per Case
                </label>
                <input
                  type="number"
                  value={formData.units_per_case}
                  onChange={(e) => setFormData(prev => ({ ...prev, units_per_case: e.target.value }))}
                  className="input w-full"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Current Price (per case)
                </label>
                <input
                  type="number"
                  value={formData.current_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_price: parseFloat(e.target.value) }))}
                  className="input w-full"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Unit of Measure
                </label>
                <select
                  value={formData.unit_of_measure}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit_of_measure: e.target.value }))}
                  className="input w-full"
                  required
                >
                  <option value="">Select unit...</option>
                  {[
                    ...(settings?.weight_measures || []),
                    ...(settings?.volume_measures || []),
                    ...(settings?.dry_goods_measures || [])
                  ].map((unit, index) => (
                    <option key={`${unit}-${index}`} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Recipe Units */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Recipe Units</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Recipe Units per Case
                </label>
                <input
                  type="number"
                  value={formData.recipe_unit_per_purchase_unit}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    recipe_unit_per_purchase_unit: parseFloat(e.target.value) 
                  }))}
                  className="input w-full"
                  required
                  step="0.001"
                  min="0"
                  placeholder="Enter recipe units per case"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Yield Percentage
                </label>
                <input
                  type="number"
                  value={formData.yield_percent}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    yield_percent: parseFloat(e.target.value) 
                  }))}
                  className="input w-full"
                  required
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="Enter yield percentage"
                />
              </div>
            </div>
          </div>

          {/* Allergens */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Allergens</h3>
            <AllergenSelector
              ingredient={formData}
              onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              Create Ingredient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};