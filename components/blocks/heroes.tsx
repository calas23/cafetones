import { storyblokEditable } from "@storyblok/react/rsc";
import { Icon } from "@/components/Icon";
import { fmt, fmtTel } from "@/lib/text";
import { assetUrl, type SbAsset, type SbBlok } from "@/lib/types";
import { Buttons } from "./shared";

// Les 5 héros du site, markup identique à l'original.

type HeroHomeBlok = SbBlok & {
  badge_logo?: SbAsset;
  badge_text?: string;
  title?: string;
  subtitle?: string;
  buttons?: SbBlok[];
};

export function HeroHome({ blok }: { blok: HeroHomeBlok }) {
  return (
    <section className="home-hero" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="home-hero__content">
          <div className="home-hero__badge-logo" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {assetUrl(blok.badge_logo) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={assetUrl(blok.badge_logo)}
                alt={blok.badge_logo?.alt || "TONES"}
                style={{ height: "30px", width: "auto", filter: "brightness(0) invert(1)" }}
              />
            ) : null}
            {blok.badge_text ? <span className="badge badge--dark">{blok.badge_text}</span> : null}
          </div>

          <h1 className="home-hero__title">{fmt(blok.title)}</h1>

          <p className="home-hero__subtitle">{fmt(blok.subtitle)}</p>

          <div className="home-hero__actions">
            <Buttons buttons={blok.buttons} />
          </div>
        </div>
      </div>
    </section>
  );
}

type PageHeroBlok = SbBlok & { badge?: string; title?: string; text?: string };

export function PageHero({ blok }: { blok: PageHeroBlok }) {
  return (
    <section className="page-hero" {...storyblokEditable(blok)}>
      <div className="container">
        {blok.badge ? <span className="badge badge--gold">{blok.badge}</span> : null}
        <h1 style={{ marginTop: "1rem" }}>{fmt(blok.title)}</h1>
        {blok.text ? (
          <p className="text-muted" style={{ marginTop: "0.75rem" }}>{fmt(blok.text)}</p>
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
};

export function LandingHero({ blok }: { blok: LandingHeroBlok }) {
  return (
    <section className="hero" {...storyblokEditable(blok)}>
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="badge badge--gold hero__badge">
            <Icon name="star" size={14} stroke={2} /> {blok.badge_text}
          </span>

          <h1 className="hero__title">{fmt(blok.title)}</h1>

          <p className="hero__subtitle">{fmt(blok.subtitle)}</p>

          <div className="hero__actions">
            <Buttons buttons={blok.buttons} />
          </div>

          <div className="hero__trust">
            {(blok.trust_items ?? []).map((t) => (
              <span className="hero__trust-item" key={t._uid}>
                <Icon name="check" size={16} stroke={2} /> {t.text}
              </span>
            ))}
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__image-wrapper">
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
            <p className="part-hero__subtitle">{fmt(blok.subtitle)}</p>
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
};

export function ChrHero({ blok }: { blok: ChrHeroBlok }) {
  return (
    <section className="chr-hero" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="chr-hero__content">
          {blok.badge ? <span className="badge badge--dark chr-hero__badge">{blok.badge}</span> : null}

          <h1 className="chr-hero__title">{fmt(blok.title)}</h1>

          <p className="chr-hero__subtitle">{fmtTel(blok.subtitle)}</p>

          <div className="chr-hero__actions">
            <Buttons buttons={blok.buttons} />
          </div>
        </div>
      </div>
    </section>
  );
}
