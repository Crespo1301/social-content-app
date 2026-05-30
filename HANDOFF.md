# HANDOFF.md

## iOS-Native Redesign — branch `redesign-ios-v1` (Claude, 2026-05-30)

**Status:** built + verified in **demo mode**, pushed to `redesign-ios-v1` with a PR open. **NOT** merged or deployed to production. This is the basis for Codex's **v1.0.0 public launch**. No Supabase project was created and no cost was incurred (user paused on the $25/mo Pro upgrade). Lint + `next build` pass; Playwright-verified at 390/1280/1920 in light & dark with 0 hydration errors.

### 1. What this delivers
- iOS-native tabbed shell (bottom tab bar mobile / top tabs desktop), Library + Profile views, full-screen composer sheet, filter bottom-sheet. See CHANGELOG `0.3.0` for the full list.
- CSolutions branding: real logo, ocean-blue token system (light+dark), Inter, flat buttons, concrete icons only (no sparkle/orb glyphs).
- Full-login **UI** (email+password, magic link, Google, Apple) — server actions wired, providers NOT yet configured.
- Demo mode, posts/profile CRUD, Supabase API routes, and RLS schema are unchanged from v0.2.2.

### 2. What still needs review / finishing (good Codex tasks)
- **Composer close has no exit animation** (slides in, vanishes out) — flagged by the polish agent; optional.
- **Demo content** is device-local; on a shared/preview URL each visitor sees their own seeded copy. Expected for demo mode.
- **Legal footer** is gone from the app shell (iOS pattern); legal links now live in Profile. Confirm that satisfies compliance needs.
- A couple of subagent judgment calls to eyeball in dark mode on a narrow viewport (profile field grouping).

### 3. Security / product notes
- No security regressions: auth/RLS path untouched; auth callback hardened to redirect to `/login?error=` on failed code exchange; no credentials logged.
- OAuth actions fail gracefully (route to `?error=`) when providers aren't configured — they won't crash before Codex sets them up.

### 4. ⭐ Supabase upgrade & wiring guide (do this for v1.0.0 / "going live")

The app runs in **demo mode** until these env vars exist. Two backend options:

**Option A — free, no isolation:** reuse the existing `CSolutions` Supabase project. **Option B — recommended for a real product:** dedicated project (needs Pro, ~$25/mo, because the `Crespo1301` account is at the 2-project free cap).

