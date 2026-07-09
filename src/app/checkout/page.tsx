'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Hotel as HotelIcon,
  Shield,
  Lock,
  Sparkles,
  Check,
  Loader2,
  Calendar as CalendarIcon,
  Users,
  AlertCircle,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navigation } from '@/components/travel/navigation';
import { Footer } from '@/components/travel/footer';
import { useAuth } from '@/components/providers/auth-provider';
import { getHotelById, formatCurrency } from '@/lib/travel-data';
import type { Hotel } from '@/lib/travel-data';

function CheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const hotelId = params.get('hotelId') ?? '';
  const roomId = params.get('roomId') ?? '';
  const priceParam = Number(params.get('price') ?? '0');
  const checkIn = params.get('checkIn') ?? new Date(Date.now() + 7 * 86_400_000).toISOString().split('T')[0];
  const checkOut = params.get('checkOut') ?? new Date(Date.now() + 10 * 86_400_000).toISOString().split('T')[0];
  const guests = Number(params.get('guests') ?? '2');

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Booking form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.name.split(' ')[0] ?? '');
      setLastName(user.name.split(' ').slice(1).join(' ') ?? '');
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!hotelId) return;
    const h = getHotelById(hotelId);
    if (h) setHotel(h);
  }, [hotelId]);

  // Auth gate
  useEffect(() => {
    if (!authLoading && !user) {
      const next = encodeURIComponent(`/checkout?${params.toString()}`);
      router.push(`/auth/signin?next=${next}`);
    }
  }, [authLoading, user, router, params]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-1">Hotel not found</h2>
            <p className="text-muted-foreground">The hotel you're trying to book doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000));
  const room = hotel.rooms.find((r) => r.id === roomId) ?? hotel.rooms[0];
  const roomPrice = priceParam > 0 ? priceParam : room.pricePerNight;
  const subtotal = roomPrice * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in your contact details.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 12) {
      setError('Please enter a valid card number.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cardCvc.length < 3) {
      setError('Please enter the CVC.');
      return;
    }

    setProcessing(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: hotel.id,
          type: 'hotel',
          totalPrice: total,
          currency: hotel.currency,
          checkIn,
          checkOut,
          guests,
          specialRequests: specialRequests || undefined,
          meta: {
            hotelName: hotel.name,
            hotelCity: hotel.city,
            hotelCountry: hotel.country,
            hotelImage: hotel.images[0],
            roomName: room.name,
            nights,
            pricePerNight: roomPrice,
            contactPhone,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Booking failed');

      router.push(`/checkout/success?id=${data.booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
      setProcessing(false);
    }
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Secure checkout · 256-bit SSL</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Complete your booking</h1>
          <p className="text-muted-foreground mb-8">Just a few more details and you're set.</p>

          <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
            <div className="space-y-6">
              {/* Trip summary card */}
              <div className="bg-card border rounded-2xl overflow-hidden shadow-card">
                <div className="relative h-32 sm:h-40">
                  <Image src={hotel.images[0]} alt={hotel.name} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h2 className="text-xl font-semibold">{hotel.name}</h2>
                    <p className="text-sm text-white/80">{hotel.neighborhood}, {hotel.city}</p>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> Check-in</p>
                    <p className="font-medium mt-0.5">{new Date(checkIn).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> Check-out</p>
                    <p className="font-medium mt-0.5">{new Date(checkOut).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Guests</p>
                    <p className="font-medium mt-0.5">{guests} guest{guests > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Primary guest */}
              <div className="bg-card border rounded-2xl p-5 shadow-card">
                <h3 className="font-semibold text-lg mb-4">Primary guest</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="fn" className="text-xs mb-1.5 block">First name</Label>
                    <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="ln" className="text-xs mb-1.5 block">Last name</Label>
                    <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="em" className="text-xs mb-1.5 block">Email</Label>
                    <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="ph" className="text-xs mb-1.5 block">Phone (optional)</Label>
                    <Input id="ph" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
              </div>

              {/* Special requests */}
              <div className="bg-card border rounded-2xl p-5 shadow-card">
                <h3 className="font-semibold text-lg mb-2">Special requests</h3>
                <p className="text-xs text-muted-foreground mb-3">We'll pass these along to the property. They can't be guaranteed, but the team will do their best.</p>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                  placeholder="Late check-in, high floor, dietary needs…"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Payment */}
              <div className="bg-card border rounded-2xl p-5 shadow-card">
                <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Payment
                </h3>
                <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Demo mode — no real charge. Card data is not stored.
                </p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="cn" className="text-xs mb-1.5 block">Name on card</Label>
                    <Input id="cn" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="As it appears on your card" required />
                  </div>
                  <div>
                    <Label htmlFor="cnum" className="text-xs mb-1.5 block">Card number</Label>
                    <Input
                      id="cnum"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="exp" className="text-xs mb-1.5 block">Expiry</Label>
                      <Input id="exp" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} required />
                    </div>
                    <div>
                      <Label htmlFor="cvc" className="text-xs mb-1.5 block">CVC</Label>
                      <Input id="cvc" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} placeholder="123" maxLength={4} required />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Price summary */}
            <aside className="lg:block">
              <div className="lg:sticky lg:top-24 bg-card border rounded-2xl p-5 shadow-card space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{room.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{nights} night{nights > 1 ? 's' : ''}, {guests} guest{guests > 1 ? 's' : ''}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{formatCurrency(roomPrice, hotel.currency)} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>{formatCurrency(subtotal, hotel.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & fees</span>
                    <span>{formatCurrency(taxes, hotel.currency)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-2xl">{formatCurrency(total, hotel.currency)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">All charges included</p>
                </div>

                <ul className="space-y-1.5 text-xs text-muted-foreground border-t pt-4">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Free cancellation up to 48h before check-in</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No booking fees</li>
                  <li className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> Best price guarantee</li>
                </ul>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>Confirm and pay</>
                  )}
                </Button>

                <p className="text-[11px] text-muted-foreground text-center">
                  By clicking confirm, you agree to Travelable's terms and conditions.
                </p>
              </div>
            </aside>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <CheckoutInner />
    </Suspense>
  );
}