import { phoneSvg } from "@/lib/phone";

// Rendu serveur du numéro en SVG (anti-scraping) — DOM final identique à
// l'ancien remplacement JS des spans .phone-text.
export function PhoneText({ phone, large = false }: { phone: string; large?: boolean }) {
  const className = large ? "phone-text phone-text--lg" : "phone-text";
  return <span className={className} dangerouslySetInnerHTML={{ __html: phoneSvg(phone, large) }} />;
}
