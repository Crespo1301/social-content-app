# HANDOFF.md

## Current State (v0.2.1 - 2026-05-30)

The repo has moved past the initial scaffold into a more complete private product shell. This
`v0.2.1` patch keeps the `v0.2.0` product work intact and fixes the Vercel deployment blocker in middleware.

Current implementation includes:

- protected login flow with better onboarding and sign-out path
- top navigation, welcome shell, and tutorial surface
- demo mode with local browser persistence
- Supabase-ready mode with auth callback flow and CRUD API routes
- profile model and profile editing path
- dark/light theme support
- legal pages and cookie notice
- platform-aware filtering, sorting, and icon treatment
- seeded example posts and modal create/edit flow
- repo-local AI skills and MCP script setup
- edge-safe middleware that no longer depends on local alias imports for session refresh during deploy

## MVP Status

Implemented:

- searchable post library
- filter controls
- mobile-friendly card layout
- copy-to-clipboard
- create/edit/delete in demo mode
- Supabase CRUD path scaffolded
- simple private auth flow scaffolded

Still needed / next:

1. wire a real Supabase project and test private auth/profile flow end to end
2. run the updated `supabase/schema.sql` before relying on profile editing
3. validate remote avatar URLs and live auth cookies in deployed mode
4. consider team/member roles if this expands beyond single-user internal use
5. add richer content packaging views if daily workflow needs them

## Important Architecture Notes

- `src/components/vault/vault-app.tsx` is the main operator experience
- demo mode is intentional, not accidental
- production persistence should flow through `social_posts` and `profiles`
- `middleware.ts` only matters when Supabase env exists
- theme state is driven from the client provider and can be persisted through profile defaults

## Files To Read First

1. `README.md`
2. `PRODUCT.md`
3. `DESIGN.md`
4. `src/lib/types.ts`
5. `supabase/schema.sql`
