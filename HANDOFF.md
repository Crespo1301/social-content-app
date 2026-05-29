# HANDOFF.md

## Current State (v0.1.0 - 2026-05-29)

The repo started empty and now has a first working Social Vault scaffold. This `v0.1.0`
release is the first usable product baseline.

Current implementation includes:

- Next.js 16 app scaffolded cleanly
- mobile-first vault UI
- demo mode with local browser persistence
- Supabase-ready mode with auth callback flow and CRUD API routes
- seeded example posts
- modal create/edit flow
- one-tap copy button
- filter/search card library
- repo-local AI skills and MCP script setup

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

1. wire a real Supabase project and test private auth end to end
2. run `supabase/schema.sql` and `supabase/seed.sql`
3. validate the protected route behavior in deployed mode
4. refine filtering UX with real usage
5. consider separate hashtag-copy and full-package-copy flows

## Important Architecture Notes

- `src/components/vault/vault-app.tsx` is the main operator experience
- demo mode is intentional, not accidental
- production persistence should flow through `social_posts`
- `middleware.ts` only matters when Supabase env exists

## Files To Read First

1. `README.md`
2. `PRODUCT.md`
3. `DESIGN.md`
4. `src/lib/types.ts`
5. `supabase/schema.sql`
