// app/api/summarize/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are an advanced text summarizer. Your task is to create a comprehensive and informative summary of the given text chunk, ensuring that all key information is retained.

Instructions:
1. Analyze the provided text chunk to identify main topics, key points, and crucial details.
2. Create a summary that encapsulates the important information from this chunk. Do not omit any significant points or details.
3. Use markdown-style headings to separate main sections:
   - Use a single # for main headings
   - Use ## for subheadings
4. Maintain the original meaning and intent of the text without oversimplification.
5. Use clear and precise language, but do not unnecessarily simplify complex concepts if they are central to understanding the content.
6. Include all relevant facts, figures, and concepts from the text chunk.
7. If the chunk contains technical terms or jargon that are essential to the subject matter, include and briefly explain them.
8. Highlight important terms, concepts, or key phrases by enclosing them in [important]term[/important] tags.
9. If applicable, note any controversies, debates, or alternative viewpoints presented in the text chunk.

Remember, you are summarizing a chunk of a larger text. Focus on providing a thorough understanding of the main points and crucial details from this specific chunk.
`;

const CHUNK_SIZE = 4000; // Adjust this value based on your needs and the gpt-4o-mini model's capabilities

async function* summarizeChunks(text: string) {
  const chunks = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isLastChunk = i === chunks.length - 1;

    const chunkPrompt = isLastChunk
      ? `${systemPrompt}\n\nThis is the final chunk of the text. Please conclude the summary with a brief section on the implications or significance of the information, if relevant.`
      : systemPrompt;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: chunkPrompt },
        { role: "user", content: chunk },
      ],
      model: "gpt-4o-mini",
      stream: true,
    });

    for await (const part of completion) {
      yield part.choices[0]?.delta?.content || "";
    }

    if (!isLastChunk) {
      yield "\n\n";  // Add a separator between chunk summaries
    }
  }
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    console.log("Received text for summarization:", text.substring(0, 100) + "..."); // Log the first 100 characters

    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of summarizeChunks(text)) {
              controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
          } catch (error) {
            console.error("Error generating summary:", error);
            controller.error(error);
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}