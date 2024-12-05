import React from 'react';
import { Package } from 'lucide-react';
import type { MasterIngredient } from '@/types/master-ingredient';
import type { OperationsSettings } from '@/types/operations';
import type { FoodCategoryGroup, FoodCategory, FoodSubCategory } from '@/types/food-relationships';

interface BasicInformationProps {
  formData: MasterIngredient;
  settings: OperationsSettings | null;
  groups: FoodCategoryGroup[];
  categories: FoodCategory[];
  subCategories: FoodSubCategory[];
  onChange: (updates: MasterIngredient) => void;
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  settings,
  groups,
  categories,
  subCategories,
  onChange
}) => {
  // Diagnostic Text
  const diagnosticPath = "src/features/admin/components/sections/recipe/MasterIngredientList/EditIngredientModal/BasicInformation.tsx";

  // Filter categories based on selected major group
  const filteredCategories = categories.filter(
    cat => cat.group_id === formData.major_group
  );

  // Filter sub-categories based on selected category
  const filteredSubCategories = subCategories.filter(
    sub => sub.category_id === formData.category
  );

  return (
    <div className="space-y-4">
      {/* Diagnostic Text */}
      <div className="text-xs text-gray-500 font-mono">
        {diagnosticPath}
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Package className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-white">Basic Information</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Item Code
          </label>
          <input
            type="text"
            value={formData.item_code}
            onChange={(e) => onChange({ ...formData, item_code: e.target.value })}
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
            onChange={(e) => onChange({ ...formData, product: e.target.value })}
            className="input w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Major Group
          </label>
          <select
            value={formData.major_group || ''}
            onChange={(e) => onChange({ 
              ...formData, 
              major_group: e.target.value,
              category: '', // Reset lower levels when parent changes
              sub_category: ''
            })}
            className="input w-full"
            required
          >
            <option value="">Select major group...</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Category
          </label>
          <select
            value={formData.category || ''}
            onChange={(e) => onChange({ 
              ...formData, 
              category: e.target.value,
              sub_category: '' // Reset sub-category when category changes
            })}
            className="input w-full"
            required
            disabled={!formData.major_group}
          >
            <option value="">Select category...</option>
            {filteredCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Sub-Category
          </label>
          <select
            value={formData.sub_category || ''}
            onChange={(e) => onChange({ ...formData, sub_category: e.target.value })}
            className="input w-full"
            disabled={!formData.category}
          >
            <option value="">Select sub-category...</option>
            {filteredSubCategories.map(subCategory => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </option>
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
            onChange={(e) => onChange({ ...formData, vendor: e.target.value })}
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
            onChange={(e) => onChange({ ...formData, storage_area: e.target.value })}
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
  );
};