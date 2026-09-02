import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { CACHE_TAG } from "@/lib/content";

// Webhook Storyblok (story publiée/dépubliée/supprimée) → purge du cache.
// Optionnel : sans webhook, le site se rafraîchit de lui-même sous 60 s (ISR).
// URL à configurer : https://cafetones.fr/api/revalidate?secret=<STORYBLOK_WEBHOOK_SECRET>

export async function POST(request: NextRequest) {
  const secret = process.env.STORYBLOK_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ revalidated: false, error: "STORYBLOK_WEBHOOK_SECRET non configuré" }, { status: 503 });
  }
  const provided = request.nextUrl.searchParams.get("secret");
  if (provided !== secret) {
    return Response.json({ revalidated: false, error: "secret invalide" }, { status: 401 });
  }
  revalidateTag(CACHE_TAG, "max");
  return Response.json({ revalidated: true, now: Date.now() });
}
