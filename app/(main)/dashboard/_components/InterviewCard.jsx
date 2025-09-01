import { Button } from '@/components/ui/button'
import { ArrowRight, Copy, Send } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'
function InterviewCard({interview, viewDetail=false}) {
    const url=process.env.NEXT_PUBLIC_HOST_URL+"/"+interview?.interview_id;
    const copyLink=()=>{      
        navigator.clipboard.writeText(url);
        toast('Copied')
    }

    const onSend=()=>{
        window.location.href="mailto:john@example.com?subject=AiCuiter Interview Link & body=Interview Link:"+url
    }

  return (
    <div className='p-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg'>
        <div className='flex items-center justify-between'>
            <div className='h-[40px] w-[40px] bg-gradient-to-r from-purple-600 to-blue-600 rounded-full'></div>
            <h2 className='text-sm text-gray-300'>{moment (interview?.created_at).format('DD MMM yyy')}</h2>
            
        </div>
        <h2 className='mt-3 font-bold text-lg text-white'>{interview?.jobPosition}</h2>
        <h2 className='mt-2 flex justify-between text-gray-300'>{interview?.duration}
            <span className='text-green-400'>{interview['interview-feedback']?.length} Candidates</span>
        </h2>
        {!viewDetail ? <div className='grid grid-cols-2 gap-3 w-full mt-5'>
            <Button variant='outline' className={'w-full flex items-center justify-center gap-2 border-white/30 text-white bg-purple-600 hover:bg-purple-700'} onClick={copyLink}>
                <Copy/> Copy Link
            </Button>
            <Button className={'w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0'} onClick={onSend}>
                <Send/> Send
            </Button>
        </div>
        : 
        <Link href={'/scheduled-interview/'+interview?.interview_id+'/details'}>
        <Button className='mt-5 w-full border-white/30 text-white bg-white/10' variant='outline'>View Detail <ArrowRight/> </Button>
        </Link>
        }
    </div>
  )
}

export default InterviewCard

