#!/usr/bin/env node
/**
 * GMC Phase 3 — Shopify Admin alignment script.
 *
 * Syncs policies, pages, shop details, navigation menus, and peptide PDP
 * metafields from docs/gmc/ canonical copy.
 *
 * Auth (pick one):
 *   scripts/.env  → SHOPIFY_STORE + SHOPIFY_ADMIN_TOKEN
 *   CLI session   → SHOPIFY_CLI_STORE=nootropix.myshopify.com (after shopify store auth)
 *
 * Usage:
 *   node gmc-admin-sync.mjs --dry-run              # audit only
 *   node gmc-admin-sync.mjs --policies             # refund + shipping policies
 *   node gmc-admin-sync.mjs --pages                # shipping-and-returns, about, help-faq
 *   node gmc-admin-sync.mjs --shop                 # store name / contact / address
 *   node gmc-admin-sync.mjs --menus                # main-menu + quick-links
 *   node gmc-admin-sync.mjs --metafields           # audit/clear conflicting pdp.* promises
 *   node gmc-admin-sync.mjs --privacy-audit        # diff privacy + terms for stale phrases
 *   node gmc-admin-sync.mjs --all                  # everything except metafield clears
 */

import { readFileSync } from "node:fs";
import { readFile as readFileAsync } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { adminGraphQL } from "./lib/shopify-admin.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadEnv() {
  const envPath = join(__dirname, ".env");
  try {
    const raw = await readFileAsync(envPath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const k = trimmed.slice(0, eq).trim();
      let v = trimmed.slice(eq + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    // optional .env
  }
}

const ROOT = join(__dirname, "..");
const DOCS = join(ROOT, "docs/gmc/admin");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const RUN_ALL = args.has("--all");

const STALE_PATTERNS = [
  /3[- ]day return/i,
  /no questions asked/i,
  /100% money[- ]back guarantee/i,
  /free returns? on all orders/i,
  /GMP certified/i,
  /≥\s*99%/i,
  /purity of 99/i,
];

const CONFLICTING_METAFIELD_PATTERNS = [
  /3[- ]day/i,
  /7[- ]day/i,
  /easy returns/i,
  /no questions asked/i,
  /money[- ]back guarantee/i,
  /free return/i,
  /same[- ]day worldwide/i,
  /guaranteed delivery/i,
];

const CANONICAL_SHOP = {
  name: "Nootropix",
  email: "support@nootropix.shop",
  contactEmail: "support@nootropix.shop",
  billingAddress: {
    address1: "Office S1-166, Dubai Investment Park First",
    city: "Dubai",
    countryCode: "AE",
    phone: "+971525988940",
    zip: "",
  },
};

const REQUIRED_MENU_LINKS = {
  "main-menu": [
    { title: "Shipping & Returns", url: "/pages/shipping-and-returns" },
    { title: "Track Order", url: "/pages/track-order" },
    { title: "Help & FAQ", url: "/pages/help-faq" },
  ],
  "quick-links": [
    { title: "Refund Policy", url: "/policies/refund-policy" },
    { title: "Shipping Policy", url: "/policies/shipping-policy" },
    { title: "Privacy Policy", url: "/policies/privacy-policy" },
    { title: "Terms of Service", url: "/policies/terms-of-service" },
    { title: "Shipping & Returns", url: "/pages/shipping-and-returns" },
  ],
};

function log(msg) {
  console.log(DRY_RUN ? `[dry-run] ${msg}` : msg);
}

function shouldRun(flag) {
  return RUN_ALL || args.has(flag);
}

function readDoc(filename) {
  const raw = readFileSync(join(DOCS, filename), "utf8");
  const bodyStart = raw.indexOf("\n---\n");
  return bodyStart === -1 ? raw : raw.slice(bodyStart + 5);
}

function mdToHtml(md) {
  let html = md.trim();
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  const lines = html.split("\n");
  const out = [];
  let inTable = false;
  for (const line of lines) {
    if (/^\|/.test(line)) {
      if (!inTable) {
        out.push("<table>");
        inTable = true;
      }
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      if (cells.every((c) => /^-+$/.test(c))) continue;
      const tag = out.length && out[out.length - 1] === "<table>" ? "th" : "td";
      out.push(
        "<tr>" + cells.map((c) => `<${tag}>${c}</${tag}>`).join("") + "</tr>",
      );
    } else {
      if (inTable) {
        out.push("</table>");
        inTable = false;
      }
      if (line.trim() === "") {
        out.push("");
      } else if (!/^<[h|u|o|t]/.test(line.trim())) {
        out.push(`<p>${line}</p>`);
      } else {
        out.push(line);
      }
    }
  }
  if (inTable) out.push("</table>");

  return out
    .join("\n")
    .replace(/(<p>- (.+)<\/p>\n?)+/g, (block) => {
      const items = [...block.matchAll(/<p>- (.+)<\/p>/g)]
        .map((m) => `<li>${m[1]}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    })
    .replace(/(<p>\d+\. (.+)<\/p>\n?)+/g, (block) => {
      const items = [...block.matchAll(/<p>\d+\. (.+)<\/p>/g)]
        .map((m) => `<li>${m[1]}</li>`)
        .join("");
      return `<ol>${items}</ol>`;
    });
}

function buildRefundPolicyHtml() {
  return mdToHtml(readDoc("refund-policy.md"));
}

function buildShippingPolicyHtml() {
  const md = readDoc("shipping-and-returns-page.md");
  const deliverySection = md.split("## Returns & refunds")[0];
  return mdToHtml(deliverySection);
}

function buildShippingReturnsPageHtml() {
  let md = readDoc("shipping-and-returns-page.md");
  const refundMd = readDoc("refund-policy.md");
  md = md.replace(
    "*[Insert full Refund policy text from refund-policy.md]*",
    refundMd.replace(/^#.+$/m, "").trim(),
  );
  md = md.replace(
    /\[set publish date when pasting\]/g,
    new Date().toISOString().slice(0, 10),
  );
  return mdToHtml(md);
}

function buildAboutPageHtml() {
  return `<h1>About Nootropix</h1>
<p><strong>Nootropix M.E. Para Pharmaceutical Products Trading</strong> · License No. 1613040</p>
<p>Licensed para-pharmaceutical trader based in Dubai, UAE. We ship nootropics and research peptides worldwide from our Dubai fulfillment center with full tracking via Quiqup.</p>
<p>Office S1-166, Dubai Investment Park First, Dubai, UAE<br>
<a href="mailto:support@nootropix.shop">support@nootropix.shop</a> · <a href="tel:+971525988940">+971 52 598 8940</a></p>
<h2>Trust metrics</h2>
<p>Based on Quiqup fulfillment data (last 30 days): 100% on-time delivery attempt · 94.9% on-time delivery · 97.4% total delivered.</p>`;
}

function hasStaleCopy(text) {
  return STALE_PATTERNS.some((re) => re.test(text || ""));
}

async function updateShopPolicy(type, body) {
  const query = /* GraphQL */ `
    mutation ShopPolicyUpdate($shopPolicy: ShopPolicyInput!) {
      shopPolicyUpdate(shopPolicy: $shopPolicy) {
        shopPolicy { id type body }
        userErrors { field message }
      }
    }
  `;
  if (DRY_RUN) {
    log(`Would update ${type} policy (${body.length} chars)`);
    return;
  }
  const data = await adminGraphQL(query, { shopPolicy: { type, body } });
  const result = data.shopPolicyUpdate;
  if (result.userErrors?.length) {
    throw new Error(
      `shopPolicyUpdate ${type}: ${JSON.stringify(result.userErrors)}`,
    );
  }
  log(`Updated ${type} policy`);
}

async function getPageByHandle(handle) {
  const query = /* GraphQL */ `
    query PageByHandle($query: String!) {
      pages(first: 1, query: $query) {
        edges {
          node { id handle title body }
        }
      }
    }
  `;
  const data = await adminGraphQL(query, { query: `handle:${handle}` });
  return data.pages?.edges?.[0]?.node ?? null;
}

async function updatePage(handle, title, bodyHtml) {
  const page = await getPageByHandle(handle);
  if (!page) {
    log(`Page not found: ${handle} — create manually in Admin`);
    return;
  }
  if (page.body && !hasStaleCopy(page.body) && page.body.length > 500) {
    if (page.body.includes("Nootropix M.E.") && !hasStaleCopy(page.body)) {
      log(`Page ${handle} looks current — skipping`);
      return;
    }
  }
  if (hasStaleCopy(page.body)) {
    log(`Page ${handle} has stale copy — will update`);
  }
  const mutation = /* GraphQL */ `
    mutation PageUpdate($id: ID!, $page: PageUpdateInput!) {
      pageUpdate(id: $id, page: $page) {
        page { id handle }
        userErrors { field message }
      }
    }
  `;
  if (DRY_RUN) {
    log(`Would update page ${handle} (${bodyHtml.length} chars)`);
    return;
  }
  const data = await adminGraphQL(mutation, {
    id: page.id,
    page: { title, body: bodyHtml },
  });
  const result = data.pageUpdate;
  if (result.userErrors?.length) {
    throw new Error(`pageUpdate ${handle}: ${JSON.stringify(result.userErrors)}`);
  }
  log(`Updated page: ${handle}`);
}

async function syncPolicies() {
  log("=== Policies ===");
  try {
    await updateShopPolicy("REFUND_POLICY", buildRefundPolicyHtml());
    await updateShopPolicy("SHIPPING_POLICY", buildShippingPolicyHtml());
  } catch (err) {
    if (/legal_policies/i.test(String(err))) {
      log(
        "SKIP: missing write_legal_policies scope — paste policies manually from docs/gmc/admin/",
      );
    } else {
      throw err;
    }
  }
}

async function syncPages() {
  log("=== Pages ===");
  await updatePage(
    "shipping-and-returns",
    "Shipping & Returns",
    buildShippingReturnsPageHtml(),
  );
  await updatePage("about", "About", buildAboutPageHtml());
  const help = await getPageByHandle("help-faq");
  if (help && hasStaleCopy(help.body)) {
    await updatePage(
      "help-faq",
      "Help & FAQ",
      '<p>See our <a href="/pages/nootropix-faq-sectioned">full FAQ</a> for shipping, returns, and delivery failure policies.</p>',
    );
  } else if (help) {
    log("Page help-faq body OK or empty (JSON template drives content)");
  }
}

async function syncShopDetails() {
  log("=== Shop details ===");
  const query = /* GraphQL */ `
    query ShopDetails {
      shop {
        name
        email
        contactEmail
        billingAddress { address1 city countryCodeV2 phone }
      }
    }
  `;
  const data = await adminGraphQL(query);
  const shop = data.shop;
  log(`Current shop: ${shop.name} · ${shop.contactEmail || shop.email}`);
  log(
    `Current address: ${shop.billingAddress?.address1 || "(none)"}, ${shop.billingAddress?.city || ""}`,
  );
  const needsAddress =
    !shop.billingAddress?.address1?.includes("DIP") &&
    !shop.billingAddress?.address1?.includes("Investment Park");
  if (needsAddress) {
    log(
      "MANUAL: Update Settings → Store details → billing address to Office S1-166, DIP First (no shopUpdate mutation in current API scopes)",
    );
  } else {
    log("Shop contact email and phone look correct");
  }
}

async function getMenuByHandle(handle) {
  const query = /* GraphQL */ `
    query MenusByHandle($query: String!) {
      menus(first: 1, query: $query) {
        edges {
          node {
            id
            handle
            title
            items { id title url type items { id title url } }
          }
        }
      }
    }
  `;
  const data = await adminGraphQL(query, { query: `handle:${handle}` });
  return data.menus?.edges?.[0]?.node ?? null;
}

function flattenMenuItems(items, acc = []) {
  for (const item of items || []) {
    acc.push(item);
    if (item.items?.length) flattenMenuItems(item.items, acc);
  }
  return acc;
}

async function syncMenus() {
  log("=== Menus ===");
  try {
    for (const [handle, required] of Object.entries(REQUIRED_MENU_LINKS)) {
    const menu = await getMenuByHandle(handle);
    if (!menu) {
      log(`Menu not found: ${handle}`);
      continue;
    }
    const existing = flattenMenuItems(menu.items);
    const existingUrls = new Set(existing.map((i) => i.url));
    const missing = required.filter((r) => !existingUrls.has(r.url));
    if (!missing.length) {
      log(`Menu ${handle}: all required links present`);
      continue;
    }
    log(`Menu ${handle}: missing ${missing.map((m) => m.title).join(", ")}`);
    const newItems = [
      ...menu.items.map((item) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        type: item.type,
      })),
      ...missing.map((m) => ({ title: m.title, url: m.url, type: "HTTP" })),
    ];
    const mutation = /* GraphQL */ `
      mutation MenuUpdate($id: ID!, $title: String!, $handle: String!, $items: [MenuItemUpdateInput!]!) {
        menuUpdate(id: $id, title: $title, handle: $handle, items: $items) {
          menu { id handle }
          userErrors { field message }
        }
      }
    `;
    if (DRY_RUN) {
      log(`Would add ${missing.length} link(s) to ${handle}`);
      continue;
    }
    const result = (
      await adminGraphQL(mutation, {
        id: menu.id,
        title: menu.title,
        handle: menu.handle,
        items: newItems,
      })
    ).menuUpdate;
    if (result.userErrors?.length) {
      throw new Error(`menuUpdate ${handle}: ${JSON.stringify(result.userErrors)}`);
    }
    log(`Updated menu: ${handle}`);
  }
  } catch (err) {
    if (/menus field|online_store_navigation|MenuByHandle/i.test(String(err))) {
      log(
        "SKIP: missing navigation scopes — add policy links manually in Admin → Navigation",
      );
    } else {
      throw err;
    }
  }
}

async function auditPrivacyTerms() {
  log("=== Privacy / Terms audit ===");
  const query = /* GraphQL */ `
    query ShopPolicies {
      shop {
        shopPolicies { title type body }
      }
    }
  `;
  try {
    const data = await adminGraphQL(query);
    const policies = data.shop.shopPolicies || [];
    if (!policies.length) {
      log("No shop policies returned");
      return;
    }
    for (const policy of policies) {
      const name = policy.type || policy.title;
      const body = policy.body;
      if (!body) {
        log(`${name}: empty`);
        continue;
      }
      const stale = STALE_PATTERNS.filter((re) => re.test(body));
      if (stale.length) {
        log(`${name}: STALE patterns — ${stale.map(String).join(", ")}`);
      } else {
        log(`${name}: no stale patterns detected`);
      }
    }
  } catch (err) {
    if (/read_legal_policies/i.test(String(err))) {
      log(
        "SKIP: missing read_legal_policies scope — run shopify store auth with write_legal_policies",
      );
    } else {
      throw err;
    }
  }
}

async function auditMetafields() {
  log("=== Peptide metafield audit ===");
  const query = /* GraphQL */ `
    query ProductsWithPdpMetafields($cursor: String) {
      products(first: 50, after: $cursor, query: "tag:peptide OR product_type:peptide") {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id
            handle
            title
            metafields(namespace: "pdp", first: 10) {
              edges { node { id key value namespace } }
            }
          }
        }
      }
    }
  `;
  let cursor = null;
  let cleared = 0;
  let flagged = 0;
  do {
    const data = await adminGraphQL(query, { cursor });
    const { edges, pageInfo } = data.products;
    for (const { node: product } of edges) {
      for (const { node: mf } of product.metafields.edges) {
        if (
          !["shipping_promise", "return_promise", "delivery_promise"].includes(
            mf.key,
          )
        ) {
          continue;
        }
        const conflict = CONFLICTING_METAFIELD_PATTERNS.some((re) =>
          re.test(mf.value || ""),
        );
        if (!conflict && mf.value) {
          log(
            `OK ${product.handle} pdp.${mf.key}: "${mf.value.slice(0, 60)}..."`,
          );
          continue;
        }
        if (!mf.value) continue;
        flagged++;
        log(`CONFLICT ${product.handle} pdp.${mf.key}: "${mf.value}"`);
        if (args.has("--clear-conflicts") && !DRY_RUN) {
          const del = /* GraphQL */ `
            mutation MetafieldsDelete($metafields: [MetafieldIdentifierInput!]!) {
              metafieldsDelete(metafields: $metafields) {
                deletedMetafields { key namespace ownerId }
                userErrors { field message }
              }
            }
          `;
          await adminGraphQL(del, {
            metafields: [
              { ownerId: product.id, namespace: "pdp", key: mf.key },
            ],
          });
          cleared++;
          log(`  Cleared pdp.${mf.key} on ${product.handle}`);
        }
      }
    }
    cursor = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (cursor);
  log(`Metafield audit: ${flagged} conflicting, ${cleared} cleared`);
  if (flagged && !args.has("--clear-conflicts")) {
    log("Re-run with --clear-conflicts to delete conflicting metafield values");
  }
}

async function main() {
  await loadEnv();
  const tasks = [];
  if (shouldRun("--policies")) tasks.push(syncPolicies);
  if (shouldRun("--pages")) tasks.push(syncPages);
  if (shouldRun("--shop")) tasks.push(syncShopDetails);
  if (shouldRun("--menus")) tasks.push(syncMenus);
  if (shouldRun("--privacy-audit")) tasks.push(auditPrivacyTerms);
  if (shouldRun("--metafields")) tasks.push(auditMetafields);

  if (!tasks.length) {
    console.log(`GMC Admin Sync — no task flags. Use --all or one of:
  --policies --pages --shop --menus --privacy-audit --metafields
Add --dry-run to preview. Add --clear-conflicts with --metafields to delete stale values.`);
    process.exit(0);
  }

  log(`GMC Admin Sync starting (${DRY_RUN ? "DRY RUN" : "LIVE"})`);
  for (const task of tasks) {
    await task();
  }
  log("Done.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
