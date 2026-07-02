# Evidence-claim importer

Generates `evidence_claim` metaobject entries for the Nootropix store from a
JSON source-of-truth split into two folders:

- `data/peptides/`   — 5 peptide products × 5 claims = 25 claims
- `data/nootropics/` — 28 nootropic products × 2 claims = 56 claims

After import, **link each claim to its `evidence_snapshot` manually in admin**
— the snapshot linking step is intentionally not automated, since the
snapshot for each product may already exist with other claims you want to keep.

Two import paths, both reading the same JSON files:

| Path | Use when |
|---|---|
| **Matrixify CSV** (`generate-matrixify-csv.mjs` → `data/matrixify/*.csv`) | You want a one-off bulk import via the Matrixify app |
| **Admin API** (`import-evidence-claims.mjs`) | You want a scriptable, repeatable import that runs against your custom-app token |

### Duplicate `[PubMed]` in `notes` (cleanup)

If rich-text notes contain **both** a plain-text citation like `[PubMed ↗] [` and the same label inside an inline link (duplicate on the storefront), run:

```bash
npm run clean:notes:dry    # preview
npm run clean:notes       # apply (requires write_metaobjects)
```

Optional: `node clean-claim-notes.mjs --handle=<claim-handle> --dry-run`

A claim's `source` field is **optional**. Claims without a source render in
Liquid as a plain paragraph with no `[PubMed]` chip — used for descriptor /
educational claims where there is no specific study to cite.

---

## Folder layout

```
scripts/
├── data/
│   ├── peptides/               Source of truth — one JSON per peptide product
│   │   ├── bpc-157.json
│   │   ├── tb-500.json
│   │   ├── ghk-cu.json
│   │   ├── semax.json
│   │   └── oxytocin.json
│   ├── nootropics/             Source of truth — one JSON per nootropic product
│   │   ├── 5-htp.json
│   │   ├── acetyl-l-carnitine.json
│   │   ├── … (28 files total)
│   │   └── tongkat-ali.json
│   └── matrixify/              Generated CSVs (gitignored output)
│       ├── claims-peptides.csv     25 peptide claims
│       ├── claims-nootropics.csv   56 nootropic claims
│       └── claims.csv              all 81 claims (combined)
├── lib/
│   ├── shopify-admin.mjs       Admin GraphQL client
│   ├── rich-text.mjs           Builds Shopify rich-text JSON for the API path
│   ├── rich-text-html.mjs      Builds equivalent HTML for the Matrixify path
│   └── csv.mjs                 Tiny CSV writer
├── generate-matrixify-csv.mjs  CSV generator
├── import-evidence-claims.mjs  Admin API runner
├── clean-claim-notes.mjs       Strip duplicate plain-text PubMed before inline links
├── .env.example                (admin API path) required env vars
├── package.json                Convenience npm scripts
└── README.md                   This file
```

`scripts/.env` and `scripts/node_modules/` are git-ignored at the repo root.

---

## Schema assumptions

These are the existing metaobject definitions in admin. The script does not
create or modify them.

### `evidence_claim`

| Field | Type |
|---|---|
| `headline` | Single-line text |
| `notes` | Rich text (contains the inline `[PubMed]` link to the study) |

### `evidence_snapshot`

| Field | Type |
|---|---|
| `title` | Single-line text |
| `claims_list` (display name `claims`) | List of `evidence_claim` references |

### Product metafield

| Namespace.Key | Type |
|---|---|
| `evidence.snapshot` | Metaobject reference → `evidence_snapshot` |

---

## Path A — Matrixify CSV (recommended for one-off)

### 1. Generate the CSV

```bash
cd scripts
node generate-matrixify-csv.mjs
# or:  npm run csv
```

Produces `scripts/data/matrixify/claims.csv` — 25 rows, one per claim, with:

- `Command` = `MERGE` (idempotent — re-imports update in place)
- `Handle` = stable per claim, e.g. `claim-bpc-157-tendon-recovery`
- `Type` = `evidence_claim`
- `Status` = `ACTIVE`
- `Field: headline` = customer-friendly benefit phrase
- `Field: notes` = HTML with `<p>…sentence… <a href="…" title="…" target="_blank">[PubMed]</a></p>`. Matrixify converts to rich-text JSON during import.

### 2. Import into Matrixify

1. Shopify admin → **Apps → Matrixify → Import**.
2. Drop in `data/matrixify/claims.csv`.
3. Run **Dry Run** first; review the preview report.
4. Click **Import** to execute. 25 `evidence_claim` entries are created.

### 3. Link to snapshots in admin

For each peptide:

1. Shopify admin → **Content → Metaobjects → evidence_snapshot**.
2. Open (or create) the snapshot for that peptide.
3. In the `claims` field, add the 5 new claim entries (handles starting with
   `claim-<peptide>-…`).
4. Save.
5. On the product, set the `evidence.snapshot` metafield to that snapshot
   metaobject (if not already set).

The storefront section now renders the new claims.

