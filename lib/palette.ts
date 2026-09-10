import type { CSSProperties } from "react";
import type { SiteSettings } from "./types";

// Onglet « Couleurs » des Réglages du site : une palette prête à l'emploi (5 couleurs
// de base) et, au besoin, un code hexadécimal par couleur de base pour la remplacer.
// Tout le reste (déclinaisons claires/foncées, textes secondaires, bordures, ombres,
// voiles) est dérivé ici, avec les mêmes proportions que la palette codée dans style.css.

export type PaletteBase = { dark: string; accent: string; bg: string; bgAlt: string; text: string };

export const DEFAULT_PALETTE = "rouge-creme";

export const PRESETS: Record<string, PaletteBase> = {
  "rouge-creme": { dark: "#8E1B1B", accent: "#D63324", bg: "#FDFBF7", bgAlt: "#F6F1EA", text: "#2B1A1A" },
  cafe: { dark: "#2C1810", accent: "#C8956C", bg: "#FAF8F5", bgAlt: "#F5F0E8", text: "#1A1412" },
  sicilia: { dark: "#2453B5", accent: "#D63324", bg: "#FFFDF8", bgAlt: "#EAF3FF", text: "#1B2A4E" },
  orange: { dark: "#9A3412", accent: "#C2410C", bg: "#FFFBF5", bgAlt: "#FFF1E3", text: "#2A1A10" },
  marine: { dark: "#1C3559", accent: "#C23B2E", bg: "#FAF9F7", bgAlt: "#F0F3F8", text: "#15203A" },
};

const HEX = /^#?([0-9a-f]{6})$/i;

// "#8e1b1b", "8E1B1B" → "#8E1B1B" ; tout le reste → undefined (ignoré).
export function normalizeHex(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const m = HEX.exec(value.trim());
  return m ? `#${m[1].toUpperCase()}` : undefined;
}

type RGB = [number, number, number];
const toRgb = (hex: string): RGB => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
const toHex = (c: RGB) =>
  "#" + c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0").toUpperCase()).join("");
// Mélange de a vers b : t = 0 → a, t = 1 → b.
const mix = (a: string, b: string, t: number) => {
  const A = toRgb(a), B = toRgb(b);
  return toHex([0, 1, 2].map((i) => A[i] + (B[i] - A[i]) * t) as RGB);
};
const rgbList = (hex: string) => toRgb(hex).join(", ");

export function derivePalette(p: PaletteBase): Record<string, string> {
  const white = "#FFFFFF", black = "#000000";
  return {
    "--color-espresso": p.dark,
    "--color-espresso-light": mix(p.dark, white, 0.12),
    "--color-crema": p.accent,
    "--color-crema-light": mix(p.accent, white, 0.55),
    "--color-crema-dark": mix(p.accent, black, 0.2),
    "--color-cream": p.bg,
    "--color-cream-warm": p.bgAlt,
    "--color-cream-dark": mix(p.bgAlt, p.text, 0.05),
    "--color-text": p.text,
    "--color-text-muted": mix(p.text, p.bg, 0.3),
    "--color-text-light": mix(p.text, p.bg, 0.55),
    "--color-border": mix(p.bg, p.text, 0.1),
    "--color-border-light": mix(p.bg, p.text, 0.06),
    "--color-error": p.accent,
    "--color-sun": mix(p.accent, white, 0.45),
    "--color-leaf": mix(p.dark, black, 0.15),
    "--color-orange": mix(p.accent, white, 0.3),
    "--rgb-espresso": rgbList(p.dark),
    "--rgb-crema": rgbList(p.accent),
    "--rgb-cream": rgbList(p.bg),
  };
}

// Variables CSS à poser sur <html>. Palette par défaut sans code personnalisé → undefined :
// aucun attribut style, la CSS d'origine s'applique telle quelle.
export function paletteVars(settings: SiteSettings | null | undefined): CSSProperties | undefined {
  if (!settings) return undefined;
  const presetName =
    typeof settings.palette === "string" && settings.palette in PRESETS ? settings.palette : DEFAULT_PALETTE;
  const overrides: Partial<PaletteBase> = {
    dark: normalizeHex(settings.color_dark),
    accent: normalizeHex(settings.color_accent),
    bg: normalizeHex(settings.color_bg),
    bgAlt: normalizeHex(settings.color_bg_alt),
    text: normalizeHex(settings.color_text),
  };
  const hasOverride = Object.values(overrides).some(Boolean);
  if (presetName === DEFAULT_PALETTE && !hasOverride) return undefined;
  const base: PaletteBase = { ...PRESETS[presetName] };
  for (const key of Object.keys(overrides) as (keyof PaletteBase)[]) {
    const v = overrides[key];
    if (v) base[key] = v;
  }
  return derivePalette(base) as CSSProperties;
}
