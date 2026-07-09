'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Maximize2, Bed, Check, X, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/travel-data';
import type { Hotel } from '@/lib/travel-data';
import { useRouter } from 'next/navigation';

interface Props {
  hotel: Hotel;
}

export function HotelDetailClient({ hotel }: Props) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const today = new Date().toISOString().split('T')[0];

  const handleBook = (roomId: string, price: number) => {
    const params = new URLSearchParams({
      hotelId: hotel.id,
      roomId,
      price: String(price),
    });
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', String(guests));
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-3">Choose your room</h2>

      {/* Date selector */}
      <div className="bg-surface rounded-xl border p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Check-in</label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Check-out</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} guest{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {hotel.rooms.map((room) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[200px_1fr_auto] hover:shadow-card-hover transition-shadow"
          >
            <div className="relative aspect-[4/3] md:aspect-auto">
              <Image src={room.image} alt={room.name} fill sizes="200px" className="object-cover" />
            </div>
            <div className="p-4 flex flex-col">
              <h3 className="font-semibold text-base mb-1">{room.name}</h3>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {room.beds}</span>
                <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" /> {room.size} m²</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Sleeps {room.sleeps}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {room.refundable && (
                  <Badge variant="outline" className="rounded-full text-xs gap-1">
                    <Check className="h-3 w-3 text-primary" /> Free cancellation
                  </Badge>
                )}
                {room.breakfast && (
                  <Badge variant="outline" className="rounded-full text-xs gap-1">
                    <Check className="h-3 w-3 text-primary" /> Breakfast included
                  </Badge>
                )}
                {!room.refundable && (
                  <Badge variant="outline" className="rounded-full text-xs gap-1 text-muted-foreground">
                    <X className="h-3 w-3" /> Non-refundable
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">Only {room.available} left at this price</span>
              </div>
            </div>
            <div className="p-4 flex flex-col items-end justify-center md:border-l md:min-w-[180px]">
              <p className="text-xs text-muted-foreground">per night</p>
              <p className="text-2xl font-bold leading-none">{formatCurrency(room.pricePerNight, hotel.currency)}</p>
              <p className="text-xs text-muted-foreground mb-3">incl. taxes & fees</p>
              <Button
                onClick={() => handleBook(room.id, room.pricePerNight)}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg w-full"
              >
                Reserve
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}