import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User,
  Building2, 
  Users, 
  Clock,
  FileText,
  HelpCircle,
  Share2,
  Shield,
  Database,
  UtensilsCrossed,
  Package
} from 'lucide-react';
import { useDevAccess } from '@/hooks/useDevAccess';
import { ROUTES } from '@/config/routes';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { isDev } = useDevAccess();
  
  const menuItems = [
    {
      id: 'account',
      label: 'Account',
      items: [
        { icon: User, label: 'My Account', path: '/admin/my-account' }
      ]
    },
    {
      id: 'team',
      label: 'Team',
      items: [
        { icon: Users, label: 'Team Management', path: '/admin/team' },
        { icon: Clock, label: 'Notifications', path: '/admin/notifications' },
        { icon: Shield, label: 'Permissions', path: '/admin/permissions' }
      ]
    },
    {
      id: 'organization',
      label: 'Organization',
      items: [
        { icon: Building2, label: 'Organization', path: '/admin/organizations' },
        { icon: FileText, label: 'Activity Log', path: '/admin/activity' }
      ]
    },
    { 
      id: 'data',
      label: 'Data Management',
      items: [
        { icon: Database, label: 'Master Ingredients', path: '/admin/excel-imports#ingredients' },
        { icon: UtensilsCrossed, label: 'Prepared Items', path: '/admin/excel-imports#prepared' },
        { icon: Package, label: 'Food Inventory', path: '/admin/excel-imports#inventory' }
      ]
    },
    {
      id: 'support',
      label: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', path: '/admin/help' },
        { icon: Share2, label: 'Refer a Friend', path: '/admin/refer' }
      ]
    }
  ];

  if (isDev) {
    menuItems.push({
      id: 'dev',
      label: 'Development',
      items: [
        { icon: Shield, label: 'Dev Management', path: '/admin/dev-management' }
      ]
    });
  }

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="https://www.restaurantconsultants.ca/wp-content/uploads/2023/03/cropped-AI-CHEF-BOT.png"
            alt="KITCHEN AI"
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-xl font-semibold text-white">KITCHEN AI</h1>
            <h2 className="text-xs font-status text-primary-400">ADMIN</h2>
          </div>
        </div>

        <nav className="space-y-8">
          {menuItems.map((section, index) => (
            <div key={section.id}>
              {index > 0 && <div className="border-t border-gray-800 my-8" />}
              {section.id !== 'account' && (
                <h3 className="text-xs font-status font-medium text-primary-400/80 uppercase tracking-wider mb-3">
                  {section.label}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};