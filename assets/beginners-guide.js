// Beginner's Guide JS — TOC, progress, reading modes
(function(){
  const main = document.getElementById('guideMain');
  if(!main) return;

  // Progress bar
  const bar = document.getElementById('guideProgressBar');
  const onScroll = () => {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const pct = Math.max(0, Math.min(1, scrollTop / (docHeight || 1)));
    if(bar){ bar.style.width = (pct * 100).toFixed(2) + '%'; }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Build TOC from sections with data-toc
  const tocNav = document.getElementById('guideTOCNav');
  const sections = Array.from(document.querySelectorAll('.guide-section[id]'));
  if(tocNav && sections.length){
    sections.forEach(sec => {
      const h = sec.querySelector('h2') || sec.querySelector('h1');
      if(!h) return;
      const a = document.createElement('a');
      a.href = `#${sec.id}`;
      a.textContent = h.textContent;
      tocNav.appendChild(a);
    });

    const links = Array.from(tocNav.querySelectorAll('a'));
    const spy = () => {
      let current = sections[0]?.id;
      const fromTop = window.scrollY + 120;
      sections.forEach(sec => {
        if(sec.offsetTop <= fromTop){ current = sec.id; }
      });
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }

  // Reading mode toggles
  document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.remove('mode-adhd','mode-listen');
      const mode = btn.getAttribute('data-mode');
      if(mode === 'adhd'){ document.body.classList.add('mode-adhd'); }
      if(mode === 'listen'){
        document.body.classList.add('mode-listen');
        // Placeholder: integrate TTS later
        alert('Listen mode placeholder — wire up TTS later.');
      }
    });
  });

  // Simplify reading toggle
  const simplify = document.getElementById('simplifyToggle');
  if(simplify){
    simplify.addEventListener('change', (e)=>{
      document.body.classList.toggle('mode-adhd', e.target.checked);
    });
  }
})();