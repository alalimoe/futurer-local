(function () {
  if (window.__xoShipsTodayBarInit) return;
  window.__xoShipsTodayBarInit = true;

  var DEFAULT_TZ = 'Asia/Dubai';
  var DEFAULT_CUTOFF = 18;
  var DEFAULT_HIDE_WEEKDAY = 0;
  var WEEKDAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function dubaiParts(date, timeZone) {
    var dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone,
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    });
    var map = {};
    var parts = dtf.formatToParts(date);
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].type !== 'literal') map[parts[i].type] = parts[i].value;
    }
    var hour = map.hour === '24' ? 0 : parseInt(map.hour, 10);
    return {
      weekday: WEEKDAY_MAP[map.weekday],
      hour: hour,
      minute: parseInt(map.minute, 10),
      second: parseInt(map.second, 10)
    };
  }

  function remainingMs(parts, cutoffHour) {
    var nowSecs = parts.hour * 3600 + parts.minute * 60 + parts.second;
    var cutSecs = cutoffHour * 3600;
    return (cutSecs - nowSecs) * 1000;
  }

  function pluralize(count, singular, plural) {
    return count + '\u00A0' + (count === 1 ? singular : plural);
  }

  function formatTime(ms, withSeconds) {
    if (ms <= 0) {
      return withSeconds
        ? '0\u00A0hours 0\u00A0minutes 0\u00A0seconds'
        : '0\u00A0hours 0\u00A0minutes';
    }
    var totalSec = Math.floor(ms / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    var parts = [pluralize(h, 'hour', 'hours'), pluralize(m, 'minute', 'minutes')];
    if (withSeconds) parts.push(pluralize(s, 'second', 'seconds'));
    return parts.join(' ');
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function setVisible(el, visible) {
    if (!el) return;
    if (visible) {
      el.classList.add('is-visible');
      el.removeAttribute('hidden');
    } else {
      el.classList.remove('is-visible');
      el.setAttribute('hidden', '');
    }
  }

  function ensureLabel(root, template) {
    var label = root.querySelector('[data-ships-today-label]');
    if (!label) return;
    if (label.getAttribute('data-ready') === 'true' && label.getAttribute('data-template') === template) return;
    label.textContent = '';
    var idx = template.indexOf('__TIME__');
    if (idx === -1) {
      label.textContent = template;
    } else {
      label.appendChild(document.createTextNode(template.slice(0, idx)));
      var span = document.createElement('span');
      span.className = 'xo-ships-today__timer';
      span.setAttribute('data-ships-today-timer', '');
      label.appendChild(span);
      label.appendChild(document.createTextNode(template.slice(idx + 8)));
    }
    label.setAttribute('data-template', template);
    label.setAttribute('data-ready', 'true');
  }

  function decodeHtmlEntities(str) {
    if (!str || str.indexOf('&') === -1) return str;
    var textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  }

  function getTopTemplates(root) {
    var fallbackDefault = 'Ships today if you checkout in the next __TIME__';
    var fallbackUrgent = 'Last call for today’s dispatch: __TIME__';
    var script = root.closest('.shopify-section') && root.closest('.shopify-section').querySelector('[data-ships-today-templates]');
    if (!script) {
      return {
        defaultTemplate: decodeHtmlEntities(root.getAttribute('data-template') || fallbackDefault),
        urgentTemplate: decodeHtmlEntities(root.getAttribute('data-template-urgent') || fallbackUrgent)
      };
    }
    try {
      var parsed = JSON.parse(script.textContent);
      return {
        defaultTemplate: decodeHtmlEntities(parsed.default || fallbackDefault),
        urgentTemplate: decodeHtmlEntities(parsed.urgent || fallbackUrgent)
      };
    } catch (e) {
      return {
        defaultTemplate: fallbackDefault,
        urgentTemplate: fallbackUrgent
      };
    }
  }

  function tickRoot(root) {
    var tz = root.getAttribute('data-tz') || DEFAULT_TZ;
    var cutoff = parseInt(root.getAttribute('data-cutoff-hour') || String(DEFAULT_CUTOFF), 10);
    var hideWeekday = parseInt(root.getAttribute('data-hide-weekday') || String(DEFAULT_HIDE_WEEKDAY), 10);
    var context = root.getAttribute('data-context') || 'product';
    var bar = root.querySelector('[data-ships-today-bar]');
    var stock = root.querySelector('[data-ships-today-stock]');

    var parts = dubaiParts(new Date(), tz);
    var remaining = remainingMs(parts, cutoff);
    var showBar = parts.weekday !== hideWeekday && remaining > 0;
    var isUrgent = remaining > 0 && remaining < 3600000;

    if (context === 'top') {
      var topTemplates = getTopTemplates(root);
      var template = isUrgent ? topTemplates.urgentTemplate : topTemplates.defaultTemplate;
      ensureLabel(root, template);
      setVisible(root, showBar);
      if (!showBar) {
        root.classList.remove('is-urgent');
        return;
      }
      var windowMs = cutoff * 3600 * 1000;
      var pct = Math.max(0, Math.min(100, (remaining / windowMs) * 100));
      root.style.setProperty('--ships-progress', pct + '%');
      root.classList.toggle('is-urgent', isUrgent);
      var topTimer = root.querySelector('[data-ships-today-timer]');
      if (topTimer) topTimer.textContent = formatTime(remaining, false);
      return;
    }

    var templateDefault = root.getAttribute('data-template') || 'Order in __TIME__ for ships today';
    ensureLabel(root, templateDefault);

    setVisible(bar, showBar);
    if (stock) setVisible(stock, !showBar);

    if (!showBar) return;

    var timer = root.querySelector('[data-ships-today-timer]');
    if (timer) timer.textContent = formatTime(remaining, context === 'cart');
  }

  function init() {
    var roots = document.querySelectorAll('[data-ships-today]');
    if (!roots.length) return;

    for (var i = 0; i < roots.length; i++) {
      tickRoot(roots[i]);
    }

    var interval = prefersReducedMotion() ? 60000 : 1000;
    setInterval(function () {
      for (var j = 0; j < roots.length; j++) {
        tickRoot(roots[j]);
      }
    }, interval);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
