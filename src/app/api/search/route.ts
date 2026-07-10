/**
 * /api/search — Travelable hotel & flight search.
 *
 * Data sources (in priority order):
 *   1. Google Custom Search — real listings from Booking, Expedia, Skyscanner, Kayak
 *   2. Amadeus — structured hotel/flight offers with availability + prices
 *   3. Local Postgres catalogue (seeded via /api/admin/seed)
 *   4. Static demo data from travel-data.ts (last-resort so UI never breaks)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Prisma } from '@prisma/client';
import {
  isAmadeusConfigured,
  searchHotels as amadeusHotels,
  searchFlights as amadeusFlights,
  cityCode as amadeusCityCode,
  type AmadeusHotelOffer,
  type AmadeusFlightOffer,
} from '@/lib/amadeus';
import {
  isGoogleSearchConfigured,
  googleTravelSearch,
  type TravelResult,
} from '@/lib/google-search';
import { searchOSMHotels, estimatePrice, type OSMHotel } from '@/lib/openstreetmap';
import { hotels as localHotels, flights as localFlights } from '@/lib/travel-data';

interface SearchBody {
  query?: string;
  destination?: string;
  type?: 'hotel' | 'flight' | 'package' | 'any';
  city?: string;
  country?: string;
  from?: string;
  to?: string;
  checkIn?: string;
  checkOut?: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  priceMin?: number;
  priceMax?: number;
  minStars?: number;
  minRating?: number;
  amenities?: string[];
  sort?: 'recommended' | 'price-asc' | 'price-desc' | 'rating';
  page?: number;
  limit?: number;
  maxStops?: number;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as SearchBody;
  const type = body.type ?? 'any';
  const limit = Math.min(Math.max(body.limit ?? 20, 1), 50);

  const amadeusOn = isAmadeusConfigured();
  const googleOn = isGoogleSearchConfigured();

  // Build a free-text query string for Google CSE
  const textQuery = body.query ?? body.destination ?? body.from ?? '';

  // Fire all sources in parallel
  const [dbHotels, dbFlights, amHotels, amFlights, googleResults, osmHotels] = await Promise.all([
    (type === 'hotel' || type === 'package' || type === 'any')
      ? searchDbHotels(body, limit).catch(() => [])
      : Promise.resolve([]),
    (type === 'flight' || type === 'package' || type === 'any')
      ? searchDbFlights(body, limit).catch(() => [])
      : Promise.resolve([]),
    amadeusOn && (type === 'hotel' || type === 'any') && body.checkIn && body.checkOut && body.destination
      ? amadeusHotels({
          cityCode: (await amadeusCityCode(body.destination)) ?? '',
          checkIn: body.checkIn,
          checkOut: body.checkOut,
          adults: body.adults,
          priceMax: body.priceMax,
        }).catch(() => [] as AmadeusHotelOffer[])
      : Promise.resolve([] as AmadeusHotelOffer[]),
    amadeusOn && (type === 'flight' || type === 'any') && body.from && body.to && body.departureDate
      ? amadeusFlights({
          origin: body.from,
          destination: body.to,
          departureDate: body.departureDate,
          returnDate: body.returnDate,
          adults: body.adults,
          maxPrice: body.priceMax,
        }).catch(() => [] as AmadeusFlightOffer[])
      : Promise.resolve([] as AmadeusFlightOffer[]),
    googleOn && textQuery
      ? googleTravelSearch({
          query: textQuery,
          kind: type === 'flight' ? 'flight' : type === 'hotel' ? 'hotel' : 'any',
          checkIn: body.checkIn,
          checkOut: body.checkOut,
          adults: body.adults,
          limit,
        }).catch(() => [] as TravelResult[])
      : Promise.resolve([] as TravelResult[]),
    (type === 'hotel' || type === 'any') && body.destination
      ? searchOSMHotels(body.destination, limit).catch(() => [] as OSMHotel[])
      : Promise.resolve([] as OSMHotel[]),
  ]);

  // Split Google results by kind
  const googleHotels = googleResults.filter((r) => r.kind === 'hotel');
  const googleFlights = googleResults.filter((r) => r.kind === 'flight');

  // Map OSM hotels to common shape
  const osmMapped = osmHotels.map((h) => ({
    id: h.id,
    slug: h.id,
    name: h.name,
    city: h.city,
    country: h.country,
    address: h.address,
    latitude: h.latitude,
    longitude: h.longitude,
    starRating: h.stars,
    guestRating: h.stars ? h.stars * 2 - 1 : undefined, // rough conversion
    reviewCount: 0,
    pricePerNight: estimatePrice(h),
    currency: 'USD',
    amenities: [
      h.wifi && 'Wi-Fi',
      h.breakfast && 'Breakfast',
      h.pool && 'Pool',
      h.parking && 'Parking',
      h.airConditioning && 'Air conditioning',
      h.pets && 'Pets allowed',
      h.wheelchair && 'Wheelchair accessible',
    ].filter(Boolean),
    images: [],
    highlights: [],
    policies: { freeCancellation: false, breakfastIncluded: !!h.breakfast, payAtProperty: true, checkIn: '15:00', checkOut: '11:00' },
    rooms: [],
    reviews: [],
    tags: [h.kind, 'osm'],
    trending: false,
    dealOfTheDay: false,
    source: 'openstreetmap',
    website: h.website,
    phone: h.phone,
  }));

  // Priority: OSM (real, free, no key) → Google → Amadeus → DB → local catalogue
  const hotels =
    osmMapped.length > 0
      ? osmMapped
      : googleHotels.length > 0
      ? googleHotels
      : amHotels.length > 0
      ? amHotels
      : dbHotels.length > 0
      ? dbHotels
      : type === 'flight'
      ? []
      : localHotelFallback(body);

  const flights =
    googleFlights.length > 0
      ? googleFlights
      : amFlights.length > 0
      ? amFlights
      : dbFlights.length > 0
      ? dbFlights
      : type === 'hotel'
      ? []
      : localFlightFallback(body);

  const insight = await getInsight(textQuery);

  const hotelSource = osmMapped.length > 0
    ? 'openstreetmap'
    : googleHotels.length > 0
    ? 'google'
    : amHotels.length > 0
    ? 'amadeus'
    : dbHotels.length > 0
    ? 'database'
    : 'catalogue';

  const flightSource = googleFlights.length > 0
    ? 'google'
    : amFlights.length > 0
    ? 'amadeus'
    : dbFlights.length > 0
    ? 'database'
    : 'catalogue';

  return NextResponse.json({
    hotels,
    flights,
    totalHotels: hotels.length,
    totalFlights: flights.length,
    source: {
      hotels: hotelSource,
      flights: flightSource,
    },
    integrations: {
      openstreetmap: true,
      google: googleOn,
      amadeus: amadeusOn,
    },
    destination: body.destination ?? null,
    insight,
  });
}

async function searchDbHotels(body: SearchBody, limit: number) {
  const where: Prisma.HotelWhereInput = {};
  const textQuery = (body.query ?? body.destination ?? body.city ?? '').trim();
  if (textQuery) {
    where.OR = [
      { city: { contains: textQuery, mode: 'insensitive' } },
      { country: { contains: textQuery, mode: 'insensitive' } },
      { name: { contains: textQuery, mode: 'insensitive' } },
      { neighborhood: { contains: textQuery, mode: 'insensitive' } },
      { address: { contains: textQuery, mode: 'insensitive' } },
      { description: { contains: textQuery, mode: 'insensitive' } },
    ];
  }
  if (body.priceMin != null || body.priceMax != null) {
    where.pricePerNight = {};
    if (body.priceMin != null) where.pricePerNight.gte = body.priceMin;
    if (body.priceMax != null) where.pricePerNight.lte = body.priceMax;
  }
  if (body.minStars != null) where.starRating = { gte: body.minStars };
  if (body.minRating != null) where.guestRating = { gte: body.minRating };

  const rows = await db.hotel.findMany({ where, take: limit });
  return rows.map(normalizeHotel);
}

async function searchDbFlights(body: SearchBody, limit: number) {
  const where: Prisma.FlightWhereInput = {};
  if (body.from) {
    where.OR = [
      { departureCity: { contains: body.from, mode: 'insensitive' } },
      { departureAirport: { equals: body.from.toUpperCase() } },
    ];
  }
  if (body.to) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
      {
        OR: [
          { arrivalCity: { contains: body.to, mode: 'insensitive' } },
          { arrivalAirport: { equals: body.to.toUpperCase() } },
        ],
      },
    ];
  }
  if (body.maxStops != null) where.stops = { lte: body.maxStops };

  const rows = await db.flight.findMany({
    where,
    orderBy: { price: 'asc' },
    take: limit,
  });
  return rows.map(normalizeFlight);
}

function localHotelFallback(body: SearchBody): any[] {
  const q = (body.query ?? body.destination ?? body.city ?? '').toLowerCase();
  let results = localHotels.filter((h) => {
    if (!q) return true;
    return (
      h.city.toLowerCase().includes(q) ||
      h.country.toLowerCase().includes(q) ||
      h.name.toLowerCase().includes(q)
    );
  });
  if (body.priceMax != null) results = results.filter((h) => h.pricePerNight <= body.priceMax!);
  if (body.priceMin != null) results = results.filter((h) => h.pricePerNight >= body.priceMin!);
  if (body.minStars != null) results = results.filter((h) => (h.starRating ?? 0) >= body.minStars!);
  if (body.minRating != null) results = results.filter((h) => (h.guestRating ?? 0) >= body.minRating!);
  switch (body.sort) {
    case 'price-asc':
      results.sort((a, b) => a.pricePerNight - b.pricePerNight);
      break;
    case 'price-desc':
      results.sort((a, b) => b.pricePerNight - a.pricePerNight);
      break;
    case 'rating':
      results.sort((a, b) => (b.guestRating ?? 0) - (a.guestRating ?? 0));
      break;
  }
  return results.slice(0, 20);
}

function localFlightFallback(body: SearchBody): any[] {
  const from = (body.from ?? '').toLowerCase();
  const to = (body.to ?? '').toLowerCase();
  let results = localFlights.filter((f) => {
    if (from && !f.departureCity.toLowerCase().includes(from) && !f.departureAirport.toLowerCase().includes(from)) return false;
    if (to && !f.arrivalCity.toLowerCase().includes(to) && !f.arrivalAirport.toLowerCase().includes(to)) return false;
    return true;
  });
  if (body.maxStops != null) results = results.filter((f) => f.stops <= body.maxStops!);
  results.sort((a, b) => a.price - b.price);
  return results.slice(0, 20);
}

function normalizeHotel(h: any) {
  return {
    ...h,
    amenities: Array.isArray(h.amenities) ? h.amenities : [],
    images: Array.isArray(h.images) ? h.images : [],
    highlights: Array.isArray(h.highlights) ? h.highlights : [],
    rooms: Array.isArray(h.rooms) ? h.rooms : [],
    reviews: Array.isArray(h.reviews) ? h.reviews : [],
    tags: Array.isArray(h.tags) ? h.tags : [],
    policies: h.policies ?? { freeCancellation: false, breakfastIncluded: false, payAtProperty: true, checkIn: '15:00', checkOut: '11:00' },
  };
}

function normalizeFlight(f: any) {
  return {
    ...f,
    stopCities: Array.isArray(f.stopCities) ? f.stopCities : [],
    amenities: Array.isArray(f.amenities) ? f.amenities : [],
  };
}

async function getInsight(query: string): Promise<string | null> {
  if (!query) return null;
  try {
    if (!process.env.ZAI_API_KEY) return null;
    const mod = await import('z-ai-web-dev-sdk').catch(() => null);
    if (!mod?.default) return null;
    const zai = await mod.default.create();
    const res = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are Travelable. Output one sentence (max 30 words) of travel insight for the query. No markdown.',
        },
        { role: 'user', content: query },
      ],
      thinking: { type: 'disabled' },
    });
    return res.choices[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint with a JSON body to search.',
    integrations: {
      openstreetmap: true, // always on, free
      google: isGoogleSearchConfigured(),
      amadeus: isAmadeusConfigured(),
    },
    example: {
      destination: 'Paris',
      type: 'hotel',
      checkIn: '2026-08-01',
      checkOut: '2026-08-05',
      adults: 2,
    },
  });
}