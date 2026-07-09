'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search as SearchIcon,
  MapPin,
  Hotel as HotelIcon,
  Plane,
  Filter,
  Star,
  Wifi,
  Waves,
  Sparkles,
  Utensils,
  Car,
  Dumbbell,
  Coffee,
  Wind,
  Baby,
  Wine,
  Mountain,
  X,
  Calendar as CalendarIcon,
  Users,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Navigation } from '@/components/travel/navigation';
import { Footer } from '@/components/travel/footer';
import { HotelCard } from '@/components/travel/hotel-card';
import { FlightCard } from '@/components/travel/flight-card';
import { HotelCardSkeleton } from '@/components/travel/hotel-card-skeleton';
import type { Hotel, Flight } from '@/lib/travel-data';

const SearchMap = dynamic(
  () => import('@/components/travel/search-map').then((m) => m.SearchMap),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[16/10] w-full bg-muted animate-pulse rounded-2xl" />
    ),
  }
);

const AMENITY_FILTERS: Array<{ key: string; label: string; icon: React.ElementType }> = [
  { key: 'wifi', label: 'Free WiFi', icon: Wifi },
  { key: 'pool', label: 'Pool', icon: Waves },
  { key: 'spa', label: 'Spa', icon: Sparkles },
  { key: 'restaurant', label: 'Restaurant', icon: Utensils },
  { key: 'bar', label: 'Bar', icon: Wine },
  { key: 'gym', label: 'Gym', icon: Dumbbell },
  { key: 'ac', label: 'Air conditioning', icon: Wind },
  { key: 'kids', label: 'Family-friendly', icon: Baby },
  { key: 'transfer', label: 'Airport transfer', icon: Car },
  { key: 'breakfast', label: 'Breakfast', icon: Coffee },
  { key: 'guide', label: 'Guided tours', icon: Mountain },
];

type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'rating';
type StarFilter = 0 | 3 | 4 | 5;
type RatingFilter = 0 | 7 | 8 | 9;

