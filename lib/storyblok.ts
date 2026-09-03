import { storyblokInit } from "@storyblok/react/rsc";

import Page from "@/components/blocks/Page";
import { ChrHero, HeroHome, LandingHero, PageHero, PartHero } from "@/components/blocks/heroes";
import {
  B2bSection,
  CertificationsSection,
  CtaSection,
  EspressoTextSection,
  ReassuranceSection,
  StatsSection,
  StepsSection,
  UniversesSection,
} from "@/components/blocks/common-sections";
import {
  ChrExtrasSection,
  ChrProductsSection,
  GammeSection,
  PartProductsSection,
  PastriesSection,
  PricingNote,
  PricingSection,
  ProductsHomeSection,
} from "@/components/blocks/products";
import { GammeFilters } from "@/components/blocks/GammeFilters";
import { StickyCta } from "@/components/blocks/StickyCta";
import { AboutStorySection, AirpurSection, CertCardsSection, RoastersSection } from "@/components/blocks/about";
import { PartContactSection, QuoteFormSection } from "@/components/blocks/forms";
import { ContactSection, FaqSection } from "@/components/blocks/contact";
import { LegalSection } from "@/components/blocks/legal";

// Map nom technique Storyblok → composant React.
// Les blocs "items" (button, product_card, …) sont rendus par leurs parents.
export const components = {
  page: Page,
  hero_home: HeroHome,
  page_hero: PageHero,
  landing_hero: LandingHero,
  part_hero: PartHero,
  chr_hero: ChrHero,
  stats_section: StatsSection,
  universes_section: UniversesSection,
  espresso_text_section: EspressoTextSection,
  certifications_section: CertificationsSection,
  reassurance_section: ReassuranceSection,
  steps_section: StepsSection,
  b2b_section: B2bSection,
  cta_section: CtaSection,
  sticky_cta: StickyCta,
  products_home_section: ProductsHomeSection,
  chr_products_section: ChrProductsSection,
  gamme_filters: GammeFilters,
  pricing_note: PricingNote,
  gamme_section: GammeSection,
  pricing_section: PricingSection,
  part_products_section: PartProductsSection,
  pastries_section: PastriesSection,
  chr_extras_section: ChrExtrasSection,
  contact_section: ContactSection,
  faq_section: FaqSection,
  quote_form_section: QuoteFormSection,
  part_contact_section: PartContactSection,
  legal_section: LegalSection,
  about_story_section: AboutStorySection,
  roasters_section: RoastersSection,
  cert_cards_section: CertCardsSection,
  airpur_section: AirpurSection,
};

// Pas d'apiPlugin : les données passent par lib/content.ts (tokens côté
// serveur uniquement). L'init ne sert qu'au rendu des blocs + bridge éditeur.
storyblokInit({
  accessToken: "bridge-only",
  components,
  enableFallbackComponent: true,
});
