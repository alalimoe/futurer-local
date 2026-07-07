/**
 * Compliance lint for compound landing-page content.
 *
 * Google Ads has previously flagged Nootropix pages for claim language. This
 * lint is a HARD gate in the generator: it refuses to emit a template when the
 * content makes overt disease claims, or when the required educational /
 * safety disclaimers are missing. Every generated page is therefore
 * policy-safe by construction.
 *
 * Two checks:
 *   1. Banned affirmative disease-claim language (treat/cure/prevent/diagnose,
 *      "clinically proven", "FDA approved", etc.). Sentences that negate the
 *      claim (the standard "not intended to diagnose, treat, cure, or prevent
 *      any disease" disclaimer) are skipped so legitimate disclaimers pass.
 *   2. Required disclaimers present: a safety disclaimer, a "what is" note, and
 *      a "not medical advice" statement somewhere in the content.
 */

const BANNED_PATTERNS = [
  { re: /\bcures?\b/i, label: 'disease claim: "cure"' },
  { re: /\btreats?\b/i, label: 'disease claim: "treat"' },
  { re: /\btreatment for\b/i, label: 'disease claim: "treatment for"' },
  { re: /\bprevents?\b/i, label: 'disease claim: "prevent"' },
  { re: /\bdiagnos(e|es|is|ing)\b/i, label: 'disease claim: "diagnose"' },
  { re: /\bheals?\b/i, label: 'disease claim: "heal"' },
  { re: /\bclinically proven\b/i, label: 'unsupported: "clinically proven"' },
  { re: /\bfda[\s-]?approved\b/i, label: 'unsupported: "FDA approved"' },
  { re: /\bmiracle\b/i, label: 'hype: "miracle"' },
  { re: /\bguaranteed\b/i, label: 'hype: "guaranteed"' },
];

// Sentences containing any of these markers are negated / disclaimer context
// and are excluded from the banned-term scan.
const NEGATION_MARKERS = [
  'not intended to',
  'have not been evaluated',
  'has not been evaluated',
  'not medical advice',
  'not approved',
  "n't",
  'not a treatment',
  'should not be considered',
];

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Walk every string value in the content object, returning
 * [{ path, text }] of human-readable copy (HTML stripped).
 */
function collectStrings(node, path, out) {
  if (typeof node === 'string') {
    out.push({ path, text: stripHtml(node) });
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      collectStrings(v, path ? `${path}.${k}` : k, out);
    }
  }
}

function splitSentences(text) {
  return text.split(/(?<=[.!?])\s+/);
}

/**
 * @param {object} data - parsed landing content JSON
 * @returns {string[]} array of human-readable error messages (empty = pass)
 */
export function lintLandingContent(data) {
  const errors = [];

  // ---- Check 1: banned affirmative claim language ----
  const strings = [];
  collectStrings(data, '', strings);

  for (const { path, text } of strings) {
    if (!text) continue;
    for (const sentence of splitSentences(text)) {
      const lower = sentence.toLowerCase();
      if (NEGATION_MARKERS.some((m) => lower.includes(m))) continue;
      for (const { re, label } of BANNED_PATTERNS) {
        if (re.test(sentence)) {
          errors.push(
            `${label} at "${path}": "${sentence.trim().slice(0, 120)}"`,
          );
        }
      }
    }
  }

  // ---- Check 2: required disclaimers ----
  const allText = strings
    .map((s) => s.text)
    .join(' ')
    .toLowerCase();

  if (!data.safety || !stripHtml(data.safety.disclaimer)) {
    errors.push('missing required "safety.disclaimer"');
  }
  if (!data.whatIs || !stripHtml(data.whatIs.noteText)) {
    errors.push('missing required "whatIs.noteText"');
  }
  if (!allText.includes('not medical advice')) {
    errors.push('missing a "not medical advice" statement anywhere in content');
  }

  return errors;
}
