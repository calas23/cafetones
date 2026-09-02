import "server-only";
import type { SbStory, SiteSettings } from "./types";

// Couche d'accès au contenu Storyblok.
// - Site public : token PUBLIC, version "published" → le contenu non publié
//   ne peut techniquement pas être servi.
// - Draft Mode (éditeur visuel) : token PREVIEW, version "draft", jamais mis en cache.
// - STORYBLOK_LOCAL_CONTENT=1 : rend le site depuis scripts/storyblok/content/
//   (développement hors-ligne uniquement — jamais sur Vercel).

const REGION = process.env.STORYBLOK_REGION || "eu";
const API_HOST = REGION === "eu" ? "https://api.storyblok.com" : `https://api-${REGION}.storyblok.com`;

export const REVALIDATE_SECONDS = 60;
export const CACHE_TAG = "storyblok";

const isLocal = process.env.STORYBLOK_LOCAL_CONTENT === "1";

function token(draft: boolean): string {
  const t = draft ? process.env.STORYBLOK_PREVIEW_TOKEN : process.env.STORYBLOK_PUBLIC_TOKEN;
  if (!t) {
    throw new Error(
      draft
        ? "STORYBLOK_PREVIEW_TOKEN manquant (variable d'environnement)."
        : "STORYBLOK_PUBLIC_TOKEN manquant (variable d'environnement)."
    );
  }
  return t;
}

async function localStory(fullSlug: string): Promise<SbStory | null> {
  const { readFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const file = path.join(process.cwd(), "scripts/storyblok/content/stories", `${fullSlug.replace(/\//g, "__")}.json`);
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as SbStory;
  } catch {
    return null;
  }
}

async function localSlugs(): Promise<string[]> {
  const { readdir } = await import("node:fs/promises");
  const path = await import("node:path");
  try {
    const files = await readdir(path.join(process.cwd(), "scripts/storyblok/content/stories"));
    return files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "").replace(/__/g, "/"));
  } catch {
    return [];
  }
}

export async function getStory(fullSlug: string, draft: boolean): Promise<SbStory | null> {
  if (isLocal) return localStory(fullSlug);

  const params = new URLSearchParams({
    token: token(draft),
    version: draft ? "draft" : "published",
    cv: draft ? Date.now().toString() : "",
  });
  if (!draft) params.delete("cv");

  const url = `${API_HOST}/v2/cdn/stories/${fullSlug}?${params.toString()}`;
  const res = await fetch(
    url,
    draft ? { cache: "no-store" } : { next: { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] } }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Storyblok ${res.status} pour ${fullSlug}`);
  const data = (await res.json()) as { story: SbStory };
  return data.story;
}

/** Liste les full_slugs publiés (pour generateStaticParams et le sitemap). */
export async function listStorySlugs(): Promise<string[]> {
  if (isLocal) return localSlugs();
  try {
    const params = new URLSearchParams({
      token: token(false),
      version: "published",
      per_page: "100",
      excluding_fields: "body",
    });
    const res = await fetch(`${API_HOST}/v2/cdn/stories?${params.toString()}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { stories: SbStory[] };
    return data.stories.map((s) => s.full_slug);
  } catch {
    return [];
  }
}

export async function getSettings(draft: boolean): Promise<SiteSettings | null> {
  const story = await getStory("config/site-settings", draft);
  return (story?.content as SiteSettings) ?? null;
}
