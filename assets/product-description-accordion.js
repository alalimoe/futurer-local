(() => {
  const SOLO_MS = 360;
  const SWITCH_MS = 180;

  class NpxDescAccordion extends HTMLElement {
    connectedCallback() {
      if (this._bound) return;

      this._bound = true;
      this._gen = 0;
      this._timers = new Set();
      this._target = this.querySelector('details[open]') || null;
      this._onClick = (event) => this._onActivate(event);
      this._onMotion = (event) => {
        this._reduced = event.matches;
      };
      this._motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this._reduced = this._motion.matches;

      if (this._motion.addEventListener) {
        this._motion.addEventListener('change', this._onMotion);
      } else if (this._motion.addListener) {
        this._motion.addListener(this._onMotion);
      }

      this.addEventListener('click', this._onClick);

      // #region agent log
      const panel = this.querySelector('.nx01-ing-panel');
      const serving = this.querySelector('.nx01-ing-table__serving');
      const styleOf = (el) => {
        if (!el) return null;
        const s = getComputedStyle(el);
        return { display: s.display, border: s.border, padding: s.padding, flexDirection: s.flexDirection, width: s.width };
      };
      const hrefs = [...document.styleSheets].map((sheet) => sheet.href).filter(Boolean);
      const hasAsset = hrefs.some((href) => href.includes('nx01-ingredients-table.css'));
      let hasNx01IngRules = false;
      try {
        hasNx01IngRules = [...document.styleSheets].some((sheet) => {
          try {
            return [...sheet.cssRules].some((rule) => String(rule.selectorText || '').includes('nx01-ing-panel'));
          } catch (err) {
            return false;
          }
        });
      } catch (err) {}
      fetch('http://127.0.0.1:7906/ingest/73d01807-f919-4550-a2d5-12c9f0435bd9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'70de97'},body:JSON.stringify({sessionId:'70de97',runId:'post-fix',hypothesisId:'H1',location:'product-description-accordion.js:connectedCallback',message:'nx01 table css after asset move',data:{hasAsset,hasNx01IngRules,hasPanel:!!panel,panel:styleOf(panel),serving:styleOf(serving),hrefs:hrefs.filter((h)=>/nx01-ingredients-table|compiled_assets/.test(h))},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }

    disconnectedCallback() {
      if (!this._bound) return;

      this.removeEventListener('click', this._onClick);

      if (this._motion) {
        if (this._motion.removeEventListener) {
          this._motion.removeEventListener('change', this._onMotion);
        } else if (this._motion.removeListener) {
          this._motion.removeListener(this._onMotion);
        }
      }

      this._clearTimers();
      this._gen += 1;
      this._bound = false;

      this.querySelectorAll('.npx-desc-acc__panel').forEach((panel) => {
        panel.style.height = '';
        panel.style.transitionDuration = '';
      });
    }

    _clearTimers() {
      this._timers.forEach((id) => window.clearTimeout(id));
      this._timers.clear();
    }

    _panel(details) {
      return details.querySelector(':scope > .npx-desc-acc__panel');
    }

    _renderedHeight(panel) {
      return panel.getBoundingClientRect().height;
    }

    _onActivate(event) {
      const summary = event.target.closest('summary');
      if (!summary || !this.contains(summary)) return;

      const details = summary.parentElement;
      if (!(details instanceof HTMLDetailsElement) || !this.contains(details)) return;

      event.preventDefault();
      this._target = details.open && this._target === details ? null : details;
      this._run();
    }

    _run() {
      const gen = ++this._gen;
      const target = this._target;
      const items = Array.from(this.querySelectorAll('details'));
      const switching = Boolean(
        target &&
          items.some((item) => item !== target && (item.open || this._hasInlineHeight(item)))
      );
      const duration = switching ? SWITCH_MS : SOLO_MS;

      items.forEach((item) => {
        this._setOpen(item, item === target, gen, duration);
      });
    }

    _hasInlineHeight(details) {
      const panel = this._panel(details);
      return Boolean(panel && panel.style.height);
    }

    _setOpen(details, shouldOpen, gen, duration) {
      const panel = this._panel(details);
      if (!panel) {
        details.open = shouldOpen;
        return;
      }

      if (this._reduced) {
        details.open = shouldOpen;
        panel.style.height = '';
        panel.style.transitionDuration = '';
        return;
      }

      if (!shouldOpen && !details.open && !this._hasInlineHeight(details)) {
        panel.style.height = '';
        panel.style.transitionDuration = '';
        return;
      }

      const from = this._renderedHeight(panel);

      if (shouldOpen) {
        details.open = true;
        this._animateHeight(panel, from, panel.scrollHeight, duration, gen).then((ok) => {
          if (!ok || this._target !== details) return;
          panel.style.height = 'auto';
          panel.style.transitionDuration = '';
        });
        return;
      }

      this._animateHeight(panel, from, 0, duration, gen).then((ok) => {
        if (!ok || this._target === details) return;
        details.open = false;
        panel.style.height = '';
        panel.style.transitionDuration = '';
      });
    }

    _animateHeight(panel, from, to, duration, gen) {
      const start = Math.max(0, from);
      const end = Math.max(0, to);

      if (Math.abs(start - end) < 0.5) {
        panel.style.height = end === 0 ? '0px' : `${end}px`;
        return Promise.resolve(this._stillCurrent(gen));
      }

      panel.style.transitionDuration = `${duration}ms`;
      panel.style.height = `${start}px`;
      panel.getBoundingClientRect();
      panel.style.height = `${end}px`;

      return new Promise((resolve) => {
        let settled = false;

        const finish = () => {
          if (settled) return;
          settled = true;
          panel.removeEventListener('transitionend', onEnd);
          if (timerId) {
            window.clearTimeout(timerId);
            this._timers.delete(timerId);
          }
          resolve(this._stillCurrent(gen));
        };

        const onEnd = (event) => {
          if (event.target !== panel) return;
          if (event.propertyName !== 'height') return;
          finish();
        };

        panel.addEventListener('transitionend', onEnd);
        const timerId = window.setTimeout(finish, duration + 50);
        this._timers.add(timerId);
      });
    }

    _stillCurrent(gen) {
      return gen === this._gen && this.isConnected;
    }
  }

  if (!customElements.get('npx-desc-accordion')) {
    customElements.define('npx-desc-accordion', NpxDescAccordion);
  }
})();
