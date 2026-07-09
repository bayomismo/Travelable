import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, createBooking } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to book.' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      hotelId?: string;
      flightId?: string;
      type?: 'hotel' | 'flight' | 'package';
      totalPrice?: number;
      currency?: string;
      checkIn?: string;
      checkOut?: string;
      guests?: number;
      specialRequests?: string;
      meta?: Record<string, unknown>;
    };

    if (!body.type || !body.totalPrice || !body.checkIn) {
      return NextResponse.json(
        { error: 'type, totalPrice, and checkIn are required.' },
        { status: 400 }
      );
    }

    const booking = await createBooking({
      userId: user.id,
      hotelId: body.hotelId,
      flightId: body.flightId,
      type: body.type,
      totalPrice: body.totalPrice,
      currency: body.currency ?? 'USD',
      checkIn: new Date(body.checkIn),
      checkOut: body.checkOut ? new Date(body.checkOut) : undefined,
      guests: body.guests ?? 1,
      specialRequests: body.specialRequests,
      meta: {
        ...(body.meta ?? {}),
        hotelName: body.meta?.hotelName,
        hotelCity: body.meta?.hotelCity,
        hotelCountry: body.meta?.hotelCountry,
        hotelImage: body.meta?.hotelImage,
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('[Bookings POST]', error);
    const msg = error instanceof Error ? error.message : 'Booking failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await db.booking.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('[Bookings GET]', error);
    return NextResponse.json({ error: 'Failed to load bookings' }, { status: 500 });
  }
}