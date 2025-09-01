"use client";
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

function InterviewComplete() {
  const router = useRouter();

  return (
    <div className='p-20 lg:px-48 xl:px-56 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen'>
      <div className='flex items-center justify-center'>
        <div className='bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl w-full max-w-2xl overflow-hidden'>
          <div className='bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-10 text-center relative'>
            <span className='absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-purple-400/20 animate-ping'/>
            <div className='mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-lg'>
              <CheckCircle2 className='w-9 h-9'/>
            </div>
            <h1 className='mt-6 text-2xl font-semibold text-white'>Interview Completed</h1>
            <p className='mt-2 text-sm text-gray-300 flex items-center justify-center gap-1'>
              <Sparkles className='w-4 h-4 text-purple-400'/> Thanks for your time. We've recorded your responses.
            </p>
          </div>

          <div className='p-8 text-center space-y-6'>
            <p className='text-gray-300'>
              You can safely close this window now. We'll notify you when your feedback is ready.
            </p>

            <div className='flex items-center justify-center gap-3'>
              <Button variant='outline' className='gap-2 border-white/30 text-white hover:bg-white/10' onClick={() => router.replace('/dashboard')}>
                <ArrowLeft className='w-4 h-4'/> Back to Dashboard
              </Button>
              <Button className='gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300' onClick={() => router.replace('/dashboard/create-interview')}>
                Start New Interview <ArrowRight className='w-4 h-4'/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewComplete