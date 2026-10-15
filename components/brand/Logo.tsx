import Image from "next/image";
import { cn } from "@/lib/utils";

const SRC = "/src/ALiNmove_logo.png";
const NATIVE_W = 4034;
const NATIVE_H = 1056;
const ASPECT = NATIVE_W / NATIVE_H;

/**
 * ALiN Move wordmark lockup. The `height` prop is the source of truth — pass
 * the pixel height you want and the width is computed from the intrinsic
 * aspect ratio. Inline `style` is used so the prop wins over any utility
 * classes inherited from the parent.
 */
export function Logo({
  className,
  height = 32,
  priority = false,
}: {
  className?: string;
  height?: number;
  priority?: boolean;
}) {
  const width = Math.round(height * ASPECT);
  return (
    <Image
      src={SRC}
      alt="ALiN Move"
      width={width}
      height={height}
      priority={priority}
      style={{ height: `${height}px`, width: "auto" }}
      className={cn("max-w-full", className)}
    />
  );
}
