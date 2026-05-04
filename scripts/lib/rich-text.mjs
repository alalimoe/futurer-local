/**
 * Build a Shopify rich_text_field JSON value.
 *
 * Schema reference:
 *   https://shopify.dev/docs/api/admin-graphql/latest/scalars/RichText
 *
 * We render a single paragraph: <sentence> [PubMed]
 * with [PubMed] linked to the study URL, target=_blank, with a title attr.
 */
export function buildClaimNotesRichText({ sentence, pubmedUrl, linkTitle }) {
  if (!sentence || sentence.trim() === "") {
    throw new Error("buildClaimNotesRichText: sentence is required");
  }

  const paragraphChildren = [
    { type: "text", value: sentence.trim() + " " },
  ];

  if (pubmedUrl && pubmedUrl.trim() !== "") {
    paragraphChildren.push({
      type: "link",
      url: pubmedUrl.trim(),
      title: linkTitle && linkTitle.trim() !== "" ? linkTitle.trim() : null,
      target: "_blank",
      children: [{ type: "text", value: "[PubMed]" }],
    });
  }

  return JSON.stringify({
    type: "root",
    children: [
      {
        type: "paragraph",
        children: paragraphChildren,
      },
    ],
  });
}

/**
 * Strip duplicate plain-text citation immediately before an inline link.
 *
 * Bad pattern (often from admin rich-text editing):
 *   text: "sentence... [PubMed ↗] ["
 *   link: children [{ text: "PubMed ↗" }]
 *   text: "]"
 *
 * Keeps the link node and sentence text only.
 *
 * @param {string} jsonString - Shopify rich_text_field JSON string
 * @returns {string|null} Cleaned JSON string, or null if unchanged / invalid
 */
export function cleanNotesJson(jsonString) {
  if (!jsonString || typeof jsonString !== "string") return null;

  let root;
  try {
    root = JSON.parse(jsonString);
  } catch {
    return null;
  }

  if (!root || root.type !== "root" || !Array.isArray(root.children)) {
    return null;
  }

  const clone = JSON.parse(JSON.stringify(root));
  let modified = false;

  /** Trailing "[anything] [" before a link — duplicate of the linked label */
  const dupBeforeLink = /\s*\[[^\]]*\]\s*\[$/;

  /**
   * @param {unknown[]} children
   * @returns {{ children: unknown[], changed: boolean }}
   */
  function cleanParagraphChildren(children) {
    const result = [];
    let i = 0;
    let changed = false;

    while (i < children.length) {
      const node = children[i];
      const next = children[i + 1];
      const after = children[i + 2];

      if (
        node &&
        typeof node === "object" &&
        node.type === "text" &&
        typeof node.value === "string" &&
        next &&
        typeof next === "object" &&
        next.type === "link" &&
        after &&
        typeof after === "object" &&
        after.type === "text" &&
        typeof after.value === "string" &&
        dupBeforeLink.test(node.value)
      ) {
        changed = true;
        const trimmed = node.value.replace(dupBeforeLink, "").replace(/\s+$/, "");
        const textValue = trimmed.length === 0 ? "" : `${trimmed} `;
        result.push({ type: "text", value: textValue });
        result.push(JSON.parse(JSON.stringify(next)));

        const afterTrim = after.value.trim();
        if (afterTrim === "]" || afterTrim === "") {
          i += 3;
          continue;
        }

        const bracketRest = after.value.match(/^\s*\]\s*(.*)$/s);
        if (bracketRest) {
          if (bracketRest[1]) {
            result.push({ type: "text", value: bracketRest[1] });
          }
          i += 3;
          continue;
        }

        result.push(JSON.parse(JSON.stringify(after)));
        i += 3;
        continue;
      }

      result.push(node);
      i += 1;
    }

    return { children: result, changed };
  }

  for (const block of clone.children) {
    if (
      block &&
      typeof block === "object" &&
      block.type === "paragraph" &&
      Array.isArray(block.children)
    ) {
      const { children: nextChildren, changed } = cleanParagraphChildren(
        block.children,
      );
      if (changed) {
        modified = true;
        block.children = nextChildren;
      }
    }
  }

  if (!modified) return null;

  const out = JSON.stringify(clone);
  if (out === jsonString) return null;
  return out;
}
