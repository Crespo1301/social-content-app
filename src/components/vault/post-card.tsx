"use client";

import { Pencil, Trash2 } from "lucide-react";
import { CopyButton } from "@/components/vault/copy-button";
import { SocialPost } from "@/lib/types";
import { clipText, formatDateLabel } from "@/lib/utils";

export function PostCard({
  post,
  onEdit,
  onDelete,
}: {
  post: SocialPost;
  onEdit: (post: SocialPost) => void;
  onDelete: (post: SocialPost) => void;
}) {
  return (
    <article className="vault-card">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="blue">{post.platform}</Pill>
        <Pill tone={post.accountType === "business" ? "pink" : "neutral"}>
          {post.accountType}
        </Pill>
        <Pill tone="neutral">{post.status}</Pill>
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              {formatDateLabel(post.date)}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--ink)]">
              {post.campaign || "Untitled campaign"}
            </h3>
          </div>
          <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1 text-xs font-medium text-[var(--soft-ink)]">
            {post.city || "No city"}
          </span>
        </div>
        <p className="text-sm leading-6 text-[var(--soft-ink)]">{clipText(post.caption, 220)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <TagList title="Category" items={[post.category]} />
        <TagList title="Tags" items={post.tags} />
        <TagList title="Cross-posted" items={post.crossPostedTo} />
      </div>

      {post.mediaReferences.length > 0 ? (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Media references
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--soft-ink)]">
            {post.mediaReferences.join(", ")}
          </p>
        </div>
      ) : null}

      {post.notes ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Notes
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--soft-ink)]">{post.notes}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-1">
        <CopyButton text={post.caption} />
        <button type="button" onClick={() => onEdit(post)} className="vault-action">
          <Pencil size={16} />
          <span>Edit</span>
        </button>
        <button type="button" onClick={() => onDelete(post)} className="vault-action">
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "blue" | "pink" | "neutral";
}) {
  const className =
    tone === "blue"
      ? "bg-[var(--blue-soft)]/35 text-[var(--ink)]"
      : tone === "pink"
        ? "bg-[var(--pink-soft)] text-[var(--pink-deep)]"
        : "bg-[var(--surface-strong)] text-[var(--soft-ink)]";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${className}`}>
      {children}
    </span>
  );
}

function TagList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={`${title}-${item}`}
            className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs text-[var(--soft-ink)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
