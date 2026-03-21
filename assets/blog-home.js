/* Lightweight UX helpers: save-for-later + chip scroll memory */
(function(){
  // Save for later (localStorage)
  const KEY = 'np_saved_articles';
  const load = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const save = (ids) => localStorage.setItem(KEY, JSON.stringify(ids));

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-save-article]');
    if(!btn) return;
    const id = btn.getAttribute('data-save-article');
    const saved = new Set(load());
    if(saved.has(id)){ saved.delete(id); btn.setAttribute('aria-pressed','false'); btn.textContent='Save for later'; }
    else { saved.add(id); btn.setAttribute('aria-pressed','true'); btn.textContent='Saved'; }
    save([...saved]);
  }, {passive:false});
})();
