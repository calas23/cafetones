import type { CSSProperties } from "react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { Icon } from "@/components/Icon";
import { fmt, fmtTel } from "@/lib/text";
import { pxOr } from "@/lib/num";
import { badgeStyle, blockTextStyle } from "@/lib/fonts";
import { hexToRgbList, normalizeHex } from "@/lib/palette";
import { FontLink } from "@/components/FontLink";
import { assetUrl, type SbAsset, type SbBlok } from "@/lib/types";
import { Buttons } from "./shared";

// Les 5 héros du site, markup identique à l'original.

type HeroHomeBlok = SbBlok & {
  badge_logo?: SbAsset;
  badge_logo_height?: string | number; // hauteur en px saisie dans Storyblok (vide = 30)
  badge_text?: string;
  title?: string;
  subtitle?: string;
  buttons?: SbBlok[];
  background_image?: SbAsset;
  theme?: string; // dark (photo sombre, texte clair) | light (illustration claire, texte foncé)
  content_width?: string | number; // largeur max du bloc de texte en px (vide = 700 / 780 thème clair)
};

export function HeroHome({ blok }: { blok: HeroHomeBlok }) {
  const light = blok.theme === "light";
  const logoHeight = pxOr(blok.badge_logo_height, 30, 12, 120);
  const bg = assetUrl(blok.background_image);
  // Onglet « Typographie » du bloc : police / taille du titre et du sous-titre, style du badge.
  const title = blockTextStyle(blok, "title");
  const subtitle = blockTextStyle(blok, "subtitle");
  const badge = badgeStyle(blok);
  // « Largeur du bloc de texte (px) » : largeur max du titre, du sous-titre et des boutons.
  const rawWidth = blok.content_width;
  const contentWidth = rawWidth === undefined || rawWidth === null || String(rawWidth).trim() === "" ? 0 : pxOr(rawWidth, 0, 400, 1400);
  const sectionStyle: Record<string, string> = {};
  if (bg) sectionStyle.backgroundImage = `url("${bg}")`;
  if (contentWidth) sectionStyle["--hero-content-width"] = `${contentWidth}px`;
  return (
    <section
      className={light ? "home-hero home-hero--light" : "home-hero"}
      style={Object.keys(sectionStyle).length ? (sectionStyle as CSSProperties) : undefined}
      {...storyblokEditable(blok)}
    >
      <FontLink href={title.href} />
      <FontLink href={subtitle.href} />
      <FontLink href={badge.href} />
      <div className="container">
        <div className="home-hero__content">
          <div className="home-hero__badge-logo" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {assetUrl(blok.badge_logo) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={assetUrl(blok.badge_logo)}
                alt={blok.badge_logo?.alt || "TONES"}
                style={{ height: `${logoHeight}px`, width: "auto", filter: light ? "brightness(0)" : "brightness(0) invert(1)" }}
              />
            ) : null}
            {blok.badge_text ? <span className="badge badge--dark" style={badge.style}>{blok.badge_text}</span> : null}
          </div>

          <h1 className="home-hero__title" style={title.style}>{fmt(blok.title)}</h1>

          <p className="home-hero__subtitle sb-subtitle" style={subtitle.style}>{fmt(blok.subtitle)}</p>

          <div className="home-hero__actions">
            <Buttons buttons={blok.buttons} />
          </div>
        </div>
      </div>
    </section>
  );
}

type PageHeroBlok = SbBlok & {
  badge?: string;
  title?: string;
  text?: string;
  background_image?: SbAsset; // onglet Fond : vide = fond uni d'origine
  background_position?: string; // cadrage de l'image : center (défaut) | top | bottom
  overlay_opacity?: string | number; // voile posé sur l'image en % (vide = 70, 0 = aucun)
  background?: string; // « Couleur de fond » (hex) : fond du bandeau et couleur du voile
};

