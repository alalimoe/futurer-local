#!/usr/bin/env node
/**
 * Build a Matrixify Metaobjects CSV that appends missing curated `evidence_claim`
 * handles to each `evidence_snapshot.claims_list`, using a Matrixify-exported xlsx
 * as the source of current IDs + claims_list values.
 *
 * Inputs:
 *   --export <path.xlsx>   Matrixify Metaobjects export (required unless --rollback-from)
 *   --only=peptides|nootropics   Restrict which JSON folder is read
 *
 * Rollback (revert to pre-import claims_list):
 *   --rollback-from <snapshot-links.rollback.json|snapshot-links.preview.md>
 *   Writes snapshot-links.revert.csv next to the rollback file's directory.
 *
 * Outputs (under ./data/matrixify/):
 *   snapshot-links.csv       — Matrixify import (only snapshots that change)
 *   snapshot-links.preview.md — Human diff + embedded rollback JSON for --rollback-from
 *   snapshot-links.rollback.json — Machine-readable "before" state
 *
 * Verify (local preflight before Matrixify):
 *   node generate-snapshot-link-csv.mjs --verify-append
 *   Checks snapshot-links.csv vs snapshot-links.rollback.json: each Value's
 *   token list must start with the saved `claimsListBefore` tokens (append-only).
 *
 * Run:
 *   node generate-snapshot-link-csv.mjs --export ~/Downloads/Export_....xlsx
 */

import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

import { toCSV } from "./lib/csv.mjs";

const TYPE_SNAPSHOT = "evidence_snapshot";
const FIELD_CLAIMS = "claims_list";

/** JSON `productHandle` → production `evidence_snapshot` handle (never fuzzy-match). */
const SNAPSHOT_HANDLE_OVERRIDES = {
  "phenibut-hcl": "phenibut-evidence-snapshot",
  "ghk-cu-50-mg-100-mg": "ghk-cu-copper-tripeptide-1-evidence-snapshot",
  "tb-500-thymosin-beta-4": "tb-500-evidence-snapshot",
  "semax-peptide-5mg-10mg": "semax-evidence-snapshot",
  "oxytocin-10-mg": "oxytocin-evidence-snapshot",
  "ashwagandha-ksm-66": "ksm-66-evidence-snapshot",
  "magnesium-glycinate": "magnesium-evidence-snapshot",
  "phenylpiracetam-hydrazide": "phenylpiracetam-evidence-snapshot",
};

const here = dirname(fileURLToPath(import.meta.url));
const peptidesDir = join(here, "data", "peptides");
const nootropicsDir = join(here, "data", "nootropics");
const outDir = join(here, "data", "matrixify");

const argv = process.argv.slice(2);
const exportPath = parseArg(argv, "--export");
const rollbackFrom = parseArg(argv, "--rollback-from");
const onlyArg = parseOnlyArg(argv);
const verifyAppend = argv.includes("--verify-append");

if (rollbackFrom) {
  await runRollback(rollbackFrom);
  process.exit(0);
}

if (verifyAppend) {
  await verifyAppendOnly();
  process.exit(0);
}

