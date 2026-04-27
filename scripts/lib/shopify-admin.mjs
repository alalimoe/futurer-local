/**
 * Minimal Shopify Admin GraphQL client.
 *
 * Reads SHOPIFY_STORE and SHOPIFY_ADMIN_TOKEN from the environment.
 * Uses the 2025-01 Admin API by default.
 *
 * No external deps — Node 18+ has global fetch.
 */

const API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-01";

function requireEnv(name) {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new Error(
      `Missing required env var: ${name}. Copy scripts/.env.example to scripts/.env and fill it in.`,
    );
  }
  return v.trim();
}

export function getStoreDomain() {
  const raw = requireEnv("SHOPIFY_STORE");
  return raw.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export async function adminGraphQL(query, variables = {}) {
  const store = getStoreDomain();
  const token = requireEnv("SHOPIFY_ADMIN_TOKEN");
  const url = `https://${store}/admin/api/${API_VERSION}/graphql.json`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Admin GraphQL HTTP ${res.status} ${res.statusText}\n${text}`,
    );
  }

  const json = await res.json();
  if (json.errors && json.errors.length) {
    throw new Error(
      `Admin GraphQL errors:\n${JSON.stringify(json.errors, null, 2)}`,
    );
  }
  return json.data;
}

/**
 * Upsert a metaobject keyed on (type, handle).
 * Returns the metaobject record { id, handle, type }.
 */
export async function metaobjectUpsert({ type, handle, fields }) {
  const query = /* GraphQL */ `
    mutation MetaobjectUpsert(
      $handle: MetaobjectHandleInput!
      $metaobject: MetaobjectUpsertInput!
    ) {
      metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
        metaobject {
          id
          handle
          type
        }
        userErrors {
          field
          code
          message
        }
      }
    }
  `;

  const variables = {
    handle: { type, handle },
    metaobject: { fields },
  };

  const data = await adminGraphQL(query, variables);
  const result = data.metaobjectUpsert;
  if (result.userErrors && result.userErrors.length) {
    throw new Error(
      `metaobjectUpsert userErrors for ${type}/${handle}:\n` +
        JSON.stringify(result.userErrors, null, 2),
    );
  }
  return result.metaobject;
}

/**
 * Look up a product by handle. Returns { id, handle, title } or null.
 */
export async function getProductByHandle(handle) {
  const query = /* GraphQL */ `
    query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        title
      }
    }
  `;
  const data = await adminGraphQL(query, { handle });
  return data.productByHandle;
}

/**
 * Set a single metafield on a product (namespace.key) to a metaobject reference.
 */
export async function setProductMetaobjectMetafield({
  productId,
  namespace,
  key,
  metaobjectId,
  metaobjectType,
}) {
  const query = /* GraphQL */ `
    mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          type
          value
        }
        userErrors {
          field
          code
          message
        }
      }
    }
  `;

  const variables = {
    metafields: [
      {
        ownerId: productId,
        namespace,
        key,
        type: `metaobject_reference`,
        value: metaobjectId,
      },
    ],
  };

  // metaobjectType is currently informational — kept in the API surface
  // in case we later switch to a typed mixed_reference.
  void metaobjectType;

  const data = await adminGraphQL(query, variables);
  const result = data.metafieldsSet;
  if (result.userErrors && result.userErrors.length) {
    throw new Error(
      `metafieldsSet userErrors:\n` +
        JSON.stringify(result.userErrors, null, 2),
    );
  }
  return result.metafields[0];
}
