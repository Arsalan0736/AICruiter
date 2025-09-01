"use client"
import { useUser } from '@/app/provider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import { Video } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import InterviewCard from './InterviewCard';
import { toast } from 'sonner';

function LatestInterviewsList() {
  const [interviewList, setInterviewList] = useState([]);
  const {user}=useUser();
  useEffect(()=>{
    user&&GetInterviewList();
  },[user])
  const GetInterviewList=async()=>{
    
      let { data: interviews, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('userEmail',user?.email)
      .order('id',{ascending:false})
      .limit(6)
      
    console.log(interviews);
    setInterviewList(interviews);
  }

  
  return (
    <div className='my-5'>
      <h2 className='font-bold text-2xl text-white'>Previously Created Interviews</h2>

      {interviewList?.length==0&&
        <div className='p-5 flex flex-col gap-3 items-center mt-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg'>
          <Video className='w-10 h-10 text-purple-400'/>
          <h2 className='text-white'>You don't have any interview created!</h2>
          <Button className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0'>+ Create New Interview</Button>
        </div>}

        {interviewList&&
            <div className='grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5'>
                {interviewList.map((interview,index)=>(
                  <InterviewCard interview={interview} key={index}/>
                ))}
            </div>
        }
    </div>
  )
}

export default LatestInterviewsList

