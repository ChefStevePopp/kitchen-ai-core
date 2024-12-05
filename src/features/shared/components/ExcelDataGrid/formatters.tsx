import React from 'react';
import { ImageIcon } from 'lucide-react';
import type { ExcelColumn } from '@/types';

export function formatCellValue(value: any, column: ExcelColumn): React.ReactNode {
  if (value == null || value === '') return '-';

  switch (column.type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(parseFloat(value) || 0);

    case 'percent':
      return `${value}%`;

    case 'boolean':
      return value === true || value === '1' || value === 'true' ? 'Yes' : 'No';

    case 'imageUrl':
      return value ? (
        <img 
          src={value} 
          alt="Product" 
          className="w-8 h-8 rounded object-cover mx-auto"
        />
      ) : (
        <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center mx-auto">
          <ImageIcon className="w-4 h-4 text-gray-400" />
        </div>
      );

    // Return raw value for all other types
    default:
      return String(value);
  }
}