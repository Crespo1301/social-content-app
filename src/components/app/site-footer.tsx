import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--card)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-7 text-sm text-[var(--soft-ink)] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 2xl:max-w-[90rem]">
        <div>
          <p className="font-semibold text-[var(--ink)]">CSolutions Social Vault</p>
          <p className="mt-1">Private internal publishing workflow app for Carlos Crespo and CSolutions.</p>
          <p className="mt-1 text-xs text-[var(--muted)]">© {new Date().getFullYear()} CSolutions · v0.2.2</p>
        </div>
        <nav className="-mx-2 flex flex-wrap gap-1" aria-label="Legal">
          <Link href="/privacy" className="rounded-lg px-2 py-1 hover:text-[var(--ink)]">Privacy</Link>
          <Link href="/terms" className="rounded-lg px-2 py-1 hover:text-[var(--ink)]">Terms</Link>
          <Link href="/cookies" className="rounded-lg px-2 py-1 hover:text-[var(--ink)]">Cookies</Link>
        </nav>
      </div>
    </footer>
  );
}
