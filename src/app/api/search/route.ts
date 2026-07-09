/**
 * /api/search — Travelable hotel & flight search.
 *
 * Production-quality, deterministic search over a curated catalogue. The route
 * also accepts a natural-language `query` string and resolves it to a
 * destination using simple keyword matching. If the optional z-ai-web-dev-sdk
 * is configured (ZAI_API_KEY env), we layer an LLM explanation on top — but
 * the route NEVER fails just because the SDK is missing.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  searchHotels,
  searchFlights,
  destinations,
  type Hotel,
  type Flight,
} from '@/lib/travel-data';

interface SearchBody {
  query?: string;
  destination?: string;
  type?: 'hotel' | 'flight' | 'package' | 'any';
  priceMin?: number;
  priceMax?: number;
  minStars?: number;
  minRating?: number;
  amenities?: string[];
  sort?: 'recommended' | 'price-asc' | 'price-desc' | 'rating';
  from?: string;
  to?: string;
  maxStops?: number;
}

function resolveDestination(query: string): string | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().trim();

  // Direct match against known destinations
  for (const d of destinations) {
    if (q.includes(d.name.toLowerCase()) || q.includes(d.country.toLowerCase())) {
      return d.name;
    }
  }

  // Keyword → destination mapping
  const keywords: Record<string, string> = {
    beach: 'Bali',
    tropical: 'Bali',
    surf: 'Bali',
    honeymoon: 'Santorini',
    romantic: 'Santorini',
    sunset: 'Santorini',
    japan: 'Tokyo',
    sushi: 'Tokyo',
    city: 'New York',
    nyc: 'New York',
    manhattan: 'New York',
    europe: 'Paris',
    french: 'Paris',
    wine: 'Paris',
    wellness: 'Bali',
    yoga: 'Bali',
    culture: 'Kyoto',
    history: 'Kyoto',
    temple: 'Kyoto',
    snow: 'Reykjavík',
    aurora: 'Reykjavík',
    northern: 'Reykjavík',
    hiking: 'Patagonia',
    trekking: 'Patagonia',
    luxury: 'Maldives',
    overwater: 'Maldives',
    budget: 'Bangkok',
    cheap: 'Bangkok',
    street: 'Bangkok',
    food: 'Tokyo',
  };
  for (const [k, v] of Object.entries(keywords)) {
    if (q.includes(k)) return v;
  }
  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as SearchBody;

    if (!body.query && !body.destination && !body.from && !body.to) {
      return NextResponse.json(
        { error: 'Provide a search query, destination, or flight route.' },
        { status: 400 }
      );
    }

    const type = body.type ?? 'any';
    const destination = body.destination || resolveDestination(body.query ?? '');

    const hotels: Hotel[] =
      type === 'hotel' || type === 'package' || type === 'any'
        ? searchHotels({
            query: body.query,
            destination,
            priceMin: body.priceMin,
            priceMax: body.priceMax,
            minStars: body.minStars,
            minRating: body.minRating,
            amenities: body.amenities,
            sort: body.sort,
          })
        : [];

    const flights: Flight[] =
      type === 'flight' || type === 'package' || type === 'any'
        ? searchFlights({
            from: body.from || (body.query ? extractAirport(body.query) : undefined),
            to: body.to || (destination ? destination : undefined),
            maxStops: body.maxStops,
          })
        : [];

    // Optional AI-generated insight (only if SDK is configured)
    let insight: string | undefined;
    try {
      // @ts-ignore - optional SDK, may not exist
      if (process.env.ZAI_API_KEY) {
        const { default: ZAI } = await import('z-ai-web-dev-sdk').catch(() => ({ default: null }));
        if (ZAI) {
          const zai = await ZAI.create();
          const res = await zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content:
                  "You are Travelable's travel concierge. Given a user search, output one concise sentence (max 30 words) describing the best time to visit or top tip. No markdown.",
              },
              { role: 'user', content: body.query || `${destination} ${type}` },
            ],
            thinking: { type: 'disabled' },
          });
          insight = res.choices[0]?.message?.content?.trim();
        }
      }
    } catch {
      insight = undefined;
    }

    return NextResponse.json({
      hotels,
      flights,
      destination,
      totalHotels: hotels.length,
      totalFlights: flights.length,
      insight,
    });
  } catch (error) {
    console.error('[Search API Error]', error);
    return NextResponse.json(
      { error: 'Failed to perform search. Please try again.' },
      { status: 500 }
    );
  }
}

function extractAirport(q: string): string | undefined {
  // e.g. "flights from JFK to Paris"
  const m = q.match(/from\s+([A-Z]{3,4})/i);
  return m?.[1];
}

export async function GET() {
  return NextResponse.json({
    destinations: destinations.slice(0, 8),
  });
}