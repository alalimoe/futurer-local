#!/usr/bin/env node
/**
 * Generate compound landing-page templates from a content source-of-truth.
 *
 * This systematizes the proven /pages/phenibut-for-sale playbook: one content
 * JSON per compound in ./data/landing/ becomes a Shopify page template that
 * reuses the existing, content-agnostic `phenibut-*` sections (plus
 * `sticky-cta` and `nx-related-guides`). The sections are never renamed or
 * forked — the live phenibut page keeps depending on them; each generated
 * template simply overrides every section/block setting with the compound's
 * content.
 *
 * Outputs:
 *   ../templates/page.<templateSuffix>.json   one per compound
 *   ./data/matrixify/landing-pages.csv         Matrixify Pages import (all)
 *
 * A hard compliance lint (see lib/landing-compliance.mjs) runs before anything
 * is written. If any content file makes an overt disease claim or is missing a
 * required disclaimer, generation aborts with a non-zero exit and no files are
 * written.
 *
 * CLI flags:
 *   (no flag)              → generate every file in ./data/landing/
 *   --all                  → same as no flag (explicit)
 *   --compound=<handle>    → generate only ./data/landing/<handle>.json
 *
 * Re-runs are idempotent: templates are overwritten in place and the Matrixify
 * CSV uses Command=MERGE keyed on page Handle.
 *
 * Run:
 *   node generate-landing-template.mjs --compound=fladrafinil
 *   node generate-landing-template.mjs --all
 */

import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { toCSV } from './lib/csv.mjs';
import { lintLandingContent } from './lib/landing-compliance.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const landingDir = join(here, 'data', 'landing');
const templatesDir = join(here, '..', 'templates');
const matrixifyDir = join(here, 'data', 'matrixify');

const { only } = parseArgs(process.argv.slice(2));

const files = await resolveFiles(only);
if (files.length === 0) {
  console.error(
    only
      ? `No content file found: data/landing/${only}.json`
      : 'No content files found in data/landing/',
  );
  process.exit(1);
}

// ---- Load + lint everything BEFORE writing anything ----
const loaded = [];
const allErrors = [];
for (const file of files) {
  const raw = await readFile(join(landingDir, file), 'utf8');
  const data = JSON.parse(raw);
  const errors = lintLandingContent(data);
  if (errors.length > 0) {
    allErrors.push({ file, errors });
  }
  loaded.push({ file, data });
}

if (allErrors.length > 0) {
  console.error('\nCompliance lint failed — no files written:\n');
  for (const { file, errors } of allErrors) {
    console.error(`  ${file}`);
    for (const e of errors) console.error(`    - ${e}`);
  }
  process.exit(1);
}

// ---- Write templates ----
await mkdir(templatesDir, { recursive: true });
await mkdir(matrixifyDir, { recursive: true });

const writtenTemplates = [];
for (const { data } of loaded) {
  const template = buildTemplate(data);
  const filename = `page.${data.templateSuffix}.json`;
  await writeFile(
    join(templatesDir, filename),
    JSON.stringify(template, null, 2) + '\n',
    'utf8',
  );
  writtenTemplates.push(filename);
}

// ---- Write Matrixify Pages CSV (all compounds in one file) ----
const csvName = 'landing-pages.csv';
await writeFile(
  join(matrixifyDir, csvName),
  buildPagesCSV(loaded.map((l) => l.data)),
  'utf8',
);

console.log('\nCompliance lint passed.\n\nWrote templates:');
for (const name of writtenTemplates) {
  console.log(`  templates/${name}`);
}
console.log('\nWrote Matrixify import:');
console.log(`  scripts/data/matrixify/${csvName}`);

// ============================================================
// Template builder — mirrors templates/page.phenibut-guide.json
// ============================================================

