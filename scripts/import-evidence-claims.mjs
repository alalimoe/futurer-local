#!/usr/bin/env node
/**
 * Evidence-claim importer (Admin API path).
 *
 * Idempotently upserts the 25 evidence_claim metaobjects defined in
 * data/peptides/<handle>.json. The Nootropix `evidence_claim` schema is just
 * { headline, notes }, so that's all this script writes — no separate source
 * metaobjects, no snapshot, no product metafield. After import, link each
 * claim to its evidence_snapshot manually in admin.
 *
 * Per peptide it does:
 *   For each claim:
 *     metaobjectUpsert(type=evidence_claim, handle=claim-<peptide>-<slug>)
 *       fields: headline (string), notes (rich-text JSON with inline [PubMed])
 *
 * Existing claims (any handle not present in the JSON files) are NOT touched.
 *
 * Flags:
 *   --peptide=<handle>   Run only this peptide JSON file
 *   --all                Run every JSON file in ./data/peptides
 *   --dry-run            Print everything that WOULD happen, no API writes
 *
 * Examples:
 *   node import-evidence-claims.mjs --peptide=bpc-157 --dry-run
 *   node import-evidence-claims.mjs --all --dry-run
 *   node import-evidence-claims.mjs --all
 */

import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { metaobjectUpsert } from "./lib/shopify-admin.mjs";
import { buildClaimNotesRichText } from "./lib/rich-text.mjs";

// Must match the metaobject definition in admin.
const TYPE_CLAIM = "evidence_claim";
const FIELD_CLAIM_HEADLINE = "headline";
const FIELD_CLAIM_NOTES = "notes";

// ---------- arg parsing ----------

const args = process.argv.slice(2);
const flags = {
  dryRun: args.includes("--dry-run"),
  all: args.includes("--all"),
  peptide: undefined,
};
for (const a of args) {
  if (a.startsWith("--peptide=")) {
    flags.peptide = a.slice("--peptide=".length).trim();
  }
}

if (!flags.all && !flags.peptide) {
  console.error(
    "Usage: import-evidence-claims.mjs (--peptide=<handle> | --all) [--dry-run]",
  );
  process.exit(2);
}

// ---------- env loader (zero-dep .env reader) ----------

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
    // .env is optional — fall back to ambient env
  }
  return here;
}

// ---------- helpers ----------

function logSection(title) {
  console.log(`\n=== ${title} ===`);
}

function logStep(prefix, msg) {
  console.log(`  ${prefix} ${msg}`);
}

async function loadPeptideFiles(rootDir) {
  const dataDir = join(rootDir, "data", "peptides");
  if (flags.peptide) {
    const file = join(dataDir, `${flags.peptide}.json`);
    return [{ name: flags.peptide, path: file }];
  }
  const all = await readdir(dataDir);
  return all
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => ({ name: f.replace(/\.json$/, ""), path: join(dataDir, f) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function loadJSON(path) {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw);
}

function validatePayload(payload, fileLabel) {
  const errors = [];
  if (!Array.isArray(payload.claims) || payload.claims.length === 0) {
    errors.push("claims[] is empty");
  } else {
    payload.claims.forEach((c, i) => {
      if (!c.handle) errors.push(`claims[${i}].handle missing`);
      if (!c.headline) errors.push(`claims[${i}].headline missing`);
      if (!c.notesSentence) errors.push(`claims[${i}].notesSentence missing`);
      if (!c.source?.pubmedUrl)
        errors.push(`claims[${i}].source.pubmedUrl missing`);
    });
  }
  if (errors.length) {
    throw new Error(
      `Payload validation failed for ${fileLabel}:\n  - ${errors.join("\n  - ")}`,
    );
  }
}

async function runPeptide(payload, fileLabel) {
  logSection(`${payload.peptide || fileLabel} (${fileLabel})`);
  validatePayload(payload, fileLabel);

  for (const claim of payload.claims) {
    const notesValue = buildClaimNotesRichText({
      sentence: claim.notesSentence,
      pubmedUrl: claim.source.pubmedUrl,
      linkTitle: claim.source.linkTitle,
    });
    const fields = [
      { key: FIELD_CLAIM_HEADLINE, value: claim.headline },
      { key: FIELD_CLAIM_NOTES, value: notesValue },
    ];

    if (flags.dryRun) {
      logStep(
        "[dry]",
        `upsert ${TYPE_CLAIM}/${claim.handle}  "${claim.headline}"`,
      );
      continue;
    }

    const created = await metaobjectUpsert({
      type: TYPE_CLAIM,
      handle: claim.handle,
      fields,
    });
    logStep(
      "[ok]",
      `${TYPE_CLAIM}/${created.handle} -> ${created.id}  "${claim.headline}"`,
    );
  }
}

(async () => {
  const rootDir = await loadEnv();
  const files = await loadPeptideFiles(rootDir);
  if (files.length === 0) {
    console.error("No peptide JSON files matched.");
    process.exit(1);
  }

  if (flags.dryRun) {
    console.log("DRY RUN — no API writes will occur.");
  } else {
    console.log(
      `Live run against ${process.env.SHOPIFY_STORE || "<store>"} (api ${process.env.SHOPIFY_API_VERSION || "2025-01"})`,
    );
  }

  for (const f of files) {
    const payload = await loadJSON(f.path);
    try {
      await runPeptide(payload, f.name);
    } catch (err) {
      console.error(`\n[error] ${f.name}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  console.log("\nDone. Reminder: link the new claims to their snapshots manually in admin.");
})();
