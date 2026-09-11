import { StoryblokServerComponent, storyblokEditable } from "@storyblok/react/rsc";
import type { CSSProperties } from "react";
import type { SbBlok } from "@/lib/types";
import { normalizeHex } from "@/lib/palette";
import { pxOr } from "@/lib/num";
import { resolveFont } from "@/lib/fonts";
import { FontLink } from "@/components/FontLink";

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
  font_display?: string; // onglet Typographie de la page (vide = polices du site)
  font_body?: string;
  heading_scale?: string | number; // % (100 = origine), titres de la page
  page_zoom?: string | number; // % (100 = origine), toute la page
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
  // Onglet « Typographie » de la page : polices, taille des titres et taille de la page, posées
  // sur <main> ; elles priment sur les Réglages du site pour cette page seulement.
  const pct = (raw: unknown, min: number, max: number) =>
    raw === undefined || raw === null || String(raw).trim() === "" ? 100 : pxOr(raw as string | number, 100, min, max);
  const display = resolveFont(blok.font_display);
  const body = resolveFont(blok.font_body);
  const headingScale = pct(blok.heading_scale, 50, 250);
  const pageZoom = pct(blok.page_zoom, 50, 150);
  const mainStyle: Record<string, string | number> = {};
  if (display) mainStyle["--font-display"] = `'${display.family}', ${display.fallback}`;
  if (body) mainStyle["--font-body"] = `'${body.family}', ${body.fallback}`;
  if (headingScale !== 100) mainStyle["--scale-headings"] = headingScale / 100;
  if (pageZoom !== 100) mainStyle.zoom = pageZoom / 100;
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
      <FontLink href={display?.href} />
      <FontLink href={body?.href} />
      <main className={mainClassName(blok)} style={Object.keys(mainStyle).length ? (mainStyle as CSSProperties) : undefined} {...storyblokEditable(blok)}>
        {(blok.body ?? []).map((nested) => {
          // Champs « Couleur de fond » et « Espacement haut/bas » d'une section : la section est
          // enveloppée ; .sb-bg remplace sa couleur de fond, --sb-space multiplie son padding
          // (css/style.css). Vide ou invalide = rendu d'origine, sans enveloppe.
          const background = normalizeHex(nested.background);
          const pct = (raw: unknown, min: number, max: number) =>
            raw === undefined || raw === null || String(raw).trim() === "" ? 100 : pxOr(raw as string | number, 100, min, max);
          const spacing = pct(nested.section_spacing, 25, 200);
          // « Taille de la section (%) » : zoom CSS sur toute la section (textes, espaces, images).
          const zoom = pct(nested.section_zoom, 30, 150);
          if (!background && spacing === 100 && zoom === 100) {
            return <StoryblokServerComponent blok={nested} key={nested._uid} />;
          }
          const style: Record<string, string | number> = {};
          if (background) style["--sb-bg"] = background;
          if (spacing !== 100) style["--sb-space"] = String(spacing / 100);
          if (zoom !== 100) style.zoom = zoom / 100;
          return (
            <div className={background ? "sb-bg" : undefined} style={style as CSSProperties} key={nested._uid}>
              <StoryblokServerComponent blok={nested} />
            </div>
          );
        })}
      </main>
    </>
  );
}