function SearchPageInner() {
  const params = useSearchParams();
  const router = useRouter();

  const [type, setType] = useState<'hotel' | 'flight' | 'package'>((params.get('type') as any) || 'hotel');
  const [destination, setDestination] = useState(params.get('destination') ?? '');
  const [from, setFrom] = useState(params.get('from') ?? '');
  const [checkIn, setCheckIn] = useState(params.get('checkIn') ?? '');
  const [checkOut, setCheckOut] = useState(params.get('checkOut') ?? '');
  const [guests, setGuests] = useState(Number(params.get('guests') ?? '2'));

  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2500]);
  const [minStars, setMinStars] = useState<StarFilter>(0);
  const [minRating, setMinRating] = useState<RatingFilter>(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('recommended');
  const [maxStops, setMaxStops] = useState<0 | 1 | 2>(2);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Run search
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        query: destination,
        destination,
        from,
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        minStars: minStars || undefined,
        minRating: minRating || undefined,
        amenities,
        sort,
        maxStops,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setHotels(data.hotels ?? []);
          setFlights(data.flights ?? []);
          setLoading(false);
        }
      })
      .catch(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [type, destination, from, priceRange, minStars, minRating, amenities, sort, maxStops]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const np = new URLSearchParams();
    np.set('type', type);
    if (destination) np.set('destination', destination);
    if (from) np.set('from', from);
    if (checkIn) np.set('checkIn', checkIn);
    if (checkOut) np.set('checkOut', checkOut);
    np.set('guests', String(guests));
    router.push(`/search?${np.toString()}`);
    // re-trigger useEffect by toggling destination state
    setDestination(destination);
  };

  const clearFilters = () => {
    setPriceRange([0, 2500]);
    setMinStars(0);
    setMinRating(0);
    setAmenities([]);
    setSort('recommended');
    setMaxStops(2);
  };

  const activeFilters = useMemo(() => {
    let count = 0;
    if (minStars > 0) count++;
    if (minRating > 0) count++;
    if (amenities.length > 0) count += amenities.length;
    if (priceRange[0] > 0 || priceRange[1] < 2500) count++;
    return count;
  }, [minStars, minRating, amenities, priceRange]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters {activeFilters > 0 && <Badge variant="secondary" className="rounded-full text-xs">{activeFilters}</Badge>}
        </h3>
        {activeFilters > 0 && (
          <button onClick={clearFilters} className="text-xs text-primary hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Price */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Price per night: <span className="text-muted-foreground">${priceRange[0]} – ${priceRange[1] === 2500 ? '2500+' : priceRange[1]}</span>
        </Label>
        <Slider
          min={0}
          max={2500}
          step={50}
          value={priceRange}
          onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
          className="mt-2"
        />
      </div>

      {/* Stars */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Property class</Label>
        <div className="flex flex-wrap gap-2">
          {([0, 3, 4, 5] as StarFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setMinStars(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                minStars === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary/40'
              }`}
            >
              {s === 0 ? 'Any' : `${s}★ & up`}
            </button>
          ))}
        </div>
      </div>

      {/* Guest rating */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Guest rating</Label>
        <div className="flex flex-wrap gap-2">
          {([0, 7, 8, 9] as RatingFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                minRating === r
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary/40'
              }`}
            >
              {r === 0 ? 'Any' : `${r}+ Wonderful`}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Amenities</Label>
        <div className="space-y-2.5">
          {AMENITY_FILTERS.slice(0, 8).map((a) => {
            const Icon = a.icon;
            const checked = amenities.includes(a.key);
            return (
              <label
                key={a.key}
                className="flex items-center gap-2.5 cursor-pointer text-sm hover:text-foreground"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(c) =>
                    setAmenities((prev) =>
                      c ? [...prev, a.key] : prev.filter((x) => x !== a.key)
                    )
                  }
                />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{a.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Flight-specific */}
      {type === 'flight' && (
        <div>
          <Label className="text-sm font-medium mb-3 block">Stops</Label>
          <div className="flex gap-2">
            {([2, 1, 0] as Array<0 | 1 | 2>).map((s) => (
              <button
                key={s}
                onClick={() => setMaxStops(s)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  maxStops === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:border-primary/40'
                }`}
              >
                {s === 2 ? 'Any' : s === 0 ? 'Direct only' : `Up to ${s}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20 pb-12 bg-surface">
        {/* Top search bar */}
        <div className="bg-card border-b sticky top-16 z-30 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <form onSubmit={handleSearch} className="flex items-stretch gap-2 flex-wrap">
              <div className="bg-muted rounded-lg p-1 inline-flex">
                {([
                  { key: 'hotel' as const, label: 'Hotels', icon: HotelIcon },
                  { key: 'flight' as const, label: 'Flights', icon: Plane },
                  { key: 'package' as const, label: 'Packages', icon: SearchIcon },
                ]).map(({ key, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setType(key)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                      type === key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 min-w-[200px] relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={type === 'flight' ? from : destination}
                  onChange={(e) => (type === 'flight' ? setFrom(e.target.value) : setDestination(e.target.value))}
                  placeholder={type === 'flight' ? 'Departure city or airport' : 'Where are you going?'}
                  className="pl-9 h-10"
                />
              </div>

              {type !== 'flight' && (
                <div className="relative flex-1 min-w-[140px]">
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="h-10"
                    placeholder="Check-in"
                  />
                </div>
              )}
              {type !== 'flight' && (
                <div className="relative flex-1 min-w-[140px]">
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="h-10"
                    placeholder="Check-out"
                  />
                </div>
              )}
              {type === 'flight' && (
                <div className="relative flex-1 min-w-[140px]">
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Arrival city or airport"
                    className="h-10"
                  />
                </div>
              )}

              <div className="relative w-28">
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="bg-primary text-primary-foreground h-10 px-5">
                <SearchIcon className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex gap-6">
            {/* Filters sidebar — desktop */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-32 bg-card border rounded-2xl p-5 shadow-card">
                <FilterPanel />
              </div>
            </aside>

            {/* Results column */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {loading ? (
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Searching…
                      </span>
                    ) : type === 'hotel' ? (
                      <>
                        {hotels.length} {hotels.length === 1 ? 'property' : 'properties'} in {destination || 'all destinations'}
                      </>
                    ) : (
                      <>
                        {flights.length} {flights.length === 1 ? 'flight' : 'flights'} found
                      </>
                    )}
                  </h1>
                  {!loading && (destination || from) && (
                    <p className="text-sm text-muted-foreground">
                      {destination && <>Showing deals in {destination}</>}
                      {type === 'flight' && from && <> · From {from}</>}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile filter button */}
                  <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <Filter className="h-4 w-4 mr-1" />
                        Filters {activeFilters > 0 && `(${activeFilters})`}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="p-5">
                        <FilterPanel />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {(type === 'hotel' || type === 'package') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMap(!showMap)}
                    >
                      {showMap ? 'Hide map' : 'Show map'}
                    </Button>
                  )}

                  {type === 'hotel' && (
                    <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                      <SelectTrigger className="h-9 w-40 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="price-asc">Price (low to high)</SelectItem>
                        <SelectItem value="price-desc">Price (high to low)</SelectItem>
                        <SelectItem value="rating">Top reviewed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Map view */}
              {showMap && !loading && hotels.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <SearchMap hotels={hotels} />
                </motion.div>
              )}

              {/* Results list */}
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <HotelCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <>
                  {type === 'hotel' || type === 'package' ? (
                    hotels.length > 0 ? (
                      <div className="space-y-4">
                        {hotels.map((h) => (
                          <HotelCard key={h.id} hotel={h} variant="list" />
                        ))}
                      </div>
                    ) : (
                      <EmptyState destination={destination} />
                    )
                  ) : flights.length > 0 ? (
                    <div className="space-y-4">
                      {flights.map((f) => (
                        <FlightCard key={f.id} flight={f} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState destination={destination} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function EmptyState({ destination }: { destination: string }) {
  return (
    <div className="text-center py-16 px-4 bg-card border rounded-2xl">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <SearchIcon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No results found</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        We couldn't find any matches{destination ? ` for "${destination}"` : ''}. Try adjusting your dates or filters.
      </p>
      <Button asChild variant="outline">
        <a href="/">Back to home</a>
      </Button>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <SearchPageInner />
    </Suspense>
  );
}