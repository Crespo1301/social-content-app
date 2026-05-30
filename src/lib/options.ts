import { AccountType, PostCategory, PostSort, PostStatus, SocialPlatform } from "@/lib/types";

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

export const sortOptions: { label: string; value: PostSort }[] = [
  { label: "Newest first", value: "date-desc" },
  { label: "Oldest first", value: "date-asc" },
  { label: "Recently updated", value: "updated-desc" },
  { label: "Platform", value: "platform-asc" },
  { label: "Status", value: "status-asc" },
];
