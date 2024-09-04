// app/api/transcribe/route.js

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log("REQUEST RECEIVED!");
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    const data = new FormData();
    data.append('file', audioFile);

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', data, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}