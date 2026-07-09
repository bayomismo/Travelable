import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getHotelBySlug, hotels as allHotels, formatCurrency, formatDate } from '@/lib/travel-data';
import { HotelDetailClient } from '@/components/travel/hotel-detail-client';
import { Navigation } from '@/components/travel/navigation';
import { Footer } from '@/components/travel/footer';
import { HotelCard } from '@/components/travel/hotel-card';
import { Star, MapPin, Wifi, Utensils, Waves, Car, Sparkles, Wind, Coffee, Baby, Wine, Mountain, Dumbbell, ConciergeBell } from 'lucide-react';
import type { Metadata } from 'next';

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

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allHotels.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hotel = getHotelBySlug(slug);
  if (!hotel) return { title: 'Hotel not found' };
  return {
    title: hotel.name,
    description: hotel.description.slice(0, 160),
    openGraph: {
      title: `${hotel.name} · ${hotel.city}`,
      description: hotel.description.slice(0, 200),
      images: [hotel.images[0]],
    },
  };
}

export default async function HotelPage({ params }: Props) {
  const { slug } = await params;
  const hotel = getHotelBySlug(slug);
  if (!hotel) notFound();

  const relatedHotels = allHotels
    .filter((h) => h.id !== hotel.id && (h.city === hotel.city || h.country === hotel.country))
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20 bg-background">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href={`/search?destination=${encodeURIComponent(hotel.city)}&type=hotel`} className="hover:text-foreground">{hotel.city}</Link>
            <span>/</span>
            <span className="text-foreground truncate">{hotel.name}</span>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent-brand text-accent-brand" />
                ))}
                {hotel.dealOfTheDay && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground rounded-full px-2.5 py-0.5">
                    ⭐ Deal of the day
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{hotel.name}</h1>
              <p className="flex items-center gap-1 text-muted-foreground mt-1.5">
                <MapPin className="h-4 w-4" />
                {hotel.address}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="bg-primary text-primary-foreground font-bold rounded-md px-2.5 py-1.5">
                {hotel.guestRating.toFixed(1)}
              </div>
              <div>
                <p className="font-medium leading-tight">
                  {hotel.guestRating >= 9 ? 'Wonderful' : hotel.guestRating >= 8 ? 'Very Good' : 'Good'}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {hotel.reviewCount.toLocaleString()} reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image gallery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
            <div className="relative aspect-[4/3] lg:aspect-[5/4] rounded-2xl overflow-hidden">
              <Image
                src={hotel.images[0]}
                alt={hotel.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {hotel.images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={img}
                    alt={`${hotel.name} image ${i + 2}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            {/* Main content */}
            <div className="space-y-8">
              {/* Highlights */}
              <section>
                <h2 className="text-xl font-bold mb-3">Why guests love it</h2>
                <ul className="grid sm:grid-cols-2 gap-2.5">
                  {hotel.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <p className="text-base text-foreground/80 leading-relaxed">{hotel.description}</p>

              {/* Amenities */}
              <section>
                <h2 className="text-xl font-bold mb-3">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((a) => {
                    const Icon = AMENITY_ICON[a.key] ?? Sparkles;
                    return (
                      <div key={a.key} className="flex items-center gap-2 text-sm">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{a.label}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Rooms */}
              <HotelDetailClient hotel={hotel} />

              {/* Reviews */}
              <section>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h2 className="text-xl font-bold">Guest reviews</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="bg-primary text-primary-foreground font-bold rounded-md px-2 py-0.5">
                      {hotel.guestRating.toFixed(1)}
                    </div>
                    <span className="text-muted-foreground">Based on {hotel.reviewCount.toLocaleString()} reviews</span>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {hotel.reviews.map((r) => (
                    <div key={r.id} className="bg-card border rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                            {r.author[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{r.author}</p>
                            <p className="text-xs text-muted-foreground">{r.country}</p>
                          </div>
                        </div>
                        <div className="bg-primary text-primary-foreground font-bold rounded-md px-2 py-1 text-sm">
                          {r.rating.toFixed(1)}
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{r.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{formatDate(r.date, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Map placeholder */}
              <section>
                <h2 className="text-xl font-bold mb-3">Location</h2>
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {hotel.neighborhood}, {hotel.city}
                </p>
                <div className="aspect-[16/9] bg-surface rounded-2xl border flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                                       linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)`,
                      backgroundSize: '40px 40px',
                    }} />
                  </div>
                  <div className="relative text-center">
                    <MapPin className="h-10 w-10 text-primary mx-auto" />
                    <p className="font-semibold mt-2">{hotel.name}</p>
                    <p className="text-sm text-muted-foreground">{hotel.address}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {hotel.latitude.toFixed(4)}, {hotel.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar — sticky booking card */}
            <aside className="lg:block">
              <div className="lg:sticky lg:top-24 bg-card border rounded-2xl p-5 shadow-card">
                <p className="text-xs text-muted-foreground">Starting from</p>
                {hotel.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatCurrency(hotel.originalPrice, hotel.currency)}
                  </p>
                )}
                <p className="text-3xl font-bold">
                  {formatCurrency(hotel.pricePerNight, hotel.currency)}
                  <span className="text-sm font-normal text-muted-foreground"> /night</span>
                </p>
                <ul className="text-xs space-y-1.5 mt-3 text-foreground/80">
                  {hotel.policies.freeCancellation && (
                    <li className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Free cancellation
                    </li>
                  )}
                  {hotel.policies.breakfastIncluded && (
                    <li className="flex items-center gap-1.5">
                      <Utensils className="h-3.5 w-3.5 text-primary" />
                      Breakfast included
                    </li>
                  )}
                  <li className="flex items-center gap-1.5">
                    <Wine className="h-3.5 w-3.5 text-primary" />
                    Check-in {hotel.policies.checkIn} · Check-out {hotel.policies.checkOut}
                  </li>
                </ul>

                <Link
                  href={`/checkout?hotelId=${hotel.id}`}
                  className="block w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 mt-5 font-semibold text-center leading-[3rem] transition-colors"
                >
                  Reserve now
                </Link>
                <p className="text-[11px] text-muted-foreground text-center mt-2">
                  You won't be charged yet
                </p>
              </div>
            </aside>
          </div>

          {/* Related hotels */}
          {relatedHotels.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">More places to stay in {hotel.city}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedHotels.map((h) => (
                  <HotelCard key={h.id} hotel={h} />
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