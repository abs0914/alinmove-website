import { cn } from "@/lib/utils";

/**
 * ACE co-brand mark. Use alongside <Logo /> with "Powered by" connector
 * wherever ACE is surfaced explicitly (Home trust strip, Network, Footer).
 */
export function ACEBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-alin-border px-3 py-1 text-xs uppercase tracking-wider text-alin-muted",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-alin-gold" aria-hidden />
      ALiN Cargo Express
    </span>
  );
}

export function PoweredByACE({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-xs text-alin-muted", className)}>
      <span>Powered by</span>
      <ACEBadge />
    </span>
  );
}
