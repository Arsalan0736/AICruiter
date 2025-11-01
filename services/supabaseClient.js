import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  throw new Error('Supabase configuration is missing');
}

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');
}

// Suppress console errors for token refresh failures (expected with stale tokens)
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    // Filter out Supabase token refresh errors (these are non-critical)
    const message = args.join(' ');
    const isTokenRefreshError = 
      message.includes('/auth/v1/token') && 
      message.includes('grant_type=refresh_token') ||
      message.includes('ERR_NAME_NOT_RESOLVED') && message.includes('supabase.co');
    
    if (!isTokenRefreshError) {
      originalError.apply(console, args);
    }
    // Silently ignore token refresh errors - they're handled gracefully
  };
}

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'sb-auth-token',
      },
    }
)

// Helper function to clear invalid/stale tokens
export const clearStaleSession = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear Supabase auth storage keys directly
    // This prevents token refresh errors from stale tokens
    if (window.localStorage) {
      // Clear all Supabase-related storage keys
      Object.keys(window.localStorage).forEach(key => {
        if (key.startsWith('sb-') || 
            key.startsWith('supabase.auth.token') ||
            key.includes('supabase') && key.includes('auth')) {
          try {
            window.localStorage.removeItem(key);
          } catch (e) {
            // Ignore localStorage errors
          }
        }
      });
    }
  } catch (err) {
    // Silently handle errors - this is just cleanup
  }
}

// Test function to verify Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('interviews').select('count').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    console.log('Supabase connection test successful');
    return true;
  } catch (err) {
    console.error('Supabase connection test error:', err);
    return false;
  }
}
