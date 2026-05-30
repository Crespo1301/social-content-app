import { UserProfile, UserProfileInput } from "@/lib/types";

export const demoProfile: UserProfile = {
  id: "demo-user",
  email: "demo@csolutions.local",
  displayName: "Carlos",
  avatarUrl: "",
  bio: "Founder workflow vault for daily social posting across CSolutions and personal channels.",
  defaultCity: "Boston",
  defaultAccountType: "business",
  defaultTheme: "light",
  onboardingComplete: false,
};

export function mapRowToProfile(row: Record<string, unknown>, email?: string): UserProfile {
  return {
    id: String(row.id),
    email,
    displayName: String(row.display_name || "Vault User"),
    avatarUrl: String(row.avatar_url || ""),
    bio: String(row.bio || ""),
    defaultCity: String(row.default_city || ""),
    defaultAccountType: (row.default_account_type as UserProfile["defaultAccountType"]) || "business",
    defaultTheme: (row.default_theme as UserProfile["defaultTheme"]) || "light",
    onboardingComplete: Boolean(row.onboarding_complete),
  };
}

export function normalizeProfileInput(input: Partial<UserProfileInput>): UserProfileInput {
  return {
    displayName: input.displayName?.trim() || "Vault User",
    avatarUrl: input.avatarUrl?.trim() || "",
    bio: input.bio?.trim() || "",
    defaultCity: input.defaultCity?.trim() || "",
    defaultAccountType: input.defaultAccountType || "business",
    defaultTheme: input.defaultTheme || "light",
    onboardingComplete: Boolean(input.onboardingComplete),
  };
}
