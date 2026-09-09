import 'server-only';
import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';

export class UnauthorizedError extends Error {}

export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError('Not signed in');
  return userId;
}

// Ensures a `users` row exists for the signed-in Clerk user, so the
// `ideas.user_id` foreign key doesn't fail if the Clerk webhook hasn't
// synced this user yet (e.g. in local dev without a public webhook URL).
export async function ensureUserRow(userId: string): Promise<void> {
  const existing = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (existing) return;

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  await db.insert(users).values({ id: userId, email }).onConflictDoNothing();
}
