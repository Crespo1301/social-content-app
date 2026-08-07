# Changelog

All notable changes to this project should be documented in this file.

## [Unreleased]

### Branch hygiene pass (Claude, 2026-08-07, branch `redesign-ios-v1`)

Reviewed and reverted stray tooling drift found in the working tree (`package.json`, `package-lock.json`, `.mcp.example.json`): `animejs` and `shadcn` had been added as dependencies but are unused anywhere in `src/` (no imports, no `components.json`), and `.mcp.example.json` had picked up BOM/CRLF corruption plus an unused `google-analytics` MCP entry. This is a private, single-user internal tool — none of the three currently serve a real need, so all three were reverted rather than kept. No app code, Supabase auth/RLS path, or demo mode touched. `npm run lint` and `npm run build` verified clean after the revert.

### 0.3.0 — iOS-native redesign + CSolutions branding (Claude, branch `redesign-ios-v1`)

Ground-up redesign for ease of use, built and verified in **demo mode** (no backend cost incurred). Supersedes the interim refinement pass. Intended as the basis for Codex's **v1.0.0** public launch once Supabase is wired (see HANDOFF "Supabase upgrade & wiring guide").

**Information architecture**
- Replaced the single confusing scroll-everything page with an iOS-native **tabbed app shell**: bottom tab bar (Library · center Add · Profile) on mobile, inline top tabs on desktop, sticky compact header.
- New **Library** view (large title, summary line, search-first sticky filter bar, result count, distinct empty states), **Profile** view (grouped iOS settings: Identity / Posting defaults / Preferences + help steps + legal links + sign-out).
- Create/edit now opens a **full-screen composer sheet** (caption-first, scroll-locked, focus-managed, slide-up, safe-area aware). Filters/sort open in a **bottom sheet**.

**Branding (CSolutions)**
- Real CSolutions logo (`public/CSolutions-Logo.png`) via `BrandMark`, replacing the decorative "sparkle" glyph.
- Retuned the entire token system to CSolutions **ocean-blue** (`#2699c2`) + iOS-native neutral surfaces, light & dark. Flat brand buttons (removed the blue→pink gradient). **Inter** font. PWA theme-color + apple-web-app meta.
- **All icons are concrete/meaningful** — removed every `Sparkles`/`WandSparkles` (no "AI diamonds" or floating orbs), per client direction.

**Full login (UI scaffolded; provider config deferred to Codex)**
- Redesigned login: email + password (sign in / create account toggle), magic link, **Google** and **Apple** OAuth buttons. Auth callback now redirects to `/login?error=` on failed/expired code instead of dropping users on `/vault`.

**Correctness / quality**
- Fixed a **theme-toggle hydration mismatch** (mount-gated icon + `mounted` flag in the theme provider) and demo-mode SSR/localStorage mismatch (state seeds from server, hydrates after mount).
- Moved component classes into `@layer components` so Tailwind utility overrides (`pl-`, `px-`, `h-`/`w-`) work — fixes input icon/placeholder overlap app-wide.
- Demo mode, posts/profile CRUD, and the Supabase API/RLS path are unchanged. Lint + `next build` clean; verified via Playwright at 390/1280/1920 in light & dark, 0 hydration errors.

## [0.2.2] - 2026-05-30

- added a committed `vercel.json` with `framework: nextjs` so Vercel no longer treats the project as a generic "Other" app
- locked the framework fix into the repo to prevent future production 404s caused by project preset drift

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
