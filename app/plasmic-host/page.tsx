import { PlasmicHostClient } from "@/components/plasmic/PlasmicHostClient";

// Page « app host » : Plasmic Studio l'ouvre dans son canvas pour rendre les
// composants TONES en direct. À déclarer dans Plasmic : Project settings →
// App host → https://cafetones.fr/plasmic-host
export default function PlasmicHostPage() {
  return <PlasmicHostClient />;
}
