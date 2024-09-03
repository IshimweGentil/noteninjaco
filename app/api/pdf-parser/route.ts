import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  console.log("REQUEST RECEIVED!");

  // convert ReadableStream to Buffer
  const streamToBuffer = async (stream: ReadableStream<Uint8Array>) => {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let result;

    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }

    return Buffer.concat(chunks);
  };

  // extract form data
  const formData = await req.formData();
  let text = '';

  formData.forEach(async (value, key) => {
    if (value instanceof File) {
      const buffer = await streamToBuffer(value.stream());
      const data = await pdfParse(buffer);
      text += data.text + '\n';
    }
  });

  const result = text.trim().split('\n');
  return NextResponse.json({ texts: result });
}