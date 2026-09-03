import { storyblokEditable } from "@storyblok/react/rsc";
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
        data-illustration={blok.illustration || undefined}
        data-illustration-position={blok.illustration_position || undefined}
        data-illustration-size={blok.illustration_size || undefined}
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
            <p className="text-muted" style={{ maxWidth: "560px", margin: "1rem auto 0" }}>{fmt(blok.subtitle)}</p>
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

type EspressoTextBlok = SbBlok & { badge?: string; title?: string; text?: string; buttons?: SbBlok[] };

export function EspressoTextSection({ blok }: { blok: EspressoTextBlok }) {
  const paras = paragraphs(blok.text);
  return (
    <section className="section section--espresso" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="text-center animate-on-scroll" style={{ maxWidth: "700px", margin: "0 auto" }}>
          {blok.badge ? <span className="badge badge--dark">{blok.badge}</span> : null}
          <h2 style={{ marginTop: "1rem" }}>{fmt(blok.title)}</h2>
          {paras.map((p, i) => (
            <p key={i} style={i === 0 ? { color: "var(--color-cream-dark)", marginTop: "1.5rem" } : { color: "var(--color-cream-dark)" }}>
              {fmt(p)}
            </p>
          ))}
          <Buttons buttons={blok.buttons} />
        </div>
      </div>
    </section>
  );
}

type CertificationBadge = SbBlok & { name?: string; caption?: string };
type CertificationsBlok = SbBlok & { title?: string; items?: CertificationBadge[] };

export function CertificationsSection({ blok }: { blok: CertificationsBlok }) {
  return (
    <section className="section section--cream-warm certifications-home" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="text-center animate-on-scroll">
          <h2>{fmt(blok.title)}</h2>
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
  return (
    <section className="section steps" id={blok.anchor_id || undefined} {...storyblokEditable(blok)}>
      <div className="container">
        <div
          className="text-center animate-on-scroll"
          data-illustration={blok.illustration || undefined}
          data-illustration-position={blok.illustration_position || undefined}
          data-illustration-size={blok.illustration_size || undefined}
          style={{ position: "relative" }}
        >
          {blok.badge ? <span className="badge badge--gold">{blok.badge}</span> : null}
          <h2 style={{ marginTop: "1rem" }}>{fmt(blok.title)}</h2>
          {blok.subtitle ? (
            <p className="text-muted" style={{ maxWidth: "540px", margin: "1rem auto 0" }}>{fmt(blok.subtitle)}</p>
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
  return (
    <section className={sectionClass} {...storyblokEditable(blok)}>
      <div className="container">
        <div className="text-center animate-on-scroll">
          {blok.badge ? <span className="badge badge--gold">{blok.badge}</span> : null}
          <h2 style={blok.badge ? { marginTop: "1rem" } : undefined}>{fmt(blok.title)}</h2>
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
  if (blok.theme === "espresso") {
    return (
      <section className="section section--espresso" style={{ padding: "5rem 0" }} {...storyblokEditable(blok)}>
        <div className="container text-center">
          <h2 style={{ color: "var(--color-cream)", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>{fmt(blok.title)}</h2>
          <p style={{ color: "var(--color-cream-dark)", maxWidth: "540px", margin: "1rem auto 2rem" }}>{fmt(blok.text)}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <Buttons buttons={blok.buttons} />
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="section section--cream" {...storyblokEditable(blok)}>
      <div className="container text-center">
        <h2>{fmt(blok.title)}</h2>
        <p className="text-muted" style={{ maxWidth: "540px", margin: "1rem auto 2rem" }}>{fmt(blok.text)}</p>
        <Buttons buttons={blok.buttons} />
      </div>
    </section>
  );
}
