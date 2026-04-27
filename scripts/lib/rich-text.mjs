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
