"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { PhoneText } from "@/components/PhoneText";
import { telHref } from "@/lib/phone";
import { assetUrl, type SbBlok, type SiteSettings } from "@/lib/types";

// Header + menu mobile — markup et comportements identiques à l'ancien
// header statique + js/main.js (état au scroll, hamburger, fermeture au clic).

type NavLink = SbBlok & { label?: string; link?: string; hidden?: boolean };

export function Header({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const phone = settings?.phone || "06 62 11 97 48";
  const navLinks = (settings?.nav_links as NavLink[] | undefined) ?? [];
  const ctaLabel = settings?.cta_label || "Demander un devis";
  const ctaLink = settings?.cta_link || "/pages/contact";
  const closeMenu = () => setMenuOpen(false);

  const renderLinks = () =>
    navLinks.map((l) => {
      const active = l.link && pathname === l.link;
      const cls = [l.hidden ? "nav-hidden" : "", active ? "active" : ""].filter(Boolean).join(" ");
      return (
        <a key={l._uid} href={l.link || "#"} className={cls || undefined} onClick={closeMenu}>
          {l.label}
        </a>
      );
    });

  return (
    <>
      <header className={scrolled ? "header header--scrolled" : "header"} role="banner">
        <div className="header__inner">
          <a href="/" className="header__logo" aria-label="TONES — Accueil">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl(settings?.logo) || "/img/logo-tones.svg"} alt={settings?.logo?.alt || "TONES — Café Italien"} className="header__logo-img" />
          </a>

          <nav className="header__nav" role="navigation" aria-label="Navigation principale">
            {renderLinks()}
          </nav>

          <div className="header__actions">
            <a href={telHref(phone)} className="header__phone" data-location="header" aria-label="Appelez-nous">
              <Icon name="phone" size={18} stroke={2} />
              <span className="header__phone-text">{phone}</span>
            </a>
            <a href={ctaLink} className="btn btn--primary">{ctaLabel}</a>
            <button
              className={menuOpen ? "header__menu-btn active" : "header__menu-btn"}
              aria-label="Ouvrir le menu"
              aria-expanded="false"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={menuOpen ? "mobile-menu active" : "mobile-menu"} role="navigation" aria-label="Menu mobile">
        {renderLinks()}
        <a
          href={settings?.mobile_menu_cta_link || ctaLink}
          className="btn btn--primary"
          style={{ marginTop: "auto" }}
          onClick={closeMenu}
        >
          {settings?.mobile_menu_cta_label || ctaLabel}
        </a>
        <a href={telHref(phone)} className="mobile-menu__phone" data-location="mobile-menu" aria-label="Appelez-nous" onClick={closeMenu}>
          <Icon name="phone" size={18} stroke={2} />
          <PhoneText phone={phone} />
        </a>
      </div>
    </>
  );
}