export function PageHero({ blok }: { blok: PageHeroBlok }) {
  // Onglet « Typographie » : badge, titre, texte.
  const badge = badgeStyle(blok);
  const title = blockTextStyle(blok, "title");
  const text = blockTextStyle(blok, "text");
  // Onglet « Fond » : image en couverture, voile de la couleur de fond (hex choisi, sinon fond
  // d'origine du bandeau) à l'opacité choisie (vide = 70 %, 0 = image telle quelle). Sans image :
  // rendu d'origine, aucun style posé (voir .page-hero--image dans css/style.css).
  const bg = assetUrl(blok.background_image);
  const sectionStyle: Record<string, string> = {};
  if (bg) {
    sectionStyle.backgroundImage = `url("${bg}")`;
    if (blok.background_position === "top" || blok.background_position === "bottom") sectionStyle.backgroundPosition = `center ${blok.background_position}`;
    const rawOpacity = blok.overlay_opacity;
    const pct = rawOpacity === undefined || rawOpacity === null || String(rawOpacity).trim() === "" ? 70 : pxOr(rawOpacity, 70, 0, 100);
    const hex = normalizeHex(blok.background);
    if (pct > 0) sectionStyle["--page-hero-overlay"] = hex ? `rgba(${hexToRgbList(hex)}, ${pct / 100})` : `color-mix(in srgb, var(--color-cream-warm) ${pct}%, transparent)`;
  }
  return (
    <section className={bg ? "page-hero page-hero--image" : "page-hero"} style={bg ? (sectionStyle as CSSProperties) : undefined} {...storyblokEditable(blok)}>
      <FontLink href={badge.href} />
      <FontLink href={title.href} />
      <FontLink href={text.href} />
      <div className="container">
        {blok.badge ? <span className="badge badge--gold" style={badge.style}>{blok.badge}</span> : null}
        <h1 style={{ marginTop: "1rem", ...title.style }}>{fmt(blok.title)}</h1>
        {blok.text ? (
          <p className="text-muted sb-subtitle" style={{ marginTop: "0.75rem", ...text.style }}>{fmt(blok.text)}</p>
        ) : null}
      </div>
    </section>
  );
}

type LandingHeroBlok = SbBlok & {
  badge_text?: string;
  title?: string;
  subtitle?: string;
  buttons?: SbBlok[];
  trust_items?: (SbBlok & { text?: string })[];
  image?: SbAsset;
  image_width?: string;
  image_height?: string;
  content_spacing?: string | number; // espacement vertical entre les éléments en % (vide = 100)
  image_style?: string; // card (défaut : coins arrondis + ombre) | seamless (sans cadre, fond blanc fondu)
  image_scale?: string | number; // taille de l'image en % (vide = 100), échelle visuelle centrée
  text_shift?: string | number; // variante chr : décalage du texte vers la gauche en px (vide = 0)
  image_bleed?: boolean; // variante chr : colonne illustration étendue jusqu'au bord droit de l'écran
};

