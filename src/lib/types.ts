export type AccountType = "personal" | "business";

export type PostStatus = "drafted" | "posted" | "reposted" | "archived";

export type ThemePreference = "light" | "dark";

export type SocialPlatform =
  | "Instagram"
  | "Facebook"
  | "LinkedIn"
  | "TikTok"
  | "Google Business Profile"
  | "X"
  | "YouTube";

export type PostCategory =
  | "event"
  | "local-growth"
  | "flyer"
  | "client-work"
  | "networking"
  | "video-script"
  | "promotion"
  | "portfolio"
  | "community"
  | "announcement";

export type SocialPost = {
  id: string;
  date: string;
  accountType: AccountType;
  platform: SocialPlatform;
  status: PostStatus;
  category: PostCategory;
  campaign: string;
  city: string;
  mediaReferences: string[];
  crossPostedTo: string[];
  tags: string[];
  caption: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SocialPostInput = Omit<SocialPost, "id" | "createdAt" | "updatedAt">;

export type VaultMode = "demo" | "supabase";

export type PostSort =
  | "date-desc"
  | "date-asc"
  | "updated-desc"
  | "platform-asc"
  | "status-asc";

export type UserProfile = {
  id: string;
  email?: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  defaultCity: string;
  defaultAccountType: AccountType;
  defaultTheme: ThemePreference;
  onboardingComplete: boolean;
};

export type UserProfileInput = Omit<UserProfile, "id" | "email">;
