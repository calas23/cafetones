import { ILLUSTRATIONS } from "@/lib/illustrations";

// Illustration décorative — DOM final identique à l'injection JS d'origine
// (wrapper .illustration--position --size, aria-hidden, SVG inline).
export type IllustrationProps = {
  illustration?: string;
  illustration_position?: string;
  illustration_size?: string;
};

export function Illustration({ illustration, illustration_position, illustration_size }: IllustrationProps) {
  if (!illustration || illustration === "none") return null;
  const svg = ILLUSTRATIONS[illustration];
  if (!svg) return null;
  const position = illustration_position || "right";
  const size = illustration_size || "md";
  return (
    <div
      className={`illustration illustration--${position} illustration--${size}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
