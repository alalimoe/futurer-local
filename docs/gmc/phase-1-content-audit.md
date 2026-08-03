# Phase 1 — Content Audit (Findings Only)

> **Generated:** Phase 0 execution · **No theme replacements made**
> Review this document before approving Phase 2+ implementation.

**Scoring:** Critical / High / Medium / Low · **Category:** Unacceptable / Misleading / Omission / Unavailable / Trust gap · **Fix:** Remove / Soften / Substantiate / Enable snippet / Admin-only

**Canonical reference:** [`canonical-policies.md`](canonical-policies.md)

---

## Summary

| Severity | Count |
|---|---|
| Critical | 5 |
| High | 28 |
| Medium | 22 |
| Low | 8 |

| Category | Count |
|---|---|
| Unacceptable business practices | 12 |
| Misleading or unrealistic offers | 24 |
| Omission of relevant information | 9 |
| Unavailable offers | 4 |
| Trust gap | 14 |

---

## Critical — fix first

### C1. Placeholder About page

| Field | Detail |
|---|---|
| **Files** | `templates/page.about.json`, `templates/page.about.placeholder.json` |
| **Issue** | Team members show "Full name" / "Position" placeholders |
| **Category** | Unacceptable · Trust gap |
| **Fix** | Replace with licensed business identity (License 1613040, DIP address, no personal names) |

### C2. Return policy conflict (3-day vs 30-day)

| Field | Detail |
|---|---|
| **Canonical** | 30 days, unopened only, refunds 7–14 days after receipt |
| **Category** | Unacceptable |
| **Fix** | `{% render 'policy-returns-summary' %}` |

| File | Current copy |
|---|---|
| `sections/beginners-guide.liquid` | "Easy 3-day refunds" (×3 instances) |
| `templates/page.beginners-guide.json` | "refunded within 3 days" |
| `sections/nx-why-nootropix.liquid` | "refunds within 3 days" |
| `sections/choline-101.liquid` | "3-day easy returns" |
| `sections/np-guide-choline-101.liquid` | "returns within 3 days" (default + preset) |
| `sections/memory-learning-guide.liquid` | "returnable within 3 days" |
| `sections/focus-attention-guide.liquid` | "returnable within 3 days" |
| `templates/page.uae.json` | "Refunds processed within 3 business days" |

### C3. PDP buy box — missing shipping/returns disclosure

| Field | Detail |
|---|---|
| **File** | `snippets/product-info-content.liquid` (buy_button block) |
| **Current** | Ships-today bar + unqualified non-delivery guarantee only |
| **Missing** | Delivery zones, shipping cost, return policy, policy links |
| **Category** | Omission |
| **Fix** | Phase 2F — `product-shipping-policy` composite (not built yet) |

### C4. Competitor comparison with unverified stats

| Field | Detail |
|---|---|
| **File** | `snippets/comparison-nootropix-vs-others.liquid` |
| **Issue** | iHerb/Amazon comparison table; embedded fake $0 Product JSON-LD |
| **Render refs** | None found (orphan file — still crawlable if linked elsewhere) |
| **Category** | Unacceptable |
| **Fix** | Delete snippet entirely |

### C5. GMP certification claims without certifier

| Field | Detail |
|---|---|
| **Files** | `templates/index.json` ("cGMP Manufactured"), `sections/nootropix-footer.liquid` ("GMP Certified Facility"), `templates/page.peptides.json` ("cGMP-made"), `sections/peptide-wholesale.liquid` ("GMP-compliant suppliers") |
| **Canonical** | "cGMP-aligned procedures" — practices only |
| **Category** | Unacceptable |
| **Fix** | Soften + describe facility practices |

---

## High — return & refund copy

