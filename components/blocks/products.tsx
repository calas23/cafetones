import type { CSSProperties } from "react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { PricingToggle } from "./PricingToggle";
import { Illustration, type IllustrationProps } from "@/components/Illustration";
import { fmt } from "@/lib/text";
import { assetUrl, type SbAsset, type SbBlok } from "@/lib/types";
import { aos } from "./common-sections";

// Cartes produit (une seule définition de bloc, plusieurs rendus selon la
// section) + sections produits. Les data-attributes alimentent la modale.

export type ProductCardBlok = SbBlok & {
  // Affichage carte
  display_name?: string;
  display_subtitle?: string;
  display_desc?: string;
  display_format?: string;
  display_price?: string;
  price_small?: string;
  price_detail?: string;
  badge_label?: string;
  badge_style?: string; // gold | simple
  medals_label?: string;
  seasonal_note?: string;
  categories?: string;
  patisserie_style?: boolean;
  delay?: string;
  image?: SbAsset;
  image_width?: string;
  image_height?: string;
  // Tarifs bureau (tableau + carte mobile)
  table_desc?: string;
  table_format?: string;
  table_price?: string;
  table_unit?: string;
  table_badge_label?: string;
  table_badge_style?: string;
  card_desc?: string;
  card_amount?: string;
  card_unit?: string;
  card_badge_label?: string;
  card_badge_style?: string;
  // Fiche détaillée (modale)
  name?: string;
  subtitle?: string;
  description?: string;
  acidity?: string;
  body?: string;
  intensity?: string;
  roast?: string;
  notes?: string;
  origins?: string;
  certifications?: string;
  medals?: string;
  caffeine?: string;
  ingredients?: string;
  ingredients_glaze?: string;
  weight?: string;
  packaging?: string;
  order_period?: string;
  format?: string;
  price?: string;
  machine_info?: string;
};

export function modalDataAttrs(p: ProductCardBlok): Record<string, string> {
  const attrs: Record<string, string> = { "data-product-modal": "" };
  const map: [string, string | undefined][] = [
    ["data-name", p.name],
    ["data-subtitle", p.subtitle],
    ["data-description", p.description],
    ["data-acidity", p.acidity],
    ["data-body", p.body],
    ["data-intensity", p.intensity],
    ["data-roast", p.roast],
    ["data-notes", p.notes],
    ["data-origins", p.origins],
    ["data-certifications", p.certifications],
    ["data-medals", p.medals],
    ["data-caffeine", p.caffeine],
    ["data-ingredients", p.ingredients],
    ["data-ingredients-glaze", p.ingredients_glaze],
    ["data-weight", p.weight],
    ["data-packaging", p.packaging],
    ["data-order-period", p.order_period],
    ["data-format", p.format],
    ["data-price", p.price],
    ["data-machine-info", p.machine_info],
    ["data-image", assetUrl(p.image) || undefined],
  ];
  for (const [k, v] of map) if (v) attrs[k] = v;
  if (p.categories) attrs["data-categories"] = p.categories;
  return attrs;
}

function Badge({ label, style, extraClass, inlineStyle }: { label?: string; style?: string; extraClass?: string; inlineStyle?: CSSProperties }) {
  if (!label) return null;
  const cls = ["badge", style === "gold" ? "badge--gold" : "", extraClass || ""].filter(Boolean).join(" ");
  return <span className={cls} style={inlineStyle}>{label}</span>;
}

function Medals({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <div className="card-medals">
      <span className="medal-icon">🥇</span>
      <span className="medal-count">{label}</span>
    </div>
  );
}

function CardImg({ p, lazy = true }: { p: ProductCardBlok; lazy?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={assetUrl(p.image)}
      alt={p.image?.alt || ""}
      loading={lazy ? "lazy" : undefined}
      width={p.image_width || undefined}
      height={p.image_height || undefined}
    />
  );
}

/* ---------------- Accueil : best-sellers ---------------- */

export function HomeProductCard({ p }: { p: ProductCardBlok }) {
  return (
    <div className={`home-product-card ${aos(p.delay)}`} {...modalDataAttrs(p)} {...storyblokEditable(p)}>
      <div className="home-product-card__image">
        <CardImg p={p} />
      </div>
      <div className="home-product-card__content">
        <Badge label={p.badge_label} style={p.badge_style} />
        <div className="home-product-card__name">{p.display_name}</div>
        <div className="home-product-card__desc">{p.display_desc}</div>
        <div className="home-product-card__price">{p.display_price}</div>
        <Medals label={p.medals_label} />
      </div>
    </div>
  );
}