function buildTemplate(data) {
  const shopAnchor = data.shopAnchor || 'shop-now';
  const sections = {};
  const order = [];

  const add = (id, section) => {
    sections[id] = section;
    order.push(id);
  };

  add('spacing_top', {
    type: 'spacing',
    settings: { spacing_dt: 100, spacing_mb: 100 },
  });

  add('hero', buildHero(data, shopAnchor));

  add('sticky_cta', {
    type: 'sticky-cta',
    name: 'Sticky CTA (Mobile)',
    settings: {
      primary_label: data.hero.primaryLabel,
      primary_href: `#${shopAnchor}`,
      secondary_label: 'Safety',
      secondary_href: '#safety',
      reserve_space_mobile: true,
    },
  });

  add('tldr', buildTldr(data));
  add('what_is', buildWhatIs(data));
  add('goal_chips', buildGoalChips(data));
  add('benefits', buildBenefits(data));
  add('works', buildWorks(data));
  add('safety', buildSafety(data));
  add('compare', buildCompare(data));
  add('evidence', buildEvidence(data));
  add('products', buildProducts(data, shopAnchor));

  // Reviews are only emitted when real, curated reviews are supplied. Omitting
  // the section avoids fabricated AggregateRating JSON-LD (a Google penalty
  // risk) for compounds that have no reviews yet.
  if (Array.isArray(data.reviews) && data.reviews.length > 0) {
    add('reviews', buildReviews(data));
  }

  add('faq', buildFaq(data));
  add('cta', buildCta(data, shopAnchor));
  add('related', buildRelated(data));

  add('spacing_bottom', {
    type: 'spacing',
    settings: { spacing_dt: 100, spacing_mb: 100 },
  });

  return { sections, order };
}

function buildHero(data, shopAnchor) {
  const h = data.hero;
  const theme = data.theme || {};
  const hasReviews = Array.isArray(data.reviews) && data.reviews.length > 0;

  const blocks = {};
  const block_order = [];
  (h.trustItems || []).forEach((text, i) => {
    const id = `trust_${i + 1}`;
    blocks[id] = { type: 'trust_item', settings: { text } };
    block_order.push(id);
  });

  return {
    type: 'phenibut-hero',
    name: `${data.compound} Hero`,
    blocks,
    block_order,
    settings: {
      heading: h.heading,
      subheading: h.subheading,
      read_time: h.readTime || '8 min read',
      primary_label: h.primaryLabel,
      primary_href: `#${shopAnchor}`,
      show_secondary: true,
      secondary_label: h.secondaryLabel || 'How to Use Safely',
      secondary_href: '#safety',
      right_image_alt: '',
      right_image_decorative: true,
      hide_image_mobile: true,
      use_fallback_image: false,
      gradient_from: theme.gradientFrom || '#0a2342',
      gradient_to: theme.gradientTo || '#e5f4f4',
      max_width: 1200,
      center_on_mobile: true,
      mobile_padding_top: 120,
      mobile_padding_bottom: 56,
      mobile_extra_offset: 8,
      show_starline: hasReviews,
      starline_label: h.starlineLabel || '',
      show_pull_quote: hasReviews,
      sticky_offset: 64,
      show_trustbar: block_order.length > 0,
      safety_note: h.safetyNote || '',
      show_safety_note: Boolean(h.safetyNote),
    },
  };
}

function buildTldr(data) {
  const t = data.tldr;
  const blocks = {};
  const block_order = [];
  (t.takeaways || []).forEach((text, i) => {
    const id = `take_${i + 1}`;
    blocks[id] = { type: 'takeaway', settings: { text } };
    block_order.push(id);
  });
  return {
    type: 'phenibut-tldr',
    blocks,
    block_order,
    settings: {
      heading: t.heading || 'Key Takeaways (TL;DR)',
      bg_color: '#fafafb',
      accent_color: '#FBBF24',
    },
  };
}

function buildWhatIs(data) {
  const w = data.whatIs;
  return {
    type: 'phenibut-what-is',
    name: `What is ${data.compound}`,
    settings: {
      anchor_id: `what-is-${handleize(data.compound)}`,
      heading: w.heading || `What is ${data.compound}?`,
      definition: w.definition,
      show_basics: true,
      scientific_body: w.scientificBody,
      scientific_collapsed: true,
      molecule_alt: `${data.compound} molecule diagram`,
      molecule_decorative: true,
      hide_image_mobile: false,
      background_color: '#f7fafb',
      max_width: 1200,
      padding_y: 96,
      center_on_mobile: false,
      show_note: true,
      note_text: w.noteText,
    },
  };
}

function buildGoalChips(data) {
  const blocks = {};
  const block_order = [];
  (data.goalChips || []).forEach((chip, i) => {
    const id = `chip_${i + 1}`;
    blocks[id] = {
      type: 'chip',
      settings: {
        label: chip.label,
        href: `#benefit-${handleize(chip.benefit)}`,
      },
    };
    block_order.push(id);
  });
  return {
    type: 'phenibut-goal-chips',
    blocks,
    block_order,
    name: 'Goal Chips',
    settings: {
      show_heading: false,
      heading: 'Find your goal',
      background_color: '#ffffff',
      max_width: 1200,
      padding_y: 12,
      center_on_mobile: true,
    },
  };
}

