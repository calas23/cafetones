"use client";

import type { ComponentProps } from "react";
import { PlasmicRootProvider } from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "@/lib/plasmic-init";
import {
  TonesBadge,
  TonesButton,
  TonesIcon,
  TonesProductCard,
  TonesProductGrid,
  TonesSection,
} from "./tones-components";

// Enregistrement des composants TONES dans Plasmic Studio (côté client).
const IMPORT_PATH = "@/components/plasmic/tones-components";

PLASMIC.registerComponent(TonesSection, {
  name: "TonesSection",
  displayName: "Section TONES",
  importPath: IMPORT_PATH,
  props: {
    background: { type: "choice", displayName: "Fond", options: ["default", "cream", "white", "espresso"], defaultValue: "default" },
    badge: { type: "string", displayName: "Badge" },
    title: { type: "string", displayName: "Titre", defaultValue: "Titre de section" },
    subtitle: { type: "string", displayName: "Sous-titre" },
    children: { type: "slot", displayName: "Contenu" },
  },
});

PLASMIC.registerComponent(TonesProductGrid, {
  name: "TonesProductGrid",
  displayName: "Grille de produits",
  importPath: IMPORT_PATH,
  props: { children: { type: "slot", displayName: "Cartes", allowedComponents: ["TonesProductCard"] } },
});

PLASMIC.registerComponent(TonesProductCard, {
  name: "TonesProductCard",
  displayName: "Carte produit TONES",
  importPath: IMPORT_PATH,
  props: {
    image: { type: "imageUrl", displayName: "Photo" },
    imageAlt: { type: "string", displayName: "Texte alternatif" },
    badge: { type: "string", displayName: "Badge" },
    badgeGold: { type: "boolean", displayName: "Badge doré", defaultValue: true },
    name: { type: "string", displayName: "Nom", defaultValue: "La Genovese Oro" },
    description: { type: "string", displayName: "Description courte" },
    price: { type: "string", displayName: "Prix affiché", defaultValue: "23,20 € HT/kg" },
    medals: { type: "string", displayName: "Ligne médailles" },
    detailName: { type: "string", displayName: "Fiche — nom (ouvre la fenêtre au clic)" },
    detailSubtitle: { type: "string", displayName: "Fiche — sous-titre" },
    detailDescription: { type: "string", displayName: "Fiche — description" },
    detailFormat: { type: "string", displayName: "Fiche — format" },
    detailPrice: { type: "string", displayName: "Fiche — prix" },
    detailNotes: { type: "string", displayName: "Fiche — notes aromatiques" },
  },
});

PLASMIC.registerComponent(TonesButton, {
  name: "TonesButton",
  displayName: "Bouton TONES",
  importPath: IMPORT_PATH,
  props: {
    label: { type: "string", displayName: "Texte", defaultValue: "Demander un devis" },
    link: { type: "string", displayName: "Lien", defaultValue: "/pages/contact" },
    style: { type: "choice", displayName: "Style", options: ["primary", "secondary", "white", "white-outline"], defaultValue: "primary" },
    size: { type: "choice", displayName: "Taille", options: ["", "lg", "sm"], defaultValue: "" },
    icon: { type: "choice", displayName: "Icône", options: ["none", "phone", "bell", "arrow-right"], defaultValue: "none" },
  },
});

PLASMIC.registerComponent(TonesBadge, {
  name: "TonesBadge",
  displayName: "Badge TONES",
  importPath: IMPORT_PATH,
  props: {
    label: { type: "string", displayName: "Texte", defaultValue: "100% Arabica" },
    gold: { type: "boolean", displayName: "Doré", defaultValue: true },
    dark: { type: "boolean", displayName: "Foncé", defaultValue: false },
  },
});

PLASMIC.registerComponent(TonesIcon, {
  name: "TonesIcon",
  displayName: "Icône TONES",
  importPath: IMPORT_PATH,
  props: {
    name: {
      type: "choice",
      displayName: "Icône",
      options: ["phone", "map-pin", "mail", "clock", "arrow-right", "check", "star", "bell", "coffee", "medal", "shield", "users", "wrench", "globe"],
      defaultValue: "coffee",
    },
    size: { type: "number", displayName: "Taille (px)", defaultValue: 24 },
  },
});

export function PlasmicClientRootProvider(props: Omit<ComponentProps<typeof PlasmicRootProvider>, "loader">) {
  return <PlasmicRootProvider loader={PLASMIC} {...props} />;
}
