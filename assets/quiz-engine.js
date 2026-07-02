// ============================================================
// quiz-engine.js  —  Nootropix stack quiz result logic
// Pool = 20 reliably-stocked SKUs (user-defined 2026-06-22).
// Handles verified against live Shopify catalog.
// To maintain: edit POOL only. No per-combo hardcoding.
// ============================================================
//
// AXES (match your quiz steps):
//   goal:       focus | mood | energy | memory | sleep
//   experience: beginner | some | intermediate | advanced
//   context:    student | professional | athletic | wellness
//   preference: stimfree | natural | synthetic | nondependency
//   size:       simple | medium | full
//
// role: "anchor" = can lead a stack on its own
//       "support" = pairs with an anchor (choline, minerals, etc.)
// tier: 1 = beginner-safe, 2 = intermediate, 3 = advanced-only
//
// Loading: Shopify theme assets are plain scripts, not ES modules, so this is
// wrapped in an IIFE and exposes window.NootropixQuizEngine instead of using
// `export`. It also sets module.exports when present so the engine stays
// unit-testable in Node.
// ------------------------------------------------------------

(function () {
  'use strict';

  const POOL = [
    // --- FOCUS / ENERGY (synthetic, higher tier) ---
    { handle: "fladrafinil-20mg-capsules", name: "Fladrafinil 20mg",
      goals: ["focus","energy"], prefs: ["synthetic"],
      experience: ["beginner","some","intermediate","advanced"], contexts: ["student","professional"],
      role: "anchor", tier: 3 },

    { handle: "phenylpiracetam-hydrazide-150mg-capsules", name: "Phenylpiracetam Hydrazide 150mg",
      goals: ["energy","focus"], prefs: ["synthetic"],
      experience: ["advanced"], contexts: ["athletic","professional"],
      role: "anchor", tier: 3 },

    { handle: "aniracetam-500mg-capsules", name: "Aniracetam 500mg",
      goals: ["focus","mood","memory"], prefs: ["synthetic"],
      experience: ["some","intermediate","advanced"], contexts: ["student","professional"],
      role: "anchor", tier: 2 },

    { handle: "noopept-20mg-capsules", name: "Noopept 20mg",
      goals: ["focus","memory"], prefs: ["synthetic"],
      experience: ["beginner","some","intermediate","advanced"], contexts: ["student","professional"],
      role: "anchor", tier: 3 },

    { handle: "fasoracetam-20mg-capsules", name: "Fasoracetam 20mg",
      goals: ["mood","focus"], prefs: ["synthetic"],
      experience: ["intermediate","advanced"], contexts: ["professional","student"],
      role: "anchor", tier: 3 },

    // --- CHOLINE SUPPORTS (pair with racetams) ---
    { handle: "cdp-choline-250mg-capsules", name: "CDP-Choline 250mg",
      goals: ["focus","memory","energy"], prefs: ["synthetic","nondependency"],
      experience: ["some","intermediate","advanced"], contexts: ["student","professional","athletic"],
      role: "support", tier: 2, choline: true },

    { handle: "alpha-gpc-250mg-capsules", name: "Alpha-GPC 250mg",
      goals: ["focus","memory"], prefs: ["synthetic","nondependency"],
      experience: ["some","intermediate","advanced"], contexts: ["student","professional","athletic"],
      role: "support", tier: 2, choline: true },

    // --- MOOD / CALM / SLEEP (Phenibut + naturals) ---
    { handle: "phenibut-hcl-powder", name: "Phenibut HCL Powder",
      goals: ["mood","sleep"], prefs: ["synthetic"],
      experience: ["beginner","some","intermediate","advanced"], contexts: ["professional","wellness"],
      role: "anchor", tier: 3 },

    { handle: "phenibut-faa-300mg-capsules", name: "Phenibut FAA 300mg",
      goals: ["mood","sleep"], prefs: ["synthetic"],
      experience: ["beginner","some","intermediate","advanced"], contexts: ["professional","wellness"],
      role: "anchor", tier: 3 },

    { handle: "ashwagandha-ksm-66-300mg-capsules", name: "Ashwagandha KSM-66 300mg",
      goals: ["mood","sleep"], prefs: ["stimfree","natural","nondependency"],
      experience: ["beginner","some","intermediate"], contexts: ["professional","athletic","wellness"],
      role: "anchor", tier: 1 },

    { handle: "tongkat-ali-200mg-capsules", name: "Tongkat Ali 200mg",
      goals: ["energy","mood"], prefs: ["stimfree","natural","nondependency"],
      experience: ["some","intermediate"], contexts: ["athletic","wellness"],
      role: "anchor", tier: 1 },

    { handle: "gaba-500mg-capsules", name: "GABA 500mg",
      goals: ["sleep","mood"], prefs: ["stimfree","nondependency"],
      experience: ["beginner","some"], contexts: ["wellness","professional"],
      role: "support", tier: 1 },

    // --- MEMORY (natural) ---
    { handle: "bacopa-monnieri-300mg-capsules", name: "Bacopa Monnieri 300mg",
      goals: ["memory"], prefs: ["stimfree","natural","nondependency"],
      experience: ["beginner","some","intermediate"], contexts: ["student","wellness"],
      role: "support", tier: 1 },

    // --- FOCUS / CALM (beginner-safe naturals + amino) ---
    { handle: "l-theanine-200mg-capsules", name: "L-Theanine 200mg",
      goals: ["focus","sleep"], prefs: ["stimfree","natural","nondependency"],
      experience: ["beginner","some"], contexts: ["student","professional","wellness"],
      role: "anchor", tier: 1 },

    { handle: "caffeine-l-theanine-capsules", name: "Caffeine + L-Theanine",
      goals: ["energy","focus"], prefs: ["natural"],
      experience: ["beginner","some"], contexts: ["student","professional","athletic"],
      role: "anchor", tier: 1 },

    { handle: "n-acetyl-l-tyrosine-350mg-capsules", name: "N-Acetyl L-Tyrosine 350mg",
      goals: ["focus","mood","energy"], prefs: ["stimfree","natural","nondependency"],
      experience: ["beginner","some","intermediate"], contexts: ["professional","athletic","student"],
      role: "support", tier: 1 },

    { handle: "agmatine-sulfate-250mg-capsules", name: "Agmatine Sulfate 250mg",
      goals: ["mood","energy"], prefs: ["synthetic","nondependency"],
      experience: ["intermediate","advanced"], contexts: ["athletic","wellness"],
      role: "support", tier: 2 },

    // --- SLEEP / FOUNDATION (beginner-safe) ---
    { handle: "magnesium-400mg-capsules", name: "Magnesium 400mg",
      goals: ["sleep"], prefs: ["stimfree","natural","nondependency"],
      experience: ["beginner","some","intermediate","advanced"], contexts: ["wellness","athletic","professional","student"],
      role: "support", tier: 1 },

    { handle: "melatonin-300mcg-capsules", name: "Melatonin 300mcg",
      goals: ["sleep"], prefs: ["stimfree","nondependency"],
      experience: ["beginner","some"], contexts: ["wellness","professional"],
      role: "anchor", tier: 1 },

    { handle: "vitamin-d3-k2-tablets", name: "Vitamin D3 + K2",
      goals: ["energy","mood"], prefs: ["stimfree","natural","nondependency"],
      experience: ["beginner","some","intermediate","advanced"], contexts: ["wellness","professional","athletic","student"],
      role: "support", tier: 1 }
  ];

  // SIZE -> how many products to return
  const SIZE_COUNT = { simple: 1, medium: 3, full: 5 };

  // EXPERIENCE -> highest tier allowed.
  // All compounds eligible at every level (adult beginners; dosing guides + emails
  // cover Phenibut/Fladrafinil/Noopept caution). Experience only NUDGES ranking
  // via the experienceFit weight below, it does not hard-block anything.
  const EXPERIENCE_MAX_TIER = { beginner: 3, some: 3, intermediate: 3, advanced: 3 };

  // SCORING WEIGHTS
  const W = { goal: 5, pref: 3, context: 1, experienceFit: 2 };

  const GOAL_WORD = { focus:"Focus", mood:"Mood", energy:"Energy", memory:"Memory", sleep:"Sleep" };

  function scoreItem(item, a) {
    let s = 0;
    if (item.goals.includes(a.goal)) s += W.goal;
    if (item.prefs.includes(a.preference)) s += W.pref;
    if (item.contexts.includes(a.context)) s += W.context;
    if (item.experience.includes(a.experience)) s += W.experienceFit;
    return s;
  }

  function recommendStack(a) {
    const maxTier = EXPERIENCE_MAX_TIER[a.experience] ?? 3;
    const targetCount = SIZE_COUNT[a.size] ?? 3;

    let scored = POOL
      .filter(it => it.tier <= maxTier)
      .map(it => ({ ...it, _score: scoreItem(it, a) }))
      .filter(it => it._score > 0)
      .sort((x, y) => y._score - x._score);

    // fallback: relax to goal-only if nothing matched
    if (scored.length === 0) {
      scored = POOL
        .filter(it => it.tier <= maxTier && it.goals.includes(a.goal))
        .map(it => ({ ...it, _score: 1 }));
    }

    // make sure the lead pick can stand alone
    const anchorIdx = scored.findIndex(it => it.role === "anchor");
    if (anchorIdx > 0) {
      const [anchor] = scored.splice(anchorIdx, 1);
      scored.unshift(anchor);
    }

    let picks = scored.slice(0, targetCount);

    // SYNERGY RULE: racetam lead with room but no choline -> slot one in
    // (catalog rule: pair a choline source with racetams)
    const RACETAMS = ["aniracetam-500mg-capsules","noopept-20mg-capsules",
                      "fasoracetam-20mg-capsules","phenylpiracetam-hydrazide-150mg-capsules"];
    const leadIsRacetam = picks[0] && RACETAMS.includes(picks[0].handle);
    const hasCholine = picks.some(p => p.choline);
    if (leadIsRacetam && !hasCholine && targetCount > 1) {
      const choline = scored.find(it => it.choline && !picks.includes(it))
                   || POOL.find(it => it.choline && it.tier <= maxTier);
      if (choline) {
        if (picks.length >= targetCount) picks[picks.length - 1] = choline;
        else picks.push(choline);
      }
    }

    return {
      recommended_stack: `Your ${GOAL_WORD[a.goal] ?? "Custom"} ${a.size === "simple" ? "Starter" : a.size === "full" ? "Complete" : "Core"} Stack`,
      recommended_handles: picks.map(p => p.handle),
      recommended_names: picks.map(p => p.name),
      result_key: `${a.goal}-${a.experience}-${a.size}`
    };
  }

  var api = { recommendStack: recommendStack, POOL: POOL };

  if (typeof window !== 'undefined') { window.NootropixQuizEngine = api; }
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
})();
