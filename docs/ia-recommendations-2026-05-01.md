# Heat & Glo — IA Recommendations on the Four Sanity-Check Questions

**Date:** 2026-05-01
**Author:** RZA (for David)
**Inputs:** Phase 8 inventory crawl (243 URLs, 105 products, 1,069 unique CDN images), `docs/data/products.md`, `docs/trilingual-seo-opportunity.md`, current site URL structure under `heatnglo.com/fireplaces/*`.

---

## TL;DR — recommended IA decisions

| # | Question | Recommendation | Why (one line) |
|---|---|---|---|
| 1 | Mezzo: family or per-size? | **Family page with size-variant sub-modules + per-size schema + anchor URLs** | Captures family story for researchers AND specs for architects without thin per-size duplicates |
| 2 | Log sets as top-level category? | **Yes, top-level sibling to Gas / Wood / Electric** | 17 products is enough volume, different decision tree, separate SEO surface |
| 3 | AU/NZ on the US site? | **No, separate `au.heatnglo.com` subdomain (or remove from US scope entirely)** | Different regs, different distribution, SEO confusion if mixed |
| 4 | Mantels/surrounds: hub or folded? | **BOTH, with hub primary (`/accessories/`) + per-product "Complete the Look" cross-references** | Captures direct-search demand AND completes the install funnel |

The bucketing in your crawl is sound; one cleanup needed (see Bucketing section below). Detailed reasoning per question follows.

---

## Bucketing sanity check — pre-question housekeeping

Your 105-product breakdown is structurally correct. Two things to flag before we lock the IA on top of it:

1. **Two "Electric Fireplaces" rows in `products.md`** — one tagged `electric-fireplaces` and one tagged `electric` (lines 9-10 of the energy-source breakdown). That's a crawl artifact (the existing site has both `/fireplaces/electric-fireplaces/` and `/fireplaces/electric/` as legacy URL patterns). Treat as one bucket. Redirect both to a single canonical `/fireplaces/electric/` in the new site.
2. **Category landings (33 URLs) need explicit treatment.** These are NOT product pages, they're index pages (`/fireplaces/gas`, `/fireplaces/wood/indoor`, etc.). My recommendation: every category landing becomes a curated browse page with hero + filter + product grid + buyer-journey content (FAQs specific to that category, "How to choose" guide). They are legitimate SEO surfaces, not just navigation scaffolding.

Now to the four questions.

---

## Question 1 — Mezzo: family page or per-size pages?

### Context

The current site uses **family-level slugs**: `/fireplaces/gas/indoor/mezzo-gas-fireplace` is the Mezzo family page that contains all sizes inside (32, 36, 48, 60, 72). Same pattern for Cosmo, 6K/8K Series, Slimline Series, Pioneer II/III, etc. The crawl confirms this: 105 product pages map to 105 family slugs, not 105×N size variants.

Two valid patterns to consider for the new build:

- **Pattern A — family pages with size sub-modules** (what HG has today): one URL per family, sizes as in-page sections.
- **Pattern B — per-size pages**: `/mezzo-32`, `/mezzo-36`, `/mezzo-48`, etc. Each size is its own URL with discrete metadata, schema, content.

### Recommendation: Pattern A with reinforcements

**Family page is the canonical URL. Each size gets:**
- An anchor-link sub-section (`/mezzo-gas-fireplace#48`)
- Its own dimensional + spec table inside the family page
- Its own structured-data block (`Product` schema with size variant identified by `size` property)
- Optional: a thin `/mezzo-gas-fireplace/48` URL that 301-or-canonicals back to the family page anchor — buys you the long-tail SEO without the duplicate-content risk

### Reasoning

- **HG's URL legacy is family-level.** 105 → 525 (×5 sizes per family) means a 5x fan-out of redirects to manage at launch, plus 5x the content maintenance. The 1:1 redirect map is dramatically easier when the new structure mirrors the old.
- **Buyer research mode is family-first.** Most buyers don't know they want a Mezzo 48 specifically — they discover the Mezzo line, then narrow to a size based on their wall opening + room dimensions. Family pages let you tell the design story (Mezzo's hallmark thin frame, the linear aesthetic) once, then funnel.
- **Architect/specifier mode IS size-specific** but those users hit the spec sheet PDF (or the Mezzo Series Brochure) for that work, not the marketing page. Per-size URLs add little value to specifying buyers who already use HG's spec library.
- **Per-size URLs risk thin content.** If `/mezzo-48` and `/mezzo-60` differ only by dimensional numbers, Google flags both as low-quality. Family pages with rich design content + size-comparison tables are the higher-quality SEO surface.
- **Schema does the long-tail work.** `Product` schema with `additionalProperty` for each size, plus `Offer` per size variant, gets you indexed for "Mezzo 48" queries without per-page builds.

