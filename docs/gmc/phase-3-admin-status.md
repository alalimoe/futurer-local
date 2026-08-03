# Phase 3 — Admin & Live Deployment Status

> Last updated: 2026-08-03  
> Theme branch: `cursor/gmc-compliance-copy-f367` (PR #11)  
> Store: `g1rhkz-ww.myshopify.com` (nootropix.shop)

---

## Completed ✅

| Item | Result |
|---|---|
| **Theme push to live** | `futurer-local/main` (#150330310852) pushed 2026-08-03 |
| `/pages/shipping-and-returns` Admin body | Updated via `gmc-admin-sync.mjs` |
| `/pages/about` Admin body | Updated |
| Peptide `pdp.return_promise` metafields | **7 cleared** (3-day / 7-day stale copy) |
| Support SOP | `docs/gmc/support-sop-delivery-failures.md` |
| Admin sync script | `scripts/gmc-admin-sync.mjs` |

---

## Blocked — needs expanded CLI scopes

Current CLI session lacks `read_legal_policies` / `write_legal_policies` and navigation scopes.

**Re-auth (one-time, in terminal):**

```bash
shopify store auth --store g1rhkz-ww.myshopify.com \
  --scopes read_legal_policies,write_legal_policies,read_content,write_content,read_online_store_navigation,write_online_store_navigation,read_products,write_products
```

Then run:

```bash
cd scripts
SHOPIFY_CLI_STORE=g1rhkz-ww.myshopify.com node gmc-admin-sync.mjs --policies --menus --privacy-audit
```

---

## Manual — still required

| Task | Where | Notes |
|---|---|---|
| Refund policy paste | Settings → Policies | Use `docs/gmc/admin/refund-policy.md` until scopes granted |
| Shipping policy paste | Settings → Policies | Use delivery sections from `shipping-and-returns-page.md` |
| Privacy / Terms audit | Settings → Policies | Check for "3-day", "no questions asked", GMP claims |
| Store billing address | Settings → Store details | Change "Dubai" → **Office S1-166, DIP First** |
| Navigation menus | Online Store → Navigation | Add Shipping & Returns, policy links, Track Order |
| Checkout intl acknowledgment | Settings → Checkout | Add import-risk line |
| Support SOP adoption | Internal | Share `support-sop-delivery-failures.md` with team |

---

## External (user)

| Task | Status |
|---|---|
| Google Merchant Center alignment | ⏳ After policies live |
| GMC misrepresentation appeal | ⏳ After crawl validation |
| Google Business Profile 4.8 verify | ⏳ Manual |
| DCCI badge | ⏳ Hold until license 1613040 renewal |

---

## Post-deploy validation (Phase 4)

1. Live crawl: PDP, `/pages/shipping-and-returns`, `/policies/refund-policy`, footer, FAQ
2. Confirm no stale phrases on live site
3. Rich Results Test on peptide + nootropic PDP
4. Screenshot policies for GMC appeal package

---

## Commands

```bash
# Theme (already done)
shopify theme push --live --allow-live

# Admin sync (partial — expand scopes first)
cd scripts
SHOPIFY_CLI_STORE=g1rhkz-ww.myshopify.com node gmc-admin-sync.mjs --all
SHOPIFY_CLI_STORE=g1rhkz-ww.myshopify.com node gmc-admin-sync.mjs --metafields --clear-conflicts
```
