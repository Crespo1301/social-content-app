import { getInitials } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element */

export function AccountAvatar({
  name,
  avatarUrl,
  size = "md",
}: {
  name: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dimension = size === "sm" ? "h-9 w-9 text-sm" : size === "lg" ? "h-16 w-16 text-lg" : "h-11 w-11 text-sm";

  if (avatarUrl) {
    const avatarAlt = `${name} avatar`;

    return (
      <img
        src={avatarUrl}
        alt={avatarAlt}
        className={`${dimension} rounded-full border border-[var(--line)] object-cover`}
      />
    );
  }

  return (
    <div
      className={`${dimension} inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-strong)] font-semibold text-[var(--ink)]`}
    >
      {getInitials(name)}
    </div>
  );
}
