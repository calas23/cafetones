// Opération de contenu : pose des champs sur une story (niveau racine du contenu) ou sur un bloc
// précis de la story, sans toucher au reste.
//   STORY_SLUG  story cible (défaut config/site-settings)
//   BLOCK       vide = racine du contenu ; sinon _uid ou nom de composant du bloc cible
//               (premier bloc de ce composant trouvé, recherche dans tous les blocs imbriqués)
//   FIELDS      objet JSON de valeurs simples, ex. {"layout":"split"} (peut être vide si COPY_FROM)
//   COPY_FROM   optionnel : "slug" ou "slug#bloc" d'où copier des champs (ex.
//               pages/cafe-bureau-entreprise#landing_hero), y compris des images (objets asset)
//   COPY_FIELDS champs à copier, séparés par des virgules ; seuls les champs encore vides sur la
//               cible sont copiés (les valeurs déjà renseignées par la cliente sont conservées)
// DRY_RUN=1 affiche les valeurs avant/après sans écrire ; PUBLISH=1 publie aussi.

import { fileURLToPath } from "node:url";
import { createClient } from "../mapi.mjs";

const isBlok = (v) => v && typeof v === "object" && !Array.isArray(v) && typeof v.component === "string";

// Premier bloc dont le _uid ou le composant vaut `key`, en parcourant tous les tableaux de blocs.
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

const isEmpty = (v) =>
  v === undefined ||
  v === null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && !Array.isArray(v) && !v.filename && !v.id && Object.keys(v).length === 0);

function parseFields(raw) {
  if (!raw.trim()) return {};
  let fields;
  try {
    fields = JSON.parse(raw);
  } catch {
    throw new Error(`FIELDS doit être un objet JSON, reçu : ${raw.slice(0, 120)}`);
  }
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    throw new Error("FIELDS doit être un objet JSON, ex. {\"instagram_url\":\"https://…\"}");
  }
  for (const [k, v] of Object.entries(fields)) {
    if (!/^[a-z0-9_]+$/i.test(k)) throw new Error(`Nom de champ invalide : ${k}`);
    if (typeof v !== "string" && typeof v !== "number" && typeof v !== "boolean") throw new Error(`Valeur non simple pour ${k}`);
  }
  return fields;
}

async function main() {
  const slug = process.env.STORY_SLUG || "config/site-settings";
  const blockKey = (process.env.BLOCK || "").trim();
  const dry = process.env.DRY_RUN === "1";
  const publish = process.env.PUBLISH === "1";
  const fields = parseFields(process.env.FIELDS || "");
  const copyFrom = (process.env.COPY_FROM || "").trim();
  const copyFields = (process.env.COPY_FIELDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!Object.keys(fields).length && !(copyFrom && copyFields.length)) {
    throw new Error("Rien à faire : FIELDS vide et pas de COPY_FROM + COPY_FIELDS.");
  }
  for (const k of copyFields) if (!/^[a-z0-9_]+$/i.test(k)) throw new Error(`Nom de champ invalide : ${k}`);

  const client = createClient();
  await client.detectHost();
  const found = await client.findStory(slug);
  if (!found) throw new Error(`Story ${slug} introuvable.`);
  const story = await client.getStory(found.id);
  const content = story.content || {};
  const target = blockKey ? findBlok(content.body ?? content, blockKey) : content;
  if (!target) throw new Error(`Bloc « ${blockKey} » introuvable dans ${slug}.`);
  const where = blockKey ? `bloc ${target.component} (${target._uid})` : "racine du contenu";

  // Champs copiés depuis une autre story / un autre bloc, uniquement là où la cible est vide.
  const changes = { ...fields };
  if (copyFrom && copyFields.length) {
    const [srcSlug, srcKey] = copyFrom.split("#");
    const srcFound = await client.findStory(srcSlug);
    if (!srcFound) throw new Error(`Story source ${srcSlug} introuvable.`);
    const srcStory = await client.getStory(srcFound.id);
    const srcContent = srcStory.content || {};
    const src = srcKey ? findBlok(srcContent.body ?? srcContent, srcKey) : srcContent;
    if (!src) throw new Error(`Bloc source « ${srcKey} » introuvable dans ${srcSlug}.`);
    console.log(`\nSource : ${srcSlug} → ${srcKey ? `bloc ${src.component} (${src._uid})` : "racine du contenu"}`);
    for (const k of copyFields) {
      if (k in changes) continue;
      if (isEmpty(src[k])) {
        console.log(`  ${k} : vide à la source, rien à copier`);
        continue;
      }
      if (!isEmpty(target[k])) {
        console.log(`  ${k} : déjà renseigné sur la cible, conservé (${JSON.stringify(target[k]).slice(0, 80)})`);
        continue;
      }
      changes[k] = src[k];
    }
  }

  console.log(`\nStory ${slug} (id ${story.id}) → ${where} :`);
  if (!Object.keys(changes).length) {
    console.log("  aucun changement à appliquer.");
    return;
  }
  for (const [k, v] of Object.entries(changes)) {
    console.log(`  ${k} : ${JSON.stringify(target[k] ?? "").slice(0, 160)} → ${JSON.stringify(v).slice(0, 160)}`);
  }
  if (dry) {
    console.log("\n[DRY_RUN] Aucune écriture. Relancer sans simulation pour appliquer.");
    return;
  }
  Object.assign(target, changes);
  await client.saveStory(story.id, content, { publish });
  console.log(publish ? "\n✅ Story modifiée et publiée." : "\n✅ Story modifiée (brouillon) : cliquer Publish dans Storyblok pour la mettre en ligne.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(`\n❌ ${e.message}`);
    process.exit(1);
  });
}
