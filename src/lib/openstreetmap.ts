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
    { headers: { 'User-Agent': 'Travelable/1.0' } }
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
        body: `data=${encodeURIComponent(query)}`,
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

/** Estimate a price per night in USD based on stars (heuristic). */
export function estimatePrice(hotel: OSMHotel): number {
  const stars = hotel.stars ?? 3;
  const base: Record<number, number> = {
    0: 45, // hostel / guest house
    1: 65,
    2: 95,
    3: 140,
    4: 240,
    5: 480,
  };
  return base[Math.min(Math.max(stars, 0), 5)] ?? 140;
}