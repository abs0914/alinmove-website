const WORDS_PER_MINUTE = 200;

type LexicalLike = {
  type?: string;
  text?: string;
  children?: unknown[];
};

function collectText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as LexicalLike;
  if (typeof n.text === "string") return n.text + " ";
  if (Array.isArray(n.children)) return n.children.map(collectText).join("");
  return "";
}

export function readingTimeMinutes(data: unknown): number {
  if (!data || typeof data !== "object") return 1;
  const root = (data as { root?: unknown }).root;
  if (!root) return 1;
  const text = collectText(root);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
