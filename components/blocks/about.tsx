import { storyblokEditable } from "@storyblok/react/rsc";
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
  return (
    <section className="section" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="about-story">
          <div className="about-story__text animate-on-scroll">
            <h2>{fmt(blok.title)}</h2>
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
  text?: string;
  blends_title?: string;
  blends?: BlendItem[];
  delay?: string;
};
type RoastersBlok = SbBlok & IllustrationProps & { title?: string; subtitle?: string; roasters?: RoasterCard[] };

export function RoastersSection({ blok }: { blok: RoastersBlok }) {
  return (
    <section className="section section--cream" {...storyblokEditable(blok)}>
      <div className="container">
        <div
          className="text-center animate-on-scroll"
          data-illustration={blok.illustration || undefined}
          data-illustration-position={blok.illustration_position || undefined}
          data-illustration-size={blok.illustration_size || undefined}
          style={{ position: "relative" }}
        >
          <h2>{fmt(blok.title)}</h2>
          {blok.subtitle ? (
            <p className="text-muted" style={{ maxWidth: "560px", margin: "1rem auto 0" }}>{fmt(blok.subtitle)}</p>
          ) : null}
          <Illustration {...blok} />
        </div>

        <div className="about-roasters">
          {(blok.roasters ?? []).map((r) => (
            <div className={`about-roaster-card ${aos(r.delay)}`} key={r._uid} {...storyblokEditable(r)}>
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

type CertCard = SbBlok & { icon?: string; title?: string; text?: string; delay?: string };
type CertCardsBlok = SbBlok & { background?: string; title?: string; subtitle?: string; cards?: CertCard[] };

export function CertCardsSection({ blok }: { blok: CertCardsBlok }) {
  const sectionClass = blok.background === "cream" ? "section section--cream" : "section";
  return (
    <section className={sectionClass} {...storyblokEditable(blok)}>
      <div className="container">
        <div className="text-center animate-on-scroll">
          <h2>{fmt(blok.title)}</h2>
          {blok.subtitle ? (
            <p className="text-muted" style={{ maxWidth: "560px", margin: "1rem auto 0" }}>{fmt(blok.subtitle)}</p>
          ) : null}
        </div>

        <div className="about-certs">
          {(blok.cards ?? []).map((card) => (
            <div className={`about-cert-card ${aos(card.delay)}`} key={card._uid} {...storyblokEditable(card)}>
              <div className="about-cert-card__icon">
                <Icon name={card.icon || "check"} size={26} stroke={1.8} />
              </div>
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
  return (
    <section className="section section--espresso" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="about-airpur">
          <div className="about-airpur__text animate-on-scroll">
            <h2 style={{ color: "var(--color-cream)" }}>{fmt(blok.title)}</h2>
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
