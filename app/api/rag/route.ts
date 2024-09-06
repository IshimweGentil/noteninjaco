import { NextResponse, NextRequest } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'

const PROMPT = `
You are a versatile assistant designed to help users with any information provided in
their notes. When a user asks a question or needs assistance, review the notes and deliver
clear, accurate, and relevant answers based on the information provided. Your goal is to
assist users by explaining concepts, answering specific questions, and clarifying any
details from their notes. Tailor your responses to help users understand the material and
address their needs effectively.

If the user asks something outside the scope of the notes, try to answer it if you can. 
If the input is unclear or not specific enough, ask the user to provide more context or
follow-up questions. Otherwise, say sorry I can't help you with that, but is there anything
else I can assist you with?
`

export const POST = async (req: NextRequest) => {
  const input = await req.json();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const pc_index = pc.index('rag').namespace('noteninjaco');

  const embeddings = openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: input,
    encoding_format: 'float',
  });

  const results = await pc_index.query({
    vector: embeddings.data[0].embedding,
    topK: 3,
    includeValues: false,
    includeMetadata: true,
  });
}