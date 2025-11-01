'use client'
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL params
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          console.error('OAuth error in callback:', errorParam, errorDescription);
          setError(errorDescription || errorParam);
          setTimeout(() => {
            router.push('/auth');
          }, 3000);
          return;
        }

        // Supabase automatically handles the OAuth callback from URL hash
        // We just need to wait for the session to be set
        let attempts = 0;
        const maxAttempts = 10;
        
        const checkSession = async () => {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Error getting session:', sessionError);
            setError(sessionError.message);
            setTimeout(() => {
              router.push('/auth');
            }, 3000);
            return;
          }

          if (session) {
            // User is authenticated, redirect to dashboard
            console.log('Authentication successful, redirecting to dashboard');
            router.push('/dashboard');
          } else if (attempts < maxAttempts) {
            // Wait a bit and try again (OAuth callback might need a moment)
            attempts++;
            setTimeout(checkSession, 500);
          } else {
            // Timeout - redirect to auth page
            console.log('Session timeout, redirecting to auth');
            setError('Authentication timed out. Please try again.');
            setTimeout(() => {
              router.push('/auth');
            }, 3000);
          }
        };

        // Start checking for session
        checkSession();
      } catch (err) {
        console.error('Error handling auth callback:', err);
        setError(err.message || 'An unexpected error occurred');
        setTimeout(() => {
          router.push('/auth');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center'>
      {error ? (
        <>
          <div className='text-red-400 text-center mb-4'>
            <p className='text-lg font-semibold'>Authentication Error</p>
            <p className='text-sm mt-2'>{error}</p>
            <p className='text-xs mt-4 text-gray-400'>Redirecting to login...</p>
          </div>
        </>
      ) : (
        <>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400'></div>
          <p className='mt-4 text-gray-300'>Completing authentication...</p>
        </>
      )}
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400'></div>
        <p className='mt-4 text-gray-300'>Loading...</p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

