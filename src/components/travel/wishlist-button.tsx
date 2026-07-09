'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

interface Props {
  hotelId: string;
  hotelSlug: string;
  hotelName: string;
  hotelCity: string;
  hotelImage: string;
  pricePerNight: number;
  currency: string;
  variant?: 'icon' | 'chip';
  className?: string;
}

export function WishlistButton({
  hotelId,
  hotelSlug,
  hotelName,
  hotelCity,
  hotelImage,
  pricePerNight,
  currency,
  variant = 'icon',
  className = '',
}: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  // For now: localStorage-backed. After sign-in, sync with server.
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('tv_wishlist') ?? '[]') as string[];
      setSaved(list.includes(hotelId));
    } catch {
      // ignore
    }
  }, [hotelId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const list = JSON.parse(localStorage.getItem('tv_wishlist') ?? '[]') as string[];

    if (saved) {
      const next = list.filter((id) => id !== hotelId);
      localStorage.setItem('tv_wishlist', JSON.stringify(next));
      setSaved(false);
      // Best-effort server sync
      fetch(`/api/wishlist?hotelId=${encodeURIComponent(hotelId)}`, { method: 'DELETE' }).catch(() => {});
    } else {
      const next = [...new Set([...list, hotelId])];
      localStorage.setItem('tv_wishlist', JSON.stringify(next));
      setSaved(true);
      // Try server sync — may fail if not signed in
      setBusy(true);
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelId,
            hotelSlug,
            hotelName,
            hotelCity,
            hotelImage,
            pricePerNight,
            currency,
          }),
        });
      } catch {
        // ignore — saved locally
      } finally {
        setBusy(false);
      }
    }
  };

  if (variant === 'chip') {
    return (
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
          saved
            ? 'bg-rose-50 border-rose-300 text-rose-600'
            : 'bg-card border-border hover:border-rose-300 hover:text-rose-500'
        } ${className}`}
      >
        <Heart className={`h-3.5 w-3.5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
        {saved ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow transition-colors hover:bg-white ${
        saved ? 'text-rose-500' : 'text-foreground'
      } ${className}`}
    >
      <Heart className={`h-4 w-4 ${saved ? 'fill-rose-500' : ''}`} />
    </button>
  );
}