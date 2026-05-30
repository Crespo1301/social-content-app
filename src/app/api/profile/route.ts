import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapRowToProfile, normalizeProfileInput } from "@/lib/profile";
import { UserProfileInput } from "@/lib/types";
import { userProfileInputSchema } from "@/lib/validators";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(null);
  }

  return NextResponse.json(mapRowToProfile(data, user.email));
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = userProfileInputSchema.safeParse(
    normalizeProfileInput((await request.json()) as Partial<UserProfileInput>),
  );

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile payload." }, { status: 400 });
  }

  const body = parsed.data;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: body.displayName,
        avatar_url: body.avatarUrl,
        bio: body.bio,
        default_city: body.defaultCity,
        default_account_type: body.defaultAccountType,
        default_theme: body.defaultTheme,
        onboarding_complete: body.onboardingComplete,
      },
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapRowToProfile(data, user.email));
}
