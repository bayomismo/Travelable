'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, MapPin, Heart, Wifi, Waves, Utensils, Car, Dumbbell, Sparkles, Wind, Coffee, Baby, Wine, ConciergeBell, Mountain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, discountPercent } from '@/lib/travel-data';
import type { Hotel } from '@/lib/travel-data';

const AMENITY_ICON: Record<string, React.ElementType> = {
  wifi: Wifi,
  pool: Waves,
  spa: Sparkles,
  restaurant: Utensils,
  bar: Wine,
  ac: Wind,
  gym: Dumbbell,
  kids: Baby,
  transfer: Car,
  tea: Coffee,
  kaiseki: Utensils,
  butler: ConciergeBell,
  diving: Waves,
  guide: Mountain,
  beach: Waves,
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="inline-flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-accent-brand text-accent-brand" />
      ))}
    </div>
  );
}

interface Props {
  hotel: Hotel;
  variant?: 'grid' | 'list';
}

export function HotelCard({ hotel, variant = 'grid' }: Props) {
  const discount = discountPercent(hotel);

  if (variant === 'list') {
    return (
      <motion.div
        
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0"
      >
        <Link href={`/hotels/${hotel.slug}`} className="relative block aspect-[4/3] md:aspect-auto">
          <Image
            src={hotel.images[0]}
            alt={hotel.name}
            fill
            sizes="(max-width: 768px) 100vw, 280px"
            className="object-cover"
          />
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-accent-brand text-accent-brand-foreground border-0 rounded-full text-xs font-medium">
              -{discount}% today
            </Badge>
          )}
        </Link>
        <div className="p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Stars rating={hotel.starRating} />
              </div>
              <Link
                href={`/hotels/${hotel.slug}`}
                className="text-lg font-semibold hover:text-primary transition-colors"
              >
                {hotel.name}
              </Link>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {hotel.neighborhood}, {hotel.city}
              </div>
            </div>
            <button
              aria-label="Save"
              className="text-muted-foreground hover:text-rose-500 transition-colors"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.amenities.slice(0, 6).map((a) => {
              const Icon = AMENITY_ICON[a.key] ?? Sparkles;
              return (
                <span
                  key={a.key}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                >
                  <Icon className="h-3 w-3" />
                  {a.label}
                </span>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mt-3">{hotel.description}</p>

          <div className="flex items-end justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-1.5">
              <div className="bg-primary text-primary-foreground text-xs font-bold rounded-md px-2 py-1">
                {hotel.guestRating.toFixed(1)}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {hotel.guestRating >= 9 ? 'Wonderful' : hotel.guestRating >= 8 ? 'Very Good' : 'Good'}
                </p>
                <p className="text-xs text-muted-foreground">{hotel.reviewCount.toLocaleString()} reviews</p>
              </div>
            </div>
            <div className="text-right">
              {hotel.originalPrice && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatCurrency(hotel.originalPrice, hotel.currency)}
                </p>
              )}
              <p className="text-2xl font-bold leading-none">
                {formatCurrency(hotel.pricePerNight, hotel.currency)}
              </p>
              <p className="text-xs text-muted-foreground">per night</p>
              <Link href={`/hotels/${hotel.slug}`} className="inline-block mt-2">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-8 text-xs px-3">
                  See availability
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px', amount: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group bg-card border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <Link href={`/hotels/${hotel.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={hotel.images[0]}
          alt={hotel.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <Badge className="bg-accent-brand text-accent-brand-foreground border-0 rounded-full text-xs font-semibold shadow">
              -{discount}% today
            </Badge>
          )}
          {hotel.dealOfTheDay && (
            <Badge className="bg-primary text-primary-foreground border-0 rounded-full text-xs font-medium">
              ⭐ Deal of the day
            </Badge>
          )}
        </div>
        <button
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur text-foreground hover:text-rose-500 hover:bg-white shadow transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-4 w-4" />
        </button>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <Link href={`/hotels/${hotel.slug}`} className="flex-1 min-w-0">
            <h3 className="font-semibold leading-tight truncate group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
          </Link>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Stars rating={hotel.starRating} />
          <span>·</span>
          <span className="truncate">{hotel.neighborhood}, {hotel.city}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {hotel.amenities.slice(0, 3).map((a) => {
            const Icon = AMENITY_ICON[a.key] ?? Sparkles;
            return (
              <span
                key={a.key}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
              >
                <Icon className="h-3 w-3" />
                {a.label}
              </span>
            );
          })}
          {hotel.amenities.length > 3 && (
            <span className="text-[11px] text-muted-foreground">
              +{hotel.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-end justify-between mt-4 pt-3 border-t">
          <div className="flex items-center gap-1.5">
            <div className="bg-primary text-primary-foreground text-xs font-bold rounded-md px-2 py-1">
              {hotel.guestRating.toFixed(1)}
            </div>
            <div>
              <p className="text-xs font-medium leading-none">
                {hotel.guestRating >= 9 ? 'Wonderful' : hotel.guestRating >= 8 ? 'Very Good' : 'Good'}
              </p>
              <p className="text-[11px] text-muted-foreground">{hotel.reviewCount.toLocaleString()} reviews</p>
            </div>
          </div>
          <div className="text-right">
            {hotel.originalPrice && (
              <p className="text-[11px] text-muted-foreground line-through">
                {formatCurrency(hotel.originalPrice, hotel.currency)}
              </p>
            )}
            <p className="text-lg font-bold leading-none">
              {formatCurrency(hotel.pricePerNight, hotel.currency)}
            </p>
            <p className="text-[11px] text-muted-foreground">per night</p>
          </div>
        </div>

        <Link href={`/hotels/${hotel.slug}`} className="block mt-3">
          <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-9">
            See availability
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}