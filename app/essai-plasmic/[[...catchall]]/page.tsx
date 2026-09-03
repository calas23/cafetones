import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { PLASMIC, PLASMIC_PREFIX, plasmicConfigured } from "@/lib/plasmic-init";
import { PlasmicClientRootProvider } from "@/components/plasmic/plasmic-init-client";

// Pages construites dans Plasmic Studio, servies sous /essai-plasmic/…
// Le reste du site (Storyblok) n'est pas concerné.

type Params = { catchall?: string[] };

export const revalidate = 60;
export const dynamicParams = true;

function pathFor(catchall?: string[]): string {
  return catchall && catchall.length ? `${PLASMIC_PREFIX}/${catchall.join("/")}` : PLASMIC_PREFIX;
}

export async function generateStaticParams(): Promise<Params[]> {
  if (!plasmicConfigured) return [];
  try {
    const pages = await PLASMIC.fetchPages();
    return pages
      .filter((p) => p.path === PLASMIC_PREFIX || p.path.startsWith(`${PLASMIC_PREFIX}/`))
      .map((p) => ({ catchall: p.path.slice(PLASMIC_PREFIX.length).split("/").filter(Boolean) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { catchall } = await params;
  if (!plasmicConfigured) return {};
  const data = await PLASMIC.maybeFetchComponentData(pathFor(catchall)).catch(() => null);
  const meta = data?.entryCompMetas[0]?.pageMetadata;
  return { title: meta?.title ?? undefined, description: meta?.description ?? undefined, robots: { index: false } };
}

export default async function PlasmicPage({ params }: { params: Promise<Params> }) {
  const { catchall } = await params;
  if (!plasmicConfigured) notFound();
  const path = pathFor(catchall);
  const data = await PLASMIC.maybeFetchComponentData(path).catch(() => null);
  if (!data) notFound();
  const pageMeta = data.entryCompMetas[0];
  return (
    <main>
      <PlasmicClientRootProvider prefetchedData={data} pageParams={pageMeta.params} pageRoute={pageMeta.path}>
        <PlasmicComponent component={pageMeta.displayName} />
      </PlasmicClientRootProvider>
    </main>
  );
}
