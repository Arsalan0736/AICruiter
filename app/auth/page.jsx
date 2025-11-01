'use client'
import React, { useEffect } from 'react';
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/provider';

const login = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  /**Used to sign in with google */
  const signInWithGoogle = async () => {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Supabase environment variables are missing');
        alert('Authentication is not properly configured. Please check your environment variables.');
        return;
      }

      // Ensure we have the origin (handle both client and server)
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      if (!origin) {
        console.error('Cannot determine origin');
        alert('Unable to determine the application URL. Please try again.');
        return;
      }

      // Construct the redirect URL properly
      const redirectUrl = `${origin}/auth/callback`;

      console.log('Initiating OAuth with redirect URL:', redirectUrl);
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      console.log('OAuth response - Data:', data);
      console.log('OAuth response - Error:', error);
      
      if (error) {
        console.error('OAuth Error:', error);
        console.error('OAuth Error Code:', error.status);
        console.error('OAuth Error Details:', JSON.stringify(error, null, 2));
        
        // Provide more helpful error messages based on error type
        let errorMessage = error.message || 'Unknown error occurred';
        
        // Check for specific error types
        if (error.message?.includes('DNS') || error.message?.includes('resolve') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
          errorMessage = 'Cannot reach authentication server. Please:\n\n' +
                        '1. Wait 2-3 minutes after resuming your Supabase project\n' +
                        '2. Refresh this page\n' +
                        '3. Try logging in again';
        } else if (error.message?.includes('redirect_uri_mismatch') || error.status === 400) {
          errorMessage = 'Configuration Error:\n\n' +
                        'Please add this redirect URL to your Supabase project:\n' +
                        redirectUrl + '\n\n' +
                        'Steps:\n' +
                        '1. Go to Supabase Dashboard\n' +
                        '2. Authentication → URL Configuration\n' +
                        '3. Add the redirect URL above to "Redirect URLs"\n' +
                        '4. Save and try again';
        } else if (error.message?.includes('provider_disabled') || error.status === 403) {
          errorMessage = 'Google OAuth is not enabled.\n\n' +
                        'Please enable Google provider in Supabase:\n' +
                        '1. Go to Supabase Dashboard\n' +
                        '2. Authentication → Providers\n' +
                        '3. Enable Google provider\n' +
                        '4. Configure Google OAuth credentials';
        } else {
          errorMessage = `Error: ${errorMessage}\n\n` +
                        'Please check:\n' +
                        '1. Supabase project is active\n' +
                        '2. Google OAuth provider is enabled\n' +
                        '3. Redirect URL is configured in Supabase';
        }
        
        alert(`Authentication failed:\n\n${errorMessage}`);
        return;
      } 
      
      if (data?.url) {
        // Redirect to the OAuth provider
        console.log('Redirecting to OAuth provider:', data.url);
        window.location.href = data.url;
      } else {
        console.error('OAuth initiated but no URL provided:', data);
        alert('OAuth initialization completed but no redirect URL was provided. Please check your Supabase OAuth configuration.');
      }
    } catch (err) {
      console.error('Unexpected error in signInWithGoogle:', err);
      
      let errorMessage = err.message || 'Please try again.';
      if (err.message?.includes('DNS') || err.message?.includes('resolve') || err.message?.includes('ERR_NAME_NOT_RESOLVED') || err.name === 'TypeError') {
        errorMessage = 'Network error: Cannot reach authentication server.\n\n' +
                      'If you just resumed your Supabase project, please:\n' +
                      '1. Wait 2-3 minutes for the project to fully initialize\n' +
                      '2. Refresh this page\n' +
                      '3. Try logging in again\n\n' +
                      'If the problem persists, check your Supabase dashboard to ensure the project is fully active.';
      }
      
      alert(`An unexpected error occurred: ${errorMessage}`);
    }
  }
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400'></div>
        <p className='mt-4 text-gray-300'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden'>
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className='flex flex-col items-center justify-center 
      bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl relative z-10'>
        <Image src="/logo.png" alt="logo" width={250} height={70} 
         className='w-[180px]'/>
         <div className='flex flex-col items-center'>
          <Image src={'/login.png'} alt="login" width={600} height={400}
          className='w-[400px] h-[250px] rounded-2xl shadow-lg'/>
          <h2 className='text-2xl font-bold text-center mt-5 text-white'>Welcome to AiCruiter</h2>
          <p className='text-gray-300 text-center'>Sign In With Google Authentication</p>
          <Button className='mt-7 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300'
          onClick={signInWithGoogle}
          >Login With Google</Button>
         </div>
      </div>
    </div>
  )
}

export default login