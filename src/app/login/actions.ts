"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Provider } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Resolve the public origin for auth redirects. Prefers the request `origin`
 * header and falls back to localhost for local dev. Never trust this for
 * security decisions — it only builds the callback URL Supabase redirects to.
 */
async function getOrigin() {
  const headerStore = await headers();
  return headerStore.get("origin") || "http://localhost:3000";
}

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    redirect("/login?error=missing-email");
  }

  const origin = await getOrigin();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?sent=1");
}

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email) {
    redirect("/login?mode=signin&error=missing-email");
  }
  if (!password) {
    redirect("/login?mode=signin&error=missing-password");
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?mode=signin&error=${encodeURIComponent(error.message)}`);
  }

  redirect("/vault");
}

export async function signUpWithPassword(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email) {
    redirect("/login?mode=signup&error=missing-email");
  }
  if (!password) {
    redirect("/login?mode=signup&error=missing-password");
  }
  if (password.length < 8) {
    redirect("/login?mode=signup&error=weak-password");
  }

  const origin = await getOrigin();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?mode=signup&error=${encodeURIComponent(error.message)}`);
  }

  // When email confirmation is enabled, no session is returned and the user
  // must verify via the emailed link before they can sign in.
  if (!data.session) {
    redirect("/login?mode=signin&sent=verify");
  }

  redirect("/vault");
}

/**
 * OAuth sign-in (Google / Apple).
 *
 * NOTE FOR CODEX: these providers must be enabled in the Supabase dashboard
 * (Authentication -> Providers) with valid client IDs/secrets, and the
 * `${origin}/auth/callback` URL must be added to the allowed redirect URLs.
 * Until that is done, `signInWithOAuth` returns an error which we surface via
 * the `?error=` searchParam instead of crashing the page.
 */
export async function signInWithOAuth(formData: FormData) {
  const providerRaw = String(formData.get("provider") || "");
  const allowed: Provider[] = ["google", "apple"];

  if (!allowed.includes(providerRaw as Provider)) {
    redirect("/login?error=unsupported-provider");
  }
  const provider = providerRaw as Provider;

  const origin = await getOrigin();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data?.url) {
    const message = error?.message || "Sign-in provider is not available yet.";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login?signedOut=1");
}
