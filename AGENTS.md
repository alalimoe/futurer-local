# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **Shopify Online Store 2.0 theme** ("Nootropix", based on Futurer 3.0.0)
plus a set of **Node.js content-tooling scripts** in `scripts/`. There is no root
`package.json`, no local build step, and no database — theme assets in `assets/` are
already compiled and the storefront renders on Shopify's hosted platform.

### Tooling / where things live

- **Shopify CLI** (`shopify`, v4.x) is the primary dev tool. It is installed into a
  user-writable global prefix at `~/.npm-global/bin` (the startup/update script runs
  `npm install -g @shopify/cli`). `~/.bashrc` adds `~/.npm-global/bin` to `PATH`.
  - Non-obvious: the Shell tool's non-login shells may not source `~/.bashrc`. If
    `shopify` is "command not found", run `export PATH="$HOME/.npm-global/bin:$PATH"`
    first.
- **Node** is v22 here (satisfies the `>=18` requirement in `scripts/package.json`).
- The `scripts/` tooling has **zero npm dependencies** (Node 18+ built-ins only), so
  there is nothing to `npm install` for it — `npm run <script>` works directly.

### Lint

- `shopify theme check` (run from repo root) lints the whole theme. It currently
  reports pre-existing offenses (~158 errors / ~533 warnings, mostly `OrphanedSnippet`
  and missing translation keys), so a **non-zero exit code is normal** and does not
  mean the toolchain is broken. Compare offense counts before/after your change rather
  than relying on exit code.

### Content tooling (runs fully offline, no store needed)

From `scripts/` (see `scripts/README.md` for the full list). These read the JSON
source-of-truth under `scripts/data/` and write output locally:

- `npm run csv` → generates `scripts/data/matrixify/*.csv` (evidence-claim import).
- `npm run landing` → runs a hard compliance lint, then writes
  `templates/page.<suffix>.json` landing templates + a Pages CSV. It **aborts and
  writes nothing** if a content file makes a disallowed medical claim.
  - Non-obvious: re-running `npm run landing` strips the Shopify-admin
    "auto-generated" comment header from committed `templates/page.*-landing.json`
    files (the generator does not emit it). This shows up as a spurious diff — do NOT
    commit it; `git checkout -- templates/page.*-landing.json` to discard.
- Generated `scripts/data/matrixify/` output is gitignored.

### Running the storefront (`shopify theme dev`) — requires store auth

`shopify theme dev --store <store>.myshopify.com` uploads a development theme to a
connected Shopify store and serves a live preview. This **cannot run offline** — it
requires authentication to a real Shopify store. Two options:

- Interactive: the CLI prints a device-code URL (`accounts.shopify.com/activate-with-code`)
  to open in a browser and approve.
- Non-interactive (preferred for cloud agents): set a **Theme Access** app token via
  the `SHOPIFY_CLI_THEME_TOKEN` env var (a `shptka_…` token) together with
  `--store <store>.myshopify.com`. No Shopify credentials are present in this
  environment by default.

Admin-API scripts (`npm run import`, `npm run goals:sync`, etc.) similarly need a
`scripts/.env` with `SHOPIFY_STORE` + `SHOPIFY_ADMIN_TOKEN` (`shpat_…`), or a
`shopify store auth` CLI session — see `scripts/README.md`.
