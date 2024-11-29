import React from 'react';
import { Shield, Users, Lock, Plus } from 'lucide-react';

export const PermissionsManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Permissions Manager</h1>
        <button className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Create Role
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Roles</p>
              <p className="text-2xl font-bold text-white">4</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Permission Sets</p>
              <p className="text-2xl font-bold text-white">6</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Role Management</h2>
        <div className="space-y-4">
          {[
            { name: 'Head Chef', users: 1, permissions: ['all'] },
            { name: 'Sous Chef', users: 2, permissions: ['inventory.view', 'inventory.edit', 'recipes.view'] },
            { name: 'Line Cook', users: 4, permissions: ['recipes.view', 'tasks.view'] },
            { name: 'Prep Cook', users: 3, permissions: ['recipes.view', 'tasks.view'] }
          ].map((role) => (
            <div key={role.name} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-white">{role.name}</h3>
                  <p className="text-sm text-gray-400">
                    {role.users} {role.users === 1 ? 'user' : 'users'} assigned
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-ghost px-3 py-1">Edit</button>
                  {role.name !== 'Head Chef' && (
                    <button className="btn-ghost px-3 py-1 text-red-400">
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionsManager;