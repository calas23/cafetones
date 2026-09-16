import type { CSSProperties } from "react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { blockTextStyle } from "@/lib/fonts";
import { pxOr } from "@/lib/num";
import { FontLink } from "@/components/FontLink";
import { Icon } from "@/components/Icon";
import { Illustration, type IllustrationProps } from "@/components/Illustration";
import { fmt, paragraphs } from "@/lib/text";
import { assetUrl, type SbAsset, type SbBlok } from "@/lib/types";
import { aos } from "./common-sections";

// Sections de la page À propos.

type AboutStoryBlok = SbBlok & {
  title?: string;
  text?: string;
  image?: SbAsset;
  image_width?: string;
  image_height?: string;
  quote?: string;
  quote_author?: string;
};

export function AboutStorySection({ blok }: { blok: AboutStoryBlok }) {
  const paras = paragraphs(blok.text);
  // Onglet « Typographie » : titre.
  const title = blockTextStyle(blok, "title");
  const titleStyle = { ...title.style };
  return (
    <section className="section" {...storyblokEditable(blok)}>
      <FontLink href={title.href} />
      <div className="container">
        <div className="about-story">
          <div className="about-story__text animate-on-scroll">
            <h2 style={Object.keys(titleStyle).length ? titleStyle : undefined}>{fmt(blok.title)}</h2>
            {paras.map((p, i) => (
              <p key={i} style={i === 0 ? { marginTop: "1.5rem" } : undefined}>{fmt(p)}</p>
            ))}
          </div>

          <div className="about-story__visual animate-on-scroll delay-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl(blok.image)}
              alt={blok.image?.alt || ""}
              loading="lazy"
              width={blok.image_width || undefined}
              height={blok.image_height || undefined}
            />
            <blockquote className="about-quote">
              {blok.quote}
              <span>{blok.quote_author}</span>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

type BlendItem = SbBlok & { name?: string; text?: string };
type RoasterCard = SbBlok & {
  name?: string;
  since?: string;
  image?: SbAsset; // image optionnelle en haut de la carte
  image_fit?: string; // cover (photo, défaut) | contain (logo)
  text?: string;
  blends_title?: string;
  blends?: BlendItem[];
  delay?: string;
};
type RoastersBlok = SbBlok &
  IllustrationProps & {
    title?: string;
    subtitle?: string;
    roasters?: RoasterCard[];
    image_scale?: string | number; // taille des photos en % (vide = 100)
    card_gap?: string | number; // espace entre les cartes en px (vide = 32)
  };

export function RoastersSection({ blok }: { blok: RoastersBlok }) {
  // Onglet « Typographie » : titre, sous-titre.
  const title = blockTextStyle(blok, "title");
  const titleStyle = { ...title.style };
  const subtitle = blockTextStyle(blok, "subtitle");
  // « Taille des photos (%) » : multiplicateur de la hauteur de la zone image des cartes (css/about.css).
  const rawImg = blok.image_scale;
  const imgScale = rawImg === undefined || rawImg === null || String(rawImg).trim() === "" ? 100 : pxOr(rawImg as string | number, 100, 50, 250);
  // « Espace entre les cartes (px) » : gap de la grille (vide = 2rem d'origine, css/about.css).
  const rawGap = blok.card_gap;
  const gap = rawGap === undefined || rawGap === null || String(rawGap).trim() === "" ? -1 : pxOr(rawGap as string | number, -1, 0, 200);
  const gridStyle: Record<string, string | number> = {};
  if (imgScale !== 100) gridStyle["--roaster-img-scale"] = imgScale / 100;
  if (gap >= 0) gridStyle["--roaster-gap"] = `${gap}px`;
  return (
    <section className="section section--cream" {...storyblokEditable(blok)}>
      <FontLink href={title.href} />
      <FontLink href={subtitle.href} />
      <div className="container">
        <div
          className="text-center animate-on-scroll"
          data-illustration={blok.illustration || undefined}
          data-illustration-position={blok.illustration_position || undefined}
          data-illustration-size={blok.illustration_size || undefined}
          style={{ position: "relative" }}
        >
          <h2 style={Object.keys(titleStyle).length ? titleStyle : undefined}>{fmt(blok.title)}</h2>
          {blok.subtitle ? (
            <p className="text-muted sb-subtitle" style={{ maxWidth: "560px", margin: "1rem auto 0", ...subtitle.style }}>{fmt(blok.subtitle)}</p>
          ) : null}
          <Illustration {...blok} />
        </div>

        <div className="about-roasters" style={Object.keys(gridStyle).length ? (gridStyle as CSSProperties) : undefined}>
          {(blok.roasters ?? []).map((r) => (
            <div className={`about-roaster-card ${aos(r.delay)}`} key={r._uid} {...storyblokEditable(r)}>
              {assetUrl(r.image) ? (
                <div className={r.image_fit === "contain" ? "about-roaster-card__image about-roaster-card__image--contain" : "about-roaster-card__image"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl(r.image)} alt={r.image?.alt || r.name || ""} loading="lazy" />
                </div>
              ) : null}
              <div className="about-roaster-card__header">
                <div className="about-roaster-card__name">{r.name}</div>
                <div className="about-roaster-card__since">{r.since}</div>
              </div>
              <div className="about-roaster-card__body">
                {paragraphs(r.text).map((p, i) => (
                  <p key={i}>{fmt(p)}</p>
                ))}
                {r.blends_title ? <h4>{r.blends_title}</h4> : null}
                <div className="about-blend-list">
                  {(r.blends ?? []).map((b) => (
                    <div className="about-blend-item" key={b._uid}>
                      <strong>{b.name}</strong>
                      {b.text ? <> — {b.text}</> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type CertCard = SbBlok & { icon?: string; image?: SbAsset; title?: string; text?: string; delay?: string };
type CertCardsBlok = SbBlok & {
  background?: string;
  title?: string;
  subtitle?: string;
  cards?: CertCard[];
  logo_scale?: string | number; // taille de la zone logo en % (vide = 100)
};

export function CertCardsSection({ blok }: { blok: CertCardsBlok }) {
  const sectionClass = blok.background === "cream" ? "section section--cream" : "section";
  // Onglet « Typographie » : titre, sous-titre.
  const title = blockTextStyle(blok, "title");
  const titleStyle = { ...title.style };
  const subtitle = blockTextStyle(blok, "subtitle");
  // « Taille des logos (%) » : multiplicateur de la zone logo des cartes (css/about.css).
  const rawLogo = blok.logo_scale;
  const logoScale = rawLogo === undefined || rawLogo === null || String(rawLogo).trim() === "" ? 100 : pxOr(rawLogo as string | number, 100, 50, 250);
  return (
    <section className={sectionClass} {...storyblokEditable(blok)}>
      <FontLink href={title.href} />
      <FontLink href={subtitle.href} />
      <div className="container">
        <div className="text-center animate-on-scroll">
          <h2 style={Object.keys(titleStyle).length ? titleStyle : undefined}>{fmt(blok.title)}</h2>
          {blok.subtitle ? (
            <p className="text-muted sb-subtitle" style={{ maxWidth: "560px", margin: "1rem auto 0", ...subtitle.style }}>{fmt(blok.subtitle)}</p>
          ) : null}
        </div>

        <div className="about-certs" style={logoScale !== 100 ? ({ "--cert-logo-scale": logoScale / 100 } as CSSProperties) : undefined}>
          {(blok.cards ?? []).map((card) => (
            <div className={`about-cert-card ${aos(card.delay)}`} key={card._uid} {...storyblokEditable(card)}>
              {assetUrl(card.image) ? (
                <div className="about-cert-card__logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl(card.image)} alt={card.image?.alt || card.title || ""} loading="lazy" />
                </div>
              ) : (
                <div className="about-cert-card__icon">
                  <Icon name={card.icon || "check"} size={26} stroke={1.8} />
                </div>
              )}
              <h4>{card.title}</h4>
              <p>{fmt(card.text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type TraitItem = SbBlok & { label?: string; desc?: string };
type AirpurBlok = SbBlok & { title?: string; text?: string; traits?: TraitItem[] };

export function AirpurSection({ blok }: { blok: AirpurBlok }) {
  const paras = paragraphs(blok.text);
  // Onglet « Typographie » : titre.
  const title = blockTextStyle(blok, "title");
  return (
    <section className="section section--espresso" {...storyblokEditable(blok)}>
      <FontLink href={title.href} />
      <div className="container">
        <div className="about-airpur">
          <div className="about-airpur__text animate-on-scroll">
            <h2 style={{ color: "var(--color-cream)", ...title.style }}>{fmt(blok.title)}</h2>
            {paras.map((p, i) => (
              <p key={i} style={i === 0 ? { marginTop: "1.5rem" } : undefined}>{fmt(p)}</p>
            ))}
          </div>

          <div className="about-airpur__card animate-on-scroll delay-1">
            {(blok.traits ?? []).map((t) => (
              <div className="about-airpur__trait" key={t._uid}>
                <div className="about-airpur__trait-label">{t.label}</div>
                <div className="about-airpur__trait-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
