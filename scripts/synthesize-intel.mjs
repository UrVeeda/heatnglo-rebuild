// Reads docs/data/raw-scrapes/*.json — produces 8 curated intel docs.
// Run after scripts/crawl-heatnglo.mjs.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAW = 'docs/data/raw-scrapes';
const OUT = 'docs/data';

const all = readdirSync(RAW).filter(f => f.endsWith('.json') && !f.startsWith('_'))
  .map(f => JSON.parse(readFileSync(join(RAW, f), 'utf8')));

const sectionOf = url => url.replace(/^https?:\/\/[^/]+/, '').split('/')[1] || '_root';
const slugOf = url => url.replace(/^https?:\/\/[^/]+/, '');

// ─────── PRODUCTS ───────
const products = all.filter(p => sectionOf(p.url) === 'fireplaces').map(p => {
  const path = slugOf(p.url).split('/').filter(Boolean);
  const energy = path[1] || null; // gas / wood / electric
  const placement = path[2] || null; // indoor / outdoor / inserts / freestanding / gas-log-set-collections
  const slug = path[path.length - 1];
  const family = (slug.match(/^([a-z-]+?)(?:-gas|-wood|-electric|-fireplace|-insert|-set|-fs)?$/i) || [, slug])[1];
  return {
    name: p.headings.h1[0] || p.title,
    slug,
    family,
    energy,
    placement,
    url: p.url,
    description: p.description,
    h2_count: p.headings.h2.length,
    image_count: p.images.length,
    primary_image: p.images[0]?.src || null,
  };
});

const productLines = [
  '# Heat & Glo — Product Catalog',
  '',
  `Crawled ${products.length} product pages from \`/fireplaces/*\`. Bucketed by energy source + placement.`,
  '',
  '## By energy source',
  '',
];
const byEnergy = {};
products.forEach(p => { byEnergy[p.energy || 'unknown'] = (byEnergy[p.energy || 'unknown'] || 0) + 1; });
Object.entries(byEnergy).forEach(([k, v]) => productLines.push(`- **${k}**: ${v} products`));
productLines.push('', '## By placement', '');
const byPlacement = {};
products.forEach(p => { byPlacement[p.placement || 'unknown'] = (byPlacement[p.placement || 'unknown'] || 0) + 1; });
Object.entries(byPlacement).forEach(([k, v]) => productLines.push(`- **${k}**: ${v} products`));

productLines.push('', '## Full catalog', '');
productLines.push('| Name | Energy | Placement | Slug | URL |');
productLines.push('|---|---|---|---|---|');
products.forEach(p => {
  productLines.push(`| ${p.name || '?'} | ${p.energy || '?'} | ${p.placement || '?'} | ${p.slug} | [link](${p.url}) |`);
});
writeFileSync(join(OUT, 'products.md'), productLines.join('\n'));

// ─────── INSPIRATION (ideas) ───────
const ideas = all.filter(p => sectionOf(p.url) === 'ideas').map(p => ({
  title: p.headings.h1[0] || p.title,
  url: p.url,
  description: p.description,
  paragraphs: p.paragraphs.length,
  images: p.images.length,
}));

const ideasLines = [
  '# Heat & Glo — Inspiration / Ideas Catalog',
  '',
  `Crawled ${ideas.length} idea pages from \`/ideas/*\`.`,
  '',
  '| Title | Paragraphs | Images | URL |',
  '|---|---|---|---|',
  ...ideas.map(i => `| ${i.title || '?'} | ${i.paragraphs} | ${i.images} | [link](${i.url}) |`),
];
writeFileSync(join(OUT, 'inspiration.md'), ideasLines.join('\n'));

// ─────── MARKETING CLAIMS ───────
// Pull all paragraphs containing numerical claims, dedupe by trimmed body.
const claims = new Map();
all.forEach(p => {
  p.claims_candidates?.forEach(c => {
    const key = c.trim().slice(0, 200);
    if (!claims.has(key)) claims.set(key, { text: c, urls: [p.url] });
    else claims.get(key).urls.push(p.url);
  });
});

const claimsLines = [
  '# Heat & Glo — Marketing Claims Ledger',
  '',
  `${claims.size} unique claims surfaced across the 243-URL crawl. Status starts as **unverified** for every claim — promote to **verified** only after Heat & Glo confirms the source data, or after the agency independently verifies (e.g. Google Places API for review counts).`,
  '',
  '| Status | Claim | First seen on |',
  '|---|---|---|',
  ...[...claims.values()].slice(0, 100).map(c => `| ⚠️ unverified | ${c.text.replace(/\|/g, '\\|').slice(0, 200)} | [${slugOf(c.urls[0])}](${c.urls[0]}) |`),
];
writeFileSync(join(OUT, 'marketing-claims.md'), claimsLines.join('\n'));

// ─────── IMAGERY ───────
const allImages = new Map(); // src → { alt, sources[] }
all.forEach(p => {
  p.images?.forEach(img => {
    if (!img.src) return;
    const key = img.src.split('?')[0]; // de-dupe transform variants
    if (!allImages.has(key)) allImages.set(key, { src: img.src, alt: img.alt, sources: [p.url] });
    else allImages.get(key).sources.push(p.url);
  });
});
const cdnImages = [...allImages.values()].filter(i => i.src.includes('hearthnhome.getbynder.com'));
const otherImages = [...allImages.values()].filter(i => !i.src.includes('hearthnhome.getbynder.com'));

