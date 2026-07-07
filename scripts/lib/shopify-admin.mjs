/**
 * Minimal Shopify Admin GraphQL client.
 *
 * Two transports:
 *   - Default: direct fetch using SHOPIFY_STORE + SHOPIFY_ADMIN_TOKEN.
 *   - CLI: if SHOPIFY_CLI_STORE is set (myshopify.com domain), operations run
 *     through `shopify store execute`, using the CLI's stored store auth
 *     (`shopify store auth --store <domain>`). Useful when no admin token is
 *     available.
 *
 * No external deps — Node 18+ has global fetch.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

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

async function adminGraphQLViaCli(query, variables = {}) {
  const store = process.env.SHOPIFY_CLI_STORE.trim();
  const args = [
    "store",
    "execute",
    "--store",
    store,
    "--json",
    "--no-color",
    "--query",
    query,
  ];
  if (variables && Object.keys(variables).length) {
    args.push("--variables", JSON.stringify(variables));
  }
  const isMutation = /^\s*mutation\b/m.test(query);
  if (isMutation) args.push("--allow-mutations");

  let stdout;
  try {
    ({ stdout } = await execFileAsync("shopify", args, {
      maxBuffer: 16 * 1024 * 1024,
      env: {
        ...process.env,
        SHOPIFY_CLI_AGENT_INFO:
          process.env.SHOPIFY_CLI_AGENT_INFO || "n:cursor|v:1.0|p:cursor",
      },
    }));
  } catch (err) {
    throw new Error(
      `shopify store execute failed:\n${err.stderr || err.stdout || err.message}`,
    );
  }

  // Output may contain CLI status lines before the JSON payload.
  const jsonStart = stdout.indexOf("{");
  if (jsonStart === -1) {
    throw new Error(`shopify store execute returned no JSON:\n${stdout}`);
  }
  return JSON.parse(stdout.slice(jsonStart));
}

export async function adminGraphQL(query, variables = {}) {
  if (process.env.SHOPIFY_CLI_STORE && process.env.SHOPIFY_CLI_STORE.trim()) {
    return adminGraphQLViaCli(query, variables);
  }
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
