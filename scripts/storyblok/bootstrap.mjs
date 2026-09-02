// Bootstrap du space Storyblok : crée/actualise TOUT ce dont le site a besoin.
//   1. Groupes et composants (schémas de blocs)
//   2. Upload des images locales (public/img) comme assets du space
//   3. Dossiers pages/ et config/, puis les 9 stories, publiées
//   4. URL de l'éditeur visuel (Location) → https://cafetones.fr/api/draft?slug=
//   5. Webhook de revalidation (si STORYBLOK_WEBHOOK_SECRET est fourni)
//
// Variables d'environnement requises :
//   STORYBLOK_PAT       Personal Access Token (My account > Security)
//   STORYBLOK_SPACE_ID  identifiant numérique du space
// Optionnelles :
//   STORYBLOK_WEBHOOK_SECRET  active la création du webhook
//   SITE_URL                  défaut https://cafetones.fr
//   DRY_RUN=1                 affiche le plan sans rien écrire
//
// Idempotent : réexécutable sans danger (upsert partout).

import { readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import { COMPONENTS, GROUPS } from "./components.mjs";

const PAT = process.env.STORYBLOK_PAT;
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const SITE_URL = (process.env.SITE_URL || "https://cafetones.fr").replace(/\/$/, "");
const WEBHOOK_SECRET = process.env.STORYBLOK_WEBHOOK_SECRET || "";
const DRY = process.env.DRY_RUN === "1" || process.argv.includes("--dry-run");

const CONTENT_DIR = join(process.cwd(), "scripts/storyblok/content/stories");
const IMG_DIR = join(process.cwd(), "public/img");

const HOSTS = [
  "https://mapi.storyblok.com",
  "https://api-us.storyblok.com",
  "https://mapi-ap.storyblok.com",
  "https://mapi-ca.storyblok.com",
];

let HOST = HOSTS[0];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, path, body) {
  const url = `${HOST}/v1/spaces/${SPACE_ID}${path}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, {
      method,
      headers: { Authorization: PAT, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 429) {
      await sleep(1500 * (attempt + 1));
      continue;
    }
    if (!res.ok) {
      const text = await res.text();
      const err = new Error(`${method} ${path} → ${res.status} ${text.slice(0, 300)}`);
      err.status = res.status;
      throw err;
    }
    await sleep(300); // limite de débit Management API
    if (res.status === 204) return null;
    return res.json();
  }
  throw new Error(`${method} ${path} → 429 répété (rate limit)`);
}

async function detectHost() {
  for (const host of HOSTS) {
    HOST = host;
    try {
      const data = await api("GET", "");
      console.log(`✓ Space "${data.space?.name}" atteint via ${host}`);
      return;
    } catch (e) {
      if (e.status === 401) {
        throw new Error(
          "401 : le STORYBLOK_PAT est invalide ou n'a pas accès à ce space. Vérifiez le token et le SPACE_ID."
        );
      }
      // 404 → probablement mauvaise région, on essaie la suivante
    }
  }
  throw new Error(
    `Space ${SPACE_ID} introuvable sur ${HOSTS.join(", ")}. Vérifiez STORYBLOK_SPACE_ID et la région du space.`
  );
}

/* ---------------- composants ---------------- */

async function upsertComponents() {
  const groupsRes = await api("GET", "/component_groups");
  const groupUuids = new Map((groupsRes.component_groups || []).map((g) => [g.name, g.uuid]));
  for (const name of GROUPS) {
    if (!groupUuids.has(name)) {
      const created = await api("POST", "/component_groups", { component_group: { name } });
      groupUuids.set(name, created.component_group.uuid);
      console.log(`  + groupe "${name}"`);
    }
  }

  const existing = await api("GET", "/components");
  const byName = new Map((existing.components || []).map((c) => [c.name, c]));

  for (const def of COMPONENTS) {
    const payload = {
      component: {
        name: def.name,
        display_name: def.display_name,
        is_root: !!def.is_root,
        is_nestable: def.is_nestable !== false,
        component_group_uuid: groupUuids.get(def.group) || null,
        schema: def.schema,
      },
    };
    const current = byName.get(def.name);
    if (current) {
      await api("PUT", `/components/${current.id}`, payload);
      console.log(`  ~ composant ${def.name}`);
    } else {
      await api("POST", "/components", payload);
      console.log(`  + composant ${def.name}`);
    }
  }
}

/* ---------------- assets ---------------- */

const CONTENT_TYPES = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", svg: "image/svg+xml", webp: "image/webp", gif: "image/gif" };

async function uploadAsset(localName) {
  const filePath = join(IMG_DIR, localName);
  const buffer = readFileSync(filePath);
  const signed = await api("POST", "/assets", { filename: localName, size: `${buffer.length}` });

  const form = new FormData();
  for (const [key, value] of Object.entries(signed.fields || {})) form.append(key, value);
  const ext = localName.split(".").pop().toLowerCase();
  form.append("file", new Blob([buffer], { type: CONTENT_TYPES[ext] || "application/octet-stream" }), localName);

  const upload = await fetch(signed.post_url, { method: "POST", body: form });
  if (!upload.ok && upload.status !== 201 && upload.status !== 204) {
    throw new Error(`Upload S3 de ${localName} → ${upload.status}`);
  }
  const finished = await api("GET", `/assets/${signed.id}/finish_upload`);
  return { id: finished.id ?? signed.id, filename: finished.filename || `https://a.storyblok.com/${signed.fields?.key || ""}` };
}

