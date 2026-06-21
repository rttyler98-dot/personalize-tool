import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with the provided API key or environment variable
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
  try {
    const { name, topic } = await request.json();

    if (!name || !topic) {
      return NextResponse.json(
        { error: 'Name and topic are required' },
        { status: 400 }
      );
    }

    if (!genAI) {
      console.warn('GEMINI_API_KEY is not set. Returning a mock message.');
      return NextResponse.json({
        hook: `Struggling with ${topic.slice(0, 15)}...?`,
        valueProp: `We fix it. Fast.`,
        cta: `Try ${name} now.`,
        themeColor: '#4f46e5',
        fontStyle: 'sans',
        animationStyle: 'zoom',
        uiBlocks: [
          { type: 'header', content: 'System Status' },
          { type: 'stat', content: '99.9%', label: 'Uptime' },
          { type: 'chart', content: 'usage_chart' }
        ]
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are writing a script for a fast-paced, 60fps video ad in the minimalist, punchy style of Apple commercials.
You are writing an ad FOR a company/brand named ${name}, addressing a general audience (e.g. "Hey you", "Listen up", "Struggling?"). Do NOT address the user by name.

The problem they solve or goal they help with is: ${topic}. It is CRITICAL that the ad directly speaks to this specific problem and goal.

The copy MUST be extremely short. Use only 2-5 words per phrase. Make it dramatic, powerful, and succinct. It must DIRECTLY address the exact explanation or description provided by the user.

Instead of selecting a rigid UI template, you must literally BUILD the UI by generating an array of 3 "uiBlocks". This allows the video to have a truly dynamic, unique UI layout that perfectly matches the problem and solution.

You must output ONLY a valid JSON object (no markdown formatting, no code blocks) with EXACTLY seven keys:
1. "hook": Extremely short address to the audience's specific problem described in the prompt. (e.g. "Hey you. Too much work?")
2. "valueProp": Extremely short explanation of the brand's exact solution to the described problem. (e.g. "We automate it. Faster.")
3. "cta": Extremely short call to action including the brand name if possible. (e.g. "Try [Brand] now.")
4. "themeColor": A hex color code (e.g. "#ff0000") that fits the vibe of the brand and topic.
5. "fontStyle": Select a font style from exactly these options based on the vibe: "sans", "serif", or "mono".
6. "animationStyle": Select how the text should animate in from exactly these options: "zoom", "slide", or "fade".
7. "uiBlocks": An array of EXACTLY 3 objects representing the UI layout. Each object MUST have a "type" string (choose exactly from: "header", "stat", "chart", "code_line", "chat_message", "task_item") and a "content" string. If the type is "stat", also include a "label" string. Build a combination that best represents the product (e.g., a dashboard might have a header, a stat, and a chart. A dev tool might have a header and two code_lines. A task manager might have a header and two task_items).`;

    const result = await model.generateContent(prompt);
    let content = result.response.text().trim();

    // Remove markdown formatting if present
    if (content.startsWith('```json')) {
      content = content.slice(7, -3).trim();
    } else if (content.startsWith('```')) {
      content = content.slice(3, -3).trim();
    }

    if (!content) {
      throw new Error('Failed to generate message');
    }

    const parsed = JSON.parse(content);

    const validFontStyles = ['sans', 'serif', 'mono'];
    const fontStyle = validFontStyles.includes(parsed.fontStyle) ? parsed.fontStyle : 'sans';

    const validAnimationStyles = ['zoom', 'slide', 'fade'];
    const animationStyle = validAnimationStyles.includes(parsed.animationStyle) ? parsed.animationStyle : 'zoom';

    const themeColor = /^#([0-9A-F]{3}){1,2}$/i.test(parsed.themeColor) ? parsed.themeColor : '#4f46e5';

    let uiBlocks = parsed.uiBlocks;
    if (!Array.isArray(uiBlocks) || uiBlocks.length !== 3) {
       uiBlocks = [
          { type: 'header', content: 'System Dashboard' },
          { type: 'stat', content: '100%', label: 'Efficiency' },
          { type: 'chart', content: 'activity' }
       ];
    }

    return NextResponse.json({
      hook: parsed.hook || `Hey you. Listen.`,
      valueProp: parsed.valueProp || "We fix it.",
      cta: parsed.cta || `Try ${name} now.`,
      themeColor: themeColor,
      fontStyle: fontStyle,
      animationStyle: animationStyle,
      uiBlocks: uiBlocks
     });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized message' },
      { status: 500 }
    );
  }
}