// Feuille Google Fonts demandée par un bloc (police choisie sur un texte précis).
// React 19 remonte les <link rel="stylesheet" precedence> dans <head> et les déduplique par href.
export function FontLink({ href }: { href?: string }) {
  return href ? <link rel="stylesheet" href={href} precedence="google-fonts" /> : null;
}
