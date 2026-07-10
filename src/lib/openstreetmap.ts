/**
 * OpenStreetMap-powered hotel finder.
 *
 * Uses the Overpass API (https://overpass-api.de) to query real hotel POIs
 * from the OpenStreetMap dataset. Completely free, no API key, no signup.
 *
 * Coverage: worldwide (millions of hotels, hostels, guesthouses).
 * Data: name, address, coordinates, phone, website, star rating, amenities.
 *
 * Combine with Nominatim for city-to-bbox translation.
 */

const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

export interface OSMHotel {
  id: string;
  name: string;
  kind: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  website?: string;
  stars?: number;
  rooms?: number;
  wheelchair?: boolean;
  wifi?: boolean;
  smoking?: boolean;
  pets?: boolean;
  parking?: boolean;
  pool?: boolean;
  breakfast?: boolean;
  airConditioning?: boolean;
}

/** Search hotels in a city via Nominatim → bbox → Overpass. */
export async function searchOSMHotels(city: string, limit = 25): Promise<OSMHotel[]> {
  // 1. Get city bbox via Nominatim (free, no key)
  const nominatim = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&addressdetails=1`,
    { headers: { 'User-Agent': 'Travelable/1.0 (https://travelable.vercel.app)', 'Accept': 'application/json' } }
  );
  if (!nominatim.ok) return [];
  const geo = (await nominatim.json()) as Array<{
    boundingbox: [string, string, string, string];
    address?: { country?: string; city?: string; town?: string };
  }>;
  if (!geo.length) return [];

  const [south, north, west, east] = geo[0].boundingbox.map(parseFloat);
  const bbox = `${south},${west},${north},${east}`;
  const cityName = geo[0].address?.city ?? geo[0].address?.town ?? city;
  const country = geo[0].address?.country ?? '';

  // 2. Query Overpass for hotels in bbox
  const query = `
    [out:json][timeout:25];
    (
      node["tourism"="hotel"](${bbox});
      way["tourism"="hotel"](${bbox});
      node["tourism"="hostel"](${bbox});
      way["tourism"="hostel"](${bbox});
      node["tourism"="guest_house"](${bbox});
      way["tourism"="guest_house"](${bbox});
      node["tourism"="apartment"](${bbox});
      way["tourism"="apartment"](${bbox});
    );
    out center ${Math.min(limit * 2, 200)};
  `;

  for (const endpoint of OVERPASS_URLS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'User-Agent': 'Travelable/1.0 (https://travelable.vercel.app; contact@travelable.app)',
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        elements?: Array<{
          id: number;
          type: string;
          lat?: number;
          lon?: number;
          center?: { lat: number; lon: number };
          tags?: Record<string, string>;
        }>;
      };
      const elements = data.elements ?? [];
      const hotels = elements
        .map((el) => normalizeHotel(el, cityName, country))
        .filter((h): h is OSMHotel => h !== null)
        .slice(0, limit);
      return hotels;
    } catch {
      // try next mirror
      continue;
    }
  }
  return [];
}

function normalizeHotel(
  el: { id: number; type: string; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> },
  city: string,
  country: string,
): OSMHotel | null {
  const tags = el.tags ?? {};
  const name = tags.name ?? tags['name:en'];
  if (!name) return null;

  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (lat == null || lon == null) return null;

  const kind = tags.tourism ?? 'hotel';
  const addr = [
    tags['addr:housenumber'],
    tags['addr:street'],
  ]
    .filter(Boolean)
    .join(' ');

  return {
    id: `${el.type}/${el.id}`,
    name,
    kind,
    latitude: lat,
    longitude: lon,
    address: addr || undefined,
    city,
    country,
    phone: tags.phone ?? tags['contact:phone'],
    website: tags.website ?? tags['contact:website'],
    stars: tags.stars ? parseInt(tags.stars, 10) : undefined,
    rooms: tags.rooms ? parseInt(tags.rooms, 10) : undefined,
    wheelchair: tags.wheelchair === 'yes',
    wifi: tags.internet_access === 'wlan' || tags.wifi === 'yes',
    smoking: tags.smoking === 'yes',
    pets: tags.pets === 'yes',
    parking: tags.parking !== 'no',
    pool: tags.pool === 'yes' || tags.swimming_pool === 'yes',
    breakfast: tags.breakfast === 'yes',
    airConditioning: tags.air_conditioning === 'yes',
  };
}

/** Estimate a price per night in USD based on kind + stars (heuristic). */
export function estimatePrice(hotel: OSMHotel): number {
  // Hostels / guest houses are cheaper
  const isBudget = hotel.kind === 'hostel' || hotel.kind === 'guest_house' || hotel.kind === 'apartment';
  const base: Record<number, number> = isBudget
    ? { 0: 35, 1: 50, 2: 75, 3: 110, 4: 180, 5: 320 }
    : { 0: 60, 1: 80, 2: 115, 3: 165, 4: 280, 5: 520 };

  // Vary slightly by name length (deterministic jitter so same hotel = same price)
  const stars = hotel.stars ?? 3;
  const jitter = ((hotel.id.charCodeAt(hotel.id.length - 1) % 11) - 5) * 4;
  const price = (base[Math.min(Math.max(stars, 0), 5)] ?? 140) + jitter;

  // Add premium for amenities
  let premium = 0;
  if (hotel.pool) premium += 25;
  if (hotel.breakfast) premium += 15;
  if (hotel.airConditioning) premium += 10;
  if (hotel.parking) premium += 10;

  return Math.max(35, price + premium);
}