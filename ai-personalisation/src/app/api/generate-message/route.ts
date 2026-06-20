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
        hook: `Struggling with ${topic.slice(0, 15)}...?`,
        valueProp: `We fix it. Fast.`,
        cta: `Try ${name} now.`,
        uiType: randomUiType,
        themeColor: '#4f46e5',
        fontStyle: 'sans',
        animationStyle: 'zoom'
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

The copy MUST be extremely short. Use only 2-5 words per phrase. Make it dramatic, powerful, and succinct. It must DIRECTLY address the exact explanation or description provided by the user.

You must output a JSON object with EXACTLY seven keys:
1. "hook": Extremely short address to the audience's specific problem described in the prompt. (e.g. "Hey you. Too much work?")
2. "valueProp": Extremely short explanation of the brand's exact solution to the described problem. (e.g. "We automate it. Faster.")
3. "cta": Extremely short call to action including the brand name if possible. (e.g. "Try [Brand] now.")
4. "uiType": Carefully analyze the user's description. Based on the specific context of the brand and the problem, select the most appropriate visual UI representation from these options exactly: "dashboard", "code", or "chat".
5. "themeColor": A hex color code (e.g. "#ff0000") that fits the vibe of the brand and topic.
6. "fontStyle": Select a font style from exactly these options based on the vibe: "sans", "serif", or "mono".
7. "animationStyle": Select how the text should animate in from exactly these options: "zoom", "slide", or "fade".`
        },
        {
          role: "user",
          content: `Write an ultra-short, punchy ad script for the brand/company named ${name}. The problem they solve or goal they help with is: ${topic}. It is CRITICAL that the ad directly speaks to this specific problem and goal.`
        }
      ],
      temperature: 0.7,
      max_tokens: 250,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('Failed to generate message');
    }

    const parsed = JSON.parse(content);

    // Ensure types are valid
    const validUiTypes = ['dashboard', 'code', 'chat'];
    const uiType = validUiTypes.includes(parsed.uiType) ? parsed.uiType : 'dashboard';

    const validFontStyles = ['sans', 'serif', 'mono'];
    const fontStyle = validFontStyles.includes(parsed.fontStyle) ? parsed.fontStyle : 'sans';

    const validAnimationStyles = ['zoom', 'slide', 'fade'];
    const animationStyle = validAnimationStyles.includes(parsed.animationStyle) ? parsed.animationStyle : 'zoom';

    const themeColor = /^#([0-9A-F]{3}){1,2}$/i.test(parsed.themeColor) ? parsed.themeColor : '#4f46e5';

    return NextResponse.json({
      hook: parsed.hook || `Hey you. Listen.`,
      valueProp: parsed.valueProp || "We fix it.",
      cta: parsed.cta || `Try ${name} now.`,
      uiType: uiType,
      themeColor: themeColor,
      fontStyle: fontStyle,
      animationStyle: animationStyle
     });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized message' },
      { status: 500 }
    );
  }
}