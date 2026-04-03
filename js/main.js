/* ========================================================================
   TONES — Interactions globales
   Vanilla JS · Aucune dépendance
   ======================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initStickyCTA();
  renderPhoneNumbers();
});

/* -----------------------------------------------------------------------
   1. Header — état visuel au scroll
   ----------------------------------------------------------------------- */

function initHeader() {
  var header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, { passive: true });
}

/* -----------------------------------------------------------------------
   2. Menu mobile — ouverture / fermeture
   ----------------------------------------------------------------------- */

function initMobileMenu() {
  var menuBtn = document.querySelector('.header__menu-btn');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (!menuBtn || !mobileMenu) return;

  // Toggle au clic sur le hamburger
  menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');

    if (mobileMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Ferme le menu au clic sur un lien
  var menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* -----------------------------------------------------------------------
   3. Animations au scroll — révélation des éléments
   ----------------------------------------------------------------------- */

function initScrollAnimations() {
  var elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

/* -----------------------------------------------------------------------
   4. Sticky CTA mobile — apparaît après le hero
   ----------------------------------------------------------------------- */

function initStickyCTA() {
  var stickyCta = document.querySelector('.sticky-cta');
  var heroSection = document.querySelector('.hero') || document.querySelector('.home-hero') || document.querySelector('.chr-hero');
  if (!stickyCta || !heroSection) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    });
  }, {
    threshold: 0
  });

  observer.observe(heroSection);
}

/* -----------------------------------------------------------------------
   5. Anti-scraping téléphone — remplace le texte par un SVG
   ----------------------------------------------------------------------- */

function renderPhoneNumbers() {
  document.querySelectorAll('.phone-text').forEach(function (el) {
    var isLarge = el.classList.contains('phone-text--lg');
    var fontSize = isLarge ? 24 : 14;
    var height = isLarge ? '1.4em' : '1em';
    var viewWidth = isLarge ? 210 : 140;
    var yPos = isLarge ? 22 : 15;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + viewWidth + ' ' + (fontSize + 6) + '" style="height:' + height + ';vertical-align:middle;display:inline-block;width:auto;"><text x="0" y="' + yPos + '" fill="currentColor" font-family="\'DM Sans\',sans-serif" font-size="' + fontSize + '" font-weight="600">06 62 11 97 48</text></svg>';
    el.innerHTML = svg;
  });
}