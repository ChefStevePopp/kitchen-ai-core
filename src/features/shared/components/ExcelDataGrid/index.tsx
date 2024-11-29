import React, { useMemo, useState } from 'react';
import { Search, ImageIcon } from 'lucide-react';
import { useExcelStore } from '@/stores/excelStore';
import { usePreparedItemsStore } from '@/stores/preparedItemsStore';
import { useMasterIngredientsStore } from '@/stores/masterIngredientsStore';
import type { ExcelColumn } from '@/shared/types';

interface ExcelDataGridProps {
  columns: ExcelColumn[];
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  type: 'inventory' | 'prepared-items' | 'master-ingredients';
}

export const ExcelDataGrid: React.FC<ExcelDataGridProps> = ({
  columns,
  categoryFilter,
  onCategoryChange,
  type
}) => {
  const inventoryData = useExcelStore(state => state.data);
  const preparedItems = usePreparedItemsStore(state => state.items);
  const masterIngredients = useMasterIngredientsStore(state => state.ingredients);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Get data based on type
  const data = useMemo(() => {
    switch (type) {
      case 'inventory':
        return inventoryData;
      case 'prepared-items':
        return preparedItems;
      case 'master-ingredients':
        return masterIngredients;
      default:
        return [];
    }
  }, [type, inventoryData, preparedItems, masterIngredients]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(data.map(item => 
      item.category || 'Uncategorized'
    ))).sort();
    return ['all', ...uniqueCategories];
  }, [data]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        // Search in all fields including Excel data
        const searchableValues = Object.values({
          ...item,
          ...item.excelData
        });
          
        return searchableValues.some(value =>
          String(value).toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue = a.excelData?.[sortConfig.key];
        let bValue = b.excelData?.[sortConfig.key];

        // If not found in excelData, try main object
        if (aValue === undefined) aValue = a[sortConfig.key];
        if (bValue === undefined) bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;
        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, categoryFilter, searchTerm, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const formatCellValue = (value: any, type: string) => {
    if (value == null || value === '') return '';

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
      case 'boolean':
        // For allergen columns, show checkmark or empty
        return value === '1' || parseFloat(value) > 0 ? '✓' : '';
      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="input sm:w-48 text-sm"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="relative rounded-lg border border-gray-700 bg-gray-800/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    className={`sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm
                      px-3 py-3.5 text-center text-sm font-semibold text-gray-300
                      cursor-pointer hover:text-white transition-colors
                      ${column.width ? `w-[${column.width}px]` : ''}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {column.name}
                      {sortConfig?.key === column.key && (
                        <span className="text-primary-400">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-transparent">
              {filteredAndSortedData.map((item, index) => (
                <tr 
                  key={item.id || index}
                  className="hover:bg-gray-700/50 transition-colors"
                >
                  {columns.map((column) => {
                    // First try to get value from excelData, then from main object
                    let value = item.excelData?.[column.key];
                    if (value === undefined) {
                      value = item[column.key];
                    }

                    // For allergen columns, treat them as boolean
                    const isAllergenColumn = column.key.match(/^(peanuts|crustaceans|treenuts|shellfish|sesame|soy|fish|wheat|milk|sulphites|eggs|gluten|mustard|celery|garlic|onion|nitrites|mushrooms|hot_peppers|citrus)$/i);
                    const columnType = isAllergenColumn ? 'boolean' : column.type;

                    return (
                      <td
                        key={column.key}
                        className="whitespace-nowrap px-3 py-3 text-sm text-gray-300 text-center"
                      >
                        {formatCellValue(value, columnType)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">No items found</p>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400 text-right">
        Showing {filteredAndSortedData.length} of {data.length} items
      </div>
    </div>
  );
};