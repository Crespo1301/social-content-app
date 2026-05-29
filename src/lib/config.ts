import { VaultMode } from "@/lib/types";

export const hasSupabaseEnv = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const vaultMode: VaultMode = hasSupabaseEnv ? "supabase" : "demo";
