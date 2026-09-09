import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { ideas } from '@/db/schema';
import { requireUserId, UnauthorizedError } from '@/lib/api/auth';
import { saveIdeaBodySchema, toSavedIdea } from '@/lib/api/ideas';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;

    const row = await db.query.ideas.findFirst({ where: and(eq(ideas.id, id), eq(ideas.userId, userId)) });
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(toSavedIdea(row));
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }
    throw error;
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const body = saveIdeaBodySchema.parse(await request.json());

    const [row] = await db
      .update(ideas)
      .set({ ideaTitle: body.ideaTitle, values: body.values, updatedAt: new Date() })
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

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;

    const [row] = await db
      .update(ideas)
      .set({ deletedAt: new Date() })
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
