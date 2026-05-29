import Link from "next/link";
import { hasSupabaseEnv } from "@/lib/config";
import { sendMagicLink } from "@/app/login/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[var(--surface)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[32px] border border-[var(--line)] bg-white p-8 shadow-[0_28px_70px_rgba(20,39,75,0.08)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--pink-deep)]">
              Private access
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-[var(--ink)]">
              Open your caption vault from any device.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--soft-ink)]">
              Built for quick searching, fast copy, and staying organized while posting across personal and business accounts.
            </p>

            {hasSupabaseEnv ? (
              <form action={sendMagicLink} className="mt-8 space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--ink)]">Email</span>
                  <input
                    type="email"
                    name="email"
                    className="vault-input"
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <button type="submit" className="vault-action vault-action-primary w-full justify-center">
                  Send magic link
                </button>
                {params.sent === "1" ? (
                  <p className="rounded-2xl border border-[var(--line)] bg-[var(--blue-soft)]/30 px-4 py-3 text-sm text-[var(--ink)]">
                    Check your inbox for the sign-in link.
                  </p>
                ) : null}
                {params.error ? (
                  <p className="rounded-2xl border border-[var(--line)] bg-[var(--pink-soft)] px-4 py-3 text-sm text-[var(--ink)]">
                    {params.error === "missing-email"
                      ? "Please enter an email address."
                      : decodeURIComponent(params.error)}
                  </p>
                ) : null}
              </form>
            ) : (
              <div className="mt-8 space-y-4 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-5">
                <p className="text-sm leading-6 text-[var(--soft-ink)]">
                  Supabase isn&apos;t connected yet, so the app is currently in demo mode with local sample posts and local-device CRUD.
                </p>
                <Link href="/vault" className="vault-action vault-action-primary inline-flex">
                  Continue in demo mode
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-[32px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(251,238,244,0.75))] p-8 shadow-[0_24px_60px_rgba(20,39,75,0.05)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Designed for daily use
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-[var(--soft-ink)]">
              <li>Search captions by keywords, hashtags, campaign, city, notes, and names.</li>
              <li>Filter by platform, account type, category, and posting status.</li>
              <li>Tap once to copy on phone or laptop.</li>
              <li>Store notes, media references, and cross-post destinations together.</li>
              <li>Start in demo mode now, then switch to private Supabase auth and sync later.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
