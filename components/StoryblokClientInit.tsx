"use client";

// Charge la map des composants dans le bundle client : nécessaire pour le
// re-rendu en direct dans l'éditeur visuel Storyblok (bridge).
import "@/lib/storyblok";

export function StoryblokClientInit() {
  return null;
}
