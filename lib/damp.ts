// Agrandissements réglés dans Storyblok (zoom CSS d'un titre, d'un badge, d'une section, de la page,
// du pied de page…) : posés en variable --sb-zoom + `zoom: var(--sb-zoom)` (même rendu qu'un zoom
// direct). Sur téléphone, css/style.css (sous 768 px) remplace ce zoom par une version à intensité
// réduite : « Téléphone : intensité des agrandissements (%) » des Réglages du site (--damp, 0.5 par
// défaut). Ex. 1.7 → 1.35 sur téléphone, 1.7 sur ordinateur.
export function zoomStyle(zoom: number): Record<string, string> {
  return { "--sb-zoom": String(Number(zoom.toFixed(4))), zoom: "var(--sb-zoom)" };
}