function buildBenefits(data) {
  const b = data.benefits;
  const blocks = {};
  const block_order = [];
  (b.items || []).forEach((item, i) => {
    const id = `benefit_${i + 1}`;
    blocks[id] = {
      type: 'benefit',
      settings: {
        use_image_icon: false,
        emoji_icon: item.emoji || '',
        title: item.title,
        blurb: item.blurb,
        open_by_default: false,
        toggle_label: 'Learn more',
        details: item.details,
      },
    };
    block_order.push(id);
  });
  const cols = (b.items || []).length >= 4 ? 4 : (b.items || []).length || 1;
  return {
    type: 'phenibut-benefits',
    blocks,
    block_order,
    name: 'Benefits & Uses',
    settings: {
      anchor_id: `${handleize(data.compound)}-benefits-uses`,
      heading: b.heading || `${data.compound} Benefits & Uses`,
      intro: b.intro || '',
      background_color: '#ffffff',
      max_width: 1200,
      padding_y: 88,
      gap: 20,
      columns_desktop: cols,
      columns_tablet: 2,
      center_on_mobile: false,
      show_note: Boolean(b.noteText),
      note_text: b.noteText || '',
    },
  };
}

function buildWorks(data) {
  const w = data.works;
  const blocks = {};
  const block_order = [];
  (w.rows || []).forEach((row, i) => {
    const id = `form_row_${i + 1}`;
    blocks[id] = {
      type: 'form_row',
      settings: {
        form_name: row.form,
        solubility: row.solubility,
        dose: row.dose,
        onset: row.onset,
        notes: row.notes || '',
      },
    };
    block_order.push(id);
  });
  return {
    type: 'phenibut-works',
    blocks,
    block_order,
    name: 'How It Works',
    settings: {
      anchor_id: 'how-it-works',
      heading: w.heading || `How ${data.compound} Works`,
      subhead: w.subhead || '',
      diagram_alt: `Diagram of how ${data.compound} works`,
      diagram_decorative: true,
      hide_image_mobile: false,
      diagram_caption: '',
      mechanism: w.mechanism || '',
      forms_anchor: 'forms',
      background_color: '#ffffff',
      max_width: 1200,
      padding_y: 88,
      note: w.note || 'Informational only. Not medical advice.',
    },
  };
}

function buildSafety(data) {
  const s = data.safety;
  const blocks = {};
  const block_order = [];
  (s.doseRows || []).forEach((row, i) => {
    const id = `dose_row_${i + 1}`;
    blocks[id] = {
      type: 'dose_row',
      settings: {
        form_name: row.form,
        range: row.range,
        freq: row.freq,
        timing: row.timing,
      },
    };
    block_order.push(id);
  });
  return {
    type: 'phenibut-safety',
    blocks,
    block_order,
    name: 'Use Safely',
    settings: {
      anchor_id: 'safety',
      heading: s.heading || `How to Use ${data.compound} Safely`,
      intro: s.intro || '',
      background_color: '#f7fafb',
      max_width: 1200,
      padding_y: 88,
      do_list: s.doList || '',
      dont_list: s.dontList || '',
      disclaimer: s.disclaimer,
    },
  };
}

function buildCompare(data) {
  const c = data.compare;
  const blocks = {};
  const block_order = [];
  (c.rows || []).forEach((row, i) => {
    const id = `alt_row_${i + 1}`;
    blocks[id] = {
      type: 'alt_row',
      settings: {
        name: row.name,
        mechanism: row.mechanism,
        best_for: row.bestFor,
        onset: row.onset,
        notes: row.notes || '',
      },
    };
    block_order.push(id);
  });
  return {
    type: 'phenibut-compare',
    blocks,
    block_order,
    name: 'Compare',
    settings: {
      anchor_id: 'alternatives',
      heading: c.heading || `${data.compound} vs Alternatives`,
      intro: c.intro || '',
      background_color: '#ffffff',
      max_width: 1200,
      padding_y: 64,
    },
  };
}

function buildEvidence(data) {
  const e = data.evidence;
  return {
    type: 'phenibut-evidence',
    name: 'Evidence',
    settings: {
      anchor_id: 'evidence',
      heading: e.heading || 'Evidence Snapshot',
      phrasing_mode: 'simple',
      simple_copy: e.simpleCopy,
      scientific_copy: e.scientificCopy || '',
      background_color: '#ffffff',
      max_width: 1200,
      padding_y: 64,
      note: e.note || 'Educational only; not medical advice.',
    },
  };
}