| File | Issue | Canonical fix |
|---|---|---|
| `templates/page.nootropix-faq-sectioned.json` | Returns FAQ: "refunds processed quickly" — no window or timeline | 30-day unopened; 7–14 days |
| `templates/page.nootropix-faq-sectioned.json` | Cancel FAQ: "5–10 business days" (bank) — OK for card timing; clarify vs return refunds | Qualify as bank processing time |
| `templates/page.faq.json` | Same vague "processed quickly" returns copy | Match canonical |
| `locales/en.default.json` | `delivery_refund_guarantee`: "no questions asked" — unqualified | Use `delivery_refund_guarantee_qualified` |
| Demo `templates/product.variant-*.json` | Phone-case return FAQ (30-day, wrong product category) | Remove/unassign templates |

---

## High — shipping cost & delivery timing

### UAE free shipping wrongly tied to 300 AED threshold

| File | Issue |
|---|---|
| `sections/choline-101.liquid` | "Free shipping ≥ 300 AED" (implies UAE threshold) |
| `sections/np-guide-choline-101.liquid` | Same |
| `sections/guides-hub.liquid` | "Free UAE shipping · Orders ≥ 300 AED" |
| `sections/focus-attention-guide.liquid` | "Free UAE shipping ≥ 300 AED" (×2) |
| `sections/memory-learning-guide.liquid` | Same (×2) |
| `sections/nootropix-dubai-shipping.liquid` | "Free shipping on all UAE orders ≥ 300 AED" |
| `sections/nx-why-nootropix.liquid` | "free shipping ≥300 AED" (ambiguous UAE/intl) |

**Canonical:** UAE always free; international free ≥300 AED / 85 AED below.

### KSA "3 days" → should be "3–5 days average"

| File |
|---|
| `templates/page.nootropics-ksa.json` (×5 instances) |
| `templates/page.nootropics-ksa-memory.json` |
| `templates/page.nootropics-ksa-focus.json` |
| `templates/page.how-to-choose-nootropics-ksa.json` |
| `templates/page.faq.json` |
| `templates/page.nootropix-faq-sectioned.json` |
| `sections/ksa-hero.liquid`, `sections/ksa-faq.liquid`, `sections/ksa-cluster.liquid`, `sections/ksa-trust-delivery.liquid` |

### International-only 300 AED copy (OK if scoped to intl — verify context)

| File | Notes |
|---|---|
| `templates/page.uae.json` | Intl free ≥300 AED — OK if not applied to UAE |
| `sections/beginners-guide.liquid` | "Free international express on 300 AED+" — OK |
| Landing subheads (Noopept, Fladrafinil, Phenibut) | "Free express shipping 300 AED+" — clarify intl only |

---

## High — business identity & footer

| File | Issue | Fix |
|---|---|---|
| `sections/footer-group.json` | Generic footer; "premier destination" marketing; only "Dubai, UAE" + email — no license, phone, DIP address | Add legal line + contact; optional switch to `nootropix-footer` |
| `sections/nootropix-footer.liquid` | Rich footer exists but **not active** in footer-group | Enable or merge disclaimers/badges |
| `templates/page.about.json` | Placeholder team (see C1) | Licensed business copy |

---

## High — purity & quality claims

| File | Issue |
|---|---|
| `templates/page.quality-coa.json` | "≥99% purity" blanket |
| `sections/quality-coa.liquid` | Same |
| `templates/page.peptides.json` | "99%+ Purity", "≥99% purity" chips |
| `sections/peptide-wholesale.liquid` | "≥ 99%" per peptide defaults |
| `templates/index.json` FAQ | "target ≥99% purity" — soften to per-COA |

**Canonical:** Per-batch COA only; link COA library.

---

## High — peptide therapeutic framing

| File | Issue |
|---|---|
| `templates/page.glossary.json` | BPC-157/TB-500/GHK-Cu: wound healing, anti-aging consumer benefits |
| `sections/glossary-compounds.liquid` | Same mechanism/benefits copy |
| `templates/page.protocol-builder.json` | TB-500 "systemic healing" hint |
| `sections/protocol-generator.liquid` | Similar healing framing |
| `templates/page.bpc-157-capsules-landing.json` | Review therapeutic language vs RUO |

**Canonical:** RUO + preclinical research framing + `disclaimer-peptide-ruo`.

---

## High — structured data

