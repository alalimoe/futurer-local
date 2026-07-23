import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { lintClaimsContent } from './lib/landing-compliance.mjs';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const templatePath = resolve(
  scriptDirectory,
  '../templates/page.nootropics-ksa.json',
);
const template = JSON.parse(await readFile(templatePath, 'utf8'));
const serialized = JSON.stringify(template);
const errors = lintClaimsContent(template);

const requiredEnglish = [
  ['Dubai origin disclosure', /ship(?:s|ped)? from Dubai/i],
  ['same-day dispatch', /same.day/i],
  ['average three-day delivery', /3 days? on average/i],
  ['free-shipping threshold', /SAR 300/i],
  ['medical disclaimer', /not medical advice/i],
  ['no Saudi location disclosure', /No\. Nootropix is a Dubai-based/i],
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

for (const [label, pattern] of [...requiredEnglish, ...requiredArabic]) {
  if (!pattern.test(serialized)) {
    errors.push(`missing required ${label}`);
  }
}

for (const category of requiredCategories) {
  if (!serialized.includes(category)) {
    errors.push(`missing required category: "${category}"`);
  }
}

if (/\b(customs|duties|vat)\b/i.test(serialized)) {
  errors.push('KSA pillar contains deferred customs/VAT copy');
}

if (errors.length > 0) {
  console.error('KSA pillar compliance validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log('KSA pillar compliance validation passed.');
}
