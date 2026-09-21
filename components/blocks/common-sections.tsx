import { pxOr } from "@/lib/num";
import type { CSSProperties } from "react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { badgeStyle, blockTextStyle } from "@/lib/fonts";
import { FontLink } from "@/components/FontLink";
import { Icon } from "@/components/Icon";
import { Illustration, type IllustrationProps } from "@/components/Illustration";
import { fmt, fmtTel, paragraphs } from "@/lib/text";
import { assetUrl, type SbAsset, type SbBlok } from "@/lib/types";
import { Buttons } from "./shared";

// Sections transverses — markup copié de l'existant, textes depuis Storyblok.

export function aos(delay?: string): string {
  return delay ? `animate-on-scroll delay-${delay}` : "animate-on-scroll";
}

type StatItem = SbBlok & { number?: string; label?: string; delay?: string };
type StatsBlok = SbBlok & IllustrationProps & { items?: StatItem[] };

export function StatsSection({ blok }: { blok: StatsBlok }) {
  return (
    <section className="section--sm section--cream" {...storyblokEditable(blok)}>
      <div
        className="container"
        style={{ position: "relative" }}
      >
        <div className="home-stats">
          {(blok.items ?? []).map((item) => (
            <div className={aos(item.delay)} key={item._uid}>
              <div className="home-stats__number">{item.number}</div>
              <div className="home-stats__label">{item.label}</div>
            </div>
          ))}
        </div>
        <Illustration {...blok} />
      </div>
    </section>
  );
}

type UniverseCard = SbBlok & {
  image?: SbAsset;
  image_width?: string;
  image_height?: string;
  badge?: string;
  title?: string;
  text?: string;
  button_label?: string;
  button_link?: string;
  button_style?: string;
  hidden?: boolean;
  delay?: string;
};
type UniversesBlok = SbBlok & { title?: string; subtitle?: string; cards?: UniverseCard[] };

