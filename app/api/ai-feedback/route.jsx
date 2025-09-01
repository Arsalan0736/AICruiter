import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { conversation } = body;
        
        if (!conversation) {
            return NextResponse.json(
                { error: "Conversation data is required" },
                { status: 400 }
            );
        }

        if (!process.env.OPENROUTER_API_KEY) {
            console.error("OPENROUTER_API_KEY is not configured");
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        });
        
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [
                {role: "user", content: FINAL_PROMPT}
            ],
        });
        
        console.log(completion.choices[0].message);
        return NextResponse.json(completion.choices[0].message);
        
    } catch(e) {
        console.error("AI Feedback API Error:", e);
        return NextResponse.json(
            { error: "Failed to generate feedback", details: e.message || "Unknown error" },
            { status: 500 }
        );
    }
}


