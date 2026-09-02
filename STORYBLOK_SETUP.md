# TONES × Storyblok — mise en route et référence

Le site est un projet **Next.js 16** dont tout le contenu vient de **Storyblok**
(CMS headless). Le rendu est strictement identique à l'ancien site statique.
Ce document liste les actions restantes (10 minutes), le fonctionnement, et la
référence complète des blocs.

---

## 1. Actions restantes, dans l'ordre

### Étape A — Vérifier les secrets GitHub *(déjà fait normalement)*

Sur https://github.com/calas23/cafetones → **Settings → Secrets and variables → Actions** :

| Secret | Contenu |
|---|---|
| `STORYBLOK_PAT` | Personal Access Token (app.storyblok.com → avatar → My account → Security → Personal access tokens) |
| `STORYBLOK_SPACE_ID` | le nombre visible dans l'URL du space (`app.storyblok.com/#/me/spaces/`**`294xxxxxx`**`/...`) |
| `STORYBLOK_WEBHOOK_SECRET` | *(optionnel — voir étape E)* |

### Étape B — Lancer le bootstrap (remplit votre space automatiquement)

1. Ouvrez https://github.com/calas23/cafetones → onglet **Actions**.
2. Menu de gauche : **Storyblok Bootstrap** → bouton **Run workflow** (à droite) →
   laissez « Simulation » décoché → **Run workflow** vert.
3. Attendez ~2 minutes que la coche verte apparaisse (cliquez sur le run pour suivre les logs).

Le bootstrap crée/actualise dans votre space : les **52 composants** (blocs),
les **33 images** du site (uploadées comme assets), les dossiers `pages/` et
`config/`, les **9 stories publiées** (les 8 pages + les réglages du site),
et l'URL de l'éditeur visuel. Il est réexécutable sans danger — relancez-le si
besoin (il met à jour sans dupliquer).

> ⚠️ Le bootstrap **écrase le contenu des stories** avec celui du site d'origine.
> Ne le relancez pas après que la cliente a commencé à éditer, sauf pour repartir de zéro.

### Étape C — Vérifier les variables Vercel *(déjà fait normalement)*

Projet Vercel → **Settings → Environment Variables** :
`STORYBLOK_PREVIEW_TOKEN` et `STORYBLOK_PUBLIC_TOKEN` (Production + Preview + Development).

### Étape D — Merger la branche et vérifier

1. Mergez `feat/storyblok` dans `main` (via une pull request GitHub, ou dites-le-moi).
   Vercel détecte Next.js automatiquement et déploie.
2. Vérifiez https://cafetones.fr : le site doit être identique à avant.
3. Ouvrez https://app.storyblok.com → votre space → **Content** → cliquez une page :
   l'éditeur visuel doit afficher le site à droite. Modifiez un texte → **Save** →
   la modification apparaît dans l'aperçu. **Publish** → en ligne en ≤ 60 secondes.

Si l'aperçu ne s'affiche pas : **Settings → Visual Editor** → champ **Location**
doit valoir `https://cafetones.fr/api/draft?slug=` (le bootstrap le règle, vérifiez).

### Étape E — *(Optionnel)* Mise à jour instantanée à la publication

Sans ceci, une publication est en ligne en ≤ 60 s. Pour l'instantané :

1. Générez une chaîne aléatoire (PowerShell :
   `-join ((48..57)+(97..122) | Get-Random -Count 32 | % {[char]$_})`).
2. Ajoutez-la sur **Vercel** (`STORYBLOK_WEBHOOK_SECRET`, Production + Preview) → **redéployez**.
3. Ajoutez-la aussi comme **secret GitHub** `STORYBLOK_WEBHOOK_SECRET`.
4. Relancez le workflow **Storyblok Bootstrap** *(attention à l'avertissement de l'étape B :
   à faire avant que la cliente édite, ou configurez le webhook à la main :
   Settings → Webhooks → nouvelle entrée `https://cafetones.fr/api/revalidate?secret=<la chaîne>`
   cochée sur Story published / unpublished / deleted / moved)*.

### Étape F — *(Optionnel)* Travailler en local sous Windows

```
git clone https://github.com/calas23/cafetones && cd cafetones
npm install
copy .env.example .env.local   ← puis remplir les tokens dans .env.local
npm run dev                    ← démarre en HTTPS sur https://localhost:3000
```
Pour utiliser l'éditeur visuel en local : Settings → Visual Editor → ajoutez
`https://localhost:3000/api/draft?slug=` comme environnement, et acceptez le
certificat auto-signé dans le navigateur.

