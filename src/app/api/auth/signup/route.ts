import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
      name?: string;
    };
    const user = await registerUser({
      email: body.email ?? '',
      password: body.password ?? '',
      name: body.name ?? '',
    });
    return NextResponse.json({ user });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Sign-up failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}