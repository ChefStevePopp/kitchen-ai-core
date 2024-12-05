import { AuthError } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export class SupabaseError extends Error {
  code?: string;
  details?: string;
  hint?: string;

  constructor(message: string, error?: any) {
    super(message);
    this.name = 'SupabaseError';
    if (error) {
      this.code = error.code;
      this.details = error.details;
      this.hint = error.hint;
    }
  }
}

export function handleAuthError(error: any, action: string) {
  console.error(`${action} error:`, error);
  
  // Check network connectivity first
  if (!navigator.onLine) {
    toast.error('No internet connection. Please check your network and try again.');
    return;
  }

  // Handle Supabase-specific errors
  if (error instanceof SupabaseError) {
    toast.error(error.message);
    return;
  }

  // Handle auth errors
  if (error instanceof AuthError) {
    switch (true) {
      case error.message.includes('Email not confirmed'):
        toast.error('Please verify your email address before signing in.');
        break;
      case error.message.includes('Invalid login credentials'):
        toast.error('Invalid email or password.');
        break;
      case error.message.includes('JWT'):
        toast.error('Your session has expired. Please sign in again.');
        break;
      default:
        toast.error(error.message);
    }
    return;
  }

  // Handle database errors
  if (error.code?.startsWith('PGRST')) {
    toast.error('Database error. Please try again.');
    return;
  }

  // Handle connection errors
  if (['ECONNREFUSED', 'ETIMEDOUT'].includes(error.code)) {
    toast.error('Unable to connect to the server. Please try again later.');
    return;
  }

  // Handle rate limiting
  if (error.code === '429') {
    toast.error('Too many attempts. Please try again later.');
    return;
  }

  // Handle timeout errors
  if (error.name === 'AbortError') {
    toast.error('Request timed out. Please try again.');
    return;
  }

  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    toast.error('Network error. Please check your connection and try again.');
    return;
  }

  // Generic error fallback
  toast.error(`Failed to ${action.toLowerCase()}`);
}

// Helper to wrap Supabase queries with error handling
export async function withErrorHandling<T>(
  promise: Promise<{ data: T | null; error: any }>,
  action = 'perform operation'
): Promise<T> {
  try {
    const { data, error } = await promise;
    if (error) throw error;
    if (!data) throw new Error('No data returned');
    return data;
  } catch (error) {
    handleAuthError(error, action);
    throw error;
  }
}