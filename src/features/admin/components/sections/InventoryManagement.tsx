import React, { useState, useMemo } from 'react';
import { Package, Upload, Trash2, PieChart, Save } from 'lucide-react';
import { useExcelStore } from '@/stores/excelStore';
import { ExcelDataGrid, LoadingLogo } from '@/features/shared/components';
import { ImportExcelModal } from '../ImportExcelModal';
import type { ExcelColumn } from '@/shared/types';
import toast from 'react-hot-toast';

export const InventoryManagement: React.FC = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { data, isLoading, importExcel, clearData, saveData } = useExcelStore();

  // Match exact Excel column order
  const columns: ExcelColumn[] = [
    { key: 'itemId', name: 'Item ID', type: 'text', width: 120 },
    { key: 'productName', name: 'Product Name', type: 'text', width: 250 },
    { key: 'unitOfMeasure', name: 'Inventory Unit of Measure', type: 'text', width: 180 },
    { key: 'image', name: 'Image', type: 'imageUrl', width: 100 },
    { key: 'category', name: 'Category', type: 'text', width: 120 },
    { key: 'vendor', name: 'Vendor', type: 'text', width: 120 },
    { key: 'price', name: 'Price', type: 'currency', width: 100 },
    { key: 'adjustedPrice', name: 'Adjusted Price', type: 'currency', width: 120 }
  ];

  // Calculate category stats
  const categoryStats = useMemo(() => {
    const stats = data.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort categories by count in descending order
    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .map(([category, count]) => ({
        category,
        count
      }));
  }, [data]);

  // Calculate additional stats
  const stats = useMemo(() => {
    const totalItems = data.length;
    const uniqueVendors = new Set(data.map(item => item.vendor)).size;
    const totalValue = data.reduce((sum, item) => sum + item.price, 0);
    
    return {
      totalItems,
      uniqueVendors,
      totalValue
    };
  }, [data]);

  const handleImport = async (data: any[], sheetName: string) => {
    try {
      await importExcel(data);
      toast.success('Inventory data imported successfully');
      setIsImportModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to import inventory data');
      }
    }
  };

  const handleClearData = () => {
    clearData();
    toast.success('Inventory data cleared successfully');
  };

  const handleSaveData = async () => {
    try {
      await saveData();
      toast.success('Inventory data saved successfully');
    } catch (error) {
      toast.error('Failed to save inventory data');
    }
  };

  if (isLoading) {
    return <LoadingLogo message="Loading inventory data..." />;
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Food Inventory</h1>
        <div className="flex gap-4">
          <button
            onClick={handleClearData}
            className="btn-ghost text-red-400 hover:text-red-300"
            disabled={data.length === 0}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Clear Data
          </button>
          <button
            onClick={handleSaveData}
            className="btn-ghost text-green-400 hover:text-green-300"
            disabled={data.length === 0}
          >
            <Save className="w-5 h-5 mr-2" />
            Save Data
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn-primary"
          >
            <Upload className="w-5 h-5 mr-2" />
            Import Excel Data
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Category Stats */}
        {categoryStats.slice(0, 3).map(({ category, count }) => (
          <div key={category} className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{category}</p>
                <p className="text-2xl font-bold text-white">{count}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Total Items Card */}
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-orange/20 flex items-center justify-center">
              <PieChart className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Items</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-white">{stats.totalItems}</p>
                <span className="text-xs text-gray-400">
                  {stats.uniqueVendors} vendors
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="card p-6">
        <ExcelDataGrid
          columns={columns}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          type="inventory"
        />
      </div>

      {/* Import Modal */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        type="inventory"
      />
    </div>
  );
};