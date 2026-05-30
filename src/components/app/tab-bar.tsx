"use client";

import { LayoutGrid, Plus, UserRound } from "lucide-react";

export type VaultTab = "library" | "profile";

const tabs: { id: VaultTab; label: string; icon: typeof LayoutGrid }[] = [
  { id: "library", label: "Library", icon: LayoutGrid },
  { id: "profile", label: "Profile", icon: UserRound },
];

/** Horizontal tabs shown inside the top header on desktop. */
export function TopTabs({
  active,
  onChange,
}: {
  active: VaultTab;
  onChange: (tab: VaultTab) => void;
}) {
  return (
    <nav className="hidden items-center gap-1 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] p-1 lg:flex">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-[var(--card)] text-[var(--accent-ink)] shadow-[0_1px_3px_var(--shadow)]"
                : "text-[var(--soft-ink)] hover:text-[var(--ink)]"
            }`}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/** Fixed bottom tab bar with a center "Add" action — iOS-native, mobile only. */
export function BottomTabBar({
  active,
  onChange,
  onAdd,
}: {
  active: VaultTab;
  onChange: (tab: VaultTab) => void;
  onAdd: () => void;
}) {
  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="mx-auto flex max-w-md items-end justify-around gap-1 border-t border-[var(--line)] bg-[color:var(--card)]/92 px-4 pb-2 pt-2 backdrop-blur">
        <TabButton
          label="Library"
          active={active === "library"}
          onClick={() => onChange("library")}
          icon={<LayoutGrid size={22} />}
        />

        <button
          type="button"
          onClick={onAdd}
          aria-label="New post"
          className="vault-action-primary -mt-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--card)]"
        >
          <Plus size={26} />
        </button>

        <TabButton
          label="Profile"
          active={active === "profile"}
          onClick={() => onChange("profile")}
          icon={<UserRound size={22} />}
        />
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px] font-semibold transition ${
        active ? "text-[var(--accent)]" : "text-[var(--muted)]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
