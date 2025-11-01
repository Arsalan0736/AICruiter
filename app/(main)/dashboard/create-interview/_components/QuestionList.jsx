import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2, Loader2Icon } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';
import { supabase, testSupabaseConnection } from '@/services/supabaseClient';
import { useUser } from '@/app/provider';
import { useBilling } from '@/context/BillingContext';
import { v4 as uuidv4 } from 'uuid';

function QuestionList({formData, onCreateLink}) {
    const [loading, setLoading] = useState(true);
    const [questionList, setQuestionList] = useState();
    const {user} = useUser();
    const { hasEnoughCredits, deductCredits } = useBilling();
    const [saveLoading, setSaveLoading] = useState(false);

    const GenerateQuestionList = useCallback(async () => {
        setLoading(true);
        try {
            console.log('Generating questions for:', formData.jobPosition);
            
            const result = await axios.post('/api/ai-model', {
                ...formData
            }, {
                timeout: 30000 // 30 second timeout
            });

            // Check if the response has an error
            if (result.data.error) {
                throw new Error(result.data.error);
            }

            const content = result?.data?.content || '';
            console.log('AI Response:', content);

            if (!content) {
                throw new Error('No content received from AI service');
            }

            // Extract JSON from code fences if present, else fall back to raw content
            const fenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            let jsonCandidate = fenceMatch ? fenceMatch[1] : content;

            let parsed;
            try {
                parsed = JSON.parse(jsonCandidate);
            } catch(err) {
                // Fallback: slice from first { to last }
                const start = jsonCandidate.indexOf('{');
                const end = jsonCandidate.lastIndexOf('}');
                if(start !== -1 && end !== -1 && end > start){
                    parsed = JSON.parse(jsonCandidate.slice(start, end+1));
                } else {
                    throw new Error('Could not parse AI response as JSON');
                }
            }

            const questions = parsed?.interviewQuestions;
            if(Array.isArray(questions) && questions.length > 0){
                setQuestionList(questions);
                console.log('Questions generated successfully:', questions.length);
            } else {
                throw new Error('No valid questions found in AI response');
            }
        } catch(e) {
            console.error('Error generating questions:', e);
            toast.error(e.message || 'Failed to generate questions. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [formData]);

    useEffect(() => {
        if(formData){
            // Test Supabase connection first
            testSupabaseConnection().then(isConnected => {
                if (!isConnected) {
                    toast.error('Database connection failed. Please check your configuration.');
                }
            });
            GenerateQuestionList();
        }
    }, [formData, GenerateQuestionList]);

    const onFinish = useCallback(async () => {
        console.log('=== Starting interview creation process ===');
        console.log('User:', user);
        console.log('Form data:', formData);
        console.log('Question list:', questionList);
        console.log('Has enough credits:', hasEnoughCredits(1));

        // Validate prerequisites first (before setting loading state)
        if (!hasEnoughCredits(1)) {
            toast.error('Insufficient credits. Please add more credits to create interviews.');
            return;
        }

        if (!questionList || questionList.length === 0) {
            toast.error('No questions available. Please generate questions first.');
            return;
        }

        if (!user?.email) {
            toast.error('User not authenticated. Please log in again.');
            return;
        }

        // Check Supabase auth session
        let session;
        try {
            const { data: { session: sessionData }, error: sessionError } = await supabase.auth.getSession();
            console.log('Current session:', sessionData);
            console.log('Session error:', sessionError);
            
            if (!sessionData) {
                toast.error('No active session. Please log in again.');
                return;
            }
            session = sessionData;
        } catch (sessionErr) {
            console.error('Error checking session:', sessionErr);
            toast.error('Failed to verify authentication. Please log in again.');
            return;
        }

        setSaveLoading(true);
        const interview_id = uuidv4();
        
        try {
            console.log('Creating interview with ID:', interview_id);
            
            const interviewData = { 
                ...formData,
                questionList: questionList,
                userEmail: user?.email,
                interview_id: interview_id
            };
            
            console.log('Interview data to insert:', interviewData);
            
            console.log('Attempting to insert into Supabase...');
            const { data, error } = await supabase
                .from('interviews')
                .insert([interviewData])
                .select();

            console.log('Supabase response - Data:', data);
            console.log('Supabase response - Error:', error);
            
            if (error) {
                console.error('Supabase error details:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                
                // More specific error handling
                let errorMessage = 'Failed to save interview';
                if (error.code === 'PGRST116') {
                    errorMessage = 'Table "interviews" does not exist. Please create it in your Supabase database.';
                } else if (error.code === '42501') {
                    errorMessage = 'Permission denied. Please check your Supabase RLS policies.';
                } else if (error.message?.includes('JWT')) {
                    errorMessage = 'Authentication failed. Please log in again.';
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                throw new Error(errorMessage);
            }

            if (!data || data.length === 0) {
                throw new Error('No data returned from database');
            }

            console.log('Interview saved successfully:', data);

            // Deduct credits using the billing context
            console.log('Attempting to deduct credits...');
            const creditResult = await deductCredits(1);
            console.log('Credit deduction result:', creditResult);
            
            if (!creditResult.success) {
                console.error('Credit deduction failed:', creditResult.error);
                toast.error(`Failed to deduct credits: ${creditResult.error || 'Please try again.'}`);
                // Don't return here - the interview was created, just credit deduction failed
                // We'll still show success but note the credit issue
            } else {
                toast.success('Interview created successfully! 1 credit deducted.');
            }

            console.log('Calling onCreateLink with ID:', interview_id);
            
            // Call onCreateLink - this should update the step and show the interview link
            // Wrap in try-catch to ensure we handle any errors gracefully
            try {
                if (typeof onCreateLink === 'function') {
                    onCreateLink(interview_id);
                } else {
                    console.error('onCreateLink is not a function:', typeof onCreateLink);
                    toast.error('Failed to proceed to next step. Please refresh and try again.');
                }
            } catch (linkError) {
                console.error('Error calling onCreateLink:', linkError);
                toast.error('Interview created but failed to proceed to next step. Please refresh the page.');
            }
            
        } catch (error) {
            console.error('Error creating interview:', error);
            toast.error(error.message || 'Failed to create interview. Please try again.');
        } finally {
            setSaveLoading(false);
            console.log('=== Interview creation process completed ===');
        }
    }, [hasEnoughCredits, questionList, formData, user?.email, deductCredits, onCreateLink]);

    return (
        <div>
            {loading && (
                <div className='p-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex gap-5 items-center shadow-lg'>
                    <Loader2Icon className='animate-spin text-purple-400'/>
                    <div>
                        <h2 className='font-medium text-white'>Generating Interview Questions</h2>
                        <p className='text-purple-400'>Our AI is crafting personalized questions based on your job position</p>
                    </div>       
                </div>
            )}
            
            {questionList?.length > 0 && (
                <div>
                    <QuestionListContainer questionList={questionList}/>
                </div>
            )}
            
            <div className='flex justify-end mt-10'>
                <Button 
                    onClick={onFinish} 
                    disabled={saveLoading || !questionList || questionList.length === 0} 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saveLoading && <Loader2 className='animate-spin mr-2'/>}
                    Create Interview Link & Finish
                </Button>
            </div>
        </div>
    )
}

export default QuestionList

