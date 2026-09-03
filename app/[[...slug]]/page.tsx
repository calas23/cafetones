import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { StoryblokStory } from "@storyblok/react/rsc";
import { getStory, listStorySlugs } from "@/lib/content";

// Route unique : "/" → story `home`, "/pages/<slug>" → story `pages/<slug>`.
// Toute nouvelle page créée dans Storyblok obtient automatiquement son URL.

const SITE_URL = "https://cafetones.fr";

type Params = { slug?: string[] };

function toFullSlug(slug?: string[]): string {
  if (!slug || slug.length === 0) return "home";
  return slug.join("/");
}

function toPath(fullSlug: string): string {
  return fullSlug === "home" ? "/" : `/${fullSlug}`;
}

export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await listStorySlugs();
  return slugs
    .filter((s) => !s.startsWith("config/"))
    .map((s) => ({ slug: s === "home" ? [] : s.split("/") }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const fullSlug = toFullSlug(slug);
  const story = await getStory(fullSlug, draft).catch(() => null);
  if (!story) return {};
  const c = story.content as Record<string, string | undefined>;
  const path = toPath(fullSlug);
  return {
    title: c.seo_title,
    description: c.seo_description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: c.og_title || c.seo_title,
      description: c.og_description || c.seo_description,
      type: "website",
      url: `${SITE_URL}${path}`,
      locale: "fr_FR",
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const fullSlug = toFullSlug(slug);
  const story = await getStory(fullSlug, draft).catch((e) => {
    if (process.env.NODE_ENV !== "production") console.error(e);
    return null;
  });
  if (!story) notFound();

  // JSON-LD LocalBusiness : texte exact repris de la page d'origine (champ jsonld).
  const jsonld = typeof story.content.jsonld === "string" ? story.content.jsonld.trim() : "";

  return (
    <>
      <StoryblokStory story={story} />
      {jsonld ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonld }} /> : null}
    </>
  );
}
