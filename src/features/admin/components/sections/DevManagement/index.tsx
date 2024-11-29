import React, { useState, useEffect } from 'react';
import { Shield, Search, AlertTriangle, Check, X } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { useDevAccess } from '@/hooks/useDevAccess';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import toast from 'react-hot-toast';

interface DevUser {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    system_role?: 'dev' | 'user';
  };
}

export const DevManagement = () => {
  const [users, setUsers] = useState<DevUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isDev } = useDevAccess();
  const { showDiagnostics, setShowDiagnostics } = useDiagnostics();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      setUsers(users.users as DevUser[]);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDevStatus = async (userId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await removeUserDevStatus(userId);
      } else {
        await setUserAsDev(userId);
      }
      await loadUsers();
      toast.success(`Dev status ${currentStatus ? 'removed' : 'granted'}`);
    } catch (error) {
      console.error('Error updating dev status:', error);
      toast.error('Failed to update dev status');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isDev) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Access Restricted</h2>
        <p className="text-gray-400 text-center max-w-md">
          This section is only accessible to users with dev privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dev Management</h1>
          <p className="text-gray-400">Manage developer access and privileges</p>
        </div>
      </header>

      <div className="card p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Show Diagnostics</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showDiagnostics}
                onChange={(e) => setShowDiagnostics(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>

        <div className="bg-yellow-500/10 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 font-medium">Important Notice</p>
              <p className="text-sm text-gray-300 mt-1">
                Dev users have unrestricted access to all organizations and features. 
                Grant this access with caution.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-3 pl-4">User</th>
                <th className="pb-3">Created</th>
                <th className="pb-3">Dev Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-700">
                  <td className="py-4 pl-4">
                    <div>
                      <p className="text-white font-medium">{user.email}</p>
                      <p className="text-sm text-gray-400">ID: {user.id}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4">
                    {user.user_metadata?.system_role === 'dev' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400">
                        <Check className="w-3 h-3 mr-1" />
                        Dev Access
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-400">
                        <X className="w-3 h-3 mr-1" />
                        Standard User
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => toggleDevStatus(
                        user.id, 
                        user.user_metadata?.system_role === 'dev'
                      )}
                      className={`btn-ghost ${
                        user.user_metadata?.system_role === 'dev'
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-primary-400 hover:text-primary-300'
                      }`}
                    >
                      {user.user_metadata?.system_role === 'dev' 
                        ? 'Remove Dev Access' 
                        : 'Grant Dev Access'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};