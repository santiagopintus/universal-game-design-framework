import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { ideas } from '@/db/schema';
import { ensureUserRow, requireUserId, UnauthorizedError } from '@/lib/api/auth';
import { saveIdeaBodySchema, toSavedIdea } from '@/lib/api/ideas';

export async function GET() {
  try {
    const userId = await requireUserId();
    const rows = await db.query.ideas.findMany({ where: eq(ideas.userId, userId) });
    return NextResponse.json(rows.map(toSavedIdea));
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = saveIdeaBodySchema.parse(await request.json());

    await ensureUserRow(userId);

    const existing = await db.query.ideas.findFirst({
      where: and(eq(ideas.id, body.id), eq(ideas.userId, userId)),
    });
    if (existing) {
      return NextResponse.json({ error: 'Idea already exists, use PUT to update' }, { status: 409 });
    }

    const [row] = await db
      .insert(ideas)
      .values({ id: body.id, userId, ideaTitle: body.ideaTitle, values: body.values })
      .returning();

    return NextResponse.json(toSavedIdea(row), { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }
    throw error;
  }
}
