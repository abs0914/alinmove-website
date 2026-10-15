"use client";

import { Button } from "@/components/ui/button";

export default function WaitlistError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="section">
      <div className="container-page max-w-md text-center">
        <h1 className="text-3xl font-bold">Something went wrong.</h1>
        <p className="mt-3 text-alin-muted">
          We couldn&apos;t load the waitlist form. Please try again.
        </p>
        {process.env.NODE_ENV !== "production" && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-alin-near-black p-3 text-left text-xs text-alin-muted">
            {error.message}
          </pre>
        )}
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      </div>
    </section>
  );
}
