import { NextRequest } from "next/server";
import { hasSupabaseEnv } from "@/lib/config";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (!hasSupabaseEnv) {
    return undefined;
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/vault/:path*", "/login", "/auth/callback", "/api/posts/:path*", "/api/profile"],
};
