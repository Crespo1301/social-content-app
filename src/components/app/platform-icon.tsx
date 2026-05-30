import {
  AtSign,
  BriefcaseBusiness,
  Camera,
  Clapperboard,
  Globe2,
  MessagesSquare,
  Play,
} from "lucide-react";
import { SocialPlatform } from "@/lib/types";

export function PlatformIcon({
  platform,
  size = 16,
  className,
}: {
  platform: SocialPlatform;
  size?: number;
  className?: string;
}) {
  switch (platform) {
    case "Instagram":
      return <Camera size={size} className={className} />;
    case "Facebook":
      return <MessagesSquare size={size} className={className} />;
    case "LinkedIn":
      return <BriefcaseBusiness size={size} className={className} />;
    case "TikTok":
      return <Play size={size} className={className} />;
    case "Google Business Profile":
      return <Globe2 size={size} className={className} />;
    case "X":
      return <AtSign size={size} className={className} />;
    case "YouTube":
      return <Clapperboard size={size} className={className} />;
    default:
      return <Globe2 size={size} className={className} />;
  }
}
