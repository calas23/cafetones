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
import { headerSizeVars } from "@/lib/header-size";
import { paletteVars } from "@/lib/palette";
import { fontSettings } from "@/lib/fonts";
import { textScaleVars } from "@/lib/text-scale";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlobalBehaviors } from "@/components/behaviors/GlobalBehaviors";
import { StoryblokClientInit } from "@/components/StoryblokClientInit";

export const metadata: Metadata = {
  metadataBase: new URL("https://cafetones.fr"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode();
  const settings = await getSettings(draft).catch(() => null);
  // Variables CSS sur <html> : taille du logo du menu, palette de couleurs et polices
  // (Réglages du site). Rien de renseigné → pas d'attribut style, rendu d'origine.
  const fonts = fontSettings(settings);
  const rootStyle = { ...headerSizeVars(settings), ...paletteVars(settings), ...fonts.vars, ...textScaleVars(settings) };

  return (
    <html lang="fr" style={Object.keys(rootStyle).length ? rootStyle : undefined}>
      {fonts.hrefs?.length ? (
        // Polices Google Fonts choisies dans Storyblok (autres que celles du @import de style.css).
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {fonts.hrefs.map((href) => (
            <link key={href} rel="stylesheet" href={href} />
          ))}
        </head>
      ) : null}
      <body>
        {/* Google Tag Manager : snippet désactivé sur l'ancien site (GTM-XXXXXX).
            Seul le stub dataLayer est actif, comme avant. */}
        <script dangerouslySetInnerHTML={{ __html: "window.dataLayer = window.dataLayer || [];" }} />
        <StoryblokClientInit />
        <GlobalBehaviors />
        <Header settings={settings} />
        {children}
        <Footer settings={settings} />
      </body>
    </html>
  );
}
