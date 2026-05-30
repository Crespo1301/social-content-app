"use client";

import Link from "next/link";
import { CheckCircle2, HelpCircle, LogOut } from "lucide-react";
import { AccountAvatar } from "@/components/app/account-avatar";
import {
  AccountType,
  ThemePreference,
  UserProfile,
  UserProfileInput,
  VaultMode,
} from "@/lib/types";

const steps = [
  {
    title: "Save the caption",
    body: "Drop in the final caption with media references, city, tags, and notes so the whole posting context stays together.",
  },
  {
    title: "Filter the right slice",
    body: "Use platform, account type, campaign, category, and status to get to the exact post in seconds.",
  },
  {
    title: "Copy and publish",
    body: "Tap once to copy the caption or just the hashtags, then publish from your phone or laptop.",
  },
];

export function ProfileView({
  profile,
  mode,
  onSave,
  message,
}: {
  profile: UserProfile;
  mode: VaultMode;
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
    <section className="space-y-5">
      <div>
        <h1 className="ios-title">Profile</h1>
        <p className="ios-subtitle mt-1">Set your defaults so creating posts is faster.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <div className="vault-card">
          <div className="flex items-center gap-3">
            <AccountAvatar name={profile.displayName} avatarUrl={profile.avatarUrl} size="lg" />
            <div>
              <p className="text-lg font-bold text-[var(--ink)]">{profile.displayName}</p>
              <p className="text-sm text-[var(--muted)]">{profile.email || "Demo mode"}</p>
            </div>
          </div>

          <form action={handleSubmit} className="mt-2 space-y-6">
            <fieldset className="space-y-3">
              <legend className="vault-grid-label">Identity</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Display name" name="displayName" defaultValue={profile.displayName} />
                <Field label="Avatar image URL" name="avatarUrl" defaultValue={profile.avatarUrl} placeholder="https://..." />
              </div>
              <Field
                label="Bio"
                name="bio"
                as="textarea"
                defaultValue={profile.bio}
                placeholder="What this vault is mainly used for..."
              />
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="vault-grid-label">Posting defaults</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Default city" name="defaultCity" defaultValue={profile.defaultCity} placeholder="Boston" />
                <label htmlFor="defaultAccountType" className="space-y-1.5">
                  <span className="text-sm font-medium text-[var(--ink)]">Default account type</span>
                  <select id="defaultAccountType" className="vault-input" name="defaultAccountType" defaultValue={profile.defaultAccountType}>
                    <option value="business">Business</option>
                    <option value="personal">Personal</option>
                  </select>
                </label>
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="vault-grid-label">Preferences</legend>
              <label htmlFor="defaultTheme" className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--ink)]">Default theme</span>
                <select id="defaultTheme" className="vault-input" name="defaultTheme" defaultValue={profile.defaultTheme}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
              <label className="flex items-start gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3 text-sm text-[var(--soft-ink)]">
                <input type="checkbox" name="onboardingComplete" defaultChecked={profile.onboardingComplete} className="mt-0.5" />
                <span>Mark the basic tutorial as complete for this account.</span>
              </label>
            </fieldset>

            <div className="flex items-center gap-3 border-t border-[var(--line)] pt-5">
              <button type="submit" className="vault-action vault-action-primary flex-1">
                Save profile
              </button>
              {mode === "supabase" ? (
                <form action="/auth/signout" method="post">
                  <button type="submit" className="vault-action vault-action-danger">
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </form>
              ) : null}
            </div>

            <p className="min-h-[1.25rem]" role="status" aria-live="polite">
              {message ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--success)]">
                  <CheckCircle2 size={15} /> {message}
                </span>
              ) : null}
            </p>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="vault-card">
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ink)]">
              <HelpCircle size={16} className="text-[var(--accent)]" /> How the vault works
            </p>
            <ol className="mt-1 space-y-3">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent-ink)]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">{step.title}</p>
                    <p className="text-sm leading-6 text-[var(--soft-ink)]">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[24px] bg-[var(--surface)] px-5 py-4 text-sm leading-6 text-[var(--soft-ink)]">
            <p className="font-semibold text-[var(--ink)]">Private use notes</p>
            <p className="mt-1">
              Theme, sign-in session, and {mode === "demo" ? "demo-mode content" : "stored content"} respect the
              cookie and storage policy. Add a real avatar URL above for a branded headshot in the header.
            </p>
          </div>

          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-1 gap-y-1 px-1 text-xs text-[var(--muted)]">
            <Link href="/privacy" className="rounded-md px-1.5 py-1 transition-colors hover:text-[var(--ink)]">
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="rounded-md px-1.5 py-1 transition-colors hover:text-[var(--ink)]">
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/cookies" className="rounded-md px-1.5 py-1 transition-colors hover:text-[var(--ink)]">
              Cookies
            </Link>
          </nav>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  as = "input",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  as?: "input" | "textarea";
}) {
  return (
    <label htmlFor={name} className="block space-y-1.5">
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          className="vault-input min-h-[96px] resize-y"
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
      ) : (
        <input id={name} className="vault-input" name={name} defaultValue={defaultValue} placeholder={placeholder} />
      )}
    </label>
  );
}
