import React, { useState } from 'react';
import { 
  Building2, 
  ListPlus, 
  Save, 
  Trash2, 
  Plus,
  RefreshCw
} from 'lucide-react';
import { useOperationsStore } from '@/stores/operationsStore';
import toast from 'react-hot-toast';

type ConfigCategory = {
  id: string;
  name: string;
  items: string[];
};

export const OperationsManager: React.FC = () => {
  const { 
    settings,
    updateSettings,
    isLoading
  } = useOperationsStore();

  const [activeCategory, setActiveCategory] = useState('storageAreas');
  const [newItemValue, setNewItemValue] = useState('');

  const configCategories: Record<string, ConfigCategory> = {
    storageAreas: {
      id: 'storageAreas',
      name: 'Storage Areas',
      items: settings.storageAreas
    },
    stations: {
      id: 'stations',
      name: 'Kitchen Stations',
      items: settings.stations
    },
    shelfLife: {
      id: 'shelfLife',
      name: 'Shelf Life Options',
      items: settings.shelfLife
    },
    batchUnits: {
      id: 'batchUnits',
      name: 'Batch Units',
      items: settings.batchUnits
    },
    prepCategories: {
      id: 'prepCategories',
      name: 'Prep Categories',
      items: settings.prepCategories
    },
    ingredientCategories: {
      id: 'ingredientCategories',
      name: 'Ingredient Categories',
      items: settings.ingredientCategories
    },
    ingredientSubCategories: {
      id: 'ingredientSubCategories',
      name: 'Ingredient Sub-Categories',
      items: settings.ingredientSubCategories
    },
    volumeMeasures: {
      id: 'volumeMeasures',
      name: 'Volume Measures',
      items: settings.volumeMeasures
    },
    weightMeasures: {
      id: 'weightMeasures',
      name: 'Weight Measures',
      items: settings.weightMeasures
    },
    recipeUnits: {
      id: 'recipeUnits',
      name: 'Recipe Units',
      items: settings.recipeUnits
    },
    storageContainers: {
      id: 'storageContainers',
      name: 'Storage Containers',
      items: settings.storageContainers
    },
    containerTypes: {
      id: 'containerTypes',
      name: 'Container Types',
      items: settings.containerTypes
    },
    vendors: {
      id: 'vendors',
      name: 'Vendors',
      items: settings.vendors
    }
  };

  const handleAddItem = () => {
    if (!newItemValue.trim()) return;

    const category = configCategories[activeCategory];
    const updatedItems = [...category.items, newItemValue.trim()];

    updateSettings({
      ...settings,
      [activeCategory]: updatedItems
    });

    setNewItemValue('');
    toast.success(`Added new ${category.name.slice(0, -1)}`);
  };

  const handleRemoveItem = (index: number) => {
    const category = configCategories[activeCategory];
    const updatedItems = category.items.filter((_, i) => i !== index);

    updateSettings({
      ...settings,
      [activeCategory]: updatedItems
    });

    toast.success(`Removed ${category.name.slice(0, -1)}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Data Management</h1>
          <p className="text-gray-400">Configure system-wide lookup values and master lists</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {Object.values(configCategories).map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary-500/20 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {category.name}
              <span className="float-right text-sm">
                {category.items.length}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {configCategories[activeCategory].name}
              </h2>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemValue}
                    onChange={(e) => setNewItemValue(e.target.value)}
                    placeholder={`Add new ${configCategories[activeCategory].name.toLowerCase().slice(0, -1)}...`}
                    className="input"
                  />
                  <button
                    onClick={handleAddItem}
                    disabled={!newItemValue.trim()}
                    className="btn-primary"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {configCategories[activeCategory].items.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    No items added yet. Add your first {configCategories[activeCategory].name.toLowerCase().slice(0, -1)}.
                  </p>
                </div>
              ) : (
                configCategories[activeCategory].items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg group hover:bg-gray-800"
                  >
                    <span className="text-gray-300">{item}</span>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};