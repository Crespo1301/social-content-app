"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CloudOff,
  NotebookTabs,
  Plus,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { SiteFooter } from "@/components/app/site-footer";
import { TopNav } from "@/components/app/top-nav";
import { useTheme } from "@/components/app/theme-provider";
import { FilterBar, VaultFilters } from "@/components/vault/filter-bar";
import { PostCard } from "@/components/vault/post-card";
import { PostFormDialog } from "@/components/vault/post-form-dialog";
import { demoProfile } from "@/lib/profile";
import { samplePosts } from "@/lib/sample-posts";
import {
  AccountType,
  SocialPost,
  SocialPostInput,
  ThemePreference,
  UserProfile,
  UserProfileInput,
  VaultMode,
} from "@/lib/types";

const demoStorageKey = "social-vault-demo-posts";
const demoProfileStorageKey = "social-vault-demo-profile";

const emptyFilters: VaultFilters = {
  search: "",
  platform: "All",
  accountType: "All",
  category: "All",
  status: "All",
  campaign: "",
  city: "",
  sort: "date-desc",
};

export function VaultApp({
  initialPosts,
  mode,
  userEmail,
  initialProfile,
}: {
  initialPosts: SocialPost[];
  mode: VaultMode;
  userEmail?: string;
  initialProfile: UserProfile;
}) {
  const { setTheme } = useTheme();
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    if (mode !== "demo" || typeof window === "undefined") {
      return initialPosts;
    }

    const rawPosts = window.localStorage.getItem(demoStorageKey);

    if (!rawPosts) {
      return samplePosts;
    }

    try {
      return JSON.parse(rawPosts) as SocialPost[];
    } catch {
      return samplePosts;
    }
  });
  const [filters, setFilters] = useState<VaultFilters>(emptyFilters);
  const [activeDraft, setActiveDraft] = useState<SocialPost | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (mode !== "demo" || typeof window === "undefined") {
      return initialProfile;
    }

    const rawProfile = window.localStorage.getItem(demoProfileStorageKey);

    if (!rawProfile) {
      return demoProfile;
    }

    try {
      return JSON.parse(rawProfile) as UserProfile;
    } catch {
      return demoProfile;
    }
  });
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    if (mode !== "demo") {
      return;
    }

    if (!window.localStorage.getItem(demoStorageKey)) {
      window.localStorage.setItem(demoStorageKey, JSON.stringify(samplePosts));
    }

    if (!window.localStorage.getItem(demoProfileStorageKey)) {
      window.localStorage.setItem(demoProfileStorageKey, JSON.stringify(demoProfile));
    }
  }, [mode]);

  useEffect(() => {
    setTheme(profile.defaultTheme);
  }, [profile.defaultTheme, setTheme]);

  const filteredPosts = useMemo(() => {
    const nextPosts = posts.filter((post) => {
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
    });

    nextPosts.sort((a, b) => {
      switch (filters.sort) {
        case "date-asc":
          return a.date.localeCompare(b.date);
        case "updated-desc":
          return (b.updatedAt || b.createdAt || "").localeCompare(
            a.updatedAt || a.createdAt || "",
          );
        case "platform-asc":
          return a.platform.localeCompare(b.platform);
        case "status-asc":
          return a.status.localeCompare(b.status);
        case "date-desc":
        default:
          return b.date.localeCompare(a.date);
      }
    });

    return nextPosts;
  }, [filters, posts]);

  const draftedCount = posts.filter((post) => post.status === "drafted").length;
  const postedCount = posts.filter((post) => post.status === "posted").length;
  const repostedCount = posts.filter((post) => post.status === "reposted").length;

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

  async function handleProfileSave(input: UserProfileInput) {
    if (mode === "demo") {
      const nextProfile = { ...profile, ...input };
      setProfile(nextProfile);
      window.localStorage.setItem(demoProfileStorageKey, JSON.stringify(nextProfile));
      setProfileMessage("Profile updated in demo mode.");
      return;
    }

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("Failed to save profile.");
    }

    const saved = (await response.json()) as UserProfile;
    setProfile(saved);
    setProfileMessage("Profile updated.");
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <TopNav mode={mode} profile={{ ...profile, email: userEmail || profile.email }} />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <section
          id="overview"
          className="overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_24px_60px_var(--shadow)] sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Welcome back
                </p>
                <h1 className="text-3xl font-semibold leading-tight text-[var(--ink)] sm:text-4xl">
                  {profile.displayName}, your private caption system is ready.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--soft-ink)]">
                  Open the vault on your phone or laptop, filter down to the right platform, then copy exactly what you need without jumping between docs, notes, and screenshots.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {mode === "demo" ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-4 py-2 text-sm text-[var(--ink)]">
                    <CloudOff size={16} className="text-[var(--pink-strong)]" />
                    Demo mode with local storage
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-4 py-2 text-sm text-[var(--ink)]">
                    <ShieldCheck size={16} className="text-[var(--success)]" />
                    Private authenticated workspace for {userEmail || "you"}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-4 py-2 text-sm text-[var(--soft-ink)]">
                  <Sparkles size={16} className="text-[var(--accent)]" />
                  CSolutions internal app
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
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
                <a href="#tutorial" className="vault-action">
                  <BookOpen size={16} />
                  <span>Open tutorial</span>
                </a>
                <a href="#profile" className="vault-action">
                  <UserRound size={16} />
                  <span>Edit profile</span>
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <StatChip label="Saved posts" value={String(posts.length)} helper="All captions currently in the vault" />
              <StatChip label="Drafted" value={String(draftedCount)} helper="Waiting to be published" />
              <StatChip label="Posted" value={String(postedCount)} helper="Live and ready to reuse" />
              <StatChip label="Reposted" value={String(repostedCount)} helper="Already recycled once" />
            </div>
          </div>
        </section>

        <section
          id="tutorial"
          className="grid gap-4 rounded-[32px] border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_18px_40px_var(--shadow)] sm:p-6 lg:grid-cols-3"
        >
          <GuideCard
            icon={<NotebookTabs size={18} />}
            title="1. Save the caption"
            copy="Drop in the final caption, media references, city, tags, and notes so the whole posting context stays together."
          />
          <GuideCard
            icon={<ShieldCheck size={18} />}
            title="2. Filter the right slice"
            copy="Use platform, account type, campaign, category, and status to get down to the exact post you need in seconds."
          />
          <GuideCard
            icon={<Sparkles size={18} />}
            title="3. Copy and publish"
            copy="Tap once to copy the caption or just the hashtags, then publish from your phone or laptop with less friction."
          />
        </section>

        <section id="library" className="grid gap-8 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="space-y-5">
            <FilterBar filters={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} />

            {filteredPosts.length === 0 ? (
              <section className="rounded-[28px] border border-dashed border-[var(--line)] bg-[var(--card)] p-8 text-center shadow-[0_14px_30px_var(--shadow)]">
                <h2 className="text-xl font-semibold text-[var(--ink)]">No posts match these filters.</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--soft-ink)]">
                  Try clearing a filter, widening the search, or creating a fresh caption to get the vault moving.
                </p>
              </section>
            ) : (
              <section className="grid gap-4 xl:grid-cols-2">
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

          <aside id="profile" className="space-y-5">
            <ProfilePanel profile={profile} onSave={handleProfileSave} message={profileMessage} />
            <section className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_18px_40px_var(--shadow)]">
              <p className="text-sm font-semibold text-[var(--ink)]">Private use notes</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--soft-ink)]">
                <li>Use a real avatar URL later if you want a branded headshot in the nav.</li>
                <li>Theme, login session, and demo-mode content all respect the cookie/storage policy.</li>
                <li>For production, run the updated Supabase schema before relying on profile editing.</li>
              </ul>
            </section>
          </aside>
        </section>
      </main>

      <SiteFooter />

      <PostFormDialog
        draft={activeDraft}
        isOpen={isComposerOpen}
        onClose={() => {
          setIsComposerOpen(false);
          setActiveDraft(null);
        }}
        onSave={handleSave}
        defaultCity={profile.defaultCity}
        defaultAccountType={profile.defaultAccountType}
      />
    </div>
  );
}

