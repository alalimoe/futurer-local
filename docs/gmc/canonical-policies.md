# Canonical Policies — Phase 0 Source of Truth

> **Status:** Built in theme (snippets + locales). Not yet wired into live templates.
> **Do not edit copy in individual sections** — update `locales/en.default.json` → `policies.canonical.*` and re-render snippets.

## Snippets (ready to render)

| Snippet | Purpose |
|---|---|
| `snippets/policy-returns-summary.liquid` | 30-day / unopened / free returns / 7–14 day refund |
| `snippets/policy-delivery-summary.liquid` | Quiqup dual-service + shipping costs |
| `snippets/disclaimer-supplement.liquid` | Supplement disclaimer |
| `snippets/disclaimer-peptide-ruo.liquid` | Peptide RUO disclaimer |

## Locale namespaces

- `policies.canonical.*` — shared snippet strings
- `products.product.shipping_policy.*` — PDP one-liners (for Phase 2F)
- `products.product.delivery_refund_guarantee_qualified` — updated guarantee (not yet live)

## Trust stats (Quiqup, last 30 days)

| Stat | Value | Use |
|---|---|---|
| On-time attempt | **100%** | PDP, shipping page, About |
| On-time delivery | 94.9% | Shipping page, About |
| Total delivered | 97.4% | Shipping page, About |
| **Total orders** | — | **Excluded per owner request** |

Always pair stats with `date_range_label`: "Based on last 30 days".

## Returns & refunds

| Field | Value |
|---|---|
| Return window | 30 days from delivery |
| Eligibility | Unopened/sealed only |
| Return shipping | Free (Nootropix covers) |
| Refund processing | 7–14 business days after receipt + inspection |
| Refund method | Original payment method |
| Exchanges | Return + new order via support |
| Non-delivery | Full refund when confirmed lost/RTS |

## Delivery & shipping

| Zone | SLA |
|---|---|
| Dubai | ≤4 hours (Quiqup 4-hour express) |
| Rest of UAE | Next-day (Quiqup daily batch) |
| KSA | 3–5 business days average |
| International | Customs-dependent |

| Cost | Policy |
|---|---|
| UAE | Always free |
| International ≥300 AED | Free |
| International <300 AED | 85 AED flat worldwide |

## Legal identity (public)

- **Entity:** Nootropix M.E. Para Pharmaceutical Products Trading
- **License:** 1613040
- **Address:** Office S1-166, Dubai Investment Park First, Dubai, UAE
- **Phone:** +971 52 598 8940
- **Email:** support@nootropix.shop
- **Never publish:** Owner names, Ejari tenant (Synaptic), personal emails

## Peptides

- RUO (research-use only) — keep study references as preclinical/educational

## Quality claims

- cGMP-aligned **practices** only — no certification claims
- Purity per-product COA only — no blanket ≥99%

## Competitor comparison

- Delete `snippets/comparison-nootropix-vs-others.liquid` (Phase 3)

## Admin copy

See [`admin/refund-policy.md`](admin/refund-policy.md) and [`admin/shipping-and-returns-page.md`](admin/shipping-and-returns-page.md) for paste-ready Shopify Admin text.

## Content audit

See [`phase-1-content-audit.md`](phase-1-content-audit.md) for all customer-facing surfaces that need updating (no changes made yet).
