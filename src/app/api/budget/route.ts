/**
 * /api/budget — Travelable budget planner.
 * Deterministic, fast, with optional AI enhancement.
 */

import { NextRequest, NextResponse } from 'next/server';

interface Body {
  totalBudget: number;
  destination?: string;
  days: number;
  travelers: number;
  preferences?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Body;
    const { totalBudget, days, travelers, destination = 'your destination' } = body;

    if (!totalBudget || !days || !travelers) {
      return NextResponse.json(
        { error: 'totalBudget, days, and travelers are required.' },
        { status: 400 }
      );
    }

    const total = Math.max(500, Math.min(totalBudget, 100000));
    const t = Math.max(1, Math.min(travelers, 12));
    const d = Math.max(1, Math.min(days, 30));

    // Smart allocation based on trip length & traveler count
    const isLong = d >= 7;
    const isFamily = t >= 3;
    const flightsPct = isLong ? 0.28 : 0.36;
    const accommPct = isLong ? 0.34 : 0.30;
    const foodPct = 0.18;
    const transportPct = 0.08;
    const activitiesPct = isFamily ? 0.08 : 0.12;
    const emergencyPct = 0.05;

    // Renormalize to ensure total = 100
    const sum = flightsPct + accommPct + foodPct + transportPct + activitiesPct + emergencyPct;
    const flights = Math.round((flightsPct / sum) * total);
    const accommodation = Math.round((accommPct / sum) * total);
    const food = Math.round((foodPct / sum) * total);
    const transport = Math.round((transportPct / sum) * total);
    const activities = Math.round((activitiesPct / sum) * total);
    const emergency = total - flights - accommodation - food - transport - activities;

    return NextResponse.json({
      breakdown: {
        total,
        currency: 'USD',
        flights: { allocated: flights, actual: null },
        accommodation: { allocated: accommodation, actual: null },
        food: { allocated: food, actual: null },
        transport: { allocated: transport, actual: null },
        activities: { allocated: activities, actual: null },
        emergency: { allocated: emergency, actual: null },
        tips: [
          `Book flights 6-8 weeks out for the best fares to ${destination}.`,
          `With ${d} days, an apartment with a kitchen can cut food costs by ~30%.`,
          "Use public transit where you can — it's better for the planet and your wallet.",
          `Set aside ${Math.round(emergency / t)} per traveler as your contingency.`,
        ],
      },
      optimizations: [
        {
          type: 'date_shift' as const,
          description: `Shifting your trip by ±1 week could save ~$${Math.round(total * 0.08)} on flights.`,
          savings: Math.round(total * 0.08),
          currency: 'USD',
          impact: total * 0.08 > 200 ? 'high' as const : total * 0.08 > 50 ? 'medium' as const : 'low' as const,
          action: 'Compare fares across Tuesdays and Wednesdays in the surrounding 3 weeks.',
        },
        {
          type: 'hotel_alternative' as const,
          description: `Switching from a hotel to a well-reviewed apartment can save ~$${Math.round(total * 0.06)}.`,
          savings: Math.round(total * 0.06),
          currency: 'USD',
          impact: 'medium' as const,
          action: 'Search apartments in walkable neighborhoods with kitchen facilities.',
        },
        {
          type: 'class_change' as const,
          description: 'Premium economy can be 30% cheaper than business on long-haul flights.',
          savings: Math.round(total * 0.04),
          currency: 'USD',
          impact: 'low' as const,
          action: 'Compare premium-economy seats for routes over 6 hours.',
        },
      ],
    });
  } catch (error) {
    console.error('[Budget API Error]', error);
    return NextResponse.json(
      { error: 'Failed to optimize budget. Please try again.' },
      { status: 500 }
    );
  }
}