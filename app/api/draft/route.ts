import { createHash, timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

// Entrée de l'éditeur visuel Storyblok (Settings > Visual Editor pointe ici).
// Valide la signature envoyée par Storyblok (_storyblok_tk = SHA1 de
// "space_id:token_preview:timestamp"), active le Draft Mode de Next.js puis
// redirige vers la page demandée en conservant les paramètres du bridge.

const MAX_AGE_SECONDS = 3600;

function isValidEditorRequest(searchParams: URLSearchParams): boolean {
  const previewToken = process.env.STORYBLOK_PREVIEW_TOKEN;
  if (!previewToken) return false;

  const spaceId = searchParams.get("_storyblok_tk[space_id]");
  const timestamp = searchParams.get("_storyblok_tk[timestamp]");
  const token = searchParams.get("_storyblok_tk[token]");
  if (!spaceId || !timestamp || !token) return false;

  const expected = createHash("sha1").update(`${spaceId}:${previewToken}:${timestamp}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const age = Math.floor(Date.now() / 1000) - Number(timestamp);
  return Number.isFinite(age) && age < MAX_AGE_SECONDS;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  if (!isValidEditorRequest(searchParams)) {
    return new Response("Requête non autorisée (signature Storyblok invalide).", { status: 401 });
  }

  (await draftMode()).enable();

  const slug = searchParams.get("slug") || "home";
  const path = slug === "home" || slug === "" ? "/" : `/${slug.replace(/^\//, "")}`;

  // Conserve les paramètres _storyblok pour que le bridge d'édition live s'active.
  const passthrough = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== "slug") passthrough.set(key, value);
  });
  const qs = passthrough.toString();
  redirect(qs ? `${path}?${qs}` : path);
}
