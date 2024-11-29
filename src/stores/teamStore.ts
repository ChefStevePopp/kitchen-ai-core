import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { TeamMemberData } from '@/features/team/types';
import toast from 'react-hot-toast';

interface TeamStore {
  members: TeamMemberData[];
  isLoading: boolean;
  isImporting: boolean;
  fetchTeamMembers: (organizationId: string) => Promise<void>;
  importTeam: (data: any[]) => Promise<void>;
  clearTeam: () => Promise<void>;
  saveTeam: () => Promise<void>;
  updateMember: (id: string, updates: Partial<TeamMemberData>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
}

const validateTeamData = (data: any[]) => {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: Expected an array');
  }

  const requiredColumns = [
    'First Name',
    'Last name',
    'Email',
    'Mobile phone',
    'Wage',
    'Punch ID',
    'Locations',
    'Departments',
    'Roles'
  ];

  const firstRow = data[0];
  if (!firstRow || typeof firstRow !== 'object') {
    throw new Error('Invalid data format: No valid rows found');
  }

  const missingColumns = requiredColumns.filter(col => !(col in firstRow));
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  // Generate unique IDs using timestamp and index
  const timestamp = Date.now();

  return data
    .filter(row => {
      const firstName = row['First Name']?.toString().trim();
      const lastName = row['Last name']?.toString().trim();
      return firstName && lastName;
    })
    .map((row, index) => ({
      id: `team-${timestamp}-${index}`,
      firstName: row['First Name']?.toString() || '',
      lastName: row['Last name']?.toString() || '',
      email: row['Email']?.toString() || '',
      phone: row['Mobile phone']?.toString() || '',
      punchId: row['Punch ID']?.toString() || '',
      locations: row['Locations']?.toString().split(',').map(l => l.trim()).filter(Boolean) || [],
      departments: row['Departments']?.toString().split(',').map(d => d.trim()).filter(Boolean) || [],
      roles: row['Roles']?.toString().split(',').map(r => r.trim()).filter(Boolean) || [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${row['First Name']}-${row['Last name']}`,
      lastUpdated: new Date().toISOString()
    }));
};

export const useTeamStore = create<TeamStore>((set, get) => ({
  members: [],
  isLoading: false,
  isImporting: false,

  fetchTeamMembers: async (organizationId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('organization_id', organizationId);

      if (error) throw error;
      set({ members: data || [] });
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      set({ isLoading: false });
    }
  },

  importTeam: async (data: any[]) => {
    set({ isImporting: true });
    try {
      const validatedData = validateTeamData(data);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('team_members')
        .upsert(
          validatedData.map(member => ({
            ...member,
            organization_id: user.user.user_metadata.organizationId
          })),
          { onConflict: 'organization_id,email' }
        );

      if (error) throw error;
      
      // Refresh the team list
      await get().fetchTeamMembers(user.user.user_metadata.organizationId);
      toast.success('Team data imported successfully');
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to import team data');
      throw error;
    } finally {
      set({ isImporting: false });
    }
  },

  clearTeam: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('organization_id', user.user.user_metadata.organizationId);

      if (error) throw error;
      
      set({ members: [] });
      toast.success('Team data cleared successfully');
    } catch (error) {
      console.error('Error clearing team:', error);
      toast.error('Failed to clear team data');
    }
  },

  saveTeam: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { members } = get();
      const { error } = await supabase
        .from('team_members')
        .upsert(
          members.map(member => ({
            ...member,
            organization_id: user.user.user_metadata.organizationId
          }))
        );

      if (error) throw error;
      toast.success('Team data saved successfully');
    } catch (error) {
      console.error('Error saving team:', error);
      toast.error('Failed to save team data');
    }
  },

  updateMember: async (id: string, updates: Partial<TeamMemberData>) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        members: state.members.map(member =>
          member.id === id ? { ...member, ...updates } : member
        )
      }));

      toast.success('Team member updated successfully');
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Failed to update team member');
    }
  },

  deleteMember: async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        members: state.members.filter(member => member.id !== id)
      }));

      toast.success('Team member deleted successfully');
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  }
}));