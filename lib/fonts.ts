import type { CSSProperties } from "react";
import type { SiteSettings } from "./types";
import { pxOr } from "./num";
import { normalizeHex } from "./palette";

// Onglet « Polices » des Réglages du site : police des titres et police du texte,
// choisies dans la datasource « polices » (clés du code ci-dessous ou polices ajoutées par la cliente). Par défaut (Playfair Display /
// DM Sans), rien n'est ajouté : le @import de css/style.css charge déjà ces deux
// polices. Sinon, la feuille Google Fonts correspondante est ajoutée dans <head>
// et les variables --font-display / --font-body sont posées sur <html>.

type FontDef = { family: string; query: string; fallback: string };

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, BlinkMacSystemFont, sans-serif";

export const DEFAULT_DISPLAY_FONT = "playfair";
export const DEFAULT_BODY_FONT = "dm-sans";

export const DISPLAY_FONTS: Record<string, FontDef> = {
  playfair: { family: "Playfair Display", query: "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500", fallback: SERIF },
  lora: { family: "Lora", query: "Lora:ital,wght@0,400;0,500;0,600;0,700;1,400", fallback: SERIF },
  merriweather: { family: "Merriweather", query: "Merriweather:ital,wght@0,400;0,700;1,400", fallback: SERIF },
  "dm-serif": { family: "DM Serif Display", query: "DM+Serif+Display:ital@0;1", fallback: SERIF },
  fraunces: { family: "Fraunces", query: "Fraunces:ital,wght@0,400;0,500;0,600;0,700;1,400", fallback: SERIF },
  abril: { family: "Abril Fatface", query: "Abril+Fatface", fallback: SERIF },
  poppins: { family: "Poppins", query: "Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400", fallback: SANS },
  montserrat: { family: "Montserrat", query: "Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400", fallback: SANS },
  raleway: { family: "Raleway", query: "Raleway:ital,wght@0,400;0,500;0,600;0,700;1,400", fallback: SANS },
  fredoka: { family: "Fredoka", query: "Fredoka:wght@400;500;600;700", fallback: SANS },
  nunito: { family: "Nunito", query: "Nunito:ital,wght@0,400;0,600;0,700;1,400", fallback: SANS },
  "baloo-2": { family: "Baloo 2", query: "Baloo+2:wght@400;500;600;700;800", fallback: SANS },
  bebas: { family: "Bebas Neue", query: "Bebas+Neue", fallback: "'Arial Narrow', sans-serif" },
  caveat: { family: "Caveat", query: "Caveat:wght@400;500;600;700", fallback: "cursive" },
};

export const BODY_FONTS: Record<string, FontDef> = {
  "dm-sans": { family: "DM Sans", query: "DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400", fallback: SANS },
  inter: { family: "Inter", query: "Inter:wght@400;500;600;700", fallback: SANS },
  nunito: { family: "Nunito", query: "Nunito:ital,wght@0,400;0,600;0,700;1,400", fallback: SANS },
  poppins: { family: "Poppins", query: "Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400", fallback: SANS },
  "work-sans": { family: "Work Sans", query: "Work+Sans:ital,wght@0,400;0,500;0,600;1,400", fallback: SANS },
  "source-sans": { family: "Source Sans 3", query: "Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400", fallback: SANS },
  lato: { family: "Lato", query: "Lato:ital,wght@0,400;0,700;1,400", fallback: SANS },
  raleway: { family: "Raleway", query: "Raleway:ital,wght@0,400;0,500;0,600;0,700;1,400", fallback: SANS },
  lora: { family: "Lora", query: "Lora:ital,wght@0,400;0,500;0,600;0,700;1,400", fallback: SERIF },
  merriweather: { family: "Merriweather", query: "Merriweather:ital,wght@0,400;0,700;1,400", fallback: SERIF },
};

export type FontSettings = { vars?: CSSProperties; hrefs?: string[] };

export type ResolvedFont = { family: string; fallback: string; href: string };

// Valeur d'une liste « police » → police à charger. Trois formes acceptées :
// une clé du code (ex. "fredoka"), une adresse « embed » Google Fonts css2 (gras/italique
// inclus), ou un nom exact Google Fonts (ex. "Lobster", graisse normale seule).
// Ce sont les valeurs de la datasource « Polices » de Storyblok, que la cliente enrichit.
export function resolveFont(value: unknown, table: Record<string, FontDef> = ALL_FONTS): ResolvedFont | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  if (!v) return undefined;
  if (v in table) {
    const f = table[v];
    return { family: f.family, fallback: f.fallback, href: `${GOOGLE_CSS2}family=${f.query}&display=swap` };
  }
  if (v.startsWith(GOOGLE_CSS2) && !/[<>"']/.test(v)) {
    const m = /[?&]family=([^:&]+)/.exec(v);
    if (!m) return undefined;
    return { family: decodeURIComponent(m[1]).replace(/\+/g, " "), fallback: SANS, href: v };
  }
  if (/^[A-Za-z0-9 ]{2,40}$/.test(v)) {
    return { family: v, fallback: SANS, href: `${GOOGLE_CSS2}family=${v.replace(/ /g, "+")}&display=swap` };
  }
  return undefined;
}

