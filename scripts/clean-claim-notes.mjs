#!/usr/bin/env node
/**
 * Remove duplicate plain-text PubMed citations from evidence_claim.notes (rich text JSON).
 *
 * Flags:
 *   --dry-run           Print changes only; no API writes
 *   --handle=<handle>   Process a single evidence_claim handle (spot-check)
 *
 * Requires scripts/.env with SHOPIFY_STORE and SHOPIFY_ADMIN_TOKEN (write_metaobjects).
 *
 * Examples:
 *   node clean-claim-notes.mjs --dry-run
 *   node clean-claim-notes.mjs --handle=claim-l-theanine-focus-caffeine --dry-run
 *   node clean-claim-notes.mjs
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { adminGraphQL, metaobjectUpsert } from "./lib/shopify-admin.mjs";
import { cleanNotesJson } from "./lib/rich-text.mjs";

const TYPE_CLAIM = "evidence_claim";

const args = process.argv.slice(2);
const flags = {
  dryRun: args.includes("--dry-run"),
  handle: undefined,
};
for (const a of args) {
  if (a.startsWith("--handle=")) {
    flags.handle = a.slice("--handle=".length).trim();
  }
}

async function loadEnv() {
  const here = dirname(fileURLToPath(import.meta.url));
  const envPath = join(here, ".env");
  try {
    const raw = await readFile(envPath, "utf8");
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
  return here;
}

const QUERY_PAGE = /* GraphQL */ `
  query MetaobjectsEvidenceClaims($type: String!, $cursor: String) {
    metaobjects(type: $type, first: 50, after: $cursor) {
      edges {
        node {
          handle
          fields {
            key
            value
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const QUERY_ONE = /* GraphQL */ `
  query MetaobjectEvidenceClaim($type: String!, $handle: String!) {
    metaobject(handle: { type: $type, handle: $handle }) {
      handle
      fields {
        key
        value
      }
    }
  }
`;

async function fetchAllClaims() {
  const nodes = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await adminGraphQL(QUERY_PAGE, {
      type: TYPE_CLAIM,
      cursor,
    });
    const conn = data.metaobjects;
    for (const edge of conn.edges) {
      nodes.push(edge.node);
    }
    hasNextPage = conn.pageInfo.hasNextPage;
    cursor = conn.pageInfo.endCursor || null;
  }

  return nodes;
}

async function fetchClaimByHandle(handle) {
  const data = await adminGraphQL(QUERY_ONE, {
    type: TYPE_CLAIM,
    handle,
  });
  return data.metaobject;
}

function fieldsToUpsertInput(fields, notesValue) {
  return fields.map((f) =>
    f.key === "notes" ? { key: f.key, value: notesValue } : { key: f.key, value: f.value },
  );
}

async function processNode(node, dryRun) {
  const notesField = (node.fields || []).find((f) => f.key === "notes");
  if (!notesField || notesField.value == null || notesField.value === "") {
    return { status: "skip", reason: "no notes" };
  }

  const cleaned = cleanNotesJson(notesField.value);
  if (cleaned == null) {
    return { status: "skip", reason: "already clean or unparsable" };
  }

  if (dryRun) {
    console.log(`[dry-run] ${TYPE_CLAIM}/${node.handle}`);
    console.log(`  before: ${notesField.value.slice(0, 160)}…`);
    console.log(`  after:  ${cleaned.slice(0, 160)}…`);
    return { status: "dry", reason: "" };
  }

  const fields = fieldsToUpsertInput(node.fields, cleaned);
  await metaobjectUpsert({
    type: TYPE_CLAIM,
    handle: node.handle,
    fields,
  });
  console.log(`[ok] ${TYPE_CLAIM}/${node.handle}`);
  return { status: "updated", reason: "" };
}

(async () => {
  await loadEnv();

  let nodes;
  if (flags.handle) {
    const one = await fetchClaimByHandle(flags.handle);
    if (!one) {
      console.error(`No metaobject found: ${TYPE_CLAIM}/${flags.handle}`);
      process.exit(1);
    }
    nodes = [one];
  } else {
    nodes = await fetchAllClaims();
  }

  if (flags.dryRun) {
    console.log("DRY RUN — no writes.\n");
  } else {
    console.log(
      `Live run on ${nodes.length} metaobject(s) (${process.env.SHOPIFY_STORE || "<store>"})\n`,
    );
  }

  let updated = 0;
  let skipped = 0;
  let dry = 0;

  for (const node of nodes) {
    try {
      const r = await processNode(node, flags.dryRun);
      if (r.status === "updated") updated++;
      else if (r.status === "dry") dry++;
      else skipped++;
    } catch (err) {
      console.error(`[error] ${node.handle}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  console.log(
    `\nDone. updated=${updated} skipped=${skipped}${flags.dryRun ? ` would_update=${dry}` : ""}`,
  );
})();
