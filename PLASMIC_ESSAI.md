# Essai Plasmic — édition visuelle libre sur une page isolée

Plasmic est un éditeur visuel « canvas » (déplacer, redimensionner à la souris)
branché **par-dessus** le site actuel. Il ne sert que les pages sous
`/essai-plasmic/…` ; les 8 pages Storyblok ne sont pas concernées.

## Mise en route (10 minutes)

1. **Compte et projet** : https://studio.plasmic.app → créer un compte (gratuit,
   jusqu'à 3 personnes) → **New project** → « Blank » → nom `TONES essai`.
2. **Identifiants** : dans le projet, bouton **Code** (barre du haut) → noter
   le **Project ID** (aussi visible dans l'URL `studio.plasmic.app/projects/<ID>`)
   et le **Public API token**. Ce token ne lit que le contenu publié : il est
   public par conception.
3. **Vercel** : projet cafetones → Settings → Environment Variables →
   `NEXT_PUBLIC_PLASMIC_PROJECT_ID` et `NEXT_PUBLIC_PLASMIC_PROJECT_TOKEN`
   (Production + Preview) → **Redeploy**.
4. **App host** (pour voir les composants TONES dans le Studio) : projet →
   menu ⋯ → **Configure project** → **App host** :
   `https://cafetones.fr/plasmic-host` → Confirm. Le Studio recharge et propose
   les composants « Section TONES », « Carte produit TONES », « Bouton TONES »,
   « Badge TONES », « Grille de produits », « Icône TONES » dans **Insert**.
5. **Créer la page d'essai** : Studio → **+ New page** → path **`/essai-plasmic`**
   (obligatoire : tout autre chemin ne sera pas servi). Composer, puis **Publish**
   (bouton en haut à droite). La page est en ligne sous
   https://cafetones.fr/essai-plasmic en moins d'une minute.

D'autres pages d'essai : path `/essai-plasmic/<nom>`.

## Ce qu'il faut savoir

- Header et footer du site entourent automatiquement la page d'essai.
- Les pages d'essai sont exclues de l'indexation Google (`noindex`) : c'est un bac à sable.
- Le positionnement libre (« free box ») est possible mais Plasmic le déconseille
  en production : vérifier le rendu mobile dans le Studio (icônes d'écran en haut).
- Seul le contenu **publié** dans Plasmic est servi ; les brouillons restent
  dans le Studio.
- Pour arrêter l'essai : retirer les deux variables sur Vercel — `/essai-plasmic`
  redevient une 404, rien d'autre ne change.

## Où est le code

- `lib/plasmic-init.ts` — initialisation (ID/token depuis l'environnement)
- `components/plasmic/tones-components.tsx` — composants exposés au Studio
- `components/plasmic/plasmic-init-client.tsx` — enregistrement des composants
- `app/plasmic-host/page.tsx` — page hôte du Studio (sans header/footer)
- `app/essai-plasmic/[[...catchall]]/page.tsx` — rendu des pages Plasmic
