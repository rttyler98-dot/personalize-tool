import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// We initialize the OpenAI client only if the key is present to avoid crashing
// the build or the app if the user hasn't set it up yet.
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: Request) {
  try {
    const { name, topic } = await request.json();

    if (!name || !topic) {
      return NextResponse.json(
        { error: 'Name and topic are required' },
        { status: 400 }
      );
    }

    if (!openai) {
      // Mock response if no API key is provided
      console.warn('OPENAI_API_KEY is not set. Returning a mock message.');
      return NextResponse.json({
        message: `Welcome to your personalized video about ${topic}. We're excited to have you here and hope you enjoy learning more about it!`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant writing a short, engaging script for a personalized 5-second video. Keep it to 1-2 short sentences. Make it sound enthusiastic and conversational."
        },
        {
          role: "user",
          content: `Write a short, engaging message for a user named ${name} who is interested in ${topic}.`
        }
      ],
      temperature: 0.7,
      max_tokens: 60,
    });

    const message = completion.choices[0]?.message?.content?.trim();

    if (!message) {
      throw new Error('Failed to generate message');
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized message' },
      { status: 500 }
    );
  }
}
