import { create } from 'zustand';
import type { TeamMemberData, TeamStore } from '../types';

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
      wages: row['Wage']?.toString().split(',').map(w => parseFloat(w)) || [],
      punchId: row['Punch ID']?.toString() || '',
      locations: row['Locations']?.toString().split(',').map(l => l.trim()).filter(Boolean) || [],
      departments: row['Departments']?.toString().split(',').map(d => d.trim()).filter(Boolean) || [],
      roles: row['Roles']?.toString().split(',').map(r => r.trim()).filter(Boolean) || [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${row['First Name']}-${row['Last name']}`,
      lastUpdated: new Date().toISOString()
    }));
};

export const useTeamStore = create<TeamStore>((set) => ({
  members: [],
  isLoading: false,
  isImporting: false,

  importTeam: async (data: any[]) => {
    set({ isImporting: true });
    try {
      const validatedData = validateTeamData(data);
      set({ members: validatedData });
    } finally {
      set({ isImporting: false });
    }
  },

  clearTeam: () => set({ members: [] }),

  saveTeam: async () => {
    // Implement save functionality here
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  updateMember: (id, updates) => set((state) => ({
    members: state.members.map(member =>
      member.id === id ? { ...member, ...updates } : member
    )
  })),

  deleteMember: (id) => set((state) => ({
    members: state.members.filter(member => member.id !== id)
  }))
}));