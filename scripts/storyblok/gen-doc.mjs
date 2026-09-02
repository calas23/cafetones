// Régénère la section "Référence des blocs" de STORYBLOK_SETUP.md
// depuis scripts/storyblok/components.mjs (source de vérité).

import { readFileSync, writeFileSync } from "node:fs";
import { COMPONENTS } from "./components.mjs";

const START = "<!-- BLOCKS:START -->";
const END = "<!-- BLOCKS:END -->";

const TYPE_FR = {
  text: "Texte",
  textarea: "Texte long",
  asset: "Image",
  richtext: "Texte riche",
  boolean: "Case à cocher",
  option: "Choix",
  options: "Choix multiples",
  bloks: "Liste de blocs",
};

function fieldLine(key, field) {
  let type = TYPE_FR[field.type] || field.type;
  if (field.type === "bloks") type += ` (${(field.component_whitelist || []).join(", ")})`;
  if (field.type === "option" || field.type === "options") {
    const values = (field.options || []).map((o) => o.value).filter(Boolean).join(" · ");
    if (values) type += ` — valeurs : ${values}`;
  }
  return `| \`${key}\` | ${type} | ${field.display_name || ""} |`;
}

function componentDoc(c) {
  const lines = [];
  const kind = c.is_root ? "type de contenu" : "bloc imbriquable";
  lines.push(`### \`${c.name}\` — ${c.display_name} *(${kind}, groupe ${c.group})*`);
  lines.push("");
  lines.push("| Champ (nom technique) | Type | Libellé |");
  lines.push("|---|---|---|");
  for (const [key, field] of Object.entries(c.schema)) {
    if (field?.type === "tab") continue;
    lines.push(fieldLine(key, field));
  }
  lines.push("");
  return lines.join("\n");
}

const byGroup = { Pages: [], Sections: [], Éléments: [] };
for (const c of COMPONENTS) byGroup[c.group].push(c);

const parts = [];
for (const [group, comps] of Object.entries(byGroup)) {
  parts.push(`## Groupe « ${group} » (${comps.length})`);
  parts.push("");
  for (const c of comps) parts.push(componentDoc(c));
}

const doc = readFileSync("STORYBLOK_SETUP.md", "utf8");
const s = doc.indexOf(START);
const e = doc.indexOf(END);
if (s === -1 || e === -1) throw new Error("Marqueurs BLOCKS:START/END introuvables dans STORYBLOK_SETUP.md");
const updated = doc.slice(0, s + START.length) + "\n\n" + parts.join("\n") + "\n" + doc.slice(e);
writeFileSync("STORYBLOK_SETUP.md", updated);
console.log(`✓ Référence régénérée : ${COMPONENTS.length} composants documentés.`);
