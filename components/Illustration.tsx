import { pxOr } from "@/lib/num";
import { assetUrl, type SbAsset } from "@/lib/types";

// Illustrations de section (Storyblok, champs « Illustration gauche / droite — … ») : une image de
// chaque côté du titre, posée en absolu (wrapper .illustration--left / --right, css/illustrations.css),
// largeur 120 px ou « largeur (px) », opaque sauf « opacité (%) », retournée avec « miroir horizontal ».
// Les clés sans « left » sont celles du côté droit (historique : champ unique). Ancien champ
// « position » (avant les deux côtés) : « left » ou « corner-br » déplace l'image de droite si aucune
// image de gauche n'est renseignée. Sans image : rien n'est rendu.
export type IllustrationProps = {
  illustration_left_image?: SbAsset;
  illustration_left_width?: string | number; // px, vide = 120
  illustration_left_opacity?: string | number; // %, vide = 100
  illustration_left_flip?: boolean;
  illustration_image?: SbAsset; // côté droit
  illustration_width?: string | number;
  illustration_opacity?: string | number;
  illustration_flip?: boolean;
  illustration_position?: string; // ancien champ, non proposé dans Storyblok
};

type SideProps = { position: string; image: string; width?: string | number; opacity?: string | number; flip?: boolean };

function Side({ position, image, width: rawW, opacity: rawO, flip }: SideProps) {
  const width = rawW === undefined || rawW === null || String(rawW).trim() === "" ? 0 : pxOr(rawW, 0, 40, 600);
  const opacity = rawO === undefined || rawO === null || String(rawO).trim() === "" ? 100 : pxOr(rawO, 100, 5, 100);
  const style: Record<string, string | number> = {};
  if (width) style.width = `${width}px`;
  if (opacity !== 100) style.opacity = opacity / 100;
  return (
    <div
      className={`illustration illustration--${position} illustration--image${flip ? " illustration--flip" : ""}`}
      aria-hidden="true"
      style={Object.keys(style).length ? style : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" loading="lazy" />
    </div>
  );
}

export function Illustration(p: IllustrationProps) {
  const left = assetUrl(p.illustration_left_image);
  const right = assetUrl(p.illustration_image);
  if (!left && !right) return null;
  const legacy = p.illustration_position === "left" || p.illustration_position === "corner-br" ? p.illustration_position : "";
  const rightPosition = !left && legacy ? legacy : "right";
  return (
    <>
      {left ? <Side position="left" image={left} width={p.illustration_left_width} opacity={p.illustration_left_opacity} flip={p.illustration_left_flip} /> : null}
      {right ? <Side position={rightPosition} image={right} width={p.illustration_width} opacity={p.illustration_opacity} flip={p.illustration_flip} /> : null}
    </>
  );
}
