"use client";

import type { ReactNode } from "react";
import { BlockButton } from "@/components/blocks/shared";
import { Icon } from "@/components/Icon";

// Composants TONES exposés à l'éditeur Plasmic : mêmes classes CSS que le
// site, donc même rendu. Pas de classe animate-on-scroll ici (les éléments
// doivent être visibles immédiatement dans le canvas de Plasmic Studio).

export function TonesButton(props: {
  label?: string;
  link?: string;
  style?: string;
  size?: string;
  icon?: string;
  className?: string;
}) {
  return (
    <span className={props.className} style={{ display: "inline-block" }}>
      <BlockButton
        blok={{
          _uid: "plasmic-button",
          component: "button",
          label: props.label ?? "Demander un devis",
          link: props.link ?? "/pages/contact",
          style: props.style ?? "primary",
          size: props.size ?? "",
          icon: props.icon ?? "none",
        }}
      />
    </span>
  );
}

export function TonesBadge(props: { label?: string; gold?: boolean; dark?: boolean; className?: string }) {
  const cls = ["badge", props.gold ? "badge--gold" : "", props.dark ? "badge--dark" : "", props.className ?? ""]
    .filter(Boolean)
    .join(" ");
  return <span className={cls}>{props.label ?? "Badge"}</span>;
}

export function TonesSection(props: {
  background?: string; // default | cream | espresso | white
  badge?: string;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}) {
  const bg = props.background ?? "default";
  const sectionClass = ["section", bg === "cream" ? "section--cream" : "", bg === "espresso" ? "section--espresso" : "", props.className ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <section className={sectionClass} style={bg === "white" ? { backgroundColor: "var(--color-white)" } : undefined}>
      <div className="container">
        {props.badge || props.title || props.subtitle ? (
          <div className="text-center">
            {props.badge ? <span className={bg === "espresso" ? "badge badge--dark" : "badge badge--gold"}>{props.badge}</span> : null}
            {props.title ? <h2 style={props.badge ? { marginTop: "1rem" } : undefined}>{props.title}</h2> : null}
            {props.subtitle ? (
              <p className="text-muted" style={{ maxWidth: "560px", margin: "1rem auto 0" }}>{props.subtitle}</p>
            ) : null}
          </div>
        ) : null}
        {props.children}
      </div>
    </section>
  );
}

export function TonesProductCard(props: {
  image?: string;
  imageAlt?: string;
  badge?: string;
  badgeGold?: boolean;
  name?: string;
  description?: string;
  price?: string;
  medals?: string;
  detailName?: string;
  detailSubtitle?: string;
  detailDescription?: string;
  detailFormat?: string;
  detailPrice?: string;
  detailNotes?: string;
  className?: string;
}) {
  const data: Record<string, string> = { "data-product-modal": "" };
  if (props.detailName) data["data-name"] = props.detailName;
  if (props.detailSubtitle) data["data-subtitle"] = props.detailSubtitle;
  if (props.detailDescription) data["data-description"] = props.detailDescription;
  if (props.detailFormat) data["data-format"] = props.detailFormat;
  if (props.detailPrice) data["data-price"] = props.detailPrice;
  if (props.detailNotes) data["data-notes"] = props.detailNotes;
  if (props.image) data["data-image"] = props.image;
  return (
    <div className={["home-product-card", props.className ?? ""].filter(Boolean).join(" ")} {...data}>
      <div className="home-product-card__image">
        {props.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={props.image} alt={props.imageAlt ?? ""} loading="lazy" />
        ) : null}
      </div>
      <div className="home-product-card__content">
        {props.badge ? <span className={props.badgeGold ? "badge badge--gold" : "badge"}>{props.badge}</span> : null}
        <div className="home-product-card__name">{props.name ?? "Nom du produit"}</div>
        <div className="home-product-card__desc">{props.description ?? ""}</div>
        <div className="home-product-card__price">{props.price ?? ""}</div>
        {props.medals ? (
          <div className="card-medals">
            <span className="medal-icon">🥇</span>
            <span className="medal-count">{props.medals}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function TonesProductGrid(props: { children?: ReactNode; className?: string }) {
  return <div className={["home-products", props.className ?? ""].filter(Boolean).join(" ")}>{props.children}</div>;
}

export function TonesIcon(props: { name?: string; size?: number; className?: string }) {
  return (
    <span className={props.className} style={{ display: "inline-flex" }}>
      <Icon name={props.name ?? "phone"} size={props.size ?? 24} stroke={1.8} />
    </span>
  );
}
