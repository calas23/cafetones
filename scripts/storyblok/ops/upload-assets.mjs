// Opération de contenu : envoie des images de public/img dans la bibliothèque d'assets du space
// (même logique que le bootstrap : une image déjà présente, même nom de fichier, est réutilisée).
// FILES (ou FIELDS) = noms de fichiers séparés par des virgules, ex. "panettone-caffe.jpg,pandoro.jpg".
// Affiche pour chaque image l'adresse Storyblok et l'id à réutiliser dans un objet asset.

import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "../mapi.mjs";

const IMG_DIR = join(process.cwd(), "public/img");
const CONTENT_TYPES = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", svg: "image/svg+xml", webp: "image/webp", gif: "image/gif" };

async function uploadAsset(client, name) {
  const buffer = readFileSync(join(IMG_DIR, name));
  const signed = await client.api("POST", "/assets", { filename: name, size: `${buffer.length}` });
  const form = new FormData();
  for (const [key, value] of Object.entries(signed.fields || {})) form.append(key, value);
  const ext = name.split(".").pop().toLowerCase();
  form.append("file", new Blob([buffer], { type: CONTENT_TYPES[ext] || "application/octet-stream" }), name);
  const upload = await fetch(signed.post_url, { method: "POST", body: form });
  if (!upload.ok && upload.status !== 201 && upload.status !== 204) throw new Error(`Upload S3 de ${name} → ${upload.status}`);
  const finished = await client.api("GET", `/assets/${signed.id}/finish_upload`);
  return { id: finished.id ?? signed.id, filename: finished.filename || `https://a.storyblok.com/${signed.fields?.key || ""}` };
}

async function main() {
  const raw = process.env.FILES || process.env.FIELDS || "";
  const names = raw.split(",").map((s) => s.trim()).filter(Boolean);
  if (!names.length) throw new Error("Aucun fichier : indiquer des noms de public/img séparés par des virgules.");
  for (const name of names) {
    if (!/^[a-z0-9._-]+$/i.test(name)) throw new Error(`Nom de fichier invalide : ${name}`);
    readFileSync(join(IMG_DIR, name)); // existe ?
  }
  const dry = process.env.DRY_RUN === "1";
  const client = createClient();
  await client.detectHost();
  for (const name of names) {
    const found = await client.api("GET", `/assets?search=${encodeURIComponent(name)}&per_page=100`);
    const hit = (found.assets || []).find((a) => (a.filename || "").endsWith(`/${name}`));
    if (hit) {
      console.log(`  = ${name} déjà présent : ${hit.filename} (id ${hit.id})`);
      continue;
    }
    if (dry) {
      console.log(`  + ${name} : à envoyer (simulation)`);
      continue;
    }
    const up = await uploadAsset(client, name);
    console.log(`  + ${name} envoyé : ${up.filename} (id ${up.id})`);
  }
  console.log(dry ? "\n[DRY_RUN] Aucun envoi." : "\n✅ Terminé.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(`\n❌ ${e.message}`);
    process.exit(1);
  });
}
