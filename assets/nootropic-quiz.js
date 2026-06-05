// Nootropic Stack Finder Quiz — state machine, scoring engine, AJAX results renderer
(function () {
  'use strict';

  // --- Scoring matrix ---
  // Maps each step's option value → tag score increments.
  // These keys must match data-value attributes on .nq-option elements in the section.
  const SCORING = [
    // Step 0 — Primary Goal
    {
      focus:   { focus: 3, memory: 1 },
      mood:    { anxiety: 3, mood: 2 },
      energy:  { energy: 3, mood: 1 },
      memory:  { memory: 3, focus: 1 },
      sleep:   { 'sleep-support': 4 }
    },
    // Step 1 — Experience Level
    {
      beginner:     { 'beginner-safe': 3 },
      some:         { 'beginner-safe': 1, adaptogen: 1 },
      intermediate: { adaptogen: 2, cholinergic: 1 },
      advanced:     { racetam: 2, cholinergic: 2 }
    },
    // Step 2 — Lifestyle
    {
      student:      { memory: 1, focus: 1 },
      professional: { focus: 1, energy: 1 },
      athletic:     { energy: 1, adaptogen: 1 },
      wellness:     { adaptogen: 1 }
    },
    // Step 3 — Sensitivities
    {
      'stimulant-sensitive': { anxiety: 2, adaptogen: 1, 'beginner-safe': 1 },
      natural:               { adaptogen: 2, 'beginner-safe': 1 },
      synthetics:            { racetam: 2, cholinergic: 1 },
      dependency:            { 'beginner-safe': 2, adaptogen: 1 }
    },
    // Step 4 — Stack Size
    {
      simple:   { 'beginner-safe': 2 },
      moderate: { adaptogen: 1, cholinergic: 1 },
      full:     { racetam: 1, cholinergic: 2 }
    }
  ];

  // Result scorers: each function computes how well the accumulated scores match a given result key
  const RESULT_SCORERS = {
    'beginners-focus':    s => (s.focus           || 0) + (s['beginner-safe'] || 0),
    'calm-clarity':       s => (s.anxiety         || 0) + (s.adaptogen        || 0),
    'advanced-cognitive': s => (s.racetam         || 0) + (s.cholinergic      || 0),
    'mood-motivation':    s => (s.mood            || 0) + (s.energy           || 0),
    'deep-sleep':         s => (s['sleep-support'] || 0)
  };

  // --- State ---
  let currentStep = 0;
  const answers = {};
  const scores  = {};

  function addScores(tagMap) {
    Object.keys(tagMap).forEach(function (tag) {
      scores[tag] = (scores[tag] || 0) + tagMap[tag];
    });
  }

  function removeScores(tagMap) {
    Object.keys(tagMap).forEach(function (tag) {
      scores[tag] = Math.max(0, (scores[tag] || 0) - tagMap[tag]);
    });
  }

  function pickWinnerKey() {
    var best = null, bestScore = -1;
    Object.keys(RESULT_SCORERS).forEach(function (key) {
      var s = RESULT_SCORERS[key](scores);
      if (s > bestScore) { bestScore = s; best = key; }
    });
    return best;
  }

  // --- DOM helpers ---
  function qs(sel)  { return document.querySelector(sel); }
  function qsa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function setProgress(completedSteps) {
    var bar   = qs('#nqProgressBar');
    var label = qs('#nqProgressLabel');
    if (bar)   bar.style.width   = ((completedSteps / 5) * 100).toFixed(1) + '%';
    if (label) label.textContent = completedSteps > 0 ? 'Step ' + completedSteps + ' of 5' : 'Let\'s get started';
  }

  function showStep(index) {
    qsa('.nq-step').forEach(function (el, i) {
      el.classList.remove('nq-step--active', 'nq-step--exit');
      if (i === index) el.classList.add('nq-step--active');
    });

    var backBtn = qs('#nqBackBtn');
    if (backBtn) backBtn.style.visibility = index > 0 ? 'visible' : 'hidden';

    setProgress(index + 1);

    var wrapper = qs('.nq-wrapper');
    if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function goNext() {
    var stepEl   = qsa('.nq-step')[currentStep];
    if (!stepEl) return;

    var selected = stepEl.querySelector('.nq-option.is-selected');
    if (!selected) {
      var opts = stepEl.querySelector('.nq-options');
      if (opts) {
        opts.classList.add('nq-options--shake');
        setTimeout(function () { opts.classList.remove('nq-options--shake'); }, 500);
      }
      return;
    }

    var value = selected.dataset.value;
    answers[currentStep] = value;
    addScores(SCORING[currentStep][value] || {});

    if (currentStep < 4) {
      currentStep++;
      showStep(currentStep);
    } else {
      showResults();
    }
  }

  function goBack() {
    if (currentStep === 0) return;
    var prevAnswer = answers[currentStep];
    if (prevAnswer && SCORING[currentStep] && SCORING[currentStep][prevAnswer]) {
      removeScores(SCORING[currentStep][prevAnswer]);
    }
    delete answers[currentStep];
    currentStep--;
    showStep(currentStep);
  }

  // --- Product fetching ---
  function fetchProduct(handle) {
    return fetch('/products/' + handle + '.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function ()  { return null; });
  }

  function formatMoney(cents) {
    var currency = (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) || 'AED';
    return currency + '\u00a0' + (cents / 100).toFixed(2);
  }

  function buildProductCard(product) {
    var variant = product.variants && product.variants[0];
    if (!variant) return '';
    var img       = product.featured_image || '';
    var price     = formatMoney(variant.price);
    var available = variant.available;
    return (
      '<div class="nq-product-card">' +
        (img ? '<div class="nq-product-card__image"><img src="' + img + '" alt="' + esc(product.title) + '" loading="lazy" width="200" height="200"></div>' : '') +
        '<div class="nq-product-card__body">' +
          '<div class="nq-product-card__meta">' +
            '<h3 class="nq-product-card__title">' + esc(product.title) + '</h3>' +
            '<p class="nq-product-card__price">' + price + '</p>' +
          '</div>' +
          (available
            ? '<form class="nq-product-card__form" data-variant="' + variant.id + '">' +
                '<button type="submit" class="nq-product-card__atc">Add to Stack \u2192</button>' +
              '</form>'
            : '<p class="nq-product-card__sold-out">Sold out</p>') +
        '</div>' +
      '</div>'
    );
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // --- Results ---
  function showResults() {
    var winnerKey   = pickWinnerKey();
    var dataEl      = qs('#nq-results-data');
    var resultsData = [];
    try { resultsData = JSON.parse(dataEl ? dataEl.textContent : '[]'); } catch (e) { /* noop */ }

    var result = resultsData.filter(function (r) { return r.key === winnerKey; })[0] || resultsData[0] || {};

    qsa('.nq-step').forEach(function (el) { el.classList.remove('nq-step--active'); });

    var bar = qs('#nqProgressBar');
    if (bar) bar.style.width = '100%';
    var label = qs('#nqProgressLabel');
    if (label) label.textContent = 'Complete';

    var panel = qs('#nqResultsPanel');
    if (!panel) return;

    panel.innerHTML =
      '<div class="nq-results__loading" aria-live="polite">' +
        '<div class="nq-spinner"></div>' +
        '<p>Building your stack\u2026</p>' +
      '</div>';
    panel.classList.add('nq-results--visible');

    var handles = (result.handles || []).filter(Boolean);

    Promise.all(handles.map(fetchProduct)).then(function (products) {
      var valid    = products.filter(Boolean);
      var cardsHtml = valid.map(buildProductCard).join('');

      panel.innerHTML =
        '<div class="nq-results__header">' +
          '<span class="nq-results__dot" aria-hidden="true"></span>' +
          '<span class="nq-results__badge">Your recommended stack</span>' +
          '<h2 class="nq-results__title">' + esc(result.stackName || 'Your Stack') + '</h2>' +
          (result.description ? '<div class="nq-results__description">' + result.description + '</div>' : '') +
        '</div>' +
        (cardsHtml
          ? '<div class="nq-results__grid">' + cardsHtml + '</div>'
          : '<p class="nq-results__empty">Products coming soon \u2014 swap in handles via the theme customizer.</p>') +
        '<div class="nq-results__actions">' +
          '<button type="button" class="nq-retake-btn">Retake the quiz</button>' +
        '</div>';

      // Add-to-cart via AJAX
      qsa('.nq-product-card__form', panel).forEach(function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var btn = form.querySelector('.nq-product-card__atc');
          var id  = parseInt(form.dataset.variant, 10);
          if (!id || isNaN(id)) return;
          if (btn) { btn.disabled = true; btn.textContent = 'Adding\u2026'; }
          var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
          fetch(root + 'cart/add.js', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body:    JSON.stringify({ id: id, quantity: 1 })
          }).then(function (r) {
            if (r.ok) {
              if (btn) { btn.textContent = 'Added \u2713'; }
              document.dispatchEvent(new CustomEvent('xo-cart/addCartSuccess'));
            } else {
              if (btn) { btn.textContent = 'Try again'; btn.disabled = false; }
            }
          }).catch(function () {
            if (btn) { btn.textContent = 'Try again'; btn.disabled = false; }
          });
        });
      });

      var retake = panel.querySelector('.nq-retake-btn');
      if (retake) retake.addEventListener('click', resetQuiz);
    });
  }

  function resetQuiz() {
    currentStep = 0;
    Object.keys(answers).forEach(function (k) { delete answers[k]; });
    Object.keys(scores).forEach(function  (k) { delete scores[k]; });
    qsa('.nq-option').forEach(function (el) { el.classList.remove('is-selected'); });
    var panel = qs('#nqResultsPanel');
    if (panel) { panel.classList.remove('nq-results--visible'); panel.innerHTML = ''; }
    showStep(0);
  }

  // --- Init ---
  function init() {
    var quiz = qs('#nqQuiz');
    if (!quiz) return;

    // Option selection
    quiz.addEventListener('click', function (e) {
      var option = e.target.closest('.nq-option');
      if (!option) return;
      var stepEl = option.closest('.nq-step');
      if (!stepEl) return;
      qsa('.nq-option', stepEl).forEach(function (el) { el.classList.remove('is-selected'); });
      option.classList.add('is-selected');
    });

    // Keyboard support on options
    quiz.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var option = e.target.closest('.nq-option');
      if (!option) return;
      e.preventDefault();
      var stepEl = option.closest('.nq-step');
      if (stepEl) qsa('.nq-option', stepEl).forEach(function (el) { el.classList.remove('is-selected'); });
      option.classList.add('is-selected');
    });

    // Navigation buttons
    quiz.addEventListener('click', function (e) {
      if (e.target.closest('#nqNextBtn')) goNext();
      if (e.target.closest('#nqBackBtn')) goBack();
    });

    showStep(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Polyfill Element.closest for older browsers
  if (typeof Element !== 'undefined' && !Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;
      do { if (el.matches(s)) return el; el = el.parentElement; } while (el !== null);
      return null;
    };
  }
})();
