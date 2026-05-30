import { SiteFooter } from "@/components/app/site-footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_24px_60px_var(--shadow)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Terms of use</p>
          <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">Social Vault Terms</h1>
          <div className="mt-6 space-y-5 text-sm leading-7 text-[var(--soft-ink)]">
            <p>Social Vault is a private CSolutions workflow product intended for internal use, protected access, and legitimate business operations.</p>
            <p>Users are responsible for the accuracy of the content they store and for ensuring that copied captions, campaign notes, and media references are appropriate for the platform they are used on.</p>
            <p>This app is provided as an operational tool, not a public publishing platform. Do not use it to store credentials, payment information, or confidential third-party documents.</p>
            <p>CSolutions may update the app, schema, or interface as the workflow evolves. Continued use means accepting those updates as part of the maintained internal toolset.</p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
