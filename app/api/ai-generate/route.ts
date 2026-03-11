import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { type, userData } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        let prompt = "";
        if (type === "workout") {
            prompt = `As an expert fitness trainer, generate a weekly workout plan for a person with the following details: ${JSON.stringify(userData)}. 
            The plan should be professional, easy to follow, and include exercises, sets, and reps. 
            Format the output in clear markdown with headers. Focus on their goals and fitness level.`;
        } else if (type === "diet") {
            prompt = `As a professional nutritionist, generate a daily diet plan for a person with the following details: ${JSON.stringify(userData)}. 
            Include breakfast, lunch, dinner, and snacks. 
            Provide nutritional advice and keep their dietary preferences/restrictions in mind. 
            Format the output in clear markdown.`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ plan: text });
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
    }
}
