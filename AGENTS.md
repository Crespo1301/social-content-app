# AGENTS.md

## Repo Purpose

`social-content-app` is a private internal-use Social Vault for Carlos / CSolutions. It is optimized for daily caption management on phone and laptop, not for public multi-tenant SaaS.

## Current Product Priorities

1. fast copy-to-clipboard workflow
2. strong mobile filtering/search
3. lightweight private auth
4. safe Supabase-backed persistence
5. practical daily operator experience

## Core App Model

- `SocialPost` in `src/lib/types.ts` is the canonical content entity
- the main table is `social_posts`
- production mode uses Supabase auth + DB
- demo mode uses seeded sample posts plus browser local storage

## Key Files

- `src/app/vault/page.tsx`
- `src/components/vault/`
- `src/app/api/posts/`
- `src/lib/types.ts`
- `supabase/schema.sql`
- `HANDOFF.md`

## Guidance

- do not let the app drift into a generic admin dashboard
- mobile ergonomics matter as much as desktop
- preserve one-tap copy speed
- keep search/filter behavior obvious and forgiving
- prefer clean, centralized product decisions over scattered one-off logic

## Visual QA

Use the workspace runner at `/home/cresp3/scripts/visual-check.sh` after any layout, responsive, spacing, animation, or visual-polish change. Start the local dev server, capture mobile and desktop screenshots into `.visual-checks/`, and inspect the rendered pixels before calling the work done. See `VISUAL-QA.md`.
