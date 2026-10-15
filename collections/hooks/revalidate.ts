import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from "payload";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function revalidatePaths(paths: string[]) {
  if (!process.env.REVALIDATE_SECRET) return;
  try {
    await fetch(`${SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": process.env.REVALIDATE_SECRET,
      },
      body: JSON.stringify({ paths }),
    });
  } catch (err) {
    console.error("revalidate webhook error", err);
  }
}

export const revalidateGlobalPaths =
  (paths: string[]): GlobalAfterChangeHook =>
  async () => {
    await revalidatePaths(paths);
  };

export const revalidateBlog: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation === "create" || operation === "update") {
    const slug = (doc as { slug?: string }).slug;
    await revalidatePaths(["/blog", slug ? `/blog/${slug}` : "/blog"]);
  }
};

export const revalidateFAQ: CollectionAfterChangeHook = async ({ operation }) => {
  if (operation === "create" || operation === "update") {
    await revalidatePaths(["/help", "/drive/faq"]);
  }
};

export const revalidateCity: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation === "create" || operation === "update") {
    const slug = (doc as { slug?: string }).slug;
    await revalidatePaths(["/coverage", slug ? `/coverage/${slug}` : "/coverage"]);
  }
};

export const revalidatePage: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== "create" && operation !== "update") return;
  const key = (doc as { key?: string }).key;
  const map: Record<string, string[]> = {
    home: ["/"],
    network: ["/network"],
    drive: ["/drive"],
    delivery: ["/delivery"],
    pricing: ["/pricing"],
    "how-it-works": ["/how-it-works"],
  };
  await revalidatePaths(map[key ?? ""] ?? ["/"]);
};

export const revalidateJob: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== "create" && operation !== "update") return;
  const slug = (doc as { slug?: string }).slug;
  await revalidatePaths(["/careers", slug ? `/careers/${slug}` : "/careers"]);
};
