<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Project: Universal Game Design Framework

A guided questionnaire that helps designers ideate a game before writing a full GDD. The core of the app is `src/form.tsx`: a single long-form questionnaire built from two small components — `Section` (a titled, bordered block) and `Field` (a title + guiding question + free-text textarea) — composed into 12 sections (Project Constraints, Game Concept, MDA Framework, Setting, Game Loop, Player Goals, Victory & Failure Conditions, Difficulty & Progression, Replayability, Core Design Principles, Success Criteria, Design Pillars).

When extending the questionnaire:
- Keep new fields as `title` + `guide` pairs consistent with the existing `Field` component — don't introduce a differently-shaped field type without a reason.
- Group related fields under a `Section`, matching the numbered heading convention already in place.
- The app is currently presentational only (no state, persistence, or submission handling) — check with the user before adding form state/persistence rather than assuming it's wanted.
<!-- END:nextjs-agent-rules -->
