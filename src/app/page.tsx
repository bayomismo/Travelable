'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Hotel,
  Plane,
  Package,
  Sparkles,
  Calendar as CalendarIcon,
  Users,
  Shield,
  Heart,
  Wallet,
  Compass,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navigation } from '@/components/travel/navigation';
import { Footer } from '@/components/travel/footer';
import { DestinationGrid } from '@/components/travel/destination-grid';
import { FeaturedHotels } from '@/components/travel/featured-hotels';
import { TrustBar } from '@/components/travel/trust-bar';
import { Testimonials } from '@/components/travel/testimonials';
import { CTABanner } from '@/components/travel/cta-banner';
import { popularDestinations } from '@/lib/popular';

type Tab = 'hotels' | 'flights' | 'packages';

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('hotels');
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (tab === 'hotels') {
      params.set('type', 'hotel');
      if (destination) params.set('destination', destination);
    } else if (tab === 'flights') {
      params.set('type', 'flight');
      if (departure) params.set('from', departure);
      if (destination) params.set('to', destination);
    } else {
      params.set('type', 'package');
      if (destination) params.set('destination', destination);
    }
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', String(guests));
    router.push(`/search?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 3 * 86_400_000).toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* ─── Hero ─── */}
        <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-hero-soft">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute -top-10 right-0 w-80 h-80 rounded-full bg-accent-brand/10 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground mb-6">
                <Sparkles className="h-3.5 w-3.5 text-accent-brand" />
                AI-powered travel · No fees · Best price guarantee
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                Where will you go
                <br className="hidden sm:block" />
                <span className="text-gradient-brand"> next?</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Search 1M+ hotels, flights, and packages in one place. Travelable's AI finds the best deals
                and plans your perfect trip — in seconds.
              </p>
            </div>

            {/* Search card */}
            <div className="mt-10 max-w-5xl mx-auto">
              <div className="bg-card border rounded-2xl shadow-card overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b">
                  {([
                    { key: 'hotels' as const, label: 'Hotels', icon: Hotel },
                    { key: 'flights' as const, label: 'Flights', icon: Plane },
                    { key: 'packages' as const, label: 'Packages', icon: Package },
                  ]).map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors relative ${
                        tab === key ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                      {tab === key && (
                        <span className="absolute bottom-0 inset-x-4 h-0.5 bg-primary rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSearch} className="p-4 sm:p-5">
                  {tab === 'hotels' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="lg:col-span-2">
                        <Label htmlFor="dest" className="text-xs text-muted-foreground mb-1.5 block">Where to?</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="dest"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="City, hotel, or landmark"
                            className="pl-9 h-11"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="ci" className="text-xs text-muted-foreground mb-1.5 block">Check-in</Label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            id="ci"
                            type="date"
                            value={checkIn}
                            min={today}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="pl-9 h-11"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="co" className="text-xs text-muted-foreground mb-1.5 block">Check-out</Label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            id="co"
                            type="date"
                            value={checkOut}
                            min={checkIn || today}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="pl-9 h-11"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === 'flights' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <Label htmlFor="dep" className="text-xs text-muted-foreground mb-1.5 block">From</Label>
                        <div className="relative">
                          <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-45" />
                          <Input
                            id="dep"
                            value={departure}
                            onChange={(e) => setDeparture(e.target.value)}
                            placeholder="City or airport"
                            className="pl-9 h-11"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="arr" className="text-xs text-muted-foreground mb-1.5 block">To</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="arr"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="City or airport"
                            className="pl-9 h-11"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="ci2" className="text-xs text-muted-foreground mb-1.5 block">Depart</Label>
                        <Input
                          id="ci2"
                          type="date"
                          value={checkIn}
                          min={today}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="co2" className="text-xs text-muted-foreground mb-1.5 block">Return</Label>
                        <Input
                          id="co2"
                          type="date"
                          value={checkOut}
                          min={checkIn || today}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  )}

                  {tab === 'packages' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="lg:col-span-2">
                        <Label htmlFor="pkg" className="text-xs text-muted-foreground mb-1.5 block">Destination</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="pkg"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Where to?"
                            className="pl-9 h-11"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="ci3" className="text-xs text-muted-foreground mb-1.5 block">Depart</Label>
                        <Input
                          id="ci3"
                          type="date"
                          value={checkIn || tomorrow}
                          min={today}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="co3" className="text-xs text-muted-foreground mb-1.5 block">Return</Label>
                        <Input
                          id="co3"
                          type="date"
                          value={checkOut || dayAfter}
                          min={checkIn || tomorrow}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  )}

                  {/* Guests + Submit */}
                  <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1">
                      <Label htmlFor="g" className="text-xs text-muted-foreground mb-1.5 block">Travelers</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <select
                          id="g"
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="w-full pl-9 pr-3 h-11 rounded-md border border-input bg-background text-sm"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'traveler' : 'travelers'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 sm:mt-0 mt-2"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </form>
              </div>

              {/* Quick suggestions */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {popularDestinations.slice(0, 6).map((d) => (
                  <button
                    key={d.name}
                    onClick={() => {
                      setDestination(d.name);
                      setTab('hotels');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card border border-border text-sm hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Trust bar ─── */}
        <TrustBar />

        {/* ─── Destinations ─── */}
        <section id="destinations" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-3">
                <Compass className="h-5 w-5 text-primary" />
                <h2 className="text-3xl sm:text-4xl font-bold">Trending destinations</h2>
              </div>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Hand-picked places travelers are loving right now
              </p>
            </div>
            <DestinationGrid destinations={popularDestinations} />
          </div>
        </section>

        {/* ─── Why Travelable ─── */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold">Why travelers choose Travelable</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: TrendingUp,
                  title: 'Best price guarantee',
                  body: 'See it cheaper elsewhere? We\'ll match it and refund the difference.',
                },
                {
                  icon: Award,
                  title: 'AI-powered planning',
                  body: 'Personalized itineraries, smart budgets, and price predictions on every search.',
                },
                {
                  icon: Shield,
                  title: 'Book with confidence',
                  body: 'Free cancellation on most stays · Secure payments · 24/7 support.',
                },
                {
                  icon: Heart,
                  title: 'Loved by travelers',
                  body: '2.4M+ trips planned · 4.8 average rating · 98% would travel again.',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-card rounded-2xl border p-6 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Featured hotels ─── */}
        <FeaturedHotels />

        {/* ─── Testimonials ─── */}
        <Testimonials />

        {/* ─── Budget teaser ─── */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-3xl border bg-card overflow-hidden shadow-card">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-8 sm:p-12">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                    <Wallet className="h-3.5 w-3.5" />
                    AI Budget Planner
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3">Set a budget. Get a plan.</h2>
                  <p className="text-muted-foreground mb-6">
                    Tell us how much you want to spend and how long you're going — we'll allocate every
                    dollar across flights, hotels, food, and activities.
                  </p>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground"
                    onClick={() => router.push('/planner')}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Plan my trip
                  </Button>
                </div>
                <div className="relative bg-gradient-brand text-primary-foreground p-8 sm:p-12 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <Plane className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-80">Flights</p>
                        <p className="text-lg font-semibold">$840</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <Hotel className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-80">Accommodation</p>
                        <p className="text-lg font-semibold">$1,020</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <Heart className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-80">Food & Activities</p>
                        <p className="text-lg font-semibold">$540</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/20">
                      <p className="text-sm opacity-80">Total trip</p>
                      <p className="text-2xl font-bold">$2,500</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTABanner />
      </main>

      <Footer />
    </div>
  );
}