import { SiteFooter } from "@/components/app/site-footer";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_24px_60px_var(--shadow)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Cookie policy</p>
          <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">How Social Vault Uses Cookies</h1>
          <div className="mt-6 space-y-5 text-sm leading-7 text-[var(--soft-ink)]">
            <p>Social Vault uses essential browser storage and authentication cookies to keep you signed in, remember theme preferences, and preserve demo-mode content on a local device.</p>
            <p>These cookies and storage values support core product behavior only. They are not used for third-party advertising.</p>
            <p>If the app later adds analytics or optional integrations, those should be documented here before deployment.</p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
