"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * "Watch video" CTA. Always renders for visual completeness so it doesn't
 * disappear from the design before a real video is ready. When `videoUrl` is
 * unset, the click is a no-op (just fires analytics with `available: false`)
 * so the button looks identical without opening a broken dialog.
 *
 * Pass YouTube embed URLs in the form `https://www.youtube.com/embed/<ID>`.
 */
export function WatchVideoButton({
  videoUrl,
  embedKind = "iframe",
  label = "Watch Video",
  surface,
  className,
}: {
  videoUrl?: string;
  embedKind?: "iframe" | "video";
  label?: string;
  surface: "rider" | "customer";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const available = Boolean(videoUrl);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackEvent("watch_video_open", { surface, available });
          if (available) setOpen(true);
        }}
        aria-disabled={!available}
        className={cn(
          "inline-flex items-center gap-3 text-sm font-semibold text-alin-white transition-colors hover:text-alin-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alin-gold focus-visible:ring-offset-2 focus-visible:ring-offset-alin-black",
          !available && "cursor-default opacity-90",
          className,
        )}
      >
        <span
          aria-hidden
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-alin-white/30 bg-alin-black/40 backdrop-blur"
        >
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        </span>
        {label}
      </button>

      {available ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl p-0">
            <DialogTitle className="sr-only">{label}</DialogTitle>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-alin-black">
              {embedKind === "iframe" ? (
                <iframe
                  src={videoUrl}
                  title={label}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={videoUrl} controls autoPlay className="h-full w-full" />
              )}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