| File | Issue |
|---|---|
| `snippets/ecom_google_snippet.liquid` | Uses `product.available` not `variant.available`; **not rendered** in `layout/theme.liquid` |
| `snippets/product-jsonld.liquid` | Hardcoded shipping/returns — may not match Phase 0 |
| `snippets/comparison-nootropix-vs-others.liquid` | Fake $0 Product JSON-LD |
| `snippets/ecom_product_json.liquid` | `product.available` at product level |

---

## Medium — disclaimers

| File | Issue |
|---|---|
| `templates/index.json` | Homepage FAQ `show_disclaimer: false` |
| `templates/product.json` | Product disclaimer blocks disabled |
| Active `footer.liquid` (via footer-group) | No global medical disclaimer |
| `templates/page.peptides-guide.json` | Calculator disclaimer mentions "wellness routine" — soften for RUO |

**Fix:** `{% render 'disclaimer-supplement' %}` / `disclaimer-peptide-ruo` on target pages.

---

## Medium — pricing transparency

| File | Issue |
|---|---|
| `locales/en.default.json` | BNPL hardcoded "$133.12" |
| `locales/ar.json` | Same hardcoded amount |
| `snippets/buy-button.liquid` | Uses BNPL locale string |
| `snippets/tabby-installments.liquid`, `snippets/tamara.liquid` | Verify variant price binding |

---

## Medium — demo / placeholder residue

| File | Issue |
|---|---|
| `templates/product.variant-radio.json`, `product.variant-pill.json` | Phone-case FAQs |
| `templates/page.home-1.json`, `home-2.json`, `home-4.json` | Phone-case testimonials |
| `templates/page.about.placeholder.json` | Duplicate placeholder About |

**Fix:** Unassign from production or delete.

---

## Medium — urgency & promos

| File | Issue |
|---|---|
| `locales/en.default.json` | `delivery_refund_guarantee` — "no questions asked" |
| `sections/popup-group.json`, `popup-countdown-promo.liquid` | "Limited time offers" default copy |
| `sections/nootropic-quiz.liquid` | "Rated 4.8 on Google" — verify live (keep if accurate) |

**Note:** 10% first-order discount is permanent — remove "limited time" if present on promo surfaces.

---

## Low — trust stats placement (future Phase 2E)

| Surface | Action |
|---|---|
| PDP buy box | `show_trust_stat: true` on `policy-delivery-summary` — 100% on-time attempt only |
| Dubai shipping / About | `nootropix-delivery-stats` section (not built) |
| **Excluded** | Total orders (39) — do not publish per owner request |

---

## Admin surfaces (cannot verify from repo)

| Surface | Expected canonical value | Status |
|---|---|---|
| Settings → Refund policy | See `admin/refund-policy.md` | **Needs paste** |
| Settings → Shipping policy | Quiqup model + cost table | **Needs rewrite** |
| Page `/pages/shipping-and-returns` | See `admin/shipping-and-returns-page.md` | **Needs paste** |
| Settings → Store details | Nootropix M.E., License 1613040, DIP First | **Needs update** |
| Merchant Center → Business info | Match website exactly | **Needs audit** |
| Google Business Profile | Consistent with site; verify 4.8 rating | **Needs verify** |
| DCCI membership badge | Hold until renewed under license 1613040 | **Pending confirmation** |

---

## Snippets ready for wiring (Phase 0 built)

| Snippet | Render when approved |
|---|---|
| `policy-returns-summary` | Guides, footer, PDP, FAQs |
| `policy-delivery-summary` | PDP, cart, guides, FAQs |
| `disclaimer-supplement` | PDP, footer, guides |
| `disclaimer-peptide-ruo` | Peptide PDPs, landings, glossary |

**Not built yet (later phases):** `product-shipping-policy`, `nootropix-delivery-stats`

---

## Recommended implementation order (post-approval)

1. Wire shared snippets + replace 3-day return copy
2. Build PDP `product-shipping-policy` block
3. About page + footer legal identity
4. Delete competitor comparison snippet
5. GMP/purity/peptide copy remediation
6. JSON-LD fixes + render ecom_google_snippet
7. Paste Admin policies + MC alignment
8. Validate + appeal package
