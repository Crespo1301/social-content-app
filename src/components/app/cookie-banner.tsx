"use client";

import { useState } from "react";
import Link from "next/link";

const consentKey = "social-vault-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return !window.localStorage.getItem(consentKey);
  });

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(96vw,760px)] -translate-x-1/2 rounded-[24px] border border-[var(--line)] bg-[var(--card)] p-4 shadow-[0_22px_60px_var(--shadow)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--ink)]">Cookie notice</p>
          <p className="text-sm leading-6 text-[var(--soft-ink)]">
            Social Vault uses essential cookies and local storage for sign-in, theme, and draft workflow preferences.
            Read the <Link href="/cookies" className="font-semibold text-[var(--accent)]">cookie policy</Link>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(consentKey, "accepted");
            setVisible(false);
          }}
          className="vault-action vault-action-primary shrink-0 justify-center"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
