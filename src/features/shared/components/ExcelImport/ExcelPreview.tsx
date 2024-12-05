import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { ExcelColumn } from '@/types';

interface ExcelPreviewProps {
  data: any[] | null;
  columns: ExcelColumn[];
  totalRows: number;
}

export const ExcelPreview: React.FC<ExcelPreviewProps> = ({ data, columns, totalRows }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-gray-400">No valid data rows found in selected sheet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              {columns.map((col) => (
                <th key={col.key} className="pb-3 px-4" style={{ minWidth: col.width }}>
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-700/50">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4">
                    {formatCellValue(row[col.key], col.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-400 mt-4 pt-4 border-t border-gray-700">
        Showing first {data.length} rows of {totalRows} total rows
      </p>
    </div>
  );
};

function formatCellValue(value: any, type: string): React.ReactNode {
  if (value == null || value === '') return '-';

  switch (type) {
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
      
    case 'number':
      return new Intl.NumberFormat('en-US').format(parseFloat(value) || 0);
      
    default:
      return String(value);
  }
}