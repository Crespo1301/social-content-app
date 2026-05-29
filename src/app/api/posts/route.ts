import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SocialPost, SocialPostInput } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SocialPostInput;

  const { data, error } = await supabase
    .from("social_posts")
    .insert({
      user_id: user.id,
      date: body.date,
      account_type: body.accountType,
      platform: body.platform,
      status: body.status,
      category: body.category,
      campaign: body.campaign,
      city: body.city,
      media_references: body.mediaReferences,
      cross_posted_to: body.crossPostedTo,
      tags: body.tags,
      caption: body.caption,
      notes: body.notes,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapRowToPost(data));
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
