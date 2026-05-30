"use client";

import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import {
  signInWithPassword,
  signUpWithPassword,
  sendMagicLink,
  signInWithOAuth,
} from "@/app/login/actions";

type AuthMode = "signin" | "signup";

export function AuthForm({ initialMode }: { initialMode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const isSignIn = mode === "signin";

  return (
    <div className="mt-6 space-y-5 sm:mt-8">
      {/* Segmented toggle */}
      <div
        role="tablist"
        aria-label="Authentication method"
        className="grid grid-cols-2 gap-1 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={isSignIn}
          onClick={() => setMode("signin")}
          className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
            isSignIn
              ? "bg-[var(--card)] text-[var(--ink)] shadow-sm"
              : "text-[var(--soft-ink)]"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isSignIn}
          onClick={() => setMode("signup")}
          className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
            !isSignIn
              ? "bg-[var(--card)] text-[var(--ink)] shadow-sm"
              : "text-[var(--soft-ink)]"
          }`}
        >
          Create account
        </button>
      </div>

      {/* Email + password form */}
      <form
        action={isSignIn ? signInWithPassword : signUpWithPassword}
        className="space-y-4"
      >
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--ink)]">Email address</span>
          <div className="relative">
            <Mail
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              type="email"
              name="email"
              className="vault-input pl-11"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
            />
          </div>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--ink)]">Password</span>
          <div className="relative">
            <Lock
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              type="password"
              name="password"
              className="vault-input pl-11"
              placeholder={isSignIn ? "Your password" : "At least 8 characters"}
              autoComplete={isSignIn ? "current-password" : "new-password"}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              minLength={isSignIn ? undefined : 8}
              required
            />
          </div>
          {!isSignIn ? (
            <span className="block text-xs leading-5 text-[var(--muted)]">
              Use at least 8 characters.
            </span>
          ) : null}
        </label>

        <button
          type="submit"
          className="vault-action vault-action-primary w-full justify-center"
        >
          {isSignIn ? "Sign in" : "Create account"}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-[var(--line)]" />
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          or
        </span>
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>

      {/* OAuth providers */}
      <div className="space-y-3">
        <form action={signInWithOAuth}>
          <input type="hidden" name="provider" value="google" />
          <button type="submit" className="vault-action w-full justify-center">
            <GoogleIcon />
            Continue with Google
          </button>
        </form>
        <form action={signInWithOAuth}>
          <input type="hidden" name="provider" value="apple" />
          <button type="submit" className="vault-action w-full justify-center">
            <AppleIcon />
            Continue with Apple
          </button>
        </form>
      </div>

      {/* Magic link secondary option */}
      <form action={sendMagicLink} className="space-y-3 border-t border-[var(--line)] pt-5">
        <p className="text-sm font-medium text-[var(--ink)]">
          Prefer not to use a password?
        </p>
        <label className="block space-y-2">
          <span className="sr-only">Email for magic link</span>
          <div className="relative">
            <Mail
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              type="email"
              name="email"
              className="vault-input pl-11"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
            />
          </div>
        </label>
        <button type="submit" className="vault-action w-full justify-center">
          Email me a link instead
        </button>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.37 1.43c.06.84-.27 1.66-.82 2.26-.58.62-1.5 1.1-2.4 1.03-.07-.83.32-1.68.85-2.22.59-.6 1.6-1.05 2.37-1.07zM19.6 17.1c-.4.93-.6 1.34-1.12 2.16-.73 1.14-1.76 2.55-3.04 2.56-1.14.01-1.43-.74-2.97-.73-1.54.01-1.86.75-3 .74-1.28-.01-2.26-1.29-2.98-2.42-2.04-3.2-2.26-6.95-1-8.95.9-1.42 2.31-2.25 3.64-2.25 1.36 0 2.21.74 3.34.74 1.09 0 1.76-.74 3.33-.74 1.19 0 2.45.65 3.35 1.77-2.94 1.61-2.46 5.82.45 6.87z" />
    </svg>
  );
}
