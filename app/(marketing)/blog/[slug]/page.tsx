import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { LexicalContent } from "@/lib/lexical-renderer";
import {
  getBlogPostBySlug,
  getBlogPostSlugs,
  getRelatedBlogPosts,
} from "@/lib/payload";
import { readingTimeMinutes } from "@/lib/reading-time";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/utils";
import { FooterCtaBanner } from "@/components/sections/FooterCtaBanner";

export const revalidate = 60;
export const dynamicParams = true;

const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

type Media = { url?: string; alt?: string; width?: number; height?: number };

type Author = {
  id: string | number;
  name: string;
  bio?: unknown;
  photo?: Media | string | null;
};

type Category = { id: string | number; name: string; slug: string };

type Post = {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt?: string | null;
  heroImage?: Media | null;
  ogImage?: Media | null;
  body: { root: { children: unknown[] } };
  category?: Category | string | number | null;
  author?: Author | string | number | null;
  seo?: { metaTitle?: string; metaDescription?: string };
};

export async function generateStaticParams() {
  const docs = await getBlogPostSlugs(200);
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getBlogPostBySlug(slug)) as Post | null;
  if (!post) return buildMetadata({ title: "Not found", path: `/blog/${slug}`, noIndex: true });

  const ogSrc = post.ogImage?.url ?? post.heroImage?.url;

  return buildMetadata({
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    path: `/blog/${slug}`,
    image: ogSrc ?? undefined,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (await getBlogPostBySlug(slug)) as Post | null;
  if (!post) notFound();

  const author =
    post.author && typeof post.author === "object" ? (post.author as Author) : null;
  const category =
    post.category && typeof post.category === "object" ? (post.category as Category) : null;
  const minutes = readingTimeMinutes(post.body as unknown);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const heroUrl = post.heroImage?.url;
  const authorPhoto =
    author?.photo && typeof author.photo === "object" ? (author.photo as Media) : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: heroUrl ? [heroUrl] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: author
      ? { "@type": "Person", name: author.name }
      : { "@type": "Organization", name: "ALiN Move" },
    publisher: {
      "@type": "Organization",
      name: "ALiN Move",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/og/home.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const related = (await getRelatedBlogPosts({
    excludeSlug: post.slug,
    categoryId: category?.id,
    limit: 3,
  })) as unknown as Post[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="bg-alin-black">
        <div className="container-page max-w-3xl pt-10 sm:pt-14">
          <nav aria-label="Breadcrumb" className="text-sm text-alin-muted">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:text-alin-gold">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/blog" className="hover:text-alin-gold">
                  Blog
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-alin-white">{post.title}</li>
            </ol>
          </nav>

          <header className="mt-8">
            {category && (
              <Link
                href={`/blog?category=${category.slug}`}
                className="inline-block rounded-full bg-alin-gold/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-alin-gold hover:bg-alin-gold/20"
              >
                {category.name}
              </Link>
            )}
            <h1 className="mt-4 text-4xl font-bold text-alin-white sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-lg text-alin-muted">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-alin-muted">
              {author && (
                <div className="flex items-center gap-3">
                  {authorPhoto?.url && (
                    <Image
                      src={authorPhoto.url}
                      alt={author.name}
                      width={36}
                      height={36}
                      className="size-9 rounded-full object-cover"
                    />
                  )}
                  <span className="text-alin-white">{author.name}</span>
                </div>
              )}
              {post.publishedAt && (
                <>
                  <span aria-hidden>·</span>
                  <time dateTime={post.publishedAt}>
                    {dateFormatter.format(new Date(post.publishedAt))}
                  </time>
                </>
              )}
              <span aria-hidden>·</span>
              <span>{minutes} min read</span>
            </div>
          </header>
        </div>

        {heroUrl && (
          <div className="container-page mt-10 max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-alin-border bg-alin-near-black">
              <Image
                src={heroUrl}
                alt={post.heroImage?.alt ?? post.title}
                fill
                priority
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="container-page mt-12 max-w-3xl pb-16 sm:pb-20">
          <div className="blog-prose text-alin-white">
            <LexicalContent data={post.body as never} />
          </div>

          <div className="mt-12 border-t border-alin-border pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-alin-gold hover:underline"
            >
              <ChevronLeft className="size-4" aria-hidden /> Back to all stories
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-alin-border bg-alin-near-black">
          <div className="container-page section">
            <h2 className="text-2xl font-bold text-alin-white sm:text-3xl">More stories</h2>
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li
                  key={r.id}
                  className="overflow-hidden rounded-xl border border-alin-border bg-alin-black"
                >
                  <Link href={`/blog/${r.slug}`} className="flex h-full flex-col">
                    {r.heroImage?.url && (
                      <div className="relative aspect-[16/10] bg-alin-graphite">
                        <Image
                          src={r.heroImage.url}
                          alt={r.heroImage.alt ?? r.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <h3 className="text-lg font-semibold text-alin-white hover:text-alin-gold">
                        {r.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-alin-muted">{r.excerpt}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FooterCtaBanner variant="customer" />
    </>
  );
}
