'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Hotel as HotelIcon,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  Mail,
  Loader2,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/travel/navigation';
import { Footer } from '@/components/travel/footer';
import { useAuth } from '@/components/providers/auth-provider';
import { formatCurrency } from '@/lib/travel-data';

interface Booking {
  id: string;
  confirmationCode: string;
  totalPrice: number;
  currency: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  paymentStatus: string;
  itinerary: string | null;
  hotelName: string | null;
  hotelCity: string | null;
  hotelCountry: string | null;
  hotelImage: string | null;
}

function SuccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading } = useAuth();
  const bookingId = params.get('id') ?? '';
  const [booking, setBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((data) => {
        const b = (data.bookings ?? []).find((x: any) => x.id === bookingId);
        if (b) {
          setBooking(b);
        }
      });
  }, [bookingId]);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  const copyCode = () => {
    navigator.clipboard.writeText(booking.confirmationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mb-5"
            >
              <CheckCircle2 className="h-10 w-10" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">You're all set!</h1>
            <p className="text-muted-foreground text-lg">
              Your booking is confirmed. We've emailed the details to <strong>{user.email}</strong>.
            </p>
          </motion.div>

          {/* Confirmation card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 bg-card border rounded-2xl overflow-hidden shadow-card"
          >
            {/* Header */}
            <div className="bg-gradient-brand text-primary-foreground p-6">
              <p className="text-sm opacity-80">Confirmation code</p>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-3xl font-bold tracking-wider">{booking.confirmationCode}</p>
                <button
                  onClick={copyCode}
                  className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
                  aria-label="Copy"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs opacity-80 mt-2 flex items-center gap-1">
                <Mail className="h-3 w-3" />
                A copy was sent to {user.email}
              </p>
            </div>

            {/* Hotel details */}
            {booking.hotelName && (
              <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-0">
                <div className="relative aspect-[4/3] sm:aspect-auto">
                  {booking.hotelImage && (
                    <Image
                      src={booking.hotelImage}
                      alt={booking.hotelName}
                      fill
                      sizes="(max-width: 640px) 100vw, 200px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold">{booking.hotelName}</h2>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {booking.hotelCity}{booking.hotelCity && booking.hotelCountry ? ', ' : ''}{booking.hotelCountry}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> Check-in</p>
                      <p className="font-medium mt-0.5">
                        {new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> Check-out</p>
                      <p className="font-medium mt-0.5">
                        {new Date(booking.checkOut!).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Guests</p>
                      <p className="font-medium mt-0.5">{booking.guests}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><HotelIcon className="h-3.5 w-3.5" /> Total</p>
                      <p className="font-bold mt-0.5">{formatCurrency(booking.totalPrice, booking.currency as any)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Next steps */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 grid sm:grid-cols-2 gap-3"
          >
            <Link href="/dashboard" className="block">
              <Button variant="outline" className="w-full h-12">
                <Sparkles className="h-4 w-4 mr-2" />
                View all my trips
              </Button>
            </Link>
            <Link href="/search" className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12">
                Plan another trip
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <div className="mt-10 bg-card border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">What's next?</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Your confirmation email is on its way. It contains the property's address and check-in details.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Free cancellation is available up to 48 hours before check-in. Manage your booking anytime.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Need help? Our 24/7 support team is one tap away in your dashboard.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <SuccessInner />
    </Suspense>
  );
}