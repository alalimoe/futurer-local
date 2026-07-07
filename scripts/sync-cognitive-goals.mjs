#!/usr/bin/env node
/**
 * Cognitive-goals sync (Admin API path).
 *
 * Single source of truth for the outcome-first taxonomy:
 *   - data/goals.json                    -> the 6 canonical outcomes
 *   - data/{nootropics,peptides}/*.json  -> per-product "cognitiveGoals" slugs
 *
 * Idempotently performs four steps:
 *   1. Ensure the product metafield definition custom.cognitive_goals
 *      (list.single_line_text_field, useAsCollectionCondition: true) exists.
 *   2. Set each product's custom.cognitive_goals metafield via metafieldsSet.
 *   3. Ensure one smart collection per goal, with a rule
 *      PRODUCT_METAFIELD_DEFINITION EQUALS <slug> pointing at the definition,
 *      so products auto-file into outcome collections.
 *   4. Publish each goal collection to the Online Store sales channel via
 *      publishablePublish (API-created collections are unpublished by default
 *      and 404 on the storefront otherwise).
 *
 * Products whose JSON has no "cognitiveGoals" field are skipped (e.g.
 * non-cognitive peptides like BPC-157). Existing collections with the same
 * handle are updated (title, description, ruleSet), never deleted.
 *
 * Handle resolution: if the JSON has "goalProductHandles" (array), the
 * metafield is set on each of those store products (compounds usually ship
 * as multiple products: capsules + powder). Otherwise "productHandle" is used.
 *
 * Flags:
 *   --product=<handle>   Sync metafield for one product only (steps 1+2)
 *   --all                Sync everything (definition, all products, collections)
 *   --dry-run            Print everything that WOULD happen, no API calls
 *
 * Examples:
 *   node sync-cognitive-goals.mjs --all --dry-run
 *   node sync-cognitive-goals.mjs --product=noopept
 *   node sync-cognitive-goals.mjs --all
 *
 * Requires write_products, read_publications, and write_publications scopes
 * on SHOPIFY_ADMIN_TOKEN (or the Shopify CLI session when SHOPIFY_CLI_STORE
 * is set — re-auth with:
 *   shopify store auth --store <store>.myshopify.com \
 *     --scopes read_products,write_products,read_publications,write_publications
 * ).
 */

import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { adminGraphQL, getProductByHandle } from "./lib/shopify-admin.mjs";

const NAMESPACE = "custom";
const KEY = "cognitive_goals";
const METAFIELD_TYPE = "list.single_line_text_field";
const DATA_DIRS = ["nootropics", "peptides"];

// ---------- arg parsing ----------

const args = process.argv.slice(2);
const flags = {
  dryRun: args.includes("--dry-run"),
  all: args.includes("--all"),
  product: undefined,
};
for (const a of args) {
  if (a.startsWith("--product=")) {
    flags.product = a.slice("--product=".length).trim();
  }
}

