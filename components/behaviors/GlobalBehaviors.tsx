"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Portage 1:1 des comportements globaux de l'ancien site :
// - js/main.js : animations au scroll (IntersectionObserver), tracking clics téléphone
// - js/product-modal.js : fiche produit construite depuis les data-attributes

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function buildDots(value: number, max: number): string {
  let html = "";
  for (let i = 1; i <= max; i++) {
    html += '<span class="pm-dot ' + (i <= value ? "pm-dot--filled" : "pm-dot--empty") + '"></span>';
  }
  return html;
}

function buildPills(str: string): string {
  if (!str) return "";
  return str
    .split(",")
    .map((s) => '<span class="pm-pill">' + s.trim() + "</span>")
    .join("");
}

function buildBadges(str: string): string {
  if (!str) return "";
  return str
    .split(",")
    .map(
      (s) =>
        '<span class="badge badge--gold" style="margin-right:0.25rem;margin-bottom:0.25rem;">' + s.trim() + "</span>"
    )
    .join("");
}

function buildModalHtml(d: DOMStringMap): string {
  const name = d.name || "";
  const subtitle = d.subtitle || "";
  const description = d.description || "";
  const image = d.image || "";
  const notes = d.notes || "";
  const origins = d.origins || "";
  const certifications = d.certifications || "";
  const medals = d.medals || "";
  const price = d.price || "";
  const format = d.format || "";
  const weight = d.weight || "";
  const packaging = d.packaging || "";
  const orderPeriod = d.orderPeriod || "";
  const ingredients = d.ingredients || "";
  const ingredientsGlaze = d.ingredientsGlaze || "";
  const roast = d.roast || "";
  const caffeine = d.caffeine || "";
  const machineInfo = d.machineInfo || "";
  const acidity = parseInt(d.acidity || "") || 0;
  const body = parseInt(d.body || "") || 0;
  const intensity = parseInt(d.intensity || "") || 0;

  let html = '<div class="pm-overlay" tabindex="-1">';
  html += '<div class="pm-card">';
  html +=
    '<button class="pm-close" aria-label="Fermer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
  if (image) {
    html += '<div class="pm-image"><img src="' + image + '" alt="' + name + '"></div>';
  }
  html += '<div class="pm-body">';
  html += '<h2 class="pm-name">' + name + "</h2>";
  if (subtitle) html += '<div class="pm-subtitle">' + subtitle + "</div>";
  if (description) html += '<p class="pm-desc">' + description + "</p>";
  if (acidity || body || intensity) {
    html += '<div class="pm-profile">';
    if (acidity)
      html +=
        '<div class="pm-profile__row"><span class="pm-profile__label">Acidité</span><span class="pm-profile__dots">' +
        buildDots(acidity, 5) +
        "</span></div>";
    if (body)
      html +=
        '<div class="pm-profile__row"><span class="pm-profile__label">Corps</span><span class="pm-profile__dots">' +
        buildDots(body, 5) +
        "</span></div>";
    if (intensity)
      html +=
        '<div class="pm-profile__row"><span class="pm-profile__label">Intensité</span><span class="pm-profile__dots">' +
        buildDots(intensity, 5) +
        "</span></div>";
    html += "</div>";
  }
  if (roast) html += '<div class="pm-info-line"><strong>Torréfaction :</strong> ' + roast + "</div>";
  if (notes)
    html +=
      '<div class="pm-section"><div class="pm-section__label">Notes aromatiques</div><div class="pm-pills">' +
      buildPills(notes) +
      "</div></div>";
  if (origins) html += '<div class="pm-info-line"><strong>Origines :</strong> ' + origins + "</div>";
  if (certifications || medals) {
    html += '<div class="pm-badges">';
    if (certifications) html += buildBadges(certifications);
    if (medals) html += '<span class="pm-medals">Médailles ICT : ' + medals + "</span>";
    html += "</div>";
  }
  if (caffeine) html += '<div class="pm-info-line"><strong>Caféine :</strong> ' + caffeine + "</div>";
  if (ingredients) html += '<div class="pm-info-line"><strong>Ingrédients :</strong> ' + ingredients + "</div>";
  if (ingredientsGlaze) html += '<div class="pm-info-line"><strong>Glaçage :</strong> ' + ingredientsGlaze + "</div>";
  const practicals: string[] = [];
  if (format) practicals.push("<strong>Format :</strong> " + format);
  if (weight) practicals.push("<strong>Poids :</strong> " + weight);
  if (packaging) practicals.push("<strong>Emballage :</strong> " + packaging);
  if (orderPeriod) practicals.push("<strong>Commande :</strong> " + orderPeriod);
  if (practicals.length) {
    html += '<div class="pm-practicals">';
    practicals.forEach((p) => {
      html += '<div class="pm-info-line">' + p + "</div>";
    });
    html += "</div>";
  }
  if (price) html += '<div class="pm-price">' + price + "</div>";
  if (machineInfo) html += '<div class="modal-machine-info">' + machineInfo + "</div>";
  html +=
    '<a href="tel:+33662119748" class="btn btn--primary btn--full pm-cta">Commander — 06 62 11 97 48</a>';
  html += "</div></div></div>";
  return html;
}

export function GlobalBehaviors() {
  const pathname = usePathname();

  // Animations au scroll — rejouées à chaque navigation.
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll:not(.visible)");
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Curseur pointeur sur les cartes produit (comme l'ancien script).
  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-product-modal]").forEach((card) => {
      card.style.cursor = "pointer";
    });
  }, [pathname]);

  // Modale produit + tracking téléphone (délégation globale, montée une fois).
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    let overlay: HTMLElement | null = null;

    function close() {
      if (!overlay) return;
      overlay.classList.remove("pm-overlay--visible");
      const el = overlay;
      overlay = null;
      setTimeout(() => {
        if (el && el.parentNode) el.parentNode.removeChild(el);
        document.body.style.overflow = "";
      }, 250);
      document.removeEventListener("keydown", onKey);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    function open(card: HTMLElement) {
      const container = document.createElement("div");
      container.innerHTML = buildModalHtml(card.dataset);
      overlay = container.firstChild as HTMLElement;
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        overlay?.classList.add("pm-overlay--visible");
      });
      overlay.querySelector(".pm-close")?.addEventListener("click", close);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
      });
      document.addEventListener("keydown", onKey);
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const card = target.closest<HTMLElement>("[data-product-modal]");
      if (card && card.dataset.name) {
        e.preventDefault();
        open(card);
        return;
      }
      const phoneLink = target.closest<HTMLAnchorElement>('a[href^="tel:"]');
      if (phoneLink) {
        window.dataLayer.push({
          event: "phone_click",
          phone_number: phoneLink.href.replace("tel:", ""),
          phone_location: phoneLink.dataset.location || "unknown",
        });
      }
    }

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      close();
    };
  }, []);

  return null;
}
