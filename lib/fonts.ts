import type { CSSProperties } from "react";
import type { SiteSettings } from "./types";
import { pxOr } from "./num";
import { normalizeHex } from "./palette";

// Onglet « Polices » des Réglages du site : police des titres et police du texte,
// choisies dans une liste de polices Google Fonts. Par défaut (Playfair Display /
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

const GOOGLE_CSS2 = "https://fonts.googleapis.com/css2?";

// Police « autre » saisie à la main : nom exact Google Fonts + URL « embed » facultative.
// Sans URL, seule la graisse normale est chargée (le navigateur simule gras et italique).
// Une URL qui n'est pas une feuille Google Fonts css2 est ignorée.
function customFont(name: unknown, url: unknown): { family: string; href: string } | undefined {
  if (typeof name !== "string") return undefined;
  const family = name.trim().replace(/['"]/g, "");
  if (!family) return undefined;
  const cleanUrl = typeof url === "string" ? url.trim() : "";
  const href =
    cleanUrl.startsWith(GOOGLE_CSS2) && !/[<>"']/.test(cleanUrl)
      ? cleanUrl
      : `${GOOGLE_CSS2}family=${encodeURIComponent(family).replace(/%20/g, "+")}&display=swap`;
  return { family, href };
}

function pick(table: Record<string, FontDef>, value: unknown, fallbackKey: string): string {
  return typeof value === "string" && value in table ? value : fallbackKey;
}

export function fontSettings(settings: SiteSettings | null | undefined): FontSettings {
  const displayKey = pick(DISPLAY_FONTS, settings?.font_display, DEFAULT_DISPLAY_FONT);
  const bodyKey = pick(BODY_FONTS, settings?.font_body, DEFAULT_BODY_FONT);
  const customDisplay = customFont(settings?.font_display_custom_name, settings?.font_display_custom_url);
  const customBody = customFont(settings?.font_body_custom_name, settings?.font_body_custom_url);
  const vars: Record<string, string> = {};
  const families: string[] = []; // requêtes css2 des polices de la liste
  const hrefs: string[] = []; // feuilles complètes des polices personnalisées

  // Titres : la police personnalisée, si renseignée, passe avant la liste.
  if (customDisplay) {
    vars["--font-display"] = `'${customDisplay.family}', ${SERIF}`;
    hrefs.push(customDisplay.href);
  } else if (displayKey !== DEFAULT_DISPLAY_FONT) {
    const f = DISPLAY_FONTS[displayKey];
    vars["--font-display"] = `'${f.family}', ${f.fallback}`;
    families.push(f.query);
  }
  if (customBody) {
    vars["--font-body"] = `'${customBody.family}', ${SANS}`;
    if (!hrefs.includes(customBody.href)) hrefs.push(customBody.href);
  } else if (bodyKey !== DEFAULT_BODY_FONT) {
    const f = BODY_FONTS[bodyKey];
    vars["--font-body"] = `'${f.family}', ${f.fallback}`;
    if (!families.includes(f.query)) families.push(f.query);
  }
  if (families.length) {
    hrefs.unshift(`${GOOGLE_CSS2}${families.map((q) => `family=${q}`).join("&")}&display=swap`);
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
): { style?: CSSProperties; href?: string } {
  const style: CSSProperties = {};
  let href: string | undefined;
  if (typeof font === "string" && font in table) {
    const f = table[font];
    style.fontFamily = `'${f.family}', ${f.fallback}`;
    href = `${GOOGLE_CSS2}family=${f.query}&display=swap`;
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
  return inlineTextStyle(blok[`${key}_font`], blok[`${key}_size`], ALL_FONTS);
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
