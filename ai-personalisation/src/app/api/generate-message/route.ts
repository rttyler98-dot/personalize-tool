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
        hook: `Hey ${name}! Struggling with ${topic}?`,
        valueProp: `Our new SaaS platform automates everything, saving you hours every week.`,
        cta: `Click below to start your free 14-day trial today!`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a professional SaaS copywriter writing a script for a 15-second personalized video ad.
You must output a JSON object with exactly three keys:
1. "hook": A catchy opening sentence addressing the user by name and mentioning their problem/interest. (e.g. "Hey [Name]! Are you tired of struggling with [Topic]?")
2. "valueProp": One or two sentences explaining how our SaaS product solves their problem and saves time/money.
3. "cta": A strong call to action to sign up for a trial or learn more.`
        },
        {
          role: "user",
          content: `Write a short, engaging SaaS video ad script for a user named ${name} who is interested in or struggling with ${topic}.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('Failed to generate message');
    }

    const parsed = JSON.parse(content);

    return NextResponse.json({
      hook: parsed.hook || `Hey ${name}, let's talk about ${topic}.`,
      valueProp: parsed.valueProp || "We have the perfect solution for you.",
      cta: parsed.cta || "Try it out today!",
     });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized message' },
      { status: 500 }
    );
  }
}
