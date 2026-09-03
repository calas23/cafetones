"use client";

import { useEffect, useRef } from "react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { Icon } from "@/components/Icon";
import type { SbBlok } from "@/lib/types";

// Sticky CTA mobile — apparaît après le hero (port de initStickyCTA de main.js).

type StickyCtaBlok = SbBlok & {
  call_label?: string;
  call_link?: string;
  contact_label?: string;
  contact_link?: string;
};

export function StickyCta({ blok }: { blok: StickyCtaBlok }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stickyCta = ref.current;
    const heroSection =
      document.querySelector(".hero") || document.querySelector(".home-hero") || document.querySelector(".chr-hero");
    if (!stickyCta || !heroSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            stickyCta.classList.add("visible");
          } else {
            stickyCta.classList.remove("visible");
          }
        });
      },
      { threshold: 0 }
    );
    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky-cta" ref={ref} {...storyblokEditable(blok)}>
      <div className="sticky-cta__inner">
        <a href={blok.call_link || "#"} className="btn btn--primary" data-location="sticky">
          <Icon name="phone" size={16} stroke={2} /> {blok.call_label}
        </a>
        <a href={blok.contact_link || "#"} className="btn btn--secondary">{blok.contact_label}</a>
      </div>
    </div>
  );
}
