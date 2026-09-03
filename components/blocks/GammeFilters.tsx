"use client";

import { useState } from "react";
import { storyblokEditable } from "@storyblok/react/rsc";
import type { SbBlok } from "@/lib/types";

// Filtres de la page gamme — même logique DOM que l'ancien js/gamme-filters.js.

type FilterItem = SbBlok & { label?: string; filter_key?: string };
type GammeFiltersBlok = SbBlok & { items?: FilterItem[] };

function applyFilter(filter: string) {
  const cards = document.querySelectorAll<HTMLElement>(".gamme-card[data-categories]");
  cards.forEach((card) => {
    const cats = card.getAttribute("data-categories") || "";
    const show = filter === "all" || cats.split(" ").indexOf(filter) !== -1;
    if (show) {
      card.style.display = "";
      card.style.opacity = "1";
    } else {
      card.style.opacity = "0";
      card.style.display = "none";
    }
  });

  const sections = document.querySelectorAll<HTMLElement>(".gamme-section[data-section-cat]");
  sections.forEach((sec) => {
    const sectionCards = sec.querySelectorAll<HTMLElement>(".gamme-card[data-categories]");
    let hasVisible = false;
    sectionCards.forEach((c) => {
      if (c.style.display !== "none") hasVisible = true;
    });
    sec.style.display = hasVisible ? "" : "none";
  });
}

export function GammeFilters({ blok }: { blok: GammeFiltersBlok }) {
  const items = (blok.items ?? []) as FilterItem[];
  const [active, setActive] = useState(items[0]?.filter_key || "all");

  return (
    <nav className="gamme-nav" aria-label="Filtres produits" {...storyblokEditable(blok)}>
      <div className="gamme-nav__inner">
        {items.map((item) => {
          const key = item.filter_key || "all";
          return (
            <button
              key={item._uid}
              className={active === key ? "gamme-nav__btn active" : "gamme-nav__btn"}
              data-filter={key}
              onClick={() => {
                setActive(key);
                applyFilter(key);
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