async function ensureAssets(neededFiles) {
  const map = new Map(); // "/img/x.jpg" → {id, filename}
  for (const local of neededFiles) {
    const name = basename(local);
    const found = await api("GET", `/assets?search=${encodeURIComponent(name)}&per_page=100`);
    const hit = (found.assets || []).find((a) => (a.filename || "").endsWith(`/${name}`));
    if (hit) {
      map.set(local, { id: hit.id, filename: hit.filename });
      console.log(`  = asset ${name} (déjà présent)`);
    } else {
      const uploaded = await uploadAsset(name);
      map.set(local, uploaded);
      console.log(`  + asset ${name} → ${uploaded.filename}`);
    }
  }
  return map;
}

function collectLocalImages(node, out) {
  if (Array.isArray(node)) {
    node.forEach((n) => collectLocalImages(n, out));
  } else if (node && typeof node === "object") {
    if (typeof node.filename === "string" && node.filename.startsWith("/img/")) out.add(node.filename);
    for (const value of Object.values(node)) collectLocalImages(value, out);
  }
}

function rewriteAssets(node, assetMap) {
  if (Array.isArray(node)) return node.map((n) => rewriteAssets(n, assetMap));
  if (node && typeof node === "object") {
    const out = {};
    for (const [key, value] of Object.entries(node)) out[key] = rewriteAssets(value, assetMap);
    if (typeof out.filename === "string") {
      if (out.filename.startsWith("/img/") && assetMap.has(out.filename)) {
        const a = assetMap.get(out.filename);
        out.id = a.id;
        out.filename = a.filename;
      }
      out.fieldtype = "asset";
    }
    return out;
  }
  return node;
}

/* ---------------- stories ---------------- */

async function findStory(withSlug) {
  const res = await api("GET", `/stories?with_slug=${encodeURIComponent(withSlug)}`);
  return (res.stories || [])[0] || null;
}

async function ensureFolder(slug, name) {
  const existing = await findStory(slug);
  if (existing) return existing.id;
  const created = await api("POST", "/stories", {
    story: { name, slug, is_folder: true, parent_id: 0 },
  });
  console.log(`  + dossier ${slug}/`);
  return created.story.id;
}

async function upsertStory(story, parentId, assetMap) {
  const content = rewriteAssets(story.content, assetMap);
  const existing = await findStory(story.full_slug);
  const payload = {
    story: { name: story.name, slug: story.slug, parent_id: parentId, content },
    publish: 1,
  };
  if (existing) {
    await api("PUT", `/stories/${existing.id}`, payload);
    console.log(`  ~ story ${story.full_slug} (mise à jour + publiée)`);
  } else {
    await api("POST", "/stories", payload);
    console.log(`  + story ${story.full_slug} (créée + publiée)`);
  }
}

