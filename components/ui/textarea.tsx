import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[100px] w-full rounded-md border border-alin-border bg-alin-near-black px-3 py-2 text-sm text-alin-white placeholder:text-alin-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alin-gold focus-visible:ring-offset-2 focus-visible:ring-offset-alin-black disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
