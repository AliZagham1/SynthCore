import { NextResponse } from "next/server";
import {  OpenAI } from 'openai';
import { auth } from "@clerk/nextjs/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// Set up OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY ,
});
export async function POST(req: Request) {
    try{

        const { userId }: { userId: string | null } = await auth()
        const body = await req.json()
        const { messages } = body

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!openai.apiKey) {
            return new NextResponse("OpenAI API Key not configured", { status: 500 })
        }
        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 })
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();
        if (!freeTrial && !isPro) {
            return new NextResponse("Free trial has expired.", { status: 403 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
           
        })
        if (!isPro) {
            await increaseApiLimit();
        }
      
        return NextResponse.json(response.choices[0].message)

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}



