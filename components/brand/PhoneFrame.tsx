import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * iPhone-style bezel wrapper for bare app-screen exports. The phone
 * screenshots in `/public/img/{customer,rider}-app/*` ship without device
 * chrome — this component supplies the chrome (graphite frame, rounded
 * corners, dynamic-island sliver, drop shadow).
 *
 * Server component. Use anywhere a bare phone screen needs to read as a
 * phone rather than a floating screenshot.
 */
export function PhoneFrame({
  src,
  alt,
  className,
  imgClassName,
  width = 320,
  height = 693,
  sizes = "(min-width: 1024px) 240px, 35vw",
  priority = false,
  loading,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
}) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border-2 border-alin-graphite bg-alin-black p-1.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-alin-border",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.5rem] bg-alin-black">
        <span
          aria-hidden
          className="absolute left-1/2 top-1.5 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-alin-graphite"
        />
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          loading={loading}
          className={cn("block h-auto w-full", imgClassName)}
        />
      </div>
    </div>
  );
}