const imageryLines = [
  '# Heat & Glo — Image Inventory',
  '',
  `**${allImages.size} unique image URLs** discovered across the 243-URL crawl.`,
  `- ${cdnImages.length} on the Bynder CDN (\`hearthnhome.getbynder.com\`) — these flow as-is into the rebuild`,
  `- ${otherImages.length} on other origins — needs review before adoption`,
  '',
  'Per Phase 9 plan: Cloudinary swap deferred. Images render from Bynder CDN URLs through the rebuild + launch QA. Migration to Heat & Glo\'s own Cloudinary at Phase 9 §10b.',
  '',
  '## Most-used images (top 30 by reuse count)',
  '',
  ...[...allImages.values()].sort((a, b) => b.sources.length - a.sources.length).slice(0, 30).map(i =>
    `- (used ${i.sources.length}x) \`${i.src.slice(0, 100)}\`${i.alt ? ` · alt: "${i.alt}"` : ''}`
  ),
];
writeFileSync(join(OUT, 'imagery.md'), imageryLines.join('\n'));

// ─────── PRESS MENTIONS ───────
const pressPages = all.filter(p => sectionOf(p.url) === 'press-and-media');
const pressLines = [
  '# Heat & Glo — Press Mentions (Verified Sources)',
  '',
  `${pressPages.length} pages crawled under \`/press-and-media/\`. These are the canonical source for any "as featured in" claim on the rebuilt site.`,
  '',
  ...pressPages.flatMap(p => [
    `## ${p.headings.h1[0] || p.title}`,
    `Source: ${p.url}`,
    '',
    ...p.paragraphs.slice(0, 5).map(para => `- ${para.slice(0, 280)}`),
    '',
  ]),
];
writeFileSync(join(OUT, 'press-mentions.md'), pressLines.join('\n'));

// ─────── PROMOTIONS ───────
const promoPages = all.filter(p => /sale|promo|rebate/i.test(p.url) || /sale|rebate|savings|\$\d/i.test(p.title || ''));
const promoLines = [
  '# Heat & Glo — Promotions Ledger',
  '',
  `Pages flagged as containing promotional / rebate / sale content:`,
  '',
  ...promoPages.flatMap(p => [
    `## ${p.headings.h1[0] || p.title}`,
    `Source: ${p.url}`,
    '',
    ...p.paragraphs.slice(0, 8).map(para => `- ${para.slice(0, 320)}`),
    '',
  ]),
];
writeFileSync(join(OUT, 'promotions.md'), promoLines.join('\n'));

// ─────── DEALERS (placeholder) ───────
const dealerPage = all.find(p => p.url.includes('/where-to-buy'));
const dealersLines = [
  '# Heat & Glo — Dealer Network Intel',
  '',
  '**Status: TBD pending dealer-locator scrape (separate pass from the sitemap crawl).**',
  '',
  `\`/where-to-buy/\` is JavaScript-rendered and the static HTML doesn\'t expose the dealer database. Need a follow-up Playwright pass against the dealer-locator widget to enumerate the network.`,
  '',
  'Once enumerated:',
  '1. Each dealer gets enriched with Google Places API (review count, average rating, hours, lat/lng)',
  '2. Aggregate review count + avg rating becomes the **real eyebrow_rating** on the homepage hero',
  '3. Per-request server-side geo (Vercel `x-vercel-ip-latitude`/`-longitude`) + Haversine on the dataset becomes the **real proximity_text**',
  '',
  `What the static crawl found at /where-to-buy: H1 = "${dealerPage?.headings?.h1?.[0] || 'unknown'}" · ${dealerPage?.paragraphs?.length || 0} paragraphs · ${dealerPage?.images?.length || 0} images`,
];
writeFileSync(join(OUT, 'dealers.md'), dealersLines.join('\n'));

// ─────── TESTIMONIALS (extract from product pages — Heat & Glo embeds quotes) ───────
const testimonials = [];
all.forEach(p => {
  p.paragraphs?.forEach(para => {
    // Heuristic: paragraphs that start/end with a quote mark or contain attribution patterns
    if (/^["“].+["”]\s*[—-]/.test(para) || /[—-]\s*\w+,\s+[A-Z][a-z]+/.test(para)) {
      testimonials.push({ text: para, source: p.url });
    }
  });
});
const testimonialLines = [
  '# Heat & Glo — Customer Testimonials Catalog',
  '',
  `${testimonials.length} candidate testimonial paragraphs detected via heuristic. These need a manual pass to confirm they\'re actual customer quotes vs. coincidental punctuation.`,
  '',
  ...testimonials.slice(0, 40).map(t => `- ${t.text.slice(0, 280)}\n  · source: ${t.source}`),
];
writeFileSync(join(OUT, 'testimonials.md'), testimonialLines.join('\n'));

console.log('intel docs synthesized:');
console.log(`  products.md: ${products.length} products`);
console.log(`  inspiration.md: ${ideas.length} ideas`);
console.log(`  marketing-claims.md: ${claims.size} unique claims`);
console.log(`  imagery.md: ${allImages.size} unique images`);
console.log(`  press-mentions.md: ${pressPages.length} press pages`);
console.log(`  promotions.md: ${promoPages.length} promo pages`);
console.log(`  testimonials.md: ${testimonials.length} candidate testimonials`);
console.log(`  dealers.md: scaffold (needs JS scrape)`);
