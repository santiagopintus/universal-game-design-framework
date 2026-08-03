# Universal Game Design Framework

A guided questionnaire for ideating games before writing a full Game Design Document (GDD). Instead of staring at a blank page, designers work through a structured set of prompts covering everything from project constraints to core design pillars — producing a clear, high-level foundation a GDD can be built on top of.

## What it is

The app (`src/form.tsx`) renders a single long-form questionnaire, organized into sections designers fill in one field at a time:

1. **Project Constraints** — budget, team size, technology, production scope
2. **Game Concept** — one-sentence pitch, concept summary
3. **MDA Framework** — Aesthetics, Mechanics, and Dynamics (Hunicke, LeBlanc & Zubek's model)
4. **Setting** — world, theme, environmental storytelling
5. **Game Loop** — core loop, session flow, long-term progression
6. **Player Goals** — short-, mid-, and long-term goals
7. **Victory & Failure Conditions**
8. **Difficulty & Progression** — learning curve, difficulty curve, mastery
9. **Replayability** — replay value, variability
10. **Core Design Principles** — guiding rules and trade-off resolution
11. **Success Criteria** — what confirms the design is working
12. **Design Pillars** — the non-negotiable identity of the game

Each field pairs a short **title** with a **guiding question** to prompt the designer's thinking, followed by a free-text area for their answer.

## Getting started

This is a [Next.js](https://nextjs.org) app. To run it locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint     # lint the project
```

## Stack

- [Next.js](https://nextjs.org) (App Router) with [next-intl](https://next-intl.dev/) for i18n
- React 19 + TypeScript
- [MUI](https://mui.com/) and Tailwind CSS for styling
- [Vercel Analytics](https://vercel.com/analytics)

## Project structure

- `src/form.tsx` — the questionnaire itself: `Field` and `Section` components composing the full framework
- `src/app/[locale]/` — localized routes (home page, projects)
- `src/app/` — root layout, sitemap, robots

> **Note:** This project uses a newer, breaking-change version of Next.js. Before making framework-level changes, check `node_modules/next/dist/docs/` for the relevant guide — APIs and conventions may differ from what you'd expect.
