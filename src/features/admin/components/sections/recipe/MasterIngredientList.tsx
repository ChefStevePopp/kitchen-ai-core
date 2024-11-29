import React, { useState, useMemo } from 'react';
import { Package, Plus, Upload, Trash2, PieChart, Save } from 'lucide-react';
import { useMasterIngredientsStore } from '@/stores/masterIngredientsStore';
import { ExcelDataGrid, LoadingLogo } from '@/features/shared/components';
import { ImportExcelModal } from '../../ImportExcelModal';
import type { ExcelColumn } from '@/shared/types';
import toast from 'react-hot-toast';

export const MasterIngredientList: React.FC = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { ingredients, isLoading, importIngredients, clearIngredients, saveIngredients } = useMasterIngredientsStore();

  const columns: ExcelColumn[] = [
    { key: 'uniqueId', name: 'UNIQ ID', type: 'text', width: 100 },
    { key: 'category', name: 'CATEGORY', type: 'text', width: 120 },
    { key: 'product', name: 'PRODUCT', type: 'text', width: 200 },
    { key: 'vendor', name: 'VENDOR', type: 'text', width: 120 },
    { key: 'subCategory', name: 'SUB-CATEGORY', type: 'text', width: 120 },
    { key: 'itemCode', name: 'ITEM # | CODE', type: 'text', width: 120 },
    { key: 'caseSize', name: 'P/U CASE SIZE', type: 'text', width: 120 },
    { key: 'unitsPerCase', name: 'P/U# PER CASE', type: 'text', width: 120 },
    { key: 'currentPrice', name: 'CURRENT PRICE', type: 'currency', width: 120 },
    { key: 'unitOfMeasure', name: 'UNIT OF MEASURE', type: 'text', width: 120 },
    { key: 'ratioPerUnit', name: 'R/U PER P/U', type: 'number', width: 100 },
    { key: 'yieldPercent', name: 'YIELD %', type: 'percent', width: 100 },
    { key: 'pricePerRatioUnit', name: '$ PER R/U', type: 'currency', width: 100 }
  ];

  // Calculate category stats
  const categoryStats = useMemo(() => {
    const stats = ingredients.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([category, count]) => ({
      category,
      count
    }));
  }, [ingredients]);

  const handleImport = async (data: any[], sheetName: string) => {
    try {
      await importIngredients(data);
      toast.success('Data imported successfully');
      setIsImportModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to import data');
      }
    }
  };

  const handleClearData = () => {
    clearIngredients();
    toast.success('Data cleared successfully');
  };

  const handleSaveData = async () => {
    try {
      await saveIngredients();
      toast.success('Data saved successfully');
    } catch (error) {
      toast.error('Failed to save data');
    }
  };

  if (isLoading) {
    return <LoadingLogo message="Loading master ingredients..." />;
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Master Ingredients</h1>
        <div className="flex gap-4">
          <button
            onClick={handleClearData}
            className="btn-ghost text-red-400 hover:text-red-300"
            disabled={ingredients.length === 0}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Clear Data
          </button>
          <button
            onClick={handleSaveData}
            className="btn-ghost text-green-400 hover:text-green-300"
            disabled={ingredients.length === 0}
          >
            <Save className="w-5 h-5 mr-2" />
            Save Data
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn-primary"
          >
            <Upload className="w-5 h-5 mr-2" />
            Import Excel
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryStats.map(({ category, count }) => (
          <div key={category} className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{category}</p>
                <p className="text-2xl font-bold text-white">{count}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-orange/20 flex items-center justify-center">
              <PieChart className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-white">{ingredients.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <ExcelDataGrid
          columns={columns}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          type="master-ingredients"
        />
      </div>

      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        type="master-ingredients"
      />
    </div>
  );
};