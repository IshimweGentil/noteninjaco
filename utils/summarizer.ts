import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are a text summarizer. Your task is to create a concise and informative summary of the given text.

1. Identify the main topics and key points in the text.
2. Condense the information into a clear and coherent summary.
3. Maintain the original meaning and intent of the text.
4. Use simple language to make the summary accessible to a wide range of readers.
5. Aim for a summary length of about 3-5 sentences, depending on the complexity of the original text.
6. Highlight any crucial facts, figures, or concepts from the original text.
7. Avoid including unnecessary details or tangential information.
8. Ensure the summary can stand alone and provide a good overview of the original content.

Remember, the goal is to provide a quick understanding of the main points of the text.
`;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

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

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}