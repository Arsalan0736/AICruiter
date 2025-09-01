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
  const signInWithGoogle = async () =>{
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if(error){
      console.error('Error:', error.message);
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