import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User,
  Building2, 
  Users, 
  Clock,
  FileText,
  HelpCircle,
  Share2,
  Shield,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDevAccess } from '@/hooks/useDevAccess';
import { ROUTES } from '@/config/routes';
import toast from 'react-hot-toast';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const { isDev } = useDevAccess();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate(ROUTES.AUTH.SIGN_IN);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (!user) return null;

  // Get display name from user metadata
  const firstName = user?.user_metadata?.firstName || user?.email?.split('@')[0] || 'User';

  const menuItems = [
    { icon: User, label: 'My Account', path: ROUTES.ADMIN.MY_ACCOUNT },
    { divider: true },
    { icon: Building2, label: 'Organization', path: ROUTES.ADMIN.ORGANIZATIONS },
    { icon: Users, label: 'Team', path: ROUTES.ADMIN.TEAM },
    { icon: Clock, label: 'Locations', path: ROUTES.ADMIN.LOCATIONS },
    { divider: true },
    { icon: FileText, label: 'Activity Log', path: ROUTES.ADMIN.ACTIVITY },
    { icon: HelpCircle, label: 'Help & Support', path: ROUTES.ADMIN.HELP },
    { icon: Share2, label: 'Refer a Friend', path: ROUTES.ADMIN.REFER },
    ...(isDev ? [
      { divider: true },
      { icon: Shield, label: 'Dev Management', path: ROUTES.ADMIN.DEV_MANAGEMENT }
    ] : [])
  ];

  return (
    <div className="relative z-[110]" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary-400" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-white">{firstName}</p>
          <p className="text-xs text-gray-400">
            {isDev ? 'Developer' : 'Organization Admin'}
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-gray-800 border border-gray-700 shadow-xl">
          <div className="p-2">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-white truncate">
                {user.email}
              </p>
              {isDev && (
                <span className="flex items-center gap-1 text-xs text-primary-400">
                  <Shield className="w-3 h-3" />
                  Developer Access
                </span>
              )}
            </div>

            <div className="border-t border-gray-700 my-2" />

            {menuItems.map((item, index) => 
              item.divider ? (
                <div key={`divider-${index}`} className="border-t border-gray-700 my-2" />
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            )}

            <div className="border-t border-gray-700 my-2" />

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};