import React from 'react';
import { Scale, CircleDollarSign } from 'lucide-react';
import type { MasterIngredient } from '@/types/master-ingredient';
import type { OperationsSettings } from '@/types/operations';

interface RecipeUnitsProps {
  formData: MasterIngredient;
  settings: OperationsSettings | null;
  onChange: (updates: MasterIngredient) => void;
}

export const RecipeUnits: React.FC<RecipeUnitsProps> = ({
  formData,
  settings,
  onChange
}) => {
  // Calculate cost per recipe unit with proper type handling
  const costPerRecipeUnit = React.useMemo(() => {
    // Convert all inputs to numbers and provide defaults
    const casePrice = Number(formData.currentPrice) || 0;
    const recipeUnitsPerCase = Number(formData.recipeUnitPerPurchaseUnit) || 1;
    const yieldPercent = Number(formData.yieldPercent) || 100;

    // Calculate cost per recipe unit:
    // 1. Get cost per recipe unit (casePrice / recipeUnitsPerCase)
    // 2. Adjust for yield loss (cost * (100 / yieldPercent))
    const costPerUnit = casePrice / recipeUnitsPerCase;
    const adjustedCost = costPerUnit * (100 / yieldPercent);

    return adjustedCost;
  }, [formData.currentPrice, formData.recipeUnitPerPurchaseUnit, formData.yieldPercent]);

  return (
    <div className="space-y-4">
      {/* Diagnostic Text */}
      <div className="text-xs text-gray-500 font-mono">
        src/features/admin/components/sections/recipe/MasterIngredientList/EditIngredientModal/RecipeUnits.tsx
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <Scale className="w-4 h-4 text-emerald-400" />
        </div>
        <h3 className="text-lg font-medium text-emerald-400">Recipe Units</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Recipe Units per Case
          </label>
          <input
            type="number"
            value={formData.recipeUnitPerPurchaseUnit || ''}
            onChange={(e) => onChange({ 
              ...formData, 
              recipeUnitPerPurchaseUnit: parseFloat(e.target.value) || 0
            })}
            className="input w-full"
            required
            step="0.001"
            min="0"
            placeholder="Enter recipe units per case"
          />
          <p className="text-xs text-gray-400 mt-1">
            How many recipe units can you get from one case?
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Recipe Unit Type
          </label>
          <select
            value={formData.recipeUnitType || ''}
            onChange={(e) => onChange({ ...formData, recipeUnitType: e.target.value })}
            className="input w-full"
            required
          >
            <option value="">Select recipe unit...</option>
            {settings?.recipe_unit_measures?.map((unit, index) => (
              <option key={`${unit}-${index}`} value={unit}>{unit}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            How do you measure this item in recipes?
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Yield Percentage
        </label>
        <div className="relative">
          <input
            type="number"
            value={formData.yieldPercent || ''}
            onChange={(e) => onChange({ 
              ...formData, 
              yieldPercent: parseFloat(e.target.value) || 0
            })}
            className="input w-full pr-8"
            required
            step="0.1"
            min="0"
            max="100"
            placeholder="Enter yield percentage"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Percentage of usable product after waste/loss
        </p>
      </div>

      <div className="bg-emerald-500/10 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <CircleDollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-emerald-400 font-medium">Recipe Unit Calculation</p>
            <p className="text-lg font-semibold text-emerald-300 mt-1">
              Cost per Recipe Unit: ${costPerRecipeUnit.toFixed(4)}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Based on case price divided by recipe units per case, adjusted for yield percentage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};