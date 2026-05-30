"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const consentKey = "social-vault-cookie-consent";

const consentListeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  consentListeners.add(onChange);
  return () => {
    consentListeners.delete(onChange);
  };
}

function getClientSnapshot() {
  return window.localStorage.getItem(consentKey) ? "accepted" : "pending";
}

// Server (and first client render) always sees "accepted" so nothing renders
// during hydration. After mount, useSyncExternalStore re-reads the real value.
function getServerSnapshot() {
  return "accepted";
}

function acceptConsent() {
  window.localStorage.setItem(consentKey, "accepted");
  consentListeners.forEach((listener) => listener());
}

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  if (consent === "accepted") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(96vw,760px)] -translate-x-1/2 rounded-[24px] border border-[var(--line)] bg-[var(--card)] p-4 shadow-[0_22px_60px_var(--shadow)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--ink)]">Cookie notice</p>
          <p className="text-sm leading-6 text-[var(--soft-ink)]">
            Social Vault uses essential cookies and local storage for sign-in, theme, and draft workflow preferences.
            Read the <Link href="/cookies" className="font-semibold text-[var(--accent)]">cookie policy</Link>.
          </p>
        </div>
        <button
          type="button"
          onClick={acceptConsent}
          className="vault-action vault-action-primary w-full shrink-0 justify-center sm:w-auto"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
