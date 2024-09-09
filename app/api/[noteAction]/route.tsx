import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});
const pc_index = pc.index('rag');

export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const noteAction = pathname.split('/').pop();

  if (typeof noteAction === 'string') {
    switch (noteAction) {
      case 'add-notes':
        try {
          const { notes, metadata, user_id, project_id } = await request.json();

          const embeddingResponse = await openai.embeddings.create({
            input: notes,
            model: 'text-embedding-3-small',
          });
          const embeddings = embeddingResponse.data[0].embedding;

          const uniqueId = `${user_id}_${project_id}_${uuidv4()}`;

          const vector = {
            id: uniqueId,
            values: embeddings,
            metadata: {
              project_id,
              ...metadata,
            },
          };
          
          // Remove the namespace from the upsert call
          await pc_index.upsert([vector]);

          return NextResponse.json({ message: 'Notes added successfully' }, { status: 200 });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return NextResponse.json({ error: 'Failed to add notes', details: errorMessage }, { status: 500 });
        }

      case 'query-notes':
        try {
          const { query, project_id } = await request.json();

          const embeddingResponse = await openai.embeddings.create({
            input: query,
            model: 'text-embedding-3-small',
          });
          const queryEmbedding = embeddingResponse.data[0].embedding;

          const results = await pc_index.query({
            vector: queryEmbedding,
            topK: 3,
            includeValues: false,
            includeMetadata: true,
            filter: { project_id },
          });

          return NextResponse.json({ results }, { status: 200 });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return NextResponse.json({ error: 'Failed to query notes', details: errorMessage }, { status: 500 });
        }

      default:
        return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}