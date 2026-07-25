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
  'templates/page.nootropics-dubai.json',
  'templates/page.nootropics-dubai-focus.json',
  'templates/page.nootropics-dubai-memory.json',
  'templates/page.how-to-choose-nootropics-dubai.json',
];

const adsFile = resolve(scriptDirectory, 'data/ads/nootropics-dubai-search.json');

const requiredEnglish = [
  ['Dubai origin disclosure', /ship(?:s|ped)? from (?:our )?Dubai/i],
  ['free local UAE delivery', /free local (?:UAE )?delivery/i],
  ['4-hour Dubai delivery', /4.hour/i],
  ['medical disclaimer', /not medical advice/i],
];

const requiredArabic = [
  ['Arabic UAE delivery', /الإمارات/],
  ['Arabic free local delivery', /مجاني/],
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

  if (/\bSAR 300\b/i.test(serialized) && !relativePath.includes('ksa')) {
    errors.push(`${relativePath}: contains KSA-only SAR shipping copy`);
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
      requireArabic: relativePath.endsWith('page.nootropics-dubai.json'),
      requireCategories: relativePath.endsWith('page.nootropics-dubai.json'),
    }),
  );
}

const guides = await readThemeJson('templates/page.guides.json');
if (!JSON.stringify(guides).includes('nootropics-dubai')) {
  errors.push('templates/page.guides.json: missing inbound link to Nootropics Dubai');
}

const uae = await readThemeJson('templates/page.uae.json');
const uaeSerialized = JSON.stringify(uae);
if (!uaeSerialized.includes('nootropics-dubai')) {
  errors.push('templates/page.uae.json: missing inbound link to Nootropics Dubai');
}
if (!uaeSerialized.includes('goal-focus-deep-work')) {
  errors.push('templates/page.uae.json: uae_shop still uses legacy goal collections');
}

const pillar = await readThemeJson('templates/page.pillar-nootropics-dubai.json');
if (!JSON.stringify(pillar).includes('nootropics-dubai')) {
  errors.push('templates/page.pillar-nootropics-dubai.json: missing inbound link to Nootropics Dubai');
}

const faq = await readThemeJson('templates/page.faq.json');
if (!JSON.stringify(faq).includes('/pages/nootropics-dubai')) {
  errors.push('templates/page.faq.json: missing inbound link to Nootropics Dubai');
}

const ksa = await readThemeJson('templates/page.nootropics-ksa.json');
if (!JSON.stringify(ksa).includes('nootropics-dubai')) {
  errors.push('templates/page.nootropics-ksa.json: missing reciprocal link to Nootropics Dubai');
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
  console.error('Dubai page validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Dubai page validation passed for ${pageFiles.length} templates and Search ad copy.`);
}
