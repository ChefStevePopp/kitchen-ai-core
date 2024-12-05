import { create } from 'zustand';
import type { KAIState } from '@/config/kai';

interface KAIStore extends KAIState {
  updateContext: (context: string) => void;
  addActiveComponent: (component: string) => void;
  removeActiveComponent: (component: string) => void;
  addPendingTask: (task: string) => void;
  removePendingTask: (task: string) => void;
  updateProjectHealth: (health: Partial<KAIState['projectHealth']>) => void;
}

export const useKAIStore = create<KAIStore>((set) => ({
  currentContext: 'initialization',
  activeComponents: [],
  pendingTasks: [],
  projectHealth: {
    codeQuality: 100,
    testCoverage: 85,
    technicalDebt: 15
  },

  updateContext: (context) => set({ currentContext: context }),
  
  addActiveComponent: (component) => set((state) => ({
    activeComponents: [...state.activeComponents, component]
  })),
  
  removeActiveComponent: (component) => set((state) => ({
    activeComponents: state.activeComponents.filter(c => c !== component)
  })),
  
  addPendingTask: (task) => set((state) => ({
    pendingTasks: [...state.pendingTasks, task]
  })),
  
  removePendingTask: (task) => set((state) => ({
    pendingTasks: state.pendingTasks.filter(t => t !== task)
  })),
  
  updateProjectHealth: (health) => set((state) => ({
    projectHealth: {
      ...state.projectHealth,
      ...health
    }
  }))
}));