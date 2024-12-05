import { AuthError } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export function handleAuthError(error: unknown, action: string) {
  // Log error for debugging
  console.error(`Auth error during ${action}:`, error);

  // Check network connectivity
  if (!navigator.onLine) {
    toast.error('No internet connection. Please check your network and try again.');
    return;
  }

  // Handle Supabase auth errors
  if (error instanceof AuthError) {
    switch (true) {
      case error.message.includes('Email not confirmed'):
        toast.error('Please verify your email address');
        break;
      case error.message.includes('Invalid login credentials'):
        toast.error('Invalid email or password');
        break;
      case error.message.includes('JWT'):
        toast.error('Your session has expired. Please sign in again.');
        break;
      case error.message.includes('rate limit'):
        toast.error('Too many attempts. Please try again later.');
        break;
      default:
        toast.error(error.message);
    }
    return;
  }

  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    toast.error('Unable to connect to authentication service. Please try again.');
    return;
  }

  // Generic error fallback
  toast.error(`Failed to ${action}. Please try again.`);
}