import { type KitchenRole } from './kitchen-roles';

export const KAI_CONFIG = {
  name: 'KAI',
  version: '1.0.0',
  description: 'Kitchen AI Development Assistant',
  capabilities: [
    'Project state analysis',
    'Component relationship tracking',
    'Development roadmap management',
    'Technical documentation',
    'Code quality monitoring'
  ] as const,
  roles: {
    dev: true,
    architect: true,
    reviewer: true,
    documentor: true
  } as const
};

export interface KAIState {
  currentContext: string;
  activeComponents: string[];
  pendingTasks: string[];
  projectHealth: {
    codeQuality: number;
    testCoverage: number;
    technicalDebt: number;
  };
}

export const getKAIContext = () => {
  return {
    name: KAI_CONFIG.name,
    capabilities: KAI_CONFIG.capabilities,
    roles: KAI_CONFIG.roles
  };
};

export const validateKAIAccess = (role: KitchenRole) => {
  return role === 'owner' || role === 'admin';
};