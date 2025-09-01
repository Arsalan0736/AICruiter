import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2, Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider';
import { useBilling } from '@/context/BillingContext';
import { v4 as uuidv4 } from 'uuid';

function QuestionList({formData, onCreateLink}) {

    const [loading,setLoading]=useState(true);
    const [questionList,setQuestionList]=useState();
    const {user}=useUser();
    const { hasEnoughCredits, deductCredits } = useBilling();
    const [saveLoading,setSaveLoading]=useState(false);

    useEffect(()=>{
        if(formData){
            GenerateQuestionList();
        }
    },[formData])


    const GenerateQuestionList=async()=>{
      setLoading(true);
      try{
        const result=await axios.post('/api/ai-model',{
          ...formData
        })
        const content=result?.data?.content || '';
        console.log(content);

        // Extract JSON from code fences if present, else fall back to raw content
        const fenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        let jsonCandidate = fenceMatch ? fenceMatch[1] : content;

        let parsed;
        try{
          parsed = JSON.parse(jsonCandidate);
        } catch(err){
          // Fallback: slice from first { to last }
          const start = jsonCandidate.indexOf('{');
          const end = jsonCandidate.lastIndexOf('}');
          if(start!==-1 && end!==-1 && end>start){
            parsed = JSON.parse(jsonCandidate.slice(start, end+1));
          } else {
            throw err;
          }
        }

        const questions = parsed?.interviewQuestions;
        if(Array.isArray(questions)){
          setQuestionList(questions);
        } else {
          toast('Could not parse questions from AI response');
        }
      }
      catch(e){
        toast('Server Error, Try Again!')
      }
      finally{
        setLoading(false);
      }
    }

    const onFinish=async()=>{
      if (!hasEnoughCredits(1)) {
        toast.error('Insufficient credits. Please add more credits to create interviews.');
        return;
      }

      setSaveLoading(true);
      const interview_id=uuidv4();
      
      try {
        const { data, error } = await supabase
          .from('interviews')
          .insert([
            { ...formData,
              questionList: questionList,
              userEmail: user?.email,
              interview_id: interview_id
             },
          ])
          .select();

        if (error) throw error;

        // Deduct credits using the billing context
        const creditResult = await deductCredits(1);
        if (!creditResult.success) {
          toast.error('Failed to deduct credits. Please try again.');
          return;
        }

        toast.success('Interview created successfully! 1 credit deducted.');
        onCreateLink(interview_id);
      } catch (error) {
        console.error('Error creating interview:', error);
        toast.error('Failed to create interview. Please try again.');
      } finally {
        setSaveLoading(false);
      }
    }
  return (
    <div>
      {loading&&
      <div className='p-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex gap-5 items-center shadow-lg'>
        <Loader2Icon className='animate-spin text-purple-400'/>
        <div>
          <h2 className='font-medium text-white'>Generating Interview Questions</h2>
          <p className='text-purple-400'>Our AI is crafting personalized questions based on your job position</p>
        </div>       
      </div>
      }
      {questionList?.length>0&&
      <div>
          <QuestionListContainer questionList={questionList}/>
        </div>
        }
        <div className='flex justify-end mt-10'>
            <Button onClick={()=> onFinish()} disabled={saveLoading} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              {saveLoading&&<Loader2 className='animate-spin'/>}
              Create Interview Link & Finish</Button>
        </div>
        
    </div>
  )
}

export default QuestionList

