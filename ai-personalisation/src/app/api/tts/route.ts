import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');

  if (!text) {
    return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
  }

  // Google Generative AI doesn't have a direct equivalent to OpenAI's TTS yet
  // in the `@google/generative-ai` package, so we bypass it when using Gemini.
  return new NextResponse(null, { status: 204 }); // No content
}
