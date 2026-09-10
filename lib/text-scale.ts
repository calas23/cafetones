import type { CSSProperties } from "react";
import { pxOr } from "./num";
import type { SiteSettings } from "./types";

// Onglet « Polices » : « Taille du texte (%) » et « Taille des titres (%) ».
// 100 = taille d'origine. Vide, 100 ou valeur invalide → rien n'est posé.
// --scale-text multiplie la taille de base (html, 16 px) : tout le site suit, car les
// tailles sont en rem. --scale-headings s'ajoute sur les titres seuls (zoom CSS sur h1-h4).
export function textScaleVars(settings: SiteSettings | null | undefined): CSSProperties | undefined {
  const vars: Record<string, string> = {};
  const set = (name: string, raw: unknown, min: number, max: number) => {
    if (raw === undefined || raw === null || String(raw).trim() === "") return;
    const pct = pxOr(raw as string | number, 100, min, max);
    if (pct !== 100) vars[name] = String(pct / 100);
  };
  set("--scale-text", settings?.text_scale, 70, 150);
  set("--scale-headings", settings?.heading_scale, 70, 200);
  return Object.keys(vars).length ? (vars as CSSProperties) : undefined;
}
