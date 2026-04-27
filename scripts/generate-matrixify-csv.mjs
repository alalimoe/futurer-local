#!/usr/bin/env node
/**
 * Generate a Matrixify CSV of claim metaobjects from the JSON source-of-truth.
 *
 * Source data lives in:
 *   ./data/peptides/    — peptide products (already imported)
 *   ./data/nootropics/  — nootropic products (new batch)
 *
 * Output: ./data/matrixify/<file>.csv
 *   - One file per evidence_claim metaobject group
 *   - Long Matrixify Metaobjects format: 2 rows per claim (headline + notes)
 *   - Columns: ID, Handle, Command, Status, Definition: Handle, Top Row,
 *     Field, Value
 *   - Notes is HTML with the inline [PubMed] link; Matrixify converts it to
 *     Shopify rich-text JSON during import.
 *
 * The Nootropix `evidence_claim` schema is two fields only (headline, notes),
 * so we do not emit a separate source metaobject layer. After import, link
 * each claim to its evidence_snapshot manually in admin.
 *
 * CLI flags:
 *   (no flag)            → scan both peptides/ and nootropics/, write claims.csv
 *   --only=peptides      → scan peptides/ only, write claims.csv
 *   --only=nootropics    → scan nootropics/ only, write claims-nootropics.csv
 *
 * Run:
 *   node generate-matrixify-csv.mjs
 *   node generate-matrixify-csv.mjs --only=nootropics
 */

import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { toCSV } from "./lib/csv.mjs";
import { buildClaimNotesHTML } from "./lib/rich-text-html.mjs";

// Must match the metaobject definition in admin.
const TYPE_CLAIM = "evidence_claim";

const here = dirname(fileURLToPath(import.meta.url));
const peptidesDir = join(here, "data", "peptides");
const nootropicsDir = join(here, "data", "nootropics");
const outDir = join(here, "data", "matrixify");

const onlyArg = parseOnlyArg(process.argv.slice(2));

await mkdir(outDir, { recursive: true });

const written = [];

if (onlyArg === "nootropics") {
  const products = await loadProducts(nootropicsDir);
  await writeClaimsCSV(products, "claims-nootropics.csv");
  written.push("claims-nootropics.csv");
} else if (onlyArg === "peptides") {
  const products = await loadProducts(peptidesDir);
  await writeClaimsCSV(products, "claims.csv");
  written.push("claims.csv");
} else {
  const peptideProducts = await loadProducts(peptidesDir);
  const nootropicProducts = await loadProducts(nootropicsDir);
  await writeClaimsCSV([...peptideProducts, ...nootropicProducts], "claims.csv");
  written.push("claims.csv");
}

console.log("\nWrote:");
for (const name of written) {
  console.log(`  ${join("scripts", "data", "matrixify", name)}`);
}

// ---------- helpers ----------

function parseOnlyArg(argv) {
  for (const arg of argv) {
    if (arg.startsWith("--only=")) {
      const value = arg.slice("--only=".length).trim();
      if (value !== "peptides" && value !== "nootropics") {
        throw new Error(
          `Invalid --only value: "${value}" (expected "peptides" or "nootropics")`,
        );
      }
      return value;
    }
  }
  return null;
}

async function loadProducts(dir) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
  const files = entries
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort();
  const out = [];
  for (const f of files) {
    const raw = await readFile(join(dir, f), "utf8");
    out.push(JSON.parse(raw));
  }
  return out;
}

async function writeClaimsCSV(products, filename) {
  // Matrixify's Metaobjects sheet uses a *long* format: one row per field,
  // not one column per field. Each metaobject thus produces N rows, where N
  // is the number of fields. The first row of each metaobject is its
  // "top row" (Top Row=TRUE) and carries Status; field-only rows below it
  // share the same Handle to be grouped with the parent.
  //
  // Column reference: https://matrixify.app/documentation/metaobjects/
  const columns = [
    "ID",
    "Handle",
    "Command",
    "Status",
    "Definition: Handle",
    "Top Row",
    "Field",
    "Value",
  ];

  const rows = [];
  for (const p of products) {
    for (const c of p.claims) {
      const notesHTML = buildClaimNotesHTML({
        sentence: c.notesSentence,
        pubmedUrl: c.source.pubmedUrl,
        linkTitle: c.source.linkTitle,
      });

      // Top row — carries Status and the headline field
      rows.push({
        ID: "",
        Handle: c.handle,
        Command: "MERGE",
        Status: "Active",
        "Definition: Handle": TYPE_CLAIM,
        "Top Row": "TRUE",
        Field: "headline",
        Value: c.headline,
      });

      // Subsequent rows — same Handle, just the next field
      rows.push({
        ID: "",
        Handle: c.handle,
        Command: "MERGE",
        Status: "",
        "Definition: Handle": TYPE_CLAIM,
        "Top Row": "FALSE",
        Field: "notes",
        Value: notesHTML,
      });
    }
  }

  const csv = toCSV(rows, columns);
  await writeFile(join(outDir, filename), csv, "utf8");
}
