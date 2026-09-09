<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Project: Universal Game Design Framework

A guided questionnaire that helps designers ideate a game before writing a full GDD. The questionnaire itself lives in `src/components/Form/` (`MainForm` in `index.tsx`), built from two small components — `Section` (`FormSection.tsx`, a titled, bordered block) and `Field` (`Field.tsx`, a title + guiding question + free-text textarea, plus an AI-suggestion popover) — composed into 12 sections (Project Constraints, Game Concept, MDA Framework, Setting, Game Loop, Player Goals, Victory & Failure Conditions, Difficulty & Progression, Replayability, Core Design Principles, Success Criteria, Design Pillars). `src/components/Form/navConfig.ts` mirrors this structure for the progress sidebar and must stay in sync with the `Field` `name` props.

When extending the questionnaire:
- Keep new fields as `title` + `guide` pairs consistent with the existing `Field` component — don't introduce a differently-shaped field type without a reason.
- Group related fields under a `Section`, matching the numbered heading convention already in place.

## Accounts, persistence, and sync

A questionnaire's answers ("an idea") are `{ id, ideaTitle, values: Record<string, string>, updatedAt, deletedAt }`, defined as `SavedIdea` in `src/lib/ideaStorage.ts`. The app supports both anonymous and signed-in use:

- **Signed out (guest)**: ideas are stored only in `localStorage` (key `ugdf.ideas.v1`), exactly as before accounts existed. No network calls are made.
- **Signed in**: `src/lib/ideaStorage.ts`'s exported functions (`getAllIdeas`, `getIdea`, `saveIdea`, `softDeleteIdea`, `restoreIdea`, `deleteIdeaForever`) call the matching `/api/ideas*` route handlers (backed by Neon Postgres via Drizzle, see `src/db/schema.ts`) as the source of truth, then mirror results back into `localStorage` as an offline cache. All of these functions are `async` and take an `isSignedIn` boolean (get it from Clerk's `useAuth()` in the calling component).
- Sign-in is **never required** to use the app — it only unlocks cross-device sync. `src/proxy.ts` (Next.js's `middleware.ts` equivalent, see below) does not call `auth.protect()` on any page.
- Local ideas are **not** auto-uploaded on sign-in. `src/components/ImportLocalIdeas/index.tsx` shows an opt-in prompt on the Load screen when a signed-in user has local ideas and hasn't already been asked (tracked via a per-user `localStorage` flag) — only an explicit "Import" click calls `bulkImportLocalIdeas()`.
- Auth is Clerk (`@clerk/nextjs`); this SDK version is **Core 3** — use `<Show when="signed-in">` / `<Show when="signed-out">`, not the older `<SignedIn>`/`<SignedOut>` components, which don't exist in this version.
- The database is Neon Postgres via `drizzle-orm` (`src/db/index.ts`, schema in `src/db/schema.ts`). Run `npm run db:generate` after schema changes, `npm run db:migrate` to apply them. `DATABASE_URL` and Clerk's keys are server-only except `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — never prefix a secret with `NEXT_PUBLIC_`.

## Hosting

The app deploys to Vercel (not GitHub Pages / static export — that was removed). `src/proxy.ts` composes Clerk's `clerkMiddleware()` with next-intl's `createMiddleware()`, explicitly skipping the locale middleware for `/api/*` paths (next-intl's redirect logic otherwise 307s API routes, which have no locale prefix).
<!-- END:nextjs-agent-rules -->
