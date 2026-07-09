'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HotelCardSkeleton } from '@/components/travel/hotel-card-skeleton';
import { HotelCard } from '@/components/travel/hotel-card';

export function FeaturedHotels() {
  const [hotels, setHotels] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/hotels/featured')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setHotels(data.hotels ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-accent-brand text-2xl">⭐</span>
              <h2 className="text-3xl sm:text-4xl font-bold">Stays travelers love</h2>
            </div>
            <p className="text-muted-foreground">
              9.0+ rated hotels hand-picked by our team
            </p>
          </div>
          <Link
            href="/search?type=hotel"
            className="text-sm font-medium text-primary hover:underline"
          >
            See all hotels →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading || !hotels
            ? Array.from({ length: 4 }).map((_, i) => <HotelCardSkeleton key={i} />)
            : hotels.slice(0, 4).map((h) => (
                <HotelCard key={h.id} hotel={h} />
              ))}
        </div>
      </div>
    </section>
  );
}