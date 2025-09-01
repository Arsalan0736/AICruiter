import { Button } from '@/components/ui/button'
import moment from 'moment/moment'
import React from 'react'
import CandidateFeedbackDialog from './CandidateFeedbackDialog'

function CandidateList({candidateList}) {
  return (
    <div className=''>
        <h2 className='font-bold my-5 text-white'> Candidates ({candidateList?.length})</h2>
        {candidateList?.map((candidate,index)=>(
            <div key={index} className='p-5 flex gap-3 items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg mb-3'>
                <div className='flex items-center gap-5'>
                    <h2 className='bg-gradient-to-r from-purple-600 to-blue-600 p-3 px-4.5 font-bold text-white rounded-full'>{candidate.userName[0]}</h2>
                    <div>
                        <h2 className='font-bold text-white'>{candidate?.userName}</h2>
                        <h2 className='text-sm text-gray-300'>Completed On: {moment (candidate?.created_at).format('MMM DD, yyyy')}</h2>
                    </div>
                </div>
                <div className='flex gap-3 items-center'>
                    <h2 className='text-green-400'>
                        {candidate?.feedback?.feedback?.rating ? 
                            (() => {
                                const avg = (candidate.feedback.feedback.rating.technicalSkills + 
                                           candidate.feedback.feedback.rating.communication + 
                                           candidate.feedback.feedback.rating.problemSolving + 
                                           candidate.feedback.feedback.rating.experience) / 4;
                                console.log(`${candidate.userName} ratings:`, candidate.feedback.feedback.rating, 'Average:', avg, 'Rounded:', Math.round(avg));
                                return Math.round(avg) + '/10';
                            })()
                            : 'N/A'
                        }
                    </h2>
                    <CandidateFeedbackDialog candidate={candidate}/>
                </div>
            </div>
        ))}
    </div>
  )
}

export default CandidateList