// telLinks : les numéros de téléphone du sous-titre deviennent des liens (héros CHR en disposition
// texte / illustration, qui réutilise ce rendu). Badge, points de confiance et image ne sont rendus
// que s'ils sont renseignés (toujours le cas sur la page Bureau & Entreprise : rendu inchangé).
// variant "chr" (classe hero--chr, voir landing.css) : « Taille de l'image (%) » règle la largeur de la
// colonne illustration par rapport au texte (--hero-cols, 30 à 300) au lieu d'une échelle visuelle, et
// « Décaler le texte vers la gauche (px) » pose --hero-text-shift. Page Bureau : inchangée.
export function LandingHero({ blok, telLinks = false, variant }: { blok: LandingHeroBlok; telLinks?: boolean; variant?: "chr" }) {
  const chr = variant === "chr";
  // Onglet « Typographie » : badge, titre, sous-titre.
  const badge = badgeStyle(blok);
  const title = blockTextStyle(blok, "title");
  const subtitle = blockTextStyle(blok, "subtitle");
  // « Espacement entre les éléments (%) » : marges verticales entre badge, titre, texte,
  // boutons et points de confiance (variable --hero-gap, voir landing.css). Vide = inchangé.
  const rawSpacing = blok.content_spacing;
  const spacing = rawSpacing === undefined || rawSpacing === null || String(rawSpacing).trim() === "" ? 0 : pxOr(rawSpacing, 0, 25, 200);
  const contentStyle = spacing ? ({ "--hero-gap": String(spacing / 100) } as CSSProperties) : undefined;
  // « Taille de l'image (%) » : échelle visuelle de l'image (transform, sans effet sur la mise en page).
  const rawImg = blok.image_scale;
  const imgScale = rawImg === undefined || rawImg === null || String(rawImg).trim() === "" ? 100 : pxOr(rawImg as string | number, 100, 30, chr ? 300 : 150);
  const sectionVars: Record<string, string> = {};
  if (imgScale !== 100) {
    if (chr) sectionVars["--hero-cols"] = `minmax(0, 1fr) minmax(0, ${imgScale / 100}fr)`;
    else sectionVars["--hero-img-transform"] = `scale(${imgScale / 100})`;
  }
  const rawShift = blok.text_shift;
  const textShift = !chr || rawShift === undefined || rawShift === null || String(rawShift).trim() === "" ? 0 : pxOr(rawShift, 0, 0, 400);
  if (textShift) sectionVars["--hero-text-shift"] = `${textShift}px`;
  const sectionStyle = Object.keys(sectionVars).length ? (sectionVars as CSSProperties) : undefined;
  const trustItems = blok.trust_items ?? [];
  const imgUrl = assetUrl(blok.image);
  return (
    <section className={chr ? (blok.image_bleed ? "hero hero--chr hero--bleed" : "hero hero--chr") : "hero"} style={sectionStyle} {...storyblokEditable(blok)}>
      <FontLink href={badge.href} />
      <FontLink href={title.href} />
      <FontLink href={subtitle.href} />
      <div className="container hero__inner">
        <div className="hero__content" style={contentStyle}>
          {blok.badge_text ? (
            <span className="badge badge--gold hero__badge" style={badge.style}>
              <Icon name="star" size={14} stroke={2} /> {blok.badge_text}
            </span>
          ) : null}

          <h1 className="hero__title" style={title.style}>{fmt(blok.title)}</h1>

          <p className="hero__subtitle sb-subtitle" style={subtitle.style}>{telLinks ? fmtTel(blok.subtitle) : fmt(blok.subtitle)}</p>

          <div className="hero__actions">
            <Buttons buttons={blok.buttons} />
          </div>

          {trustItems.length ? (
            <div className="hero__trust">
              {trustItems.map((t) => (
                <span className="hero__trust-item" key={t._uid}>
                  <Icon name="check" size={16} stroke={2} /> {t.text}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {imgUrl ? (
          <div className={blok.image_style === "seamless" ? "hero__visual hero__visual--seamless" : "hero__visual"}>
            <div className={blok.image_style === "seamless" ? "hero__image-wrapper hero__image-wrapper--seamless" : "hero__image-wrapper"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt={blok.image?.alt || ""}
                loading="eager"
                width={blok.image_width || undefined}
                height={blok.image_height || undefined}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

type PartHeroBlok = SbBlok & {
  badge?: string;
  title?: string;
  subtitle?: string;
  buttons?: SbBlok[];
  image?: SbAsset;
  image_width?: string;
  image_height?: string;
};

export function PartHero({ blok }: { blok: PartHeroBlok }) {
  return (
    <section className="part-hero" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="part-hero__inner">
          <div className="part-hero__content">
            {blok.badge ? <span className="badge badge--gold">{blok.badge}</span> : null}
            <h1>{fmt(blok.title)}</h1>
            <p className="part-hero__subtitle sb-subtitle">{fmt(blok.subtitle)}</p>
            <div className="part-hero__actions">
              <Buttons buttons={blok.buttons} />
            </div>
          </div>

          <div className="part-hero__visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl(blok.image)}
              alt={blok.image?.alt || ""}
              loading="eager"
              width={blok.image_width || undefined}
              height={blok.image_height || undefined}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type ChrHeroBlok = SbBlok & {
  badge?: string;
  title?: string;
  subtitle?: string;
  buttons?: SbBlok[];
  background_image?: SbAsset; // vide = photo d'origine (css/chr.css)
  background?: string; // « Couleur de fond » : couleur du voile sur l'image (hex, vide = rouge foncé)
  overlay_opacity?: string | number; // opacité du voile en % (vide = 65)
  content_width?: string | number; // largeur max du bloc de texte en px (vide = 720)
  layout?: string; // vide / cover = texte centré sur la photo de fond ; split = texte à gauche, illustration à droite
  // Disposition « split » (onglet Illustration) : mêmes champs que le héros Bureau & Entreprise.
  image?: SbAsset;
  image_style?: string;
  image_scale?: string | number;
  content_spacing?: string | number;
  trust_items?: (SbBlok & { text?: string })[];
  text_shift?: string | number; // décalage du texte vers la gauche en px, disposition split (vide = 0)
  image_bleed?: boolean; // « Illustration collée au bord droit de l'écran », disposition split
};

// Voile du héros CHR (variable --chr-overlay, voir chr.css). Rien de renseigné = voile d'origine ;
// couleur seule = opacité d'origine (65 %) ; opacité seule = rouge foncé de la palette.
function chrOverlay(color: unknown, opacity: string | number | undefined): string | undefined {
  const hex = normalizeHex(color);
  const pct = opacity === undefined || opacity === null || String(opacity).trim() === "" ? undefined : pxOr(opacity, 65, 0, 100);
  if (!hex && pct === undefined) return undefined;
  const alpha = (pct ?? 65) / 100;
  return hex ? `rgba(${hexToRgbList(hex)}, ${alpha})` : `rgba(var(--rgb-espresso), ${alpha})`;
}

export function ChrHero({ blok }: { blok: ChrHeroBlok }) {
  // « Disposition » = texte à gauche, illustration à droite : rendu et styles du héros de la page
  // Bureau & Entreprise (landing.css, scope page-landing ajouté par Page.tsx), avec les textes,
  // boutons et typographie de ce bloc. Les champs de l'onglet Fond et la largeur du bloc de texte
  // ne servent qu'à la disposition centrée.
  if (blok.layout === "split") {
    return <LandingHero blok={{ ...blok, badge_text: blok.badge }} telLinks variant="chr" />;
  }
  // Onglet « Typographie » : badge, titre, sous-titre.
  const badge = badgeStyle(blok);
  const title = blockTextStyle(blok, "title");
  const subtitle = blockTextStyle(blok, "subtitle");
  // Onglet « Fond » : image, couleur et opacité du voile.
  const bg = assetUrl(blok.background_image);
  const overlay = chrOverlay(blok.background, blok.overlay_opacity);
  // « Largeur du bloc de texte (px) » : largeur max du badge, du titre, du sous-titre et des boutons.
  const rawWidth = blok.content_width;
  const contentWidth = rawWidth === undefined || rawWidth === null || String(rawWidth).trim() === "" ? 0 : pxOr(rawWidth, 0, 400, 1400);
  const sectionStyle: Record<string, string> = {};
  if (bg) sectionStyle.backgroundImage = `url("${bg}")`;
  if (overlay) sectionStyle["--chr-overlay"] = overlay;
  if (contentWidth) sectionStyle["--chr-content-width"] = `${contentWidth}px`;
  return (
    <section
      className="chr-hero"
      style={Object.keys(sectionStyle).length ? (sectionStyle as CSSProperties) : undefined}
      {...storyblokEditable(blok)}
    >
      <FontLink href={badge.href} />
      <FontLink href={title.href} />
      <FontLink href={subtitle.href} />
      <div className="container">
        <div className="chr-hero__content">
          {blok.badge ? <span className="badge badge--dark chr-hero__badge" style={badge.style}>{blok.badge}</span> : null}

          <h1 className="chr-hero__title" style={title.style}>{fmt(blok.title)}</h1>

          <p className="chr-hero__subtitle sb-subtitle" style={subtitle.style}>{fmtTel(blok.subtitle)}</p>

          <div className="chr-hero__actions">
            <Buttons buttons={blok.buttons} />
          </div>
        </div>
      </div>
    </section>
  );
}
