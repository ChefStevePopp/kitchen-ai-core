import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';
import type { SystemRole, OrganizationRole } from '@/types/auth';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check if user has dev system role
  const isDev = Boolean(
    user?.user_metadata?.system_role === 'dev' || 
    user?.raw_user_meta_data?.system_role === 'dev'
  );

  // Check if user has admin access (isDev OR owner/admin org role)
  const hasAdminAccess = Boolean(
    isDev || 
    user?.user_metadata?.role === 'owner' || 
    user?.user_metadata?.role === 'admin'
  );

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return {
    user,
    isLoading,
    isDev,           // System-level dev access
    hasAdminAccess,  // Combined admin access check
    signOut
  };
}