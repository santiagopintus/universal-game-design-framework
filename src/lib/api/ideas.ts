import 'server-only';
import { z } from 'zod';
import type { Idea } from '@/db/schema';
import type { SavedIdea } from '@/lib/ideaStorage';

export const ideaValuesSchema = z.record(z.string(), z.string());

export const saveIdeaBodySchema = z.object({
  id: z.string().uuid(),
  ideaTitle: z.string(),
  values: ideaValuesSchema,
});

export const bulkImportBodySchema = z.array(
  z.object({
    id: z.string().uuid(),
    ideaTitle: z.string(),
    values: ideaValuesSchema,
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
  }),
);

export function toSavedIdea(row: Idea): SavedIdea {
  return {
    id: row.id,
    ideaTitle: row.ideaTitle,
    updatedAt: row.updatedAt.toISOString(),
    values: row.values,
    deletedAt: row.deletedAt ? row.deletedAt.toISOString() : null,
  };
}
