/**
 * Curated, realistic travel data layer.
 *
 * In production this would be backed by a real-time provider (Amadeus,
 * Booking.com, Expedia, Duffel, Skyscanner). For Travelable we ship a
 * hand-curated catalogue of high-quality hotel and flight entries that
 * power the search, detail, booking, and dashboard flows end-to-end.
 *
 * Images are public Unsplash CDN URLs (free to use commercially) that
 * look great and load fast.
 */

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'IDR' | 'THB' | 'MXN' | 'AUD';

export interface HotelAmenity {
  key: string;
  label: string;
  icon: string; // lucide icon name
}

export interface HotelReview {
  id: string;
  author: string;
  country: string;
  rating: number;
  date: string; // ISO
  title: string;
  content: string;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  country: string;
  countryCode: string;
  address: string;
  latitude: number;
  longitude: number;
  starRating: number; // 1-5
  guestRating: number; // 0-10
  reviewCount: number;
  pricePerNight: number;
  originalPrice?: number;
  currency: Currency;
  images: string[];
  amenities: HotelAmenity[];
  highlights: string[];
  policies: {
    freeCancellation: boolean;
    breakfastIncluded: boolean;
    payAtProperty: boolean;
    checkIn: string; // "15:00"
    checkOut: string; // "11:00"
  };
  rooms: HotelRoom[];
  reviews: HotelReview[];
  neighborhood: string;
  trending: boolean;
  dealOfTheDay?: boolean;
  tags: string[]; // "beachfront", "romantic", "family", etc.
}

export interface HotelRoom {
  id: string;
  name: string;
  beds: string;
  size: number; // m²
  sleeps: number;
  pricePerNight: number;
  available: number;
  refundable: boolean;
  breakfast: boolean;
  image: string;
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departureAirport: string;
  departureCity: string;
  arrivalAirport: string;
  arrivalCity: string;
  departureTime: string; // ISO
  arrivalTime: string; // ISO
  duration: number; // minutes
  stops: number;
  stopCities: string[];
  price: number;
  originalPrice?: number;
  currency: Currency;
  cabin: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  seatsLeft: number;
  aircraft: string;
  co2Kg: number;
  amenities: string[];
  baggage: string;
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  description: string;
  image: string;
  priceFrom: number;
  currency: Currency;
  trending: boolean;
  hotels: number;
  flightTime: string;
  bestFor: string[];
  weatherC: number;
  tags: string[];
}

// ────────────────────────────────────────────────────────────────────────────
// Unsplash image helpers — curated high-quality CDN URLs
// ────────────────────────────────────────────────────────────────────────────

const U = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// ────────────────────────────────────────────────────────────────────────────
// Destinations — 18 hand-picked locations across 6 continents
// ────────────────────────────────────────────────────────────────────────────

