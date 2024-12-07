import React from 'react';
import { Package } from 'lucide-react';
import type { MasterIngredient } from '@/types/master-ingredient';
import type { OperationsSettings } from '@/types/operations';

interface BasicInformationProps {
  formData: MasterIngredient;
  settings: OperationsSettings | null;
  onChange: (updates: MasterIngredient) => void;
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  settings,
  onChange
}) => {
  return (
    <div className="space-y-4">
      {/* Diagnostic Text */}
      <div className="text-xs text-gray-500 font-mono">
        src/features/admin/components/sections/recipe/MasterIngredientList/EditIngredientModal/BasicInformation.tsx
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
            Vendor Code | Bar Code
          </label>
          <input
            type="text"
            value={formData.itemCode}
            onChange={(e) => onChange({ ...formData, itemCode: e.target.value })}
            className="input w-full"
            placeholder="Enter vendor or bar code"
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
            value={formData.majorGroup || ''}
            onChange={(e) => onChange({ 
              ...formData, 
              majorGroup: e.target.value,
              category: '', // Reset lower levels when parent changes
              subCategory: ''
            })}
            className="input w-full"
            required
          >
            <option value="">Select major group...</option>
            {settings?.food_category_groups?.map(group => (
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
              subCategory: '' // Reset sub-category when category changes
            })}
            className="input w-full"
            required
            disabled={!formData.majorGroup}
          >
            <option value="">Select category...</option>
            {settings?.food_categories
              ?.filter(cat => cat.group_id === formData.majorGroup)
              .map(category => (
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
            value={formData.subCategory || ''}
            onChange={(e) => onChange({ ...formData, subCategory: e.target.value })}
            className="input w-full"
            disabled={!formData.category}
          >
            <option value="">Select sub-category...</option>
            {settings?.food_sub_categories
              ?.filter(sub => sub.category_id === formData.category)
              .map(subCategory => (
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
            value={formData.storageArea}
            onChange={(e) => onChange({ ...formData, storageArea: e.target.value })}
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