// Opération de contenu : pose des champs (niveau racine du contenu) sur une page ou une story de
// configuration, sans toucher au reste. FIELDS = objet JSON, ex. {"instagram_url":"https://…"}.
// DRY_RUN=1 affiche les valeurs avant/après sans écrire ; PUBLISH=1 publie aussi.

import { fileURLToPath } from "node:url";
import { createClient } from "../mapi.mjs";

async function main() {
  const slug = process.env.STORY_SLUG || "config/site-settings";
  const raw = process.env.FIELDS || "";
  const dry = process.env.DRY_RUN === "1";
  const publish = process.env.PUBLISH === "1";
  let fields;
  try {
    fields = JSON.parse(raw);
  } catch {
    throw new Error(`FIELDS doit être un objet JSON, reçu : ${raw.slice(0, 120)}`);
  }
  if (!fields || typeof fields !== "object" || Array.isArray(fields) || !Object.keys(fields).length) {
    throw new Error("FIELDS doit être un objet JSON non vide, ex. {\"instagram_url\":\"https://…\"}");
  }
  for (const [k, v] of Object.entries(fields)) {
    if (!/^[a-z0-9_]+$/i.test(k)) throw new Error(`Nom de champ invalide : ${k}`);
    if (typeof v !== "string" && typeof v !== "number" && typeof v !== "boolean") throw new Error(`Valeur non simple pour ${k}`);
  }

  const client = createClient();
  await client.detectHost();
  const found = await client.findStory(slug);
  if (!found) throw new Error(`Story ${slug} introuvable.`);
  const story = await client.getStory(found.id);
  const content = story.content || {};

  console.log(`\nStory ${slug} (id ${story.id}) :`);
  for (const [k, v] of Object.entries(fields)) console.log(`  ${k} : ${JSON.stringify(content[k] ?? "")} → ${JSON.stringify(v)}`);
  if (dry) {
    console.log("\n[DRY_RUN] Aucune écriture. Relancer sans simulation pour appliquer.");
    return;
  }
  await client.saveStory(story.id, { ...content, ...fields }, { publish });
  console.log(publish ? "\n✅ Story modifiée et publiée." : "\n✅ Story modifiée (brouillon) : cliquer Publish dans Storyblok pour la mettre en ligne.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(`\n❌ ${e.message}`);
    process.exit(1);
  });
}
