import type { CSSProperties } from "react";
import { pxOr } from "./num";
import type { SiteSettings } from "./types";

// Onglet « Polices » : « Taille du texte (%) », « Taille des titres (%) » et « Taille des sous-titres (%) ».
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
  set("--scale-subtitle", settings?.subtitle_scale, 50, 200); // sous-titres seuls (classe sb-subtitle)
  // « Téléphone : intensité des agrandissements (%) » : part des agrandissements (texte, titres,
  // badges, sections, logo du menu, hauteur des bandeaux, photos) appliquée sous 768 px.
  // Vide = 50 (valeur par défaut de css/style.css) ; 0 = tailles standard du site sur téléphone ;
  // 100 = mêmes agrandissements que sur ordinateur.
  const rawMobile = settings?.mobile_scale;
  if (rawMobile !== undefined && rawMobile !== null && String(rawMobile).trim() !== "") {
    vars["--damp-mobile"] = String(pxOr(rawMobile as string | number, 50, 0, 100) / 100);
  }
  return Object.keys(vars).length ? (vars as CSSProperties) : undefined;
}
