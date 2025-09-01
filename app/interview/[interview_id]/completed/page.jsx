"use client";
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

function InterviewComplete() {
  const router = useRouter();

  return (
    <div className='p-20 lg:px-48 xl:px-56'>
      <div className='flex items-center justify-center'>
        <div className='bg-white rounded-2xl border shadow-sm w-full max-w-2xl overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-10 text-center relative'>
            <span className='absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary/10 animate-ping'/>
            <div className='mx-auto w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-md'>
              <CheckCircle2 className='w-9 h-9'/>
            </div>
            <h1 className='mt-6 text-2xl font-semibold'>Interview Completed</h1>
            <p className='mt-2 text-sm text-gray-500 flex items-center justify-center gap-1'>
              <Sparkles className='w-4 h-4 text-primary'/> Thanks for your time. We’ve recorded your responses.
            </p>
          </div>

          <div className='p-8 text-center space-y-6'>
            <p className='text-gray-600'>
              You can safely close this window now. We’ll notify you when your feedback is ready.
            </p>

            <div className='flex items-center justify-center gap-3'>
              <Button variant='secondary' className='gap-2' onClick={() => router.replace('/dashboard')}>
                <ArrowLeft className='w-4 h-4'/> Back to Dashboard
              </Button>
              <Button className='gap-2' onClick={() => router.replace('/dashboard/create-interview')}>
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