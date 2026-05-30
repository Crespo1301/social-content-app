"use client";

import { Plus } from "lucide-react";
import { FilterSheet, VaultFilters } from "@/components/vault/filter-sheet";
import { PostCard } from "@/components/vault/post-card";
import { SocialPost } from "@/lib/types";

export function LibraryView({
  posts,
  filteredPosts,
  filters,
  onFiltersChange,
  onClearFilters,
  onEdit,
  onDelete,
  onNew,
}: {
  posts: SocialPost[];
  filteredPosts: SocialPost[];
  filters: VaultFilters;
  onFiltersChange: (next: VaultFilters) => void;
  onClearFilters: () => void;
  onEdit: (post: SocialPost) => void;
  onDelete: (post: SocialPost) => void;
  onNew: () => void;
}) {
  const drafted = posts.filter((post) => post.status === "drafted").length;
  const posted = posts.filter((post) => post.status === "posted").length;

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="ios-title">Library</h1>
          <p className="ios-subtitle mt-1">
            {posts.length} saved · {drafted} drafted · {posted} posted
          </p>
        </div>
        <button
          type="button"
          onClick={onNew}
          className="vault-action vault-action-primary hidden sm:inline-flex"
        >
          <Plus size={16} />
          <span>New post</span>
        </button>
      </div>

      <div className="sticky top-[calc(var(--nav-height)+0.5rem)] z-30 -mx-4 rounded-2xl bg-[color:var(--background)]/85 px-4 py-2 backdrop-blur sm:mx-0 sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <FilterSheet filters={filters} onChange={onFiltersChange} onClear={onClearFilters} />
      </div>

      <div className="flex items-center justify-between px-0.5">
        <p className="text-sm font-semibold text-[var(--ink)]">
          {filteredPosts.length === posts.length
            ? `${posts.length} ${posts.length === 1 ? "post" : "posts"}`
            : `${filteredPosts.length} of ${posts.length} posts`}
        </p>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="Your vault is empty"
          body="Save your first caption and it will be ready to filter and copy from any device."
          action={
            <button type="button" onClick={onNew} className="vault-action vault-action-primary">
              <Plus size={16} />
              <span>Create your first post</span>
            </button>
          }
        />
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          title="No posts match these filters"
          body="Try widening the search or clearing a filter to bring the vault back into view."
          action={
            <button type="button" onClick={onClearFilters} className="vault-action">
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-[var(--line-strong)] bg-[var(--card)] p-8 text-center">
      <h2 className="text-lg font-bold text-[var(--ink)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--soft-ink)]">{body}</p>
      <div className="mt-5 flex justify-center">{action}</div>
    </div>
  );
}
