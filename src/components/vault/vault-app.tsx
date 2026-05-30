"use client";

import { useEffect, useMemo, useState } from "react";
import { CloudOff, LogOut, Moon, ShieldCheck, Sun } from "lucide-react";
import { BrandMark } from "@/components/app/brand-mark";
import { BottomTabBar, TopTabs, VaultTab } from "@/components/app/tab-bar";
import { useTheme } from "@/components/app/theme-provider";
import { AccountAvatar } from "@/components/app/account-avatar";
import { VaultFilters } from "@/components/vault/filter-sheet";
import { LibraryView } from "@/components/vault/library-view";
import { ProfileView } from "@/components/vault/profile-view";
import { ComposerSheet } from "@/components/vault/composer-sheet";
import { demoProfile } from "@/lib/profile";
import { samplePosts } from "@/lib/sample-posts";
import {
  SocialPost,
  SocialPostInput,
  UserProfile,
  UserProfileInput,
  VaultMode,
} from "@/lib/types";

const demoStorageKey = "social-vault-demo-posts";
const demoProfileStorageKey = "social-vault-demo-profile";

export const emptyFilters: VaultFilters = {
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
  const { theme, mounted, toggleTheme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<VaultTab>("library");
  // Initialize to the server-provided values so the first client render matches
  // SSR. In demo mode we hydrate from (or seed) localStorage after mount below.
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts);
  const [filters, setFilters] = useState<VaultFilters>(emptyFilters);
  const [activeDraft, setActiveDraft] = useState<SocialPost | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    if (mode !== "demo") return;

    const rawPosts = window.localStorage.getItem(demoStorageKey);
    if (rawPosts) {
      try {
        // Intentional post-mount sync from a client-only store; runs once per mount, not a render loop.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPosts(JSON.parse(rawPosts) as SocialPost[]);
      } catch {
        /* keep seed */
      }
    } else {
      window.localStorage.setItem(demoStorageKey, JSON.stringify(samplePosts));
    }

    const rawProfile = window.localStorage.getItem(demoProfileStorageKey);
    if (rawProfile) {
      try {
        setProfile(JSON.parse(rawProfile) as UserProfile);
      } catch {
        /* keep seed */
      }
    } else {
      window.localStorage.setItem(demoProfileStorageKey, JSON.stringify(demoProfile));
    }
  }, [mode]);

  useEffect(() => {
    setTheme(profile.defaultTheme);
  }, [profile.defaultTheme, setTheme]);

  const filteredPosts = useMemo(() => {
    const next = posts.filter((post) => {
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

    next.sort((a, b) => {
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

    return next;
  }, [filters, posts]);

  async function handleSave(input: SocialPostInput, id?: string) {
    if (mode === "demo") {
      const next = id
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
      setPosts(next);
      window.localStorage.setItem(demoStorageKey, JSON.stringify(next));
      setIsComposerOpen(false);
      setActiveDraft(null);
      return;
    }

    const response = await fetch(id ? `/api/posts/${id}` : "/api/posts", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Failed to save post.");

    const saved = (await response.json()) as SocialPost;
    setPosts((current) =>
      id ? current.map((post) => (post.id === id ? saved : post)) : [saved, ...current],
    );
    setIsComposerOpen(false);
    setActiveDraft(null);
  }

  async function handleDelete(post: SocialPost) {
    if (!window.confirm(`Delete "${post.campaign || "this caption"}"?`)) return;

    if (mode === "demo") {
      const next = posts.filter((item) => item.id !== post.id);
      setPosts(next);
      window.localStorage.setItem(demoStorageKey, JSON.stringify(next));
      return;
    }

    const response = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete post.");
    setPosts((current) => current.filter((item) => item.id !== post.id));
  }

  async function handleProfileSave(input: UserProfileInput) {
    if (mode === "demo") {
      const next = { ...profile, ...input };
      setProfile(next);
      window.localStorage.setItem(demoProfileStorageKey, JSON.stringify(next));
      setProfileMessage("Profile updated in demo mode.");
      return;
    }

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Failed to save profile.");

    const saved = (await response.json()) as UserProfile;
    setProfile(saved);
    setProfileMessage("Profile updated.");
  }

  function openComposer(draft: SocialPost | null) {
    setActiveDraft(draft);
    setIsComposerOpen(true);
  }

  const resolvedProfile = { ...profile, email: userEmail || profile.email };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-12">
      <header className="safe-top sticky top-0 z-40 border-b border-[var(--line)] bg-[color:var(--card)]/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-8 w-8" priority />
            <div className="leading-tight">
              <p className="text-[15px] font-bold tracking-tight text-[var(--ink)]">Social Vault</p>
              <p className="hidden text-[11px] text-[var(--muted)] sm:block">CSolutions internal tool</p>
            </div>
          </div>

          <TopTabs active={activeTab} onChange={setActiveTab} />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="vault-icon-button h-9 w-9"
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              suppressHydrationWarning
            >
              {/* Gate on `mounted` so SSR + first client render agree (avoids theme hydration mismatch). */}
              {!mounted ? <Moon size={17} /> : theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            <div className="hidden items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] py-1 pl-1 pr-3 lg:flex">
              <AccountAvatar name={resolvedProfile.displayName} avatarUrl={resolvedProfile.avatarUrl} size="sm" />
              <span className="text-sm font-semibold text-[var(--ink)]">{resolvedProfile.displayName}</span>
            </div>

            {mode === "supabase" ? (
              <form action="/auth/signout" method="post">
                <button type="submit" className="vault-icon-button h-9 w-9" aria-label="Sign out">
                  <LogOut size={16} />
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6">
        <div className="mb-4 flex items-center gap-2">
          {mode === "demo" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--soft-ink)]">
              <CloudOff size={13} /> Demo mode · saved on this device
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-soft)] px-3 py-1 text-xs font-medium text-[var(--success)]">
              <ShieldCheck size={13} /> Private · {userEmail || "signed in"}
            </span>
          )}
        </div>

        {activeTab === "library" ? (
          <LibraryView
            posts={posts}
            filteredPosts={filteredPosts}
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={() => setFilters(emptyFilters)}
            onEdit={(draft) => openComposer(draft)}
            onDelete={handleDelete}
            onNew={() => openComposer(null)}
          />
        ) : (
          <ProfileView
            profile={resolvedProfile}
            mode={mode}
            onSave={handleProfileSave}
            message={profileMessage}
          />
        )}
      </main>

      <BottomTabBar active={activeTab} onChange={setActiveTab} onAdd={() => openComposer(null)} />

      <ComposerSheet
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
