import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { InterviewType } from '@/services/Constants'
import { ArrowRight, Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'

function FormContainer({onHandleInputChange, GoToNext}) {
    const [interviewType,setInterviewType]=useState([]);
    useEffect(()=>{
        if(interviewType){
            onHandleInputChange('type',interviewType)
        }
    },[interviewType])

    const AddInterviewType=(type)=>{
        console.log('Current interviewType:', interviewType);
        console.log('Adding/removing:', type.title);
        const data=interviewType.includes(type.title);
        if(!data){
            setInterviewType(prev=>[...prev,type.title])
        }else{
            const result = interviewType.filter(item=>item!=type.title);
            setInterviewType(result);
        }
    }

  return (
    <div className='p-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg'>
        <div>
            <h2 className='text-sm font-medium text-white'>Job Position</h2>
            <Input placeholder="e.g. Full Stack Developer"
            className='mt-2 bg-white/10 border-white/30 text-white placeholder:text-gray-300' 
            onChange={(event)=>onHandleInputChange('jobPosition',event.target.value)}/>
        </div>

        <div className='mt-5'>
            <h2 className='text-sm font-medium text-white'>Job Description</h2>
            <Textarea placeholder="Enter details job description" 
            className='h-[200px] mt-2 bg-white/10 border-white/30 text-white placeholder:text-gray-300'
            onChange={(event)=>onHandleInputChange('jobDescription',event.target.value)}/>
        </div>

        <div className='mt-5'>
            <h2 className='text-sm font-medium text-white'>Interview Duration</h2>
            <Select onValueChange={(value)=>onHandleInputChange('duration',value)}>
                <SelectTrigger className="w-full mt-2 bg-white/10 border-white/30 text-white">
                    <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                    <SelectItem value="5 Min" className="text-white hover:bg-white/10">5 Min</SelectItem>
                    <SelectItem value="15 Min" className="text-white hover:bg-white/10">15 Min</SelectItem>
                    <SelectItem value="30 Min" className="text-white hover:bg-white/10">30 Min</SelectItem>
                    <SelectItem value="45 Min" className="text-white hover:bg-white/10">45 Min</SelectItem>
                    <SelectItem value="60 Min" className="text-white hover:bg-white/10">60 Min</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className='mt-5'>
            <h2 className='text-sm font-medium text-white'>Interview Type</h2>
            <div className='flex gap-3 flex-wrap mt-2'>
                {InterviewType.map((type,index) => (
                    <div key={index} 
                    className={`flex items-center cursor-pointer
                     gap-2 p-1 px-2 bg-white/10 border border-white/30 
                     rounded-2xl hover:bg-white/20 transition-all duration-300
                     ${interviewType.includes(type.title)&&'bg-purple-600/50 text-white border-purple-400'}`}
                                           onClick={()=>AddInterviewType(type)}>
                        {React.createElement(type.icon, { className: "h-4 w-4" })}
                        <span className="text-white">{type.title}</span>
                    </div>
                ))}
            </div>
        </div>
        <div className='mt-7 flex justify-end' onClick={()=>GoToNext()}>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">Genarate Questions <ArrowRight/></Button>
        </div>
        
    </div>
  )
}

export default FormContainer

