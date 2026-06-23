import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');

  if (!text) {
    return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Cannot generate TTS.');
      return new NextResponse(null, { status: 204 });
  }

  try {
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              input: { text },
              voice: { languageCode: 'en-US', name: 'en-US-Journey-F' }, // Using a Journey voice for realism
              audioConfig: { audioEncoding: 'MP3' },
          }),
      });

      if (!response.ok) {
          console.error('Failed to generate TTS:', await response.text());
          return new NextResponse(null, { status: 204 });
      }

      const data = await response.json();
      const audioBuffer = Buffer.from(data.audioContent, 'base64');

      return new NextResponse(audioBuffer, {
          headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'public, max-age=31536000', // Cache for a year
          },
      });

  } catch (error) {
      console.error('Error generating TTS:', error);
      return new NextResponse(null, { status: 204 });
  }
}
