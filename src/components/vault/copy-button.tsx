"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  text,
  label = "Copy caption",
  copiedLabel = "Copied",
  icon,
  tone = "primary",
  className = "",
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  icon?: React.ReactNode;
  tone?: "primary" | "default";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard unavailable (insecure context, denied permission, demo env) — fail quietly.
    }
  }

  const base = tone === "primary" ? "vault-action vault-action-primary" : "vault-action";
  const copiedTint = copied && tone !== "primary" ? "border-[var(--success)] text-[var(--success)]" : "";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      data-copied={copied || undefined}
      className={`${base} ${copiedTint} ${className}`}
    >
      {copied ? <Check size={16} /> : icon || <Copy size={16} />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