/* ---------------- réglages du space + webhook ---------------- */

async function configureSpace() {
  const previewUrl = `${SITE_URL}/api/draft?slug=`;
  try {
    await api("PUT", "", { space: { domain: previewUrl } });
    console.log(`✓ Éditeur visuel : Location = ${previewUrl}`);
  } catch (e) {
    console.warn(`! Impossible de configurer l'URL de l'éditeur visuel automatiquement (${e.message}).`);
    console.warn(`  → À faire à la main : Settings > Visual Editor > Location : ${previewUrl}`);
  }
}

async function configureWebhook() {
  if (!WEBHOOK_SECRET) {
    console.log("· Pas de STORYBLOK_WEBHOOK_SECRET : webhook de revalidation non créé (le site se met à jour en ≤ 60 s quand même).");
    return;
  }
  const endpoint = `${SITE_URL}/api/revalidate?secret=${WEBHOOK_SECRET}`;
  try {
    const existing = await api("GET", "/webhook_endpoints");
    const found = (existing.webhook_endpoints || []).find((w) => w.name === "Revalidation Next.js");
    const payload = {
      webhook_endpoint: {
        name: "Revalidation Next.js",
        endpoint,
        actions: ["story.published", "story.unpublished", "story.deleted", "story.moved"],
        activated: true,
      },
    };
    if (found) {
      await api("PUT", `/webhook_endpoints/${found.id}`, payload);
      console.log("✓ Webhook de revalidation mis à jour");
    } else {
      await api("POST", "/webhook_endpoints", payload);
      console.log("✓ Webhook de revalidation créé");
    }
  } catch (e) {
    console.warn(`! Webhook non configurable via l'API (${e.message}).`);
    console.warn(`  → À faire à la main : Settings > Webhooks : ${endpoint} sur "Story published/unpublished/deleted/moved"`);
  }
}

/* ---------------- main ---------------- */

async function main() {
  const stories = readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(CONTENT_DIR, f), "utf8")));

  const needed = new Set();
  stories.forEach((s) => collectLocalImages(s.content, needed));

  console.log(`Plan : ${COMPONENTS.length} composants, ${needed.size} images, ${stories.length} stories → space ${SPACE_ID || "?"}`);

  if (DRY) {
    console.log("\n-- DRY RUN --");
    console.log("Composants :", COMPONENTS.map((c) => c.name).join(", "));
    console.log("Images :", [...needed].join(", "));
    console.log("Stories :", stories.map((s) => s.full_slug).join(", "));
    console.log(`Éditeur visuel : ${SITE_URL}/api/draft?slug=`);
    console.log(`Webhook : ${WEBHOOK_SECRET ? SITE_URL + "/api/revalidate?secret=***" : "non (pas de secret)"}`);
    return;
  }

  if (!PAT || !SPACE_ID) {
    throw new Error("STORYBLOK_PAT et STORYBLOK_SPACE_ID sont requis (secrets GitHub ou variables d'environnement).");
  }

  await detectHost();

  console.log("\n[1/5] Composants…");
  await upsertComponents();

  console.log("\n[2/5] Images…");
  const assetMap = await ensureAssets([...needed]);

  console.log("\n[3/5] Stories…");
  const pagesFolderId = await ensureFolder("pages", "Pages");
  const configFolderId = await ensureFolder("config", "Configuration");
  for (const story of stories) {
    const parentId = story.full_slug.startsWith("pages/")
      ? pagesFolderId
      : story.full_slug.startsWith("config/")
        ? configFolderId
        : 0;
    await upsertStory(story, parentId, assetMap);
  }

  console.log("\n[4/5] Éditeur visuel…");
  await configureSpace();

  console.log("\n[5/5] Webhook…");
  await configureWebhook();

  console.log("\n✅ Bootstrap terminé. Ouvrez app.storyblok.com : le contenu du site est là, publié.");
}

main().catch((e) => {
  console.error(`\n❌ ${e.message}`);
  process.exit(1);
});
