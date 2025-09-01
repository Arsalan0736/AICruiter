import React from 'react'

function QuestionListContainer({questionList}) {
  return (
    <div>
        <h2 className='font-bold text-lg mb-5 text-white'>Generated Interview Questions: </h2>
        <div className='p-5 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm shadow-lg'>
          {questionList.map((item,index)=>(
              <div key={index} className='p-3 border border-white/20 rounded-xl mb-3 bg-white/5'>
                  <h2 className='font-medium text-white'>{item.question}</h2>
                  <h2 className='text-sm text-purple-400'>Type: {item?.type}</h2>
              </div>
          ))}
        </div>
    </div>
  )
}

export default QuestionListContainer