import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai"

export async function POST(req) {
    try {
        const {jobPosition,jobDescription,duration,type} = await req.json();
        
        // Validate required fields
        if (!jobPosition || !jobDescription || !duration || !type) {
            return NextResponse.json(
                { error: "Missing required fields: jobPosition, jobDescription, duration, type" },
                { status: 400 }
            );
        }

        // Check for API key
        if (!process.env.OPENROUTER_API_KEY) {
            console.error("OPENROUTER_API_KEY is not configured");
            return NextResponse.json(
                { error: "AI service is not configured" },
                { status: 500 }
            );
        }

        const FINAL_PROMPT = QUESTIONS_PROMPT
            .replace('{{jobTitle}}', jobPosition)
            .replace('{{jobDescription}}', jobDescription)
            .replace('{{duration}}', duration)
            .replace('{{type}}', type);

        console.log('Generating questions for:', jobPosition);

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [
                {role: "user", content: FINAL_PROMPT}
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const response = completion.choices[0]?.message;
        
        if (!response || !response.content) {
            throw new Error("No response from AI service");
        }

        console.log('AI Response received');
        return NextResponse.json(response);
        
    } catch (error) {
        console.error("AI Model API Error:", error);
        
        // Return a more specific error message
        if (error.message.includes('API key')) {
            return NextResponse.json(
                { error: "AI service authentication failed" },
                { status: 401 }
            );
        }
        
        if (error.message.includes('rate limit')) {
            return NextResponse.json(
                { error: "AI service rate limit exceeded. Please try again later." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Failed to generate questions. Please try again." },
            { status: 500 }
        );
    }
}


