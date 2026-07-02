/**
 * Build the HTML representation of a claim's `notes` field.
 *
 * Matrixify accepts HTML for Shopify rich-text fields and converts it to the
 * underlying rich-text JSON during import. Using HTML keeps the CSV cell
 * human-readable.
 *
 * Mirrors the structure produced by lib/rich-text.mjs so the Admin-API and
 * Matrixify paths render identically on the storefront.
 */

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildClaimNotesHTML({ sentence, pubmedUrl, linkTitle }) {
  if (!sentence || sentence.trim() === "") {
    throw new Error("buildClaimNotesHTML: sentence is required");
  }
  const text = escapeText(sentence.trim());
  if (!pubmedUrl) {
    return `<p>${text}</p>`;
  }
  const url = escapeAttr(pubmedUrl.trim());
  const titleAttr =
    linkTitle && linkTitle.trim() !== ""
      ? ` title="${escapeAttr(linkTitle.trim())}"`
      : "";
  return `<p>${text} <a href="${url}"${titleAttr} target="_blank">[PubMed]</a></p>`;
}
