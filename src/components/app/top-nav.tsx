"use client";

import Link from "next/link";
import { LogOut, Moon, Sparkles, Sun } from "lucide-react";
import { AccountAvatar } from "@/components/app/account-avatar";
import { useTheme } from "@/components/app/theme-provider";
import { UserProfile, VaultMode } from "@/lib/types";

export function TopNav({
  mode,
  profile,
}: {
  mode: VaultMode;
  profile: UserProfile;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:var(--card)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-strong)] text-white shadow-[0_12px_28px_var(--accent-shadow)]">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--ink)]">Social Vault</p>
            <p className="text-xs text-[var(--muted)]">A CSolutions private content workflow app</p>
          </div>
        </div>

        <nav className="hidden items-center gap-5 text-sm font-medium text-[var(--soft-ink)] md:flex">
          <a href="#overview">Overview</a>
          <a href="#library">Library</a>
          <a href="#tutorial">Tutorial</a>
          <a href="#profile">Profile</a>
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleTheme} className="vault-icon-button" aria-label="Toggle theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="hidden items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 sm:flex">
            <AccountAvatar name={profile.displayName} avatarUrl={profile.avatarUrl} size="sm" />
            <div className="text-left">
              <p className="text-sm font-semibold text-[var(--ink)]">{profile.displayName}</p>
              <p className="text-xs text-[var(--muted)]">{profile.email || "Demo mode"}</p>
            </div>
          </div>

          {mode === "supabase" ? (
            <form action="/auth/signout" method="post">
              <button type="submit" className="vault-action">
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          ) : (
            <Link href="/login" className="vault-action">
              Demo mode
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
