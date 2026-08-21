# AI Co-Pilot Roadmap

The Universal Game Design Framework is evolving from a static ideation questionnaire into an AI-Co-Pilot suite for Game Directors. This document is the living architecture and integration plan for that effort: the tech/stack decisions, a status tracker for each planned feature, and the sequencing we follow as we build one feature at a time.

**Constraints that shape every feature below:**
- **Zero cost.** No paid external endpoints, no local model hosting (Ollama etc. is out of scope).
- **SDK:** the official [`@google/genai`](https://www.npmjs.com/package/@google/genai) library.
- **Model:** `gemini-3.5-flash-lite` (chosen for Feature 1 — see note below; the originally-planned `gemini-2.5-flash` returned a `404 NOT_FOUND` from the API: "no longer available to new users").
- **Where AI logic lives:** entirely inside Next.js App Router **Route Handlers** (`src/app/api/**/route.ts`). No AI calls from client components — the client only calls our own API routes.

> ⚠️ **Known deployment gap, discovered while building Feature 1:** `next.config.ts` has `output: 'export'` and the app deploys as a static site to GitHub Pages (`.github/workflows/nextjs.yml` uploads `./out`, with no Node server). A production static export of this app produces **no `out/api` directory at all** — Route Handlers are silently dropped, confirmed by inspecting the build output. The route works correctly under `next dev` (used for all testing below) but will 404 if `out/` is deployed to GitHub Pages as-is. Before Feature 1 can work in production, we need a decision on where the API routes actually run — e.g. moving hosting to Vercel (native Next.js API route support, still free tier), or standing up a separate small serverless host just for `/api/ai/*` and calling it cross-origin from the static GitHub Pages site. This is unresolved and out of scope of the code changes made so far.

## Tech & Stack Integration

| Concern | Current state | What's needed |
|---|---|---|
| AI SDK | `@google/genai` installed (`^2.18.0`) | — |
| Model access | `gemini-3.5-flash-lite`, called server-side only | — |
| Env vars | `.env` already had `GEMINI_API_KEY` set (gitignored); `.env.example` added | — |
| API routes | `src/app/api/ai/suggest/route.ts` live | Each future feature gets its own route under `src/app/api/ai/*` |
| Prompt context | No "flatten all fields" helper exists | Reuse the section→group→field walk pattern already implemented in `src/lib/exportIdea.ts` (`buildJsonData`/`buildMarkdown`) against `FORM_SCHEMA` (`src/lib/formSchema.ts`) |
| Idea state | `SavedIdea.values: Record<string, string>` in `src/lib/ideaStorage.ts` (localStorage only, no server persistence) | Feed `values` into prompt-building; no schema changes needed |
| Locale | `next-intl`, EN/ES, `useLocale()` client-side | Pass the active locale to every AI route so responses match the questionnaire's language |

This keeps the AI features additive: no changes to how ideas are stored, no new state management library, and no restructuring of the existing 12-section form.

## Feature Status

| # | Feature | Status | Depends on |
|---|---|---|---|
| 1 | Context-Aware Field Suggestions | **Done** (dev-tested; production hosting gap open, see note above) | `@google/genai` install, `GEMINI_API_KEY` |
| 2 | Project Scope & Feasibility Audit Engine | Not Started | Feature 1's prompt/context-builder pattern |
| 3 | Design Pillar Consistency Watchdog | Not Started | Feature 1's prompt/context-builder pattern |
| 4 | Generative Game Loop Flow Visualizer | Not Started | Feature 1's pattern; Vercel AI SDK vs. React-canvas evaluation |

Update this table as each feature moves through `Not Started → In Progress → Done`.

---

## Feature 1: Context-Aware Field Suggestions

**Status: Done (implemented, lint/build clean, dev-tested end-to-end in both locales and both temperature modes). Production hosting gap open — see the warning at the top of this doc.**

### Implementation notes (what was actually built)
- **API:** `ai.models.generateContent()` (stable `@google/genai` API, not the newer Interactions API — chosen after `ai.google.dev` docs on the Interactions API gave inconsistent JS syntax across sources).
- **Model:** `gemini-3.5-flash-lite`. `gemini-2.5-flash` (originally planned) returned `404 NOT_FOUND: "This model models/gemini-2.5-flash is no longer available to new users"` when actually called with the real `GEMINI_API_KEY`. `gemini-3.6-flash` (Google's suggested replacement) was tried and worked, but the user asked to switch to `gemini-3.5-flash-lite` for its low latency/cost profile — confirmed working.
- **Thinking level:** always `ThinkingLevel.MEDIUM` (fixed, not user-selectable).
- **Temperature:** user-selectable Conservative/Creative toggle per field, `0.4` / `1.3`.
- **Files added:** `src/lib/aiContext.ts` (`findFieldSchema`, `resolveMessage`, `buildIdeaContext` — reusable by Features 2/3), `src/app/api/ai/suggest/route.ts`, `.env.example`.
- **Files edited:** `src/components/Form/Field.tsx` (Conservative/Creative toggle + Get Suggestions button + suggestion chips, additive props only), `src/components/Form/index.tsx` (`fetchSuggestions` + `fieldProps(key)` helper wired into all 46 `<Field>` call sites), `src/messages/en.json` / `es.json` (`form.ai.*` keys).
- **Verified:** `npm run build` succeeds (route registered as `ƒ /api/ai/suggest`, dynamic); `npm run lint` shows only 2 pre-existing errors unrelated to this change (`Form/index.tsx:42`, `LoadScreen/index.tsx:24`, both `react-hooks/set-state-in-effect` from before this feature). Manually tested via `curl` against `next dev`: valid suggestions in English and Spanish, both temperature modes, and 400s on invalid `fieldValueKey`/`locale`.

### Original plan (for reference)

### Goal
A "Get Suggestions" action beneath a field's textarea. On click, it calls an API route that reads the *entire* idea's current state (all 12 sections) for context and returns 3 cohesive, tactical mechanics/twists relevant to that specific field, in the active locale. Clicking a suggestion appends it to the field's text.

### API route
`src/app/api/ai/suggest/route.ts` — `POST`

**Request body:**
```json
{
  "fieldValueKey": "mda.mechanics.coreMechanics",
  "locale": "en",
  "values": { "concept.pitch": "...", "mda.mechanics.coreMechanics": "...", "...": "..." }
}
```

**Server logic:**
1. Look up the target field's `title`/`guide` via `FORM_SCHEMA` (`src/lib/formSchema.ts`) using `fieldValueKey`.
2. Build compact prompt context by walking `FORM_SCHEMA` against `values`, skipping empty fields — same section→group→field traversal already used in `src/lib/exportIdea.ts`.
3. Call `@google/genai` with `gemini-2.5-flash`, instructing it to return exactly 3 short, tactical suggestions for the target field, consistent with everything already defined, in the requested `locale`. Prefer structured output (`responseSchema`) if the SDK version supports it for this model; otherwise parse a constrained plain-text format.
4. Return `{ "suggestions": string[] }` (length 3) or `{ "error": string }` with an appropriate status code.

### Client changes
- `src/components/Form/Field.tsx` — add an optional `onAiSuggest?: () => Promise<string[]>` prop plus local UI state (loading / 3 suggestion chips / error). This is additive: no restructuring of the existing label → guide → textarea layout.
- `src/components/Form/index.tsx` — extend the existing `field(key)` helper (or a small new hook) with a `fetchSuggestions(key)` that `POST`s to `/api/ai/suggest` with `values: formState.values`, `fieldValueKey: key`, and the current locale. Clicking a suggestion reuses the existing `onChange` from `field(key)` to append text.

### i18n
Add `form.ai.*` keys (button label, loading state, error state) to `src/messages/en.json` and `src/messages/es.json`, mirroring the existing `form.*` key conventions. Locale for the API call comes from next-intl's `useLocale()`.

### Cost / rate-limit notes
Disable the button while a request is in flight to avoid duplicate calls. No response caching in v1; worth revisiting if usage approaches free-tier limits.

### Open questions to resolve before coding
- Suggestion tone/length constraints (a hard character cap? style guidance in the prompt?).
- Full 12-section context vs. section-scoped context only, trading relevance against prompt size/cost.
- Structured JSON output vs. freeform text parsed into 3 lines — depends on current `@google/genai` structured-output support for `gemini-2.5-flash`.

---

## Feature 2: Project Scope & Feasibility Audit Engine

**Status: Not Started — scoped outline.**

### Goal
A summary dashboard module on the export screen (near the existing export menu in `src/components/Form/index.tsx`). The AI reads scope-heavy sections (MDA, Game Loop, Victory & Failure) and checks them against Section 1 (Budget, Team Size, Technology, Production Scope) to produce a risk index, rough timeline metric, and scope warnings.

### Open questions
- What is the "risk index" actually computed from — a single free-form AI judgment, or a rubric/scored prompt the model fills in?
- One AI call per audit, or several smaller calls (one per risk dimension)?
- Where exactly does the dashboard module render — inline above the export menu, or a separate route/modal?

Full architecture (API route shape, prompt design, component placement) to be written when this feature starts, reusing Feature 1's context-building pattern.

---

## Feature 3: Design Pillar Consistency Watchdog

**Status: Not Started — scoped outline.**

### Goal
A sticky validation component that checks structural entries (Section 7: Victory/Failure Conditions, and other gameplay-defining sections) against Section 12 (Design Pillars, including "Things This Game Should Never Become") and surfaces compliance markers or contradiction warnings.

### Open questions
- Real-time/debounced evaluation on every edit, vs. on-demand ("Check consistency" button)?
- Where does the sticky component mount — global (visible across all sections) or scoped to relevant sections only?
- How are findings surfaced — inline per-field annotations vs. a single global banner/panel?

Full architecture to be written when this feature starts, reusing Feature 1's context-building pattern.

---

## Feature 4: Generative Game Loop Flow Visualizer

**Status: Not Started — scoped outline.**

### Goal
Inside Section 5 (Game Loop), turn the free-text loop descriptions (`gameLoop.coreLoop`, `sessionFlow`, `longTermProgression`) into a clean, interactive visual block/topology diagram.

### Open questions
- Vercel AI SDK streaming output vs. a JSON-schema response rendered on a custom React canvas — which fits better with the zero-new-heavy-dependency goal?
- Diagram/canvas library choice — none is currently in `package.json`, so this feature is the most likely to need a new client dependency.
- Does the visualization regenerate live as text changes, or only on an explicit "Visualize" action?

Full architecture to be written when this feature starts, reusing Feature 1's context-building pattern.

---

## Integration / Rollout Plan

We build, test, and commit **one feature at a time**, in this order:

1. **Feature 1** — install `@google/genai`, add `.env.example` + `GEMINI_API_KEY`, build `src/app/api/ai/suggest/route.ts`, update `Field.tsx`/`Form/index.tsx`, add `form.ai.*` i18n strings, manually test in dev (both locales), commit.
2. **Feature 2** — reuse Feature 1's context-building + Gemini-call pattern, build the audit dashboard, test, commit.
3. **Feature 3** — reuse the pattern, build the watchdog component, test, commit.
4. **Feature 4** — reuse the pattern, evaluate Vercel AI SDK vs. canvas rendering, build the visualizer, test, commit.

After each step, update the **Feature Status** table above so this document stays an accurate, current tracker rather than a one-time proposal.
