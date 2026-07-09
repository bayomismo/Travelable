'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/travel-data';
import type { Hotel } from '@/lib/travel-data';

interface Props {
  hotels: Hotel[];
}

// Simple world-equirectangular projection for latitude/longitude → x/y
function project(lat: number, lng: number, w: number, h: number) {
  const x = ((lng + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return { x, y };
}

export function SearchMap({ hotels }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Compute bounds for the visible area based on hotels
  const bounds = hotels.reduce(
    (acc, h) => ({
      minLat: Math.min(acc.minLat, h.latitude),
      maxLat: Math.max(acc.maxLat, h.latitude),
      minLng: Math.min(acc.minLng, h.longitude),
      maxLng: Math.max(acc.maxLng, h.longitude),
    }),
    { minLat: 90, maxLat: -90, minLng: 180, maxLng: -180 }
  );

  // Add padding
  const padLat = Math.max((bounds.maxLat - bounds.minLat) * 0.3, 5);
  const padLng = Math.max((bounds.maxLng - bounds.minLng) * 0.3, 5);
  bounds.minLat -= padLat;
  bounds.maxLat += padLat;
  bounds.minLng -= padLng;
  bounds.maxLng += padLng;

  const W = 1000;
  const H = 600;

  const projectToBounds = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * W;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * H;
    return { x, y };
  };

  return (
    <div className="relative bg-card border rounded-2xl overflow-hidden shadow-card">
      <div className="relative aspect-[5/3] w-full">
        {/* Subtle gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-brand/5" />
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
          {/* Subtle grid */}
          {[...Array(10)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={(i * H) / 10} x2={W} y2={(i * H) / 10} stroke="currentColor" strokeOpacity="0.06" strokeDasharray="4 6" />
          ))}
          {[...Array(10)].map((_, i) => (
            <line key={`v-${i}`} x1={(i * W) / 10} y1="0" x2={(i * W) / 10} y2={H} stroke="currentColor" strokeOpacity="0.06" strokeDasharray="4 6" />
          ))}

          {/* Hotel markers */}
          {hotels.map((h) => {
            const { x, y } = projectToBounds(h.latitude, h.longitude);
            const isHovered = hovered === h.id;
            return (
              <g
                key={h.id}
                onMouseEnter={() => setHovered(h.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse halo */}
                {isHovered && (
                  <circle cx={x} cy={y} r={18} fill="oklch(0.55 0.13 200)" opacity="0.2">
                    <animate attributeName="r" from="14" to="22" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={x} cy={y} r={isHovered ? 12 : 9} fill="oklch(0.55 0.13 200)" stroke="#fff" strokeWidth="3" />
                <text x={x} y={y + 3} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">
                  ${h.pricePerNight}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hovered && (() => {
            const h = hotels.find((x) => x.id === hovered)!;
            const { x, y } = projectToBounds(h.latitude, h.longitude);
            return (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute pointer-events-none z-10"
                style={{
                  left: `${(x / W) * 100}%`,
                  top: `${(y / H) * 100}%`,
                  transform: 'translate(16px, -50%)',
                }}
              >
                <div className="bg-card border rounded-xl shadow-xl overflow-hidden w-64">
                  <img src={h.images[0]} alt={h.name} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <h4 className="font-semibold text-sm leading-tight">{h.name}</h4>
                    <p className="text-xs text-muted-foreground">{h.city}, {h.country}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs">
                        <span className="bg-primary text-primary-foreground rounded px-1.5 py-0.5 font-bold mr-1">
                          {h.guestRating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">{h.reviewCount.toLocaleString()} reviews</span>
                      </div>
                      <span className="font-bold text-sm">{formatCurrency(h.pricePerNight)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
      <div className="p-3 border-t flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          Showing {hotels.length} {hotels.length === 1 ? 'property' : 'properties'} on the map
        </span>
        <span>Click a marker to see details</span>
      </div>
    </div>
  );
}