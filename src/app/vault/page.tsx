import { redirect } from "next/navigation";
import { VaultApp } from "@/components/vault/vault-app";
import { hasSupabaseEnv, vaultMode } from "@/lib/config";
import { demoProfile, mapRowToProfile } from "@/lib/profile";
import { samplePosts } from "@/lib/sample-posts";
import { SocialPost } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function VaultPage() {
  if (!hasSupabaseEnv) {
    return <VaultApp initialPosts={samplePosts} mode="demo" initialProfile={demoProfile} />;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: user.user_metadata.display_name || user.email?.split("@")[0] || "Vault User",
    },
    { onConflict: "id" },
  );

  const { data, error } = await supabase
    .from("social_posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const initialPosts = (data || []).map(mapRowToPost);
  return (
    <VaultApp
      initialPosts={initialPosts}
      mode={vaultMode}
      userEmail={user.email}
      initialProfile={mapRowToProfile(profileRow, user.email)}
    />
  );
}

function mapRowToPost(row: Record<string, unknown>): SocialPost {
  return {
    id: String(row.id),
    date: String(row.date),
    accountType: row.account_type as SocialPost["accountType"],
    platform: row.platform as SocialPost["platform"],
    status: row.status as SocialPost["status"],
    category: row.category as SocialPost["category"],
    campaign: String(row.campaign || ""),
    city: String(row.city || ""),
    mediaReferences: (row.media_references as string[] | null) || [],
    crossPostedTo: (row.cross_posted_to as string[] | null) || [],
    tags: (row.tags as string[] | null) || [],
    caption: String(row.caption || ""),
    notes: String(row.notes || ""),
    createdAt: row.created_at ? String(row.created_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  };
}
