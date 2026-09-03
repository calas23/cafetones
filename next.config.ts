import type { NextConfig } from "next";

// En-têtes de sécurité repris de l'ancien vercel.json.
// X-Frame-Options: DENY est remplacé par une CSP frame-ancestors qui
// n'autorise que les éditeurs visuels (Storyblok, Plasmic) à afficher le site en iframe.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://app.storyblok.com https://studio.plasmic.app" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/img/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // Raccourcis historiques (ancien vercel.json)
      { source: "/bureau", destination: "/pages/cafe-bureau-entreprise", permanent: true },
      { source: "/entreprise", destination: "/pages/cafe-bureau-entreprise", permanent: true },
      { source: "/gamme", destination: "/pages/notre-gamme", permanent: true },
      { source: "/contact", destination: "/pages/contact", permanent: true },
      // Anciennes URLs .html (équivalent du cleanUrls de Vercel)
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/pages/:slug.html", destination: "/pages/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
