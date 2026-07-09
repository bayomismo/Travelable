// ─── Core Types ──────────────────────────────────────────────────────────────

export interface TravelSearchQuery {
  query: string;
  type: 'hotel' | 'flight' | 'package' | 'any';
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  budget?: number;
  currency?: string;
  preferences?: string[];
}

export interface PriceAnalysis {
  verdict: 'buy_now' | 'wait' | 'good_price' | 'expensive';
  confidence: number; // 0-100
  expectedChange: string;
  timeframe: string;
  trend: 'up' | 'down' | 'stable';
  historicalLow: number;
  historicalHigh: number;
  currentPercentile: number; // 0-100, lower = cheaper relative to history
}

export interface HotelSummary {
  idealFor: string[];
  highlights: string[];
  warnings: string[];
  overall: string;
  score: number; // 0-100
}

export interface HotelResult {
  id: string;
  name: string;
  city: string;
  country: string;
  images: string[];
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  currency: string;
  amenities: string[];
  aiSummary: HotelSummary;
  priceAnalysis: PriceAnalysis;
  provider: string;
  providerPrice: number;
  distanceToCenter?: number;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
}

export interface FlightResult {
  id: string;
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: number;
  stopCities?: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  class: string;
  seatAvailable: number;
  priceAnalysis: PriceAnalysis;
  provider: string;
  co2Emissions?: number;
}

export interface PriceComparison {
  provider: string;
  price: number;
  currency: string;
  url?: string;
  rating?: number;
  isBestValue?: boolean;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  morning: ItineraryActivity[];
  afternoon: ItineraryActivity[];
  evening: ItineraryActivity[];
  weather: { temp: number; condition: string; icon: string };
  estimatedCost: number;
  walkingDistance: number; // km
}

export interface ItineraryActivity {
  time: string;
  name: string;
  description: string;
  location: string;
  duration: number; // minutes
  cost: number;
  type: 'food' | 'activity' | 'transport' | 'sightseeing' | 'rest';
  tips?: string;
}

export interface BudgetBreakdown {
  total: number;
  currency: string;
  flights: { allocated: number; actual?: number };
  accommodation: { allocated: number; actual?: number };
  food: { allocated: number; actual?: number };
  transport: { allocated: number; actual?: number };
  activities: { allocated: number; actual?: number };
  emergency: { allocated: number; actual?: number };
  tips: string[];
}

export interface TripOptimization {
  type: 'date_shift' | 'airport_change' | 'hotel_alternative' | 'class_change';
  description: string;
  savings: number;
  currency: string;
  impact: 'low' | 'medium' | 'high';
  action: string;
}

export interface MapCountryData {
  code: string;
  name: string;
  avgHotelPrice: number;
  avgFlightPrice: number;
  cheapestMonth: string;
  visaRequirement: string;
  weather: string;
  safetyScore: number;
  currency: string;
  timezone: string;
  aiRecommendation: string;
  latitude: number;
  longitude: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  loading?: boolean;
}

export interface DestinationCard {
  name: string;
  country: string;
  image: string;
  tagline: string;
  priceFrom: number;
  rating: number;
  trending: boolean;
}

export interface SearchTab {
  id: string;
  label: string;
  icon: string;
}

export type ViewMode = 'landing' | 'search' | 'results' | 'hotel-detail' | 'checkout' | 'itinerary' | 'budget';