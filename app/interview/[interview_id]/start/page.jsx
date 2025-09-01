"use client";
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { Loader2Icon, Mic, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Vapi from '@vapi-ai/web';
import AlertConformation from './_components/AlertConformation';
import { toast } from 'sonner';
import axios from 'axios';
import { supabase } from '@/services/supabaseClient';
import { useParams, useRouter } from 'next/navigation';



function StartInterview() {
  const {interviewInfo,setInterviewInfo}=useContext(InterviewDataContext);
  const [vapi, setVapi] = useState(null);
  const [activeUser,setActiveUser]=useState(false);
  const [conversation,setConversation]=useState();
  const conversationRef = useRef();
  const [messages,setMessages]=useState([]);
  const messagesRef = useRef([]);
  const feedbackToastId = useRef(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const {interview_id}=useParams();
  const router=useRouter();

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Format timer to HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize Vapi when component mounts
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) return;

    let instance;
    // Handlers are defined in this scope so we can remove them in cleanup
    const handleCallStart = () => {
      console.log("Call has started.");
      toast("Call Connected....")
    };
    const handleSpeechStart = () => {
      console.log("Assistant speech has started.");
      setActiveUser(false);
    };
    const handleSpeechEnd = () => {
      console.log("Assistant speech has ended.");
      setActiveUser(true);
    };
    const handleCallEnd = () => {
      console.log("Call has ended.");
      setIsTimerRunning(false);
      toast("Interview Ended",{duration:1500});
      setTimeout(() => {
        const conv = conversationRef.current;
        const msgsCount = messagesRef.current.length;
        console.log('Generating feedback after call end. Conversation present:', !!conv, 'Messages collected:', msgsCount);
        GenerateFeedback()
      }, 2000);
    };
    const handleMessage = (message) => {
      console.log("Message received:", message);
      setMessages(prev=>{
        const next = [...prev, message];
        messagesRef.current = next;
        return next;
      });
      if (message?.conversation) {
        setConversation(message.conversation);
        conversationRef.current = message.conversation;
        console.log("Conversation updated:", message.conversation);
      }
    };
    const handleError = (error) => {
      console.error("Vapi error:", error);
      const errorMessage = typeof error === 'string' ? error : (error?.errorMsg || error?.message || 'Unknown error');
      if (String(errorMessage).toLowerCase().includes('ejection') || String(errorMessage).toLowerCase().includes('meeting has ended')) {
        toast.error("Meeting ended. Please restart the interview.");
        setIsTimerRunning(false);
      } else {
        toast.error("Voice connection error. Please try again.");
      }
    };

    try {
      instance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
      setVapi(instance);
      setIsInitialized(true);

      instance.on("call-start", handleCallStart);
      instance.on("speech-start", handleSpeechStart);
      instance.on("speech-end", handleSpeechEnd);
      instance.on("call-end", handleCallEnd);
      instance.on("message", handleMessage);
      instance.on("error", handleError);
    } catch (error) {
      console.error("Failed to initialize Vapi:", error);
      toast.error("Failed to initialize voice system");
    }

    return () => {
      try {
        if (instance && typeof instance.off === 'function') {
          instance.off("call-start", handleCallStart);
          instance.off("speech-start", handleSpeechStart);
          instance.off("speech-end", handleSpeechEnd);
          instance.off("call-end", handleCallEnd);
          instance.off("message", handleMessage);
          instance.off("error", handleError);
        }
        if (instance && typeof instance.stop === 'function') {
          try { instance.stop(); } catch {}
        }
      } catch (e) {
        console.error('Error during Vapi cleanup:', e);
      }
    }
  }, []);

  useEffect(()=>{
    if (interviewInfo && isInitialized && vapi) {
      startCall();
    }
  },[interviewInfo, isInitialized, vapi])

  const startCall=async()=>{
    if (!vapi || !isInitialized) {
      toast.error("Voice system not ready. Please wait...");
      return;
    }

    // Ensure microphone permission before starting
    try {
      // Some browsers require an explicit permission request prior to starting any audio session
      // We request audio access and immediately stop the tracks; this also surfaces permission errors early.
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.getTracks().forEach(track => track.stop());
    } catch (permErr) {
      console.error("Microphone permission error:", permErr);
      toast.error("Microphone access is required to start the interview");
      return;
    }

    // Start the timer when the call begins
    setIsTimerRunning(true);
    setTimer(0);
    setIsMuted(false);
    setMessages([]);
    
    let questionList = "";
    interviewInfo?.interviewData?.questionList.forEach((item,index)=>{
      questionList = item?.question + "," + questionList;
    });
    
    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: "Hi "+interviewInfo?.userName+", how are you? Ready for your interview on "+interviewInfo?.interviewData?.jobPosition,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
    You are an AI voice assistant conducting interviews.
    Your job is to ask candidates provided interview questions, assess their responses.
    Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
    "Hey there! Welcome to your `+interviewInfo?.interviewData?.jobPosition+` interview, Let's get started with a few questions!"
    Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
    Questions: `+questionList+`
    If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
    "Need a hint? Think about how React tracks component updates!"
    Provide brief, encouraging feedback after each answer. Example:
    "Nice! That's a solid answer."
    "Hmm, not quite! Want to try again?"
    Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
    After 5–7 questions, wrap up the interview smoothly by summarizing their performance. Example:
    "That was great! You handled some tough questions well. Keep sharpening your skills!"
    End on a positive note:
    "Thanks for chatting! Hope to see you crushing projects soon!"
    Key Guidelines:
    ✔️ Be friendly, engaging, and witty
    ✔️ Keep responses short and natural, like a real conversation
    ✔️ Adapt based on the candidate's confidence level
    ✔️ Ensure the interview remains focused on React
    `.trim(),
          },
        ],
      },
    };
    
    try {
      vapi.start(assistantOptions);
    } catch (error) {
      console.error("Failed to start call:", error);
      toast.error("Failed to start interview. Please try again.");
      setIsTimerRunning(false);
    }
  }

  const stopInterview=()=>{
    // Stop the timer when the interview ends
    setIsTimerRunning(false);
    setIsMuted(false);
    setLoading(true);
    if (vapi) {
      try {
        vapi.stop();
      } catch (error) {
        console.error("Failed to stop interview:", error);
      }
    }
  }

  const toggleMute = async () => {
    if (!vapi) return;
    try {
      const next = !isMuted;
      if (typeof vapi.setMuted === 'function') {
        await vapi.setMuted(next);
      }
      setIsMuted(next);
      toast(next ? 'Microphone muted' : 'Microphone unmuted');
    } catch (err) {
      console.error('Failed to toggle mute:', err);
      toast.error('Unable to change microphone state');
    }
  }



    const GenerateFeedback=async()=>{
    console.log("GenerateFeedback called with conversation:", conversationRef.current);
    
    // Prefer conversation from Vapi; fall back to collected messages
    let payloadConversation = conversationRef.current || conversation;
    if ((!payloadConversation || payloadConversation.length === 0) && messages.length > 0) {
      payloadConversation = messagesRef.current.length ? messagesRef.current : messages;
      console.log('Falling back to collected messages for feedback. Count:', payloadConversation.length);
    }

    if (!payloadConversation || (Array.isArray(payloadConversation) && payloadConversation.length === 0)) {
      toast.error("No conversation data available for feedback");
      return;
    }

    // Show loading state (single controlled toast)
    if (!feedbackToastId.current) {
      feedbackToastId.current = toast.loading("Generating interview feedback...");
    }

    try {
      const result = await axios.post('/api/ai-feedback',{
        conversation: payloadConversation
      });
      
      if (result?.data?.content) {
        const Content = result.data.content;
        const FINAL_CONTENT = Content.replace('```json','').replace('```','');
        console.log("Feedback generated:", FINAL_CONTENT);
        
        // Parse the JSON feedback
        try {
          const feedbackData = JSON.parse(FINAL_CONTENT);
          console.log("Parsed feedback:", feedbackData);
          if (feedbackToastId.current) {
            toast.success("Interview feedback generated successfully!", { id: feedbackToastId.current });
            feedbackToastId.current = null;
          } else {
            toast.success("Interview feedback generated successfully!");
          }
          setLoading(false);
          // You can store this feedback or display it to the user

          
          const { data, error } = await supabase
              .from('interview-feedback')
              .insert([
                { userName: interviewInfo?.userName, 
                  userEmail: interviewInfo?.userEmail,
                  interview_id: interview_id,
                  feedback:JSON.parse(FINAL_CONTENT),
                  recommended:false
                },
              ])
              .select()

          console.log(data);
              router.replace('/interview/'+interview_id+"/completed");
          
        
        } catch (parseError) {
          console.error("Failed to parse feedback JSON:", parseError);
          if (feedbackToastId.current) {
            toast.error("Feedback generated but format is invalid", { id: feedbackToastId.current });
            feedbackToastId.current = null;
          } else {
            toast.error("Feedback generated but format is invalid");
          }
          setLoading(false);
        }
      } else {
        if (feedbackToastId.current) {
          toast.error("No feedback content received", { id: feedbackToastId.current });
          feedbackToastId.current = null;
        } else {
          toast.error("No feedback content received");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to generate feedback:", error);
      const message = error.response?.data?.error
        || (error.response?.status === 500 ? "Server error while generating feedback. Please try again." : "Failed to generate feedback. Please try again.");
      if (feedbackToastId.current) {
        toast.error(message, { id: feedbackToastId.current });
        feedbackToastId.current = null;
      } else {
        toast.error(message);
      }
      setLoading(false);
    }
  }

  return (
    <div className='p-20 lg:px-48 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between'>
        AI Interview Session
        <span className='flex gap-2 items-center'>
          <Timer/>
          {formatTime(timer)}
        </span>
      </h2>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
        <div className='bg-white h-[400px] rounded-lg border flex
        flex-col gap-3 items-center justify-center'>
          <div className='relative'>
            {!activeUser&&<span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping'/>}
          <Image src={'/ai.jpg'} alt='ai'
            width={100} height={100}
            className='w-[60px] h-[60px] rounded-full object-cover'
          />
          </div>
          <h2>AI Recruiter</h2>
        </div>

        <div className='bg-white h-[400px] rounded-lg border flex
        flex-col gap-3 items-center justify-center'>
          <div className='relative flex items-center justify-center'>
              {activeUser&&<span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping'/>}         
              <h2 className='text-2xl bg-primary text-white h-[50px] w-[50px]
                rounded-full flex items-center justify-center'>{interviewInfo?.userName[0]}
              </h2>
          </div>
          <h2>{interviewInfo?.userName}</h2>
        </div>
      </div>

      <div className='flex items-center gap-5 justify-center mt-7'>
        <Mic onClick={toggleMute} className={`h-12 w-12 p-3 rounded-full cursor-pointer ${isMuted ? 'bg-gray-300 text-gray-600' : 'bg-gray-500 text-white'}`}/>
        {/* <AlertConformation stopInterview={()=>stopInterview()}> */}
            {!loading?<Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer'
              onClick={()=>stopInterview()}
            />:<Loader2Icon className='animate-spin'/>}
        {/*</AlertConformation>*/}
        
      </div>
             <h2 className='text-sm text-gray-400 text-center mt-5'>
         {!isInitialized ? 'Initializing voice system...' : 
          isTimerRunning ? 'Interview in Progress...' : 'Ready to start interview'}
       </h2>
    </div>
  )
}

export default StartInterview



