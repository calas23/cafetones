// Opération de lecture seule : affiche le contenu (brouillon courant) d'une story, ou d'un bloc
// précis (BLOCK = _uid ou nom de composant, premier trouvé), pour diagnostiquer ce que la cliente
// a saisi. N'écrit rien. STORY_SLUG requis (défaut config/site-settings).

import { fileURLToPath } from "node:url";
import { createClient } from "../mapi.mjs";

const isBlok = (v) => v && typeof v === "object" && !Array.isArray(v) && typeof v.component === "string";

function findBlok(node, key) {
  if (Array.isArray(node)) {
    for (const item of node) {
      const hit = findBlok(item, key);
      if (hit) return hit;
    }
    return null;
  }
  if (!node || typeof node !== "object") return null;
  if (isBlok(node) && (node._uid === key || node.component === key)) return node;
  for (const v of Object.values(node)) {
    if (Array.isArray(v) || (v && typeof v === "object")) {
      const hit = findBlok(v, key);
      if (hit) return hit;
    }
  }
  return null;
}

async function main() {
  const slug = process.env.STORY_SLUG || "config/site-settings";
  const blockKey = (process.env.BLOCK || "").trim();
  const client = createClient();
  await client.detectHost();
  const found = await client.findStory(slug);
  if (!found) throw new Error(`Story ${slug} introuvable.`);
  const story = await client.getStory(found.id);
  const content = story.content || {};
  const target = blockKey ? findBlok(content.body ?? content, blockKey) : content;
  if (!target) throw new Error(`Bloc « ${blockKey} » introuvable dans ${slug}.`);
  console.log(`\nStory ${slug} (id ${story.id}, publiée : ${story.published ? "oui" : "non"}, brouillon non publié : ${story.unpublished_changes ? "oui" : "non"})`);
  console.log(blockKey ? `Bloc ${target.component} (${target._uid}) :` : "Contenu :");
  console.log(JSON.stringify(target, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(`\n❌ ${e.message}`);
    process.exit(1);
  });
}
