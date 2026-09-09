import type { CSSProperties } from "react";
import { pxOr } from "./num";
import type { SiteSettings } from "./types";

// Tailles d'origine (css/style.css) : logo 48 px mobile / 64 px desktop, barre de 72 px.
const LOGO_DESKTOP = 64;
const LOGO_MOBILE = 48;
const HEADER_DEFAULT = 72;

// Variables CSS posées sur <html> quand « Hauteur du logo du menu (px) » est renseignée
// dans les Réglages du site. Champ vide → undefined : aucun attribut style, rendu d'origine.
// Le mobile suit la même proportion qu'à l'origine (48/64) et la barre de menu garde sa marge
// de 8 px autour du logo, sans jamais descendre sous 72 px.
export function headerSizeVars(settings: SiteSettings | null | undefined): CSSProperties | undefined {
  const raw = settings?.logo_height;
  if (raw === undefined || raw === null || String(raw).trim() === "") return undefined;
  const desktop = pxOr(raw, LOGO_DESKTOP, 24, 160);
  const mobile = Math.round(desktop * (LOGO_MOBILE / LOGO_DESKTOP));
  const header = Math.max(HEADER_DEFAULT, desktop + (HEADER_DEFAULT - LOGO_DESKTOP));
  return {
    "--logo-height": `${desktop}px`,
    "--logo-height-mobile": `${mobile}px`,
    "--header-height": `${header}px`,
  } as CSSProperties;
}
