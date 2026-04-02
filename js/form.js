/* ========================================================================
   TONES — Formulaires & Tracking conversions
   Vanilla JS · Aucune dépendance
   Tracking via Google Tag Manager (dataLayer)
   ======================================================================== */

window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
  initForms();
  initPhoneTracking();
});

/* -----------------------------------------------------------------------
   1. Initialisation des formulaires
   Attache validation et soumission sur tous les [data-form]
   ----------------------------------------------------------------------- */

function initForms() {
  var forms = document.querySelectorAll('[data-form]');
  if (!forms.length) return;

  forms.forEach(function (form) {
    // Soumission
    form.addEventListener('submit', handleFormSubmit);

    // Validation en temps réel sur chaque champ
    var fields = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    fields.forEach(function (field) {
      // Valide au blur (quand l'utilisateur quitte le champ)
      field.addEventListener('blur', function () {
        validateField(field);
      });

      // Re-valide à la saisie si le champ est déjà en erreur
      field.addEventListener('input', function () {
        if (field.classList.contains('error')) {
          validateField(field);
        }
      });
    });
  });
}

/* -----------------------------------------------------------------------
   2. Soumission du formulaire
   Valide tous les champs required, collecte les données, push GTM
   ----------------------------------------------------------------------- */

function handleFormSubmit(e) {
  e.preventDefault();

  var form = e.target;
  var requiredFields = form.querySelectorAll('[required]');
  var isValid = true;

  // Valide chaque champ requis
  requiredFields.forEach(function (field) {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  if (!isValid) return;

  // Collecte des données
  var data = Object.fromEntries(new FormData(form));

  // Push vers Google Tag Manager
  window.dataLayer.push({
    event: 'form_submission',
    form_name: form.dataset.form,
    form_data: {
      entreprise: data.entreprise || '',
      effectif: data.effectif || ''
    }
  });

  // Affiche l'état de succès
  var formContent = form.querySelector('.form-content');
  var formSuccess = form.querySelector('.form-success');

  if (formContent) formContent.style.display = 'none';
  if (formSuccess) formSuccess.classList.add('active');

  // Debug
  console.log('Form submitted:', data);
}

/* -----------------------------------------------------------------------
   3. Validation d'un champ individuel
   Gère required, email, téléphone — affiche/masque le message d'erreur
   ----------------------------------------------------------------------- */

function validateField(field) {
  var formGroup = field.closest('.form-group');
  var errorEl = formGroup ? formGroup.querySelector('.form-error') : null;
  var value = field.value.trim();

  // Champ requis vide
  if (field.hasAttribute('required') && value === '') {
    showFieldError(field, errorEl, 'Ce champ est requis');
    return false;
  }

  // Validation email
  if (field.type === 'email' && value !== '') {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(field, errorEl, 'Veuillez entrer une adresse email valide');
      return false;
    }
  }

  // Validation téléphone
  if (field.type === 'tel' && value !== '') {
    var cleaned = value.replace(/[\s\-\.\(\)]/g, '');
    if (cleaned.length < 10) {
      showFieldError(field, errorEl, 'Veuillez entrer un numéro de téléphone valide');
      return false;
    }
  }

  // Champ valide — on retire l'erreur
  clearFieldError(field, errorEl);
  return true;
}

/**
 * Affiche l'erreur sur un champ
 */
function showFieldError(field, errorEl, message) {
  field.classList.add('error');
  field.style.borderColor = 'var(--color-error)';

  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

/**
 * Retire l'erreur d'un champ
 */
function clearFieldError(field, errorEl) {
  field.classList.remove('error');
  field.style.borderColor = '';

  if (errorEl) {
    errorEl.style.display = 'none';
  }
}

/* -----------------------------------------------------------------------
   4. Tracking des clics téléphone
   Push un événement GTM à chaque clic sur un lien tel:
   ----------------------------------------------------------------------- */

function initPhoneTracking() {
  var phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  if (!phoneLinks.length) return;

  phoneLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      window.dataLayer.push({
        event: 'phone_click',
        phone_number: link.href.replace('tel:', ''),
        phone_location: link.dataset.location || 'unknown'
      });
    });
  });
}