import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  console.log("REQUEST RECEIVED!");

  const streamToBuffer = async (stream: ReadableStream<Uint8Array>) => {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let result;

    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }

    return Buffer.concat(chunks);
  };

  try {
    const formData = await req.formData();
    console.log("Form data received, number of entries:", formData.entries().length);

    const filePromises: any[] = [];

    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`Processing file: ${value.name}`);
        const promise = (async () => {
          try {
            const buffer = await streamToBuffer(value.stream());
            console.log(`Buffer created for ${value.name}, size: ${buffer.length} bytes`);
            
            const data = await pdfParse(buffer, {
              max: 0, // Remove any page limitation
            });
            
            console.log(`PDF parsed for ${value.name}, text length: ${data.text.length}`);
            return data.text.trim(); // Trim any leading/trailing whitespace
          } catch (error) {
            console.error(`Error processing file ${value.name}:`, error);
            return '';
          }
        })();
        filePromises.push(promise);
      }
    })

    const text = await Promise.all(filePromises);
    console.log(`Number of processed texts: ${text.length}`);

    const result = text.filter(txt => txt.length > 0).join('\n');
    console.log(`Number of non-empty texts: ${result.length}`);

    return NextResponse.json({ text: result });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}