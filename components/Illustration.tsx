import { pxOr } from "@/lib/num";
import { assetUrl, type SbAsset } from "@/lib/types";

// Illustration de section (Storyblok, champs « Illustration — … ») : une image posée en absolu à côté
// du titre (wrapper .illustration--position, css/illustrations.css), largeur 120 px ou « largeur (px) »,
// opaque sauf « opacité (%) », retournée avec « miroir horizontal ». Sans image : rien n'est rendu.
export type IllustrationProps = {
  illustration_position?: string; // right (défaut) | left | corner-br
  illustration_image?: SbAsset;
  illustration_width?: string | number; // px, vide = 120
  illustration_opacity?: string | number; // %, vide = 100
  illustration_flip?: boolean; // image retournée de gauche à droite
};

export function Illustration({ illustration_position, illustration_image, illustration_width, illustration_opacity, illustration_flip }: IllustrationProps) {
  const image = assetUrl(illustration_image);
  if (!image) return null;
  const position = illustration_position || "right";
  const rawW = illustration_width;
  const width = rawW === undefined || rawW === null || String(rawW).trim() === "" ? 0 : pxOr(rawW, 0, 40, 600);
  const rawO = illustration_opacity;
  const opacity = rawO === undefined || rawO === null || String(rawO).trim() === "" ? 100 : pxOr(rawO, 100, 5, 100);
  const style: Record<string, string | number> = {};
  if (width) style.width = `${width}px`;
  if (opacity !== 100) style.opacity = opacity / 100;
  return (
    <div
      className={`illustration illustration--${position} illustration--image${illustration_flip ? " illustration--flip" : ""}`}
      aria-hidden="true"
      style={Object.keys(style).length ? style : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" loading="lazy" />
    </div>
  );
}
