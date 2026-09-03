import type { Metadata } from "next";
import { draftMode } from "next/headers";

// CSS d'origine importés tels quels (style.css d'abord, pages ensuite,
// illustrations en dernier — même ordre de cascade que l'ancien site).
import "@/css/style.css";
import "@/css/about.css";
import "@/css/chr.css";
import "@/css/contact.css";
import "@/css/gamme.css";
import "@/css/home.css";
import "@/css/landing.css";
import "@/css/particuliers.css";
import "@/css/legal.css";
import "@/css/illustrations.css";

import "@/lib/storyblok";
import { getSettings } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlobalBehaviors } from "@/components/behaviors/GlobalBehaviors";
import { StoryblokClientInit } from "@/components/StoryblokClientInit";
import { SiteChrome } from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://cafetones.fr"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode();
  const settings = await getSettings(draft).catch(() => null);

  return (
    <html lang="fr">
      <body>
        {/* Google Tag Manager : snippet désactivé sur l'ancien site (GTM-XXXXXX).
            Seul le stub dataLayer est actif, comme avant. */}
        <script dangerouslySetInnerHTML={{ __html: "window.dataLayer = window.dataLayer || [];" }} />
        <StoryblokClientInit />
        <GlobalBehaviors />
        <SiteChrome header={<Header settings={settings} />} footer={<Footer settings={settings} />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
