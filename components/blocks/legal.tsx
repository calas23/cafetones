import { storyblokEditable } from "@storyblok/react/rsc";
import { renderRichText, type RichNode } from "@/lib/richtext";
import type { SbBlok } from "@/lib/types";

// Mentions légales + politique de confidentialité (deux richtext, séparés par
// le titre stylisé #rgpd, comme sur la page d'origine).

type LegalBlok = SbBlok & {
  title?: string;
  content_mentions?: RichNode;
  rgpd_title?: string;
  content_rgpd?: RichNode;
  back_label?: string;
  back_link?: string;
  phone?: string;
};

export function LegalSection({ blok }: { blok: LegalBlok }) {
  return (
    <section className="section" style={{ paddingTop: "calc(var(--header-height) + 3rem)" }} {...storyblokEditable(blok)}>
      <div className="container container--narrow legal-content">
        <h1>{blok.title}</h1>

        {renderRichText(blok.content_mentions, blok.phone)}

        {blok.rgpd_title ? (
          <h2
            id="rgpd"
            style={{
              marginTop: "5rem",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              letterSpacing: "-0.02em",
              borderBottom: "none",
              paddingBottom: 0,
            }}
          >
            {blok.rgpd_title}
          </h2>
        ) : null}

        {renderRichText(blok.content_rgpd, blok.phone)}

        <div
          className="text-center"
          style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--color-border-light)" }}
        >
          <a href={blok.back_link || "/"} style={{ fontSize: "0.92rem" }}>{blok.back_label}</a>
        </div>
      </div>
    </section>
  );
}
