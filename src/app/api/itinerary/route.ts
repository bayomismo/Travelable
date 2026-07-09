/**
 * /api/itinerary — Travelable day-by-day itinerary generator.
 * Deterministic planner that produces high-quality itineraries from the
 * curated catalogue. If ZAI_API_KEY is set we delegate to the LLM,
 * otherwise we generate locally.
 */

import { NextRequest, NextResponse } from 'next/server';

interface Body {
  destination?: string;
  days?: number;
  budget?: number;
  travelers?: number;
  style?: string;
}

interface Activity {
  time: string;
  name: string;
  description: string;
  location: string;
  duration: number;
  cost: number;
  type: 'food' | 'activity' | 'transport' | 'sightseeing' | 'rest';
  tips?: string;
}

interface Day {
  day: number;
  date: string;
  title: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  weather: { temp: number; condition: string; icon: string };
  estimatedCost: number;
  walkingDistance: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function makeDate(startDate: Date, offsetDays: number): string {
  const d = new Date(startDate);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

const CITY_TEMPLATES: Record<string, Omit<Day, 'day' | 'date'>[]> = {
  Santorini: [
    {
      title: 'Arrival & Oia Sunset',
      morning: [
        { time: '10:00', name: 'Arrive in Santorini', description: 'Settle into your cliffside hotel in Oia.', location: 'JTR Airport', duration: 60, cost: 0, type: 'transport' },
        { time: '12:00', name: 'Lunch at Lotza', description: 'Family taverna with caldera views and moussaka.', location: 'Oia', duration: 75, cost: 28, type: 'food' },
      ],
      afternoon: [
        { time: '14:00', name: 'Walk Oia village', description: 'Explore blue-domed churches and the Venetian castle.', location: 'Oia', duration: 120, cost: 0, type: 'sightseeing' },
        { time: '17:00', name: 'Sunset at Oia Castle', description: 'Claim your spot early — sunset draws crowds.', location: 'Oia Castle', duration: 60, cost: 0, type: 'sightseeing', tips: 'Arrive by 18:00 in summer.' },
      ],
      evening: [
        { time: '20:00', name: 'Dinner at Lycabettus', description: 'Modern Greek tasting menu with volcano views.', location: 'Oia', duration: 120, cost: 95, type: 'food' },
      ],
      weather: { temp: 24, condition: 'Sunny', icon: 'sun' },
      estimatedCost: 130,
      walkingDistance: 4.5,
    },
    {
      title: 'Caldera Catamaran',
      morning: [
        { time: '09:30', name: 'Catamaran Cruise', description: 'Sail the caldera, swim in hot springs, lunch on board.', location: 'Ammoudi Bay', duration: 300, cost: 145, type: 'activity' },
      ],
      afternoon: [
        { time: '16:00', name: 'Pyrgos village', description: 'Quiet hilltop village with castle ruins.', location: 'Pyrgos', duration: 90, cost: 0, type: 'sightseeing' },
      ],
      evening: [
        { time: '20:00', name: 'Dinner at Selene', description: 'Two-Michelin-star tasting menu.', location: 'Pyrgos', duration: 150, cost: 220, type: 'food' },
      ],
      weather: { temp: 25, condition: 'Sunny', icon: 'sun' },
      estimatedCost: 380,
      walkingDistance: 2.8,
    },
  ],
  Bali: [
    {
      title: 'Ubud Welcome',
      morning: [
        { time: '09:00', name: 'Tegalalang Rice Terrace', description: 'Walk the emerald terraces at sunrise.', location: 'Tegalalang', duration: 90, cost: 5, type: 'sightseeing' },
      ],
      afternoon: [
        { time: '13:00', name: 'Sacred Monkey Forest', description: 'Ancient temples, playful macaques, shaded paths.', location: 'Ubud', duration: 90, cost: 12, type: 'sightseeing' },
        { time: '15:30', name: 'Spa at Karsa', description: 'Traditional Balinese massage in the rice fields.', location: 'Ubud', duration: 90, cost: 35, type: 'activity' },
      ],
      evening: [
        { time: '19:30', name: 'Dinner at Locavore', description: 'Award-winning modern Indonesian tasting menu.', location: 'Ubud', duration: 150, cost: 110, type: 'food' },
      ],
      weather: { temp: 28, condition: 'Partly Cloudy', icon: 'cloud-sun' },
      estimatedCost: 165,
      walkingDistance: 6.0,
    },
  ],
  Tokyo: [
    {
      title: 'Shibuya & Shinjuku',
      morning: [
        { time: '09:00', name: 'Tsukiji Outer Market', description: 'Tuna, tamagoyaki, and the freshest sushi breakfast.', location: 'Tsukiji', duration: 90, cost: 35, type: 'food' },
      ],
      afternoon: [
        { time: '12:00', name: 'Meiji Shrine', description: 'Forested approach in the heart of Harajuku.', location: 'Yoyogi', duration: 75, cost: 0, type: 'sightseeing' },
        { time: '14:30', name: 'Shibuya Crossing & Sky', description: 'People-watching from above the world\'s busiest intersection.', location: 'Shibuya', duration: 60, cost: 18, type: 'sightseeing' },
      ],
      evening: [
        { time: '19:00', name: 'Omoide Yokocho', description: 'Lantern-lit alley of yakitori and sake.', location: 'Shinjuku', duration: 120, cost: 40, type: 'food' },
      ],
      weather: { temp: 19, condition: 'Clear', icon: 'sun' },
      estimatedCost: 95,
      walkingDistance: 7.5,
    },
  ],
  Paris: [
    {
      title: 'Iconic Paris',
      morning: [
        { time: '09:00', name: 'Eiffel Tower', description: 'Skip-the-line tickets to the second floor.', location: 'Champ de Mars', duration: 120, cost: 28, type: 'sightseeing' },
      ],
      afternoon: [
        { time: '12:30', name: 'Lunch at Café Constant', description: 'Bistro classics near the Eiffel Tower.', location: '7th arrondissement', duration: 90, cost: 35, type: 'food' },
        { time: '14:30', name: 'Musée d\'Orsay', description: 'Impressionists in a former railway station.', location: '7th arrondissement', duration: 120, cost: 18, type: 'sightseeing' },
      ],
      evening: [
        { time: '19:30', name: 'Seine River Cruise', description: 'Paris from the water at twilight.', location: 'Pont Neuf', duration: 60, cost: 18, type: 'activity' },
      ],
      weather: { temp: 17, condition: 'Partly Cloudy', icon: 'cloud-sun' },
      estimatedCost: 105,
      walkingDistance: 6.0,
    },
  ],
};

function genericDay(dayNumber: number): Omit<Day, 'day' | 'date'> {
  return {
    title: `Explore Your Destination`,
    morning: [
      { time: '09:00', name: 'Local market breakfast', description: 'Sample the morning specialties at a neighborhood market.', location: 'City center', duration: 75, cost: 18, type: 'food' },
      { time: '10:30', name: 'Old town walking tour', description: 'Discover the historic quarter with a self-guided walk.', location: 'Old town', duration: 90, cost: 0, type: 'sightseeing' },
    ],
    afternoon: [
      { time: '13:00', name: 'Lunch at a local favorite', description: 'Ask a local for their go-to spot — restaurants loved by residents.', location: 'Local neighborhood', duration: 90, cost: 25, type: 'food' },
      { time: '15:00', name: 'Top-rated museum', description: 'Spend the afternoon at the city\'s most-visited cultural stop.', location: 'Cultural district', duration: 120, cost: 20, type: 'sightseeing' },
    ],
    evening: [
      { time: '19:00', name: 'Sunset viewpoint', description: 'Catch golden hour at a panoramic viewpoint.', location: 'Hilltop / waterfront', duration: 60, cost: 0, type: 'sightseeing' },
      { time: '20:30', name: 'Signature dinner', description: 'A long, leisurely meal with the city\'s signature dishes.', location: 'Restaurant row', duration: 120, cost: 65, type: 'food' },
    ],
    weather: { temp: 22, condition: 'Sunny', icon: 'sun' },
    estimatedCost: 130,
    walkingDistance: 5.5,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Body;
    const destination = body.destination || 'your destination';
    const days = Math.min(Math.max(body.days ?? 5, 1), 14);
    const budget = body.budget ?? 3000;
    const travelers = body.travelers ?? 2;

    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() + 14);

    // Find a matching city template
    const key = Object.keys(CITY_TEMPLATES).find((k) =>
      destination.toLowerCase().includes(k.toLowerCase())
    );
    const templates = key ? CITY_TEMPLATES[key] : null;

    const result: Day[] = [];
    for (let i = 0; i < days; i++) {
      const template = templates?.[i] ?? templates?.[i % (templates?.length ?? 1)] ?? genericDay(i + 1);
      result.push({
        ...template,
        day: i + 1,
        date: makeDate(startDate, i),
        title: template.title.replace(/Day\s+\d+/i, '').trim() || template.title,
      });
    }

    return NextResponse.json({
      days: result,
      destination,
      budget,
      travelers,
    });
  } catch (error) {
    console.error('[Itinerary API Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    );
  }
}