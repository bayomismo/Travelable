'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plane, Leaf, Users, ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDuration, formatDate } from '@/lib/travel-data';
import type { Flight } from '@/lib/travel-data';

interface Props {
  flight: Flight;
}

export function FlightCard({ flight }: Props) {
  const dep = new Date(flight.departureTime);
  const arr = new Date(flight.arrivalTime);

  return (
    <motion.div
      
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-center">
        {/* Left: airline + route */}
        <div className="space-y-4">
          {/* Airline */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Plane className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">{flight.airline}</p>
                <p className="text-xs text-muted-foreground">{flight.flightNumber} · {flight.aircraft}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs rounded-full">{flight.cabin}</Badge>
              {flight.seatsLeft <= 5 && (
                <Badge className="bg-destructive/10 text-destructive border-0 rounded-full text-xs">
                  Only {flight.seatsLeft} left
                </Badge>
              )}
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center gap-3">
            <div className="text-center min-w-[80px]">
              <p className="text-2xl font-bold leading-none">
                {dep.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{flight.departureAirport}</p>
              <p className="text-xs text-foreground/80 truncate">{flight.departureCity}</p>
              <p className="text-[11px] text-muted-foreground">{formatDate(flight.departureTime, { day: 'numeric', month: 'short' })}</p>
            </div>

            <div className="flex-1 relative flex flex-col items-center px-2">
              <p className="text-xs text-muted-foreground mb-1.5">{formatDuration(flight.duration)}</p>
              <div className="w-full flex items-center">
                <div className="flex-1 h-px bg-border" />
                {flight.stops === 0 ? (
                  <Plane className="h-4 w-4 mx-1.5 text-primary rotate-90" />
                ) : (
                  <div className="mx-1.5 flex flex-col items-center">
                    <div className="size-2 rounded-full bg-accent-brand" />
                  </div>
                )}
                <div className="flex-1 h-px bg-border" />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}${flight.stopCities.length ? ' · ' + flight.stopCities.join(', ') : ''}`}
              </p>
            </div>

            <div className="text-center min-w-[80px]">
              <p className="text-2xl font-bold leading-none">
                {arr.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{flight.arrivalAirport}</p>
              <p className="text-xs text-foreground/80 truncate">{flight.arrivalCity}</p>
              <p className="text-[11px] text-muted-foreground">{formatDate(flight.arrivalTime, { day: 'numeric', month: 'short' })}</p>
            </div>
          </div>

          {/* Amenities row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {flight.seatsLeft} seats left
            </span>
            {flight.co2Kg && (
              <span className="flex items-center gap-1">
                <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                {flight.co2Kg}kg CO₂
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {flight.baggage}
            </span>
          </div>
        </div>

        {/* Right: price + cta */}
        <div className="lg:border-l lg:pl-5 flex flex-col items-center lg:items-end gap-2 min-w-[180px]">
          <p className="text-xs text-muted-foreground">From</p>
          {flight.originalPrice && (
            <p className="text-sm text-muted-foreground line-through">{formatCurrency(flight.originalPrice)}</p>
          )}
          <p className="text-3xl font-bold leading-none">{formatCurrency(flight.price)}</p>
          <p className="text-xs text-muted-foreground">per person</p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full mt-2">
            Select <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <p className="text-[11px] text-muted-foreground">Includes taxes & fees</p>
        </div>
      </div>
    </motion.div>
  );
}