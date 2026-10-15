"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { trackingHref } from "@/lib/launch-mode";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Props = Pick<ButtonProps, "size" | "variant" | "className"> & {
  label?: string;
};

export function TrackPackageButton({
  size = "lg",
  variant = "outline",
  className,
  label = "Track a Package",
}: Props) {
  return (
    <Button asChild size={size} variant={variant} className={cn(className)}>
      <Link
        href={trackingHref()}
        onClick={() => trackEvent("track_package_click", { surface: "cta_button" })}
      >
        <MapPin aria-hidden />
        {label}
      </Link>
    </Button>
  );
}