Steps for a dedicated project (Option B):
1. **Create the project.** Supabase dashboard → org `Csolutions-Crespo` → New project `social-vault`, region `us-east-1`. (Requires upgrading the org to **Pro** first, or pausing `inventory-app`/`CSolutions` to free a free-tier slot.)
2. **Apply the schema.** Run `supabase/schema.sql` (tables `profiles` + `social_posts`, triggers, and RLS policies) in the SQL editor, then optionally `supabase/seed.sql`.
3. **Get keys.** Project Settings → API: copy the **Project URL** and **anon/publishable key**.
4. **Set env** (locally `.env.local`, and in Vercel → project `social-content-app` → Settings → Environment Variables for Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
   With these present, `src/lib/config.ts` flips `vaultMode` to `supabase` and the login screen shows the real auth forms.
5. **Enable auth providers** (Authentication → Providers):
   - **Email**: enable; decide whether "Confirm email" is on (the sign-up flow handles both — see `src/app/login/actions.ts`).
   - **Google**: add OAuth client ID + secret.
   - **Apple**: add Service ID, Team ID, Key ID, signing key.
6. **URL configuration** (Authentication → URL Configuration): set **Site URL** to the production domain and add **Redirect URLs**: `https://<prod-domain>/auth/callback` and `http://localhost:3000/auth/callback`. Both magic-link and OAuth depend on this.
7. **Set the Supabase Auth password policy** to match the app's 8-char minimum.
8. **Verify**: sign up, confirm email if enabled, sign in, create/edit/delete a post, edit profile — confirm rows are user-scoped (RLS).
9. **Launch**: merge `redesign-ios-v1` → `main`, let Vercel build, then promote the deployment to Production and tag `v1.0.0`.

---

## Claude Design/Product Refinement Pass (Unreleased, on top of v0.2.2 - 2026-05-30) — superseded by the redesign above

This pass is committed to the working tree but **not** released, tagged, or pushed — release closeout is Codex's. Lint and `next build` both pass clean. Verified visually with Playwright at 390px, 1024px, 1280px, and 1920px.

### 1. What changed (9 files, all design/UX — no API, schema, auth, or demo-mode logic touched)

- `src/components/vault/filter-bar.tsx` — **rebuilt**. The old "Filter and sort" sticky module was tall enough to cover most captions when pinned. Now: compact search-first bar (always-visible search + single horizontally-scrollable platform-pill row), advanced filters + sort in an on-demand overlay popover (outside-click / Done / Esc to close), active-filter count badge, conditional Reset, inline search clear. Sticky offset uses the new `--nav-height` token.
- `src/components/vault/vault-app.tsx` — library grid rebalanced (`minmax(0,1.55fr) / minmax(340px,0.95fr)`), two-column profile form, post result count, distinct empty-vault vs no-match states, mobile "New post" FAB, 2-col hero stat chips on mobile, `2xl:max-w-[90rem]`.
- `src/components/vault/post-card.tsx` — dark-mode `bg-white` bug fixed (tokens), calm hover lift (reduced-motion safe), "Copy hashtags" hidden when no tags.
- `src/components/vault/copy-button.tsx` — clipboard try/catch guard, subtler copied feedback, aria-live.
- `src/app/globals.css` — added `--nav-height: 4.25rem` token.
- `src/components/app/top-nav.tsx`, `src/components/app/site-footer.tsx` — `2xl:max-w-[90rem]` to match main; footer spacing + version line.
- `src/app/login/page.tsx` — responsive headline/spacing, mobile email input attrs.
- `src/components/app/cookie-banner.tsx` — hydration-safe via `useSyncExternalStore`.

### 2. What still needs review

- Visual QA in a real browser on an actual phone (Playwright shots look good but confirm the filter popover height on small Android viewports and the FAB vs. cookie-banner overlap at the bottom edge).
- Dark mode pass over the rebuilt filter popover and the 2-col profile form (logic is token-based, but eyeball it).
- Confirm the `--nav-height: 4.25rem` value still matches the nav if nav padding/height ever changes.

### 3. Security / product concerns

- **No security issues found.** API routes (`/api/posts`, `/api/posts/[id]`, `/api/profile`) all call `auth.getUser()`, scope mutations with `.eq("user_id", user.id)`, validate with zod, and RLS in `schema.sql` enforces per-user isolation independently. This pass did not modify any of that.
- Pre-existing note: `vault-action-primary` uses a blue→pink gradient, which slightly conflicts with DESIGN.md's "avoid decorative gradients." Left intact as intentional CSolutions brand framing — flag for a design call, not a bug.
- Footer version string `v0.2.2` is hardcoded; will go stale on the next release. Consider sourcing from `package.json` / `NEXT_PUBLIC_APP_VERSION`.

### 4. Recommended next implementation step

- Decide whether the workspace/profile panel should remain a permanent library sidebar or move into a dedicated `/profile` route or modal — even widened, it competes with the daily search→copy flow. If it stays, persist the filter popover open/closed state. Then proceed with the existing "wire a real Supabase project" step below.

---

## Current State (v0.2.2 - 2026-05-30)

The repo has moved past the initial scaffold into a more complete private product shell. This
`v0.2.2` patch keeps the `v0.2.0` and `v0.2.1` work intact and locks the Vercel framework preset into source control.

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
- committed `vercel.json` declaring the project as `nextjs`, so Vercel does not fall back to the "Other" preset

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
