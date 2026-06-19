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
      const validUiTypes = ['dashboard', 'code', 'chat'];
      const randomUiType = validUiTypes[Math.floor(Math.random() * validUiTypes.length)];
      return NextResponse.json({
        hook: `Hey you. Tired of silence?`,
        valueProp: `Millions of songs. Instantly.`,
        cta: `Get ${name} Premium.`,
        uiType: randomUiType
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are writing a script for a fast-paced, 60fps video ad in the minimalist, punchy style of Apple commercials.
You are writing an ad FOR a company/brand, addressing a general audience (e.g. "Hey you", "Listen up", "Struggling?"). Do NOT address the user by name.

The copy MUST be extremely short. Use only 2-5 words per phrase. Make it dramatic, powerful, and succinct.

You must output a JSON object with exactly four keys:
1. "hook": Extremely short address to the audience's problem. (e.g. "Hey you. Too much work?")
2. "valueProp": Extremely short explanation of the brand's solution. (e.g. "We automate it. Faster.")
3. "cta": Extremely short call to action including the brand name if possible. (e.g. "Try [Brand] now.")
4. "uiType": Based on the brand and problem, select the most appropriate visual UI representation from these options exactly: "dashboard", "code", or "chat".`
        },
        {
          role: "user",
          content: `Write an ultra-short, punchy ad script for the brand/company named ${name}. The problem they solve or goal they help with is: ${topic}.`
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

    // Ensure uiType is one of the allowed values
    const validUiTypes = ['dashboard', 'code', 'chat'];
    const uiType = validUiTypes.includes(parsed.uiType) ? parsed.uiType : 'dashboard';

    return NextResponse.json({
      hook: parsed.hook || `Hey you. Listen.`,
      valueProp: parsed.valueProp || "We fix it.",
      cta: parsed.cta || `Try ${name} now.`,
      uiType: uiType
     });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized message' },
      { status: 500 }
    );
  }
}