---

## 2. Guide d'édition (pour la cliente)

*Connexion : app.storyblok.com, avec le compte partagé.*

- **Modifier un texte ou une image** : Content → cliquer la page → cliquer
  l'élément dans l'aperçu (il s'encadre) → modifier dans le panneau de droite →
  **Save** (aperçu) puis **Publish** (mise en ligne, visible en ≤ 1 minute).
- **Remplacer une image** : cliquer le champ image → Upload. L'ancienne image
  reste dans la bibliothèque (Assets).
- **Créer une page** : Content → ouvrir le dossier **Pages** → **+ Create new**
  → Story → nom + slug (le slug devient l'adresse `/pages/<slug>`) → type
  **Page** → composer avec **+ Add block** (les styles adaptés se chargent
  automatiquement) → remplir l'onglet **SEO** → Publish. La page entre seule
  dans le sitemap Google.
- **Ajouter la page au menu** : Content → **Configuration** → *Réglages du
  site* → ajouter un « Lien de navigation » (texte + `/pages/<slug>`) → Publish.
- **Réorganiser / dupliquer des sections** : poignée de glisser-déposer et menu
  ⋯ de chaque bloc dans le panneau de droite.
- **Astérisques dans certains titres** : `*mots*` = mots en italique décoratif
  (ex. « Un *vrai café italien* »). Un retour à la ligne dans le champ =
  retour à la ligne à l'écran.
- **Ne pas toucher** : l'onglet « Avancé » des pages et le champ JSON-LD
  (réglages techniques remplis automatiquement).

---

## 3. Fonctionnement technique (aide-mémoire)

- **Public** : token *Public* + contenu `published` uniquement — un brouillon ne
  peut techniquement pas fuiter. Pages statiques + revalidation (60 s, tag `storyblok`).
- **Éditeur visuel** : iframe → `/api/draft?slug=…` valide la signature Storyblok
  (SHA1 espace:token:timestamp) → Draft Mode Next.js → contenu `draft` + bridge
  d'édition live. Sortie : `/api/exit-draft`.
- **Tokens** : uniquement côté serveur (`STORYBLOK_*`, jamais `NEXT_PUBLIC_*`).
- **CSS** : les feuilles par page de l'ancien site sont scopées
  (`main.page-home`, `main.page-chr`, …). Les pages migrées gardent leurs scopes
  d'origine (champ « Avancé ») ; les nouvelles pages les déduisent de leurs blocs.
- **Formulaires** : comportement identique à l'ancien site — validation +
  événement GTM `form_submission`, **aucun envoi serveur** (GTM est d'ailleurs
  désactivé dans le code). Les demandes ne sont donc pas transmises par email.
- **Non éditable via Storyblok** (dans le code) : l'image de fond du héros de
  l'accueil (`css/home.css`), les libellés des champs de formulaire, les icônes
  SVG (choisies par liste), le numéro dans le bouton « Commander » de la fiche
  produit.
- Contenu de secours local : `scripts/storyblok/content/` (extraction du site
  d'origine, utilisée par le bootstrap et le mode `STORYBLOK_LOCAL_CONTENT=1`).

---

## 4. Référence des blocs

*Générée par `node scripts/storyblok/gen-doc.mjs` — ne pas éditer à la main.*

<!-- BLOCKS:START -->

## Groupe « Pages » (2)

### `page` — Page *(type de contenu, groupe Pages)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `body` | Liste de blocs (hero_home, page_hero, landing_hero, part_hero, chr_hero, stats_section, universes_section, products_home_section, espresso_text_section, certifications_section, reassurance_section, steps_section, pricing_section, b2b_section, cta_section, quote_form_section, chr_products_section, chr_extras_section, gamme_filters, pricing_note, gamme_section, part_products_section, pastries_section, part_contact_section, contact_section, faq_section, about_story_section, roasters_section, cert_cards_section, airpur_section, legal_section, sticky_cta) | Sections de la page |
| `seo_title` | Texte | Titre SEO (onglet navigateur / Google) |
| `seo_description` | Texte long | Description SEO |
| `og_title` | Texte | Titre de partage (réseaux sociaux) |
| `og_description` | Texte long | Description de partage |
| `breadcrumb_label` | Texte | Libellé du fil d'Ariane (vide = pas de fil d'Ariane) |
| `breadcrumb_path` | Texte | Chemin de la page (rempli automatiquement) |
| `jsonld` | Texte long | Données structurées JSON-LD (avancé — ne pas toucher) |
| `style_scopes` | Choix multiples — valeurs : home · about · chr · contact · gamme · landing · particuliers | Styles de page chargés |

### `site_settings` — Réglages du site (header, footer, contact) *(type de contenu, groupe Pages)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `logo` | Image | Logo |
| `phone` | Texte | Numéro de téléphone principal |
| `cta_label` | Texte | Bouton d'en-tête — texte |
| `cta_link` | Texte | Bouton d'en-tête — lien |
| `nav_links` | Liste de blocs (nav_link) | Liens du menu |
| `mobile_menu_cta_label` | Texte | Menu mobile — bouton texte |
| `mobile_menu_cta_link` | Texte | Menu mobile — bouton lien |
| `footer_desc` | Texte long | Texte de présentation |
| `footer_nav_heading` | Texte | Titre colonne navigation |
| `footer_nav_links` | Liste de blocs (nav_link) | Liens colonne navigation |
| `footer_cafes_heading` | Texte | Titre colonne cafés |
| `footer_cafes_links` | Liste de blocs (nav_link) | Liens colonne cafés |
| `footer_contact_heading` | Texte | Titre colonne contact |
| `address` | Texte | Adresse |
| `email` | Texte | Email |
| `hours` | Texte | Horaires |
| `copyright` | Texte | Ligne de copyright |
| `legal_label` | Texte | Lien mentions légales — texte |
| `legal_link` | Texte | Lien mentions légales — URL |
| `privacy_label` | Texte | Lien confidentialité — texte |
| `privacy_link` | Texte | Lien confidentialité — URL |

## Groupe « Sections » (32)

### `hero_home` — Héros — Accueil *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `badge_logo` | Image | Petit logo au-dessus du titre |
| `badge_text` | Texte | Badge |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `buttons` | Liste de blocs (button) | Boutons |

### `page_hero` — Héros — Bandeau simple *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `badge` | Texte | Badge |
| `title` | Texte | Titre |
| `text` | Texte long | Texte |

### `landing_hero` — Héros — Bureau & Entreprise *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `badge_text` | Texte | Badge (avec étoile) |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `buttons` | Liste de blocs (button) | Boutons |
| `trust_items` | Liste de blocs (trust_item) | Éléments de confiance |
| `image` | Image | Image |
| `image_width` | Texte | Largeur HTML de l'image (px) |
| `image_height` | Texte | Hauteur HTML de l'image (px) |

### `part_hero` — Héros — Particuliers *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `badge` | Texte | Badge |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `buttons` | Liste de blocs (button) | Boutons |
| `image` | Image | Image |
| `image_width` | Texte | Largeur HTML de l'image (px) |
| `image_height` | Texte | Hauteur HTML de l'image (px) |

### `chr_hero` — Héros — CHR *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `badge` | Texte | Badge |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre (les numéros de téléphone deviennent des liens) |
| `buttons` | Liste de blocs (button) | Boutons |

### `stats_section` — Bandeau chiffres clés *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `items` | Liste de blocs (stat_item) | Chiffres |
| `illustration` | Choix — valeurs : moka · grains · tasse · plant · croissant | Illustration décorative |
| `illustration_position` | Choix — valeurs : right · left · corner-br | Position de l'illustration |
| `illustration_size` | Choix — valeurs : sm · md · lg | Taille de l'illustration |

### `universes_section` — Section univers (accueil) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `cards` | Liste de blocs (universe_card) | Cartes |

### `products_home_section` — Section produits — Accueil *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `badge` | Texte | Badge |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `illustration` | Choix — valeurs : moka · grains · tasse · plant · croissant | Illustration décorative |
| `illustration_position` | Choix — valeurs : right · left · corner-br | Position de l'illustration |
| `illustration_size` | Choix — valeurs : sm · md · lg | Taille de l'illustration |
| `products` | Liste de blocs (product_card) | Produits |
| `cta_label` | Texte | Bouton bas — texte |
| `cta_link` | Texte | Bouton bas — lien |

### `espresso_text_section` — Section texte fond espresso *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `badge` | Texte | Badge |
| `title` | Texte | Titre |
| `text` | Texte long | Paragraphes (séparés par une ligne vide) |
| `buttons` | Liste de blocs (button) | Boutons |

### `certifications_section` — Bandeau certifications (accueil) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `title` | Texte | Titre |
| `items` | Liste de blocs (certification_badge) | Certifications |

### `reassurance_section` — Bandeau réassurance *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `items` | Liste de blocs (reassurance_item) | Éléments |

### `steps_section` — Section étapes (Comment ça marche) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `anchor_id` | Texte | Ancre (id de section, ex. comment-ca-marche) |
| `badge` | Texte | Badge |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `illustration` | Choix — valeurs : moka · grains · tasse · plant · croissant | Illustration décorative |
| `illustration_position` | Choix — valeurs : right · left · corner-br | Position de l'illustration |
| `illustration_size` | Choix — valeurs : sm · md · lg | Taille de l'illustration |
| `steps` | Liste de blocs (step_item) | Étapes |

### `pricing_section` — Section tarifs (tableau, page Bureau) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `anchor_id` | Texte | Ancre |
| `badge` | Texte | Badge |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `illustration` | Choix — valeurs : moka · grains · tasse · plant · croissant | Illustration décorative |
| `illustration_position` | Choix — valeurs : right · left · corner-br | Position de l'illustration |
| `illustration_size` | Choix — valeurs : sm · md · lg | Taille de l'illustration |
| `products` | Liste de blocs (product_card) | Produits |
| `note` | Texte | Note sous le tableau |
| `cta_label` | Texte | Bouton — texte |
| `cta_link` | Texte | Bouton — lien |

### `b2b_section` — Section arguments (Pourquoi nous) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `background` | Choix — valeurs : default · cream | Fond |
| `badge` | Texte | Badge (optionnel) |
| `title` | Texte | Titre |
| `grid_margin_top` | Case à cocher | Espace réduit sous le titre (variante particuliers) |
| `cards` | Liste de blocs (b2b_card) | Cartes |

### `cta_section` — Bandeau d'appel à l'action *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `theme` | Choix — valeurs : cream · espresso | Thème |
| `title` | Texte | Titre |
| `text` | Texte long | Texte |
| `buttons` | Liste de blocs (button) | Boutons |

### `quote_form_section` — Section formulaire (devis / dégustation) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `variant` | Choix — valeurs : contact_rapide · degustation_bureau · degustation_chr | Champs du formulaire |
| `style_variant` | Choix — valeurs : cream_home · plain · cream_chr | Fond de section |
| `anchor_id` | Texte | Ancre |
| `form_name` | Texte | Nom technique du formulaire (tracking) |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `phone_label` | Texte | Libellé au-dessus du téléphone |
| `phone` | Texte | Numéro de téléphone |
| `phone_location` | Texte | Repère de tracking du téléphone |
| `phone_hours` | Texte | Horaires sous le téléphone |
| `separator` | Texte | Texte séparateur |
| `submit_label` | Texte | Bouton d'envoi |
| `note` | Texte long | Note de consentement |
| `success_title` | Texte | Message de succès — titre |
| `success_text` | Texte long | Message de succès — texte |

### `chr_products_section` — Section produits — CHR *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `badge` | Texte | Badge |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `illustration` | Choix — valeurs : moka · grains · tasse · plant · croissant | Illustration décorative |
| `illustration_position` | Choix — valeurs : right · left · corner-br | Position de l'illustration |
| `illustration_size` | Choix — valeurs : sm · md · lg | Taille de l'illustration |
| `products` | Liste de blocs (product_card) | Produits |
| `cta_label` | Texte | Bouton bas — texte |
| `cta_link` | Texte | Bouton bas — lien |

### `chr_extras_section` — Section compléments (CHR) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `cards` | Liste de blocs (extra_card) | Cartes |

### `gamme_filters` — Filtres de la gamme *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `items` | Liste de blocs (filter_item) | Filtres |

### `pricing_note` — Note de prix (bandeau) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `text` | Texte | Texte |

### `gamme_section` — Section de gamme (catalogue) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `anchor_id` | Texte | Ancre (ex. grains) |
| `section_cat` | Texte | Catégorie de filtre de la section |
| `title` | Texte | Titre |
| `intro` | Texte long | Introduction |
| `products` | Liste de blocs (product_card) | Produits |

### `part_products_section` — Section produits — Particuliers *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `badge` | Texte | Badge |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `groups` | Liste de blocs (product_group) | Groupes de produits |

### `pastries_section` — Section pâtisseries (particuliers) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `illustration` | Choix — valeurs : moka · grains · tasse · plant · croissant | Illustration décorative |
| `illustration_position` | Choix — valeurs : right · left · corner-br | Position de l'illustration |
| `illustration_size` | Choix — valeurs : sm · md · lg | Taille de l'illustration |
| `cards` | Liste de blocs (product_card) | Pâtisseries |

### `part_contact_section` — Section contact — Particuliers *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `anchor_id` | Texte | Ancre |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `phone_title` | Texte | Titre du bloc téléphone |
| `phone` | Texte | Numéro de téléphone |
| `phone_location` | Texte | Repère de tracking |
| `hours_text` | Texte | Ligne horaires |
| `advice_text` | Texte long | Ligne conseil |
| `email` | Texte | Email |
| `submit_label` | Texte | Bouton d'envoi |
| `note` | Texte long | Note de consentement |
| `success_title` | Texte | Succès — titre |
| `success_text` | Texte long | Succès — texte |

### `contact_section` — Section contact (formulaire + infos) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `form_title` | Texte | Formulaire — titre |
| `form_intro` | Texte long | Formulaire — introduction |
| `submit_label` | Texte | Bouton d'envoi |
| `note` | Texte long | Note de consentement |
| `success_title` | Texte | Succès — titre |
| `success_text` | Texte long | Succès — texte |
| `info_title` | Texte | Titre coordonnées |
| `address` | Texte | Adresse |
| `phone` | Texte | Téléphone |
| `phone_location` | Texte | Repère de tracking |
| `email` | Texte | Email |
| `hours` | Texte | Horaires |
| `zone_title` | Texte | Titre zone de livraison |
| `zone_text` | Texte long | Texte zone de livraison |
| `degust_title` | Texte | Titre dégustation |
| `degust_text` | Texte long | Texte dégustation |
| `degust_button_label` | Texte | Bouton dégustation — texte |
| `degust_button_link` | Texte | Bouton dégustation — lien |
| `map_heading` | Texte | Titre carte |
| `map_url` | Texte long | URL d'intégration Google Maps |
| `map_title` | Texte | Titre accessible de la carte |

### `faq_section` — Section FAQ *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `title` | Texte | Titre |
| `illustration` | Choix — valeurs : moka · grains · tasse · plant · croissant | Illustration décorative |
| `illustration_position` | Choix — valeurs : right · left · corner-br | Position de l'illustration |
| `illustration_size` | Choix — valeurs : sm · md · lg | Taille de l'illustration |
| `items` | Liste de blocs (faq_item) | Questions |

### `about_story_section` — Section histoire (à propos) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `title` | Texte | Titre |
| `text` | Texte long | Paragraphes (séparés par une ligne vide) |
| `image` | Image | Image |
| `image_width` | Texte | Largeur HTML de l'image (px) |
| `image_height` | Texte | Hauteur HTML de l'image (px) |
| `quote` | Texte | Citation |
| `quote_author` | Texte | Auteur de la citation |

### `roasters_section` — Section torréfacteurs *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `illustration` | Choix — valeurs : moka · grains · tasse · plant · croissant | Illustration décorative |
| `illustration_position` | Choix — valeurs : right · left · corner-br | Position de l'illustration |
| `illustration_size` | Choix — valeurs : sm · md · lg | Taille de l'illustration |
| `roasters` | Liste de blocs (roaster_card) | Torréfacteurs |

### `cert_cards_section` — Section certifications / récompenses *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `background` | Choix — valeurs : default · cream | Fond |
| `title` | Texte | Titre |
| `subtitle` | Texte long | Sous-titre |
| `cards` | Liste de blocs (cert_card) | Cartes |

### `airpur_section` — Section torréfaction Air Pur *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `title` | Texte | Titre |
| `text` | Texte long | Paragraphes (séparés par une ligne vide) |
| `traits` | Liste de blocs (trait_item) | Caractéristiques |

### `legal_section` — Contenu mentions légales *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `title` | Texte | Titre de la page |
| `content_mentions` | Texte riche | Mentions légales |
| `rgpd_title` | Texte | Titre politique de confidentialité |
| `content_rgpd` | Texte riche | Politique de confidentialité |
| `back_label` | Texte | Lien retour — texte |
| `back_link` | Texte | Lien retour — URL |
| `phone` | Texte | Numéro affiché en image anti-spam |

### `sticky_cta` — Barre d'action mobile (bas d'écran) *(bloc imbriquable, groupe Sections)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `call_label` | Texte | Bouton appel — texte |
| `call_link` | Texte | Bouton appel — lien tel: |
| `contact_label` | Texte | Bouton contact — texte |
| `contact_link` | Texte | Bouton contact — lien |

## Groupe « Éléments » (18)

### `nav_link` — Lien de navigation *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `label` | Texte | Texte |
| `link` | Texte | Lien (ex. /pages/contact) |
| `hidden` | Case à cocher | Masqué (lien présent mais invisible) |

### `button` — Bouton *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `label` | Texte | Texte |
| `link` | Texte | Lien (URL, ancre #… ou tel:…) |
| `style` | Choix — valeurs : primary · secondary · white · white-outline | Style |
| `size` | Choix — valeurs : lg · sm | Taille |
| `icon` | Choix — valeurs : none · phone · map-pin · mail · clock · arrow-right · check · chevron-down · star · bell · coffee · medal · shield · pin-check · users · file-invoice · file-text · wrench · check-circle · globe | Icône |
| `location` | Texte | Repère de tracking (data-location) |
| `phone_svg` | Case à cocher | Numéro de téléphone du texte rendu en image (anti-spam) |
| `extra_style` | Texte | Styles CSS additionnels (avancé) |

### `stat_item` — Chiffre clé *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `number` | Texte | Chiffre |
| `label` | Texte | Légende |
| `delay` | Texte | Délai d'animation (1-4, vide = aucun) |

### `universe_card` — Carte univers (accueil) *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `image` | Image | Image |
| `image_width` | Texte | Largeur HTML de l'image (px) |
| `image_height` | Texte | Hauteur HTML de l'image (px) |
| `badge` | Texte | Badge (optionnel) |
| `title` | Texte | Titre |
| `text` | Texte long | Texte |
| `button_label` | Texte | Bouton — texte |
| `button_link` | Texte | Bouton — lien |
| `button_style` | Choix — valeurs : primary · secondary | Bouton — style |
| `hidden` | Case à cocher | Carte masquée |
| `delay` | Texte | Délai d'animation (1-4, vide = aucun) |

### `product_card` — Produit *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `display_name` | Texte | Nom affiché |
| `display_subtitle` | Texte | Sous-titre affiché |
| `display_desc` | Texte long | Description courte affichée |
| `display_format` | Texte | Format affiché |
| `display_price` | Texte | Prix affiché |
| `price_small` | Texte | Complément de prix en petit (ex. (0,45 €/pod)) |
| `price_detail` | Texte | Détail de prix (ligne dessous) |
| `badge_label` | Texte | Badge — texte |
| `badge_style` | Choix — valeurs : gold · simple | Badge — style |
| `medals_label` | Texte | Ligne médailles (ex. 7 médailles ICT) |
| `seasonal_note` | Texte | Note saisonnière (pâtisseries) |
| `image` | Image | Photo |
| `image_width` | Texte | Largeur HTML de l'image (px) |
| `image_height` | Texte | Hauteur HTML de l'image (px) |
| `categories` | Texte | Catégories de filtre (séparées par des espaces) |
| `patisserie_style` | Case à cocher | Style carte pâtisserie (page gamme) |
| `delay` | Texte | Délai d'animation (1-4, vide = aucun) |
| `name` | Texte | Nom (la fiche ne s'ouvre que s'il est rempli) |
| `subtitle` | Texte | Sous-titre |
| `description` | Texte long | Description complète |
| `acidity` | Texte | Acidité (1 à 5) |
| `body` | Texte | Corps (1 à 5) |
| `intensity` | Texte | Intensité (1 à 5) |
| `roast` | Texte | Torréfaction |
| `notes` | Texte | Notes aromatiques (séparées par des virgules) |
| `origins` | Texte | Origines |
| `certifications` | Texte | Certifications (séparées par des virgules) |
| `medals` | Texte | Années de médailles |
| `caffeine` | Texte | Caféine |
| `ingredients` | Texte long | Ingrédients |
| `ingredients_glaze` | Texte long | Glaçage |
| `weight` | Texte | Poids |
| `packaging` | Texte | Emballage |
| `order_period` | Texte | Période de commande |
| `format` | Texte | Format |
| `price` | Texte | Prix |
| `machine_info` | Texte long | Info machine (encart) |
| `table_desc` | Texte | Tableau — description |
| `table_format` | Texte | Tableau — format |
| `table_price` | Texte | Tableau — prix |
| `table_unit` | Texte | Tableau — prix unitaire |
| `table_badge_label` | Texte | Tableau — badge |
| `table_badge_style` | Choix — valeurs : gold · simple | Tableau — style badge |
| `card_desc` | Texte | Carte mobile — description |
| `card_amount` | Texte | Carte mobile — montant |
| `card_unit` | Texte | Carte mobile — unité |
| `card_badge_label` | Texte | Carte mobile — badge |
| `card_badge_style` | Choix — valeurs : gold · simple | Carte mobile — style badge |

### `product_group` — Groupe de produits (particuliers) *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `title` | Texte | Titre du groupe |
| `products` | Liste de blocs (product_card) | Produits |
| `note` | Texte long | Note sous le groupe (optionnel) |

### `reassurance_item` — Élément de réassurance *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `icon` | Choix — valeurs : phone · map-pin · mail · clock · arrow-right · check · chevron-down · star · bell · coffee · medal · shield · pin-check · users · file-invoice · file-text · wrench · check-circle · globe | Icône |
| `title` | Texte | Titre |
| `text` | Texte long | Texte |
| `delay` | Texte | Délai d'animation (1-4, vide = aucun) |

### `step_item` — Étape *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `title` | Texte | Titre |
| `text` | Texte long | Texte |
| `delay` | Texte | Délai d'animation (1-4, vide = aucun) |

### `b2b_card` — Carte argument *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `icon` | Choix — valeurs : phone · map-pin · mail · clock · arrow-right · check · chevron-down · star · bell · coffee · medal · shield · pin-check · users · file-invoice · file-text · wrench · check-circle · globe | Icône |
| `title` | Texte | Titre |
| `text` | Texte long | Texte |
| `delay` | Texte | Délai d'animation (1-4, vide = aucun) |

### `trust_item` — Élément de confiance (héros) *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `text` | Texte | Texte |

### `certification_badge` — Badge certification *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `name` | Texte | Nom |
| `caption` | Texte | Légende |

### `cert_card` — Carte certification *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `icon` | Choix — valeurs : phone · map-pin · mail · clock · arrow-right · check · chevron-down · star · bell · coffee · medal · shield · pin-check · users · file-invoice · file-text · wrench · check-circle · globe | Icône |
| `title` | Texte | Titre |
| `text` | Texte long | Texte |
| `delay` | Texte | Délai d'animation (1-4, vide = aucun) |

### `roaster_card` — Carte torréfacteur *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `name` | Texte | Nom |
| `since` | Texte | Depuis (ex. Depuis 1936) |
| `text` | Texte long | Paragraphes (séparés par une ligne vide) |
| `blends_title` | Texte | Titre de la liste des mélanges |
| `blends` | Liste de blocs (blend_item) | Mélanges |
| `delay` | Texte | Délai d'animation (1-4, vide = aucun) |

### `blend_item` — Mélange *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `name` | Texte | Nom (en gras) |
| `text` | Texte | Description (après le tiret) |

### `trait_item` — Caractéristique (Air Pur) *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `label` | Texte | Libellé |
| `desc` | Texte | Description |

### `extra_card` — Carte complément (CHR) *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `image` | Image | Image (optionnelle) |
| `title` | Texte | Titre |
| `text` | Texte long | Paragraphes (séparés par une ligne vide) |
| `note` | Texte long | Note (en italique) |
| `button_label` | Texte | Bouton — texte |
| `button_link` | Texte | Bouton — lien |
| `delay` | Texte | Délai d'animation (1-4, vide = aucun) |

### `faq_item` — Question / réponse *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `question` | Texte | Question |
| `answer` | Texte long | Réponse |
| `delay` | Texte | Délai d'animation (1-4, vide = aucun) |

### `filter_item` — Filtre de gamme *(bloc imbriquable, groupe Éléments)*

| Champ (nom technique) | Type | Libellé |
|---|---|---|
| `label` | Texte | Texte du bouton |
| `filter_key` | Texte | Clé de filtre (all, grain, moulu, pods, grands-crus, bio, patisseries) |

<!-- BLOCKS:END -->
