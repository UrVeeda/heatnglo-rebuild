import { defineConfig, envField } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import editableRegions from '@cloudcannon/editable-regions/astro-integration';

export default defineConfig({
  site: 'https://heatnglo.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    editableRegions(),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'en-ca', 'fr-ca'],
    routing: { prefixDefaultLocale: false },
    fallback: {
      es: 'en',
      'en-ca': 'en',
      'fr-ca': 'en',
    },
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    remotePatterns: [
      { protocol: 'https', hostname: 'hearthnhome.getbynder.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  env: {
    schema: {
      URVEEDAOS_BASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      URVEEDAOS_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      URVEEDAOS_LOCATION_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      CLOUDINARY_CLOUD_NAME: envField.string({ context: 'server', access: 'secret', optional: true }),
      CLOUDINARY_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CLOUDINARY_API_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_PLACES_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_PLACES_PLACE_ID: envField.string({ context: 'server', access: 'public', optional: true }),
      ANTHROPIC_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      DEEPL_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_TRANSLATE_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'public', optional: true }),
      DEALER_LOCATOR_API_URL: envField.string({ context: 'server', access: 'public', optional: true }),
      DEALER_LOCATOR_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      SANITY_PROJECT_ID: envField.string({ context: 'server', access: 'public', optional: true }),
      SANITY_DATASET: envField.string({ context: 'server', access: 'public', optional: true }),
      SANITY_API_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  experimental: { svgo: true, contentIntellisense: true },
});
