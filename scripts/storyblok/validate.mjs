// Validation croisée : contenu extrait ↔ schémas de composants.
// Chaque bloc du contenu doit exister dans les schémas, et chacun de ses
// champs doit être déclaré. Échoue bruyamment en cas de dérive.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { COMPONENTS } from "./components.mjs";

const CONTENT_DIR = join(process.cwd(), "scripts/storyblok/content/stories");
const IGNORE_KEYS = new Set(["_uid", "component", "_editable"]);

const schemas = new Map();
for (const c of COMPONENTS) {
  schemas.set(
    c.name,
    new Set(Object.keys(c.schema).filter((k) => !k.startsWith("tab-")))
  );
}

let errors = 0;
function checkBlok(blok, path) {
  if (!blok || typeof blok !== "object") return;
  const name = blok.component;
  if (!schemas.has(name)) {
    console.error(`✗ Composant inconnu "${name}" (${path})`);
    errors++;
    return;
  }
  const fields = schemas.get(name);
  for (const [key, value] of Object.entries(blok)) {
    if (IGNORE_KEYS.has(key)) continue;
    if (!fields.has(key)) {
      console.error(`✗ Champ "${key}" absent du schéma de "${name}" (${path})`);
      errors++;
    }
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (v && typeof v === "object" && v.component) checkBlok(v, `${path}.${key}[${i}]`);
      });
    }
  }
}

for (const file of readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"))) {
  const story = JSON.parse(readFileSync(join(CONTENT_DIR, file), "utf8"));
  checkBlok(story.content, file);
}

// Whitelists : chaque composant référencé doit exister.
for (const c of COMPONENTS) {
  for (const [key, field] of Object.entries(c.schema)) {
    if (field?.type === "bloks") {
      for (const w of field.component_whitelist || []) {
        if (!schemas.has(w)) {
          console.error(`✗ Whitelist de ${c.name}.${key} référence un composant inconnu: ${w}`);
          errors++;
        }
      }
    }
  }
}

if (errors) {
  console.error(`\n${errors} erreur(s) de cohérence.`);
  process.exit(1);
}
console.log(`✓ ${schemas.size} composants, contenu cohérent avec les schémas.`);
