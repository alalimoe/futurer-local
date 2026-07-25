import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { lintClaimsContent } from './lib/landing-compliance.mjs';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const themeRoot = resolve(scriptDirectory, '..');

async function readThemeJson(relativePath) {
  const raw = await readFile(resolve(themeRoot, relativePath), 'utf8');
  const withoutComments = raw.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  return JSON.parse(withoutComments);
}

const pageFiles = [
  'templates/page.nootropics-ksa.json',
  'templates/page.nootropics-ksa-focus.json',
  'templates/page.nootropics-ksa-memory.json',
  'templates/page.how-to-choose-nootropics-ksa.json',
];

const adsFile = resolve(scriptDirectory, 'data/ads/nootropics-ksa-search.json');

const requiredEnglish = [
  ['Dubai origin disclosure', /ship(?:s|ped)? from Dubai/i],
  ['same-day dispatch', /same.day/i],
  ['average three-day delivery', /3 days? on average/i],
  ['free-shipping threshold', /SAR 300/i],
  ['medical disclaimer', /not medical advice/i],
];

const requiredArabic = [
  ['Arabic Dubai origin disclosure', /من دبي/],
  ['Arabic average three-day delivery', /٣ أيام في المتوسط/],
  ['Arabic free-shipping threshold', /٣٠٠ ريال سعودي/],
  ['Arabic medical disclaimer', /ليست نصيحة طبية/],
];

const requiredCategories = [
  'Focus & Deep Work',
  'Memory & Learning',
  'Mood & Stress',
  'Energy & Wakefulness',
  'Sleep & Recovery',
  'Neuroprotection & Longevity',
];

const requiredInboundLinks = [
  ['guides hub link', /nootropics-ksa/],
  ['UAE related link', /nootropics-ksa/],
  ['FAQ KSA link', /\/pages\/nootropics-ksa/],
];

function validatePage(relativePath, options = {}) {
  const errors = [];
  const serialized = options.serialized;
  const data = options.data;

  errors.push(...lintClaimsContent(data).map((error) => `${relativePath}: ${error}`));

  for (const [label, pattern] of requiredEnglish) {
    if (!pattern.test(serialized)) {
      errors.push(`${relativePath}: missing required ${label}`);
    }
  }

  if (options.requireArabic) {
    for (const [label, pattern] of requiredArabic) {
      if (!pattern.test(serialized)) {
        errors.push(`${relativePath}: missing required ${label}`);
      }
    }
  }

  if (options.requireCategories) {
    for (const category of requiredCategories) {
      if (!serialized.includes(category)) {
        errors.push(`${relativePath}: missing required category "${category}"`);
      }
    }
  }

  if (/\b(customs|duties|vat)\b/i.test(serialized)) {
    errors.push(`${relativePath}: contains deferred customs/VAT copy`);
  }

  return errors;
}

const errors = [];

for (const relativePath of pageFiles) {
  const data = await readThemeJson(relativePath);
  const serialized = JSON.stringify(data);
  errors.push(
    ...validatePage(relativePath, {
      data,
      serialized,
      requireArabic: relativePath.endsWith('page.nootropics-ksa.json'),
      requireCategories: relativePath.endsWith('page.nootropics-ksa.json'),
    }),
  );
}

const guides = await readThemeJson('templates/page.guides.json');
if (!JSON.stringify(guides).includes('nootropics-ksa')) {
  errors.push('templates/page.guides.json: missing inbound link to Nootropics KSA');
}

const uae = await readThemeJson('templates/page.uae.json');
if (!JSON.stringify(uae).includes('nootropics-ksa')) {
  errors.push('templates/page.uae.json: missing inbound link to Nootropics KSA');
}

const faq = await readThemeJson('templates/page.faq.json');
const faqSerialized = JSON.stringify(faq);
if (!faqSerialized.includes('/pages/nootropics-ksa')) {
  errors.push('templates/page.faq.json: missing inbound link to Nootropics KSA');
}
if (/KSA ~4.?5d/i.test(faqSerialized)) {
  errors.push('templates/page.faq.json: stale KSA delivery copy remains');
}

const faqSectioned = await readThemeJson('templates/page.nootropix-faq-sectioned.json');
const faqSectionedSerialized = JSON.stringify(faqSectioned);
if (!faqSectionedSerialized.includes('/pages/nootropics-ksa')) {
  errors.push('templates/page.nootropix-faq-sectioned.json: missing inbound link to Nootropics KSA');
}
if (/KSA ~4.?5d/i.test(faqSectionedSerialized)) {
  errors.push('templates/page.nootropix-faq-sectioned.json: stale KSA delivery copy remains');
}

const ads = JSON.parse(await readFile(adsFile, 'utf8'));
errors.push(...lintClaimsContent(ads).map((error) => `ads copy: ${error}`));

for (const headline of ads.headlines) {
  if (headline.length > 30) {
    errors.push(`ads copy: headline exceeds 30 chars: "${headline}"`);
  }
}

for (const description of ads.descriptions) {
  if (description.length > 90) {
    errors.push(`ads copy: description exceeds 90 chars: "${description}"`);
  }
}

if (errors.length > 0) {
  console.error('KSA page validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(`KSA page validation passed for ${pageFiles.length} templates and Search ad copy.`);
}