### When I'd revisit this

If David has GSC data showing high-intent search volume for specific size queries (e.g., "Mezzo 48 fireplace dimensions" gets 200+ monthly searches) AND those queries currently route to a family page that ranks poorly. In that case, per-size pages might unlock real traffic. **Action item: pull GSC's "Top queries" report filtered to fireplace family names and look for size-modifiers in the query patterns.** I can run that during Phase 8 if HG grants GSC read-access.

### Builds to: Pattern A unless GSC data justifies the per-size investment

---

## Question 2 — Log sets as their own top-level category?

### Context

The crawl shows 17 gas log set products (10 indoor + 7 outdoor) currently buried 4 levels deep at `/fireplaces/gas/gas-log-set-collections/indoor/<product>`. URL depth alone tells you the current architecture treats them as a sub-feature of "gas fireplaces."

### Recommendation: yes, top-level category

In the new IA, the primary nav looks like:
- Gas Fireplaces
- Wood Fireplaces
- Electric Fireplaces
- **Gas Log Sets** ← new top-level
- Outdoor (cross-cuts the above)
- Inserts (cross-cuts the above)
- Accessories (mantels + surrounds, see Q4)

URL shape: `/log-sets/<product>` instead of `/fireplaces/gas/gas-log-set-collections/indoor/<product>`. Cuts two levels of depth.

### Reasoning

- **17 products is comfortable nav volume.** Below 5 products doesn't justify a top-level. Above 30 products needs further sub-categorization. 17 is the sweet spot for a single category with good filtering.
- **Different decision tree, different buyer.** A log-set buyer is typically retrofitting an existing fireplace OPENING that doesn't need a full fireplace replacement. They size to the opening, not to a wall. They care about flame realism, BTU output, vent vs vent-free. None of that overlaps cleanly with full-fireplace decision criteria. Burying log sets under "Gas" sends fireplace-shopping buyers to log-set products by accident, which is wrong-funnel.
- **Different price band.** Log sets are $300-$2,000 typically; full gas fireplaces are $2,000-$15,000+. The price-anchoring on a category landing is materially different.
- **SEO surface unlocks.** "Gas log sets" / "fireplace log inserts" / "vented gas logs" are real keyword clusters with dedicated category-level competition (Real Fyre, Empire, RH Peterson). HG can't compete in those clusters without a dedicated `/log-sets/` landing page with category schema. Today's burial fragments the SEO surface across category subpages.
- **URL depth is a soft ranking signal.** Pages 4 levels deep get less crawl budget than 1-level-deep landings. Surfacing log sets to top-level helps the whole product line index faster.

### Cross-link discipline

- `/fireplaces/gas/` page has a "Looking for log sets only?" callout linking to `/log-sets/`
- `/log-sets/` page has a "Need a complete fireplace install?" callout linking to `/fireplaces/gas/`
- Both can co-exist in nav without confusing buyers if the category labels are clear

### Builds to: top-level category, URL `/log-sets/`, with the indoor/outdoor split as filter facets on the landing page rather than separate URL segments

---

## Question 3 — AU/NZ products on the US site?

### Context

7 Australia/NZ products live at `/fireplaces/global/australia-and-new-zealand/`. They use AU-specific gas regs (AGA-certified, balanced flue, different ventilation standards). The trilingual SEO doc you and I built earlier scopes the rebuild to **en-US, es-US, en-CA, fr-CA — four locales, two countries**. AU/NZ falls outside that footprint.

### Recommendation: separate AU/NZ subdomain (or remove from scope entirely if HG already has a regional site)

**Three options ranked:**

1. **Best: AU/NZ products live on `au.heatnglo.com` (or `heatnglo.com.au`), not on the US site at all.** 7 products is a thin standalone site, but it can be a clean directory + dealer-locator + spec-sheet portal. SEO domain authority on the AU subdomain is built fresh, but it's also not competing with US content.
2. **Acceptable: a regional landing page on the US site that says "For AU/NZ products, visit [au.heatnglo.com]" with NO indexed AU product pages.** Robots-disallow `/global/australia-and-new-zealand/*`. Use this if HG isn't ready to commit to a separate subdomain.
3. **Avoid: AU/NZ products fully indexed on the US site.** Risks Google serving AU spec sheets to US buyers, regulatory confusion (gas regs differ), and dealer-routing chaos.

### Reasoning

