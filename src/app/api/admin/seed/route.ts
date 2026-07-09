import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hotels, flights } from '@/lib/travel-data';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function authorize(req: Request): boolean {
  const expected = process.env.SEED_KEY;
  if (!expected) return false;
  const url = new URL(req.url);
  const provided = url.searchParams.get('key') ?? req.headers.get('x-seed-key');
  return provided === expected;
}

async function runSeed() {
  let hotelCount = 0;
  let flightCount = 0;

  for (const h of hotels) {
    await db.hotel.upsert({
      where: { id: h.id },
      create: {
        id: h.id, slug: h.slug, name: h.name, description: h.description,
        city: h.city, country: h.country, countryCode: h.countryCode ?? null,
        address: h.address ?? null, neighborhood: h.neighborhood ?? null,
        latitude: h.latitude ?? null, longitude: h.longitude ?? null,
        starRating: h.starRating ?? null, guestRating: h.guestRating ?? null,
        reviewCount: h.reviewCount ?? 0, pricePerNight: h.pricePerNight,
        originalPrice: h.originalPrice ?? null, currency: h.currency,
        amenities: (h.amenities ?? []) as any,
        images: (h.images ?? []) as any,
        highlights: (h.highlights ?? []) as any,
        policies: (h.policies ?? null) as any,
        rooms: (h.rooms ?? []) as any,
        reviews: (h.reviews ?? []) as any,
        tags: (h.tags ?? []) as any,
        trending: h.trending ?? false, dealOfTheDay: h.dealOfTheDay ?? false,
      },
      update: {
        slug: h.slug, name: h.name, description: h.description,
        city: h.city, country: h.country, countryCode: h.countryCode ?? null,
        address: h.address ?? null, neighborhood: h.neighborhood ?? null,
        latitude: h.latitude ?? null, longitude: h.longitude ?? null,
        starRating: h.starRating ?? null, guestRating: h.guestRating ?? null,
        reviewCount: h.reviewCount ?? 0, pricePerNight: h.pricePerNight,
        originalPrice: h.originalPrice ?? null, currency: h.currency,
        amenities: (h.amenities ?? []) as any,
        images: (h.images ?? []) as any,
        highlights: (h.highlights ?? []) as any,
        policies: (h.policies ?? null) as any,
        rooms: (h.rooms ?? []) as any,
        reviews: (h.reviews ?? []) as any,
        tags: (h.tags ?? []) as any,
        trending: h.trending ?? false, dealOfTheDay: h.dealOfTheDay ?? false,
      },
    });
    hotelCount++;
  }

  for (const f of flights) {
    await db.flight.upsert({
      where: { id: f.id },
      create: {
        id: f.id, airline: f.airline, flightNumber: f.flightNumber,
        fromCity: f.fromCity, fromAirport: f.fromAirport ?? null,
        toCity: f.toCity, toAirport: f.toAirport ?? null,
        departure: f.departure, arrival: f.arrival,
        duration: f.duration, stops: f.stops,
        stopCities: (f.stopCities ?? []) as any,
        price: f.price, currency: f.currency,
        cabinClass: f.cabinClass ?? 'economy',
        seatsLeft: f.seatsLeft ?? null, co2Kg: f.co2Kg ?? null,
        amenities: (f.amenities ?? []) as any,
        trending: f.trending ?? false,
      },
      update: {
        airline: f.airline, flightNumber: f.flightNumber,
        fromCity: f.fromCity, fromAirport: f.fromAirport ?? null,
        toCity: f.toCity, toAirport: f.toAirport ?? null,
        departure: f.departure, arrival: f.arrival,
        duration: f.duration, stops: f.stops,
        stopCities: (f.stopCities ?? []) as any,
        price: f.price, currency: f.currency,
        cabinClass: f.cabinClass ?? 'economy',
        seatsLeft: f.seatsLeft ?? null, co2Kg: f.co2Kg ?? null,
        amenities: (f.amenities ?? []) as any,
        trending: f.trending ?? false,
      },
    });
    flightCount++;
  }

  return { hotelCount, flightCount };
}

async function ensureIndexes() {
  const statements = [
    'CREATE EXTENSION IF NOT EXISTS pg_trgm',
    `CREATE INDEX IF NOT EXISTS hotel_name_trgm ON "Hotel" USING GIN (name gin_trgm_ops)`,
    `CREATE INDEX IF NOT EXISTS hotel_city_trgm ON "Hotel" USING GIN (city gin_trgm_ops)`,
    `CREATE INDEX IF NOT EXISTS hotel_country_trgm ON "Hotel" USING GIN (country gin_trgm_ops)`,
    `CREATE INDEX IF NOT EXISTS hotel_desc_trgm ON "Hotel" USING GIN (description gin_trgm_ops)`,
    `CREATE INDEX IF NOT EXISTS hotel_neighborhood_trgm ON "Hotel" USING GIN (neighborhood gin_trgm_ops)`,
    `CREATE INDEX IF NOT EXISTS flight_fromcity_trgm ON "Flight" USING GIN ("fromCity" gin_trgm_ops)`,
    `CREATE INDEX IF NOT EXISTS flight_tocity_trgm ON "Flight" USING GIN ("toCity" gin_trgm_ops)`,
  ];
  const results: { sql: string; ok: boolean; error?: string }[] = [];
  for (const sql of statements) {
    try {
      await db.$executeRawUnsafe(sql);
      results.push({ sql, ok: true });
    } catch (e: any) {
      results.push({ sql, ok: false, error: e?.message ?? 'unknown' });
    }
  }
  return results;
}

export async function POST(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const seeded = await runSeed();
    const indexes = await ensureIndexes();
    return NextResponse.json({ ok: true, seeded, indexes });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'seed failed', stack: e?.stack },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}