// Opération de lecture seule (diagnostic) : pour chaque page du site public, liste les images utilisées
// (balises <img>, fonds CSS url(...)), vérifie qu'elles répondent (code HTTP, type, poids) et signale
// les fichiers lourds (> 1 Mo). Compare aussi, pour chaque story, les images du brouillon Storyblok
// avec celles de la page publiée (une image présente dans le brouillon mais absente de la page
// publiée = modification non publiée). Ne modifie rien.
//   SITE_URL  (défaut https://cafetones.fr)

import { fileURLToPath } from "node:url";
import { createClient } from "../mapi.mjs";

const SITE = (process.env.SITE_URL || "https://cafetones.fr").replace(/\/$/, "");
const PAGES = ["/", "/pages/notre-gamme", "/pages/cafe-bureau-entreprise", "/pages/restauration-chr", "/pages/particuliers", "/pages/a-propos", "/pages/contact", "/pages/mentions-legales"];

const fmt = (n) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} Mo` : `${Math.round(n / 1024)} Ko`);

async function head(url) {
  try {
    const res = await fetch(url, { method: "GET", headers: { Range: "bytes=0-0" } });
    const total = res.headers.get("content-range")?.split("/")[1] || res.headers.get("content-length") || "?";
    return { status: res.status, type: res.headers.get("content-type") || "?", size: Number(total) || 0 };
  } catch (e) {
    return { status: "ERR", type: String(e.message).slice(0, 60), size: 0 };
  }
}

function assetsOf(node, out = new Set()) {
  if (Array.isArray(node)) node.forEach((n) => assetsOf(n, out));
  else if (node && typeof node === "object") {
    if (typeof node.filename === "string" && node.filename.startsWith("http")) out.add(node.filename);
    Object.values(node).forEach((v) => assetsOf(v, out));
  }
  return out;
}

async function main() {
  const client = createClient();
  await client.detectHost();
  const stories = (await client.api("GET", "/stories?per_page=100")).stories.filter((s) => !s.is_folder);
  const drafts = {};
  for (const s of stories) {
    const full = await client.getStory(s.id);
    drafts[s.full_slug] = { assets: assetsOf(full.content), unpublished: !!full.unpublished_changes };
  }
  // Version publiée réelle (API de contenu, token public du space) : ce que le site public reçoit.
  const keys = (await client.api("GET", "/api_keys")).api_keys || [];
  const pub = keys.find((k) => k.access === "public");
  const cdnHost = { "https://mapi.storyblok.com": "https://api.storyblok.com", "https://api-us.storyblok.com": "https://api-us.storyblok.com" }[client.host?.() || "https://mapi.storyblok.com"] || "https://api.storyblok.com";
  const published = {};
  if (pub) {
    for (const s of stories) {
      const res = await fetch(`${cdnHost}/v2/cdn/stories/${s.full_slug}?version=published&token=${pub.token}&cv=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        published[s.full_slug] = { assets: assetsOf(data.story.content), published_at: data.story.published_at };
      } else {
        published[s.full_slug] = { status: res.status };
      }
    }
    console.log("\nVersion publiée (API de contenu) :");
    for (const [slug, p] of Object.entries(published)) {
      const d = drafts[slug];
      const onlyDraft = p.assets ? [...d.assets].filter((a) => !p.assets.has(a)).map((a) => a.split("/").pop()) : [];
      console.log(`  ${slug} : ${p.assets ? `publiée le ${p.published_at}` : `HTTP ${p.status} (non publiée ?)`}${onlyDraft.length ? ` — images seulement dans le brouillon : ${onlyDraft.join(", ")}` : ""}`);
    }
  } else console.log("\n(aucun token public trouvé : version publiée non vérifiée)");
  const seen = new Map();
  for (const p of PAGES) {
    const res = await fetch(`${SITE}${p}`, { headers: { "User-Agent": "Mozilla/5.0 (check-assets)" } });
    const html = await res.text();
    const urls = new Set();
    for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) urls.add(m[1]);
    for (const m of html.matchAll(/url\((?:&quot;|"|')?([^"')&]+)(?:&quot;|"|')?\)/g)) urls.add(m[1]);
    console.log(`\n## ${SITE}${p} → HTTP ${res.status}, ${fmt(html.length)} de HTML, ${urls.size} images`);
    for (const u of urls) {
      const abs = u.startsWith("http") ? u : `${SITE}${u}`;
      if (!seen.has(abs)) seen.set(abs, await head(abs));
      const r = seen.get(abs);
      const flag = r.status !== 200 && r.status !== 206 ? "❌" : r.size > 1024 * 1024 ? "⚠️ lourd" : "✓";
      console.log(`  ${flag} ${r.status} ${r.type.split(";")[0]} ${r.size ? fmt(r.size) : ""} ${abs.replace(SITE, "")}`);
    }
    const slug = p === "/" ? "home" : p.replace(/^\//, "");
    const d = drafts[slug];
    if (d) {
      const missing = [...d.assets].filter((a) => !html.includes(a) && !html.includes(a.replace(/&/g, "&amp;")));
      console.log(`  brouillon Storyblok : ${d.unpublished ? "modifications NON publiées" : "identique au publié"}${missing.length ? ` — images du brouillon absentes de la page publiée : ${missing.map((m) => m.split("/").pop()).join(", ")}` : ""}`);
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(`\n❌ ${e.message}`);
    process.exit(1);
  });
}
