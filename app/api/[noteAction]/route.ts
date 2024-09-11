// pages/api/[noteAction].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid'; // UUID for unique ID generation
import { createStream } from "@/lib/streamUtil";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});
const pc_index = pc.index('rag');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { noteAction } = req.query;

  if (req.method === 'POST') {
    if (typeof noteAction === 'string') {
      switch (noteAction) {
        case 'add-notes':
          try {
            const { notes, user_id, project_id } = req.body;

            // Generate summary and key topics
            const summaryResponse = await openai.completions.create({
              prompt: `Summarize the following notes and extract key topics and key details: ${notes}`,
              model: 'gpt-4o-mini',
              max_tokens: 150,
            });
            const summary = summaryResponse.choices[0].text.trim();

            // Generate embeddings for the summary
            const embeddingResponse = await openai.embeddings.create({
              input: summary,
              model: 'text-embedding-3-small',
              encoding_format: 'float',
            });
            const embeddings = embeddingResponse.data[0].embedding;

            // Generate a unique ID for the vector
            const uniqueId = `${user_id}-${project_id}-${uuidv4()}`;

            const data = {
              id: uniqueId,
              values: embeddings,
              metadata: {
                project_id,
                summary,
              },
            };

            // Insert embeddings into Pinecone
            await pc_index.upsert([{ ...data, namespace: "noteninja" }]);

            res.status(200).json({ message: 'Notes added successfully' });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: 'Failed to add notes', details: errorMessage });
          }
          break;

        case 'query-notes':
          try {
            const { data, project_id } = req.body;
            const latestUserMessage = data[data.length - 1].content;

            // Generate embeddings for the user query
            const embeddingResponse = await openai.embeddings.create({
              input: latestUserMessage,
              model: 'text-embedding-3-small',
              encoding_format: 'float',
            });
            const queryEmbedding = embeddingResponse.data[0].embedding;

            // Query Pinecone with metadata filtering
            const results = await pc_index.query({
              vector: queryEmbedding,
              topK: 2,
              includeValues: false,
              includeMetadata: true,
              filter: { project_id },
            });

            // Create result string
            let resultString = 'Returned results from vector db:\n';
            results.matches.forEach((match: any) => {
              resultString += `Project ID: ${match.metadata.project_id}\nSummary: ${match.metadata.summary}\n\n`;
            });

            // Generate chat completion
            const lastMessageContent = latestUserMessage + '\n\n' + resultString;
            const lastDataWithoutLastMessage = data.slice(0, -1);
            const completion = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                ...lastDataWithoutLastMessage,
                { role: 'user', content: lastMessageContent }
              ],
              stream: true,
            });

            res.status(200).json(createStream(completion));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: 'Failed to query notes', details: errorMessage });
          }
          break;

        default:
          res.status(404).json({ error: 'Action not found' });
          break;
      }
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}