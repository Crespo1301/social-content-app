import Image from "next/image";

/**
 * CSolutions logo mark. Replaces the previous decorative "sparkle" glyph with
 * the real brand asset so the app reads as a CSolutions product.
 */
export function BrandMark({
  className = "h-9 w-9",
  size = 72,
  priority = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src="/CSolutions-Logo.png"
      alt="CSolutions"
      width={size}
      height={size}
      priority={priority}
      className={`${className} rounded-[22%] object-contain`}
    />
  );
}
