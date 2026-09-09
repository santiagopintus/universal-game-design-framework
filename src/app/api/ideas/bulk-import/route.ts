import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { ideas } from '@/db/schema';
import { ensureUserRow, requireUserId, UnauthorizedError } from '@/lib/api/auth';
import { bulkImportBodySchema, toSavedIdea } from '@/lib/api/ideas';

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = bulkImportBodySchema.parse(await request.json());

    if (body.length === 0) return NextResponse.json([]);

    await ensureUserRow(userId);

    const rows = await db
      .insert(ideas)
      .values(
        body.map((idea) => ({
          id: idea.id,
          userId,
          ideaTitle: idea.ideaTitle,
          values: idea.values,
          updatedAt: new Date(idea.updatedAt),
          deletedAt: idea.deletedAt ? new Date(idea.deletedAt) : null,
        })),
      )
      .onConflictDoUpdate({
        target: ideas.id,
        // Only overwrite a pre-existing row if it already belongs to this user —
        // otherwise a colliding client-generated id would silently no-op instead
        // of touching someone else's idea.
        setWhere: eq(ideas.userId, userId),
        set: {
          ideaTitle: sql`excluded.idea_title`,
          values: sql`excluded.values`,
          updatedAt: sql`excluded.updated_at`,
          deletedAt: sql`excluded.deleted_at`,
        },
      })
      .returning();

    return NextResponse.json(rows.map(toSavedIdea));
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }
    throw error;
  }
}