if (!exportPath) {
  console.error(
    "Usage: node generate-snapshot-link-csv.mjs --export <path.xlsx> [--only=peptides|nootropics]\n" +
      "       node generate-snapshot-link-csv.mjs --rollback-from <snapshot-links.rollback.json|snapshot-links.preview.md>\n" +
      "       node generate-snapshot-link-csv.mjs --verify-append",
  );
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const sheetXml = readXlsxEntry(exportPath, resolveMetaobjectsSheetPath(exportPath));
const table = parseSheetXml(sheetXml);
const snapshots = buildSnapshotMap(table);

const products = await loadProducts(onlyArg);
const snapshotHandlesInExport = new Set(snapshots.keys());

let noOp = 0;
let missingSnapshot = [];
const changes = [];

for (const p of products) {
  const targetHandle =
    SNAPSHOT_HANDLE_OVERRIDES[p.productHandle] ??
    `${p.productHandle}-evidence-snapshot`;

  if (!snapshotHandlesInExport.has(targetHandle)) {
    missingSnapshot.push({ json: p.productHandle ?? p.peptide, targetHandle });
    continue;
  }

  const snap = snapshots.get(targetHandle);
  const claimHandles = (p.claims ?? []).map((c) => c.handle).filter(Boolean);
  const existing = snap.claimTokens;
  const missing = [];

  for (const h of claimHandles) {
    const token = `evidence_claim.${h}`;
    if (!existing.includes(token)) missing.push(token);
  }

  if (missing.length === 0) {
    noOp++;
    continue;
  }

  const newTokens = [...existing, ...missing];
  const beforeRaw = existing.join(", ");
  const afterRaw = newTokens.join(", ");

  changes.push({
    id: snap.id,
    handle: snap.handle,
    beforeRaw,
    afterRaw,
    addedHandles: missing.map((t) => t.replace(/^evidence_claim\./, "")),
    beforeTokens: [...existing],
    afterTokens: newTokens,
  });
}

if (missingSnapshot.length) {
  console.error(
    "Abort: snapshot handle not found in export for the following JSON productHandle → expected snapshot:",
  );
  for (const m of missingSnapshot) {
    console.error(`  ${m.json} → ${m.targetHandle}`);
  }
  process.exit(1);
}

const rollbackPayload = {
  version: 1,
  exportPath,
  generatedAt: new Date().toISOString(),
  snapshots: changes.map((c) => ({
    id: c.id,
    handle: c.handle,
    claimsListBefore: c.beforeRaw,
  })),
};

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

const csvRows = changes.map((c) => ({
  ID: c.id,
  Handle: c.handle,
  Command: "MERGE",
  Status: "",
  "Definition: Handle": TYPE_SNAPSHOT,
  "Top Row": "TRUE",
  Field: FIELD_CLAIMS,
  Value: c.afterRaw,
}));

const csvPath = join(outDir, "snapshot-links.csv");
const previewPath = join(outDir, "snapshot-links.preview.md");
const rollbackPath = join(outDir, "snapshot-links.rollback.json");

const csvBody =
  changes.length === 0 ? toCSV([], columns) : toCSV(csvRows, columns);
await writeFile(csvPath, csvBody, "utf8");
await writeFile(rollbackPath, JSON.stringify(rollbackPayload, null, 2), "utf8");

const previewMd = buildPreviewMarkdown({
  exportPath,
  onlyArg,
  changes,
  products: products.length,
  noOp,
  rollbackPayload,
});
await writeFile(previewPath, previewMd, "utf8");

console.log("\nSummary");
console.log(`  JSON products scanned: ${products.length}`);
console.log(`  Snapshots unchanged (all claims already linked): ${noOp}`);
console.log(`  Snapshots to update: ${changes.length}`);
console.log(
  `  Claim links appended: ${changes.reduce((n, c) => n + c.addedHandles.length, 0)}`,
);
console.log("\nWrote:");
console.log(`  ${csvPath}`);
console.log(`  ${previewPath}`);
console.log(`  ${rollbackPath}`);
if (changes.length === 0) {
  console.log(
    "\n(snapshot-links.csv is header-only — nothing to import; idempotent.)",
  );
}

// ---------- rollback ----------

async function runRollback(fromPath) {
  const abs = fromPath.startsWith("/") ? fromPath : join(process.cwd(), fromPath);
  let payload;
  if (extname(abs).toLowerCase() === ".md") {
    const md = await readFile(abs, "utf8");
    payload = parseRollbackFromMarkdown(md);
  } else {
    payload = JSON.parse(await readFile(abs, "utf8"));
  }

  const dir = dirname(abs);
  const revertRows = (payload.snapshots ?? []).map((s) => ({
    ID: s.id,
    Handle: s.handle,
    Command: "MERGE",
    Status: "",
    "Definition: Handle": TYPE_SNAPSHOT,
    "Top Row": "TRUE",
    Field: FIELD_CLAIMS,
    Value: s.claimsListBefore ?? "",
  }));

  const cols = [
    "ID",
    "Handle",
    "Command",
    "Status",
    "Definition: Handle",
    "Top Row",
    "Field",
    "Value",
  ];
  const out = join(dir, "snapshot-links.revert.csv");
  await writeFile(out, toCSV(revertRows, cols), "utf8");
  console.log(`Wrote revert CSV: ${out}`);
  console.log(`  Rows: ${revertRows.length}`);
}

async function verifyAppendOnly() {
  const rollbackPath = join(outDir, "snapshot-links.rollback.json");
  const csvPath = join(outDir, "snapshot-links.csv");
  let payload;
  try {
    payload = JSON.parse(await readFile(rollbackPath, "utf8"));
  } catch (e) {
    throw new Error(
      `Cannot read ${rollbackPath}. Run with --export first. (${e.message})`,
    );
  }
  const csvText = await readFile(csvPath, "utf8");
  const rows = parseQuotedCsv(csvText);
  if (rows.length < 2) {
    console.log("No data rows in snapshot-links.csv — nothing to verify.");
    return;
  }
  const header = rows[0];
  const hi = header.indexOf("Handle");
  const vi = header.indexOf("Value");
  if (hi < 0 || vi < 0) {
    throw new Error("snapshot-links.csv missing Handle or Value column.");
  }
  const byHandle = new Map();
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.length <= Math.max(hi, vi)) continue;
    byHandle.set(r[hi], r[vi]);
  }

  let ok = 0;
  for (const s of payload.snapshots ?? []) {
    const afterRaw = byHandle.get(s.handle);
    if (afterRaw === undefined) {
      throw new Error(`CSV missing row for snapshot handle "${s.handle}".`);
    }
    const beforeTok = splitClaimList(s.claimsListBefore ?? "");
    const afterTok = splitClaimList(afterRaw);
    if (!isPrefixTokenList(beforeTok, afterTok)) {
      throw new Error(
        `Append-only check failed for "${s.handle}": after list does not start with before list.\n` +
          `  before (${beforeTok.length}): ${beforeTok.join(", ")}\n` +
          `  after  (${afterTok.length}): ${afterTok.join(", ")}`,
      );
    }
    ok++;
  }
  console.log(
    `verify-append: OK — ${ok} snapshot(s) have claims_list values that extend the rollback "before" lists.`,
  );
}

