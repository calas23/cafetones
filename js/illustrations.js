/* ========================================================================
   TONES — Illustrations decoratives hand-drawn SVG
   Croquis au trait, style carnet italien
   ======================================================================== */

var ILLUSTRATIONS = {

  /* Cafetiere moka italienne vue de cote */
  moka: '<svg viewBox="0 0 120 150" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
    /* Base octogonale */
    '<path d="M30 148 C30 148 28 100 32 92 C34 88 38 86 42 85 L78 85 C82 86 86 88 88 92 C92 100 90 148 90 148" stroke-width="1.3"/>' +
    /* Taille (partie etroite) */
    '<path d="M42 85 C44 78 46 74 48 72 L72 72 C74 74 76 78 78 85" stroke-width="1.2"/>' +
    /* Partie haute */
    '<path d="M48 72 C46 60 44 42 46 32 C47 26 50 22 56 20 L64 20 C70 22 73 26 74 32 C76 42 74 60 72 72" stroke-width="1.3"/>' +
    /* Couvercle */
    '<path d="M46 20 C46 16 50 12 60 11 C70 12 74 16 74 20" stroke-width="1.1"/>' +
    /* Bouton du couvercle */
    '<path d="M56 11 C56 7 58 5 60 4 C62 5 64 7 64 11" stroke-width="1"/>' +
    /* Poignee */
    '<path d="M88 94 C96 92 102 88 104 80 C106 72 104 62 98 58 C94 56 90 58 88 62" stroke-width="1.3"/>' +
    /* Bec verseur */
    '<path d="M42 40 C38 38 32 36 28 38 C24 40 22 44 24 48" stroke-width="1.1"/>' +
    /* Ligne de separation base/haut */
    '<path d="M34 86 L86 86" stroke-width="1"/>' +
    /* Textures base */
    '<path d="M40 110 L40 130" stroke-width="0.6" opacity="0.5"/>' +
    '<path d="M60 100 L60 138" stroke-width="0.6" opacity="0.5"/>' +
    '<path d="M80 110 L80 130" stroke-width="0.6" opacity="0.5"/>' +
    '</svg>',

  /* Tasse espresso avec soucoupe et vapeur */
  tasse: '<svg viewBox="0 0 110 105" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
    /* Soucoupe */
    '<path d="M8 82 C8 88 28 94 55 94 C82 94 102 88 102 82 C102 78 82 74 55 74 C28 74 8 78 8 82Z" stroke-width="1.2"/>' +
    /* Corps de la tasse */
    '<path d="M24 78 C22 62 22 48 24 40 C25 36 28 34 32 33 L78 33 C82 34 85 36 86 40 C88 48 88 62 86 78" stroke-width="1.3"/>' +
    /* Bord superieur */
    '<path d="M24 34 C24 30 34 28 55 28 C76 28 86 30 86 34" stroke-width="1.1"/>' +
    /* Anse */
    '<path d="M86 42 C94 42 100 48 100 56 C100 64 94 70 86 70" stroke-width="1.3"/>' +
    /* Vapeur 1 */
    '<path d="M38 24 C36 18 40 12 38 6" stroke-width="0.9" opacity="0.7"/>' +
    /* Vapeur 2 */
    '<path d="M52 22 C54 16 50 10 52 3" stroke-width="0.9" opacity="0.7"/>' +
    /* Vapeur 3 */
    '<path d="M66 24 C64 18 68 12 66 5" stroke-width="0.9" opacity="0.6"/>' +
    /* Surface du cafe */
    '<path d="M30 38 C30 36 42 35 55 35 C68 35 80 36 80 38" stroke-width="0.7" opacity="0.4"/>' +
    '</svg>',

  /* Grains de cafe eparpilles */
  grains: '<svg viewBox="0 0 130 90" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
    /* Grain 1 */
    '<path d="M22 30 C16 24 16 14 22 10 C28 6 36 8 38 16 C40 24 34 32 28 34 C24 35 22 33 22 30Z" stroke-width="1.1"/>' +
    '<path d="M26 12 C28 18 28 26 26 32" stroke-width="0.8"/>' +
    /* Grain 2 (rotated) */
    '<path d="M58 22 C54 16 56 8 62 6 C68 4 74 10 74 18 C74 26 68 30 62 28 C58 27 56 25 58 22Z" stroke-width="1.1"/>' +
    '<path d="M64 8 C62 14 62 22 64 27" stroke-width="0.8"/>' +
    /* Grain 3 */
    '<path d="M96 36 C90 30 88 22 92 16 C96 12 104 14 108 20 C112 28 108 38 102 40 C98 41 96 39 96 36Z" stroke-width="1.1"/>' +
    '<path d="M96 18 C98 24 98 32 96 38" stroke-width="0.8"/>' +
    /* Grain 4 (petit) */
    '<path d="M42 58 C38 54 38 48 42 46 C46 44 50 48 50 52 C50 58 46 62 44 60 C42 59 42 58 42 58Z" stroke-width="1"/>' +
    '<path d="M44 47 C44 52 44 56 44 59" stroke-width="0.7"/>' +
    /* Grain 5 */
    '<path d="M78 66 C74 60 76 52 82 50 C88 48 92 54 90 62 C88 68 82 72 78 68Z" stroke-width="1.1"/>' +
    '<path d="M84 52 C82 58 82 64 84 68" stroke-width="0.8"/>' +
    /* Grain 6 (petit, en haut) */
    '<path d="M112 58 C110 54 112 50 116 50 C120 50 122 54 120 58 C118 62 114 62 112 58Z" stroke-width="0.9"/>' +
    '<path d="M116 51 C115 54 115 58 116 60" stroke-width="0.6"/>' +
    '</svg>',

  /* Croissant / cornetto */
  croissant: '<svg viewBox="0 0 110 75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
    /* Forme principale */
    '<path d="M8 52 C12 44 22 32 36 26 C44 22 52 22 58 24 C64 22 72 22 80 26 C94 32 104 44 108 52 C106 58 98 62 88 60 C80 58 72 52 64 48 C58 46 54 46 48 48 C40 52 32 58 24 60 C14 62 8 58 8 52Z" stroke-width="1.3"/>' +
    /* Plis du croissant */
    '<path d="M36 28 C42 36 48 44 50 48" stroke-width="0.8" opacity="0.6"/>' +
    '<path d="M58 24 C58 32 58 40 58 46" stroke-width="0.9" opacity="0.6"/>' +
    '<path d="M80 28 C74 36 68 44 66 48" stroke-width="0.8" opacity="0.6"/>' +
    /* Texture doree */
    '<path d="M28 42 C34 38 42 36 48 36" stroke-width="0.6" opacity="0.4"/>' +
    '<path d="M68 36 C74 38 82 40 88 44" stroke-width="0.6" opacity="0.4"/>' +
    /* Miettes */
    '<path d="M42 64 L44 66" stroke-width="0.8" opacity="0.4"/>' +
    '<path d="M72 62 L73 65" stroke-width="0.8" opacity="0.4"/>' +
    '<path d="M56 66 L58 68" stroke-width="0.8" opacity="0.4"/>' +
    '</svg>',

  /* Plant de cafe avec feuilles et cerises */
  plant: '<svg viewBox="0 0 100 170" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
    /* Tige principale */
    '<path d="M50 168 C48 148 46 120 48 96 C50 72 52 48 50 28 C49 18 48 10 50 4" stroke-width="1.2"/>' +
    /* Feuille 1 droite haute */
    '<path d="M50 28 C56 26 68 22 76 28 C82 32 80 40 72 42 C64 44 54 38 50 34" stroke-width="1.1"/>' +
    '<path d="M52 30 C60 30 68 32 74 36" stroke-width="0.6" opacity="0.5"/>' +
    /* Feuille 2 gauche */
    '<path d="M50 48 C44 44 32 38 24 42 C18 46 20 54 28 58 C36 62 48 56 50 52" stroke-width="1.1"/>' +
    '<path d="M48 50 C40 48 32 48 26 50" stroke-width="0.6" opacity="0.5"/>' +
    /* Feuille 3 droite basse */
    '<path d="M48 72 C56 68 70 64 78 70 C84 76 80 84 72 86 C64 88 50 80 48 76" stroke-width="1.1"/>' +
    '<path d="M50 74 C58 72 66 74 76 78" stroke-width="0.6" opacity="0.5"/>' +
    /* Feuille 4 gauche basse */
    '<path d="M48 96 C42 92 30 88 22 94 C16 100 20 108 28 110 C36 112 46 104 48 100" stroke-width="1.1"/>' +
    '<path d="M46 98 C38 96 30 98 24 102" stroke-width="0.6" opacity="0.5"/>' +
    /* Cerises de cafe (droite) */
    '<path d="M72 42 C76 44 80 48 78 52 C76 56 72 56 70 52 C68 48 70 44 72 42" stroke-width="1"/>' +
    '<path d="M78 52 C82 54 84 58 82 62 C80 66 76 66 74 62 C72 58 74 54 78 52" stroke-width="1"/>' +
    /* Cerises gauche */
    '<path d="M28 58 C24 60 20 64 22 68 C24 72 28 72 30 68 C32 64 30 60 28 58" stroke-width="1"/>' +
    /* Petite tige pour cerises */
    '<path d="M72 42 L74 40" stroke-width="0.8"/>' +
    '<path d="M28 58 L26 56" stroke-width="0.8"/>' +
    '</svg>',

  /* Sucrier avec cuillere */
  sucrier: '<svg viewBox="0 0 110 85" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
    /* Corps du sucrier */
    '<path d="M18 76 C16 60 18 46 22 40 C26 36 32 34 40 33 L68 33 C76 34 82 36 86 40 C90 46 92 60 90 76" stroke-width="1.2"/>' +
    /* Base */
    '<path d="M18 76 C18 80 30 84 54 84 C78 84 90 80 90 76" stroke-width="1.2"/>' +
    /* Bord superieur */
    '<path d="M22 34 C22 30 34 28 54 28 C74 28 86 30 86 34" stroke-width="1.1"/>' +
    /* Couvercle */
    '<path d="M30 28 C30 22 40 18 54 18 C68 18 78 22 78 28" stroke-width="1.1"/>' +
    /* Bouton du couvercle */
    '<path d="M48 18 C48 14 50 12 54 11 C58 12 60 14 60 18" stroke-width="1"/>' +
    /* Cuillere */
    '<path d="M82 24 C86 22 92 18 96 12 C98 8 100 4 98 2" stroke-width="1.1"/>' +
    '<path d="M96 12 C94 10 96 6 100 6" stroke-width="0.9"/>' +
    /* Reflet decoratif */
    '<path d="M34 50 C34 46 36 44 38 44" stroke-width="0.7" opacity="0.4"/>' +
    /* Petits grains de sucre */
    '<path d="M46 26 L47 25" stroke-width="1.2" opacity="0.5"/>' +
    '<path d="M58 25 L59 24" stroke-width="1.2" opacity="0.5"/>' +
    '<path d="M52 24 L52 23" stroke-width="1.2" opacity="0.5"/>' +
    '</svg>'
};

/* -----------------------------------------------------------------------
   Injection des illustrations dans le DOM
   ----------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {
  initIllustrations();
});

function initIllustrations() {
  var targets = document.querySelectorAll('[data-illustration]');
  if (!targets.length) return;

  targets.forEach(function (el) {
    var name = el.getAttribute('data-illustration');
    var svg = ILLUSTRATIONS[name];
    if (!svg) return;

    var position = el.getAttribute('data-illustration-position') || 'right';
    var size = el.getAttribute('data-illustration-size') || 'md';
    var accent = el.hasAttribute('data-illustration-accent');

    // Le conteneur parent doit etre en position relative
    var parent = el.closest('.container') || el.parentElement;
    if (parent && getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'illustration illustration--' + position + ' illustration--' + size;
    if (accent) wrapper.className += ' illustration--accent';
    wrapper.innerHTML = svg;
    wrapper.setAttribute('aria-hidden', 'true');

    el.appendChild(wrapper);
  });
}