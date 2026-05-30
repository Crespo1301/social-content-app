"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  text,
  label = "Copy caption",
  icon,
  tone = "primary",
}: {
  text: string;
  label?: string;
  icon?: React.ReactNode;
  tone?: "primary" | "default";
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);

    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={tone === "primary" ? "vault-action vault-action-primary" : "vault-action"}
    >
      {copied ? <Check size={16} /> : icon || <Copy size={16} />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
