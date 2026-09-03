"use client";

import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";
// Charge les enregistrements de composants dans le canvas de Plasmic Studio.
import "./plasmic-init-client";

export function PlasmicHostClient() {
  return <PlasmicCanvasHost />;
}
