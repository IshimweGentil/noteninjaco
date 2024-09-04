import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import { Buffer } from 'buffer';

const SERV_ERR = 500;
const CLI_ERR = 400;
const OK = 200;

export async function POST(req: Request) {
  console.log("REQUEST RECEIVED!");

  try {
    // parse the form data from the request
    const formData = await req.formData();
    const audioBlob = formData.get('file') as Blob;

    if (!audioBlob) {
      console.error('No audio file found in form data');
      return NextResponse.json({ error: 'No audio file provided' }, { status: CLI_ERR });
    }

    // convert Blob to Buffer
    const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());

    // prepare form-data to send to OpenAI
    const form = new FormData();
    form.append('file', audioBuffer, 'recording.wav');
    form.append('model', 'whisper-1');
    form.append('response_format', 'text');

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('API key is missing');
    }

    // send the request to OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }

    const transcription = response.data;

    console.log(transcription);
    return NextResponse.json({ text: transcription }, { status: OK });
  } catch (error) {
    console.error('Error:', error.message || error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: SERV_ERR });
  }
}