function isPrefixTokenList(prefix, full) {
  if (prefix.length > full.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (prefix[i] !== full[i]) return false;
  }
  return true;
}

/** RFC4180-ish: one line, quoted fields, comma-separated. */
function parseQuotedCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
    } else if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseQuotedCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  return lines.map(parseQuotedCsvLine);
}

function parseRollbackFromMarkdown(md) {
  const m = md.match(
    /<!--\s*snapshot-links:rollback-json\s*([\s\S]*?)\s*-->/,
  );
  if (!m) {
    throw new Error(
      "No <!-- snapshot-links:rollback-json ... --> block found in preview markdown.",
    );
  }
  return JSON.parse(m[1].trim());
}

// ---------- xlsx (unzip -p) ----------

function readXlsxEntry(zipPath, entryPath) {
  try {
    return execFileSync("unzip", ["-p", zipPath, entryPath], {
      encoding: "utf8",
      maxBuffer: 100 * 1024 * 1024,
    });
  } catch (e) {
    throw new Error(
      `Failed to read "${entryPath}" from "${zipPath}" (is 'unzip' installed?). ${e.message}`,
    );
  }
}

function resolveMetaobjectsSheetPath(zipPath) {
  const wb = readXlsxEntry(zipPath, "xl/workbook.xml");
  const rels = readXlsxEntry(zipPath, "xl/_rels/workbook.xml.rels");
  const nameToTarget = new Map();

  const sheetRe1 = /<sheet[^>]*name="([^"]*)"[^>]*r:id="([^"]*)"/g;
  let sm;
  while ((sm = sheetRe1.exec(wb)) !== null) {
    nameToTarget.set(sm[1], sm[2]);
  }
  const sheetRe2 = /<sheet[^>]*r:id="([^"]*)"[^>]*name="([^"]*)"/g;
  while ((sm = sheetRe2.exec(wb)) !== null) {
    nameToTarget.set(sm[2], sm[1]);
  }

  const relRe = /<Relationship[^>]*Id="([^"]*)"[^>]*Target="([^"]*)"/g;
  const idToPath = new Map();
  let rm;
  while ((rm = relRe.exec(rels)) !== null) {
    let target = rm[2];
    if (!target.startsWith("/")) target = "xl/" + target.replace(/^\/?/, "");
    idToPath.set(rm[1], target);
  }

  const metaRid = nameToTarget.get("Metaobjects");
  if (metaRid && idToPath.has(metaRid)) return idToPath.get(metaRid);

  const firstRid = wb.match(/<sheet[^>]*r:id="([^"]*)"/)?.[1];
  if (firstRid && idToPath.has(firstRid)) return idToPath.get(firstRid);

  throw new Error("Could not resolve Metaobjects worksheet path from workbook.xml");
}

