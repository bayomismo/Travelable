/**
 * Google Custom Search — real travel listings from Booking.com, Expedia,
 * Skyscanner, Kayak, Airbnb, Hotels.com, Trip.com, Agoda.
 */

const GOOGLE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

interface GoogleSearchResponse {
  items?: Array<{
    title: string;
    link: string;
    snippet: string;
    displayLink: string;
    pagemap?: {
      cse_thumbnail?: Array<{ src: string }>;
      metatags?: Array<Record<string, string>>;
      product?: Array<{
        price?: string;
        pricecurrency?: string;
        name?: string;
        ratingvalue?: string;
        reviewcount?: string;
      }>;
      hproduct?: Array<{ fn?: string; photo?: string }>;
    };
  }>;
}

export type TravelKind = 'hotel' | 'flight';

export interface TravelResult {
  kind: TravelKind;
  title: string;
  url: string;
  snippet: string;
  source: string;
  image?: string;
  price?: number;
  currency?: string;
  rating?: number;
  reviews?: number;
}

const SITES: Record<TravelKind, string[]> = {
  hotel: ['booking.com', 'expedia.com', 'hotels.com', 'agoda.com', 'trip.com', 'kayak.com', 'trivago.com'],
  flight: ['skyscanner.com', 'kayak.com', 'expedia.com', 'google.com/travel/flights', 'trip.com', 'momondo.com'],
};

export interface SearchOptions {
  query: string;
  kind?: TravelKind | 'any';
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  limit?: number;
}

const cache = new Map<string, { ts: number; data: TravelResult[] }>();
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function googleTravelSearch({ query, kind = 'any', checkIn, checkOut, adults, limit = 20 }: SearchOptions): Promise<TravelResult[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;
  if (!apiKey || !cx) return [];

  const dateHint = checkIn && checkOut ? formatDateHint(checkIn, checkOut) : '';
  const kindsToSearch: TravelKind[] = kind === 'any' ? ['hotel', 'flight'] : [kind as TravelKind];

  const allResults: TravelResult[] = [];
  for (const k of kindsToSearch) {
    const siteFilter = SITES[k].map((s) => `site:${s}`).join(' OR ');
    const q = [
      query,
      k === 'hotel' ? 'hotel booking' : 'flight booking',
      dateHint,
      adults ? `${adults} guests` : '',
    ].filter(Boolean).join(' ');

    const cacheKey = `${k}::${q}`.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      allResults.push(...cached.data);
      continue;
    }

    try {
      const url = new URL(GOOGLE_SEARCH_URL);
      url.searchParams.set('key', apiKey);
      url.searchParams.set('cx', cx);
      url.searchParams.set('q', `${q} (${siteFilter})`);
      url.searchParams.set('num', String(Math.min(limit, 10)));
      url.searchParams.set('safe', 'active');

      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (!res.ok) continue;
      const data = (await res.json()) as GoogleSearchResponse;
      const results = (data.items ?? []).map((item) => parseItem(item, k));
      cache.set(cacheKey, { ts: Date.now(), data: results });
      allResults.push(...results);
    } catch {}
  }
  return allResults;
}

function parseItem(item: NonNullable<GoogleSearchResponse['items']>[number], kind: TravelKind): TravelResult {
  const pm = item.pagemap ?? {};
  const product = pm.product?.[0] ?? {};
  const meta = pm.metatags?.[0] ?? {};
  const priceStr = product.price ?? meta['product:price:amount'] ?? meta['og:price:amount'] ?? extractPriceFromSnippet(item.snippet);
  const imageUrl = pm.cse_thumbnail?.[0]?.src ?? pm.hproduct?.[0]?.photo ?? meta['og:image'];
  const ratingStr = product.ratingvalue ?? meta['og:rating'];
  const reviewCountStr = product.reviewcount ?? meta['og:rating_count'];
  const source = item.displayLink.replace(/^www\./, '');
  return {
    kind,
    title: item.title.replace(/\s+[-|–—]\s+(Booking\.com|Expedia|Hotels\.com|Agoda|Kayak|Skyscanner|Trip\.com).*$/i, '').replace(/\s+\|.*$/, '').trim(),
    url: item.link,
    snippet: item.snippet,
    source,
    image: imageUrl,
    price: priceStr ? parsePrice(priceStr) : undefined,
    currency: product.pricecurrency ?? meta['product:price:currency'] ?? 'USD',
    rating: ratingStr ? parseFloat(ratingStr) : undefined,
    reviews: reviewCountStr ? parseInt(reviewCountStr, 10) : undefined,
  };
}

function extractPriceFromSnippet(s: string): string | null {
  const m = s.match(/([\$€£¥]|USD|EUR|GBP|JPY|AUD|CAD)\s?(\d{2,5}(?:[.,]\d{3})*)/i);
  return m ? m[2].replace(/[,.](\d{3})/g, '$1') : null;
}

function parsePrice(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const n = parseFloat(raw.replace(/[^\d.]/g, ''));
  return isFinite(n) ? Math.round(n) : undefined;
}

function formatDateHint(checkIn: string, checkOut: string): string {
  try {
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(ci)} - ${fmt(co)}`;
  } catch {
    return '';
  }
}

export function isGoogleSearchConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_CX);
}