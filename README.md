# Social Content App

Private mobile-friendly Social Vault web app for storing, searching, filtering, and quickly copying social captions across personal and business accounts.

## Product Role

This repo is the source-of-truth for a private internal-use content workflow app. The goal is to replace scattered Google Docs / Drive caption storage with a faster, cleaner mobile-first vault that works on phone and laptop.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase for auth + persistence
- Vercel deployment target

## Current MVP Direction

Primary workflow:

- store captions for multiple platforms
- search across caption text, tags, notes, campaigns, names, media references, and locations
- filter by platform, account type, category, city, campaign, and status
- copy a caption in one tap
- create, edit, and delete posts
- keep media references and posting notes attached to each post

The app currently supports:

- mobile-first Social Vault shell with welcome state, top navigation, and tutorial guidance
- demo mode with local device persistence when Supabase env is missing
- Supabase-backed private mode with magic-link auth, profile editing, and protected CRUD endpoints
- dark and light theme support
- platform filters with icon-based quick picks and sorting
- profile customization for display name, avatar URL, bio, default city, and default account type
- legal pages for privacy, terms, and cookies
- starter seeded example posts

## Local Development

```bash
npm install
npm run dev
```

Verification:

```bash
npm run lint
npm run build
```

## Environment

Copy the env file and fill it in when you are ready to connect Supabase:

```bash
cp .env.example .env.local
```

Required for production/private mode:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Without those, the app runs in **demo mode** with local sample-post persistence in browser storage.

## Main Editing Surfaces

- `src/app/vault/page.tsx` - protected/main vault entry
- `src/components/vault/` - cards, filters, composer dialog, copy flow
- `src/components/app/` - top nav, theme, avatar, cookies, footer
- `src/lib/sample-posts.ts` - starter seed examples for demo mode
- `src/lib/types.ts` - main app data model
- `src/app/api/posts/` - Supabase CRUD endpoints
- `src/app/api/profile/route.ts` - profile persistence endpoint
- `supabase/schema.sql` - canonical table + RLS schema
- `supabase/seed.sql` - starter SQL seed for real Supabase projects

## Shared Docs

- `PRODUCT.md`
- `DESIGN.md`
- `HANDOFF.md`
- `CHANGELOG.md`
- `AI-WORKFLOW.md`
- `SECURITY-CHECKLIST.md`
- `CLAUDE.md`
- `AGENTS.md`

## Working Rules

- keep the UI mobile-first and daily-use oriented
- prioritize search, filter, copy, and quick editing over dashboard chrome
- keep buyer-facing / operator-facing constants centralized where possible
- treat Supabase as the production persistence layer, but preserve demo mode as a practical local fallback
- update `CHANGELOG.md` and `HANDOFF.md` after meaningful work