export function UniversesSection({ blok }: { blok: UniversesBlok }) {
  return (
    <section className="section" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="text-center animate-on-scroll">
          <h2>{fmt(blok.title)}</h2>
          {blok.subtitle ? (
            <p className="text-muted sb-subtitle" style={{ maxWidth: "560px", margin: "1rem auto 0" }}>{fmt(blok.subtitle)}</p>
          ) : null}
        </div>

        <div className="home-universes">
          {(blok.cards ?? []).map((card) => (
            <div className={`home-universe-card ${aos(card.delay)}${card.hidden ? " card-hidden" : ""}`} key={card._uid}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetUrl(card.image)}
                alt={card.image?.alt || ""}
                loading="lazy"
                width={card.image_width || undefined}
                height={card.image_height || undefined}
              />
              <div className="home-universe-card__content">
                {card.badge ? <span className="badge badge--gold">{card.badge}</span> : null}
                <h3>{card.title}</h3>
                <p>{fmt(card.text)}</p>
                <a href={card.button_link || "#"} className={`btn btn--${card.button_style || "secondary"}`}>
                  {card.button_label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type EspressoTextBlok = SbBlok & {
  badge?: string;
  title?: string;
  text?: string;
  buttons?: SbBlok[];
  layout?: string; // center (défaut) | split : texte à gauche, image à droite
  image_gap?: string | number; // espace entre le texte et l'image en px (vide = 64, ordinateur)
  image?: SbAsset; // colonne de droite (disposition split)
  image_style?: string; // card (coins arrondis, défaut) | seamless (sans cadre)
  image_scale?: string | number; // taille de l'image en % (vide = 100), échelle visuelle centrée
};

export function EspressoTextSection({ blok }: { blok: EspressoTextBlok }) {
  const paras = paragraphs(blok.text);
  // Onglet « Typographie » : badge, titre, paragraphes.
  const badge = badgeStyle(blok);
  const title = blockTextStyle(blok, "title");
  const text = blockTextStyle(blok, "text");
  const content = (
    <>
      {blok.badge ? <span className="badge badge--dark" style={badge.style}>{blok.badge}</span> : null}
      <h2 style={{ marginTop: "1rem", ...title.style }}>{fmt(blok.title)}</h2>
      {paras.map((p, i) => (
        <p key={i} style={{ color: "var(--color-cream-dark)", ...(i === 0 ? { marginTop: "1.5rem" } : {}), ...text.style }}>
          {fmt(p)}
        </p>
      ))}
      <Buttons buttons={blok.buttons} />
    </>
  );
  // Onglet « Image » : disposition texte à gauche + image à droite (css/style.css, .espresso-split).
  const split = blok.layout === "split";
  const imgUrl = assetUrl(blok.image);
  const rawImg = blok.image_scale;
  const imgScale = rawImg === undefined || rawImg === null || String(rawImg).trim() === "" ? 100 : pxOr(rawImg as string | number, 100, 30, 150);
  const imgStyle = imgScale !== 100 ? ({ transform: `scale(${imgScale / 100})` } as CSSProperties) : undefined;
  // « Espace entre le texte et l'image (px) » : gap de la grille deux colonnes (vide = 4rem d'origine).
  const rawGap = blok.image_gap;
  const gap = rawGap === undefined || rawGap === null || String(rawGap).trim() === "" ? -1 : pxOr(rawGap as string | number, -1, 0, 300);
  const splitStyle = gap >= 0 ? ({ "--espresso-gap": `${gap}px` } as CSSProperties) : undefined;
  return (
    <section className="section section--espresso" {...storyblokEditable(blok)}>
      <FontLink href={badge.href} />
      <FontLink href={title.href} />
      <FontLink href={text.href} />
      <div className="container">
        {split ? (
          <div className="espresso-split" style={splitStyle}>
            <div className="espresso-split__text animate-on-scroll">{content}</div>
            {imgUrl ? (
              <div className={blok.image_style === "seamless" ? "espresso-split__visual espresso-split__visual--seamless animate-on-scroll delay-1" : "espresso-split__visual animate-on-scroll delay-1"}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl} alt={blok.image?.alt || ""} loading="lazy" style={imgStyle} />
              </div>
            ) : (
              <div className="espresso-split__visual" aria-hidden="true" />
            )}
          </div>
        ) : (
          <div className="text-center animate-on-scroll" style={{ maxWidth: "700px", margin: "0 auto" }}>
            {content}
          </div>
        )}
      </div>
    </section>
  );
}

type CertificationBadge = SbBlok & { name?: string; caption?: string };
type CertificationsBlok = SbBlok & { title?: string; items?: CertificationBadge[] };

export function CertificationsSection({ blok }: { blok: CertificationsBlok }) {
  const title = blockTextStyle(blok, "title"); // onglet « Typographie »
  return (
    <section className="section section--cream-warm certifications-home" {...storyblokEditable(blok)}>
      <FontLink href={title.href} />
      <div className="container">
        <div className="text-center animate-on-scroll">
          <h2 style={title.style}>{fmt(blok.title)}</h2>
        </div>
        <div className="certifications-grid animate-on-scroll delay-1">
          {(blok.items ?? []).map((item) => (
            <div className="certification-badge" key={item._uid}>
              <strong>{item.name}</strong>
              <span>{item.caption}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type ReassuranceItem = SbBlok & { icon?: string; title?: string; text?: string; delay?: string };
type ReassuranceBlok = SbBlok & { items?: ReassuranceItem[] };

export function ReassuranceSection({ blok }: { blok: ReassuranceBlok }) {
  return (
    <section className="section--sm section--cream" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="reassurance">
          {(blok.items ?? []).map((item) => (
            <div className={`reassurance__item ${aos(item.delay)}`} key={item._uid}>
              <div className="reassurance__icon">
                <Icon name={item.icon || "check"} size={24} stroke={1.8} />
              </div>
              <div className="reassurance__text">
                {fmtTel(item.title)}
                <span>{fmt(item.text)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type StepItem = SbBlok & { title?: string; text?: string; delay?: string };
type StepsBlok = SbBlok &
  IllustrationProps & { anchor_id?: string; badge?: string; title?: string; subtitle?: string; steps?: StepItem[] };

export function StepsSection({ blok }: { blok: StepsBlok }) {
  // Onglet « Typographie » : badge, titre, sous-titre.
  const badge = badgeStyle(blok);
  const title = blockTextStyle(blok, "title");
  const subtitle = blockTextStyle(blok, "subtitle");
  return (
    <section className="section steps" id={blok.anchor_id || undefined} {...storyblokEditable(blok)}>
      <FontLink href={badge.href} />
      <FontLink href={title.href} />
      <FontLink href={subtitle.href} />
      <div className="container">
        <div
          className="text-center animate-on-scroll"
          style={{ position: "relative" }}
        >
          {blok.badge ? <span className="badge badge--gold" style={badge.style}>{blok.badge}</span> : null}
          <h2 style={{ marginTop: "1rem", ...title.style }}>{fmt(blok.title)}</h2>
          {blok.subtitle ? (
            <p className="text-muted sb-subtitle" style={{ maxWidth: "540px", margin: "1rem auto 0", ...subtitle.style }}>{fmt(blok.subtitle)}</p>
          ) : null}
          <Illustration {...blok} />
        </div>

        <div className="steps__grid">
          {(blok.steps ?? []).map((step) => (
            <div className={`step ${aos(step.delay)}`} key={step._uid}>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__text">{fmtTel(step.text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type B2bCard = SbBlok & { icon?: string; title?: string; text?: string; delay?: string };
type B2bBlok = SbBlok & {
  background?: string; // default | cream
  badge?: string;
  title?: string;
  grid_margin_top?: boolean;
  cards?: B2bCard[];
};

export function B2bSection({ blok }: { blok: B2bBlok }) {
  const sectionClass = blok.background === "cream" ? "section section--cream" : "section";
  // Onglet « Typographie » : badge, titre.
  const badge = badgeStyle(blok);
  const title = blockTextStyle(blok, "title");
  const titleStyle = { ...(blok.badge ? { marginTop: "1rem" } : {}), ...title.style };
  return (
    <section className={sectionClass} {...storyblokEditable(blok)}>
      <FontLink href={badge.href} />
      <FontLink href={title.href} />
      <div className="container">
        <div className="text-center animate-on-scroll">
          {blok.badge ? <span className="badge badge--gold" style={badge.style}>{blok.badge}</span> : null}
          <h2 style={Object.keys(titleStyle).length ? titleStyle : undefined}>{fmt(blok.title)}</h2>
        </div>

        <div className="b2b-grid" style={blok.grid_margin_top ? { marginTop: "2rem" } : undefined}>
          {(blok.cards ?? []).map((card) => (
            <div className={`b2b-card ${aos(card.delay)}`} key={card._uid}>
              <div className="b2b-card__icon">
                <Icon name={card.icon || "check"} size={22} stroke={1.8} />
              </div>
              <div>
                <div className="b2b-card__title">{fmtTel(card.title)}</div>
                <p className="b2b-card__text">{fmt(card.text)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type CtaBlok = SbBlok & { theme?: string; title?: string; text?: string; buttons?: SbBlok[] };

export function CtaSection({ blok }: { blok: CtaBlok }) {
  // Onglet « Typographie » : titre, texte.
  const title = blockTextStyle(blok, "title");
  const titleStyle = { ...title.style };
  const body = blockTextStyle(blok, "text");
  if (blok.theme === "espresso") {
    return (
      <section className="section section--espresso" style={{ padding: "5rem 0" }} {...storyblokEditable(blok)}>
        <FontLink href={title.href} />
        <FontLink href={body.href} />
        <div className="container text-center">
          <h2 style={{ color: "var(--color-cream)", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", ...title.style }}>{fmt(blok.title)}</h2>
          <p className="sb-subtitle" style={{ color: "var(--color-cream-dark)", maxWidth: "540px", margin: "1rem auto 2rem", ...body.style }}>{fmt(blok.text)}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <Buttons buttons={blok.buttons} />
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="section section--cream" {...storyblokEditable(blok)}>
      <FontLink href={title.href} />
      <FontLink href={body.href} />
      <div className="container text-center">
        <h2 style={Object.keys(titleStyle).length ? titleStyle : undefined}>{fmt(blok.title)}</h2>
        <p className="text-muted sb-subtitle" style={{ maxWidth: "540px", margin: "1rem auto 2rem", ...body.style }}>{fmt(blok.text)}</p>
        <Buttons buttons={blok.buttons} />
      </div>
    </section>
  );
}
