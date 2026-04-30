#!/usr/bin/env node
// Translate-content driver. Reads src/content/en/**/*.json, generates
// per-locale companion JSON files via translate-loader, writes to
// src/content/{es,en-ca,fr-ca}/**.
//
// Usage: ANTHROPIC_API_KEY=... node scripts/translate-content.mjs
// Phase 8 wires this into npm run build via prebuild script.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { createHash } from 'node:crypto';

const LOCALES = ['es', 'en-ca', 'fr-ca'];
const SRC_DIR = 'src/content/en';

const SYSTEM_PROMPTS = {
  es: 'You are a professional marketing translator. Translate the supplied JSON values from US English to US Spanish (es-US). Tone: warm, conversational. Preserve product names, brand names, model names (Heat & Glo, SupremeX, Cosmo, Mezzo) and dollar amounts EXACTLY. Preserve inline HTML tags and JSON keys EXACTLY. Return ONLY the translated JSON value.',

  'en-ca': 'You are a Canadian English copy editor. Localize from US English to en-CA. ZIP code → postal code; "$X" → "$X CAD" where context makes that clearer; color → colour, favor → favour, center → centre. Preserve product names, brand names, headings EXACTLY. Most copy reads identically — only change what Canadian convention requires. Return ONLY the localized JSON value.',

  'fr-ca': 'You are a Quebec French translator. Translate to Quebec French (fr-CA), NOT Parisian. Use Quebec conventions strictly: courriel not e-mail, magasinage not shopping, fin de semaine not weekend, stationnement not parking, détaillant or marchand for dealer (NOT concessionnaire), code postal, foyer for fireplace, insert de foyer for fireplace insert. Avoid English loanwords. Tone: formal-but-warm. Use vous not tu. Preserve product names, brand names, dollar amounts (USD→CAD), inline HTML tags, JSON keys EXACTLY. Return ONLY the translated JSON value.',
};

const NO_TRANSLATE_KEYS = new Set([
  '_type', '_locked', '_source_hash',
  'image', 'image_alt', 'background_image', 'background_image_alt',
  'media_image', 'media_image_alt',
  'cta_primary_href', 'cta_secondary_href', 'cta_href', 'href',
  'zip_action', 'cta_url',
  'bg_variant', 'alignment', 'density', 'media_position',
  'cta_primary_variant', 'cta_secondary_variant', 'cta_variant',
  'icon', 'emphasis', 'stars', 'num', 'num_unit',
]);

const shouldTranslate = (k) =>
  !NO_TRANSLATE_KEYS.has(k) &&
  !k.endsWith('_href') && !k.endsWith('_url') && !k.endsWith('_variant') && !k.startsWith('_');

const hashOf = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);

async function callClaude(text, locale) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: SYSTEM_PROMPTS[locale],
      messages: [{ role: 'user', content: text }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.content?.[0]?.text ?? '';
}

async function translateValue(value, locale) {
  if (typeof value === 'string') return await callClaude(value, locale);
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) out.push(await translateNode(item, locale));
    return out;
  }
  if (value && typeof value === 'object') return await translateNode(value, locale);
  return value;
}

async function translateNode(node, locale) {
  if (node?._locked === true) return node;
  const out = {};
  for (const key of Object.keys(node)) {
    const value = node[key];
    if (shouldTranslate(key)) {
      out[key] = await translateValue(value, locale);
    } else if (Array.isArray(value)) {
      const arr = [];
      for (const item of value) arr.push(typeof item === 'object' && item ? await translateNode(item, locale) : item);
      out[key] = arr;
    } else {
      out[key] = value;
    }
  }
  return out;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile() && entry.name.endsWith('.json')) yield path;
  }
}

async function main() {
  for await (const enFile of walk(SRC_DIR)) {
    const enText = await readFile(enFile, 'utf8');
    const enData = JSON.parse(enText);
    const enHash = hashOf(enText);
    const relPath = relative(SRC_DIR, enFile);

    for (const locale of LOCALES) {
      const destFile = join(`src/content/${locale}`, relPath);
      let existing = null;
      if (existsSync(destFile)) {
        try { existing = JSON.parse(await readFile(destFile, 'utf8')); } catch { /* fresh-translate on parse error */ }
      }

      if (existing?._source_hash === enHash && existing?._locked !== false) {
        console.log(`  [skip] ${locale}/${relPath} (hash match)`);
        continue;
      }

      console.log(`  [translate] ${locale}/${relPath}`);
      const translated = await translateNode(enData, locale);
      translated._source_hash = enHash;

      await mkdir(dirname(destFile), { recursive: true });
      await writeFile(destFile, JSON.stringify(translated, null, 2) + '\n', 'utf8');
    }
  }
  console.log('translate-content: done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
