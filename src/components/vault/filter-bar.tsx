"use client";

import { Search } from "lucide-react";
import { categoryOptions, platformOptions, statusOptions } from "@/lib/options";

export type VaultFilters = {
  search: string;
  platform: string;
  accountType: string;
  category: string;
  status: string;
  campaign: string;
  city: string;
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
    <div className="sticky top-[72px] z-20 rounded-[28px] border border-[var(--line)] bg-white/95 p-4 shadow-[0_14px_34px_rgba(20,39,75,0.08)] backdrop-blur">
      <div className="grid gap-3">
        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
          <input
            className="vault-input pl-11"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Search captions, tags, cities, hashtags, names, notes..."
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
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
        </div>

        <div className="flex flex-wrap justify-between gap-3 pt-1">
          <p className="text-xs leading-5 text-[var(--muted)]">
            Fast filters for daily posting. Search scans caption text, notes, tags, campaign, city, and media references.
          </p>
          <button type="button" onClick={onClear} className="text-sm font-semibold text-[var(--pink-deep)]">
            Clear filters
          </button>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="space-y-1">
      <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </span>
      <select className="vault-input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
