import { z } from "zod";
import { accountTypeOptions, categoryOptions, platformOptions, statusOptions } from "@/lib/options";

export const socialPostInputSchema = z.object({
  date: z.string().min(1),
  accountType: z.enum(accountTypeOptions),
  platform: z.enum(platformOptions),
  status: z.enum(statusOptions),
  category: z.enum(categoryOptions),
  campaign: z.string().max(140),
  city: z.string().max(120),
  mediaReferences: z.array(z.string().max(200)).max(20),
  crossPostedTo: z.array(z.string().max(80)).max(20),
  tags: z.array(z.string().max(80)).max(30),
  caption: z.string().min(1).max(5000),
  notes: z.string().max(3000),
});

export const userProfileInputSchema = z.object({
  displayName: z.string().min(1).max(80),
  avatarUrl: z.string().max(500),
  bio: z.string().max(500),
  defaultCity: z.string().max(120),
  defaultAccountType: z.enum(accountTypeOptions),
  defaultTheme: z.enum(["light", "dark"]),
  onboardingComplete: z.boolean(),
});
