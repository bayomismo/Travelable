import { NextResponse } from 'next/server';
import { hotels } from '@/lib/travel-data';

export async function GET() {
  const featured = hotels
    .filter((h) => h.guestRating >= 9.0)
    .sort((a, b) => b.guestRating - a.guestRating)
    .slice(0, 8);
  return NextResponse.json({ hotels: featured });
}