// Opération de contenu : fusionne les sections « certifications / récompenses »
// (bloc cert_cards_section) d'une page en une seule section, sous un nouveau titre.
// Les cartes des sections suivantes sont ajoutées à la fin de la première, qui garde son
// sous-titre et son fond ; les autres sections sont retirées de la page.
//
// Lancement : GitHub → Actions → « Storyblok Content Op » (secrets du dépôt), ou en local
// avec STORYBLOK_PAT et STORYBLOK_SPACE_ID. DRY_RUN=1 affiche le plan sans rien écrire.
// La page est enregistrée en brouillon ; PUBLISH=1 la publie aussi.

import { fileURLToPath } from "node:url";
import { createClient } from "../mapi.mjs";

const SECTION = "cert_cards_section";

// Pure : renvoie { body, before, after } sans modifier l'entrée.
export function mergeCertSections(body, newTitle) {
  const sections = body.filter((b) => b.component === SECTION);
  const before = sections.map((s) => ({ title: s.title, cards: (s.cards || []).length }));
  if (sections.length === 0) return { body, before, after: [], changed: false };
  const [target, ...rest] = sections;
  const merged = {
    ...target,
    title: newTitle,
    cards: [...(target.cards || []), ...rest.flatMap((s) => s.cards || [])],
  };
  const restUids = new Set(rest.map((s) => s._uid));
  const nextBody = body.filter((b) => !restUids.has(b._uid)).map((b) => (b._uid === target._uid ? merged : b));
  const changed = rest.length > 0 || target.title !== newTitle;
  return { body: nextBody, before, after: [{ title: merged.title, cards: merged.cards.length }], changed };
}

async function main() {
  const slug = process.env.STORY_SLUG || "pages/a-propos";
  const newTitle = process.env.NEW_TITLE || "Nos certifications et récompenses";
  const dry = process.env.DRY_RUN === "1";
  const publish = process.env.PUBLISH === "1";

  const client = createClient();
  await client.detectHost();
  const found = await client.findStory(slug);
  if (!found) throw new Error(`Page ${slug} introuvable.`);
  const story = await client.getStory(found.id);
  const body = story.content?.body || [];

  const { body: nextBody, before, after, changed } = mergeCertSections(body, newTitle);
  console.log(`\nPage ${slug} (id ${story.id}) — sections « ${SECTION} » :`);
  for (const s of before) console.log(`  avant : « ${s.title} » (${s.cards} cartes)`);
  if (!before.length) throw new Error("Aucune section certifications / récompenses sur cette page.");
  for (const s of after) console.log(`  après : « ${s.title} » (${s.cards} cartes)`);
  if (!changed) {
    console.log("\nRien à faire : une seule section, déjà au bon titre.");
    return;
  }
  if (dry) {
    console.log("\n[DRY_RUN] Aucune écriture. Relancer sans simulation pour appliquer.");
    return;
  }
  await client.saveStory(story.id, { ...story.content, body: nextBody }, { publish });
  console.log(publish ? "\n✅ Page modifiée et publiée." : "\n✅ Page modifiée (brouillon) : cliquer Publish dans Storyblok pour la mettre en ligne.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(`\n❌ ${e.message}`);
    process.exit(1);
  });
}
