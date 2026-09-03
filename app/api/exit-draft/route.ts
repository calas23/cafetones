import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

// Sort du Draft Mode et revient sur la version publiée de la page.
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const pathname = request.nextUrl.searchParams.get("pathname") || "/";
  redirect(pathname.startsWith("/") ? pathname : "/");
}
