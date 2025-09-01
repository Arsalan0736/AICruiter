import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { ArrowLeft, Calendar, Clock, Copy, List, Mail, Plus } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { toast } from 'sonner';

function InterviewLink({interviewId,formData}) {

    const url=process.env.NEXT_PUBLIC_HOST_URL+'/'+interviewId;

    const GetInterviewUrl=()=>{
        return url;
    }

    const onCopyLink=async()=>{
        await navigator.clipboard.writeText(url);
        toast('Link Copied');
    }

  return (
    <div className='flex flex-col items-center justify-center mt-10'>
        <Image src={'/check.png'} alt='check'
        width={200} height={200}
        className='w-[50px] h-[50px]'
        />
        <h2 className='font-bold text-lg mt-4 text-white'>Your AI Interview is Ready!</h2>
        <p className='mt-3 text-gray-300'>Share this link with your candidates to start the interview process</p>

        <div className='w-full p-7 mt-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg'>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-white'>Interview Link </h2>
                <h2 className='p-1 px-2 text-purple-400 bg-white/10 rounded-4xl border border-white/20'>Valid for 30 Days</h2>    
            </div>
            <div className='mt-3 flex gap-3 items-center'>
                <Input defaultValue={GetInterviewUrl()} disabled={true} className="bg-white/10 border-white/30 text-white"/>
                <Button onClick={()=>onCopyLink()} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"> <Copy/> Copy Link </Button>
            </div>
            <hr className='my-5 border-white/20'/>
            <div className='flex gap-5'>
                <h2 className='text-sm text-gray-300 flex gap-2 items-center'><Clock className='h-4 w-4'/>  {formData?.duration} </h2>
                <h2 className='text-sm text-gray-300 flex gap-2 items-center'><List className='h-4 w-4'/>  10 Questions </h2>
                {/* <h2 className='text-sm text-gray-500 flex gap-2 items-center'><Calendar className='h-4 w-4'/> 30 Min {formData?.duration} </h2> */}
            </div>

        </div>
        <div className='mt-7 bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-lg w-full shadow-lg'>
            <h2 className='font-bold text-white'>Share Via</h2>
            <div className='flex gap-7 mt-2'>
                <Button variant={'outline'} className='border-white/30 text-white bg-purple-600 '> <Mail/> Email </Button>
                <Button variant={'outline'} className='border-white/30 text-white bg-purple-600 '> <Mail/> Slack </Button>
                <Button variant={'outline'} className='border-white/30 text-white bg-purple-600 '> <Mail/> WhatsApp </Button>
            </div>
        </div>
        <div className='flex w-full gap-5 justify-between mt-6'>
            <Link href={'/dashboard'}>
                <Button variant={'outline'} className="border-white/30 text-white bg-purple-600 "> <ArrowLeft/> Back to Dashboard </Button>
            </Link>
            <Link href={'/create-interview'}>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"> <Plus/> Create New Interview </Button>
            </Link>
        </div>
    </div>
  )
}

export default InterviewLink;
