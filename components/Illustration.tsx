import { ILLUSTRATIONS } from "@/lib/illustrations";
import { pxOr } from "@/lib/num";
import { assetUrl, type SbAsset } from "@/lib/types";

// Illustration décorative — DOM final identique à l'injection JS d'origine
// (wrapper .illustration--position --size, aria-hidden, SVG inline).
// « Illustration — image personnalisée » (Storyblok) : l'image remplace le dessin, même position,
// largeur = taille choisie (80 / 120 / 160 px) ou « largeur (px) », opacité 100 % sauf « opacité (%) ».
export type IllustrationProps = {
  illustration?: string;
  illustration_position?: string;
  illustration_size?: string;
  illustration_image?: SbAsset;
  illustration_width?: string | number; // px, vide = largeur de la taille choisie
  illustration_opacity?: string | number; // %, vide = 100 (image personnalisée seulement)
  illustration_flip?: boolean; // « miroir horizontal » : image ou dessin retourné de gauche à droite
};

export function Illustration({ illustration, illustration_position, illustration_size, illustration_image, illustration_width, illustration_opacity, illustration_flip }: IllustrationProps) {
  const position = illustration_position || "right";
  const size = illustration_size || "md";
  const flip = illustration_flip ? " illustration--flip" : "";
  const image = assetUrl(illustration_image);
  if (image) {
    const rawW = illustration_width;
    const width = rawW === undefined || rawW === null || String(rawW).trim() === "" ? 0 : pxOr(rawW, 0, 40, 600);
    const rawO = illustration_opacity;
    const opacity = rawO === undefined || rawO === null || String(rawO).trim() === "" ? 100 : pxOr(rawO, 100, 5, 100);
    const style: Record<string, string | number> = {};
    if (width) style.width = `${width}px`;
    if (opacity !== 100) style.opacity = opacity / 100;
    return (
      <div className={`illustration illustration--${position} illustration--${size} illustration--image${flip}`} aria-hidden="true" style={Object.keys(style).length ? style : undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" loading="lazy" />
      </div>
    );
  }
  if (!illustration || illustration === "none") return null;
  const svg = ILLUSTRATIONS[illustration];
  if (!svg) return null;
  return (
    <div
      className={`illustration illustration--${position} illustration--${size}${flip}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
