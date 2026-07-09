'use client';

import Link from 'next/link';
import { Star, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/travel-data';
import type { Destination } from '@/lib/travel-data';

interface Props {
  destinations: Destination[];
}

export function DestinationGrid({ destinations }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {destinations.map((d) => (
        <Link
          key={d.slug}
          href={`/search?destination=${encodeURIComponent(d.name)}&type=hotel`}
          className="block group"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-all hover:-translate-y-1 duration-300">
            <img
              src={d.image}
              alt={d.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {d.trending && (
              <Badge className="absolute top-3 right-3 bg-accent-brand text-accent-brand-foreground border-0 rounded-full text-xs gap-1">
                <TrendingUp className="h-3 w-3" /> Trending
              </Badge>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-lg font-semibold leading-tight">{d.name}</h3>
              <p className="text-sm text-white/80">{d.country}</p>
              <div className="flex items-center justify-between mt-2.5">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3.5 w-3.5 fill-accent-brand text-accent-brand" />
                  <span>{d.weatherC}°C · {d.flightTime}</span>
                </div>
                <div className="text-xs">
                  from <span className="font-bold text-base">{formatCurrency(d.priceFrom, d.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}