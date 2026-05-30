import Link from "next/link";
import { ArrowRight, LockKeyhole, Smartphone, WandSparkles } from "lucide-react";
import { SiteFooter } from "@/components/app/site-footer";
import { hasSupabaseEnv } from "@/lib/config";
import { sendMagicLink } from "@/app/login/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string; signedOut?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <section className="rounded-[32px] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_28px_70px_var(--shadow)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              CSolutions app
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-[var(--ink)]">
              Sign in to your private Social Vault.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--soft-ink)]">
              A protected caption workflow for saving, filtering, and instantly copying posts across personal and business channels.
            </p>

            {hasSupabaseEnv ? (
              <form action={sendMagicLink} className="mt-8 space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--ink)]">Email address</span>
                  <input
                    type="email"
                    name="email"
                    className="vault-input"
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <button type="submit" className="vault-action vault-action-primary w-full justify-center">
                  Send secure magic link
                </button>

                <div className="space-y-3 pt-2 text-sm leading-6 text-[var(--soft-ink)]">
                  <p>How login works:</p>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>Enter the email you want tied to the vault.</li>
                    <li>Open the secure sign-in link from your inbox.</li>
                    <li>Return to the vault with your content synced through Supabase.</li>
                  </ol>
                </div>

                {params.sent === "1" ? (
                  <p className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)]">
                    Check your inbox for the sign-in link.
                  </p>
                ) : null}
                {params.signedOut === "1" ? (
                  <p className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)]">
                    You have been signed out successfully.
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
                  Supabase isn&apos;t connected yet, so the app is currently running in demo mode with local sample posts and profile customization stored on this device.
                </p>
                <Link href="/vault" className="vault-action vault-action-primary inline-flex">
                  Continue in demo mode
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </section>

          <section className="grid gap-4">
            <FeatureCard
              icon={<LockKeyhole size={18} />}
              title="Private and protected"
              copy="Built for internal use with Supabase auth, protected routes, legal policy pages, and a CSolutions product wrapper."
            />
            <FeatureCard
              icon={<Smartphone size={18} />}
              title="Mobile-first workflow"
              copy="Search, filter, and copy captions from your phone or laptop without digging through docs and folders."
            />
            <FeatureCard
              icon={<WandSparkles size={18} />}
              title="Ready for daily use"
              copy="Profile settings, dark and light mode, platform-specific filtering, and a tutorial flow make the vault feel like a real app."
            />
          </section>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <article className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_20px_44px_var(--shadow)]">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--accent)]">
        {icon}
      </div>
      <h2 className="mt-4 text-xl font-semibold text-[var(--ink)]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--soft-ink)]">{copy}</p>
    </article>
  );
}
