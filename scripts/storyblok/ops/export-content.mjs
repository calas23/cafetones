// Opération de lecture seule : exporte le contenu de toutes les stories du space (brouillon courant,
// modifications non publiées comprises) dans scripts/storyblok/content/live/<full_slug>.json, au même
// format que les seeds (name, slug, full_slug, content). Le workflow « Storyblok Content Op » pousse
// ensuite ce dossier sur la branche `content/live-export` : on peut ainsi rejouer le site en local
// avec le contenu réel (STORYBLOK_LOCAL_CONTENT=1 après copie dans content/stories/) ou garder une
// sauvegarde du contenu saisi par la cliente. N'écrit rien dans Storyblok.

import { fileURLToPath } from "node:url";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "../mapi.mjs";

const OUT_DIR = join(process.cwd(), "scripts/storyblok/content/live");

async function listStories(client) {
  const all = [];
  for (let page = 1; page < 50; page++) {
    const res = await client.api("GET", `/stories?per_page=100&page=${page}`);
    const batch = res.stories || [];
    all.push(...batch.filter((s) => !s.is_folder));
    if (batch.length < 100) break;
  }
  return all;
}

async function main() {
  const client = createClient();
  await client.detectHost();
  const stories = await listStories(client);
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  const exportedAt = new Date().toISOString();
  console.log(`\n${stories.length} stories à exporter vers ${OUT_DIR} :`);
  for (const s of stories) {
    const story = await client.getStory(s.id);
    const file = `${story.full_slug.replace(/\//g, "__")}.json`;
    const data = {
      name: story.name,
      slug: story.slug,
      full_slug: story.full_slug,
      published: Boolean(story.published),
      unpublished_changes: Boolean(story.unpublished_changes),
      exported_at: exportedAt,
      content: story.content,
    };
    writeFileSync(join(OUT_DIR, file), JSON.stringify(data, null, 2) + "\n");
    console.log(`  ${story.full_slug} → ${file} (publiée : ${story.published ? "oui" : "non"}, brouillon non publié : ${story.unpublished_changes ? "oui" : "non"})`);
  }
  console.log("\n✅ Export terminé.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(`\n❌ ${e.message}`);
    process.exit(1);
  });
}
