(function () {
  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[+/_,.()]+/g, ' ')
      .replace(/[-–—]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function reduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initRoot(root) {
    var input = root.querySelector('[data-guide-search-input]');
    var clear = root.querySelector('[data-guide-search-clear]');
    var count = root.querySelector('[data-guide-search-count]');
    var empty = root.querySelector('[data-guide-empty]');
    var fallback = root.querySelector('[data-guide-search-fallback]');
    var rail = root.querySelector('[data-guide-rail]');
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-guide-item]'));
    var searchUrl = root.getAttribute('data-guide-search-url') || '/search';
    var noun = root.getAttribute('data-guide-noun') || 'results';
    var cat = '';

    function label(n) {
      if (n === 1) {
        if (noun === 'products') { return '1 product'; }
        if (noun === 'sections') { return '1 section'; }
        return '1 result';
      }
      return n + ' ' + noun;
    }

    function matchItem(el, q) {
      if (!q) { return true; }
      var hay = norm(el.getAttribute('data-guide-name') || el.textContent);
      var handle = norm(el.getAttribute('data-guide-handle') || '');
      var keys = norm(el.getAttribute('data-cycle-keys') || '');
      return hay.indexOf(q) !== -1 || handle === q || handle.indexOf(q) !== -1 || keys.indexOf(q) !== -1;
    }

    function matchCat(el) {
      if (el.hasAttribute('data-guide-static')) { return true; }
      if (!cat) { return true; }
      var cats = ' ' + (el.getAttribute('data-guide-cats') || '') + ' ';
      return cats.indexOf(' ' + cat + ' ') !== -1;
    }

    function apply() {
      var q = input ? norm(input.value) : '';
      var shown = 0;
      var first = null;
      for (var i = 0; i < items.length; i++) {
        var ok = matchItem(items[i], q) && matchCat(items[i]);
        items[i].hidden = !ok;
        if (ok) {
          shown += 1;
          if (!first) { first = items[i]; }
        }
      }
      if (clear) { clear.hidden = q.length === 0; }
      if (empty) { empty.hidden = shown !== 0; }
      if (fallback && input) {
        var term = input.value.trim();
        fallback.href = term ? searchUrl + '?q=' + encodeURIComponent(term) : searchUrl;
      }
      if (count) {
        count.textContent = q || cat ? label(shown) + ' shown' : label(shown);
      }
      if (rail) {
        var clr = rail.querySelector('[data-guide-rail-clear]');
        if (clr) { clr.hidden = !cat; }
        var btns = rail.querySelectorAll('[data-guide-cat]');
        for (var b = 0; b < btns.length; b++) {
          btns[b].setAttribute('aria-pressed', btns[b].getAttribute('data-guide-cat') === cat ? 'true' : 'false');
        }
      }
      var indexItems = root.querySelectorAll('[data-dg-index-item]');
      if (indexItems.length) {
        var lastLetter = '';
        for (var n = 0; n < indexItems.length; n++) {
          var handle = indexItems[n].getAttribute('data-dg-handle');
          var card = root.querySelector('[data-guide-handle="' + handle + '"]');
          var vis = card && !card.hidden;
          indexItems[n].hidden = !vis;
          if (!vis) { continue; }
          var letter = indexItems[n].getAttribute('data-dg-letter') || '';
          if (letter !== lastLetter) {
            indexItems[n].classList.add('dg-index__item--letter-start');
            lastLetter = letter;
          } else {
            indexItems[n].classList.remove('dg-index__item--letter-start');
          }
        }
        var indexRoot = root.querySelector('[data-dg-index]');
        if (indexRoot) { indexRoot.hidden = shown === 0; }
      }
      return first;
    }

    function focusEntry(el) {
      if (!el) { return; }
      el.setAttribute('tabindex', '-1');
      try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); }
    }

    function goTo(el) {
      if (!el) { return; }
      el.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
      focusEntry(el);
    }

    function resolveHash() {
      var raw = (window.location.hash || '').replace(/^#/, '');
      if (!raw) { return null; }
      var byId = document.getElementById(raw);
      if (byId) {
        var item = byId.closest('[data-guide-item]') || byId;
        return item;
      }
      if (raw.indexOf('cycle-') === 0 || raw.indexOf('dose-') === 0) {
        var token = raw.replace(/^(cycle|dose)-/, '');
        var tokenNorm = norm(token);
        var first = token.split('-')[0];
        for (var i = 0; i < items.length; i++) {
          var handle = items[i].getAttribute('data-guide-handle') || '';
          var keys = ' ' + (items[i].getAttribute('data-cycle-keys') || '') + ' ';
          var name = norm(items[i].getAttribute('data-guide-name') || '');
          if (handle === token) { return items[i]; }
          if (handle.indexOf(token + '-') === 0) { return items[i]; }
          if (token.indexOf(handle + '-') === 0 && handle) { return items[i]; }
          if (keys.indexOf(' ' + token + ' ') !== -1) { return items[i]; }
          if (first && keys.indexOf(' ' + first + ' ') !== -1) { return items[i]; }
          if (name && tokenNorm && name.indexOf(tokenNorm) !== -1) { return items[i]; }
          if (name && first && first.length > 2 && name.indexOf(norm(first)) !== -1) { return items[i]; }
        }
      }
      return null;
    }

    if (rail) {
      rail.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-guide-cat], [data-guide-rail-clear]');
        if (!btn) { return; }
        if (btn.hasAttribute('data-guide-rail-clear')) { cat = ''; }
        else { cat = btn.getAttribute('data-guide-cat') || ''; }
        apply();
      });
    }

    if (input) {
      input.addEventListener('input', function () { apply(); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { input.value = ''; apply(); }
        if (e.key === 'Enter') {
          e.preventDefault();
          var first = apply();
          goTo(first);
        }
      });
    }
    if (clear) {
      clear.addEventListener('click', function () {
        if (input) { input.value = ''; }
        apply();
        if (input) { input.focus(); }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || !input) { return; }
      if (document.activeElement === input) { return; }
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') { return; }
      e.preventDefault();
      input.focus();
    });

    root.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || !root.contains(a)) { return; }
      var id = (a.getAttribute('href') || '').slice(1);
      if (!id) { return; }
      var target = document.getElementById(id);
      if (!target || !root.contains(target)) { return; }
      e.preventDefault();
      try { history.replaceState(null, '', '#' + id); } catch (err) {}
      var item = target.closest('[data-guide-item]') || target;
      goTo(item);
    });

    apply();

    var params = new URLSearchParams(window.location.search);
    var qParam = (params.get('q') || params.get('product') || '').trim();
    if (qParam && input) {
      input.value = qParam;
      apply();
    }
    var hashed = resolveHash();
    if (hashed) {
      hashed.hidden = false;
      goTo(hashed);
    }
  }

  function initToc(scope) {
    var links = scope.querySelectorAll('[data-cg-toc-link]');
    if (!links.length || !('IntersectionObserver' in window)) { return; }
    var map = [];
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href') || '';
      if (href.charAt(0) !== '#') { continue; }
      var el = document.getElementById(href.slice(1));
      if (el) { map.push({ link: links[i], el: el }); }
    }
    if (!map.length) { return; }
    var io = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (!entries[e].isIntersecting) { continue; }
        for (var m = 0; m < map.length; m++) {
          var on = map[m].el === entries[e].target;
          map[m].link.classList.toggle('cg-toc__link--active', on);
        }
      }
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0.01 });
    for (var j = 0; j < map.length; j++) { io.observe(map[j].el); }
  }

  document.querySelectorAll('[data-guide-root]').forEach(initRoot);
  document.querySelectorAll('[data-cycling-guide]').forEach(initToc);
})();
