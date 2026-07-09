import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
    };
    const user = await loginUser({
      email: body.email ?? '',
      password: body.password ?? '',
    });
    return NextResponse.json({ user });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Sign-in failed';
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}