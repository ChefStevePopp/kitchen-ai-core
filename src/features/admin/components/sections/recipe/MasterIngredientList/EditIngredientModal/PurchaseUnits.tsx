import React from 'react';
import { CircleDollarSign } from 'lucide-react';
import type { MasterIngredient } from '@/types/master-ingredient';
import type { OperationsSettings } from '@/types/operations';

interface PurchaseUnitsProps {
  formData: MasterIngredient;
  settings: OperationsSettings | null;
  onChange: (updates: MasterIngredient) => void;
}

export const PurchaseUnits: React.FC<PurchaseUnitsProps> = ({
  formData,
  settings,
  onChange
}) => {
  // Create a unique list of measurement units
  const measurementUnits = Array.from(new Set([
    ...(settings?.weight_measures || []),
    ...(settings?.volume_measures || []),
    ...(settings?.dry_goods_measures || [])
  ])).sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
          <CircleDollarSign className="w-4 h-4 text-rose-400" />
        </div>
        <h3 className="text-lg font-medium text-white">Purchase Units</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Case Size
          </label>
          <input
            type="text"
            value={formData.case_size}
            onChange={(e) => onChange({ ...formData, case_size: e.target.value })}
            className="input w-full"
            required
            placeholder="e.g., 6x1kg, 24x500g"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Units per Case
          </label>
          <input
            type="text"
            value={formData.units_per_case}
            onChange={(e) => onChange({ ...formData, units_per_case: e.target.value })}
            className="input w-full"
            required
            placeholder="Number of units per case"
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
            onChange={(e) => onChange({ ...formData, current_price: parseFloat(e.target.value) })}
            className="input w-full"
            required
            step="0.01"
            min="0"
            placeholder="Price per case"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Unit of Measure
          </label>
          <select
            value={formData.unit_of_measure}
            onChange={(e) => onChange({ ...formData, unit_of_measure: e.target.value })}
            className="input w-full"
            required
          >
            <option value="">Select unit...</option>
            {measurementUnits.map((unit, index) => (
              <option key={`${unit}-${index}`} value={unit}>{unit}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Base unit for inventory tracking
          </p>
        </div>
      </div>
    </div>
  );
};