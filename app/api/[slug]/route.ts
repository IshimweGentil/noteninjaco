// pages/api/[slug].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid'; // UUID for unique ID generation

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});
const pc_index = pc.index('rag');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (req.method === 'POST') {
    if (typeof slug === 'string') {
      switch (slug) {
        case 'add-notes':
          try {
            const { notes, metadata, user_id, project_id } = req.body;

            // generate embeddings for the notes using OpenAI
            const embeddingResponse = await openai.embeddings.create({
              input: notes,
              model: 'text-embedding-3-small',
            });
            const embeddings = embeddingResponse.data[0].embedding;

            // generate a unique ID for the vector
            const uniqueId = `${user_id}_${project_id}_${uuidv4()}`;

            const data = {
              id: uniqueId, // unique identifier
              values: embeddings,
              metadata: {
                project_id, // store project_id in metadata
                ...metadata,
              },
            };
            // insert embeddings into Pinecone
            await pc_index.upsert([{ ...data, namespace: "noteninja" }]);

            res.status(200).json({ message: 'Notes added successfully' });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: 'Failed to add notes', details: errorMessage });
          }
          break;

        case 'query-notes':
          try {
            const { query, project_id } = req.body; // include project_id in the request body if needed

            // Generate embeddings for the query using OpenAI
            const embeddingResponse = await openai.embeddings.create({
              input: query,
              model: 'text-embedding-3-small',
            });
            const queryEmbedding = embeddingResponse.data[0].embedding;

            // query Pinecone with metadata filtering
            const results = await pc_index.query({
              vector: queryEmbedding,
              topK: 3, // Number of top results to retrieve
              includeValues: false, // Optionally include values if needed
              includeMetadata: true, // Include metadata in results
              filter: { project_id }, // Filter by project_id
            });

            res.status(200).json({ results });
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