"use client";

import Link from "next/link";

export default function BlogError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section bg-alin-black">
      <div className="container-page max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-alin-gold">
          Something went sideways
        </p>
        <h1 className="mt-3 text-3xl font-bold text-alin-white sm:text-4xl">
          We couldn&rsquo;t load the blog.
        </h1>
        <p className="mt-4 text-alin-muted">
          Try again in a moment, or head back home and pick up another route.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-md border border-alin-gold bg-alin-gold px-5 py-2.5 text-sm font-medium text-alin-black hover:bg-alin-gold/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-alin-border px-5 py-2.5 text-sm font-medium text-alin-white hover:border-alin-gold/40 hover:text-alin-gold"
          >
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
