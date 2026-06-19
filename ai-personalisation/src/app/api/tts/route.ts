import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');

  if (!text) {
    return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
  }

  if (!openai) {
    // If no API key, return a mock success but no audio data or a redirect to a silent audio file
    console.warn('OPENAI_API_KEY is not set. Cannot generate TTS audio.');
    return new NextResponse(null, { status: 204 }); // No content
  }

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy", // "alloy", "echo", "fable", "onyx", "nova", "shimmer"
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000', // Cache aggressively since text->audio is deterministic here
      },
    });
  } catch (error) {
    console.error('Error generating TTS:', error);
    return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
  }
}
