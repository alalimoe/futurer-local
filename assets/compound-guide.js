(() => {
  const GLOBAL_KEY = '__nootropixCompoundGuide';
  const existing = window[GLOBAL_KEY];

  if (existing && typeof existing.init === 'function') {
    existing.init(document);
    return;
  }

  const FORMAT_PARAM = 'fmt';
  const controllers = new Map();
  const stickyBars = new Set();
  let overlayObserver = null;
  let overlayFrame = 0;

  const queryParams = () => {
    const query = new URLSearchParams(window.location.search);
    if (query.has('format') && !query.has(FORMAT_PARAM)) {
      query.set(FORMAT_PARAM, query.get('format'));
    }
    query.delete('format');
    return query;
  };

  const replaceQuery = (next) => {
    const url = new URL(window.location.href);
    url.search = next.toString();
    window.history.replaceState({}, '', url);
  };

  const elementsWithin = (scope, selector) => {
    const elements = [];
    if (scope instanceof Element && scope.matches(selector)) elements.push(scope);
    if (scope && typeof scope.querySelectorAll === 'function') {
      elements.push(...scope.querySelectorAll(selector));
    }
    return elements;
  };

  const addListener = (target, type, listener, options) => {
    target.addEventListener(type, listener, options);
    return () => target.removeEventListener(type, listener, options);
  };

  const updatePersistentLinks = (scope = document) => {
    const query = queryParams();
    elementsWithin(scope, '[data-cg-keep-filters]').forEach((link) => {
      try {
        const url = new URL(link.href, window.location.origin);
        url.searchParams.delete('form');
        url.searchParams.delete(FORMAT_PARAM);
        if (query.get('form')) url.searchParams.set('form', query.get('form'));
        if (query.get(FORMAT_PARAM)) url.searchParams.set(FORMAT_PARAM, query.get(FORMAT_PARAM));
        link.href = `${url.pathname}${url.search}${url.hash}`;
      } catch (error) {
        return;
      }
    });
  };

  const syncNavMetrics = (nav) => {
    if (!nav.isConnected) return;
    const header = document.querySelector('.section-header');
    const top = header ? Math.max(0, Math.round(header.getBoundingClientRect().top)) : 0;
    const height = Math.round(nav.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--cg-nav-top', `${top}px`);
    document.documentElement.style.setProperty('--cg-nav-height', `${height}px`);
  };

  const setupNav = (nav) => {
    const cleanups = [];
    const links = [...nav.querySelectorAll('[data-cg-nav-link]')];
    const sections = links
      .map((link) => {
        const href = link.getAttribute('href') || '';
        return href.startsWith('#') ? document.getElementById(href.slice(1)) : null;
      })
      .filter(Boolean);

    const setActive = (id) => {
      links.forEach((link) => {
        const active = Boolean(id) && link.getAttribute('href') === `#${id}`;
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    const sync = () => {
      syncNavMetrics(nav);
      if (window.scrollY < 80) setActive('');
    };

    sync();
    cleanups.push(addListener(window, 'resize', sync, { passive: true }));
    cleanups.push(addListener(window, 'scroll', sync, { passive: true }));

    if ('IntersectionObserver' in window && sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (window.scrollY < 80) {
            setActive('');
            return;
          }
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) setActive(visible.target.id);
        },
        { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] }
      );
      sections.forEach((section) => observer.observe(section));
      cleanups.push(() => observer.disconnect());
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  };

  const applyFilters = (root) => {
    const query = queryParams();
    const form = query.get('form') || 'all';
    const format = query.get(FORMAT_PARAM) || 'all';
    const cards = [...root.querySelectorAll('[data-cg-card]')];
    let visible = 0;

    cards.forEach((card) => {
      const cardForm = card.getAttribute('data-form') || '';
      const cardFormat = card.getAttribute('data-format') || '';
      const formMatch = form === 'all' || cardForm === form || cardForm === 'mixed';
      const formatMatch = format === 'all' || cardFormat === format;
      const show = formMatch && formatMatch;
      card.hidden = !show;
      const item = card.closest('li');
      if (item) item.hidden = !show;
      if (show) visible += 1;
    });

    const grid = root.querySelector('[data-cg-grid]');
    if (grid) grid.setAttribute('data-count', String(visible));

    const count = root.querySelector('[data-cg-count]');
    if (count) {
      const template = visible === 1 ? count.dataset.one : count.dataset.other;
      count.textContent = (template || '__N__').replace(/__N__/g, String(visible));
    }

    const empty = root.querySelector('[data-cg-empty]');
    if (empty) empty.hidden = visible !== 0;

    root.querySelectorAll('[data-filter-form]').forEach((chip) => {
      chip.setAttribute('aria-pressed', chip.getAttribute('data-filter-form') === form ? 'true' : 'false');
    });
    root.querySelectorAll('[data-filter-format]').forEach((chip) => {
      chip.setAttribute('aria-pressed', chip.getAttribute('data-filter-format') === format ? 'true' : 'false');
    });
  };

  const setupFilters = (root) => {
    const onClick = (event) => {
      const chip = event.target.closest('[data-filter-form], [data-filter-format], [data-filter-reset]');
      if (!chip || !root.contains(chip)) return;

      const query = queryParams();
      if (chip.hasAttribute('data-filter-reset')) {
        query.delete('form');
        query.delete(FORMAT_PARAM);
      } else if (chip.hasAttribute('data-filter-form')) {
        const value = chip.getAttribute('data-filter-form');
        if (value === 'all') query.delete('form');
        else query.set('form', value);
      } else {
        const value = chip.getAttribute('data-filter-format');
        if (value === 'all') query.delete(FORMAT_PARAM);
        else query.set(FORMAT_PARAM, value);
      }

      replaceQuery(query);
      document.querySelectorAll('[data-cg-range]').forEach((range) => applyFilters(range));
      updatePersistentLinks();
    };

    const onPopState = () => {
      applyFilters(root);
      updatePersistentLinks();
    };

    applyFilters(root);
    root.addEventListener('click', onClick);
    window.addEventListener('popstate', onPopState);

    return () => {
      root.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPopState);
    };
  };

  const setupCompareLinks = (root) => {
    const onClick = (event) => {
      const link = event.target.closest('[data-cg-set-form], [data-cg-set-format]');
      if (!link || !root.contains(link)) return;

      event.preventDefault();
      const query = queryParams();
      if (link.hasAttribute('data-cg-set-form')) {
        const value = link.getAttribute('data-cg-set-form');
        if (value) query.set('form', value);
      }
      if (link.hasAttribute('data-cg-set-format')) {
        const value = link.getAttribute('data-cg-set-format');
        if (value) query.set(FORMAT_PARAM, value);
      }

      replaceQuery(query);
      document.querySelectorAll('[data-cg-range]').forEach((range) => applyFilters(range));
      updatePersistentLinks();

      const target = document.getElementById('compound-products');
      if (target) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    };

    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  };

  const setupQuality = (root) => {
    const product = root.querySelector('[data-cg-doc-product]');
    const batch = root.querySelector('[data-cg-doc-batch]');
    const docs = [...root.querySelectorAll('[data-cg-doc]')];
    const empty = root.querySelector('[data-cg-doc-empty]');

    const sync = () => {
      const productValue = product ? product.value : '';
      const batchValue = batch ? batch.value : '';
      let shown = false;

      docs.forEach((doc) => {
        const productMatches = !productValue || doc.getAttribute('data-product') === productValue;
        const batchMatches = !batchValue || doc.getAttribute('data-batch') === batchValue;
        const active = productMatches && batchMatches;
        doc.classList.toggle('is-active', active);
        doc.hidden = !active;
        if (active) shown = true;
      });
      if (empty) empty.hidden = shown;
    };

    const cleanups = [];
    if (product) cleanups.push(addListener(product, 'change', sync));
    if (batch) cleanups.push(addListener(batch, 'change', sync));
    sync();

    return () => cleanups.forEach((cleanup) => cleanup());
  };

  const setupDelivery = (root) => {
    const buttons = [...root.querySelectorAll('[data-cg-destination]')];
    const panels = [...root.querySelectorAll('[data-cg-destination-panel]')];
    const cleanups = [];

    const show = (id, focus = false) => {
      buttons.forEach((button) => {
        const active = button.getAttribute('data-cg-destination') === id;
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
        if (active && focus) button.focus();
      });
      panels.forEach((panel) => {
        const active = panel.getAttribute('data-cg-destination-panel') === id;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
    };

    buttons.forEach((button, index) => {
      cleanups.push(addListener(button, 'click', () => show(button.getAttribute('data-cg-destination'))));
      cleanups.push(addListener(button, 'keydown', (event) => {
        let nextIndex = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = buttons.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        const next = buttons[nextIndex];
        show(next.getAttribute('data-cg-destination'), true);
      }));
    });

    const selected = buttons.find((button) => button.getAttribute('aria-pressed') === 'true') || buttons[0];
    if (selected) show(selected.getAttribute('data-cg-destination'));

    return () => cleanups.forEach((cleanup) => cleanup());
  };

  const setupFaq = (root) => {
    const chips = [...root.querySelectorAll('[data-cg-faq-chip]')];
    const cleanups = [];
    const groups = chips
      .map((chip) => {
        const href = chip.getAttribute('href') || '';
        return href.startsWith('#') ? document.getElementById(href.slice(1)) : null;
      })
      .filter(Boolean);

    const setActive = (id) => {
      chips.forEach((chip) => {
        if (chip.getAttribute('href') === `#${id}`) chip.setAttribute('aria-current', 'true');
        else chip.removeAttribute('aria-current');
      });
    };

    chips.forEach((chip) => {
      cleanups.push(addListener(chip, 'click', () => {
        const href = chip.getAttribute('href') || '';
        if (href.startsWith('#')) setActive(href.slice(1));
      }));
    });

    if ('IntersectionObserver' in window && groups.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.find((entry) => entry.isIntersecting);
          if (visible) setActive(visible.target.id);
        },
        { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
      );
      groups.forEach((group) => observer.observe(group));
      cleanups.push(() => observer.disconnect());
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  };

  const overlayIsOpen = () => {
    const selector = [
      'dialog[open]',
      '[aria-modal="true"]:not([hidden])',
      'xo-drawer[open]',
      '.cart-drawer.is-open',
      '.drawer.is-open'
    ].join(',');

    return [...document.querySelectorAll(selector)].some((overlay) => {
      if (!overlay.isConnected || overlay.closest('[data-sticky-cta]')) return false;
      if (overlay.hidden || overlay.getAttribute('aria-hidden') === 'true') return false;
      return true;
    });
  };

  const syncOverlayState = () => {
    overlayFrame = 0;
    const open = overlayIsOpen();
    stickyBars.forEach((bar) => {
      if (!bar.isConnected) {
        stickyBars.delete(bar);
        return;
      }
      if (open) bar.setAttribute('data-overlay-hidden', 'true');
      else bar.removeAttribute('data-overlay-hidden');
    });
  };

  const requestOverlaySync = () => {
    if (overlayFrame) return;
    overlayFrame = window.requestAnimationFrame(syncOverlayState);
  };

  const startOverlayObserver = () => {
    if (overlayObserver || !document.body) return;
    overlayObserver = new MutationObserver(requestOverlaySync);
    overlayObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['open', 'hidden', 'aria-hidden', 'aria-modal', 'class'],
      childList: true,
      subtree: true
    });
    document.addEventListener('click', requestOverlaySync);
    document.addEventListener('toggle', requestOverlaySync, true);
  };

  const stopOverlayObserver = () => {
    if (stickyBars.size || !overlayObserver) return;
    overlayObserver.disconnect();
    overlayObserver = null;
    document.removeEventListener('click', requestOverlaySync);
    document.removeEventListener('toggle', requestOverlaySync, true);
    if (overlayFrame) window.cancelAnimationFrame(overlayFrame);
    overlayFrame = 0;
  };

  const setupStickyOverlay = (bar) => {
    stickyBars.add(bar);
    startOverlayObserver();
    requestOverlaySync();

    return () => {
      stickyBars.delete(bar);
      bar.removeAttribute('data-overlay-hidden');
      stopOverlayObserver();
    };
  };

  const register = (scope, selector, setup) => {
    elementsWithin(scope, selector).forEach((element) => {
      if (controllers.has(element)) return;
      const cleanup = setup(element);
      controllers.set(element, typeof cleanup === 'function' ? cleanup : () => {});
    });
  };

  const prune = () => {
    controllers.forEach((cleanup, element) => {
      if (element.isConnected) return;
      cleanup();
      controllers.delete(element);
    });
  };

  const init = (scope = document) => {
    prune();
    register(scope, '[data-cg-nav]', setupNav);
    register(scope, '[data-cg-range]', setupFilters);
    register(scope, '.cg-forms', setupCompareLinks);
    register(scope, '[data-cg-quality]', setupQuality);
    register(scope, '[data-cg-delivery]', setupDelivery);
    register(scope, '[data-cg-faq]', setupFaq);
    register(scope, '[data-sticky-cta]', setupStickyOverlay);
    updatePersistentLinks(scope);
  };

  const cleanupWithin = (scope) => {
    controllers.forEach((cleanup, element) => {
      if (element === scope || (scope instanceof Element && scope.contains(element))) {
        cleanup();
        controllers.delete(element);
      }
    });
    requestOverlaySync();
  };

  window[GLOBAL_KEY] = { init, cleanupWithin };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(document), { once: true });
  } else {
    init(document);
  }

  document.addEventListener('shopify:section:load', (event) => init(event.target));
  document.addEventListener('shopify:section:unload', (event) => cleanupWithin(event.target));
})();
