"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { PlatformIcon } from "@/components/app/platform-icon";
import { categoryOptions, platformOptions, sortOptions, statusOptions } from "@/lib/options";
import { SocialPlatform } from "@/lib/types";

export type VaultFilters = {
  search: string;
  platform: string;
  accountType: string;
  category: string;
  status: string;
  campaign: string;
  city: string;
  sort: string;
};

export function FilterBar({
  filters,
  onChange,
  onClear,
}: {
  filters: VaultFilters;
  onChange: (next: VaultFilters) => void;
  onClear: () => void;
}) {
  return (
    <div className="sticky top-[76px] z-20 rounded-[28px] border border-[var(--line)] bg-[color:var(--card)]/96 p-4 shadow-[0_14px_34px_var(--shadow)] backdrop-blur">
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <SlidersHorizontal size={16} />
            Filter and sort
          </div>
          <button type="button" onClick={onClear} className="text-sm font-semibold text-[var(--accent)]">
            Reset
          </button>
        </div>

        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
          <input
            className="vault-input pl-11"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Search captions, tags, cities, hashtags, names, notes..."
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <PlatformPill
            label="All platforms"
            active={filters.platform === "All"}
            onClick={() => onChange({ ...filters, platform: "All" })}
          />
          {platformOptions.map((platform) => (
            <PlatformPill
              key={platform}
              platform={platform}
              label={platform}
              active={filters.platform === platform}
              onClick={() => onChange({ ...filters, platform })}
            />
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
          <Select
            value={filters.platform}
            onChange={(value) => onChange({ ...filters, platform: value })}
            label="Platform"
            options={["All", ...platformOptions]}
          />
          <Select
            value={filters.accountType}
            onChange={(value) => onChange({ ...filters, accountType: value })}
            label="Account"
            options={["All", "personal", "business"]}
          />
          <Select
            value={filters.category}
            onChange={(value) => onChange({ ...filters, category: value })}
            label="Category"
            options={["All", ...categoryOptions]}
          />
          <Select
            value={filters.status}
            onChange={(value) => onChange({ ...filters, status: value })}
            label="Status"
            options={["All", ...statusOptions]}
          />
          <input
            className="vault-input"
            value={filters.campaign}
            onChange={(event) => onChange({ ...filters, campaign: event.target.value })}
            placeholder="Campaign"
            aria-label="Campaign"
          />
          <input
            className="vault-input"
            value={filters.city}
            onChange={(event) => onChange({ ...filters, city: event.target.value })}
            placeholder="City"
            aria-label="City"
          />
          <Select
            value={filters.sort}
            onChange={(value) => onChange({ ...filters, sort: value })}
            label="Sort"
            options={sortOptions.map((option) => option.value)}
            labels={Object.fromEntries(sortOptions.map((option) => [option.value, option.label]))}
          />
        </div>

        <div className="flex flex-wrap justify-between gap-3 pt-1">
          <p className="text-xs leading-5 text-[var(--muted)]">
            Fast filters for daily posting. Search scans caption text, notes, tags, campaign, city, and media references.
          </p>
        </div>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <label className="space-y-1">
      <span className="vault-grid-label">{label}</span>
      <select className="vault-input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {labels?.[option] || option}
          </option>
        ))}
      </select>
    </label>
  );
}

function PlatformPill({
  platform,
  label,
  active,
  onClick,
}: {
  platform?: SocialPlatform;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
        active
          ? "border-transparent bg-[var(--accent)] text-white"
          : "border-[var(--line)] bg-[var(--surface)] text-[var(--soft-ink)]"
      }`}
    >
      {platform ? <PlatformIcon platform={platform} size={14} /> : null}
      <span>{label}</span>
    </button>
  );
}
