"use client";

import { Button } from "@/components/ui/button";

export default function ApplyError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section">
      <div className="container-page max-w-md text-center">
        <h1 className="text-3xl font-bold">Something went wrong.</h1>
        <p className="mt-3 text-alin-muted">
          We couldn&apos;t load the application form. Please try again.
        </p>
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      </div>
    </section>
  );
}
