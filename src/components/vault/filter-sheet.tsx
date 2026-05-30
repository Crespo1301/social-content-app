"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
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

export function countActiveFilters(filters: VaultFilters) {
  let count = 0;
  if (filters.platform !== "All") count += 1;
  if (filters.accountType !== "All") count += 1;
  if (filters.category !== "All") count += 1;
  if (filters.status !== "All") count += 1;
  if (filters.campaign.trim() !== "") count += 1;
  if (filters.city.trim() !== "") count += 1;
  if (filters.sort !== "date-desc") count += 1;
  return count;
}

export function FilterSheet({
  filters,
  onChange,
  onClear,
}: {
  filters: VaultFilters;
  onChange: (next: VaultFilters) => void;
  onClear: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = countActiveFilters(filters);
  const hasAny = activeCount > 0 || filters.search.trim() !== "";

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <div className="space-y-3">
      {/* Search-first row */}
      <div className="flex items-center gap-2">
        <label className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            size={18}
          />
          <input
            className="vault-input pl-11"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Search captions, tags, cities, notes..."
            aria-label="Search captions"
            type="search"
          />
          {filters.search ? (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: "" })}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)]"
            >
              <X size={15} />
            </button>
          ) : null}
        </label>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Filters and sort"
          className={`relative inline-flex h-[2.95rem] shrink-0 items-center gap-2 rounded-2xl border px-3.5 text-sm font-semibold transition sm:px-4 ${
            activeCount > 0
              ? "border-transparent bg-[var(--accent)] text-[var(--on-accent)]"
              : "border-[var(--line-strong)] bg-[var(--card)] text-[var(--soft-ink)]"
          }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 ? (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-xs font-bold">
              {activeCount}
            </span>
          ) : null}
        </button>
      </div>

      {/* Platform quick-picks — single scrollable row */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <PlatformChip
          label="All"
          active={filters.platform === "All"}
          onClick={() => onChange({ ...filters, platform: "All" })}
        />
        {platformOptions.map((platform) => (
          <PlatformChip
            key={platform}
            platform={platform}
            label={platform}
            active={filters.platform === platform}
            onClick={() => onChange({ ...filters, platform })}
          />
        ))}
      </div>

      {/* Bottom sheet for advanced filters + sort */}
      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsOpen(false)}
            className="sheet-backdrop cursor-default"
          />
          <div
            role="dialog"
            aria-label="Filters and sort"
            className="safe-bottom fixed inset-x-0 bottom-0 z-[70] mx-auto max-h-[85vh] w-full max-w-lg overflow-auto rounded-t-[28px] border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_-12px_50px_var(--shadow-strong)] sm:bottom-6 sm:rounded-[28px]"
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--line-strong)] sm:hidden" />
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--ink)]">Filters & sort</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="vault-icon-button h-9 w-9"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
              <Select
                label="Account"
                value={filters.accountType}
                onChange={(value) => onChange({ ...filters, accountType: value })}
                options={["All", "personal", "business"]}
              />
              <Select
                label="Category"
                value={filters.category}
                onChange={(value) => onChange({ ...filters, category: value })}
                options={["All", ...categoryOptions]}
              />
              <Select
                label="Status"
                value={filters.status}
                onChange={(value) => onChange({ ...filters, status: value })}
                options={["All", ...statusOptions]}
              />
              <label className="space-y-1">
                <span className="vault-grid-label">Campaign</span>
                <input
                  className="vault-input"
                  value={filters.campaign}
                  onChange={(event) => onChange({ ...filters, campaign: event.target.value })}
                  placeholder="e.g. Spring launch"
                  aria-label="Campaign"
                />
              </label>
              <label className="space-y-1">
                <span className="vault-grid-label">City</span>
                <input
                  className="vault-input"
                  value={filters.city}
                  onChange={(event) => onChange({ ...filters, city: event.target.value })}
                  placeholder="e.g. Boston"
                  aria-label="City"
                />
              </label>
              <Select
                label="Sort"
                value={filters.sort}
                onChange={(value) => onChange({ ...filters, sort: value })}
                options={sortOptions.map((option) => option.value)}
                labels={Object.fromEntries(sortOptions.map((option) => [option.value, option.label]))}
              />
            </div>

            <div className="mt-5 flex items-center gap-3">
              {hasAny ? (
                <button type="button" onClick={onClear} className="vault-action vault-action-danger flex-1">
                  Clear all
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="vault-action vault-action-primary flex-1"
              >
                Show results
              </button>
            </div>
          </div>
        </>
      ) : null}
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

function PlatformChip({
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
    <button type="button" onClick={onClick} data-active={active} className="chip shrink-0">
      {platform ? <PlatformIcon platform={platform} size={14} /> : null}
      <span>{label}</span>
    </button>
  );
}
