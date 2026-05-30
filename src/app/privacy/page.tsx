import { SiteFooter } from "@/components/app/site-footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_24px_60px_var(--shadow)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Privacy policy</p>
          <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">Social Vault Privacy Policy</h1>
          <div className="mt-6 space-y-5 text-sm leading-7 text-[var(--soft-ink)]">
            <p>Social Vault is a private internal-use CSolutions application built to store and manage social media caption workflows.</p>
            <p>We store only the information needed to operate the product: account email, profile customization data, saved captions, notes, filters, and app preferences.</p>
            <p>Supabase handles authentication and data persistence when connected. In demo mode, data is stored only in local browser storage on that device.</p>
            <p>We do not sell your data. Access is intended only for authorized internal users. If this app is adapted for additional team members later, access rules should remain role-based and least-privilege.</p>
            <p>If media references contain client-sensitive names or links, keep them limited to necessary operational notes and avoid storing secrets inside post notes.</p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
