import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

interface Body {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Body;
    if (!body.email || !body.message || !body.name) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    await db.auditLog.create({
      data: {
        userId: user?.id ?? null,
        action: 'contact_message',
        resource: 'contact',
        resourceId: null,
        metadata: {
          name: body.name,
          email: body.email,
          subject: body.subject ?? '',
          messageLength: body.message.length,
        },
      },
    });

    // In production, this would forward to a ticketing system (Zendesk, Intercom, etc.)
    // or trigger an email via SendGrid/Postmark. For now, we log it.
    console.log('[Contact]', body.email, '-', body.subject ?? '(no subject)');

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Contact API]', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}