/**
 * Gamme Filters — filtre les cards produit par categorie
 */
(function () {
  'use strict';

  var buttons = document.querySelectorAll('.gamme-nav__btn');
  var cards = document.querySelectorAll('.gamme-card[data-categories]');
  var sections = document.querySelectorAll('.gamme-section[data-section-cat]');

  if (!buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      // Update active button
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Filter cards
      cards.forEach(function (card) {
        var cats = card.getAttribute('data-categories') || '';
        var show = (filter === 'all') || cats.split(' ').indexOf(filter) !== -1;
        if (show) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });

      // Show/hide section headers
      sections.forEach(function (sec) {
        var sectionCards = sec.querySelectorAll('.gamme-card[data-categories]');
        var hasVisible = false;
        sectionCards.forEach(function (c) {
          if (c.style.display !== 'none') hasVisible = true;
        });
        sec.style.display = hasVisible ? '' : 'none';
      });
    });
  });
})();
