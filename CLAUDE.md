# CLAUDE.md

Read these first:

1. `README.md`
2. `PRODUCT.md`
3. `DESIGN.md`
4. `HANDOFF.md`
5. `src/lib/types.ts`
6. `supabase/schema.sql`

## Product Direction

This is a private Social Vault for daily caption workflow. It should feel fast, practical, and polished on mobile, not like a bloated admin tool.

## Priorities

- quick search
- quick filtering
- one-tap copy
- fast create/edit flow
- mobile-first comfort
- production-safe Supabase path

## Working Expectations

- keep the UI lightweight
- preserve demo mode unless intentionally replacing it
- use repo-local skills and MCP where helpful
- update `docs/claude-track-record.md` or `HANDOFF.md` if you make major decisions

## Visual QA

Use the workspace runner at `/home/cresp3/scripts/visual-check.sh` after any layout, responsive, spacing, animation, or visual-polish change. Start the local dev server, capture mobile and desktop screenshots into `.visual-checks/`, and inspect the rendered pixels before calling the work done. See `VISUAL-QA.md`.
