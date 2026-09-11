// Types pragmatiques pour le contenu Storyblok.

export interface SbAsset {
  filename?: string;
  alt?: string;
  [key: string]: unknown;
}

export interface SbBlok {
  _uid: string;
  component: string;
  _editable?: string;
  [key: string]: unknown;
}

export interface SbStory {
  id?: number;
  uuid?: string;
  name: string;
  slug: string;
  full_slug: string;
  content: SbBlok & { body?: SbBlok[] };
  published_at?: string | null;
  first_published_at?: string | null;
}

export interface SiteSettings extends SbBlok {
  logo?: SbAsset;
  logo_height?: string | number; // hauteur du logo du menu en px (vide = 64 desktop / 48 mobile)
  palette?: string; // onglet Couleurs : palette prête (rouge-creme | cafe | sicilia | orange | marine)
  color_dark?: string; // codes hex optionnels remplaçant une couleur de base de la palette
  color_accent?: string;
  color_bg?: string;
  color_bg_alt?: string;
  color_text?: string;
  font_display?: string; // onglet Polices : clé de lib/fonts.ts (vide = playfair)
  font_body?: string; // vide = dm-sans
  text_scale?: string | number; // % (100 = origine), tout le site
  heading_scale?: string | number; // % (100 = origine), titres seuls
  footer_logo_height?: string | number; // px, vide = 36
  footer_zoom?: string | number; // % (100 = origine), tout le pied de page
  footer_text_size?: string | number; // % (100 = origine), textes du pied de page seuls
  footer_layout?: string; // wide (défaut) | site
  footer_bg?: string; // codes hex, vides = palette du site
  footer_text_color?: string;
  footer_heading_color?: string;
  phone?: string;
  cta_label?: string;
  cta_link?: string;
  nav_links?: SbBlok[];
  footer_desc?: string;
  footer_nav_heading?: string;
  footer_nav_links?: SbBlok[];
  footer_cafes_heading?: string;
  footer_cafes_links?: SbBlok[];
  footer_contact_heading?: string;
  address?: string;
  email?: string;
  hours?: string;
  copyright?: string;
  legal_label?: string;
  legal_link?: string;
  privacy_label?: string;
  privacy_link?: string;
  mobile_menu_cta_label?: string;
  mobile_menu_cta_link?: string;
}

export function assetUrl(asset?: SbAsset | string): string {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  return asset.filename || "";
}
