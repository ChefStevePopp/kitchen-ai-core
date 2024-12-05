import { useKAIStore } from '@/stores/kaiStore';
import { KAI_CONFIG, getKAIContext } from '@/config/kai';
import { useAuth } from './useAuth';

export function useKAI() {
  const { user } = useAuth();
  const kaiStore = useKAIStore();
  const context = getKAIContext();

  const canAccessKAI = user?.user_metadata?.role === 'dev' || 
                      user?.user_metadata?.role === 'owner';

  return {
    ...context,
    ...kaiStore,
    canAccessKAI,
    isInitialized: kaiStore.currentContext !== 'initialization',
    version: KAI_CONFIG.version
  };
}