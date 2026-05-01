# Heat & Glo — Dealer Network Intel

**Status: TBD pending dealer-locator scrape (separate pass from the sitemap crawl).**

`/where-to-buy/` is JavaScript-rendered and the static HTML doesn't expose the dealer database. Need a follow-up Playwright pass against the dealer-locator widget to enumerate the network.

Once enumerated:
1. Each dealer gets enriched with Google Places API (review count, average rating, hours, lat/lng)
2. Aggregate review count + avg rating becomes the **real eyebrow_rating** on the homepage hero
3. Per-request server-side geo (Vercel `x-vercel-ip-latitude`/`-longitude`) + Haversine on the dataset becomes the **real proximity_text**

What the static crawl found at /where-to-buy: H1 = "unknown" · 1 paragraphs · 2 images