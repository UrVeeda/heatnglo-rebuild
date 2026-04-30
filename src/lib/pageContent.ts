// Page-content loader. Reads `pages-{locale}` collection; if the requested
// locale doesn't have the entry, falls back to the EN entry. Phase 5+ uses
// the translate-loader to fill non-EN locales at build time. Until that runs,
// every locale renders EN copy via this fallback — keeps the site shippable.

import { getEntry } from 'astro:content';
import type { Locale } from './localeUrls';

const PAGES_COLLECTION = {
  en:      'pages-en',
  es:      'pages-es',
  'en-ca': 'pages-en-ca',
  'fr-ca': 'pages-fr-ca',
} as const;

export async function loadPageEntry(locale: Locale, slug: string) {
  const collection = PAGES_COLLECTION[locale] as 'pages-en' | 'pages-es' | 'pages-en-ca' | 'pages-fr-ca';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entry = await getEntry(collection as any, slug);
  if (entry) return entry;
  if (locale !== 'en') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await getEntry('pages-en' as any, slug);
  }
  return null;
}
