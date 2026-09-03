import { initPlasmicLoader } from "@plasmicapp/loader-nextjs/react-server-conditional";

// Essai Plasmic (éditeur visuel libre) — isolé sous /essai-plasmic.
// Le token de projet Plasmic est un token de LECTURE public par conception
// (il ne donne accès qu'au contenu publié), d'où le préfixe NEXT_PUBLIC_.
const PROJECT_ID = process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID ?? "";
const PROJECT_TOKEN = process.env.NEXT_PUBLIC_PLASMIC_PROJECT_TOKEN ?? "";

/** Préfixe d'URL réservé aux pages construites dans Plasmic. */
export const PLASMIC_PREFIX = "/essai-plasmic";

export const plasmicConfigured = Boolean(PROJECT_ID && PROJECT_TOKEN);

export const PLASMIC = initPlasmicLoader({
  projects: [{ id: PROJECT_ID, token: PROJECT_TOKEN }],
  // false = uniquement le contenu publié dans Plasmic (jamais de brouillon en ligne)
  preview: false,
});
