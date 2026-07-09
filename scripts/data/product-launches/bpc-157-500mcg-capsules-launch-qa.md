# BPC-157 500 mcg Capsules Launch QA

## Local Implementation Complete

- Product/admin source of truth: `scripts/data/product-launches/bpc-157-500mcg-capsules.json`
- Klaviyo brief: `scripts/data/product-launches/bpc-157-500mcg-capsules-klaviyo-brief.md`
- Launch email HTML: `email-bpc-157-oral-capsules-launch.html`
- Landing source: `scripts/data/landing/bpc-157.json`
- Generated landing template: `templates/page.bpc-157-capsules-landing.json`
- Generated Matrixify page import: `scripts/data/matrixify/landing-pages.csv`
- Evidence source updated: `scripts/data/peptides/bpc-157.json`
- Evidence CSVs regenerated: `scripts/data/matrixify/claims-peptides.csv`, `scripts/data/matrixify/claims-nootropics.csv`, `scripts/data/matrixify/claims.csv`
- Peptides hub updated: `templates/page.peptides.json`
- Glossary updated: `templates/page.glossary.json`
- Guides hub updated: `templates/page.guides.json`
- COA band supports `pdp.coa_note` and exact 100% purity rendering: `sections/peptide-coa-band.liquid`

## Validation Completed

- Landing compliance lint passed via `node scripts/generate-landing-template.mjs --compound=bpc-157`.
- Changed JSON files parse successfully.
- Shopify `validate_theme` passed for:
  - `sections/peptide-coa-band.liquid`
  - `templates/page.peptides.json`
  - `templates/page.glossary.json`
  - `templates/page.guides.json`
  - `templates/page.bpc-157-capsules-landing.json`
- New BPC launch files were checked for non-ASCII punctuation after generation.

## Shopify Admin / Matrixify Actions Still Required

These require live Shopify Admin access and cannot be completed by local theme file edits alone.

1. Create product `bpc-157-500mcg-capsules` as draft, price 375 AED, default `product` template.
2. Add product to `peptides` and `best-sellers` collections.
3. Upload bottle/label product media.
4. Upload signed BT Lab Testing PDF and assign to `pep.coa_pdf`.
5. Export/upload COA and HPLC images from the PDF and assign to `pdp.coa_image` and `pdp.hplc_image`.
6. Populate product metafields from `scripts/data/product-launches/bpc-157-500mcg-capsules.json`.
7. Create five FAQ metaobjects and link to `custom.faq_1` through `custom.faq_5`.
8. Link `evidence.snapshot` to `evidence-snapshot-bpc-157`.
9. Import `scripts/data/matrixify/landing-pages.csv` to create/update the landing page.
10. Import updated evidence CSVs if the claim wording should be refreshed in Admin.
11. Preview PDP and landing page on mobile and desktop before publish.
12. Upload/test Klaviyo email HTML and send test emails before scheduling.

## Publish Checklist

- PDP Trust Stack populated with no empty tabs.
- COA band renders the raw-material note and exact `100% (HPLC-verified)` purity.
- Evidence Snapshot chips open and PubMed links work.
- FAQ accordion and FAQ JSON-LD both render.
- BNPL snippets, sticky add-to-cart, and product recommendations do not break layout.
- Peptides hub carousel includes oral capsules alongside injectable BPC-157.
- Glossary copy mentions oral and injectable formats clearly.
- Landing page is published at `/pages/bpc-157-capsules`.
- Klaviyo campaign links include `utm_campaign=bpc157_oral_launch`.