/**
 * @returns {{ headers: string[], rows: Record<string,string>[] }}
 */
function parseSheetXml(xml) {
  const rows = [];
  const rowBlocks = xml.matchAll(/<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g);
  for (const rm of rowBlocks) {
    const rowNum = Number(rm[1]);
    const inner = rm[2];
    const cells = [];
    const cellRe = /<c([^>]*)>([\s\S]*?)<\/c>/g;
    let cm;
    while ((cm = cellRe.exec(inner)) !== null) {
      const attrs = cm[1];
      const body = cm[2];
      const rMatch = attrs.match(/\br="([A-Z]+)(\d+)"/i);
      if (!rMatch) continue;
      const colLetters = rMatch[1];
      const tMatch = attrs.match(/\bt="([^"]+)"/);
      const type = tMatch ? tMatch[1] : "";
      const val = extractCellValue(body, type);
      cells.push({ col: colLettersToIndex(colLetters), val });
    }
    cells.sort((a, b) => a.col - b.col);
    rows.push({ rowNum, cells });
  }
  rows.sort((a, b) => a.rowNum - b.rowNum);

  if (rows.length === 0) throw new Error("No rows found in worksheet XML");

  const headerCells = rows[0].cells;
  const headers = [];
  let maxCol = 0;
  for (const c of headerCells) {
    headers[c.col] = c.val;
    if (c.col > maxCol) maxCol = c.col;
  }
  const headerList = [];
  for (let i = 0; i <= maxCol; i++) headerList.push(headers[i] ?? "");

  const outRows = [];
  for (let i = 1; i < rows.length; i++) {
    const rec = {};
    for (const c of rows[i].cells) {
      const key = headerList[c.col];
      if (key) rec[key] = c.val;
    }
    outRows.push(rec);
  }
  return { headers: headerList, rows: outRows };
}

function extractCellValue(body, type) {
  if (type === "inlineStr") {
    const parts = [];
    const tRe = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let tm;
    while ((tm = tRe.exec(body)) !== null) {
      parts.push(decodeXmlEntities(tm[1]));
    }
    return parts.join("");
  }
  const vMatch = body.match(/<v>([\s\S]*?)<\/v>/);
  if (vMatch) {
    const raw = vMatch[1].trim();
    if (type === "b") return raw === "1" ? "TRUE" : "FALSE";
    return decodeXmlEntities(raw);
  }
  return "";
}

