/**
 * /api/search/suggestions — destination autocomplete.
 * Priority: Amadeus locations (real airports + cities) → local catalogue → Nominatim fallback.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAmadeusConfigured, searchLocations } from '@/lib/amadeus';
import { hotels as localHotels } from '@/lib/travel-data';

export interface Suggestion {
  id: string;
  displayName: string;
  city: string;
  country: string;
  type: 'city' | 'hotel' | 'airport';
  iataCode?: string;
  source: 'amadeus' | 'catalogue' | 'nominatim';
}

const cache = new Map<string, { ts: number; data: Suggestion[] }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim();
  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  // Cache hit
  const cached = cache.get(q.toLowerCase());
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json({ suggestions: cached.data });
  }

  const suggestions: Suggestion[] = [];
  const ql = q.toLowerCase();

  // 1. Local catalogue (hotels)
  for (const h of localHotels) {
    if (
      h.name.toLowerCase().includes(ql) ||
      h.city.toLowerCase().includes(ql) ||
      h.country.toLowerCase().includes(ql)
    ) {
      suggestions.push({
        id: h.id,
        displayName: `${h.name} — ${h.city}`,
        city: h.city,
        country: h.country,
        type: 'hotel',
        source: 'catalogue',
      });
    }
    if (suggestions.length >= 4) break;
  }

  // 2. Local catalogue cities (dedup)
  const citySet = new Set<string>();
  for (const h of localHotels) {
    const cityKey = `${h.city}|${h.country}`;
    if (citySet.has(cityKey)) continue;
    if (h.city.toLowerCase().includes(ql) || h.country.toLowerCase().includes(ql)) {
      suggestions.push({
        id: `city-${h.city}`,
        displayName: `${h.city}, ${h.country}`,
        city: h.city,
        country: h.country,
        type: 'city',
        source: 'catalogue',
      });
      citySet.add(cityKey);
    }
    if (citySet.size >= 3) break;
  }

  // 3. Amadeus (real airports + cities)
  if (isAmadeusConfigured() && suggestions.length < 8) {
    try {
      const amadeus = await searchLocations(q, 6);
      for (const loc of amadeus) {
        // Avoid duplicates
        if (suggestions.some((s) => s.displayName === loc.name)) continue;
        suggestions.push({
          id: `amadeus-${loc.id}`,
          displayName: loc.name,
          city: loc.name,
          country: loc.country ?? '',
          type: loc.type === 'AIRPORT' ? 'airport' : 'city',
          iataCode: loc.iataCode,
          source: 'amadeus',
        });
      }
    } catch {
      // ignore
    }
  }

  // 4. Nominatim fallback (only if we still have < 5)
  if (suggestions.length < 5) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,
        {
          headers: { 'User-Agent': 'Travelable/1.0' },
          signal: controller.signal,
        }
      ).finally(() => clearTimeout(timeout));
      if (res.ok) {
        const data = (await res.json()) as Array<{
          display_name: string;
          lat: string;
          lon: string;
          address?: { city?: string; town?: string; country?: string; country_code?: string };
        }>;
        for (const item of data) {
          const city = item.address?.city ?? item.address?.town ?? item.display_name.split(',')[0];
          const country = item.address?.country ?? '';
          if (!city) continue;
          if (suggestions.some((s) => s.city === city && s.country === country)) continue;
          suggestions.push({
            id: `nom-${item.lat}-${item.lon}`,
            displayName: item.display_name.split(',').slice(0, 2).join(',').trim(),
            city,
            country,
            type: 'city',
            source: 'nominatim',
          });
        }
      }
    } catch {
      // timeout / network error → ignore
    }
  }

  const top = suggestions.slice(0, 10);
  cache.set(q.toLowerCase(), { ts: Date.now(), data: top });
  return NextResponse.json({ suggestions: top });
}