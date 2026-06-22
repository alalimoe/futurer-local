// Nootropic Stack Finder Quiz — state machine, results renderer, Klaviyo + cart wiring.
// Recommendation logic lives in assets/quiz-engine.js (window.NootropixQuizEngine).
(function () {
  'use strict';

  // --- State ---
  let currentStep = 0;
  const answers = {};
  // Email captured at the gate before the quiz steps are revealed.
  var gatedEmail = '';

  // Map the recorded UI answers (answers[0..4], using the section's data-value
  // strings) to the normalized values the engine expects. Klaviyo keeps the raw
  // UI values via buildEventProperties — only the engine call is normalized.
  function answersForEngine() {
    var PREF_MAP = {
      'stimulant-sensitive': 'stimfree',
      synthetics: 'synthetic',
      dependency: 'nondependency'
    };
    var SIZE_MAP = { moderate: 'medium' };
    return {
      goal:       answers[0],
      experience: answers[1],
      context:    answers[2],
      preference: PREF_MAP[answers[3]] || answers[3],
      size:       SIZE_MAP[answers[4]] || answers[4]
    };
  }

  // --- DOM helpers ---
  function qs(sel)  { return document.querySelector(sel); }
  function qsa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function setProgress(completedSteps) {
    var bar   = qs('#nqProgressBar');
    var label = qs('#nqProgressLabel');
    var track = qs('.nq-progress-wrap');
    if (bar)   bar.style.width   = ((completedSteps / 5) * 100).toFixed(1) + '%';
    if (label) label.textContent = completedSteps > 0 ? 'Step ' + completedSteps + ' of 5' : 'Let\'s get started';
    if (track) track.setAttribute('aria-valuenow', String(completedSteps));
  }

  // --- Config ---
  var QUESTION_KEYS = ['goal', 'experience', 'context', 'preference', 'stack_size'];

  function getConfig() {
    var el = qs('#nq-config');
    if (!el) return {};
    try { return JSON.parse(el.textContent) || {}; } catch (e) { return {}; }
  }

  // --- Step transitions ---
  var STEP_EXIT_CLASSES = ['nq-step--exit', 'nq-step--exit-next', 'nq-step--exit-prev'];
  var STEP_ENTER_CLASSES = ['nq-step--from-next', 'nq-step--from-prev'];
  var STEP_DURATION = 200;
  var stepExitTimer = null;

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  // Drop any in-flight exit state so rapid clicks can't leave a stale overlay.
  function clearStepExit() {
    if (stepExitTimer) { clearTimeout(stepExitTimer); stepExitTimer = null; }
    qsa('.nq-step').forEach(function (el) {
      el.classList.remove.apply(el.classList, STEP_EXIT_CLASSES);
    });
  }

  // index: target step. direction: 'next' | 'back' | undefined (instant).
  function showStep(index, direction) {
    var steps  = qsa('.nq-step');
    var target = steps[index];
    var prev   = null;
    steps.forEach(function (el) { if (el.classList.contains('nq-step--active')) prev = el; });

    clearStepExit();

    var animate = direction && !prefersReducedMotion() && prev && target && prev !== target;

    steps.forEach(function (el) {
      el.classList.remove('nq-step--active');
      el.classList.remove.apply(el.classList, STEP_ENTER_CLASSES);
    });

    if (target) {
      target.classList.add('nq-step--active');
      if (animate) {
        target.classList.add(direction === 'back' ? 'nq-step--from-prev' : 'nq-step--from-next');
      }
    }

    if (animate) {
      prev.classList.add('nq-step--exit', direction === 'back' ? 'nq-step--exit-prev' : 'nq-step--exit-next');
      stepExitTimer = setTimeout(function () {
        if (prev) prev.classList.remove.apply(prev.classList, STEP_EXIT_CLASSES);
        stepExitTimer = null;
      }, STEP_DURATION + 40);
    }

    if (target) {
      var backBtn = target.querySelector('.nq-back-btn');
      if (backBtn) backBtn.style.visibility = index > 0 ? 'visible' : 'hidden';
    }

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

    if (currentStep < 4) {
      currentStep++;
      showStep(currentStep, 'next');
    } else {
      showResults();
    }
  }

  function goBack() {
    if (currentStep === 0) return;
    currentStep--;
    delete answers[currentStep];
    showStep(currentStep, 'back');
  }

  // --- Product fetching ---
  // Merchants may paste a bare handle, a "/products/handle" path, or a full
  // "https://store/products/handle" URL. Normalize all of these to a bare handle.
  function normalizeHandle(raw) {
    var h = String(raw || '').trim();
    if (!h) return '';
    h = h.replace(/^https?:\/\/[^/]+/i, '');
    var m = h.match(/\/products\/([^/?#]+)/i);
    if (m) { h = m[1]; }
    h = h.replace(/^\/+|\/+$/g, '').split(/[?#]/)[0].replace(/\.js$/i, '');
    return h;
  }

  function fetchProduct(rawHandle) {
    var handle = normalizeHandle(rawHandle);
    if (!handle) return Promise.resolve(null);
    return fetch('/products/' + handle + '.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function ()  { return null; });
  }

  // Fetch a product once, memoized by normalized handle (incl. null results),
  // so handles shared across stacks aren't re-requested.
  function fetchCached(rawHandle, cache) {
    var handle = normalizeHandle(rawHandle);
    if (!handle) return Promise.resolve(null);
    if (cache.has(handle)) return Promise.resolve(cache.get(handle));
    return fetchProduct(handle).then(function (product) {
      cache.set(handle, product);
      return product;
    });
  }

  function formatMoney(cents) {
    var currency = (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) || 'AED';
    return currency + '\u00a0' + (cents / 100).toFixed(2);
  }

  // Stock check: trust the product-level boolean, falling back to variants.
  function isInStock(product) {
    if (!product) return false;
    if (typeof product.available === 'boolean') return product.available;
    return (product.variants || []).some(function (v) { return v.available; });
  }

  // Pick the first purchasable variant so the ATC binds to something buyable.
  function firstAvailableVariant(product) {
    var variants = (product && product.variants) || [];
    return variants.filter(function (v) { return v.available; })[0] || variants[0];
  }

  function buildProductCard(product) {
    var variant = firstAvailableVariant(product);
    if (!variant) return '';
    var img       = product.featured_image || '';
    var price     = formatMoney(variant.price);
    var available = !!variant.available;
    return (
      '<div class="nq-product-card">' +
        (img ? '<div class="nq-product-card__image"><img src="' + img + '" alt="' + esc(product.title) + '" loading="lazy" width="200" height="200"></div>' : '') +
        '<div class="nq-product-card__body">' +
          '<div class="nq-product-card__meta">' +
            '<h3 class="nq-product-card__title">' + esc(product.title) + '</h3>' +
            (available ? '<span class="nq-product-card__stock">In stock</span>' : '') +
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

  // Push a freshly-added line item into the theme's cart store so the drawer,
  // badge, and notification re-render. The store update mirrors the theme's own
  // addCartSuccess reducer (size bump + re-rendered cart section HTML).
  function updateThemeCart(sectionId, data) {
    if (!window.xoStore || typeof window.xoStore.set !== 'function') return;
    var sectionHtml = sectionId && data && data.sections ? data.sections[sectionId] : null;
    window.xoStore.set('xo-cart', function (prev) {
      var prevState = prev || {};
      var nextSections = {};
      var key;
      if (prevState.sections) { for (key in prevState.sections) { nextSections[key] = prevState.sections[key]; } }
      if (sectionId && sectionHtml != null) { nextSections[sectionId] = sectionHtml; }
      return Object.assign({}, prevState, {
        size: (prevState.size || 0) + 1,
        sections: nextSections,
        item: data,
        isAdded: true,
        addIdLoading: '',
        productIdsForCartNotification: data && data.product_id ? [String(data.product_id)] : undefined
      });
    })('xo-cart/addCartSuccess');
  }

  // Multi-add variant: cart/add.js with an items[] array returns { items, sections }.
  // Bump the store size by the number added and re-render the cart section once.
  function updateThemeCartMulti(sectionId, data, addedCount) {
    if (!window.xoStore || typeof window.xoStore.set !== 'function') return;
    var items       = (data && data.items) || [];
    var sectionHtml = sectionId && data && data.sections ? data.sections[sectionId] : null;
    window.xoStore.set('xo-cart', function (prev) {
      var prevState = prev || {};
      var nextSections = {};
      var key;
      if (prevState.sections) { for (key in prevState.sections) { nextSections[key] = prevState.sections[key]; } }
      if (sectionId && sectionHtml != null) { nextSections[sectionId] = sectionHtml; }
      return Object.assign({}, prevState, {
        size: (prevState.size || 0) + (addedCount || items.length || 0),
        sections: nextSections,
        item: items.length ? items[items.length - 1] : data,
        isAdded: true,
        addIdLoading: '',
        productIdsForCartNotification: items.length
          ? items.map(function (it) { return String(it.product_id); })
          : undefined
      });
    })('xo-cart/addCartSuccess');
  }

  // --- Lead capture (Klaviyo) ---
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var KLAVIYO_BASE = 'https://a.klaviyo.com';
  var KLAVIYO_REVISION = '2026-01-15';

  function klaviyoHeaders() {
    return {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
      'revision': KLAVIYO_REVISION
    };
  }

  // Build human-readable answer properties from the recorded answers
  function buildEventProperties(result) {
    var props = {};
    QUESTION_KEYS.forEach(function (key, i) {
      if (answers[i]) props[key] = answers[i];
    });
    props.recommended_stack = result.stackName || '';
    props.recommended_handles = (result.handles || []).filter(Boolean).map(normalizeHandle);
    props.recommended_names = (result.names || []).filter(Boolean);
    props.result_key = result.key || '';
    return props;
  }

  function subscribeToList(cfg, email) {
    if (!cfg.listId) return Promise.resolve();
    var payload = {
      data: {
        type: 'subscription',
        attributes: {
          custom_source: cfg.source || 'Nootropic quiz',
          profile: { data: { type: 'profile', attributes: { email: email } } }
        },
        relationships: { list: { data: { type: 'list', id: cfg.listId } } }
      }
    };
    return fetch(KLAVIYO_BASE + '/client/subscriptions?company_id=' + encodeURIComponent(cfg.publicKey), {
      method: 'POST', headers: klaviyoHeaders(), body: JSON.stringify(payload)
    });
  }

  function trackQuizEvent(cfg, email, properties) {
    var payload = {
      data: {
        type: 'event',
        attributes: {
          properties: properties,
          metric: { data: { type: 'metric', attributes: { name: cfg.eventName || 'Completed Nootropic Quiz' } } },
          profile: { data: { type: 'profile', attributes: { email: email } } }
        }
      }
    };
    return fetch(KLAVIYO_BASE + '/client/events?company_id=' + encodeURIComponent(cfg.publicKey), {
      method: 'POST', headers: klaviyoHeaders(), body: JSON.stringify(payload)
    });
  }

  function upsertProfile(cfg, email, result) {
    var props = {
      'Quiz Goal': answers[0] || '',
      'Quiz Experience': answers[1] || '',
      'Quiz Context': answers[2] || '',
      'Quiz Preference': answers[3] || '',
      'Quiz Stack Size': answers[4] || '',
      'Recommended Stack': result.stackName || '',
      'Quiz Completed At': new Date().toISOString()
    };
    var payload = {
      data: { type: 'profile', attributes: { email: email, properties: props } }
    };
    return fetch(KLAVIYO_BASE + '/client/profiles?company_id=' + encodeURIComponent(cfg.publicKey), {
      method: 'POST', headers: klaviyoHeaders(), body: JSON.stringify(payload)
    });
  }

  function submitCapture(cfg, email, result) {
    try {
      if (window.klaviyo && typeof window.klaviyo.push === 'function') {
        window.klaviyo.push(['identify', { '$email': email }]);
      }
    } catch (e) { /* noop */ }

    var properties = buildEventProperties(result);
    return Promise.all([
      subscribeToList(cfg, email),
      trackQuizEvent(cfg, email, properties),
      upsertProfile(cfg, email, result)
    ]);
  }

  // Gate submit: best-effort identify + subscribe + seed profile. Fire-and-forget
  // — a Klaviyo failure (or missing publicKey) must never block the user.
  function seedGateProfile(klaviyo, email) {
    try {
      if (window.klaviyo && typeof window.klaviyo.push === 'function') {
        window.klaviyo.push(['identify', { '$email': email }]);
      }
    } catch (e) { /* noop */ }
    if (!klaviyo || !klaviyo.publicKey) return;
    try { subscribeToList(klaviyo, email).catch(function () {}); } catch (e) { /* noop */ }
    try { upsertProfile(klaviyo, email, {}).catch(function () {}); } catch (e) { /* noop */ }
  }

  // Quiz completion: fire the metric event + profile update for the gated email
  // (now that all answers and the recommended stack are known). Best-effort.
  function fireCompletion(klaviyo, email, result) {
    if (!klaviyo || !klaviyo.publicKey || !email) return;
    try {
      if (window.klaviyo && typeof window.klaviyo.push === 'function') {
        window.klaviyo.push(['identify', { '$email': email }]);
      }
    } catch (e) { /* noop */ }
    var properties = buildEventProperties(result);
    try { trackQuizEvent(klaviyo, email, properties).catch(function () {}); } catch (e) { /* noop */ }
    try { upsertProfile(klaviyo, email, result).catch(function () {}); } catch (e) { /* noop */ }
  }

  function captureCardHtml(cap) {
    return (
      '<div class="nq-capture" data-nq-capture>' +
        '<div class="nq-capture__text">' +
          '<span class="nq-capture__dot" aria-hidden="true"></span>' +
          '<h3 class="nq-capture__title">' + esc(cap.title || 'Email me my stack') + '</h3>' +
          (cap.subtitle ? '<p class="nq-capture__sub">' + esc(cap.subtitle) + '</p>' : '') +
        '</div>' +
        '<form class="nq-capture__form" data-nq-capture-form novalidate>' +
          '<label class="nq-capture__label" for="nqEmail">Email address</label>' +
          '<div class="nq-capture__row">' +
            '<input class="nq-capture__input" id="nqEmail" name="email" type="email" inputmode="email" ' +
              'autocomplete="email" placeholder="' + esc(cap.placeholder || 'you@email.com') + '" ' +
              'aria-describedby="nqCaptureStatus" required>' +
            '<button class="nq-capture__btn" type="submit" data-nq-capture-submit>' +
              '<span class="nq-capture__btn-label">' + esc(cap.button || 'Send my stack') + '</span>' +
              '<span class="nq-capture__btn-spinner" aria-hidden="true"></span>' +
            '</button>' +
          '</div>' +
          (cap.fineprint ? '<div class="nq-capture__fineprint">' + cap.fineprint + '</div>' : '') +
          '<p class="nq-capture__status" id="nqCaptureStatus" role="status" aria-live="polite" data-nq-status></p>' +
        '</form>' +
      '</div>'
    );
  }

  // Results confirmation shown when the email was already captured at the gate.
  function confirmationCardHtml(cap, email) {
    return (
      '<div class="nq-capture nq-capture--confirm">' +
        '<div class="nq-capture__success">' +
          '<span class="nq-capture__success-icon" aria-hidden="true">\u2713</span>' +
          '<h3 class="nq-capture__title">' + esc(cap.successTitle || 'Your stack is on its way') + '</h3>' +
          (cap.successMessage ? '<div class="nq-capture__sub">' + cap.successMessage + '</div>' : '') +
          '<p class="nq-capture__sub nq-capture__confirm-email">Sent to ' + esc(email) + '</p>' +
        '</div>' +
      '</div>'
    );
  }

  function wireCapture(panel, cfg, cap, result) {
    var card = panel.querySelector('[data-nq-capture]');
    if (!card) return;
    var form   = card.querySelector('[data-nq-capture-form]');
    var input  = card.querySelector('.nq-capture__input');
    var btn    = card.querySelector('[data-nq-capture-submit]');
    var status = card.querySelector('[data-nq-status]');

    function setStatus(msg, state) {
      if (!status) return;
      status.textContent = msg || '';
      if (state) status.setAttribute('data-state', state); else status.removeAttribute('data-state');
    }
    function setLoading(on) {
      if (!btn) return;
      if (on) { btn.setAttribute('aria-busy', 'true'); btn.disabled = true; }
      else    { btn.removeAttribute('aria-busy'); btn.disabled = false; }
    }
    function showDone() {
      card.innerHTML =
        '<div class="nq-capture__success">' +
          '<span class="nq-capture__success-icon" aria-hidden="true">\u2713</span>' +
          '<h3 class="nq-capture__title">' + esc(cap.successTitle || 'Sent! Check your inbox.') + '</h3>' +
          (cap.successMessage ? '<div class="nq-capture__sub">' + cap.successMessage + '</div>' : '') +
        '</div>';
    }

    if (input) {
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') {
          input.removeAttribute('aria-invalid'); setStatus('', null);
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (input && input.value ? input.value : '').trim();
      if (!EMAIL_RE.test(email)) {
        if (input) { input.setAttribute('aria-invalid', 'true'); input.focus(); }
        setStatus('Please enter a valid email address.', 'error');
        return;
      }
      if (input) input.removeAttribute('aria-invalid');
      if (!cfg.publicKey) { setStatus('Capture is temporarily unavailable.', 'error'); return; }

      setStatus('', null);
      setLoading(true);
      submitCapture(cfg, email, result)
        .then(function () { showDone(); })
        .catch(function () { setLoading(false); setStatus('Something went wrong. Please try again.', 'error'); });
    });
  }

  // --- Results loading state ---
  // Friendly labels for the raw answer values recorded against each step.
  var GOAL_LABELS = {
    focus:  'focus & cognition',
    mood:   'mood & calm',
    energy: 'energy & motivation',
    memory: 'memory & learning',
    sleep:  'sleep & recovery'
  };
  var PREFERENCE_LABELS = {
    'stimulant-sensitive': 'stimulant sensitivity',
    natural:               'natural & herbal compounds',
    synthetics:            'research-backed compounds',
    dependency:            'low-dependency options'
  };

  // Build the rotating loading copy, weaving in the user's actual answers.
  function buildLoadingMessages() {
    var msgs = [];
    var goal = GOAL_LABELS[answers[0]];
    msgs.push(goal ? 'Matching compounds to your ' + goal + '\u2026' : 'Matching your compounds\u2026');
    var pref = PREFERENCE_LABELS[answers[3]];
    if (pref) msgs.push('Filtering for ' + pref + '\u2026');
    msgs.push('Checking stock\u2026');
    msgs.push('Almost there\u2026');
    return msgs;
  }

  function skeletonCardHtml() {
    return (
      '<div class="nq-skeleton-card">' +
        '<div class="nq-skeleton-card__image nq-skeleton"></div>' +
        '<div class="nq-skeleton-card__body">' +
          '<div class="nq-skeleton-card__lines">' +
            '<div class="nq-skeleton nq-skeleton--line nq-skeleton--title"></div>' +
            '<div class="nq-skeleton nq-skeleton--line nq-skeleton--price"></div>' +
          '</div>' +
          '<div class="nq-skeleton nq-skeleton--btn"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function loadingHtml(count) {
    var cards = '';
    for (var i = 0; i < count; i++) { cards += skeletonCardHtml(); }
    return (
      '<div class="nq-results__loading" aria-live="polite">' +
        '<div class="nq-results__grid nq-results__grid--skeleton" aria-hidden="true">' + cards + '</div>' +
        '<p class="nq-results__loading-copy" data-nq-loading-copy></p>' +
      '</div>'
    );
  }

  // One-shot, library-free confetti burst rendered inside the results panel.
  // Self-cleans after the longest piece finishes; skipped under reduced motion.
  function fireConfetti(host, topPx) {
    if (!host) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var COLORS = [
      'rgba(var(--color-accent))',
      'rgba(var(--color-accent-2))',
      'rgba(var(--color-success))',
      'rgba(var(--color-foreground))'
    ];
    var COUNT = 28;
    var layer = document.createElement('div');
    layer.className = 'nq-confetti';
    layer.setAttribute('aria-hidden', 'true');
    if (typeof topPx === 'number' && topPx > 0) layer.style.top = topPx + 'px';

    var maxLife = 0;
    for (var i = 0; i < COUNT; i++) {
      var piece = document.createElement('span');
      piece.className = 'nq-confetti__piece';
      var x     = (Math.random() * 2 - 1) * 180;        // -180..180px spread
      var y     = 80 + Math.random() * 220;             // 80..300px fall
      var rot   = (Math.random() * 2 - 1) * 540;         // rotation
      var delay = Math.random() * 0.15;                  // s
      var dur   = 1.2 + Math.random() * 0.5;             // 1.2..1.7s
      if (dur + delay > maxLife) maxLife = dur + delay;
      piece.style.cssText =
        '--nq-cf-x:' + x.toFixed(1) + 'px;' +
        '--nq-cf-y:' + y.toFixed(1) + 'px;' +
        '--nq-cf-r:' + rot.toFixed(0) + 'deg;' +
        '--nq-cf-delay:' + delay.toFixed(2) + 's;' +
        '--nq-cf-dur:' + dur.toFixed(2) + 's;' +
        '--nq-cf-c:' + COLORS[i % COLORS.length] + ';' +
        '--nq-cf-radius:' + (Math.random() < 0.5 ? '50%' : '1px') + ';' +
        'left:' + (40 + Math.random() * 20).toFixed(1) + '%;' +
        'width:' + (Math.random() < 0.4 ? '0.6rem' : '0.9rem') + ';';
      layer.appendChild(piece);
    }

    host.appendChild(layer);
    setTimeout(function () {
      if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    }, Math.ceil((maxLife + 0.1) * 1000));
  }

  // --- Results ---
  function showResults() {
    var dataEl      = qs('#nq-results-data');
    var resultsData = [];
    try { resultsData = JSON.parse(dataEl ? dataEl.textContent : '[]'); } catch (e) { /* noop */ }

    var engine = (window.NootropixQuizEngine && window.NootropixQuizEngine.recommendStack)
      ? window.NootropixQuizEngine.recommendStack(answersForEngine())
      : null;
    // The engine returns a single sized stack. Normalize it to a one-element
    // candidate list (and tolerate a future multi-candidate shape).
    var candidates = (engine && engine.candidates) || [];
    if (!candidates.length && engine && engine.recommended_handles) {
      candidates = [{
        result_key:          engine.result_key,
        recommended_stack:   engine.recommended_stack,
        recommended_handles: engine.recommended_handles,
        recommended_names:   engine.recommended_names
      }];
    }
    if (!candidates.length && window.console && console.warn) {
      console.warn('[nootropic-quiz] Quiz engine returned no recommendation.', engine);
    }
    var cache = new Map();

    clearStepExit();
    qsa('.nq-step').forEach(function (el) { el.classList.remove('nq-step--active'); });

    var bar = qs('#nqProgressBar');
    if (bar) bar.style.width = '100%';
    var label = qs('#nqProgressLabel');
    if (label) label.textContent = 'Complete';

    var panel = qs('#nqResultsPanel');
    if (!panel) return;

    panel.innerHTML = loadingHtml(3);
    panel.classList.add('nq-results--visible');

    // Rotate the contextual loading copy while products are being fetched.
    var loadingMsgs = buildLoadingMessages();
    var msgIndex    = 0;
    var copyEl      = panel.querySelector('[data-nq-loading-copy]');
    if (copyEl) copyEl.textContent = loadingMsgs[0];
    var loadingTimer = setInterval(function () {
      msgIndex = (msgIndex + 1) % loadingMsgs.length;
      var el = panel.querySelector('[data-nq-loading-copy]');
      if (el) el.textContent = loadingMsgs[msgIndex];
    }, 900);
    function stopLoadingCopy() {
      if (loadingTimer) { clearInterval(loadingTimer); loadingTimer = null; }
    }

    var cfg = getConfig();
    var cap = cfg.capture || {};
    // Email is already on record from the gate, so confirm rather than re-ask.
    // Fall back to the legacy results form only if no gated email exists.
    var hasGatedEmail = !!gatedEmail;
    var captureHtml;
    if (cap.enabled === false) {
      captureHtml = '';
    } else if (hasGatedEmail) {
      captureHtml = confirmationCardHtml(cap, gatedEmail);
    } else {
      captureHtml = captureCardHtml(cap);
    }

    // Merchant-controlled minimum; fall back to 1 if unset/invalid.
    var MIN_IN_STOCK = parseInt(cfg.minInStock, 10);
    if (!(MIN_IN_STOCK >= 1)) { MIN_IN_STOCK = 1; }
    // Show every product the engine recommends (a "full" stack returns 5);
    // topUp() still clamps the count to each stack's actual handle list.
    var DISPLAY_CAP = 5;

    // Look up the merchant-managed Theme Customizer block for a result key.
    // The engine owns handles + headline; the block only supplies the optional
    // rich-text description and any backup handles.
    function blockFor(key) {
      return resultsData.filter(function (r) { return r.key === key; })[0] || {};
    }

    // Merge an engine candidate with its Theme Customizer block into the result
    // object the renderer and Klaviyo expect.
    function mergedResult(cand) {
      var block = blockFor(cand.result_key);
      return {
        key:           cand.result_key,
        stackName:     cand.recommended_stack || block.stackName || 'Your Stack',
        description:   block.description || '',
        handles:       (cand.recommended_handles || []).filter(Boolean),
        backupHandles: (block.backupHandles || []).filter(Boolean),
        names:         cand.recommended_names || []
      };
    }

    var rankedResults = candidates.map(mergedResult);

    // Fetch a candidate stack's handles (cached) and split by availability.
    function resolveCandidate(res) {
      var handles = (res.handles || []).filter(Boolean);
      return Promise.all(handles.map(function (h) { return fetchCached(h, cache); }))
        .then(function (products) {
          var fetched = products.filter(Boolean);
          return { key: res.key, result: res, fetched: fetched, inStock: fetched.filter(isInStock) };
        });
    }

    // Walk the ranked stacks lazily; accept the first with enough in-stock
    // products. If none qualify, fall back to the top-ranked stack.
    function evaluate(i) {
      if (!rankedResults.length) {
        return Promise.resolve({ key: '', result: { handles: [], backupHandles: [] }, fetched: [], inStock: [] });
      }
      if (i >= rankedResults.length) { return resolveCandidate(rankedResults[0]); }
      return resolveCandidate(rankedResults[i]).then(function (cand) {
        if (cand.inStock.length >= MIN_IN_STOCK) { return cand; }
        return evaluate(i + 1);
      });
    }

    function dedupeById(list) {
      var seen = {}, out = [];
      list.forEach(function (p) {
        var key = p && (p.id != null ? p.id : p.handle);
        if (key == null || seen[key]) { return; }
        seen[key] = true;
        out.push(p);
      });
      return out;
    }

    // Assemble the display list: in-stock primaries, topped up from in-stock
    // backups, capped at DISPLAY_CAP and deduped. Falls back to sold-out
    // primaries only if nothing is in stock, so the panel never goes blank.
    function topUp(chosen) {
      var desired = Math.min(DISPLAY_CAP, (chosen.result.handles || []).filter(Boolean).length || DISPLAY_CAP);
      var display = dedupeById(chosen.inStock).slice(0, DISPLAY_CAP);

      if (display.length >= desired || display.length >= DISPLAY_CAP) {
        return Promise.resolve(display);
      }
      var backups = (chosen.result.backupHandles || []).filter(Boolean);
      if (!backups.length) {
        return Promise.resolve(display.length ? display : dedupeById(chosen.fetched).slice(0, DISPLAY_CAP));
      }
      return Promise.all(backups.map(function (h) { return fetchCached(h, cache); })).then(function (products) {
        var seen = {};
        display.forEach(function (p) { seen[p.id] = true; });
        products.filter(Boolean).filter(isInStock).forEach(function (p) {
          if (display.length < DISPLAY_CAP && display.length < desired && !seen[p.id]) {
            seen[p.id] = true;
            display.push(p);
          }
        });
        return display.length ? display : dedupeById(chosen.fetched).slice(0, DISPLAY_CAP);
      });
    }

    evaluate(0).then(function (chosen) {
      return topUp(chosen).then(function (display) {
        // In-stock first (matters only if sold-out items are retained as a
        // last-resort fallback).
        display.sort(function (a, b) { return (isInStock(b) ? 1 : 0) - (isInStock(a) ? 1 : 0); });
        return { result: chosen.result, display: display };
      });
    }).then(function (out) {
      stopLoadingCopy();
      var result    = out.result;
      var valid     = out.display;
      var cardsHtml = valid.map(buildProductCard).join('');

      // Variant ids for every in-stock displayed product → the "Add all" CTA.
      var addAllItems = valid
        .filter(isInStock)
        .map(function (p) {
          var v = firstAvailableVariant(p);
          return v && v.available ? { id: v.id } : null;
        })
        .filter(Boolean);

      var addAllHtml = addAllItems.length
        ? '<button type="button" class="nq-add-all-btn" data-nq-add-all>' +
            'Add all to stack \u2192' +
          '</button>'
        : '';

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
        addAllHtml +
        captureHtml +
        '<div class="nq-results__actions">' +
          '<button type="button" class="nq-retake-btn">Retake the quiz</button>' +
        '</div>';

      // Confetti fires now that the real product cards are in the DOM (not
      // during the skeleton phase). Hosted on the persistent column so the
      // render can't cut it short; self-cleans; skipped under reduced motion.
      fireConfetti(panel.parentNode || panel, panel.offsetTop);

      // With a gated email we auto-fire completion tracking and show a
      // confirmation; otherwise wire the legacy results capture form.
      if (hasGatedEmail) {
        fireCompletion(cfg.klaviyo || {}, gatedEmail, result);
      } else if (captureHtml) {
        wireCapture(panel, cfg.klaviyo || {}, cap, result);
      }

      // "Add all to stack" — one multi-add POST, single cart-store update.
      var addAllBtn = panel.querySelector('[data-nq-add-all]');
      if (addAllBtn && addAllItems.length) {
        addAllBtn.addEventListener('click', function () {
          if (addAllBtn.disabled) return;
          addAllBtn.disabled = true;
          addAllBtn.classList.add('is-loading');
          addAllBtn.textContent = 'Adding\u2026';
          var root      = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
          var cartEl    = document.querySelector('xo-cart-mini') || document.querySelector('xo-cart');
          var sectionId = cartEl && cartEl.id ? cartEl.id : null;
          var body      = { items: addAllItems.map(function (it) { return { id: it.id, quantity: 1 }; }) };
          if (sectionId) { body.sections = [sectionId]; body.sections_url = window.location.pathname; }

          fetch(root + 'cart/add.js', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body:    JSON.stringify(body)
          }).then(function (r) {
            return r.ok ? r.json() : Promise.reject(r);
          }).then(function (data) {
            addAllBtn.classList.remove('is-loading');
            addAllBtn.textContent = 'Added \u2713';
            updateThemeCartMulti(sectionId, data, addAllItems.length);
          }).catch(function () {
            addAllBtn.classList.remove('is-loading');
            addAllBtn.textContent = 'Try again';
            addAllBtn.disabled = false;
          });
        });
      }

      // Add-to-cart via AJAX
      qsa('.nq-product-card__form', panel).forEach(function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var btn = form.querySelector('.nq-product-card__atc');
          var id  = parseInt(form.dataset.variant, 10);
          if (!id || isNaN(id)) return;
          if (btn) { btn.disabled = true; btn.textContent = 'Adding\u2026'; }
          var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';

          // The theme renders its cart drawer/badge from window.xoStore, refreshed
          // via the Section Rendering API. Request the cart section so we can update it.
          var cartEl    = document.querySelector('xo-cart-mini') || document.querySelector('xo-cart');
          var sectionId = cartEl && cartEl.id ? cartEl.id : null;
          var body      = { id: id, quantity: 1 };
          if (sectionId) { body.sections = [sectionId]; body.sections_url = window.location.pathname; }

          fetch(root + 'cart/add.js', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body:    JSON.stringify(body)
          }).then(function (r) {
            return r.ok ? r.json() : Promise.reject(r);
          }).then(function (data) {
            if (btn) { btn.textContent = 'Added \u2713'; }
            updateThemeCart(sectionId, data);
          }).catch(function (r) {
            if (btn) { btn.textContent = 'Try again'; btn.disabled = false; }
          });
        });
      });

      var retake = panel.querySelector('.nq-retake-btn');
      if (retake) retake.addEventListener('click', resetQuiz);
    }).catch(function () {
      // fetchProduct never rejects, but guard the timer against any
      // unexpected error in the render path so it can't leak.
      stopLoadingCopy();
    });
  }

  function resetQuiz() {
    currentStep = 0;
    Object.keys(answers).forEach(function (k) { delete answers[k]; });
    qsa('.nq-option').forEach(function (el) { el.classList.remove('is-selected'); });
    var panel = qs('#nqResultsPanel');
    if (panel) { panel.classList.remove('nq-results--visible'); panel.innerHTML = ''; }
    showStep(0);
  }

  // --- Email gate ---
  // Reveal the quiz steps and start the state machine at step 0.
  function unlockQuiz() {
    var quiz = qs('#nqQuiz');
    if (quiz) quiz.classList.add('nq--unlocked');
    showStep(0);
    var firstStep = qsa('.nq-step')[0];
    if (firstStep) {
      var firstOption = firstStep.querySelector('.nq-option');
      if (firstOption) { try { firstOption.focus(); } catch (e) { /* noop */ } }
    }
  }

  function setupGate() {
    var gate = qs('[data-nq-gate]');
    if (!gate) { unlockQuiz(); return; } // no gate in markup → behave as before

    var form   = gate.querySelector('[data-nq-gate-form]');
    var input  = gate.querySelector('#nqGateEmail');
    var status = gate.querySelector('[data-nq-gate-status]');

    function setStatus(msg, state) {
      if (!status) return;
      status.textContent = msg || '';
      if (state) { status.setAttribute('data-state', state); } else { status.removeAttribute('data-state'); }
    }

    if (input) {
      try { input.focus(); } catch (e) { /* noop */ }
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') {
          input.removeAttribute('aria-invalid');
          setStatus('', null);
        }
      });
    }

    if (!form) { unlockQuiz(); return; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (input && input.value ? input.value : '').trim();
      if (!EMAIL_RE.test(email)) {
        if (input) { input.setAttribute('aria-invalid', 'true'); input.focus(); }
        setStatus('Please enter a valid email address.', 'error');
        return;
      }
      if (input) input.removeAttribute('aria-invalid');
      setStatus('', null);
      gatedEmail = email;

      // Fire-and-forget Klaviyo; a valid email is the only hard requirement.
      var cfg = getConfig();
      seedGateProfile(cfg.klaviyo || {}, email);

      unlockQuiz();
    });
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
      if (e.target.closest('.nq-back-btn')) goBack();
    });

    // Gate the quiz behind an email before showing step 0.
    setupGate();
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
