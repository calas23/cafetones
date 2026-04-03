/**
 * Product Modal — affiche une fiche produit au clic sur une card
 * Les donnees sont stockees en data-attributes sur les cards.
 */
(function () {
  'use strict';

  var overlay = null;

  function buildDots(value, max) {
    var html = '';
    for (var i = 1; i <= max; i++) {
      html += '<span class="pm-dot ' + (i <= value ? 'pm-dot--filled' : 'pm-dot--empty') + '"></span>';
    }
    return html;
  }

  function buildPills(str) {
    if (!str) return '';
    return str.split(',').map(function (s) {
      return '<span class="pm-pill">' + s.trim() + '</span>';
    }).join('');
  }

  function buildBadges(str) {
    if (!str) return '';
    return str.split(',').map(function (s) {
      return '<span class="badge badge--gold" style="margin-right:0.25rem;margin-bottom:0.25rem;">' + s.trim() + '</span>';
    }).join('');
  }

  function open(card) {
    var d = card.dataset;
    var name = d.name || '';
    var subtitle = d.subtitle || '';
    var description = d.description || '';
    var image = d.image || '';
    var notes = d.notes || '';
    var origins = d.origins || '';
    var certifications = d.certifications || '';
    var medals = d.medals || '';
    var price = d.price || '';
    var format = d.format || '';
    var weight = d.weight || '';
    var packaging = d.packaging || '';
    var orderPeriod = d.orderPeriod || '';
    var ingredients = d.ingredients || '';
    var ingredientsGlaze = d.ingredientsGlaze || '';
    var roast = d.roast || '';
    var caffeine = d.caffeine || '';
    var acidity = parseInt(d.acidity) || 0;
    var body = parseInt(d.body) || 0;
    var intensity = parseInt(d.intensity) || 0;

    var html = '<div class="pm-overlay" tabindex="-1">';
    html += '<div class="pm-card">';

    // Close button
    html += '<button class="pm-close" aria-label="Fermer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';

    // Image
    if (image) {
      html += '<div class="pm-image"><img src="' + image + '" alt="' + name + '"></div>';
    }

    html += '<div class="pm-body">';

    // Name & subtitle
    html += '<h2 class="pm-name">' + name + '</h2>';
    if (subtitle) {
      html += '<div class="pm-subtitle">' + subtitle + '</div>';
    }

    // Description
    if (description) {
      html += '<p class="pm-desc">' + description + '</p>';
    }

    // Flavor profile
    if (acidity || body || intensity) {
      html += '<div class="pm-profile">';
      if (acidity) html += '<div class="pm-profile__row"><span class="pm-profile__label">Acidit\u00e9</span><span class="pm-profile__dots">' + buildDots(acidity, 5) + '</span></div>';
      if (body) html += '<div class="pm-profile__row"><span class="pm-profile__label">Corps</span><span class="pm-profile__dots">' + buildDots(body, 5) + '</span></div>';
      if (intensity) html += '<div class="pm-profile__row"><span class="pm-profile__label">Intensit\u00e9</span><span class="pm-profile__dots">' + buildDots(intensity, 5) + '</span></div>';
      html += '</div>';
    }

    // Roast
    if (roast) {
      html += '<div class="pm-info-line"><strong>Torr\u00e9faction :</strong> ' + roast + '</div>';
    }

    // Notes
    if (notes) {
      html += '<div class="pm-section"><div class="pm-section__label">Notes aromatiques</div><div class="pm-pills">' + buildPills(notes) + '</div></div>';
    }

    // Origins
    if (origins) {
      html += '<div class="pm-info-line"><strong>Origines :</strong> ' + origins + '</div>';
    }

    // Certifications & medals
    if (certifications || medals) {
      html += '<div class="pm-badges">';
      if (certifications) html += buildBadges(certifications);
      if (medals) html += '<span class="pm-medals">M\u00e9dailles ICT : ' + medals + '</span>';
      html += '</div>';
    }

    // Caffeine
    if (caffeine) {
      html += '<div class="pm-info-line"><strong>Caf\u00e9ine :</strong> ' + caffeine + '</div>';
    }

    // Ingredients
    if (ingredients) {
      html += '<div class="pm-info-line"><strong>Ingr\u00e9dients :</strong> ' + ingredients + '</div>';
    }
    if (ingredientsGlaze) {
      html += '<div class="pm-info-line"><strong>Gla\u00e7age :</strong> ' + ingredientsGlaze + '</div>';
    }

    // Practical info
    var practicals = [];
    if (format) practicals.push('<strong>Format :</strong> ' + format);
    if (weight) practicals.push('<strong>Poids :</strong> ' + weight);
    if (packaging) practicals.push('<strong>Emballage :</strong> ' + packaging);
    if (orderPeriod) practicals.push('<strong>Commande :</strong> ' + orderPeriod);
    if (practicals.length) {
      html += '<div class="pm-practicals">';
      practicals.forEach(function (p) { html += '<div class="pm-info-line">' + p + '</div>'; });
      html += '</div>';
    }

    // Price
    if (price) {
      html += '<div class="pm-price">' + price + '</div>';
    }

    // CTA
    html += '<a href="tel:+33662119748" class="btn btn--primary btn--full pm-cta">Commander \u2014 06 62 11 97 48</a>';

    html += '</div>'; // pm-body
    html += '</div>'; // pm-card
    html += '</div>'; // pm-overlay

    overlay = document.createElement('div');
    overlay.innerHTML = html;
    overlay = overlay.firstChild;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(function () {
      overlay.classList.add('pm-overlay--visible');
    });

    overlay.querySelector('.pm-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('pm-overlay--visible');
    setTimeout(function () {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      overlay = null;
      document.body.style.overflow = '';
    }, 250);
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  // Bind to all cards with data-product-modal
  document.querySelectorAll('[data-product-modal]').forEach(function (card) {
    card.style.cursor = 'pointer';
  });

  document.addEventListener('click', function (e) {
    var card = e.target.closest('[data-product-modal]');
    if (card && card.dataset.name) {
      e.preventDefault();
      open(card);
    }
  });
})();
