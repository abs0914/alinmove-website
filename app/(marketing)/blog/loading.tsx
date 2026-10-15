export default function BlogLoading() {
  return (
    <>
      <section className="border-b border-alin-border bg-alin-black">
        <div className="container-page py-16 sm:py-20 lg:py-24">
          <div className="h-4 w-32 animate-pulse rounded bg-alin-graphite" />
          <div className="mt-4 h-12 w-2/3 animate-pulse rounded bg-alin-graphite" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-alin-graphite" />
        </div>
      </section>
      <section className="section bg-alin-black">
        <div className="container-page">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="overflow-hidden rounded-xl border border-alin-border bg-alin-near-black"
              >
                <div className="aspect-[16/10] animate-pulse bg-alin-graphite" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-20 animate-pulse rounded bg-alin-graphite" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-alin-graphite" />
                  <div className="h-3 w-full animate-pulse rounded bg-alin-graphite" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-alin-graphite" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