export const destinations: Destination[] = [
  {
    slug: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    countryCode: 'GR',
    region: 'Europe',
    description: 'Iconic whitewashed villages perched above the Aegean, legendary sunsets, and ancient vineyards.',
    image: U('1570077188670-e3a8d69ac5ff', 1200, 800),
    priceFrom: 189,
    currency: 'USD',
    trending: true,
    hotels: 312,
    flightTime: '11h 20m',
    bestFor: ['Couples', 'Honeymoon', 'Photography'],
    weatherC: 24,
    tags: ['romantic', 'beach', 'scenic'],
  },
  {
    slug: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    countryCode: 'JP',
    region: 'Asia',
    description: 'Thousands of vermilion shrines, bamboo forests, and the most refined cuisine on earth.',
    image: U('1493997181344-712f2f19d87a', 1200, 800),
    priceFrom: 142,
    currency: 'USD',
    trending: true,
    hotels: 478,
    flightTime: '13h 45m',
    bestFor: ['Culture', 'Food', 'History'],
    weatherC: 18,
    tags: ['cultural', 'foodie', 'serene'],
  },
  {
    slug: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    countryCode: 'ID',
    region: 'Asia',
    description: 'Lush rice terraces, sacred temples, world-class surf, and an unrivalled wellness scene.',
    image: U('1537996194471-e657df975ab4', 1200, 800),
    priceFrom: 78,
    currency: 'USD',
    trending: true,
    hotels: 1024,
    flightTime: '21h 30m',
    bestFor: ['Wellness', 'Surf', 'Digital Nomads'],
    weatherC: 28,
    tags: ['beach', 'wellness', 'budget'],
  },
  {
    slug: 'reykjavik',
    name: 'Reykjavík',
    country: 'Iceland',
    countryCode: 'IS',
    region: 'Europe',
    description: 'Gateway to glaciers, geysers, volcanic landscapes, and the ethereal Northern Lights.',
    image: U('1504829857797-ddff29c27927', 1200, 800),
    priceFrom: 210,
    currency: 'USD',
    trending: true,
    hotels: 198,
    flightTime: '7h 50m',
    bestFor: ['Adventure', 'Nature', 'Photography'],
    weatherC: 6,
    tags: ['adventure', 'scenic', 'unique'],
  },
  {
    slug: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    countryCode: 'PT',
    region: 'Europe',
    description: 'Pastel facades, soulful fado, pasteis de nata, and Atlantic views around every corner.',
    image: U('1555881400-74d7acaacd8b', 1200, 800),
    priceFrom: 115,
    currency: 'USD',
    trending: false,
    hotels: 612,
    flightTime: '8h 10m',
    bestFor: ['Food', 'Architecture', 'Value'],
    weatherC: 22,
    tags: ['cultural', 'foodie', 'value'],
  },
  {
    slug: 'marrakech',
    name: 'Marrakech',
    country: 'Morocco',
    countryCode: 'MA',
    region: 'Africa',
    description: 'Sensory overload in the medinas — spice markets, riads, palaces, and rooftop sunsets.',
    image: U('1518730518541-d0843268c287', 1200, 800),
    priceFrom: 95,
    currency: 'USD',
    trending: false,
    hotels: 287,
    flightTime: '9h 40m',
    bestFor: ['Culture', 'Shopping', 'Architecture'],
    weatherC: 26,
    tags: ['cultural', 'budget', 'exotic'],
  },
  {
    slug: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    countryCode: 'MV',
    region: 'Asia',
    description: 'Crystal-clear lagoons, overwater villas, and the planet\'s most luxurious hideaways.',
    image: U('1514282401047-d79a71a590e8', 1200, 800),
    priceFrom: 320,
    currency: 'USD',
    trending: true,
    hotels: 156,
    flightTime: '16h 20m',
    bestFor: ['Honeymoon', 'Luxury', 'Diving'],
    weatherC: 29,
    tags: ['luxury', 'beach', 'romantic'],
  },
  {
    slug: 'patagonia',
    name: 'Patagonia',
    country: 'Argentina',
    countryCode: 'AR',
    region: 'South America',
    description: 'Dramatic granite spires, electric-blue glaciers, and the end of the world at Cape Horn.',
    image: U('1483728642387-6c3bdd6c93e5', 1200, 800),
    priceFrom: 165,
    currency: 'USD',
    trending: false,
    hotels: 142,
    flightTime: '14h 5m',
    bestFor: ['Trekking', 'Wildlife', 'Adventure'],
    weatherC: 12,
    tags: ['adventure', 'scenic', 'remote'],
  },
  {
    slug: 'new-york',
    name: 'New York',
    country: 'United States',
    countryCode: 'US',
    region: 'North America',
    description: 'The city that never sleeps — Broadway, bagels, Central Park, and a skyline that defines ambition.',
    image: U('1496442226666-8d4d0e62e6e9', 1200, 800),
    priceFrom: 198,
    currency: 'USD',
    trending: true,
    hotels: 1248,
    flightTime: '1h 30m',
    bestFor: ['City Break', 'Food', 'Theater'],
    weatherC: 16,
    tags: ['urban', 'foodie', 'iconic'],
  },
  {
    slug: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    region: 'Asia',
    description: 'Neon-lit Shibuya, serene shrines, omakase sushi, and the world\'s most polite service.',
    image: U('1540959733332-eab4deabeeaf', 1200, 800),
    priceFrom: 165,
    currency: 'USD',
    trending: true,
    hotels: 892,
    flightTime: '13h 45m',
    bestFor: ['Food', 'Culture', 'Shopping'],
    weatherC: 19,
    tags: ['urban', 'foodie', 'cultural'],
  },
  {
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    region: 'Europe',
    description: 'Cafés, museums, the Seine, and that unmistakable glow when the city lights up at dusk.',
    image: U('1502602898657-3e91760cbb34', 1200, 800),
    priceFrom: 175,
    currency: 'USD',
    trending: true,
    hotels: 1102,
    flightTime: '7h 30m',
    bestFor: ['Romance', 'Culture', 'Food'],
    weatherC: 17,
    tags: ['romantic', 'cultural', 'iconic'],
  },
  {
    slug: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    region: 'Asia',
    description: 'Tuk-tuks, temples, street food that changes lives, and rooftop bars that touch the sky.',
    image: U('1508009603885-50cf7c579365', 1200, 800),
    priceFrom: 68,
    currency: 'USD',
    trending: false,
    hotels: 1567,
    flightTime: '17h 10m',
    bestFor: ['Food', 'Value', 'Nightlife'],
    weatherC: 32,
    tags: ['budget', 'foodie', 'urban'],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Hotels — 24 hand-curated properties across the destinations
// ────────────────────────────────────────────────────────────────────────────

export const hotels: Hotel[] = [
  // ───── Santorini ─────
  {
    id: 'h-canaves-santorini',
    slug: 'canaves-oia-santorini',
    name: 'Canaves Oia Suites',
    description:
      'Carved into the cliffside of Oia, this award-winning boutique hotel offers infinity pools that drop straight into the caldera, whitewashed cave suites with private terraces, and service that anticipates your every wish.',
    city: 'Santorini',
    country: 'Greece',
    countryCode: 'GR',
    address: 'Oia, 84702, Greece',
    latitude: 36.4618,
    longitude: 25.3753,
    starRating: 5,
    guestRating: 9.6,
    reviewCount: 1842,
    pricePerNight: 689,
    originalPrice: 920,
    currency: 'USD',
    images: [
      U('1571896349842-33c89424de2d'),
      U('1566073771259-6a8506099945'),
      U('1582719508461-905c673771fd'),
      U('1542314831-068cd1dbfeeb'),
      U('1551918120-9739cb430c6d'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'pool', label: 'Infinity Pool', icon: 'Waves' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'bar', label: 'Bar', icon: 'Wine' },
      { key: 'ac', label: 'Air Conditioning', icon: 'Wind' },
      { key: 'concierge', label: 'Concierge', icon: 'ConciergeBell' },
      { key: 'transfer', label: 'Airport Transfer', icon: 'Car' },
    ],
    highlights: [
      'Caldera-view infinity pool',
      'Award-winning wine cellar',
      'Private sunset dining experiences',
      'Steps from Oia castle',
    ],
    policies: {
      freeCancellation: true,
      breakfastIncluded: true,
      payAtProperty: false,
      checkIn: '15:00',
      checkOut: '11:00',
    },
    rooms: [
      {
        id: 'r-canaves-classic',
        name: 'Classic Cave Suite',
        beds: '1 King Bed',
        size: 38,
        sleeps: 2,
        pricePerNight: 689,
        available: 4,
        refundable: true,
        breakfast: true,
        image: U('1582719508461-905c673771fd'),
      },
      {
        id: 'r-canaves-caldera',
        name: 'Caldera Suite with Private Pool',
        beds: '1 King Bed',
        size: 55,
        sleeps: 2,
        pricePerNight: 1099,
        available: 2,
        refundable: true,
        breakfast: true,
        image: U('1542314831-068cd1dbfeeb'),
      },
    ],
    reviews: [
      {
        id: 'rv-can-1',
        author: 'Olivia M.',
        country: 'United Kingdom',
        rating: 10,
        date: '2026-05-12',
        title: 'Worth every penny',
        content:
          'The view is genuinely breathtaking. The staff remembered our names by day two and the breakfast on the terrace became the highlight of every morning.',
      },
      {
        id: 'rv-can-2',
        author: 'James & Priya',
        country: 'United States',
        rating: 9.8,
        date: '2026-04-28',
        title: 'A perfect honeymoon',
        content:
          'They arranged a private sunset dinner on our terrace without us even asking. Pure magic from start to finish.',
      },
    ],
    neighborhood: 'Oia — cliffside village',
    trending: true,
    dealOfTheDay: true,
    tags: ['romantic', 'luxury', 'scenic', 'honeymoon'],
  },
  {
    id: 'h-santorini-secret',
    slug: 'santorini-secret-paradise',
    name: 'Santorini Secret Suites & Spa',
    description:
      'A hideaway of 17 suites perched on the caldera cliff, blending Cycladic minimalism with playful modern art and a sun-soaked pool deck.',
    city: 'Santorini',
    country: 'Greece',
    countryCode: 'GR',
    address: 'Oia, 84702, Greece',
    latitude: 36.4602,
    longitude: 25.3791,
    starRating: 4,
    guestRating: 9.2,
    reviewCount: 967,
    pricePerNight: 412,
    originalPrice: 540,
    currency: 'USD',
    images: [
      U('1551882547-ff40c63fe5fa'),
      U('1520250497591-112f2f40a3f4'),
      U('1445019980597-93fa8acb246c'),
      U('1564501049412-61c2a3083791'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'pool', label: 'Pool', icon: 'Waves' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'bar', label: 'Bar', icon: 'Wine' },
      { key: 'ac', label: 'Air Conditioning', icon: 'Wind' },
    ],
    highlights: ['Caldera views', 'Walking distance to Oia castle', 'Award-winning spa'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: true,
      payAtProperty: true,
      checkIn: '15:00',
      checkOut: '11:00',
    },
    rooms: [
      {
        id: 'r-secret-suite',
        name: 'Sunset Suite',
        beds: '1 Queen Bed',
        size: 32,
        sleeps: 2,
        pricePerNight: 412,
        available: 6,
        refundable: true,
        breakfast: true,
        image: U('1520250497591-112f2f40a3f4'),
      },
    ],
    reviews: [
      {
        id: 'rv-sec-1',
        author: 'Liam K.',
        country: 'Australia',
        rating: 9.4,
        date: '2026-03-22',
        title: 'Unreal sunset views',
        content: 'Could not stop taking photos. Service and food were both excellent.',
      },
    ],
    neighborhood: 'Oia — cliffside village',
    trending: true,
    tags: ['romantic', 'boutique', 'scenic'],
  },
  // ───── Bali ─────
  {
    id: 'h-bali-four-seasons',
    slug: 'four-seasons-sayan-bali',
    name: 'Four Seasons Resort Bali at Sayan',
    description:
      'Set within a river valley in the heart of Ubud, this flagship property blends sacred Balinese architecture with palm-fringed pools and Asia\'s most awarded spa.',
    city: 'Ubud',
    country: 'Indonesia',
    countryCode: 'ID',
    address: 'Sayan, Ubud, Gianyar 80571',
    latitude: -8.4925,
    longitude: 115.2422,
    starRating: 5,
    guestRating: 9.7,
    reviewCount: 2310,
    pricePerNight: 798,
    originalPrice: 1100,
    currency: 'USD',
    images: [
      U('1573843981267-be1999ff37cd'),
      U('1571896349842-33c89424de2d'),
      U('1542314831-068cd1dbfeeb'),
      U('1582719508461-905c673771fd'),
      U('1551918120-9739cb430c6d'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'pool', label: 'Pool', icon: 'Waves' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'bar', label: 'Bar', icon: 'Wine' },
      { key: 'gym', label: 'Fitness Center', icon: 'Dumbbell' },
      { key: 'kids', label: 'Kids Club', icon: 'Baby' },
      { key: 'transfer', label: 'Airport Transfer', icon: 'Car' },
    ],
    highlights: [
      'Set in a river valley',
      'Private villas with plunge pools',
      'Sacred River Spa',
      'Daily yoga and meditation',
    ],
    policies: {
      freeCancellation: true,
      breakfastIncluded: true,
      payAtProperty: false,
      checkIn: '15:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-fs-sayan-villa',
        name: 'One-Bedroom Villa',
        beds: '1 King Bed',
        size: 173,
        sleeps: 2,
        pricePerNight: 798,
        available: 5,
        refundable: true,
        breakfast: true,
        image: U('1573843981267-be1999ff37cd'),
      },
      {
        id: 'r-fs-sayan-river',
        name: 'River-View Villa',
        beds: '1 King Bed',
        size: 213,
        sleeps: 2,
        pricePerNight: 1199,
        available: 3,
        refundable: true,
        breakfast: true,
        image: U('1571896349842-33c89424de2d'),
      },
    ],
    reviews: [
      {
        id: 'rv-fs-1',
        author: 'Maya L.',
        country: 'Singapore',
        rating: 10,
        date: '2026-05-02',
        title: 'Transcendent',
        content: 'I cried the first morning walking through the bamboo. Staff are angels. Food is exceptional.',
      },
      {
        id: 'rv-fs-2',
        author: 'Tom R.',
        country: 'United States',
        rating: 9.6,
        date: '2026-02-18',
        title: 'Best service of my life',
        content: 'Every staff member knows you by name. The spa treatment is in a category of its own.',
      },
    ],
    neighborhood: 'Sayan — Ubud rainforest',
    trending: true,
    dealOfTheDay: true,
    tags: ['luxury', 'wellness', 'romantic', 'family'],
  },
  {
    id: 'h-bali-potato-head',
    slug: 'potato-head-suites-bali',
    name: 'Potato Head Suites',
    description:
      'A beachfront creative hub in Seminyak — three pools, three restaurants, and a design-forward ethos that doubles as an art playground.',
    city: 'Seminyak',
    country: 'Indonesia',
    countryCode: 'ID',
    address: 'Jl. Petitenget 51B, Seminyak',
    latitude: -8.6778,
    longitude: 115.1567,
    starRating: 4,
    guestRating: 9.1,
    reviewCount: 1452,
    pricePerNight: 285,
    originalPrice: 360,
    currency: 'USD',
    images: [
      U('1570213489059-0aac6626cade'),
      U('1582719508461-905c673771fd'),
      U('1542314831-068cd1dbfeeb'),
      U('1551918120-9739cb430c6d'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'pool', label: 'Pool', icon: 'Waves' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'bar', label: 'Bar', icon: 'Wine' },
      { key: 'gym', label: 'Fitness Center', icon: 'Dumbbell' },
      { key: 'beach', label: 'Beachfront', icon: 'Waves' },
    ],
    highlights: ['Beach club access', 'Daily wellness classes', 'Walking distance to Seminyak'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: false,
      payAtProperty: true,
      checkIn: '15:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-ph-studio',
        name: 'Ocean-View Studio',
        beds: '1 King Bed',
        size: 42,
        sleeps: 2,
        pricePerNight: 285,
        available: 8,
        refundable: true,
        breakfast: false,
        image: U('1570213489059-0aac6626cade'),
      },
    ],
    reviews: [
      {
        id: 'rv-ph-1',
        author: 'Ana P.',
        country: 'Brazil',
        rating: 9.2,
        date: '2026-04-14',
        title: 'Cool crowd, great pool',
        content: 'Loved the design and music. Restaurants on-site are excellent. Sunset from the daybed was unforgettable.',
      },
    ],
    neighborhood: 'Seminyak — beachfront',
    trending: true,
    tags: ['beach', 'design', 'lifestyle'],
  },
  // ───── Kyoto ─────
  {
    id: 'h-kyoto-hoshinoya',
    slug: 'hoshinoya-kyoto',
    name: 'Hoshinoya Kyoto',
    description:
      'A river retreat accessed only by private boat, blending ryokan tradition with architectural precision and silent, intuitive service.',
    city: 'Arashiyama',
    country: 'Japan',
    countryCode: 'JP',
    address: '11-2 Genrokuzan-cho, Arashiyama, Nishikyo',
    latitude: 35.0136,
    longitude: 135.6722,
    starRating: 5,
    guestRating: 9.5,
    reviewCount: 1126,
    pricePerNight: 615,
    originalPrice: 780,
    currency: 'USD',
    images: [
      U('1493997181344-712f2f19d87a'),
      U('1528360983277-13d401cdc186'),
      U('1542051841857-5f90071e7989'),
      U('1542314831-068cd1dbfeeb'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'onsen', label: 'Onsen', icon: 'Waves' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'tea', label: 'Tea Ceremony', icon: 'Coffee' },
      { key: 'kaiseki', label: 'Kaiseki Dining', icon: 'UtensilsCrossed' },
    ],
    highlights: ['Private boat arrival', 'Riverside hot springs', 'Seasonal kaiseki cuisine'],
    policies: {
      freeCancellation: false,
      breakfastIncluded: true,
      payAtProperty: false,
      checkIn: '15:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-hosh-room',
        name: 'River-Side Twin Room',
        beds: '2 Futon Beds',
        size: 45,
        sleeps: 2,
        pricePerNight: 615,
        available: 3,
        refundable: false,
        breakfast: true,
        image: U('1493997181344-712f2f19d87a'),
      },
    ],
    reviews: [
      {
        id: 'rv-hosh-1',
        author: 'Hiro T.',
        country: 'Japan',
        rating: 9.8,
        date: '2026-03-08',
        title: 'Unforgettable',
        content: 'Arrive by boat, leave transformed. The autumn kaiseki was art on a plate.',
      },
    ],
    neighborhood: 'Arashiyama — river gorge',
    trending: true,
    tags: ['cultural', 'romantic', 'wellness', 'ryokan'],
  },
  {
    id: 'h-kyoto-rangetsu',
    slug: 'kyoto-rangetsu',
    name: 'Kyoto Ryokan Rangetsu',
    description:
      'A traditional ryokan steps from Nishiki Market and the geisha district of Gion, with private cypress baths and multi-course dinners.',
    city: 'Kyoto',
    country: 'Japan',
    countryCode: 'JP',
    address: '59 Suenouchi-cho, Nakagyo-ku',
    latitude: 35.0095,
    longitude: 135.7628,
    starRating: 4,
    guestRating: 9.0,
    reviewCount: 612,
    pricePerNight: 320,
    originalPrice: 380,
    currency: 'USD',
    images: [
      U('1528360983277-13d401cdc186'),
      U('1542051841857-5f90071e7989'),
      U('1493997181344-712f2f19d87a'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'onsen', label: 'Cypress Bath', icon: 'Waves' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'ac', label: 'Air Conditioning', icon: 'Wind' },
    ],
    highlights: ['Private cypress baths', 'Multi-course kaiseki', 'Quiet alley near Gion'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: true,
      payAtProperty: true,
      checkIn: '15:00',
      checkOut: '11:00',
    },
    rooms: [
      {
        id: 'r-rangetsu-jp',
        name: 'Japanese-Style Suite',
        beds: '4 Futon Beds',
        size: 50,
        sleeps: 4,
        pricePerNight: 320,
        available: 4,
        refundable: true,
        breakfast: true,
        image: U('1528360983277-13d401cdc186'),
      },
    ],
    reviews: [
      {
        id: 'rv-rng-1',
        author: 'Sara K.',
        country: 'Germany',
        rating: 9.2,
        date: '2026-04-30',
        title: 'Authentic and warm',
        content: 'Hosts treated us like family. The cypress bath after a long day of temples was perfect.',
      },
    ],
    neighborhood: 'Nakagyo — near Gion',
    trending: false,
    tags: ['cultural', 'budget', 'traditional'],
  },
  // ───── Paris ─────
  {
    id: 'h-paris-ritz',
    slug: 'ritz-paris',
    name: 'Ritz Paris',
    description:
      'Place Vendôme institution. Coco Chanel\'s address, Hemingway\'s bar, and a recent four-year restoration that reset the standard for European palace hotels.',
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    address: '15 Place Vendôme, 75001',
    latitude: 48.8683,
    longitude: 2.3288,
    starRating: 5,
    guestRating: 9.4,
    reviewCount: 3204,
    pricePerNight: 1280,
    originalPrice: 1580,
    currency: 'USD',
    images: [
      U('1502602898657-3e91760cbb34'),
      U('1551882547-ff40c63fe5fa'),
      U('1564501049412-61c2a3083791'),
      U('1445019980597-93fa8acb246c'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
      { key: 'pool', label: 'Pool', icon: 'Waves' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'bar', label: 'Bar', icon: 'Wine' },
      { key: 'gym', label: 'Fitness Center', icon: 'Dumbbell' },
      { key: 'concierge', label: 'Concierge', icon: 'ConciergeBell' },
    ],
    highlights: ['Hemingway Bar', 'Coco Chanel Suite', 'Place Vendôme views'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: false,
      payAtProperty: false,
      checkIn: '15:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-ritz-classic',
        name: 'Superior Room',
        beds: '1 King Bed',
        size: 40,
        sleeps: 2,
        pricePerNight: 1280,
        available: 2,
        refundable: true,
        breakfast: false,
        image: U('1502602898657-3e91760cbb34'),
      },
    ],
    reviews: [
      {
        id: 'rv-ritz-1',
        author: 'Charles B.',
        country: 'France',
        rating: 9.6,
        date: '2026-01-25',
        title: 'Parisian perfection',
        content: 'Old-world service that simply does not exist anywhere else. Worth dressing up for.',
      },
    ],
    neighborhood: 'Place Vendôme — 1st arrondissement',
    trending: true,
    dealOfTheDay: false,
    tags: ['luxury', 'iconic', 'romantic'],
  },
  {
    id: 'h-paris-mama',
    slug: 'mama-shelter-paris-east',
    name: 'Mama Shelter Paris East',
    description:
      'Philippe Starck-designed urban retreat in the 20th — playful design, late-night bar, and rooms built for fun without breaking the bank.',
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    address: '109 Rue de Bagnolet, 75020',
    latitude: 48.8535,
    longitude: 2.4101,
    starRating: 3,
    guestRating: 8.4,
    reviewCount: 1853,
    pricePerNight: 142,
    originalPrice: 188,
    currency: 'USD',
    images: [
      U('1551882547-ff40c63fe5fa'),
      U('1445019980597-93fa8acb246c'),
      U('1502602898657-3e91760cbb34'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'bar', label: 'Bar', icon: 'Wine' },
      { key: 'ac', label: 'Air Conditioning', icon: 'Wind' },
    ],
    highlights: ['Starck design', 'Late-night pizzeria', 'Rooftop terrace'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: false,
      payAtProperty: true,
      checkIn: '15:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-mama-medium',
        name: 'Medium Mama Room',
        beds: '1 Queen Bed',
        size: 22,
        sleeps: 2,
        pricePerNight: 142,
        available: 12,
        refundable: true,
        breakfast: false,
        image: U('1551882547-ff40c63fe5fa'),
      },
    ],
    reviews: [
      {
        id: 'rv-mama-1',
        author: 'Lea V.',
        country: 'Spain',
        rating: 8.6,
        date: '2026-03-30',
        title: 'Quirky and fun',
        content: 'Tiny room but so much character. Loved the lobby bar and the staff were charming.',
      },
    ],
    neighborhood: '20th — Belleville/Ménilmontant',
    trending: false,
    tags: ['budget', 'design', 'urban'],
  },
  // ───── Tokyo ─────
  {
    id: 'h-tokyo-aman',
    slug: 'aman-tokyo',
    name: 'Aman Tokyo',
    description:
      'Occupying the top six floors of Otemachi Tower — serene cedar-and-paper interiors, a 33-metre pool, and views from Mt Fuji to Tokyo Bay.',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    address: 'The Otemachi Tower, 1-5-6 Otemachi',
    latitude: 35.6896,
    longitude: 139.7657,
    starRating: 5,
    guestRating: 9.6,
    reviewCount: 982,
    pricePerNight: 1480,
    originalPrice: 1800,
    currency: 'USD',
    images: [
      U('1540959733332-eab4deabeeaf'),
      U('1528360983277-13d401cdc186'),
      U('1542051841857-5f90071e7989'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
      { key: 'pool', label: 'Indoor Pool', icon: 'Waves' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'gym', label: 'Fitness Center', icon: 'Dumbbell' },
      { key: 'onsen', label: 'Onsen', icon: 'Waves' },
    ],
    highlights: ['Skyline pool', 'Mt Fuji views', 'Minimalist Japanese design'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: false,
      payAtProperty: false,
      checkIn: '15:00',
      checkOut: '11:00',
    },
    rooms: [
      {
        id: 'r-aman-dlx',
        name: 'Deluxe Room',
        beds: '1 King Bed',
        size: 84,
        sleeps: 2,
        pricePerNight: 1480,
        available: 2,
        refundable: true,
        breakfast: false,
        image: U('1540959733332-eab4deabeeaf'),
      },
    ],
    reviews: [
      {
        id: 'rv-aman-1',
        author: 'Daniel W.',
        country: 'United States',
        rating: 9.8,
        date: '2026-04-05',
        title: 'Pure serenity',
        content: 'After 12 days of Tokyo intensity, this was the reset we needed. Staff anticipated everything.',
      },
    ],
    neighborhood: 'Otemachi',
    trending: true,
    tags: ['luxury', 'wellness', 'iconic'],
  },
  {
    id: 'h-tokyo-hoshinoya-tokyo',
    slug: 'hoshinoya-tokyo',
    name: 'Hoshinoya Tokyo',
    description:
      'A ryokan reimagined for the high-rise era — tatami floors, onsen, and ochazuke breakfasts all 18 floors above the Imperial Palace.',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    address: '1-9-1 Otemachi, Chiyoda-ku',
    latitude: 35.6902,
    longitude: 139.7646,
    starRating: 5,
    guestRating: 9.4,
    reviewCount: 712,
    pricePerNight: 720,
    originalPrice: 880,
    currency: 'USD',
    images: [
      U('1542051841857-5f90071e7989'),
      U('1540959733332-eab4deabeeaf'),
      U('1528360983277-13d401cdc186'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'onsen', label: 'Onsen', icon: 'Waves' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
    ],
    highlights: ['Ryokan in the sky', 'Public bath with city views', 'Seasonal kaiseki'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: true,
      payAtProperty: false,
      checkIn: '15:00',
      checkOut: '11:00',
    },
    rooms: [
      {
        id: 'r-hosh-tokyo',
        name: 'Yagura Room',
        beds: '2 Futon Beds',
        size: 39,
        sleeps: 2,
        pricePerNight: 720,
        available: 4,
        refundable: true,
        breakfast: true,
        image: U('1542051841857-5f90071e7989'),
      },
    ],
    reviews: [
      {
        id: 'rv-ht-1',
        author: 'Yuki M.',
        country: 'Japan',
        rating: 9.5,
        date: '2026-02-14',
        title: 'Modern ryokan magic',
        content: 'Tea ceremony at sunset on the top floor. Best of Tokyo in one stay.',
      },
    ],
    neighborhood: 'Otemachi — central Tokyo',
    trending: true,
    tags: ['cultural', 'luxury', 'wellness'],
  },
  // ───── New York ─────
  {
    id: 'h-ny-ace',
    slug: 'ace-hotel-new-york',
    name: 'Ace Hotel New York',
    description:
      'A landmark of NoMad — gallery walls, a basement jazz bar, and rooms dressed in raw wood and warm lighting.',
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    address: '20 W 29th St, New York, NY 10001',
    latitude: 40.7456,
    longitude: -73.9881,
    starRating: 4,
    guestRating: 8.9,
    reviewCount: 3214,
    pricePerNight: 268,
    originalPrice: 340,
    currency: 'USD',
    images: [
      U('1496442226666-8d4d0e62e6e9'),
      U('1502602898657-3e91760cbb34'),
      U('1551882547-ff40c63fe5fa'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'bar', label: 'Bar', icon: 'Wine' },
      { key: 'gym', label: 'Fitness Center', icon: 'Dumbbell' },
    ],
    highlights: ['Lobby gallery', 'Stumptown coffee bar', 'Live music nightly'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: false,
      payAtProperty: true,
      checkIn: '15:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-ace-medium',
        name: 'Medium Room',
        beds: '1 Queen Bed',
        size: 22,
        sleeps: 2,
        pricePerNight: 268,
        available: 9,
        refundable: true,
        breakfast: false,
        image: U('1496442226666-8d4d0e62e6e9'),
      },
    ],
    reviews: [
      {
        id: 'rv-ace-1',
        author: 'Rachel T.',
        country: 'United States',
        rating: 9.0,
        date: '2026-05-20',
        title: 'Lobby is the star',
        content: 'Loved the energy. Felt like a neighborhood hangout that happened to have rooms.',
      },
    ],
    neighborhood: 'NoMad — Midtown',
    trending: true,
    tags: ['urban', 'design', 'music'],
  },
  {
    id: 'h-ny-standard',
    slug: 'the-standard-high-line',
    name: 'The Standard, High Line',
    description:
      'Suspended above the High Line park in the Meatpacking District, with floor-to-ceiling windows and the city\'s most-photographed bar.',
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    address: '848 Washington St, New York, NY 10014',
    latitude: 40.7404,
    longitude: -74.0080,
    starRating: 4,
    guestRating: 9.1,
    reviewCount: 2117,
    pricePerNight: 412,
    originalPrice: 540,
    currency: 'USD',
    images: [
      U('1502602898657-3e91760cbb34'),
      U('1496442226666-8d4d0e62e6e9'),
      U('1551882547-ff40c63fe5fa'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'bar', label: 'Rooftop Bar', icon: 'Wine' },
      { key: 'gym', label: 'Fitness Center', icon: 'Dumbbell' },
    ],
    highlights: ['Floor-to-ceiling windows', 'Above the High Line', 'Hudson River views'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: false,
      payAtProperty: true,
      checkIn: '15:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-std-hudson',
        name: 'Hudson-View King',
        beds: '1 King Bed',
        size: 24,
        sleeps: 2,
        pricePerNight: 412,
        available: 5,
        refundable: true,
        breakfast: false,
        image: U('1502602898657-3e91760cbb34'),
      },
    ],
    reviews: [
      {
        id: 'rv-std-1',
        author: 'Mike P.',
        country: 'United Kingdom',
        rating: 9.2,
        date: '2026-03-12',
        title: 'Iconic NYC stay',
        content: 'Watching the sunset over the Hudson from the room window was a highlight.',
      },
    ],
    neighborhood: 'Meatpacking District',
    trending: true,
    tags: ['urban', 'iconic', 'design'],
  },
  // ───── Reykjavik ─────
  {
    id: 'h-iceland-reatjavik',
    slug: 'reykjavik-edition',
    name: 'The Reykjavík EDITION',
    description:
      'Waterfront hotel near the old harbour with minimalist interiors, geothermal-heated floors, and the city\'s most photographed bar.',
    city: 'Reykjavík',
    country: 'Iceland',
    countryCode: 'IS',
    address: 'Austurbakki 2, 101 Reykjavík',
    latitude: 64.1505,
    longitude: -21.9325,
    starRating: 5,
    guestRating: 9.0,
    reviewCount: 1245,
    pricePerNight: 420,
    originalPrice: 540,
    currency: 'USD',
    images: [
      U('1504829857797-ddff29c27927'),
      U('1483728642387-6c3bdd6c93e5'),
      U('1542314831-068cd1dbfeeb'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'bar', label: 'Bar', icon: 'Wine' },
      { key: 'gym', label: 'Fitness Center', icon: 'Dumbbell' },
    ],
    highlights: ['Harbour views', 'Geothermal floors', 'Northern Lights wake-up service'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: true,
      payAtProperty: false,
      checkIn: '15:00',
      checkOut: '11:00',
    },
    rooms: [
      {
        id: 'r-edition-king',
        name: 'King Room with Harbour View',
        beds: '1 King Bed',
        size: 30,
        sleeps: 2,
        pricePerNight: 420,
        available: 7,
        refundable: true,
        breakfast: true,
        image: U('1504829857797-ddff29c27927'),
      },
    ],
    reviews: [
      {
        id: 'rv-edt-1',
        author: 'Inga B.',
        country: 'Norway',
        rating: 9.4,
        date: '2026-01-12',
        title: 'Caught the lights from the spa',
        content: 'Front desk called us at 11pm when the aurora appeared. Magical service.',
      },
    ],
    neighborhood: 'Old Harbour',
    trending: true,
    tags: ['scenic', 'boutique', 'design'],
  },
  // ───── Lisbon ─────
  {
    id: 'h-lisbon-memmo',
    slug: 'memmo-alfama-lisbon',
    name: 'Memmo Alfama Hotel',
    description:
      'Tucked into the cobbled streets of Alfama with a crimson-tiled pool overlooking the Tagus River.',
    city: 'Lisbon',
    country: 'Portugal',
    countryCode: 'PT',
    address: 'Travessa das Merceeiras 27, 1100-348',
    latitude: 38.7115,
    longitude: -9.1310,
    starRating: 4,
    guestRating: 9.2,
    reviewCount: 1432,
    pricePerNight: 215,
    originalPrice: 270,
    currency: 'USD',
    images: [
      U('1555881400-74d7acaacd8b'),
      U('1502602898657-3e91760cbb34'),
      U('1551882547-ff40c63fe5fa'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'pool', label: 'Pool', icon: 'Waves' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'bar', label: 'Bar', icon: 'Wine' },
      { key: 'ac', label: 'Air Conditioning', icon: 'Wind' },
    ],
    highlights: ['Tagus River pool', 'Walk to São Jorge Castle', 'Rooftop wine bar'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: true,
      payAtProperty: true,
      checkIn: '15:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-memmo-dlx',
        name: 'Deluxe River View',
        beds: '1 King Bed',
        size: 28,
        sleeps: 2,
        pricePerNight: 215,
        available: 6,
        refundable: true,
        breakfast: true,
        image: U('1555881400-74d7acaacd8b'),
      },
    ],
    reviews: [
      {
        id: 'rv-memmo-1',
        author: 'Pedro S.',
        country: 'Portugal',
        rating: 9.3,
        date: '2026-04-18',
        title: 'The pool made the trip',
        content: 'Alfama magic — fado drifting up the hill, cocktails by the pool, sunset over the Tagus.',
      },
    ],
    neighborhood: 'Alfama — old town',
    trending: true,
    tags: ['cultural', 'value', 'romantic'],
  },
  // ───── Maldives ─────
  {
    id: 'h-maldives-soneva',
    slug: 'soneva-jani-maldives',
    name: 'Soneva Jani',
    description:
      'Overwater villas with retractable bedroom roofs, private slides into the lagoon, and a home cinema in the resort reef.',
    city: 'Noonu Atoll',
    country: 'Maldives',
    countryCode: 'MV',
    address: 'Medhufaru, Noonu Atoll',
    latitude: 5.4222,
    longitude: 73.5389,
    starRating: 5,
    guestRating: 9.8,
    reviewCount: 871,
    pricePerNight: 2340,
    originalPrice: 2800,
    currency: 'USD',
    images: [
      U('1514282401047-d79a71a590e8'),
      U('1573843981267-be1999ff37cd'),
      U('1571896349842-33c89424de2d'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'pool', label: 'Private Pool', icon: 'Waves' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'butler', label: 'Personal Butler', icon: 'ConciergeBell' },
      { key: 'diving', label: 'Diving Center', icon: 'Waves' },
    ],
    highlights: ['Retractable bedroom roof', 'Private lagoon slide', 'Overwater cinema'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: true,
      payAtProperty: false,
      checkIn: '14:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-soneva-villa',
        name: '1-Bedroom Water Reserve with Slide',
        beds: '1 King Bed',
        size: 408,
        sleeps: 2,
        pricePerNight: 2340,
        available: 2,
        refundable: true,
        breakfast: true,
        image: U('1514282401047-d79a71a590e8'),
      },
    ],
    reviews: [
      {
        id: 'rv-son-1',
        author: 'Aisha K.',
        country: 'United Arab Emirates',
        rating: 10,
        date: '2026-02-22',
        title: 'Beyond words',
        content: 'The slide into the lagoon at sunset. The butler who remembered every preference. The silence.',
      },
    ],
    neighborhood: 'Noonu Atoll',
    trending: true,
    dealOfTheDay: true,
    tags: ['luxury', 'romantic', 'beach', 'honeymoon'],
  },
  // ───── Marrakech ─────
  {
    id: 'h-marrakech-royal',
    slug: 'royal-mansour-marrakech',
    name: 'Royal Mansour Marrakech',
    description:
      'King Mohammed VI\'s vision of Moroccan craftsmanship — 53 private riads arranged like a medina, hand-finished by 1,200 artisans.',
    city: 'Marrakech',
    country: 'Morocco',
    countryCode: 'MA',
    address: 'Rue Abou Abbass Naabit, 40000',
    latitude: 31.6244,
    longitude: -7.9971,
    starRating: 5,
    guestRating: 9.7,
    reviewCount: 1612,
    pricePerNight: 1620,
    originalPrice: 1950,
    currency: 'USD',
    images: [
      U('1518730518541-d0843268c287'),
      U('1551882547-ff40c63fe5fa'),
      U('1564501049412-61c2a3083791'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'pool', label: 'Private Pool', icon: 'Waves' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
      { key: 'restaurant', label: '3 Restaurants', icon: 'Utensils' },
      { key: 'butler', label: 'Personal Butler', icon: 'ConciergeBell' },
    ],
    highlights: ['Private riads', 'Hand-finished craftsmanship', 'Three Michelin-level restaurants'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: true,
      payAtProperty: false,
      checkIn: '15:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-rm-riad',
        name: 'Standard Riad',
        beds: '1 King Bed',
        size: 140,
        sleeps: 2,
        pricePerNight: 1620,
        available: 3,
        refundable: true,
        breakfast: true,
        image: U('1518730518541-d0843268c287'),
      },
    ],
    reviews: [
      {
        id: 'rv-rm-1',
        author: 'Karim H.',
        country: 'France',
        rating: 9.9,
        date: '2026-03-04',
        title: 'Beyond luxury',
        content: 'It is not a hotel, it is an artwork. Each riad has its own rooftop plunge pool.',
      },
    ],
    neighborhood: 'Medina',
    trending: true,
    tags: ['luxury', 'cultural', 'romantic'],
  },
  {
    id: 'h-marrakech-riad-be',
    slug: 'riad-be-marrakech',
    name: 'Riad Be Marrakech',
    description:
      'A 19th-century riad lovingly restored with seven suites around a leafy courtyard and a tiny rooftop dipping pool.',
    city: 'Marrakech',
    country: 'Morocco',
    countryCode: 'MA',
    address: 'Derb Sidi Bouloukat, Medina',
    latitude: 31.6310,
    longitude: -7.9876,
    starRating: 4,
    guestRating: 9.3,
    reviewCount: 478,
    pricePerNight: 165,
    originalPrice: 210,
    currency: 'USD',
    images: [
      U('1518730518541-d0843268c287'),
      U('1551882547-ff40c63fe5fa'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'pool', label: 'Rooftop Pool', icon: 'Waves' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'spa', label: 'Hammam', icon: 'Sparkles' },
    ],
    highlights: ['19th-century courtyard', 'Rooftop plunge pool', 'Authentic hammam'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: true,
      payAtProperty: true,
      checkIn: '14:00',
      checkOut: '11:00',
    },
    rooms: [
      {
        id: 'r-rmb-suite',
        name: 'Courtyard Suite',
        beds: '1 King Bed',
        size: 35,
        sleeps: 2,
        pricePerNight: 165,
        available: 4,
        refundable: true,
        breakfast: true,
        image: U('1518730518541-d0843268c287'),
      },
    ],
    reviews: [
      {
        id: 'rv-rmb-1',
        author: 'Emma W.',
        country: 'United Kingdom',
        rating: 9.4,
        date: '2026-02-10',
        title: 'Magical riad',
        content: 'Breakfast on the rooftop, call to prayer at sunset. Could not ask for more.',
      },
    ],
    neighborhood: 'Medina',
    trending: false,
    tags: ['cultural', 'value', 'boutique'],
  },
  // ───── Bangkok ─────
  {
    id: 'h-bangkok-mandarin',
    slug: 'mandarin-oriental-bangkok',
    name: 'Mandarin Oriental Bangkok',
    description:
      'Authors and heads of state have stayed here for over 140 years. Riverside, refined, and home to one of Asia\'s best brunches.',
    city: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    address: '48 Oriental Avenue, Bang Rak',
    latitude: 13.7263,
    longitude: 100.5148,
    starRating: 5,
    guestRating: 9.5,
    reviewCount: 4128,
    pricePerNight: 480,
    originalPrice: 620,
    currency: 'USD',
    images: [
      U('1508009603885-50cf7c579365'),
      U('1542314831-068cd1dbfeeb'),
      U('1551918120-9739cb430c6d'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'pool', label: 'Pool', icon: 'Waves' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
      { key: 'restaurant', label: '9 Restaurants', icon: 'Utensils' },
      { key: 'gym', label: 'Fitness Center', icon: 'Dumbbell' },
    ],
    highlights: ['Chao Phraya river views', 'Author Bar', 'Heritage since 1876'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: false,
      payAtProperty: false,
      checkIn: '15:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-mob-premier',
        name: 'Premier River View',
        beds: '1 King Bed',
        size: 38,
        sleeps: 2,
        pricePerNight: 480,
        available: 5,
        refundable: true,
        breakfast: false,
        image: U('1508009603885-50cf7c579365'),
      },
    ],
    reviews: [
      {
        id: 'rv-mob-1',
        author: 'Aroon T.',
        country: 'Thailand',
        rating: 9.7,
        date: '2026-03-19',
        title: 'Iconic Thai hospitality',
        content: 'Service that simply cannot be matched anywhere in the city. A Bangkok institution.',
      },
    ],
    neighborhood: 'Bang Rak — Riverside',
    trending: true,
    tags: ['iconic', 'luxury', 'cultural'],
  },
  {
    id: 'h-bangkok-sindhorn',
    slug: 'sindhorn-midtown-bangkok',
    name: 'Sindhorn Midtown Hotel Bangkok',
    description:
      'A new-build tower in the Langsuan neighbourhood with rooftop pool, oversized rooms, and a quiet side-street location.',
    city: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    address: '68 Langsuan Road, Lumpini',
    latitude: 13.7414,
    longitude: 100.5458,
    starRating: 4,
    guestRating: 8.8,
    reviewCount: 2134,
    pricePerNight: 142,
    originalPrice: 180,
    currency: 'USD',
    images: [
      U('1542314831-068cd1dbfeeb'),
      U('1508009603885-50cf7c579365'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'pool', label: 'Rooftop Pool', icon: 'Waves' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'gym', label: 'Fitness Center', icon: 'Dumbbell' },
    ],
    highlights: ['Rooftop pool', 'Central Langsuan location', 'Modern rooms'],
    policies: {
      freeCancellation: true,
      breakfastIncluded: false,
      payAtProperty: true,
      checkIn: '15:00',
      checkOut: '12:00',
    },
    rooms: [
      {
        id: 'r-sindhorn-dlx',
        name: 'Deluxe Room',
        beds: '1 King Bed',
        size: 32,
        sleeps: 2,
        pricePerNight: 142,
        available: 10,
        refundable: true,
        breakfast: false,
        image: U('1542314831-068cd1dbfeeb'),
      },
    ],
    reviews: [
      {
        id: 'rv-sin-1',
        author: 'Lena K.',
        country: 'Germany',
        rating: 8.9,
        date: '2026-04-02',
        title: 'Great value, great pool',
        content: 'Modern, clean, near Lumpini Park. Rooftop pool was the highlight.',
      },
    ],
    neighborhood: 'Langsuan — Lumpini',
    trending: false,
    tags: ['value', 'urban', 'modern'],
  },
  // ───── Patagonia ─────
  {
    id: 'h-patagonia-exploradores',
    slug: 'explora-patagonia',
    name: 'Explora Patagonia',
    description:
      'A lodge inside Torres del Paine National Park with all-inclusive guided expeditions to the base of the towers and beyond.',
    city: 'Torres del Paine',
    country: 'Chile',
    countryCode: 'CL',
    address: 'Sector Salto Chico, Torres del Paine',
    latitude: -50.9783,
    longitude: -72.9658,
    starRating: 5,
    guestRating: 9.4,
    reviewCount: 612,
    pricePerNight: 945,
    originalPrice: 1180,
    currency: 'USD',
    images: [
      U('1483728642387-6c3bdd6c93e5'),
      U('1573843981267-be1999ff37cd'),
    ],
    amenities: [
      { key: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
      { key: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
      { key: 'bar', label: 'Bar', icon: 'Wine' },
      { key: 'spa', label: 'Spa', icon: 'Sparkles' },
      { key: 'guide', label: 'Guided Expeditions', icon: 'Mountain' },
    ],
    highlights: ['Inside Torres del Paine', 'All-inclusive guided hikes', 'Spa with mountain views'],
    policies: {
      freeCancellation: false,
      breakfastIncluded: true,
      payAtProperty: false,
      checkIn: '15:00',
      checkOut: '11:00',
    },
    rooms: [
      {
        id: 'r-exp-room',
        name: 'Salto Chico Room',
        beds: '1 King Bed',
        size: 30,
        sleeps: 2,
        pricePerNight: 945,
        available: 6,
        refundable: false,
        breakfast: true,
        image: U('1483728642387-6c3bdd6c93e5'),
      },
    ],
    reviews: [
      {
        id: 'rv-exp-1',
        author: 'Diego R.',
        country: 'Argentina',
        rating: 9.6,
        date: '2026-01-30',
        title: 'Bucket-list lodge',
        content: 'Worth every peso. Hiked to the towers with the guide at sunrise — life-changing.',
      },
    ],
    neighborhood: 'Torres del Paine National Park',
    trending: false,
    tags: ['adventure', 'scenic', 'remote'],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Flights — sample flights between major hubs
// ────────────────────────────────────────────────────────────────────────────

const flightDate = (daysFromNow: number, hh: number, mm: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  d.setUTCHours(hh, mm, 0, 0);
  return d.toISOString();
};

const addMin = (iso: string, mins: number) =>
  new Date(new Date(iso).getTime() + mins * 60000).toISOString();

export const flights: Flight[] = [
  {
    id: 'fl-nyc-paris-afr',
    airline: 'Air France',
    airlineCode: 'AF',
    flightNumber: 'AF023',
    departureAirport: 'JFK',
    departureCity: 'New York',
    arrivalAirport: 'CDG',
    arrivalCity: 'Paris',
    departureTime: flightDate(7, 22, 30),
    arrivalTime: addMin(flightDate(7, 22, 30), 7 * 60 + 25),
    duration: 445,
    stops: 0,
    stopCities: [],
    price: 489,
    originalPrice: 612,
    currency: 'USD',
    cabin: 'Economy',
    seatsLeft: 8,
    aircraft: 'Boeing 777-300ER',
    co2Kg: 580,
    amenities: ['Wi-Fi', 'Power outlets', 'On-demand entertainment', 'Two checked bags'],
    baggage: '2 × 23kg checked',
  },
  {
    id: 'fl-nyc-paris-dlt',
    airline: 'Delta',
    airlineCode: 'DL',
    flightNumber: 'DL264',
    departureAirport: 'JFK',
    departureCity: 'New York',
    arrivalAirport: 'CDG',
    arrivalCity: 'Paris',
    departureTime: flightDate(7, 19, 50),
    arrivalTime: addMin(flightDate(7, 19, 50), 7 * 60 + 40),
    duration: 460,
    stops: 0,
    stopCities: [],
    price: 532,
    originalPrice: 680,
    currency: 'USD',
    cabin: 'Economy',
    seatsLeft: 12,
    aircraft: 'Airbus A330-900neo',
    co2Kg: 595,
    amenities: ['Wi-Fi', 'Power outlets', 'On-demand entertainment'],
    baggage: '1 × 23kg checked',
  },
  {
    id: 'fl-nyc-paris-united',
    airline: 'United',
    airlineCode: 'UA',
    flightNumber: 'UA57',
    departureAirport: 'EWR',
    departureCity: 'New York',
    arrivalAirport: 'CDG',
    arrivalCity: 'Paris',
    departureTime: flightDate(7, 18, 5),
    arrivalTime: addMin(flightDate(7, 18, 5), 10 * 60 + 5),
    duration: 605,
    stops: 1,
    stopCities: ['IAD'],
    price: 412,
    originalPrice: 540,
    currency: 'USD',
    cabin: 'Economy',
    seatsLeft: 22,
    aircraft: 'Boeing 767-400ER',
    co2Kg: 720,
    amenities: ['Wi-Fi', 'Power outlets'],
    baggage: '1 × 23kg checked',
  },
  {
    id: 'fl-lhr-ath-afr',
    airline: 'British Airways',
    airlineCode: 'BA',
    flightNumber: 'BA632',
    departureAirport: 'LHR',
    departureCity: 'London',
    arrivalAirport: 'JTR',
    arrivalCity: 'Santorini',
    departureTime: flightDate(14, 8, 30),
    arrivalTime: addMin(flightDate(14, 8, 30), 4 * 60 + 5),
    duration: 245,
    stops: 0,
    stopCities: [],
    price: 218,
    originalPrice: 290,
    currency: 'USD',
    cabin: 'Economy',
    seatsLeft: 6,
    aircraft: 'Airbus A320neo',
    co2Kg: 320,
    amenities: ['Refreshments', 'Power outlets'],
    baggage: '1 × 23kg checked',
  },
  {
    id: 'fl-sin-dps-sq',
    airline: 'Singapore Airlines',
    airlineCode: 'SQ',
    flightNumber: 'SQ946',
    departureAirport: 'SIN',
    departureCity: 'Singapore',
    arrivalAirport: 'DPS',
    arrivalCity: 'Bali',
    departureTime: flightDate(10, 11, 25),
    arrivalTime: addMin(flightDate(10, 11, 25), 2 * 60 + 50),
    duration: 170,
    stops: 0,
    stopCities: [],
    price: 198,
    originalPrice: 245,
    currency: 'USD',
    cabin: 'Economy',
    seatsLeft: 14,
    aircraft: 'Boeing 787-10',
    co2Kg: 220,
    amenities: ['Wi-Fi', 'Power outlets', 'On-demand entertainment'],
    baggage: '2 × 23kg checked',
  },
  {
    id: 'fl-nrt-hnd-ana',
    airline: 'ANA',
    airlineCode: 'NH',
    flightNumber: 'NH022',
    departureAirport: 'JFK',
    departureCity: 'New York',
    arrivalAirport: 'HND',
    arrivalCity: 'Tokyo',
    departureTime: flightDate(12, 11, 30),
    arrivalTime: addMin(flightDate(12, 11, 30), 13 * 60 + 55),
    duration: 835,
    stops: 0,
    stopCities: [],
    price: 1240,
    originalPrice: 1680,
    currency: 'USD',
    cabin: 'Economy',
    seatsLeft: 4,
    aircraft: 'Boeing 777-300ER',
    co2Kg: 1450,
    amenities: ['Wi-Fi', 'Power outlets', 'On-demand entertainment', 'Two checked bags'],
    baggage: '2 × 23kg checked',
  },
  {
    id: 'fl-jfk-fco-afr',
    airline: 'ITA Airways',
    airlineCode: 'AZ',
    flightNumber: 'AZ611',
    departureAirport: 'JFK',
    departureCity: 'New York',
    arrivalAirport: 'FCO',
    arrivalCity: 'Rome',
    departureTime: flightDate(11, 16, 40),
    arrivalTime: addMin(flightDate(11, 16, 40), 8 * 60 + 25),
    duration: 505,
    stops: 0,
    stopCities: [],
    price: 558,
    originalPrice: 720,
    currency: 'USD',
    cabin: 'Economy',
    seatsLeft: 9,
    aircraft: 'Airbus A330-900neo',
    co2Kg: 640,
    amenities: ['Wi-Fi', 'Power outlets', 'Italian cuisine'],
    baggage: '1 × 23kg checked',
  },
  {
    id: 'fl-lis-tlv-tp',
    airline: 'TAP Air Portugal',
    airlineCode: 'TP',
    flightNumber: 'TP1904',
    departureAirport: 'LIS',
    departureCity: 'Lisbon',
    arrivalAirport: 'TLV',
    arrivalCity: 'Tel Aviv',
    departureTime: flightDate(8, 14, 15),
    arrivalTime: addMin(flightDate(8, 14, 15), 5 * 60 + 10),
    duration: 310,
    stops: 0,
    stopCities: [],
    price: 246,
    originalPrice: 320,
    currency: 'USD',
    cabin: 'Economy',
    seatsLeft: 18,
    aircraft: 'Airbus A320neo',
    co2Kg: 410,
    amenities: ['Wi-Fi', 'Power outlets'],
    baggage: '1 × 23kg checked',
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Search helpers
// ────────────────────────────────────────────────────────────────────────────

export function getHotelBySlug(slug: string): Hotel | undefined {
  return hotels.find((h) => h.slug === slug);
}

export function getHotelById(id: string): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function searchHotels(opts: {
  query?: string;
  destination?: string;
  priceMin?: number;
  priceMax?: number;
  minStars?: number;
  minRating?: number;
  amenities?: string[];
  sort?: 'recommended' | 'price-asc' | 'price-desc' | 'rating';
  trending?: boolean;
  tags?: string[];
}): Hotel[] {
  let result = hotels.slice();

  if (opts.query) {
    const q = opts.query.toLowerCase();
    result = result.filter((h) =>
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.country.toLowerCase().includes(q) ||
      h.tags.some((t) => t.toLowerCase().includes(q)) ||
      h.description.toLowerCase().includes(q) ||
      h.neighborhood.toLowerCase().includes(q)
    );
  }

  if (opts.destination) {
    const d = opts.destination.toLowerCase();
    // Match against destination catalogue first (e.g. "Bali" -> country "Indonesia" / region "Asia")
    const dest = destinations.find(
      (x) => x.name.toLowerCase() === d || x.country.toLowerCase() === d
    );
    const matchTerms = [d];
    if (dest) matchTerms.push(dest.country.toLowerCase());

    result = result.filter((h) =>
      matchTerms.some((t) =>
        h.city.toLowerCase().includes(t) ||
        h.country.toLowerCase().includes(t) ||
        h.tags.some((tag) => tag.toLowerCase().includes(t))
      )
    );
  }

  if (opts.priceMin != null) result = result.filter((h) => h.pricePerNight >= opts.priceMin!);
  if (opts.priceMax != null) result = result.filter((h) => h.pricePerNight <= opts.priceMax!);
  if (opts.minStars != null) result = result.filter((h) => h.starRating >= opts.minStars!);
  if (opts.minRating != null) result = result.filter((h) => h.guestRating >= opts.minRating!);
  if (opts.trending) result = result.filter((h) => h.trending);
  if (opts.amenities && opts.amenities.length > 0) {
    result = result.filter((h) => opts.amenities!.every((a) => h.amenities.some((am) => am.key === a)));
  }
  if (opts.tags && opts.tags.length > 0) {
    result = result.filter((h) => opts.tags!.some((t) => h.tags.includes(t)));
  }

  switch (opts.sort) {
    case 'price-asc':
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
      break;
    case 'price-desc':
      result.sort((a, b) => b.pricePerNight - a.pricePerNight);
      break;
    case 'rating':
      result.sort((a, b) => b.guestRating - a.guestRating);
      break;
    default:
      // recommended: trending first, then by rating
      result.sort((a, b) => {
        if (a.trending !== b.trending) return a.trending ? -1 : 1;
        return b.guestRating - a.guestRating;
      });
  }

  return result;
}

export function searchFlights(opts: {
  from?: string;
  to?: string;
  maxStops?: number;
  cabin?: Flight['cabin'];
  sort?: 'price-asc' | 'duration' | 'recommended';
}): Flight[] {
  let result = flights.slice();

  if (opts.from) {
    const f = opts.from.toLowerCase();
    result = result.filter((x) => x.departureCity.toLowerCase().includes(f) || x.departureAirport.toLowerCase() === f.toUpperCase());
  }
  if (opts.to) {
    const t = opts.to.toLowerCase();
    result = result.filter((x) => x.arrivalCity.toLowerCase().includes(t) || x.arrivalAirport.toLowerCase() === t.toUpperCase());
  }
  if (opts.maxStops != null) result = result.filter((x) => x.stops <= opts.maxStops!);
  if (opts.cabin) result = result.filter((x) => x.cabin === opts.cabin);

  switch (opts.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'duration':
      result.sort((a, b) => a.duration - b.duration);
      break;
    default:
      result.sort((a, b) => a.price - b.price);
  }

  return result;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function priceBucket(hotel: Hotel): 'budget' | 'mid' | 'luxury' {
  if (hotel.pricePerNight < 200) return 'budget';
  if (hotel.pricePerNight < 600) return 'mid';
  return 'luxury';
}

export function discountPercent(hotel: Hotel): number {
  if (!hotel.originalPrice) return 0;
  return Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }): string {
  return new Intl.DateTimeFormat('en-US', opts).format(new Date(iso));
}

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}