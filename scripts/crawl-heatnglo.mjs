// Heat & Glo sitemap crawler — Phase 8 prep.
// Reads /tmp/heatnglo-sitemap.xml, fetches each URL with cheerio,
// extracts structured page data, writes per-URL JSON to docs/data/raw-scrapes/.
// Polite: 250ms gap between requests, real User-Agent, retries 5xx once.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import * as cheerio from 'cheerio';

const SITEMAP = '/tmp/heatnglo-sitemap.xml';
const OUT_DIR = 'docs/data/raw-scrapes';
const UA = 'Mozilla/5.0 (compatible; VoCAgencyCrawler/1.0; abigailleahgoldberg@gmail.com)';
const GAP_MS = 250;

await mkdir(OUT_DIR, { recursive: true });

const xml = readFileSync(SITEMAP, 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const limit = Number(process.argv[2]) || urls.length;
const sample = urls.slice(0, limit);

console.log(`crawling ${sample.length} of ${urls.length} URLs from sitemap`);

const slugify = u => u.replace(/^https?:\/\/[^/]+/, '').replace(/^\/|\/$/g, '').replace(/\//g, '__') || '_root';

async function fetchOnce(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

async function fetchWithRetry(url) {
  try { return await fetchOnce(url); }
  catch (e) {
    if (String(e).includes('5')) { await new Promise(r => setTimeout(r, 1000)); return fetchOnce(url); }
    throw e;
  }
}

function extract($, url) {
  const text = sel => $(sel).first().text().trim() || null;
  const attr = (sel, a) => $(sel).first().attr(a) || null;

  const og = {};
  $('meta[property^="og:"], meta[name^="twitter:"], meta[name="description"], meta[name="keywords"]').each((_, el) => {
    const k = $(el).attr('property') || $(el).attr('name');
    og[k] = $(el).attr('content');
  });

  const headings = { h1: [], h2: [], h3: [] };
  $('h1, h2, h3').each((_, el) => {
    const tag = el.tagName.toLowerCase();
    headings[tag].push($(el).text().trim().replace(/\s+/g, ' '));
  });

  const paragraphs = $('p').map((_, el) => $(el).text().trim().replace(/\s+/g, ' ')).get().filter(p => p.length > 30);

  const images = $('img').map((_, el) => ({
    src: $(el).attr('src') || $(el).attr('data-src'),
    alt: $(el).attr('alt') || ''
  })).get().filter(i => i.src);

  const links = $('a[href]').map((_, el) => ({
    href: $(el).attr('href'),
    text: $(el).text().trim().replace(/\s+/g, ' ').slice(0, 100)
  })).get().filter(l => l.text.length > 0);

  const ld = $('script[type="application/ld+json"]').map((_, el) => {
    try { return JSON.parse($(el).text()); } catch { return null; }
  }).get().filter(Boolean);

  const claims = paragraphs.filter(p => /\b\d[\d,]*\+?\s*(years?|customers?|installs?|owners?|reviews?|dealers?|homes?|stars?|certifie?d?|families|projects)\b/i.test(p));

  return {
    url,
    title: text('title'),
    description: og['description'] || og['og:description'] || null,
    canonical: attr('link[rel="canonical"]', 'href'),
    og,
    headings,
    paragraphs: paragraphs.slice(0, 50),
    images: images.slice(0, 30),
    links: links.slice(0, 50),
    json_ld: ld,
    claims_candidates: claims,
    crawled_at: new Date().toISOString(),
  };
}

const summary = { total: sample.length, ok: 0, errors: [], by_section: {} };

for (let i = 0; i < sample.length; i++) {
  const url = sample[i];
  const slug = slugify(url);
  const out = join(OUT_DIR, `${slug}.json`);
  if (existsSync(out)) { summary.ok++; continue; }

  try {
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);
    const data = extract($, url);
    writeFileSync(out, JSON.stringify(data, null, 2));
    summary.ok++;
    const section = url.replace(/^https?:\/\/[^/]+/, '').split('/')[1] || '_root';
    summary.by_section[section] = (summary.by_section[section] || 0) + 1;
    process.stdout.write(`[${i + 1}/${sample.length}] ${url}\n`);
  } catch (e) {
    summary.errors.push({ url, error: String(e) });
    process.stdout.write(`[${i + 1}/${sample.length}] FAIL ${url} — ${e}\n`);
  }
  if (i < sample.length - 1) await new Promise(r => setTimeout(r, GAP_MS));
}

writeFileSync(join(OUT_DIR, '_summary.json'), JSON.stringify(summary, null, 2));
console.log(`\ncrawl complete: ${summary.ok}/${summary.total} ok, ${summary.errors.length} errors`);
console.log('by section:', summary.by_section);
