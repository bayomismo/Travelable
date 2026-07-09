'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Plane,
  Hotel as HotelIcon,
  Calendar as CalendarIcon,
  MapPin,
  Loader2,
  Plus,
  Sparkles,
  Compass,
  Receipt,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/travel/navigation';
import { Footer } from '@/components/travel/footer';
import { useAuth } from '@/components/providers/auth-provider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/travel-data';

interface Booking {
  id: string;
  type: string;
  status: string;
  totalPrice: number;
  currency: string;
  checkIn: string;
  checkOut: string | null;
  guests: number;
  confirmationCode: string;
  createdAt: string;
  hotelName: string | null;
  hotelCity: string | null;
  hotelCountry: string | null;
  hotelImage: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?next=/dashboard');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((data) => {
        setBookings(data.bookings ?? []);
        setLoadingBookings(false);
      })
      .catch(() => setLoadingBookings(false));
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const upcoming = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.checkIn).getTime() > Date.now()
  );
  const past = bookings.filter((b) => new Date(b.checkIn).getTime() <= Date.now());
  const totalSpent = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const initials = (user.name?.[0] ?? user.email[0] ?? 'T').toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="bg-card border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-6"
            >
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user.name}</h1>
                <p className="text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                  <span>{user.email}</span>
                  <span className="hidden sm:inline">·</span>
                  <span className="capitalize inline-flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-accent-brand" />
                    {user.tier} member
                  </span>
                </p>
              </div>
              <Link href="/search">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-1" />
                  Plan new trip
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <StatCard icon={Plane} label="Trips" value={String(bookings.length)} />
              <StatCard icon={Clock} label="Upcoming" value={String(upcoming.length)} />
              <StatCard icon={Receipt} label="Total spent" value={formatCurrency(totalSpent)} />
              <StatCard icon={TrendingUp} label="Avg savings" value="23%" />
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Upcoming */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Upcoming trips</h2>
            </div>
            {loadingBookings ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-card border rounded-2xl h-32 animate-pulse" />
                ))}
              </div>
            ) : upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((b) => (
                  <BookingRow key={b.id} booking={b} />
                ))}
              </div>
            ) : (
              <EmptyBookings type="upcoming" />
            )}
          </section>

          {/* Past */}
          {past.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-5">Past trips</h2>
              <div className="space-y-3">
                {past.map((b) => (
                  <BookingRow key={b.id} booking={b} past />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-card border rounded-2xl p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function BookingRow({ booking, past }: { booking: Booking; past?: boolean }) {
  const cover = booking.hotelImage;
  const checkIn = new Date(booking.checkIn);
  const checkOut = booking.checkOut ? new Date(booking.checkOut) : null;
  const nights = checkOut
    ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86_400_000))
    : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-2xl overflow-hidden hover:shadow-card-hover transition-shadow"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-0">
        {cover ? (
          <div className="relative aspect-[4/3] sm:aspect-auto">
            <Image src={cover} alt={booking.hotelName ?? ''} fill sizes="180px" className="object-cover" />
          </div>
        ) : (
          <div className="bg-muted flex items-center justify-center aspect-[4/3] sm:aspect-auto">
            <Plane className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Confirmation {booking.confirmationCode}</p>
              <h3 className="font-semibold text-lg">{booking.hotelName ?? `${booking.type} booking`}</h3>
              {(booking.hotelCity || booking.hotelCountry) && (
                <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {booking.hotelCity}{booking.hotelCity && booking.hotelCountry ? ', ' : ''}{booking.hotelCountry}
                </p>
              )}
            </div>
            <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${
              past ? 'bg-muted text-muted-foreground' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {past ? 'Completed' : 'Confirmed'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              {checkIn.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            {checkOut && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                {checkOut.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </span>
            )}
            <span>{nights} night{nights > 1 ? 's' : ''}</span>
            <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="p-5 flex flex-col items-end justify-center border-t sm:border-t-0 sm:border-l min-w-[140px]">
          <p className="text-xs text-muted-foreground">Total paid</p>
          <p className="text-2xl font-bold">{formatCurrency(booking.totalPrice, booking.currency as any)}</p>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyBookings({ type }: { type: 'upcoming' }) {
  return (
    <div className="bg-card border rounded-2xl p-10 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
        <Compass className="h-7 w-7" />
      </div>
      <h3 className="font-semibold text-lg mb-1">No {type} trips yet</h3>
      <p className="text-muted-foreground mb-5">Start planning your next adventure.</p>
      <Link href="/search">
        <Button className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-1" />
          Plan a trip
        </Button>
      </Link>
    </div>
  );
}