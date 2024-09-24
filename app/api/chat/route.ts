import {
    Message as VercelChatMessage,
    StreamingTextResponse,
    createStreamDataTransformer
} from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RunnableSequence } from '@langchain/core/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';
import path from 'path';
import fs from 'fs';

const filePath: string = path.resolve(process.cwd(), 'app/data/states.json');

if (!fs.existsSync(filePath)) {
    throw new Error('File not found: ' + filePath);
}

const loader = new JSONLoader(
    filePath,
    [
        "/services", // Load names of all services            
        "/pricing_plans", // Load pricing plans
        "/contact_information", // Load the contact email
    ]
);

export const dynamic = 'force-dynamic';

/**
 * Formats message into <role>: <content>
 */
const formatMessage = (message: VercelChatMessage): string => {
    return `${message.role}: ${message.content}`;
};

const TEMPLATE: string = `You are Sarah, the AI customer support bot for the NoteNinja website. Answer the user's questions based on the following context:
==============================
Context: {context}
==============================
Current conversation: {chat_history}

user: {question}
assistant:`;

interface PostRequest {
    messages: VercelChatMessage[];
}

export async function POST(req: Request): Promise<Response> {
    try {
        const { messages }: PostRequest = await req.json();
        const formattedPreviousMessages: string[] = messages.slice(0, -1).map(formatMessage);
        const currentMessageContent: string = messages[messages.length - 1].content;
        const docs = await loader.load();
        const prompt = PromptTemplate.fromTemplate(TEMPLATE);
        const model = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            model: 'gpt-4o-mini',
            temperature: 0,
            streaming: true,
            verbose: true,
        });

        const parser = new HttpResponseOutputParser();

        const chain = RunnableSequence.from([
            {
                question: (input: any) => input.question,
                chat_history: (input: any) => input.chat_history,
                context: () => formatDocumentsAsString(docs),
            },
            prompt,
            model,
            parser,
        ]);

        const stream = await chain.stream({
            chat_history: formattedPreviousMessages.join('\n'),
            question: currentMessageContent,
        });

        return new StreamingTextResponse(
            stream.pipeThrough(createStreamDataTransformer()),
        );
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: e.status ?? 500 });
    }
}