function decodeXmlEntities(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function colLettersToIndex(letters) {
  let n = 0;
  for (const ch of letters.toUpperCase()) {
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n - 1;
}

/**
 * @param {{ headers: string[], rows: Record<string,string>[] }} table
 * @returns {Map<string, { id: string, handle: string, claimTokens: string[] }>}
 */
function buildSnapshotMap(table) {
  const byHandle = new Map();

  for (const row of table.rows) {
    if (row["Definition: Handle"] !== TYPE_SNAPSHOT) continue;
    const handle = row.Handle?.trim();
    const id = row.ID?.trim();
    if (!handle || !id) continue;

    let cur = byHandle.get(handle);
    if (!cur) {
      cur = { id, handle, fields: {} };
      byHandle.set(handle, cur);
    }
    const field = row.Field?.trim();
    const value = row.Value ?? "";
    if (field) cur.fields[field] = value;
  }

  const out = new Map();
  for (const [handle, cur] of byHandle) {
    const raw = cur.fields[FIELD_CLAIMS] ?? "";
    const claimTokens = splitClaimList(raw);
    out.set(handle, { id: cur.id, handle, claimTokens });
  }
  return out;
}

function splitClaimList(raw) {
  if (!raw || !String(raw).trim()) return [];
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function loadProducts(only) {
  const dirs = [];
  if (only === "peptides") dirs.push(peptidesDir);
  else if (only === "nootropics") dirs.push(nootropicsDir);
  else {
    dirs.push(peptidesDir, nootropicsDir);
  }
  const out = [];
  for (const dir of dirs) {
    let entries;
    try {
      entries = await readdir(dir);
    } catch (e) {
      if (e.code === "ENOENT") continue;
      throw e;
    }
    const files = entries
      .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
      .sort();
    for (const f of files) {
      const raw = await readFile(join(dir, f), "utf8");
      out.push(JSON.parse(raw));
    }
  }
  return out;
}

function buildPreviewMarkdown({
  exportPath,
  onlyArg,
  changes,
  products,
  noOp,
  rollbackPayload,
}) {
  const lines = [
    "# snapshot-links preview",
    "",
    `- **Export:** \`${exportPath}\``,
    `- **JSON filter:** ${onlyArg ?? "peptides + nootropics"}`,
    `- **Products in JSON:** ${products}`,
    `- **Snapshots unchanged:** ${noOp}`,
    `- **Snapshots updated:** ${changes.length}`,
    "",
    "Each block shows **append-only** `claims_list` changes (existing order preserved, missing curated handles appended).",
    "",
  ];

  for (const c of changes) {
    lines.push(`## \`${c.handle}\``);
    lines.push("");
    lines.push(`- **Shopify metaobject ID:** \`${c.id}\``);
    lines.push(`- **Added claim handles:** ${c.addedHandles.map((h) => `\`${h}\``).join(", ")}`);
    lines.push("");
    lines.push("**Before (raw `claims_list`):**");
    lines.push("");
    lines.push("```text");
    lines.push(c.beforeRaw || "(empty)");
    lines.push("```");
    lines.push("");
    lines.push("**After (raw `claims_list`):**");
    lines.push("");
    lines.push("```text");
    lines.push(c.afterRaw);
    lines.push("```");
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("## Rollback");
  lines.push("");
  lines.push(
    "Machine-readable state is in `snapshot-links.rollback.json`. To generate a Matrixify **revert** CSV:",
  );
  lines.push("");
  lines.push("```bash");
  lines.push(
    "node generate-snapshot-link-csv.mjs --rollback-from data/matrixify/snapshot-links.rollback.json",
  );
  lines.push("```");
  lines.push("");
  lines.push(
    "Or pass this preview file to `--rollback-from` — the JSON block below is parsed.",
  );
  lines.push("");
  lines.push("<!-- snapshot-links:rollback-json");
  lines.push(JSON.stringify(rollbackPayload));
  lines.push("-->");

  return lines.join("\n");
}

function parseArg(argv, name) {
  const pref = `${name}=`;
  for (const arg of argv) {
    if (arg === name) {
      const idx = argv.indexOf(arg);
      return argv[idx + 1];
    }
    if (arg.startsWith(pref)) return arg.slice(pref.length);
  }
  return null;
}

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