if (!flags.all && !flags.product) {
  console.error(
    "Usage: sync-cognitive-goals.mjs (--product=<handle> | --all) [--dry-run]",
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

async function loadJSON(path) {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw);
}

async function loadGoals(rootDir) {
  const { goals } = await loadJSON(join(rootDir, "data", "goals.json"));
  if (!Array.isArray(goals) || goals.length === 0) {
    throw new Error("data/goals.json has no goals");
  }
  for (const g of goals) {
    for (const field of ["slug", "label", "collectionHandle", "description"]) {
      if (!g[field]) {
        throw new Error(`data/goals.json goal missing "${field}"`);
      }
    }
  }
  return goals;
}

async function loadProducts(rootDir, goalSlugs) {
  const entries = [];
  for (const dir of DATA_DIRS) {
    const dataDir = join(rootDir, "data", dir);
    const files = await readdir(dataDir);
    for (const f of files.sort()) {
      if (!f.endsWith(".json") || f.startsWith("_")) continue;
      const payload = await loadJSON(join(dataDir, f));
      const name = f.replace(/\.json$/, "");
      if (!Array.isArray(payload.cognitiveGoals)) {
        entries.push({ name, dir, skipped: true });
        continue;
      }
      const handles = Array.isArray(payload.goalProductHandles)
        ? payload.goalProductHandles
        : payload.productHandle
          ? [payload.productHandle]
          : [];
      if (handles.length === 0) {
        throw new Error(
          `${dir}/${f}: has cognitiveGoals but no goalProductHandles/productHandle`,
        );
      }
      const bad = payload.cognitiveGoals.filter((s) => !goalSlugs.has(s));
      if (bad.length) {
        throw new Error(
          `${dir}/${f}: unknown goal slug(s): ${bad.join(", ")}. ` +
            `Valid slugs: ${[...goalSlugs].join(", ")}`,
        );
      }
      entries.push({
        name,
        dir,
        productHandles: handles,
        goals: payload.cognitiveGoals,
      });
    }
  }
  return entries;
}

// ---------- step 1: metafield definition ----------

const QUERY_DEFINITION = /* GraphQL */ `
  query CognitiveGoalsDefinition(
    $ownerType: MetafieldOwnerType!
    $namespace: String
    $key: String
  ) {
    metafieldDefinitions(
      first: 1
      ownerType: $ownerType
      namespace: $namespace
      key: $key
    ) {
      nodes {
        id
        name
        useAsCollectionCondition
        type {
          name
        }
      }
    }
  }
`;

const MUTATION_CREATE_DEFINITION = /* GraphQL */ `
  mutation CreateCognitiveGoalsDefinition(
    $definition: MetafieldDefinitionInput!
  ) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition {
        id
        name
        useAsCollectionCondition
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

async function ensureDefinition() {
  const data = await adminGraphQL(QUERY_DEFINITION, {
    ownerType: "PRODUCT",
    namespace: NAMESPACE,
    key: KEY,
  });
  const existing = data.metafieldDefinitions.nodes[0];
  if (existing) {
    if (existing.type.name !== METAFIELD_TYPE) {
      throw new Error(
        `Definition ${NAMESPACE}.${KEY} exists with type ${existing.type.name}, ` +
          `expected ${METAFIELD_TYPE}. Resolve manually in admin.`,
      );
    }
    if (!existing.useAsCollectionCondition) {
      throw new Error(
        `Definition ${NAMESPACE}.${KEY} exists but is not enabled as a ` +
          `collection condition. Enable it in admin (Settings > Custom data > ` +
          `Products > Cognitive goals > "Use as collection condition"), then re-run.`,
      );
    }
    logStep("[ok]", `definition ${NAMESPACE}.${KEY} exists -> ${existing.id}`);
    return existing.id;
  }

  const created = await adminGraphQL(MUTATION_CREATE_DEFINITION, {
    definition: {
      name: "Cognitive goals",
      namespace: NAMESPACE,
      key: KEY,
      description:
        "Outcome taxonomy slugs (see scripts/data/goals.json). Drives the goal-* smart collections.",
      type: METAFIELD_TYPE,
      ownerType: "PRODUCT",
      useAsCollectionCondition: true,
    },
  });
  const result = created.metafieldDefinitionCreate;
  if (result.userErrors && result.userErrors.length) {
    throw new Error(
      `metafieldDefinitionCreate userErrors:\n` +
        JSON.stringify(result.userErrors, null, 2),
    );
  }
  logStep(
    "[ok]",
    `created definition ${NAMESPACE}.${KEY} -> ${result.createdDefinition.id}`,
  );
  return result.createdDefinition.id;
}

// ---------- step 2: product metafield values ----------

const MUTATION_SET_METAFIELDS = /* GraphQL */ `
  mutation SetCognitiveGoals($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        value
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

async function setProductGoals(handle, goals) {
  const product = await getProductByHandle(handle);
  if (!product) {
    throw new Error(`product not found in Shopify: ${handle}`);
  }
  const data = await adminGraphQL(MUTATION_SET_METAFIELDS, {
    metafields: [
      {
        ownerId: product.id,
        namespace: NAMESPACE,
        key: KEY,
        type: METAFIELD_TYPE,
        value: JSON.stringify(goals),
      },
    ],
  });
  const result = data.metafieldsSet;
  if (result.userErrors && result.userErrors.length) {
    throw new Error(
      `metafieldsSet userErrors for ${handle}:\n` +
        JSON.stringify(result.userErrors, null, 2),
    );
  }
  logStep("[ok]", `${handle} <- [${goals.join(", ")}]`);
}

// ---------- step 3: smart collections ----------

const QUERY_COLLECTION = /* GraphQL */ `
  query GoalCollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      ruleSet {
        appliedDisjunctively
        rules {
          column
          relation
          condition
        }
      }
    }
  }
`;

const MUTATION_CREATE_COLLECTION = /* GraphQL */ `
  mutation CreateGoalCollection($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        handle
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const MUTATION_UPDATE_COLLECTION = /* GraphQL */ `
  mutation UpdateGoalCollection($input: CollectionInput!) {
    collectionUpdate(input: $input) {
      collection {
        id
        handle
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function collectionInput(goal, definitionId) {
  return {
    title: goal.label,
    handle: goal.collectionHandle,
    descriptionHtml: `<p>${goal.description}</p>`,
    ruleSet: {
      appliedDisjunctively: false,
      rules: [
        {
          column: "PRODUCT_METAFIELD_DEFINITION",
          relation: "EQUALS",
          condition: goal.slug,
          conditionObjectId: definitionId,
        },
      ],
    },
  };
}

async function ensureCollection(goal, definitionId) {
  const data = await adminGraphQL(QUERY_COLLECTION, {
    handle: goal.collectionHandle,
  });
  const existing = data.collectionByHandle;
  const input = collectionInput(goal, definitionId);

  const mutation = existing
    ? MUTATION_UPDATE_COLLECTION
    : MUTATION_CREATE_COLLECTION;
  if (existing) input.id = existing.id;

  const res = await adminGraphQL(mutation, { input });
  const result = existing ? res.collectionUpdate : res.collectionCreate;
  if (result.userErrors && result.userErrors.length) {
    throw new Error(
      `${existing ? "collectionUpdate" : "collectionCreate"} userErrors for ` +
        `${goal.collectionHandle}:\n${JSON.stringify(result.userErrors, null, 2)}`,
    );
  }
  logStep(
    "[ok]",
    `${existing ? "updated" : "created"} collection ${result.collection.handle} ` +
      `-> ${result.collection.id}`,
  );
  return result.collection.id;
}

// ---------- step 4: publish to Online Store ----------

const QUERY_PUBLICATIONS = /* GraphQL */ `
  query OnlineStorePublications {
    publications(first: 20) {
      nodes {
        id
        name
      }
    }
  }
`;

const MUTATION_PUBLISH = /* GraphQL */ `
  mutation PublishGoalCollection($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

async function getOnlineStorePublicationId() {
  const data = await adminGraphQL(QUERY_PUBLICATIONS, {});
  const pub = data.publications.nodes.find((p) => p.name === "Online Store");
  if (!pub) {
    throw new Error(
      `Online Store publication not found. Available: ` +
        data.publications.nodes.map((p) => p.name).join(", "),
    );
  }
  return pub.id;
}

async function publishCollection(collectionId, handle, publicationId) {
  const data = await adminGraphQL(MUTATION_PUBLISH, {
    id: collectionId,
    input: [{ publicationId }],
  });
  const result = data.publishablePublish;
  if (result.userErrors && result.userErrors.length) {
    throw new Error(
      `publishablePublish userErrors for ${handle}:\n` +
        JSON.stringify(result.userErrors, null, 2),
    );
  }
  logStep("[ok]", `published ${handle} to Online Store`);
}

// ---------- main ----------

(async () => {
  const rootDir = await loadEnv();
  const goals = await loadGoals(rootDir);
  const goalSlugs = new Set(goals.map((g) => g.slug));
  let entries = await loadProducts(rootDir, goalSlugs);

  if (flags.product) {
    entries = entries.filter(
      (e) => !e.skipped && e.productHandles.includes(flags.product),
    );
    if (entries.length === 0) {
      console.error(
        `No data file with cognitiveGoals found for product handle "${flags.product}".`,
      );
      process.exit(1);
    }
  }

  const active = entries.filter((e) => !e.skipped);
  const skipped = entries.filter((e) => e.skipped);

  if (flags.dryRun) {
    console.log("DRY RUN — no API calls will occur.\n");
    console.log(`Definition: ${NAMESPACE}.${KEY} (${METAFIELD_TYPE}, useAsCollectionCondition: true)`);

    logSection("Proposed goal assignments");
    for (const e of active) {
      for (const h of e.productHandles) {
        logStep("[dry]", `${h}  <- [${e.goals.join(", ")}]`);
      }
    }
    if (skipped.length && !flags.product) {
      logSection("Skipped (no cognitiveGoals field)");
      for (const e of skipped) logStep("[--]", `${e.dir}/${e.name}`);
    }
    if (flags.all) {
      logSection("Smart collections");
      for (const g of goals) {
        logStep(
          "[dry]",
          `${g.collectionHandle}  "${g.label}"  rule: ${NAMESPACE}.${KEY} EQUALS ${g.slug}`,
        );
        logStep("[dry]", `${g.collectionHandle}  publish -> Online Store`);
      }
    }
    console.log("\nDone (dry run).");
    return;
  }

  console.log(
    `Live run against ${process.env.SHOPIFY_STORE || "<store>"} (api ${process.env.SHOPIFY_API_VERSION || "2025-01"})`,
  );

  logSection("Metafield definition");
  const definitionId = await ensureDefinition();

  logSection("Product metafields");
  for (const e of active) {
    const handles = flags.product ? [flags.product] : e.productHandles;
    for (const h of handles) {
      try {
        await setProductGoals(h, e.goals);
      } catch (err) {
        console.error(`  [error] ${h}: ${err.message}`);
        process.exitCode = 1;
      }
    }
  }
  if (skipped.length && !flags.product) {
    for (const e of skipped) logStep("[--]", `skipped ${e.dir}/${e.name} (no cognitiveGoals)`);
  }

  if (flags.all) {
    logSection("Smart collections");
    const publicationId = await getOnlineStorePublicationId();
    for (const g of goals) {
      try {
        const collectionId = await ensureCollection(g, definitionId);
        await publishCollection(collectionId, g.collectionHandle, publicationId);
      } catch (err) {
        console.error(`  [error] ${g.collectionHandle}: ${err.message}`);
        process.exitCode = 1;
      }
    }
  }

  console.log(
    "\nDone. Verify collections populate in admin (rule evaluation can take a minute).",
  );
})();