### 4. Bulk-link claims to `evidence_snapshot` (append-only, Matrixify)

After `evidence_claim` rows exist in Shopify, link them to each product’s
`evidence_snapshot` **without** overwriting existing `claims_list` entries:
the generator reads a Matrixify **Metaobjects** export (xlsx), compares it to
`data/nootropics/*.json` + `data/peptides/*.json`, and writes a CSV that only
**appends** missing curated claim handles (same order as in JSON, after
everything already linked).

**Generate** (requires `unzip` on PATH — macOS/Linux):

```bash
cd scripts
node generate-snapshot-link-csv.mjs --export ~/Downloads/Export_YYYY-MM-DD_....xlsx
# or:  npm run snapshot-links -- --export ~/Downloads/Export_....xlsx
```

Writes under `data/matrixify/`:

| File | Purpose |
|---|---|
| `snapshot-links.csv` | Matrixify import — `MERGE` rows, `Field` = `claims_list` only |
| `snapshot-links.preview.md` | Human-readable before/after per snapshot |
| `snapshot-links.rollback.json` | Machine-readable pre-import `claims_list` strings |

**Local preflight** (append-only invariant on the generated CSV):

```bash
npm run snapshot-links:verify
```

**Matrixify**

1. Read `snapshot-links.preview.md` and confirm each diff.
2. Apps → Matrixify → Import → `snapshot-links.csv` → **Dry Run** → review.
3. **Import** (live).

**After a successful import**, re-export Metaobjects from Matrixify and
re-run the generator — it should report **0 snapshots to update** (idempotent).

**Rollback** (restore pre-import `claims_list` from `rollback.json` or the
HTML comment at the bottom of `preview.md`):

```bash
node generate-snapshot-link-csv.mjs --rollback-from data/matrixify/snapshot-links.rollback.json
# writes data/matrixify/snapshot-links.revert.csv → import that in Matrixify
```

`productHandle` → snapshot handle is usually `<productHandle>-evidence-snapshot`.
Exceptions are listed in `SNAPSHOT_HANDLE_OVERRIDES` at the top of
`generate-snapshot-link-csv.mjs` (e.g. `phenibut-hcl` → `phenibut-evidence-snapshot`).

---

## Path B — Admin API (recommended if you'll re-run later)

### One-time setup

1. **Settings → Apps and sales channels → Develop apps → Create an app**.
2. **Configure Admin API scopes**: enable `write_metaobjects`. Save.
3. **Install app**, then **Reveal token once** under Admin API access token.
   The token starts with `shpat_…` — **not `shpss_`** (that's the API secret,
   not usable as a Bearer token).
4. Copy `.env.example` to `.env` and fill in:
   ```bash
   SHOPIFY_STORE=nootropix-shop.myshopify.com
   SHOPIFY_ADMIN_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

No `npm install` is required — the runner uses only Node 18+ built-ins.

### Run

```bash
# Always dry-run first
node import-evidence-claims.mjs --peptide=bpc-157 --dry-run
node import-evidence-claims.mjs --all --dry-run

# Live, one peptide at a time (recommended for first run)
node import-evidence-claims.mjs --peptide=bpc-157

# Live, all five
node import-evidence-claims.mjs --all
```

### What it does

For each claim in each peptide JSON:

```
metaobjectUpsert(
  type: "evidence_claim",
  handle: "claim-<peptide>-<slug>",
  fields: [
    { key: "headline", value: "<benefit phrase>" },
    { key: "notes",    value: <rich-text JSON with inline [PubMed] link> }
  ]
)
```

That's it. No source metaobject layer, no snapshot creation, no product
metafield update. Snapshot linking is manual.

### Convenience npm scripts

```bash
npm run import:dry        # default args, dry run
npm run import:all:dry    # all peptides, dry run
npm run import:all        # all peptides, live
npm run csv               # regenerate Matrixify CSV
```

---

## Editing claims later

1. Open `data/peptides/<handle>.json`.
2. Edit headline, sentence, or PubMed link.
3. Re-run the importer (Matrixify path: regenerate CSV and re-import; API
   path: re-run the script). Stable handles + `MERGE`/`metaobjectUpsert`
   means existing rows update in place — no duplicates.

To **add** a claim, append a new entry to the `claims` array with a unique
`handle` and re-run.

To **remove** a claim, delete the corresponding entry from the snapshot's
`claims` field in admin. The orphaned `evidence_claim` metaobject will still
exist (the script never deletes); delete it manually if you want it gone.

---

## Safety guarantees

- **Idempotent**: both paths key on `(type, handle)`. Re-runs update in place.
- **Scoped**: only handles present in `data/peptides/*.json` are written.
  Existing claims with other handles (your nootropic catalog of 146+ entries)
  are never read or written.
- **No deletes**: scripts can create or update, never delete. Cleanup is
  always a manual admin action.
- **No snapshot or product writes**: scripts only touch `evidence_claim`
  records; you control snapshot composition manually.