function StatChip({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--soft-ink)]">{helper}</p>
    </div>
  );
}

function GuideCard({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <article className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--card)] text-[var(--accent)]">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-[var(--ink)]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--soft-ink)]">{copy}</p>
    </article>
  );
}

function ProfilePanel({
  profile,
  onSave,
  message,
}: {
  profile: UserProfile;
  onSave: (input: UserProfileInput) => Promise<void>;
  message: string;
}) {
  async function handleSubmit(formData: FormData) {
    await onSave({
      displayName: String(formData.get("displayName") || ""),
      avatarUrl: String(formData.get("avatarUrl") || ""),
      bio: String(formData.get("bio") || ""),
      defaultCity: String(formData.get("defaultCity") || ""),
      defaultAccountType: String(formData.get("defaultAccountType") || "business") as AccountType,
      defaultTheme: String(formData.get("defaultTheme") || profile.defaultTheme) as ThemePreference,
      onboardingComplete: Boolean(formData.get("onboardingComplete")),
    });
  }

  return (
    <section className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_18px_40px_var(--shadow)]">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Profile</p>
        <h2 className="text-xl font-semibold text-[var(--ink)]">Customize your workspace</h2>
        <p className="text-sm leading-6 text-[var(--soft-ink)]">
          Set your display name, avatar, default city, account type, and theme so creating new posts is faster.
        </p>
      </div>

      <form action={handleSubmit} className="mt-5 grid gap-4">
        <Field label="Display name" name="displayName" defaultValue={profile.displayName} />
        <Field label="Avatar image URL" name="avatarUrl" defaultValue={profile.avatarUrl} placeholder="https://..." />
        <Field label="Default city" name="defaultCity" defaultValue={profile.defaultCity} placeholder="Boston" />

        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--ink)]">Default account type</span>
          <select className="vault-input" name="defaultAccountType" defaultValue={profile.defaultAccountType}>
            <option value="business">business</option>
            <option value="personal">personal</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--ink)]">Default theme</span>
          <select className="vault-input" name="defaultTheme" defaultValue={profile.defaultTheme}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--ink)]">Bio</span>
          <textarea
            name="bio"
            rows={4}
            className="vault-input min-h-[120px] resize-y"
            defaultValue={profile.bio}
            placeholder="What this vault is mainly used for..."
          />
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--soft-ink)]">
          <input
            type="checkbox"
            name="onboardingComplete"
            defaultChecked={profile.onboardingComplete}
            className="mt-1"
          />
          <span>Mark the basic tutorial as complete for this account.</span>
        </label>

        <button type="submit" className="vault-action vault-action-primary justify-center">
          Save profile
        </button>

        {message ? <p className="text-sm text-[var(--success)]">{message}</p> : null}
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
      <input
        className="vault-input"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </label>
  );
}
