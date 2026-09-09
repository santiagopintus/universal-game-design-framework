import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error('Clerk webhook verification failed:', err);
    return new Response('Verification failed', { status: 400 });
  }

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const { id, email_addresses } = evt.data;
    const email = email_addresses[0]?.email_address ?? null;
    await db
      .insert(users)
      .values({ id, email })
      .onConflictDoUpdate({ target: users.id, set: { email } });
  }

  if (evt.type === 'user.deleted') {
    const { id } = evt.data;
    if (id) await db.delete(users).where(eq(users.id, id));
  }

  return NextResponse.json({ ok: true });
}
