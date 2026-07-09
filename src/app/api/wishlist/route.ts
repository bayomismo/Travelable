/**
 * /api/wishlist — save and retrieve a user's wishlist.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const items = await db.wishlistItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Please sign in to save.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    hotelId?: string;
    hotelSlug?: string;
    hotelName?: string;
    hotelCity?: string;
    hotelImage?: string;
    pricePerNight?: number;
    currency?: string;
  };

  if (!body.hotelId || !body.hotelSlug || !body.hotelName) {
    return NextResponse.json({ error: 'Missing hotel fields.' }, { status: 400 });
  }

  // Upsert by (userId, hotelId)
  const item = await db.wishlistItem.upsert({
    where: { userId_hotelId: { userId: user.id, hotelId: body.hotelId } },
    create: {
      userId: user.id,
      hotelId: body.hotelId,
      hotelSlug: body.hotelSlug,
      hotelName: body.hotelName,
      hotelCity: body.hotelCity ?? '',
      hotelImage: body.hotelImage ?? '',
      pricePerNight: body.pricePerNight ?? 0,
      currency: body.currency ?? 'USD',
    },
    update: {
      pricePerNight: body.pricePerNight ?? 0,
      currency: body.currency ?? 'USD',
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const hotelId = request.nextUrl.searchParams.get('hotelId');
  if (!hotelId) {
    return NextResponse.json({ error: 'hotelId is required' }, { status: 400 });
  }
  await db.wishlistItem.deleteMany({
    where: { userId: user.id, hotelId },
  });
  return NextResponse.json({ ok: true });
}