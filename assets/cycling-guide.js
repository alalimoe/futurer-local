(function () {
  if (window.__cgGuideInit) return;
  window.__cgGuideInit = true;

  var root = document.querySelector('[data-cycling-guide]');
  if (!root) return;

  var links = root.querySelectorAll('[data-cg-toc-link]');
  if (!links.length) return;

  var sections = [];
  links.forEach(function (link) {
    var id = link.getAttribute('href');
    if (!id || id.charAt(0) !== '#') return;
    var target = document.getElementById(id.slice(1));
    if (target) sections.push({ link: link, target: target });
  });

  if (!sections.length) return;

  function setActive(activeLink) {
    links.forEach(function (link) {
      var isActive = link === activeLink;
      link.classList.toggle('cg-toc__link--active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function onScroll() {
    var scrollY = window.scrollY + 100;
    var current = sections[0];
    sections.forEach(function (entry) {
      if (entry.target.offsetTop <= scrollY) current = entry;
    });
    if (current) setActive(current.link);
  }

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      setActive(link);
    });
  });

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