function buildProducts(data, shopAnchor) {
  const p = data.products;
  const blocks = {};
  const block_order = [];
  (p.handles || []).slice(0, 6).forEach((handle, i) => {
    const id = `product_${i + 1}`;
    blocks[id] = {
      type: 'product_card',
      settings: { product: handle, cta_label: 'View product' },
    };
    block_order.push(id);
  });
  return {
    type: 'phenibut-products',
    blocks,
    block_order,
    name: 'Products',
    settings: {
      anchor_id: shopAnchor,
      heading: p.heading || `Our ${data.compound} Products`,
      intro: p.intro || '',
      background_color: '#ffffff',
      max_width: 1200,
      padding_y: 64,
      columns_desktop: p.columnsDesktop || 3,
      columns_tablet: p.columnsTablet || 2,
    },
  };
}

function buildReviews(data) {
  const blocks = {};
  const block_order = [];
  data.reviews.forEach((r, i) => {
    const id = `review_${i + 1}`;
    blocks[id] = {
      type: 'review',
      settings: {
        rating: r.rating,
        text: r.text,
        author: r.author,
        location: r.location || '',
        verified: r.verified !== false,
      },
    };
    block_order.push(id);
  });
  return {
    type: 'phenibut-reviews',
    blocks,
    block_order,
    name: 'Reviews (Curated)',
    settings: {
      anchor_id: 'reviews',
      heading: 'Customer Stories',
      intro: '',
      background_color: '#ffffff',
      max_width: 1200,
      padding_y: 64,
    },
  };
}

function buildFaq(data) {
  const f = data.faq;
  const blocks = {};
  const block_order = [];
  (f.items || []).forEach((qa, i) => {
    const id = `qa_${i + 1}`;
    blocks[id] = {
      type: 'qa',
      settings: {
        question: qa.question,
        answer: qa.answer,
        open_by_default: false,
      },
    };
    block_order.push(id);
  });
  return {
    type: 'phenibut-faq',
    blocks,
    block_order,
    name: 'FAQ',
    settings: {
      anchor_id: 'faq',
      heading: f.heading || 'Frequently Asked Questions',
      background_color: '#f7fafb',
      max_width: 900,
      padding_y: 64,
    },
  };
}

function buildCta(data, shopAnchor) {
  const c = data.cta;
  const theme = data.theme || {};
  return {
    type: 'phenibut-cta',
    name: 'Closing CTA',
    settings: {
      anchor_id: 'closing',
      heading: c.heading,
      subhead: c.subhead || '',
      primary_label: data.hero.primaryLabel,
      primary_href: `#${shopAnchor}`,
      secondary_label: 'Compare Forms',
      secondary_href: '#forms',
      gradient_from: theme.gradientFrom || '#0a2342',
      gradient_to: theme.gradientTo || '#cfe7e7',
      max_width: 1000,
      padding_y: 72,
      packshot_alt: `${data.compound} bottles`,
      packshot_decorative: true,
      packshot_hide_mobile: true,
    },
  };
}

function buildRelated(data) {
  const blocks = {};
  const block_order = [];
  (data.relatedGuides || []).forEach((g, i) => {
    const id = `guide_${i + 1}`;
    blocks[id] = {
      type: 'link',
      settings: { title: g.title, url: g.url, desc: g.desc },
    };
    block_order.push(id);
  });
  return {
    type: 'nx-related-guides',
    blocks,
    block_order,
    settings: {},
  };
}

// ============================================================
// Matrixify Pages CSV
// ============================================================

function buildPagesCSV(dataList) {
  const columns = [
    'ID',
    'Handle',
    'Command',
    'Title',
    'Author',
    'Body HTML',
    'Template Suffix',
    'Published',
    'SEO Title',
    'SEO Description',
  ];

  const rows = dataList.map((data) => ({
    ID: '',
    Handle: data.pageHandle,
    Command: 'MERGE',
    Title: data.seo.pageTitle,
    Author: 'Nootropix',
    'Body HTML': data.seo.bodyHtml || '',
    'Template Suffix': data.templateSuffix,
    Published: 'TRUE',
    'SEO Title': data.seo.pageTitle,
    'SEO Description': data.seo.metaDescription,
  }));

  return toCSV(rows, columns);
}

// ============================================================
// Helpers
// ============================================================

/** Mirror of Shopify's `handleize` filter for anchor generation. */
function handleize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseArgs(argv) {
  let only = null;
  for (const arg of argv) {
    if (arg === '--all') continue;
    if (arg.startsWith('--compound=')) {
      only = arg.slice('--compound='.length).trim();
    }
  }
  return { only };
}

async function resolveFiles(only) {
  if (only) {
    return [`${only}.json`];
  }
  let entries;
  try {
    entries = await readdir(landingDir);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  return entries
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .sort();
}
