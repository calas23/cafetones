import type { MetadataRoute } from "next";
import { listStorySlugs } from "@/lib/content";

const SITE_URL = "https://cafetones.fr";

// Sitemap généré depuis Storyblok : toute nouvelle page publiée y entre seule.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listStorySlugs();
  const pages = slugs.filter((s) => !s.startsWith("config/"));
  return pages.map((slug) => {
    const isHome = slug === "home";
    const isLegal = slug.endsWith("mentions-legales");
    return {
      url: isHome ? `${SITE_URL}/` : `${SITE_URL}/${slug}`,
      changeFrequency: "monthly" as const,
      priority: isHome ? 1.0 : isLegal ? 0.3 : 0.8,
    };
  });
}
