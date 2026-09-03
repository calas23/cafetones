import { Fragment, type ReactNode } from "react";
import { telHref } from "./phone";

// Mini-format des champs texte Storyblok :
//   *mot*  → <em>mot</em>
//   saut de ligne → <br>
// `fmtTel` ajoute : tout numéro de téléphone (0X XX XX XX XX) devient un lien tel:
// — uniquement pour les champs qui contenaient un lien téléphone dans le site d'origine.

const PHONE_RE = /(0\d(?:[ ]\d{2}){4})/g;

function renderEm(text: string, keyBase: string): ReactNode[] {
  const parts = text.split(/\*([^*]+)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <em key={`${keyBase}-em${i}`}>{part}</em> : <Fragment key={`${keyBase}-t${i}`}>{part}</Fragment>
  );
}

function renderLine(line: string, keyBase: string, tel: boolean): ReactNode[] {
  if (!tel) return renderEm(line, keyBase);
  const chunks = line.split(PHONE_RE);
  return chunks.map((chunk, i) =>
    i % 2 === 1 ? (
      <a key={`${keyBase}-tel${i}`} href={telHref(chunk)}>{chunk}</a>
    ) : (
      <Fragment key={`${keyBase}-c${i}`}>{renderEm(chunk, `${keyBase}-c${i}`)}</Fragment>
    )
  );
}

function renderText(text: string | undefined, tel: boolean): ReactNode {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {renderLine(line, `l${i}`, tel)}
    </Fragment>
  ));
}

/** Titres / textes : *em* et sauts de ligne. */
export function fmt(text: string | undefined): ReactNode {
  return renderText(text, false);
}

/** Comme fmt, avec auto-lien des numéros de téléphone. */
export function fmtTel(text: string | undefined): ReactNode {
  return renderText(text, true);
}

/** Découpe un textarea en paragraphes (séparés par une ligne vide). */
export function paragraphs(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
