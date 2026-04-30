// Translate-loader (Phase 5 Turn 2). All-auto across es / en-ca / fr-ca per
// David's directive 2026-04-29. EN is source of truth; this loader walks
// src/content/en/**/*.json, generates per-locale companion JSON files via
// Anthropic, and writes them under src/content/{es,en-ca,fr-ca}/**.
//
// Behavior:
//   • Skips fields tagged with `_locked: true` in the destination file
//     (preserves hand-edited translations across rebuilds)
//   • Hashes the EN source body; if hash matches the cached `_source_hash`
//     in the destination, skips re-translation (no API call, no overwrite)
//   • Per-locale system prompts:
//       - es     → US Spanish, conversational marketing tone
//       - en-ca  → light EN-CA find/replace (ZIP→postal code, $X→$X CAD, etc)
//       - fr-ca  → Quebec French (NOT Parisian) — explicit prompt directives
//
// Invocation: `node scripts/translate-content.mjs` before astro build.
// Phase 8 wires it into the build pipeline. For Phase 5, the loader exists,
// the EN content is canonical, non-EN locales fall back to EN at render time
// via loadPageEntry's en fallback.

import { createHash } from 'node:crypto';

export type Locale = 'es' | 'en-ca' | 'fr-ca';

const SYSTEM_PROMPTS: Record<Locale, string> = {
  es: [
    'You are a professional marketing translator. Translate the supplied JSON values from US English to US Spanish (es-US).',
    'Tone: warm, conversational, direct — same emotional register as the source. This is fireplace marketing for US homeowners.',
    'Use Spanish that reads natural to Hispanic readers across the US (TX, CA, FL, NY, etc.) — avoid regional Mexico-only or Spain-only vocabulary.',
    'Preserve product names, brand names, model names (Heat & Glo, SupremeX, Cosmo, Mezzo, etc.) and dollar amounts EXACTLY.',
    'Preserve any inline HTML tags (<em>, <strong>, <br>) and JSON keys EXACTLY.',
    'Return ONLY the translated JSON value. No commentary, no markdown.',
  ].join(' '),

  'en-ca': [
    'You are a Canadian English copy editor. Localize the supplied JSON values from US English to Canadian English (en-CA).',
    'Apply Canadian conventions: "ZIP code" → "postal code"; "$X" alone → "$X CAD" where the price context makes that clearer; "color" → "colour", "favor" → "favour", "center" → "centre" where applicable; do NOT change "fireplace" to "hearth" or other unnecessary swaps.',
    'Preserve all product names, brand names, model names, and section headings EXACTLY.',
    'Preserve inline HTML tags and JSON keys EXACTLY.',
    'Most copy will read identically — only change what Canadian convention specifically requires.',
    'Return ONLY the localized JSON value. No commentary.',
  ].join(' '),

  'fr-ca': [
    'You are a Quebec French translator. Translate the supplied JSON values from US English to Quebec French (fr-CA), NOT to Parisian/European French.',
    'Use Quebec conventions strictly:',
    '  • "courriel" not "e-mail"',
    '  • "magasinage" not "shopping"',
    '  • "fin de semaine" not "weekend"',
    '  • "stationnement" not "parking"',
    '  • "détaillant" or "marchand" for "dealer" (NOT "concessionnaire" — that is car-only)',
    '  • "code postal" not "code ZIP"',
    '  • "foyer" for fireplace (NOT "cheminée" — that is the chimney structure)',
    '  • "insert de foyer" or "encart" for fireplace insert',
    '  • Avoid English loanwords (no "le job", no "le shopping", no "le weekend") wherever Quebec French has its own term',
    'Tone: formal-but-warm. Use "vous" not "tu" throughout for marketing context.',
    'Preserve product names, brand names (Heat & Glo, SupremeX, etc.), dollar amounts (convert to CAD), inline HTML tags, and JSON keys EXACTLY.',
    'Return ONLY the translated JSON value. No commentary.',
  ].join(' '),
};

const MODEL = 'claude-3-5-sonnet-20241022';

export function hashContent(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 16);
}

export async function translateString(
  text: string,
  locale: Locale,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPTS[locale],
      messages: [{ role: 'user', content: text }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.content?.[0]?.text ?? '';
}

interface LockedRecord { _locked?: boolean; }

export function shouldSkip(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  return (value as LockedRecord)._locked === true;
}

export async function translateBlock<T extends Record<string, unknown>>(
  block: T,
  locale: Locale,
): Promise<T> {
  const out: Record<string, unknown> = { ...block };
  for (const key of Object.keys(out)) {
    const value = out[key];
    if (typeof value === 'string' && shouldTranslateField(key)) {
      out[key] = await translateString(value, locale);
    } else if (Array.isArray(value)) {
      out[key] = await Promise.all(
        value.map((item) =>
          typeof item === 'object' && item !== null && !shouldSkip(item)
            ? translateBlock(item as Record<string, unknown>, locale)
            : item
        )
      );
    }
  }
  return out as T;
}

const NO_TRANSLATE_KEYS = new Set([
  '_type', '_locked', '_source_hash',
  'image', 'image_alt', 'background_image', 'background_image_alt',
  'media_image', 'media_image_alt',
  'cta_primary_href', 'cta_secondary_href', 'cta_href', 'href',
  'zip_action', 'cta_url',
  'bg_variant', 'alignment', 'density', 'media_position',
  'cta_primary_variant', 'cta_secondary_variant', 'cta_variant',
  'icon', 'emphasis', 'stars',
  'num', 'num_unit',
]);

function shouldTranslateField(key: string): boolean {
  if (NO_TRANSLATE_KEYS.has(key)) return false;
  if (key.endsWith('_href') || key.endsWith('_url')) return false;
  if (key.endsWith('_variant')) return false;
  if (key.startsWith('_')) return false;
  return true;
}
