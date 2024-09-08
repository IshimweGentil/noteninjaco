// pages/api/summarize.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are an advanced text summarizer. Your task is to create a comprehensive and informative summary of the given text, ensuring that all key information is retained.

Instructions:
1. Thoroughly analyze the entire text to identify all main topics, key points, and crucial details.
2. Create a summary that encapsulates all the important information from the original text. Do not omit any significant points or details.
3. Organize the summary in a logical and coherent structure, using markdown-style headings to separate main sections:
   - Use a single # for main headings
   - Use ## for subheadings
4. Maintain the original meaning and intent of the text without oversimplification.
5. Use clear and precise language, but do not unnecessarily simplify complex concepts if they are central to understanding the content.
6. Include all relevant facts, figures, and concepts from the original text.
7. Do not impose any arbitrary length restrictions. The summary should be as long as necessary to cover all important points comprehensively.
8. If the text contains technical terms or jargon that are essential to the subject matter, include and briefly explain them.
9. Highlight important terms, concepts, or key phrases by enclosing them in [important]term[/important] tags.
10. If applicable, note any controversies, debates, or alternative viewpoints presented in the original text.
11. Conclude the summary with a brief section on the implications or significance of the information, if relevant.

Remember, the goal is to provide a thorough understanding of all the main points and crucial details from the original text, ensuring that a reader of your summary doesn't miss any important information. Use headings and highlighting to improve readability and emphasize key points.
`;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    console.log("Received text for summarization:", text.substring(0, 100) + "..."); // Log the first 100 characters

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      model: "gpt-4-1106-preview",
    });

    const summary = completion.choices[0].message.content;
    
    if (!summary) {
      throw new Error("No summary generated from OpenAI");
    }

    console.log("Generated summary:", summary.substring(0, 100) + "..."); // Log the first 100 characters of the summary

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}