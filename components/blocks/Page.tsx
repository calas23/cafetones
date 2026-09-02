import { StoryblokServerComponent, storyblokEditable } from "@storyblok/react/rsc";
import type { SbBlok } from "@/lib/types";

// Type de contenu racine : fil d'Ariane (hors <main>, comme l'original)
// puis les sections de la page.

const SITE_URL = "https://cafetones.fr";

// CSS de page requis par chaque type de bloc (voir css/*.css scopés).
// Sert à activer automatiquement les bons styles sur une nouvelle page.
const SCOPE_BY_BLOCK: Record<string, string> = {
  hero_home: "home",
  stats_section: "home",
  universes_section: "home",
  products_home_section: "home",
  certifications_section: "home",
  landing_hero: "landing",
  steps_section: "landing",
  pricing_section: "landing",
  b2b_section: "landing",
  chr_hero: "chr",
  chr_products_section: "chr",
  chr_extras_section: "chr",
  part_hero: "particuliers",
  part_products_section: "particuliers",
  pastries_section: "particuliers",
  part_contact_section: "particuliers",
  gamme_filters: "gamme",
  pricing_note: "gamme",
  gamme_section: "gamme",
  about_story_section: "about",
  roasters_section: "about",
  cert_cards_section: "about",
  airpur_section: "about",
  contact_section: "contact",
  faq_section: "contact",
};

type PageBlok = SbBlok & {
  body?: SbBlok[];
  breadcrumb_label?: string;
  breadcrumb_path?: string;
  style_scopes?: string[];
};

function mainClassName(blok: PageBlok): string | undefined {
  // Scopes explicites (pages migrées, fidélité stricte à l'ancien site),
  // sinon dérivés des blocs présents (nouvelles pages créées dans Storyblok).
  const explicit = (blok.style_scopes ?? []).filter(Boolean);
  const scopes = explicit.length
    ? explicit
    : [...new Set((blok.body ?? []).map((b) => SCOPE_BY_BLOCK[b.component]).filter(Boolean))];
  if (!scopes.length) return undefined;
  return scopes.map((s) => `page-${s}`).join(" ");
}

export default function Page({ blok }: { blok: PageBlok }) {
  const label = blok.breadcrumb_label;
  return (
    <>
      {label ? (
        <>
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <div className="container">
              <a href="/">Accueil</a>
              <span className="breadcrumb__separator">›</span> {label}
            </div>
          </nav>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
                  { "@type": "ListItem", position: 2, name: label, item: `${SITE_URL}${blok.breadcrumb_path || ""}` },
                ],
              }),
            }}
          />
        </>
      ) : null}
      <main className={mainClassName(blok)} {...storyblokEditable(blok)}>
        {(blok.body ?? []).map((nested) => (
          <StoryblokServerComponent blok={nested} key={nested._uid} />
        ))}
      </main>
    </>
  );
}
