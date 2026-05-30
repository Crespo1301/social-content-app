"use client";

import { Hash, Pencil, Trash2 } from "lucide-react";
import { PlatformIcon } from "@/components/app/platform-icon";
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
  const hashtags = post.tags.map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)).join(" ");

  return (
    <article className="vault-card transition-transform duration-200 motion-reduce:transition-none md:hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Pill tone="accent">
            <PlatformIcon platform={post.platform} size={13} />
            <span>{post.platform}</span>
          </Pill>
          <Pill tone={post.accountType === "business" ? "teal" : "neutral"}>{post.accountType}</Pill>
          <Pill tone="neutral">{post.status}</Pill>
        </div>
        <span className="shrink-0 text-xs font-medium text-[var(--muted)]">
          {formatDateLabel(post.date)}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-bold text-[var(--ink)]">
            {post.campaign || "Untitled campaign"}
          </h3>
          {post.city ? (
            <span className="shrink-0 rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--soft-ink)]">
              {post.city}
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-6 text-[var(--soft-ink)]">{clipText(post.caption, 220)}</p>
      </div>

      {post.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-xs text-[var(--soft-ink)]"
            >
              {tag.startsWith("#") ? tag : `#${tag}`}
            </span>
          ))}
          {post.tags.length > 6 ? (
            <span className="px-1 text-xs text-[var(--muted)]">+{post.tags.length - 6}</span>
          ) : null}
        </div>
      ) : null}

      {post.notes ? (
        <p className="rounded-2xl bg-[var(--surface)] px-3.5 py-2.5 text-sm leading-6 text-[var(--soft-ink)]">
          {post.notes}
        </p>
      ) : null}

      <div className="flex items-center gap-2 border-t border-[var(--line)] pt-3">
        <CopyButton text={post.caption} className="flex-1" />
        {post.tags.length > 0 ? (
          <CopyButton
            text={hashtags}
            label="Tags"
            icon={<Hash size={16} />}
            tone="default"
          />
        ) : null}
        <button
          type="button"
          onClick={() => onEdit(post)}
          aria-label="Edit post"
          className="vault-icon-button h-10 w-10"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(post)}
          aria-label="Delete post"
          className="vault-icon-button vault-action-danger h-10 w-10"
        >
          <Trash2 size={16} />
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
  tone: "accent" | "teal" | "neutral";
}) {
  const className =
    tone === "accent"
      ? "bg-[var(--accent-soft)] text-[var(--accent-ink)]"
      : tone === "teal"
        ? "bg-[var(--pink-soft)] text-[var(--pink-strong)]"
        : "bg-[var(--surface)] text-[var(--soft-ink)]";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${className}`}>
      {children}
    </span>
  );
}
