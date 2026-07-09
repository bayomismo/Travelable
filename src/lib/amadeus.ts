/**
 * Amadeus API client — real travel inventory used by Booking.com, Expedia, Kayak.
 * Free self-service tier: 2,000 calls/month against real hotels + flights.
 *
 * Docs: https://developers.amadeus.com/self-service/apis-docs
 */

const AMADEUS_BASE = 'https://test.api.amadeus.com';

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

async function getAccessToken(): Promise<string | null> {
  const id = process.env.AMADEUS_CLIENT_ID;
  const secret = process.env.AMADEUS_CLIENT_SECRET;
  if (!id || !secret) return null;

  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }

  const res = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: id,
      client_secret: secret,
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Amadeus token error:', res.status, await res.text());
    return null;
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return tokenCache.token;
}

async function amadeusGet<T>(path: string, params: Record<string, string>): Promise<T | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const url = new URL(`${AMADEUS_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`Amadeus ${path} ${res.status}:`, await res.text().catch(() => ''));
    return null;
  }

  return (await res.json()) as T;
}

// ─── HOTELS ────────────────────────────────────────────────────────────────

export interface AmadeusHotelOffer {
  hotelId: string;
  name: string;
  chainCode?: string;
  cityCode: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  currency: string;
  checkIn: string;
  checkOut: string;
  roomType?: string;
  beds?: number;
  description?: string;
  amenities: string[];
  rating?: number;
  imageUrl?: string;
}

interface HotelListResponse {
  data?: Array<{
    hotelId: string;
    name: string;
    chainCode?: string;
    address?: { cityName?: string; countryCode?: string };
    geoCode?: { latitude: number; longitude: number };
    rating?: string;
    amenities?: string[];
    media?: Array<{ uri: string }>;
  }>;
}

interface HotelOfferResponse {
  data?: Array<{
    hotel: {
      hotelId: string;
      name: string;
      chainCode?: string;
      cityCode: string;
      latitude: number;
      longitude: number;
      rating?: string;
      amenities?: string[];
    };
    offers: Array<{
      id: string;
      checkInDate: string;
      checkOutDate: string;
      price: { total: string; currency: string };
      room?: { typeEstimated?: { category?: string } };
      guests?: { adults: number };
    }>;
  }>;
}

/** Search hotels in a city by IATA city code (e.g. "PAR", "TYO", "NYC"). */
export async function searchHotels(params: {
  cityCode: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  priceMin?: number;
  priceMax?: number;
}): Promise<AmadeusHotelOffer[]> {
  // Step 1: list hotels in city
  const list = await amadeusGet<HotelListResponse>('/v1/reference-data/locations/hotels/by-city', {
    cityCode: params.cityCode,
  });
  if (!list?.data) return [];

  const hotelIds = list.data.slice(0, 20).map((h) => h.hotelId);
  if (hotelIds.length === 0) return [];

  // Step 2: get offers
  const offers = await amadeusGet<HotelOfferResponse>('/v3/shopping/hotel-offers', {
    hotelIds: hotelIds.join(','),
    checkInDate: params.checkIn,
    checkOutDate: params.checkOut,
    adults: String(params.adults ?? 1),
    roomQuantity: '1',
    currency: 'USD',
  });
  if (!offers?.data) return [];

  const listMap = new Map(list.data.map((h) => [h.hotelId, h]));

  return offers.data
    .map((entry): AmadeusHotelOffer | null => {
      const offer = entry.offers[0];
      if (!offer) return null;
      const meta = listMap.get(entry.hotel.hotelId);
      const price = parseFloat(offer.price.total);
      if (params.priceMin && price < params.priceMin) return null;
      if (params.priceMax && price > params.priceMax) return null;
      return {
        hotelId: entry.hotel.hotelId,
        name: entry.hotel.name,
        chainCode: entry.hotel.chainCode,
        cityCode: entry.hotel.cityCode,
        latitude: entry.hotel.latitude,
        longitude: entry.hotel.longitude,
        pricePerNight: Math.round(price),
        currency: offer.price.currency,
        checkIn: offer.checkInDate,
        checkOut: offer.checkOutDate,
        roomType: offer.room?.typeEstimated?.category,
        beds: offer.guests?.adults,
        amenities: entry.hotel.amenities ?? [],
        rating: entry.hotel.rating ? parseFloat(entry.hotel.rating) : undefined,
        imageUrl: meta?.media?.[0]?.uri,
      };
    })
    .filter((x): x is AmadeusHotelOffer => x !== null);
}

// ─── FLIGHTS ───────────────────────────────────────────────────────────────

export interface AmadeusFlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  fromCity: string;
  toCity: string;
  fromAirport: string;
  toAirport: string;
  departure: string;
  arrival: string;
  durationMinutes: number;
  stops: number;
  price: number;
  currency: string;
  cabinClass: string;
  seatsLeft?: number;
  co2Kg?: number;
}

interface FlightResponse {
  data?: Array<{
    id: string;
    itineraries: Array<{
      duration: string;
      segments: Array<{
        departure: { iataCode: string; at: string };
        arrival: { iataCode: string; at: string };
        carrierCode: string;
        number: string;
        duration: string;
      }>;
    }>;
    price: { total: string; currency: string };
    travelerPricings: Array<{
      fareDetailsBySegment: Array<{ cabin: string }>;
    }>;
    numberOfBookableSeats?: number;
  }>;
  dictionaries?: {
    carriers?: Record<string, string>;
  };
}

/** Parse ISO 8601 duration like "PT7H25M" → minutes. */
function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return (parseInt(match[1] ?? '0') * 60) + parseInt(match[2] ?? '0');
}

export async function searchFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  maxPrice?: number;
}): Promise<AmadeusFlightOffer[]> {
  const offer = await amadeusGet<FlightResponse>('/v2/shopping/flight-offers', {
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    returnDate: params.returnDate ?? '',
    adults: String(params.adults ?? 1),
    travelClass: params.travelClass ?? 'ECONOMY',
    currencyCode: 'USD',
    max: '30',
  });
  if (!offer?.data) return [];

  const carriers = offer.dictionaries?.carriers ?? {};

  return offer.data
    .map((f): AmadeusFlightOffer | null => {
      const seg = f.itineraries[0]?.segments[0];
      if (!seg) return null;
      const price = parseFloat(f.price.total);
      if (params.maxPrice && price > params.maxPrice) return null;
      return {
        id: f.id,
        airline: carriers[seg.carrierCode] ?? seg.carrierCode,
        airlineCode: seg.carrierCode,
        flightNumber: `${seg.carrierCode}${seg.number}`,
        fromAirport: seg.departure.iataCode,
        toAirport: seg.arrival.iataCode,
        fromCity: seg.departure.iataCode,
        toCity: seg.arrival.iataCode,
        departure: seg.departure.at,
        arrival: seg.arrival.at,
        durationMinutes: parseDuration(f.itineraries[0].duration),
        stops: f.itineraries[0].segments.length - 1,
        price: Math.round(price),
        currency: f.price.currency,
        cabinClass: f.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin ?? 'ECONOMY',
        seatsLeft: f.numberOfBookableSeats,
      };
    })
    .filter((x): x is AmadeusFlightOffer => x !== null);
}

// ─── CITY / AIRPORT LOOKUP ─────────────────────────────────────────────────

export async function cityCode(query: string): Promise<string | null> {
  if (!query || query.length < 2) return null;
  const res = await amadeusGet<{
    data?: Array<{ address?: { cityName?: string }; iataCode?: string; subType?: string }>;
  }>('/v1/reference-data/locations', {
    keyword: query,
    subType: 'CITY,AIRPORT',
  });
  if (!res?.data) return null;
  const first = res.data[0];
  return first?.iataCode ?? null;
}

export async function searchLocations(query: string, limit = 8): Promise<
  Array<{ id: string; name: string; iataCode: string; type: string; country?: string }>
> {
  if (!query || query.length < 2) return [];
  const res = await amadeusGet<{
    data?: Array<{
      id: string;
      name: string;
      iataCode?: string;
      subType: string;
      address?: { countryName?: string; cityName?: string };
    }>;
  }>('/v1/reference-data/locations', {
    keyword: query,
    subType: 'CITY,AIRPORT',
  });
  if (!res?.data) return [];
  return res.data.slice(0, limit).map((l) => ({
    id: l.id,
    name: l.name,
    iataCode: l.iataCode ?? '',
    type: l.subType,
    country: l.address?.countryName,
  }));
}

export function isAmadeusConfigured(): boolean {
  return Boolean(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET);
}