import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vcfigkwtsqvrvahfprya.supabase.co';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZmlna3d0c3F2cnZhaGZwcnlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjE0Njk3MCwiZXhwIjoyMDQ3NzIyOTcwfQ.mOCopDi8r7iclknK3DtPOf5wEFhaq3uVoZHTd0dkVx8';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase admin environment variables, using development defaults');
}

// Admin client with service role key - use only for admin operations
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);