type ProductsSectionBlok = SbBlok &
  IllustrationProps & {
    badge?: string;
    title?: string;
    subtitle?: string;
    products?: ProductCardBlok[];
    cta_label?: string;
    cta_link?: string;
  };

export function ProductsHomeSection({ blok }: { blok: ProductsSectionBlok }) {
  return (
    <section className="section" style={{ backgroundColor: "var(--color-white)" }} {...storyblokEditable(blok)}>
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
            <p className="text-muted" style={{ maxWidth: "560px", margin: "1rem auto 0" }}>{fmt(blok.subtitle)}</p>
          ) : null}
          <Illustration {...blok} />
        </div>

        <div className="home-products">
          {(blok.products ?? []).map((p) => (
            <HomeProductCard key={p._uid} p={p} />
          ))}
        </div>

        {blok.cta_label ? (
          <div className="text-center" style={{ marginTop: "3rem" }}>
            <a href={blok.cta_link || "#"} className="btn btn--secondary">{blok.cta_label}</a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ---------------- CHR : mélanges restauration ---------------- */

export function ChrProductCard({ p }: { p: ProductCardBlok }) {
  return (
    <div className={`chr-product-card ${aos(p.delay)}`} {...modalDataAttrs(p)} {...storyblokEditable(p)}>
      <div className="chr-product-card__image">
        <CardImg p={p} />
        <Badge label={p.badge_label} style={p.badge_style} />
      </div>
      <div className="chr-product-card__content">
        <div className="chr-product-card__name">{p.display_name}</div>
        <div className="chr-product-card__desc">{p.display_desc}</div>
        <div className="chr-product-card__price">{p.display_price}</div>
        <div className="chr-product-card__format">{p.display_format}</div>
        <Medals label={p.medals_label} />
      </div>
    </div>
  );
}

export function ChrProductsSection({ blok }: { blok: ProductsSectionBlok }) {
  return (
    <section className="section" style={{ backgroundColor: "var(--color-white)" }} {...storyblokEditable(blok)}>
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
            <p className="text-muted" style={{ maxWidth: "580px", margin: "1rem auto 0" }}>{fmt(blok.subtitle)}</p>
          ) : null}
          <Illustration {...blok} />
        </div>

        <div className="chr-products">
          {(blok.products ?? []).map((p) => (
            <ChrProductCard key={p._uid} p={p} />
          ))}
        </div>

        {blok.cta_label ? (
          <div className="text-center" style={{ marginTop: "3rem" }}>
            <a href={blok.cta_link || "#"} className="btn btn--secondary">{blok.cta_label}</a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ---------------- Gamme ---------------- */

export function GammeCard({ p }: { p: ProductCardBlok }) {
  const cls = ["gamme-card", p.patisserie_style ? "gamme-card--patisserie" : "", aos(p.delay)].filter(Boolean).join(" ");
  return (
    <div className={cls} style={{ cursor: "pointer" }} {...modalDataAttrs(p)} {...storyblokEditable(p)}>
      <div className="gamme-card__image">
        <CardImg p={p} />
        <Badge label={p.badge_label} style={p.badge_style} extraClass="gamme-card__badge" />
      </div>
      <div className="gamme-card__content">
        <div className="gamme-card__name">{p.display_name}</div>
        {p.display_subtitle ? <div className="gamme-card__subtitle">{p.display_subtitle}</div> : null}
        <div className="gamme-card__desc">{p.display_desc}</div>
        <div className="gamme-card__format">{p.display_format}</div>
        {p.display_price ? (
          <div className="gamme-card__price">
            {p.display_price}
            {p.price_small ? (
              <>
                {" "}
                <span style={{ fontSize: "0.82rem", fontWeight: 400 }}>{p.price_small}</span>
              </>
            ) : null}
          </div>
        ) : null}
        {p.price_detail ? <div className="price-detail">{p.price_detail}</div> : null}
        <Medals label={p.medals_label} />
        {p.seasonal_note ? <div className="seasonal-note">{p.seasonal_note}</div> : null}
      </div>
    </div>
  );
}

type GammeSectionBlok = SbBlok & {
  anchor_id?: string;
  section_cat?: string;
  title?: string;
  intro?: string;
  products?: ProductCardBlok[];
};

export function GammeSection({ blok }: { blok: GammeSectionBlok }) {
  return (
    <section
      className="gamme-section"
      id={blok.anchor_id || undefined}
      data-section-cat={blok.section_cat || undefined}
      {...storyblokEditable(blok)}
    >
      <div className="container">
        <div className="gamme-section__intro animate-on-scroll">
          <h2>{fmt(blok.title)}</h2>
          <p>{fmt(blok.intro)}</p>
        </div>
        <div className="gamme-cards">
          {(blok.products ?? []).map((p) => (
            <GammeCard key={p._uid} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

type PricingNoteBlok = SbBlok & { text?: string };

export function PricingNote({ blok }: { blok: PricingNoteBlok }) {
  return (
    <div className="pricing-global-note" {...storyblokEditable(blok)}>
      <span className="pricing-note-badge">{blok.text}</span>
    </div>
  );
}

/* ---------------- Bureau : tarifs (tableau + cartes mobiles) ---------------- */

type PricingSectionBlok = SbBlok &
  IllustrationProps & {
    anchor_id?: string;
    badge?: string;
    title?: string;
    subtitle?: string;
    products?: ProductCardBlok[];
    note?: string;
    cta_label?: string;
    cta_link?: string;
  };

export function PricingSection({ blok }: { blok: PricingSectionBlok }) {
  const products = blok.products ?? [];
  return (
    <section className="section" id={blok.anchor_id || undefined} {...storyblokEditable(blok)}>
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
            <p className="text-muted" style={{ maxWidth: "560px", margin: "1rem auto 0" }}>{fmt(blok.subtitle)}</p>
          ) : null}
          <Illustration {...blok} />
        </div>

        <div id="pricing-table-desktop" style={{ display: "none", marginTop: "3rem" }}>
          <table className="pricing-table">
            <thead>
              <tr>
                <th></th>
                <th>Produit</th>
                <th>Format</th>
                <th>Prix HT</th>
                <th>Prix unitaire</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._uid} {...modalDataAttrs(p)}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={assetUrl(p.image)} alt="" className="table-thumb" loading="lazy" />
                  </td>
                  <td>
                    <span className="product-name">{p.display_name}</span>
                    {p.table_badge_label ? (
                      <>
                        {" "}
                        <Badge label={p.table_badge_label} style={p.table_badge_style} inlineStyle={{ marginLeft: "0.5rem" }} />
                      </>
                    ) : null}
                    <div className="product-desc">{p.table_desc}</div>
                  </td>
                  <td>{p.table_format}</td>
                  <td className="price">{p.table_price}</td>
                  <td className="price-unit">{p.table_unit || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div id="pricing-cards-mobile" className="pricing-cards" style={{ marginTop: "3rem" }}>
          {products.map((p) => (
            <div className="pricing-card" key={p._uid} {...modalDataAttrs(p)}>
              <div>
                <div className="pricing-card__name">
                  {p.display_name}
                  {p.card_badge_label ? (
                    <>
                      {" "}
                      <Badge label={p.card_badge_label} style={p.card_badge_style} inlineStyle={{ marginLeft: "0.25rem" }} />
                    </>
                  ) : null}
                </div>
                <div className="pricing-card__desc">{p.card_desc}</div>
              </div>
              <div className="pricing-card__price">
                <div className="pricing-card__amount">
                  {p.card_amount} <span className="pricing-card__unit">{p.card_unit}</span>
                </div>
                <Medals label={p.medals_label} />
              </div>
            </div>
          ))}
        </div>

        {blok.note ? <p className="pricing-note">{blok.note}</p> : null}
        {blok.cta_label ? (
          <div className="text-center" style={{ marginTop: "1.5rem" }}>
            <a href={blok.cta_link || "#"} className="btn btn--secondary">{blok.cta_label}</a>
          </div>
        ) : null}
        <PricingToggle />
      </div>
    </section>
  );
}

/* ---------------- Particuliers ---------------- */

export function PartProductCard({ p }: { p: ProductCardBlok }) {
  return (
    <div className="part-product-card" {...modalDataAttrs(p)} {...storyblokEditable(p)}>
      <div className="part-product-card__image">
        <CardImg p={p} />
      </div>
      <div className="part-product-card__content">
        <Badge label={p.badge_label} style={p.badge_style} />
        <div className="part-product-card__name">{p.display_name}</div>
        <div className="part-product-card__desc">{p.display_desc}</div>
        <div className="part-product-card__price">{p.display_price}</div>
      </div>
    </div>
  );
}

type ProductGroupBlok = SbBlok & { title?: string; products?: ProductCardBlok[]; note?: string };
type PartProductsBlok = SbBlok & { badge?: string; title?: string; subtitle?: string; groups?: ProductGroupBlok[] };

export function PartProductsSection({ blok }: { blok: PartProductsBlok }) {
  return (
    <section className="section section--cream" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="text-center animate-on-scroll">
          {blok.badge ? <span className="badge badge--gold">{blok.badge}</span> : null}
          <h2 style={{ marginTop: "1rem" }}>{fmt(blok.title)}</h2>
          {blok.subtitle ? (
            <p className="text-muted" style={{ maxWidth: "580px", margin: "1rem auto 0" }}>{fmt(blok.subtitle)}</p>
          ) : null}
        </div>

        {(blok.groups ?? []).map((group) => (
          <div className="part-product-section animate-on-scroll" key={group._uid} {...storyblokEditable(group)}>
            <h3>{group.title}</h3>
            <div className="part-products">
              {(group.products ?? []).map((p) => (
                <PartProductCard key={p._uid} p={p} />
              ))}
            </div>
            {group.note ? <p className="part-capsule-note">{fmt(group.note)}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

type PastriesBlok = SbBlok & IllustrationProps & { title?: string; subtitle?: string; cards?: ProductCardBlok[] };

export function PastriesSection({ blok }: { blok: PastriesBlok }) {
  return (
    <section className="section" {...storyblokEditable(blok)}>
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

        <div className="part-pastries">
          {(blok.cards ?? []).map((p) => (
            <div className={`part-pastry-card ${aos(p.delay)}`} key={p._uid} {...modalDataAttrs(p)} {...storyblokEditable(p)}>
              <div className="part-pastry-card__image">
                <CardImg p={p} />
              </div>
              <div className="part-pastry-card__content">
                <h3>{p.display_name}</h3>
                <p>{p.display_desc}</p>
                <div className="part-pastry-card__format">{p.display_format}</div>
                <div className="part-pastry-card__order">{p.seasonal_note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CHR : compléments ---------------- */

type ExtraCard = SbBlok & {
  image?: SbAsset;
  title?: string;
  text?: string;
  note?: string;
  button_label?: string;
  button_link?: string;
  delay?: string;
};
type ChrExtrasBlok = SbBlok & { title?: string; subtitle?: string; cards?: ExtraCard[] };

export function ChrExtrasSection({ blok }: { blok: ChrExtrasBlok }) {
  return (
    <section className="section section--cream" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="text-center animate-on-scroll">
          <h2>{fmt(blok.title)}</h2>
          {blok.subtitle ? (
            <p className="text-muted" style={{ maxWidth: "540px", margin: "1rem auto 0" }}>{fmt(blok.subtitle)}</p>
          ) : null}
        </div>

        <div className="chr-extras">
          {(blok.cards ?? []).map((card) => {
            const imgUrl = assetUrl(card.image);
            return (
              <div className={`chr-extra-card ${aos(card.delay)}`} key={card._uid} {...storyblokEditable(card)}>
                {imgUrl ? (
                  <div className="chr-extra-card__image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt={card.image?.alt || ""} loading="lazy" />
                  </div>
                ) : null}
                <div className="chr-extra-card__body">
                  <h3>{card.title}</h3>
                  {paragraphsOf(card.text)}
                  {card.note ? <p className="chr-extra-card__note">{fmt(card.note)}</p> : null}
                  {card.button_label ? (
                    <a href={card.button_link || "#"} className="btn btn--secondary btn--sm">{card.button_label}</a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function paragraphsOf(text?: string) {
  if (!text) return null;
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => <p key={i}>{fmt(p)}</p>);
}
