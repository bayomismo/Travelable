/**
 * /api/ai-chat — Travelable AI travel concierge.
 *
 * If the optional z-ai-web-dev-sdk is available (ZAI_API_KEY configured),
 * we forward to the LLM. Otherwise we return a deterministic, useful
 * response that points the user at concrete next steps.
 */

import { NextRequest, NextResponse } from 'next/server';

interface Body {
  query?: string;
  messages?: { role: 'user' | 'assistant' | 'system'; content: string }[];
}

function fallbackResponse(query: string): { response: string; suggestions: string[] } {
  const q = query.toLowerCase();
  const mentionsHoneymoon = /honeymoon|romantic|couple/.test(q);
  const mentionsFamily = /family|kid|child/.test(q);
  const mentionsBudget = /budget|cheap|affordable/.test(q);
  const mentionsLuxury = /luxury|5 star|five star|best/.test(q);

  let rec = 'Santorini or the Maldives for iconic sunsets and great value, depending on your budget.';
  if (mentionsFamily) rec = 'Bali and Kyoto both shine for families — Bali for relaxed beach time, Kyoto for culture and food.';
  if (mentionsBudget) rec = 'Bangkok and Lisbon give you the most nights of great weather, food and culture per dollar.';
  if (mentionsLuxury) rec = 'The Maldives and Bora Bora lead the luxury pack, with Aman Tokyo for an urban alternative.';

  return {
    response:
      `Based on what you're describing, ${rec}\n\n` +
      `I'd start with 2 candidate destinations, then check flights 6-8 weeks out for the best fares. ` +
      `Want me to walk you through dates, a budget split, or specific neighborhoods?`,
    suggestions: [
      'Plan a 7-day itinerary for my pick',
      'Compare hotels in that destination',
      'Estimate a daily budget',
      'When is the cheapest time to fly?',
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Body;
    const query = (body.query ?? '').trim();

    if (!query && (!body.messages || body.messages.length === 0)) {
      return NextResponse.json(
        { error: 'Please ask a question.' },
        { status: 400 }
      );
    }

    // Try the AI SDK if available
    try {
      // @ts-ignore
      if (process.env.ZAI_API_KEY) {
        const mod = await import('z-ai-web-dev-sdk').catch(() => null);
        if (mod && mod.default) {
          const zai = await mod.default.create();
          const systemPrompt = `You are Travelable AI, the world's most intelligent travel concierge. Be concise, specific, and actionable. Respond in JSON: {"response": "advice", "suggestions": ["q1","q2","q3","q4"]}`;
          const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
            { role: 'system', content: systemPrompt },
            ...((body.messages ?? []).map((m) => ({
              role: m.role as 'user' | 'assistant' | 'system',
              content: m.content,
            }))),
            { role: 'user', content: query },
          ];
          const completion = await zai.chat.completions.create({
            messages,
            thinking: { type: 'disabled' },
          });
          const raw = completion.choices[0]?.message?.content ?? '';
          try {
            const parsed = JSON.parse(raw);
            return NextResponse.json({
              response: parsed.response ?? raw,
              suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 4) : [],
            });
          } catch {
            return NextResponse.json({
              response: raw,
              suggestions: [
                'Plan my itinerary',
                'Find hotels',
                'Estimate budget',
                'Best time to visit',
              ],
            });
          }
        }
      }
    } catch {
      // fall through to deterministic
    }

    return NextResponse.json(fallbackResponse(query));
  } catch (error) {
    console.error('[AI Chat API Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response. Please try again.' },
      { status: 500 }
    );
  }
}