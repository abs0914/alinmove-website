"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { downloadHref } from "@/lib/launch-mode";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Props = Pick<ButtonProps, "size" | "variant" | "className"> & {
  label?: string;
};

export function DownloadCustomerAppButton({
  size = "lg",
  variant = "default",
  className,
  label = "Download Customer App",
}: Props) {
  return (
    <Button asChild size={size} variant={variant} className={cn(className)}>
      <Link
        href={downloadHref("customer")}
        onClick={() => trackEvent("download_click_customer", { surface: "cta_button" })}
      >
        <Download aria-hidden />
        {label}
      </Link>
    </Button>
  );
}
