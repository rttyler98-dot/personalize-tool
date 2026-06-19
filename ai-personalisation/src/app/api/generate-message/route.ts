import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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
      console.warn('OPENAI_API_KEY is not set. Returning a mock message.');
      return NextResponse.json({
        hook: `Hey ${name}. Struggling?`,
        valueProp: `Automate everything. Save time.`,
        cta: `Start free trial.`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are writing a script for a fast-paced, 60fps video ad in the minimalist, punchy style of Apple commercials.
The copy MUST be extremely short. Use only 2-5 words per phrase. Make it dramatic, powerful, and succinct.

You must output a JSON object with exactly three keys:
1. "hook": Extremely short address to the user's problem. (e.g. "Hey [Name]. Too much work?")
2. "valueProp": Extremely short explanation of the solution. (e.g. "We automate it. Faster.")
3. "cta": Extremely short call to action. (e.g. "Try it now.")`
        },
        {
          role: "user",
          content: `Write an ultra-short, punchy ad script for a user named ${name}. Their problem/goal is: ${topic}.`
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
      hook: parsed.hook || `Hey ${name}. Listen.`,
      valueProp: parsed.valueProp || "We fix it.",
      cta: parsed.cta || "Try now.",
     });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized message' },
      { status: 500 }
    );
  }
}