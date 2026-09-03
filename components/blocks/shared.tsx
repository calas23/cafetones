import type { CSSProperties, ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { PhoneText } from "@/components/PhoneText";
import type { SbBlok } from "@/lib/types";

// Rendu du bloc `button` — reproduit les variantes de boutons du site d'origine.

export type ButtonBlok = SbBlok & {
  label?: string;
  link?: string;
  style?: string; // primary | secondary | white | white-outline
  size?: string; // lg | sm | ""
  icon?: string; // none | phone | bell | arrow-right
  location?: string; // data-location (tracking)
  phone_svg?: boolean; // le numéro dans le label est rendu en SVG anti-scraping
  extra_style?: string; // styles inline additionnels (cas particuliers du site)
};

const PHONE_IN_LABEL = /(0\d(?:[ ]\d{2}){4})/;

export function cssToObj(css?: string): CSSProperties | undefined {
  if (!css) return undefined;
  const obj: Record<string, string> = {};
  css.split(";").forEach((decl) => {
    const idx = decl.indexOf(":");
    if (idx === -1) return;
    const prop = decl.slice(0, idx).trim();
    const value = decl.slice(idx + 1).trim();
    if (!prop || !value) return;
    const key = prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    obj[key] = value;
  });
  return obj as CSSProperties;
}

function buttonLabel(b: ButtonBlok) {
  const label = b.label || "";
  if (b.phone_svg) {
    const m = label.match(PHONE_IN_LABEL);
    if (m && m.index !== undefined) {
      const before = label.slice(0, m.index);
      const after = label.slice(m.index + m[0].length);
      return (
        <>
          {before}
          <PhoneText phone={m[0]} />
          {after}
        </>
      );
    }
  }
  return label;
}

export function BlockButton({ blok }: { blok: ButtonBlok }) {
  const classes = ["btn", `btn--${blok.style || "primary"}`];
  if (blok.size) classes.push(`btn--${blok.size}`);
  const icon = blok.icon && blok.icon !== "none" ? blok.icon : null;
  return (
    <a
      href={blok.link || "#"}
      className={classes.join(" ")}
      data-location={blok.location || undefined}
      style={cssToObj(blok.extra_style)}
    >
      {icon ? <Icon name={icon} size={18} stroke={2} /> : null}
      {icon ? " " : null}
      {buttonLabel(blok)}
    </a>
  );
}

export function Buttons({ buttons }: { buttons?: SbBlok[] }) {
  // Un espace entre chaque bouton : équivalent du saut de ligne du HTML
  // d'origine (nécessaire hors conteneur flex, ignoré dedans).
  const out: ReactNode[] = [];
  ((buttons as ButtonBlok[]) ?? []).forEach((b, i) => {
    if (i > 0) out.push(" ");
    out.push(<BlockButton key={b._uid} blok={b} />);
  });
  return <>{out}</>;
}
