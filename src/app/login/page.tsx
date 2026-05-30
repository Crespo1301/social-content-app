import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/app/brand-mark";
import { SiteFooter } from "@/components/app/site-footer";
import { AuthForm } from "@/components/auth/auth-form";
import { hasSupabaseEnv } from "@/lib/config";

type LoginSearchParams = {
  mode?: string;
  sent?: string;
  error?: string;
  signedOut?: string;
};

function errorMessage(code: string) {
  switch (code) {
    case "missing-email":
      return "Please enter an email address.";
    case "missing-password":
      return "Please enter your password.";
    case "weak-password":
      return "Password must be at least 8 characters.";
    case "unsupported-provider":
      return "That sign-in provider isn't supported.";
    default:
      return decodeURIComponent(code);
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<LoginSearchParams>;
}) {
  const params = await searchParams;
  const mode = params.mode === "signup" ? "signup" : "signin";

  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <section className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center">
          <BrandMark className="h-14 w-14" size={112} priority />
          <p className="eyebrow mt-5">CSolutions</p>
          <h1 className="ios-title mt-2">Social Vault</h1>
          <p className="ios-subtitle mt-3 max-w-sm">
            Your private caption workflow — save, filter, and copy posts in one tap.
          </p>
        </div>

        {/* Auth card */}
        <div className="vault-card mt-7 p-6 sm:p-7">
          {/* Status messages */}
          {params.sent === "1" ? (
            <p className="rounded-2xl border border-[var(--line)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent-ink)]">
              Check your inbox for the sign-in link.
            </p>
          ) : null}
          {params.sent === "verify" ? (
            <p className="rounded-2xl border border-[var(--line)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent-ink)]">
              Account created. Check your inbox to confirm your email, then sign in.
            </p>
          ) : null}
          {params.signedOut === "1" ? (
            <p className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)]">
              You have been signed out successfully.
            </p>
          ) : null}
          {params.error ? (
            <p
              role="alert"
              className="rounded-2xl border border-[var(--danger)] bg-[var(--pink-soft)] px-4 py-3 text-sm text-[var(--ink)]"
            >
              {errorMessage(params.error)}
            </p>
          ) : null}

          {hasSupabaseEnv ? (
            <AuthForm initialMode={mode} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[var(--soft-ink)]">
                Supabase isn&apos;t connected yet, so the app is running in demo
                mode with local sample posts stored on this device.
              </p>
              <Link
                href="/vault"
                className="vault-action vault-action-primary w-full justify-center"
              >
                Continue in demo mode
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-[var(--muted)]">
          Private internal tool for Carlos Crespo and CSolutions.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
