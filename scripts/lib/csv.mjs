/**
 * Tiny RFC-4180-ish CSV writer.
 * Always quotes every cell to make Matrixify import predictable.
 */

function escapeCell(value) {
  if (value === null || value === undefined) return '""';
  const s = String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export function toCSV(rows, columns) {
  const header = columns.map(escapeCell).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCell(row[c])).join(","))
    .join("\r\n");
  return header + "\r\n" + body + "\r\n";
}
