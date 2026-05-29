export type AccountType = "personal" | "business";

export type PostStatus = "drafted" | "posted" | "reposted" | "archived";

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
