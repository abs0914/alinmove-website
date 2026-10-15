import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Wraps the designed PAI insurance card image. Drop the asset at
 * /public/img/pai-card.png (transparent or solid background, ~1200×750 source).
 * Server component — no interactivity.
 */
export function PaiInsuranceCard({
  alt = "ALiN Move Personal Accident Insurance member card showing coverage benefits",
  className,
  width = 600,
  height = 380,
  priority = false,
}: {
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src="/img/pai-card.png"
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="(min-width: 1024px) 600px, 90vw"
      className={cn("h-auto w-full max-w-[600px] rounded-xl", className)}
    />
  );
}
