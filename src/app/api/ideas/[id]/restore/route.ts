import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { ideas } from '@/db/schema';
import { requireUserId, UnauthorizedError } from '@/lib/api/auth';
import { toSavedIdea } from '@/lib/api/ideas';

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;

    const [row] = await db
      .update(ideas)
      .set({ deletedAt: null })
      .where(and(eq(ideas.id, id), eq(ideas.userId, userId)))
      .returning();

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(toSavedIdea(row));
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }
    throw error;
  }
}
