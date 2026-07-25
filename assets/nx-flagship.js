(function () {
  'use strict';

  function initNavSpy() {
    var nav = document.querySelector('[data-nx-flagship-nav]');
    if (!nav) return;

    var links = nav.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, el: el, link: link });
    });
    if (!sections.length) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setActive(id) {
      links.forEach(function (link) {
        var active = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) setActive(entry.target.id);
          });
        },
        { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
      );
      sections.forEach(function (s) { observer.observe(s.el); });
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        setActive(id);
      });
    });
  }

  function initStickyCta() {
    var bar = document.querySelector('[data-nx-flagship-sticky]');
    var hero = document.querySelector('[data-nx-flagship-hero]');
    if (!bar || !hero) return;

    var showAt = 0;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function updateThreshold() {
      showAt = hero.offsetTop + hero.offsetHeight * 0.55;
    }

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      bar.classList.toggle('is-visible', y > showAt);
    }

    updateThreshold();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      updateThreshold();
      onScroll();
    }, { passive: true });

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-nx-sticky-atc]');
      if (!btn) return;
      var mainAtc = document.querySelector('[data-nx-flagship-main-atc]');
      if (mainAtc) {
        e.preventDefault();
        mainAtc.click();
      }
    });

    if (reduced) bar.style.transition = 'none';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initNavSpy();
      initStickyCta();
    });
  } else {
    initNavSpy();
    initStickyCta();
  }
})();
