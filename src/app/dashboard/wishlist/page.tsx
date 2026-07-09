'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Trash2, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/travel/navigation';
import { Footer } from '@/components/travel/footer';
import { useAuth } from '@/components/providers/auth-provider';
import { formatCurrency } from '@/lib/travel-data';

interface WishlistItem {
  id: string;
  hotelId: string;
  hotelSlug: string;
  hotelName: string;
  hotelCity: string;
  hotelImage: string;
  pricePerNight: number;
  currency: string;
  createdAt: string;
}

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch('/api/wishlist')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items ?? []);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [user]);

  const remove = async (hotelId: string) => {
    setItems((prev) => prev.filter((i) => i.hotelId !== hotelId));
    await fetch(`/api/wishlist?hotelId=${encodeURIComponent(hotelId)}`, { method: 'DELETE' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Sign in to see your wishlist</h2>
            <Link href="/auth/signin?next=/dashboard/wishlist">
              <Button className="bg-primary text-primary-foreground">Sign in</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Heart className="h-7 w-7 fill-rose-500 text-rose-500" />
                Your wishlist
              </h1>
              <p className="text-muted-foreground mt-1">
                {items.length} saved {items.length === 1 ? 'property' : 'properties'}
              </p>
            </div>
            <Link href="/search">
              <Button variant="outline">
                Discover more <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {fetching ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-card border rounded-2xl h-32 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-card border rounded-2xl p-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">No saved properties yet</h3>
              <p className="text-muted-foreground mb-5">
                Tap the heart icon on any hotel to save it here.
              </p>
              <Link href="/search">
                <Button className="bg-primary text-primary-foreground">Browse hotels</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] hover:shadow-card-hover transition-shadow"
                >
                  <Link href={`/hotels/${item.hotelSlug}`} className="relative block aspect-[4/3] sm:aspect-auto">
                    <Image
                      src={item.hotelImage}
                      alt={item.hotelName}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="p-4 flex flex-col justify-center">
                    <Link href={`/hotels/${item.hotelSlug}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors">{item.hotelName}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.hotelCity}</p>
                    <p className="text-sm mt-2">
                      From <span className="font-bold">{formatCurrency(item.pricePerNight, item.currency as any)}</span>
                      <span className="text-muted-foreground"> /night</span>
                    </p>
                  </div>
                  <div className="p-4 flex items-center gap-2 sm:flex-col sm:justify-center sm:border-l">
                    <Link href={`/hotels/${item.hotelSlug}`}>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full sm:w-auto">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => remove(item.hotelId)}
                      className="text-rose-500 hover:bg-rose-50"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}