const GOOGLE_CSS2 = "https://fonts.googleapis.com/css2?";

export function fontSettings(settings: SiteSettings | null | undefined): FontSettings {
  const vars: Record<string, string> = {};
  const hrefs: string[] = [];
  const add = (href: string) => {
    if (!hrefs.includes(href)) hrefs.push(href);
  };

  // Les listes (datasource « polices ») acceptent les clés du code et les polices ajoutées par la cliente.
  if (settings?.font_display && settings.font_display !== DEFAULT_DISPLAY_FONT) {
    const f = resolveFont(settings.font_display);
    if (f) {
      vars["--font-display"] = `'${f.family}', ${f.fallback}`;
      add(f.href);
    }
  }
  if (settings?.font_body && settings.font_body !== DEFAULT_BODY_FONT) {
    const f = resolveFont(settings.font_body);
    if (f) {
      vars["--font-body"] = `'${f.family}', ${f.fallback}`;
      add(f.href);
    }
  }
  if (!hrefs.length) return {};
  return { vars: vars as CSSProperties, hrefs };
}

// Police et taille d'un texte précis (ex. nom d'un produit) choisies dans un bloc :
// `font` = clé de DISPLAY_FONTS (vide = police des titres du site), `sizePct` en % (100 = taille
// actuelle, appliqué par zoom pour rester relatif à la taille définie en CSS).
// Toutes les polices proposées (texte + titres), pour les champs « police » des blocs.
export const ALL_FONTS: Record<string, FontDef> = { ...BODY_FONTS, ...DISPLAY_FONTS };

export function inlineTextStyle(
  font: unknown,
  sizePct: unknown,
  table: Record<string, FontDef> = DISPLAY_FONTS,
  color?: unknown,
): { style?: CSSProperties; href?: string } {
  const style: CSSProperties = {};
  let href: string | undefined;
  const hex = normalizeHex(color);
  if (hex) {
    style.color = hex;
    // Les mots en italique (*mots*) des titres reprennent la même couleur.
    (style as Record<string, string>)["--em-color"] = hex;
  }
  const f = resolveFont(font, table);
  if (f) {
    style.fontFamily = `'${f.family}', ${f.fallback}`;
    href = f.href;
  }
  if (sizePct !== undefined && sizePct !== null && String(sizePct).trim() !== "") {
    const pct = pxOr(sizePct as string | number, 100, 50, 300);
    if (pct !== 100) style.zoom = pct / 100;
  }
  return { style: Object.keys(style).length ? style : undefined, href };
}

// Police et taille d'un texte d'un bloc via ses champs `<key>_font` et `<key>_size`
// (ex. blockTextStyle(blok, "title") lit title_font / title_size).
export function blockTextStyle(blok: Record<string, unknown>, key: string): { style?: CSSProperties; href?: string } {
  return inlineTextStyle(blok[`${key}_font`], blok[`${key}_size`], ALL_FONTS, blok[`${key}_color`]);
}

// Pourcentage saisi (chaîne ou nombre) → multiplicateur, ou undefined si vide / 100 / invalide.
function scaleOf(raw: unknown, min = 50, max = 300): number | undefined {
  if (raw === undefined || raw === null || String(raw).trim() === "") return undefined;
  const pct = pxOr(raw as string | number, 100, min, max);
  return pct === 100 ? undefined : pct / 100;
}

// Style d'un badge d'après les champs `<prefix>_font`, `<prefix>_text_size` (texte),
// `<prefix>_size` (fond, via padding), `<prefix>_bg` et `<prefix>_color` (codes hex).
// Les multiplicateurs sont lus par .badge dans css/style.css.
export function badgeStyle(blok: Record<string, unknown>, prefix = "badge"): { style?: CSSProperties; href?: string } {
  const base = inlineTextStyle(blok[`${prefix}_font`], undefined, ALL_FONTS);
  const style: Record<string, string | number> = { ...((base.style ?? {}) as Record<string, string | number>) };
  const text = scaleOf(blok[`${prefix}_text_size`]);
  if (text) style["--badge-text-scale"] = text;
  const pad = scaleOf(blok[`${prefix}_size`]);
  if (pad) style["--badge-pad-scale"] = pad;
  const bg = normalizeHex(blok[`${prefix}_bg`]);
  if (bg) style.backgroundColor = bg;
  const color = normalizeHex(blok[`${prefix}_color`]);
  if (color) style.color = color;
  return { style: Object.keys(style).length ? (style as CSSProperties) : undefined, href: base.href };
}
