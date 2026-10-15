import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { getBlogPosts } from "@/lib/payload";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/utils";

export const revalidate = 60;

const PAGE_SIZE = 12;

export const metadata: Metadata = buildMetadata({
  title: "Stories from the road",
  description:
    "Field notes from the ALiN Cargo Express network — rider stories, route playbooks, branch operations, and the moves that get packages doorstep to anywhere in the Philippines.",
  path: "/blog",
});

type BlogPostDoc = {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt?: string | null;
  heroImage?: { url?: string; alt?: string; width?: number; height?: number } | null;
  category?: { name?: string; slug?: string } | string | number | null;
  author?: { name?: string; photo?: { url?: string } } | string | number | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatDate(value?: string | null) {
  if (!value) return "";
  return dateFormatter.format(new Date(value));
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const result = await getBlogPosts({ limit: PAGE_SIZE, page });
  const posts = result.docs as unknown as BlogPostDoc[];

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "ALiN Move — Stories from the road",
    url: `${SITE_URL}/blog`,
    description:
      "Field notes from the ALiN Cargo Express network — rider stories, route playbooks, branch operations.",
    publisher: {
      "@type": "Organization",
      name: "ALiN Move",
      url: SITE_URL,
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <section className="border-b border-alin-border bg-alin-black">
        <div className="container-page py-16 sm:py-20 lg:py-24">
          <p className="text-sm font-medium uppercase tracking-wider text-alin-gold">
            ALiN Move blog
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold text-alin-white sm:text-5xl">
            Stories from the road.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-alin-muted">
            Field notes from the ALiN Cargo Express network — rider stories, route playbooks,
            branch operations, and the moves that get packages doorstep to anywhere in the
            Philippines.
          </p>
        </div>
      </section>

      <section className="section bg-alin-black">
        <div className="container-page">
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} priority={posts.indexOf(post) < 3} />
              ))}
            </ul>
          )}

          {posts.length > 0 && (result.totalPages ?? 1) > 1 && (
            <Pagination page={page} totalPages={result.totalPages ?? 1} />
          )}
        </div>
      </section>
    </>
  );
}

function PostCard({ post, priority }: { post: BlogPostDoc; priority?: boolean }) {
  const category =
    post.category && typeof post.category === "object" ? post.category.name : null;
  const author = post.author && typeof post.author === "object" ? post.author.name : null;
  const hero = post.heroImage ?? null;

  return (
    <li className="group flex flex-col overflow-hidden rounded-xl border border-alin-border bg-alin-near-black transition-colors hover:border-alin-gold/40">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        {hero?.url && (
          <div className="relative aspect-[16/10] overflow-hidden bg-alin-graphite">
            <Image
              src={hero.url}
              alt={hero.alt ?? post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 p-6">
          {category && (
            <span className="self-start rounded-full bg-alin-gold/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-alin-gold">
              {category}
            </span>
          )}
          <h2 className="text-xl font-semibold text-alin-white group-hover:text-alin-gold">
            {post.title}
          </h2>
          <p className="line-clamp-3 text-sm text-alin-muted">{post.excerpt}</p>
          <div className="mt-auto flex items-center justify-between pt-4 text-xs text-alin-muted">
            <span>{author ?? "ALiN Move"}</span>
            <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
          </div>
        </div>
      </Link>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-alin-border bg-alin-near-black p-12 text-center">
      <h2 className="text-xl font-semibold text-alin-white">No posts yet — check back soon.</h2>
      <p className="mt-3 text-alin-muted">
        We&rsquo;re drafting the first stories from the ACE network. Bookmark this page or follow
        along on social.
      </p>
    </div>
  );
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  return (
    <nav
      aria-label="Blog pagination"
      className="mt-16 flex items-center justify-between border-t border-alin-border pt-8"
    >
      <div className="text-sm text-alin-muted">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-3">
        {page > 1 && (
          <Link
            href={page - 1 === 1 ? "/blog" : `/blog?page=${page - 1}`}
            className="rounded-md border border-alin-border px-4 py-2 text-sm text-alin-white hover:border-alin-gold/40 hover:text-alin-gold"
          >
            Newer
          </Link>
        )}
        {page < totalPages && (
          <Link
            href={`/blog?page=${page + 1}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-alin-gold bg-alin-gold px-4 py-2 text-sm font-medium text-alin-black hover:bg-alin-gold/90"
          >
            Older <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    </nav>
  );
}
