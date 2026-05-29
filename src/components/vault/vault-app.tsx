"use client";

import { useEffect, useMemo, useState } from "react";
import { CloudOff, Plus, ShieldCheck } from "lucide-react";
import { FilterBar, VaultFilters } from "@/components/vault/filter-bar";
import { PostCard } from "@/components/vault/post-card";
import { PostFormDialog } from "@/components/vault/post-form-dialog";
import { samplePosts } from "@/lib/sample-posts";
import { SocialPost, SocialPostInput, VaultMode } from "@/lib/types";

const demoStorageKey = "social-vault-demo-posts";

const emptyFilters: VaultFilters = {
  search: "",
  platform: "All",
  accountType: "All",
  category: "All",
  status: "All",
  campaign: "",
  city: "",
};

export function VaultApp({
  initialPosts,
  mode,
  userEmail,
}: {
  initialPosts: SocialPost[];
  mode: VaultMode;
  userEmail?: string;
}) {
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts);
  const [filters, setFilters] = useState<VaultFilters>(emptyFilters);
  const [activeDraft, setActiveDraft] = useState<SocialPost | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  useEffect(() => {
    if (mode !== "demo") {
      return;
    }

    const raw = window.localStorage.getItem(demoStorageKey);

    if (!raw) {
      window.localStorage.setItem(demoStorageKey, JSON.stringify(samplePosts));
      return;
    }

    try {
      const parsed = JSON.parse(raw) as SocialPost[];
      const frame = window.requestAnimationFrame(() => {
        setPosts(parsed);
      });

      return () => window.cancelAnimationFrame(frame);
    } catch {
      window.localStorage.setItem(demoStorageKey, JSON.stringify(samplePosts));
    }
  }, [mode]);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const haystack = [
          post.caption,
          post.notes,
          post.campaign,
          post.city,
          post.category,
          post.platform,
          post.status,
          post.accountType,
          ...post.tags,
          ...post.crossPostedTo,
          ...post.mediaReferences,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !filters.search || haystack.includes(filters.search.toLowerCase());
        const matchesPlatform =
          filters.platform === "All" || post.platform === filters.platform;
        const matchesAccount =
          filters.accountType === "All" || post.accountType === filters.accountType;
        const matchesCategory =
          filters.category === "All" || post.category === filters.category;
        const matchesStatus =
          filters.status === "All" || post.status === filters.status;
        const matchesCampaign =
          !filters.campaign ||
          post.campaign.toLowerCase().includes(filters.campaign.toLowerCase());
        const matchesCity =
          !filters.city || post.city.toLowerCase().includes(filters.city.toLowerCase());

        return (
          matchesSearch &&
          matchesPlatform &&
          matchesAccount &&
          matchesCategory &&
          matchesStatus &&
          matchesCampaign &&
          matchesCity
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [filters, posts]);

  const draftedCount = posts.filter((post) => post.status === "drafted").length;
  const postedCount = posts.filter((post) => post.status === "posted").length;

  async function handleSave(input: SocialPostInput, id?: string) {
    if (mode === "demo") {
      const nextPosts = id
        ? posts.map((post) =>
            post.id === id
              ? { ...post, ...input, updatedAt: new Date().toISOString() }
              : post,
          )
        : [
            {
              ...input,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...posts,
          ];

      setPosts(nextPosts);
      window.localStorage.setItem(demoStorageKey, JSON.stringify(nextPosts));
      setIsComposerOpen(false);
      setActiveDraft(null);
      return;
    }

    const response = await fetch(id ? `/api/posts/${id}` : "/api/posts", {
      method: id ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("Failed to save post.");
    }

    const saved = (await response.json()) as SocialPost;
    setPosts((current) => {
      if (id) {
        return current.map((post) => (post.id === id ? saved : post));
      }

      return [saved, ...current];
    });
    setIsComposerOpen(false);
    setActiveDraft(null);
  }

  async function handleDelete(post: SocialPost) {
    if (!window.confirm(`Delete "${post.campaign || "this caption"}"?`)) {
      return;
    }

    if (mode === "demo") {
      const nextPosts = posts.filter((item) => item.id !== post.id);
      setPosts(nextPosts);
      window.localStorage.setItem(demoStorageKey, JSON.stringify(nextPosts));
      return;
    }

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete post.");
    }

    setPosts((current) => current.filter((item) => item.id !== post.id));
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-[var(--line)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(246,249,255,0.9)_55%,_rgba(238,246,255,0.95)_100%)] p-6 shadow-[0_24px_60px_rgba(18,35,72,0.08)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--pink-deep)]">
                Social Vault
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-[var(--ink)] sm:text-4xl">
                A private caption vault built for fast daily posting.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[var(--soft-ink)]">
                Save captions once, then open the vault on your phone or laptop to search, filter, and copy them in seconds.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StatChip label="Saved posts" value={String(posts.length)} />
              <StatChip label="Drafts" value={String(draftedCount)} />
              <StatChip label="Posted" value={String(postedCount)} />
              <button
                type="button"
                onClick={() => {
                  setActiveDraft(null);
                  setIsComposerOpen(true);
                }}
                className="vault-action vault-action-primary"
              >
                <Plus size={16} />
                <span>New post</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--soft-ink)]">
            {mode === "demo" ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[var(--ink)]">
                <CloudOff size={16} className="text-[var(--pink-deep)]" />
                Demo mode, local device storage until Supabase env is connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[var(--ink)]">
                <ShieldCheck size={16} className="text-[var(--blue-deep)]" />
                Private vault for {userEmail || "authenticated user"}
              </span>
            )}
          </div>
        </section>

        <FilterBar filters={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} />

        {filteredPosts.length === 0 ? (
          <section className="rounded-[28px] border border-dashed border-[var(--line)] bg-white p-8 text-center shadow-[0_14px_30px_rgba(19,38,74,0.06)]">
            <h2 className="text-xl font-semibold text-[var(--ink)]">No posts match these filters.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--soft-ink)]">
              Try clearing a filter, widening the search, or creating a fresh caption to get the vault moving.
            </p>
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={(draft) => {
                  setActiveDraft(draft);
                  setIsComposerOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}
      </div>

      <PostFormDialog
        draft={activeDraft}
        isOpen={isComposerOpen}
        onClose={() => {
          setIsComposerOpen(false);
          setActiveDraft(null);
        }}
        onSave={handleSave}
      />
    </>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[var(--line)] bg-white px-4 py-3 shadow-[0_6px_20px_rgba(18,35,72,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-[var(--ink)]">{value}</p>
    </div>
  );
}
