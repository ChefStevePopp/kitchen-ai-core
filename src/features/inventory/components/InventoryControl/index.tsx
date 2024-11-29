import React from 'react';
import { Package, Plus, Search } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore';
import { InventoryTable } from '../InventoryTable';

export const InventoryControl: React.FC = () => {
  const { items, importItems } = useInventoryStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleImport = async (file: File) => {
    try {
      // Process Excel file and import data
      await importItems([]);
    } catch (error) {
      console.error('Failed to import inventory:', error);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Inventory Control</h1>
        <div className="flex gap-4">
          <button className="btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Add Item
          </button>
        </div>
      </header>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inventory..."
              className="input pl-10 w-full"
            />
          </div>
        </div>

        <InventoryTable 
          items={items.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onImportExcel={handleImport}
        />
      </div>
    </div>
  );
};