- **Distribution is regional.** HG's AU dealers are managed by Hearth & Home Technologies' Australian subsidiary (or a regional distributor). US buyers can't buy AU products. AU buyers can't buy US products without paying duty + dealing with non-AGA-certified equipment. Mixing them on one site creates a dealer-routing problem that's solved by separation.
- **Regulatory risk is real.** AU gas appliance regs (AS/NZS 5263) differ materially from US ANSI Z21.50 standards. Spec language that's compliant in one jurisdiction can be misleading in the other.
- **Search intent is regional.** "Mezzo Series gas fireplace Australia" is its own query cluster. Buyers in Brisbane don't compete with buyers in Boise for the same search results. Locale-routed regional sites win this neatly.
- **The trilingual scope (en-US, es-US, en-CA, fr-CA) is already a stretch.** Adding AU/NZ as a fifth locale on the same site adds maintenance burden + multiplies content translation cost across categories that don't benefit from it (US Spanish doesn't need AU products, etc.).
- **HG may already have regional infrastructure.** Hearth & Home Technologies is a global parent — there's a non-zero chance an `au.heatnglo.com` already exists or is in flight. Phase 8 should verify before committing to a build.

### Action item before build

Have David ask HHT's product/marketing team: **does an Australian web property already exist, and is the AU product line being managed by an Australian distributor?** If yes: link from a "International" footer link, do nothing else. If no: build option 2 (regional landing page) as the v1 deliverable, plan the standalone AU subdomain as a v2 if HHT wants it.

### Builds to: option 2 (regional landing page) by default, escalating to option 1 if HHT commits to the standalone subdomain

---

## Question 4 — Mantels & surrounds: separate Accessories hub or fold under each fireplace?

### Context

3 mantel/surround SKUs (Mantel Shelves, Stone Sets, Wood Mantels & Surrounds). These are accessories that complete a fireplace install, not standalone products. Currently at `/fireplaces/mantels-and-surrounds/` which is a sibling to fireplace categories.

### Recommendation: BOTH, with the Accessories hub as primary nav

**The architecture:**
- Top-level nav: **Accessories** (sibling to Gas / Wood / Electric / Log Sets)
- URL structure: `/accessories/mantels`, `/accessories/stone-surrounds`, `/accessories/wood-mantels-and-surrounds`
- Each fireplace product page has a **"Complete the Look"** module showing 2-3 compatible accessories with deep-link anchors into the hub
- Each accessory page has a **"Compatible Fireplaces"** reverse-cross-reference linking back to the relevant fireplace family pages

### Reasoning

- **Two real buyer journeys exist.** 
  - **Journey A:** "I'm replacing/installing a fireplace, and I need to figure out the mantel later." This buyer hits the fireplace page first, mantel decision happens at the end of the funnel. Per-product "Complete the Look" cross-references serve this journey.
  - **Journey B:** "I'm replacing my mantel without replacing the fireplace" OR "I'm matching the stone to the room, not the fireplace." This buyer searches "fireplace mantels" or "stone fireplace surrounds" directly. The Accessories hub serves this journey.
  - Pattern A alone (hub) loses Journey A. Pattern B alone (folded) loses Journey B. Both is correct.
- **SEO on accessory keywords is its own surface.** "Fireplace mantel shelves" gets 1,900 monthly searches (per the trilingual doc's keyword methodology). "Stone fireplace surrounds" gets 720. These don't get captured if mantels are buried as a per-product upsell.
- **Showing breadth matters for HG's brand.** A dedicated Accessories hub demonstrates HG's full-system commitment ("we make the fireplace AND the surround"), which differentiates from log-set-only competitors and from fireplace-only competitors.
- **Per-product cross-references protect AOV.** A buyer on the Mezzo 48 page sees "Pairs beautifully with our Stone Surrounds collection" with 2-3 thumbnails — that's the upsell moment that turns a $4,500 fireplace sale into a $6,500 fireplace + surround sale.

### Implementation note

The "Complete the Look" cross-references should be **manually curated** at first (each fireplace gets its compatible accessories chosen by HG's product team), then can become rule-based later (e.g., "any 36" linear fireplace shows 36" stone surround options"). Don't ship rule-based without the curated v1 because rules break on edge cases.

### Builds to: Accessories hub at `/accessories/` + per-fireplace "Complete the Look" cross-reference module

---

## What I'm asking David to confirm before I template

1. **Pattern A on Mezzo (family page with size sub-modules)** — confirm OR provide GSC data showing per-size search volume that justifies the per-size investment.
2. **Log sets as top-level category at `/log-sets/`** — confirm.
3. **AU/NZ off the US site** — confirm direction (subdomain or regional-landing-only) AND ask HHT whether an Australian web property already exists.
4. **Accessories hub with cross-references** — confirm the "both" pattern over a hub-only or folded-only alternative.

Once locked, the next step is the 105-product page generation. ETA: ~2 hours per product family (template + content fill + image wiring), ~10-12 hours total for the full catalog if templates are tight. Phase 8 after IA lock.
