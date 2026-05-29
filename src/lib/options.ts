import { AccountType, PostCategory, PostStatus, SocialPlatform } from "@/lib/types";

export const accountTypeOptions: AccountType[] = ["personal", "business"];

export const platformOptions: SocialPlatform[] = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "TikTok",
  "Google Business Profile",
  "X",
  "YouTube",
];

export const statusOptions: PostStatus[] = ["drafted", "posted", "reposted", "archived"];

export const categoryOptions: PostCategory[] = [
  "event",
  "local-growth",
  "flyer",
  "client-work",
  "networking",
  "video-script",
  "promotion",
  "portfolio",
  "community",
  "announcement",
];
