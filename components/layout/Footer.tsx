import { Icon } from "@/components/Icon";
import { PhoneText } from "@/components/PhoneText";
import { telHref } from "@/lib/phone";
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
  const phone = settings?.phone || "06 62 11 97 48";
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl(settings?.logo) || "/img/logo-tones.svg"} alt={settings?.logo?.alt || "TONES — Café Italien"} className="footer__logo-img" />
            </div>
            <p className="footer__desc">{settings?.footer_desc}</p>
          </div>

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
