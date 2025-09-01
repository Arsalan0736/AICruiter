import { Phone, Video } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function CreateOptions() {
  return (
    <div className='grid grid-cols-2 gap-5'>
        <Link href={'/dashboard/create-interview'} className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5 flex flex-col gap-2 cursor-pointer hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl'
        >
            <Video className='p-3 text-purple-400 bg-white/10 rounded-lg h-12 w-12'/>
            <h2 className='font-bold text-white'>Create New Interview</h2>
            <p className='text-gray-300'>Create AI Interviews and schedule them with candidates</p>
        </Link>
        <div className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5 shadow-lg'>
            <Phone className='p-3 text-purple-400 bg-white/10 rounded-lg h-12 w-12'/>
            <h2 className='font-bold text-white'>Create Phone Screening Call</h2>
            <p className='text-gray-300'>Schedule phone screening call with candidates</p>
        </div>
    </div>
  )
}

export default CreateOptions