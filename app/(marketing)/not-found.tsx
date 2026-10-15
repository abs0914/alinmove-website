import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-page max-w-md text-center">
        <p className="text-sm uppercase tracking-wider text-alin-gold">404</p>
        <h1 className="mt-2 text-4xl font-bold">Lost in transit.</h1>
        <p className="mt-3 text-alin-muted">
          That page isn&apos;t on our route. Let&apos;s get you back on the map.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </section>
  );
}
