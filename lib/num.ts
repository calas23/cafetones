// Nombre saisi dans Storyblok (chaîne ou nombre) borné entre min et max ;
// vide ou invalide = valeur par défaut.
export function pxOr(value: string | number | undefined | null, fallback: number, min: number, max: number): number {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? "").replace(",", "."));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}
