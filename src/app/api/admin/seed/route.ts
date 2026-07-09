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
    const data = {
      slug: h.slug,
      name: h.name,
      description: h.description,
      city: h.city,
      country: h.country,
      countryCode: h.countryCode ?? null,
      address: h.address ?? null,
      neighborhood: h.neighborhood ?? null,
      latitude: h.latitude ?? null,
      longitude: h.longitude ?? null,
      starRating: h.starRating ?? null,
      rating: h.guestRating ?? null,
      guestRating: h.guestRating ?? null,
      reviewCount: h.reviewCount ?? 0,
      pricePerNight: h.pricePerNight,
      originalPrice: h.originalPrice ?? null,
      currency: h.currency,
      amenities: (h.amenities ?? []) as any,
      images: (h.images ?? []) as any,
      highlights: (h.highlights ?? []) as any,
      policies: (h.policies ?? null) as any,
      rooms: (h.rooms ?? []) as any,
      tags: (h.tags ?? []) as any,
      trending: h.trending ?? false,
      dealOfTheDay: h.dealOfTheDay ?? false,
    };

    const existing = await db.hotel.findUnique({ where: { id: h.id } });
    if (existing) {
      await db.hotel.update({ where: { id: h.id }, data });
    } else {
      const bySlug = h.slug ? await db.hotel.findUnique({ where: { slug: h.slug } }) : null;
      if (bySlug) {
        await db.hotel.update({ where: { id: bySlug.id }, data });
      } else {
        await db.hotel.create({ data: { id: h.id, ...data } });
      }
    }
    hotelCount++;
  }

  for (const f of flights) {
    const data = {
      airline: f.airline,
      flightNumber: f.flightNumber,
      departureAirport: f.fromAirport ?? '',
      arrivalAirport: f.toAirport ?? '',
      departureCity: f.fromCity,
      arrivalCity: f.toCity,
      departureTime: new Date(f.departure),
      arrivalTime: new Date(f.arrival),
      duration: f.duration,
      stops: f.stops,
      price: f.price,
      currency: f.currency,
      class: f.cabinClass ?? 'economy',
      cabinClass: f.cabinClass ?? 'economy',
      seatAvailable: f.seatsLeft ?? null,
      stopCities: (f.stopCities ?? []) as any,
      co2Kg: f.co2Kg ?? null,
      amenities: (f.amenities ?? []) as any,
      trending: f.trending ?? false,
    };

    const existing = await db.flight.findUnique({ where: { id: f.id } });
    if (existing) {
      await db.flight.update({ where: { id: f.id }, data });
    } else {
      await db.flight.create({ data: { id: f.id, ...data } });
    }
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
    `CREATE INDEX IF NOT EXISTS flight_from_trgm ON "Flight" USING GIN ("departureCity" gin_trgm_ops)`,
    `CREATE INDEX IF NOT EXISTS flight_to_trgm ON "Flight" USING GIN ("arrivalCity" gin_trgm_ops)`,
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