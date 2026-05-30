# Changelog

All notable changes to this project should be documented in this file.

## [Unreleased]

## [0.2.1] - 2026-05-30

- fixed the Vercel deployment blocker by inlining the Supabase session refresh logic directly inside `middleware.ts`
- removed middleware dependence on local alias imports so the deployed Edge bundle stays compatible

## [0.2.0] - 2026-05-30

- added a real product shell with top nav, welcome state, tutorial cards, and CSolutions framing
- added dark/light theme support plus a cookie notice and legal pages for privacy, terms, and cookies
- added profile persistence scaffolding with editable display name, avatar URL, bio, default city, account type, and theme
- added platform quick-filter pills, sort controls, platform icons, and hashtag-copy support
- added profile API route, sign-out route, and Supabase `profiles` table/RLS schema updates
- hardened post/profile APIs with zod input validation

## [0.1.0] - 2026-05-29

- scaffolded the repo as a Next.js 16 TypeScript app
- added mobile-first Social Vault MVP UI
- added demo mode with local seeded post persistence
- added Supabase-ready auth callback and CRUD API route scaffolding
- added example post data, filters, copy workflow, and modal composer
- added project docs, handoff files, and shared repo-local AI tooling structure
