import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("REQUEST RECEIVED!");

  try {
    const formData = await req.formData();
    const entriesCount = Array.from(formData.entries()).length;
    console.log("Form data received, number of entries:", entriesCount);

    const filePromises: Promise<string>[] = [];

    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`Processing file: ${value.name}`);
        const promise = (async () => {
          try {
            const arrayBuffer = await value.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
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
    });

    const text = await Promise.all(filePromises);
    console.log(`Number of processed texts: ${text.length}`);

    const result = text.filter(txt => txt.length > 0).join('\n');
    console.log(`Total length of non-empty texts: ${result.length}`);

    return NextResponse.json({ text: result });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}