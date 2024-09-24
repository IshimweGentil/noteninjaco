import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const dynamic = 'force-dynamic';

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

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
            
            let extractedText = '';
            
            if (value.name.toLowerCase().endsWith('.pdf')) {
              const data = await pdfParse(buffer);
              extractedText = data.text.trim();
            } else if (value.name.toLowerCase().endsWith('.docx')) {
              extractedText = await extractTextFromDOCX(buffer);
            } else {
              console.warn(`Unsupported file type: ${value.name}`);
              return '';
            }
            
            console.log(`Text extracted from ${value.name}, length: ${extractedText.length}`);
            return extractedText;
          } catch (error) {
            console.error(`Error processing file ${value.name}:`, error);
            return '';
          }
        })();
        filePromises.push(promise);
      }
    });

    const texts = await Promise.all(filePromises);
    console.log(`Number of processed texts: ${texts.length}`);

    const result = texts.filter(txt => txt.length > 0).join('\n');
    console.log(`Total length of non-empty texts: ${result.length}`);

    if (result.length === 0) {
      console.warn('No text extracted from any files');
    }

    return NextResponse.json({ text: result });
  } catch (error) {
    console.error("Error in POST handler:", error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}