/**
 * Lightweight, secure session-based auth for Travelable.
 *
 * - Users are persisted via Prisma (User model).
 * - Sessions are signed cookies (HMAC-SHA256) — no external auth provider required.
 * - Passwords are hashed with PBKDF2 via Node's `crypto` (no native deps).
 *
 * This is suitable for production demos and side-projects. For higher-scale /
 * compliance needs, swap to NextAuth or Clerk — the auth surface here is small.
 */

import { cookies } from 'next/headers';
import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';
import { db } from './db';

const COOKIE = 'tv_session';
const SECRET = process.env.NEXTAUTH_SECRET || 'travelable-dev-secret-change-in-production';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  avatar?: string | null;
}

// ── Password hashing ─────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const computed = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(computed, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// ── Signed session cookies ────────────────────────────────────────────────

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('hex');
}

function encodeSession(userId: string): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `${userId}.${exp}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

function decodeSession(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  const expected = sign(`${userId}.${exp}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(exp) < Date.now()) return null;
  return userId;
}

export async function createSession(userId: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, encodeSession(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const jar = await cookies();
  const c = jar.get(COOKIE);
  if (!c) return null;
  return decodeSession(c.value);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  try {
    const u = await db.user.findUnique({ where: { id: userId } });
    if (!u) return null;
    return {
      id: u.id,
      email: u.email,
      name: u.name ?? u.email.split('@')[0],
      role: (u.role as SessionUser['role']) ?? 'user',
      tier: (u.tier as SessionUser['tier']) ?? 'bronze',
      avatar: u.avatar ?? null,
    };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const u = await getCurrentUser();
  if (!u) throw new Error('UNAUTHORIZED');
  return u;
}

// ── Registration / login flows ────────────────────────────────────────────

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export async function registerUser(input: RegisterInput): Promise<SessionUser> {
  const email = input.email.trim().toLowerCase();
  if (!email.includes('@')) throw new Error('Please enter a valid email.');
  if (input.password.length < 8) throw new Error('Password must be at least 8 characters.');
  if (!input.name.trim()) throw new Error('Please tell us your name.');

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new Error('An account with this email already exists.');

  const u = await db.user.create({
    data: {
      email,
      name: input.name.trim(),
      passwordHash: hashPassword(input.password),
      provider: 'credentials',
      role: 'user',
      tier: 'bronze',
    },
  });

  await createSession(u.id);
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? email,
    role: 'user',
    tier: 'bronze',
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function loginUser(input: LoginInput): Promise<SessionUser> {
  const email = input.email.trim().toLowerCase();
  const u = await db.user.findUnique({ where: { email } });
  if (!u) throw new Error('No account found with that email.');
  if (!u.passwordHash) throw new Error('This account uses social sign-in.');
  if (!verifyPassword(input.password, u.passwordHash)) throw new Error('Incorrect password.');

  await createSession(u.id);
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? email,
    role: (u.role as SessionUser['role']) ?? 'user',
    tier: (u.tier as SessionUser['tier']) ?? 'bronze',
  };
}

// ── Booking helpers ───────────────────────────────────────────────────────

export interface CreateBookingInput {
  userId: string;
  hotelId?: string;
  flightId?: string;
  type: 'hotel' | 'flight' | 'package';
  totalPrice: number;
  currency: string;
  checkIn: Date;
  checkOut?: Date;
  guests: number;
  specialRequests?: string;
  meta?: Record<string, unknown>;
}

export async function createBooking(input: CreateBookingInput) {
  return db.booking.create({
    data: {
      userId: input.userId,
      type: input.type,
      totalPrice: input.totalPrice,
      currency: input.currency,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      specialRequests: input.specialRequests,
      hotelId: input.hotelId,
      hotelName: typeof input.meta?.hotelName === 'string' ? input.meta.hotelName : null,
      hotelCity: typeof input.meta?.hotelCity === 'string' ? input.meta.hotelCity : null,
      hotelCountry: typeof input.meta?.hotelCountry === 'string' ? input.meta.hotelCountry : null,
      hotelImage: typeof input.meta?.hotelImage === 'string' ? input.meta.hotelImage : null,
      paymentStatus: 'paid', // simulated payment
      status: 'confirmed',
      confirmationCode: generateConfirmationCode(),
      itinerary: input.meta ? JSON.stringify(input.meta) : null,
    },
  });
}

export function generateConfirmationCode(): string {
  // Memorable 8-char code: TV-XXXXXX
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(6);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return `TV-${code}`;
}