# TONES — Site web café italien B2B

Site [cafetones.fr](https://cafetones.fr) : Next.js 16 (App Router) + Storyblok
(CMS headless). Tout le contenu des pages est éditable dans l'éditeur visuel
Storyblok ; le rendu reprend à l'identique l'ancien site statique.

## Démarrage

```bash
npm install
cp .env.example .env.local   # remplir les tokens Storyblok
npm run dev                  # https://localhost:3000 (HTTPS pour l'éditeur visuel)
```

Sans tokens : `STORYBLOK_LOCAL_CONTENT=1 npm run dev` rend le site depuis
`scripts/storyblok/content/` (contenu extrait du site d'origine).

## Mise en route Storyblok & guide d'édition

Voir **[STORYBLOK_SETUP.md](STORYBLOK_SETUP.md)** : actions pas-à-pas,
fonctionnement (draft mode, revalidation, tokens), guide pour l'éditrice et
référence complète des 52 blocs.

## Structure

- `app/` — layout, route unique `[[...slug]]`, API (draft, exit-draft, revalidate), sitemap
- `components/blocks/` — les blocs Storyblok (une section du site = un bloc)
- `components/layout/`, `components/behaviors/` — header/footer et comportements portés de l'ancien JS
- `css/` — feuilles de l'ancien site (celles par page sont scopées `main.page-*`)
- `lib/` — accès contenu (tokens serveur uniquement), helpers texte/téléphone, init Storyblok
- `scripts/storyblok/` — schémas des composants, bootstrap du space, contenu extrait, extraction
- `.github/workflows/storyblok-bootstrap.yml` — remplissage du space en un clic
