import { Fragment, type ReactNode } from "react";
import { PhoneText } from "@/components/PhoneText";

// Rendu du richtext Storyblok limité aux nœuds utilisés par la page
// mentions légales : titres, paragraphes, listes, gras, liens, <br>.
// Le numéro de téléphone TONES est rendu en SVG anti-scraping (span.phone-text),
// comme sur l'ancien site.

export interface RichNode {
  type: string;
  content?: RichNode[];
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
}

const PHONE_RE = /(0\d(?:[ ]\d{2}){4})/g;

function renderTextWithPhone(text: string, keyBase: string, phone?: string): ReactNode {
  if (!phone || !text.includes(phone)) return text;
  const parts = text.split(PHONE_RE);
  return parts.map((part, i) =>
    part === phone ? <PhoneText key={`${keyBase}-p${i}`} phone={part} /> : <Fragment key={`${keyBase}-t${i}`}>{part}</Fragment>
  );
}

function renderText(node: RichNode, key: string, phone?: string): ReactNode {
  let out: ReactNode = renderTextWithPhone(node.text || "", key, phone);
  for (const mark of node.marks || []) {
    if (mark.type === "bold") out = <strong key={key}>{out}</strong>;
    if (mark.type === "link") {
      const href = (mark.attrs?.href as string) || "#";
      const target = (mark.attrs?.target as string) || undefined;
      out = (
        <a key={key} href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
          {out}
        </a>
      );
    }
  }
  return <Fragment key={key}>{out}</Fragment>;
}

function renderChildren(nodes: RichNode[] | undefined, phone?: string): ReactNode[] {
  return (nodes || []).map((n, i) => renderNode(n, `n${i}`, phone));
}

function renderNode(node: RichNode, key: string, phone?: string): ReactNode {
  switch (node.type) {
    case "doc":
      return <Fragment key={key}>{renderChildren(node.content, phone)}</Fragment>;
    case "heading": {
      const level = (node.attrs?.level as number) || 2;
      const children = renderChildren(node.content, phone);
      if (level === 3) return <h3 key={key}>{children}</h3>;
      if (level === 4) return <h4 key={key}>{children}</h4>;
      return <h2 key={key}>{children}</h2>;
    }
    case "paragraph":
      return <p key={key}>{renderChildren(node.content, phone)}</p>;
    case "bullet_list":
      return <ul key={key}>{renderChildren(node.content, phone)}</ul>;
    case "list_item": {
      // Un <li> ne contient qu'un paragraphe dans notre contenu : on le déballe
      // pour produire <li>texte</li> comme dans le HTML d'origine.
      const inner =
        node.content?.length === 1 && node.content[0].type === "paragraph"
          ? renderChildren(node.content[0].content, phone)
          : renderChildren(node.content, phone);
      return <li key={key}>{inner}</li>;
    }
    case "hard_break":
      return <br key={key} />;
    case "text":
      return renderText(node, key, phone);
    default:
      return null;
  }
}

export function renderRichText(doc: RichNode | undefined, phone?: string): ReactNode {
  if (!doc) return null;
  return renderNode(doc, "root", phone);
}
