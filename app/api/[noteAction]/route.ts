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
const addNotesSystemPromptWrapper = (notes: string) => {
  return `
    You are an intelligent assistant trained to process and analyze notes based on their content type. Your task is to generate output based on the nature of the notes provided: ${notes}.

    Story-Based or Literature Notes:

    If the notes are related to a story, novel, or piece of literature, your job is to create a concise summary of the content. Summarize the main plot points, characters, and any significant events or themes.
    Non-Literature Notes (e.g., Lecture Notes, Technical Notes):

    If the notes are not story-based or literature, such as lecture notes from subjects like chemistry, history, or other technical fields, you need to extract and list the key topics and important keywords from the notes.
    Instructions for Output:

    For story-based or literature notes: Provide a summary in a clear, coherent paragraph.
    For non-literature notes: Provide a list of key topics and important keywords as a string.
    Examples:

    Story-Based Notes:

    Input: Notes about Robin Hood.
    Output: "Robin Hood is a legendary outlaw known for 'robbing from the rich and giving to the poor.' He leads a band of Merry Men in Sherwood Forest, opposing the Sheriff of Nottingham. The story highlights themes of justice, bravery, and loyalty."
    Non-Literature Notes:

    Input: Chemistry lecture notes on the periodic table.
    Output: "Key Topics: Periodic Table, Elements, Atomic Number, Periods, Groups, Valence Electrons, Periodic Trends."
  `
}

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
              prompt: addNotesSystemPromptWrapper(notes),
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