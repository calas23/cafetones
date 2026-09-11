import type { CSSProperties } from "react";
import { Icon } from "@/components/Icon";
import { PhoneText } from "@/components/PhoneText";
import { telHref } from "@/lib/phone";
import { pxOr } from "@/lib/num";
import { normalizeHex } from "@/lib/palette";
import { assetUrl, type SbBlok, type SiteSettings } from "@/lib/types";

type NavLink = SbBlok & { label?: string; link?: string; hidden?: boolean };

function FooterLinks({ links }: { links?: SbBlok[] }) {
  return (
    <div className="footer__links">
      {((links as NavLink[]) ?? []).map((l) => (
        <a key={l._uid} href={l.link || "#"} className={l.hidden ? "nav-hidden" : undefined}>
          {l.label}
        </a>
      ))}
    </div>
  );
}

export function Footer({ settings }: { settings: SiteSettings | null }) {
  // Réglages du site → Pied de page : hauteur du logo (px, vide = 36) et taille de l'ensemble (%).
  const rawLogo = settings?.footer_logo_height;
  const logoHeight = rawLogo === undefined || rawLogo === null || String(rawLogo).trim() === "" ? 36 : pxOr(rawLogo, 36, 12, 160);
  const rawZoom = settings?.footer_zoom;
  const footerZoom = rawZoom === undefined || rawZoom === null || String(rawZoom).trim() === "" ? 100 : pxOr(rawZoom, 100, 50, 150);
  const rawText = settings?.footer_text_size;
  const textScale = rawText === undefined || rawText === null || String(rawText).trim() === "" ? 100 : pxOr(rawText, 100, 50, 200);
  const footerStyle: Record<string, string | number> = {};
  if (footerZoom !== 100) footerStyle.zoom = footerZoom / 100;
  if (textScale !== 100) footerStyle["--footer-text-scale"] = textScale / 100;
  // Couleurs du pied de page (codes hex, vides = palette du site).
  const footerBg = normalizeHex(settings?.footer_bg);
  const footerText = normalizeHex(settings?.footer_text_color);
  const footerHeading = normalizeHex(settings?.footer_heading_color);
  if (footerBg) footerStyle["--footer-bg"] = footerBg;
  if (footerText) footerStyle["--footer-text"] = footerText;
  if (footerHeading) footerStyle["--footer-heading"] = footerHeading;
  const phone = settings?.phone || "06 62 11 97 48";
  // « Disposition du pied de page » : wide (défaut) = logo à gauche, colonnes à droite, toute la
  // largeur ; site = colonnes réparties sur la largeur du site (ancienne disposition).
  const wide = settings?.footer_layout !== "site";
  return (
    <footer className={wide ? "footer footer--wide" : "footer"} role="contentinfo" style={Object.keys(footerStyle).length ? (footerStyle as CSSProperties) : undefined}>
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl(settings?.logo) || "/img/logo-tones.svg"} alt={settings?.logo?.alt || "TONES — Café Italien"} className="footer__logo-img" style={logoHeight !== 36 ? { height: `${logoHeight}px` } : undefined} />
            </div>
            <p className="footer__desc">{settings?.footer_desc}</p>
          </div>

          <div className="footer__cols">
          <div>
            <div className="footer__heading">{settings?.footer_nav_heading || "Navigation"}</div>
            <FooterLinks links={settings?.footer_nav_links} />
          </div>

          <div>
            <div className="footer__heading">{settings?.footer_cafes_heading || "Nos cafés"}</div>
            <FooterLinks links={settings?.footer_cafes_links} />
          </div>

          <div>
            <div className="footer__heading">{settings?.footer_contact_heading || "Contact"}</div>
            <div className="footer__contact-line">
              <Icon name="map-pin" size={16} stroke={1.8} />
              {settings?.address}
            </div>
            <div className="footer__contact-line">
              <Icon name="phone" size={16} stroke={1.8} />
              <a href={telHref(phone)} data-location="footer"><PhoneText phone={phone} /></a>
            </div>
            <div className="footer__contact-line">
              <Icon name="mail" size={16} stroke={1.8} />
              {settings?.email}
            </div>
            <div className="footer__contact-line">
              <Icon name="clock" size={16} stroke={1.8} />
              {settings?.hours}
            </div>
          </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>{settings?.copyright}</span>
          <div>
            <a href={settings?.legal_link || "/pages/mentions-legales"}>{settings?.legal_label || "Mentions légales"}</a>
            {" · "}
            <a href={settings?.privacy_link || "/pages/mentions-legales#rgpd"}>{settings?.privacy_label || "Politique de confidentialité"}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
