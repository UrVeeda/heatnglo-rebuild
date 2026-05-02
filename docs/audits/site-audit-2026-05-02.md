# Heat & Glo Rebuild — Site Audit
**Date:** 2026-05-02
**Auditor:** Inspectah Deck (Verification Chamber, Claude Code era)
**Scope:** https://heatnglo-v2.vercel.app + local source at `/Users/thevoiceofcash/claude-workspace/heatnglo-rebuild/`
**Pages tested:** 77 URLs via live HTTP check; 60+ source files read directly

---

## Executive Summary

The site has strong bones. The core EN page set (fireplaces, pro, about, owner resources) is coherent and mostly press-ready. The most damaging single issue is the footer line "Optimized by The Voice of Cash AI Platform" appearing on every page in all four locales: it signals agency pitch work to an HHT reviewer before they've read one paragraph. That one line can end the conversation. Beyond it: 15 confirmed 404s across global nav-linked pages, a dated promotional eyebrow ("Through May 1") that has already expired, two in-page links on homepage that dead-end into a demo-notice page, five categories where product grids silently fall back to a "populate from legacy catalog" placeholder visible to anyone who clicks through, all five architect profile pages rendering a gray rectangle where project photography should be, and the three legal pages the footer links to (Privacy, Terms, Accessibility) returning 404. The recommended fix sequence: footer attribution first (one-line change, all-locale impact), then legal page 404s (trust signal for any HHT procurement reviewer), then dated eyebrow copy across all four locale JSONs, then the two broken homepage CTAs.

---

## Section: 404s + Broken Links

| URL | Status | Source File (where link lives) | Recommended Fix |
|---|---|---|---|
| `/privacy/` | 404 | `src/data/footer.json` (legal array) | Create `src/pages/privacy/index.astro` as a stub, or point to `heatnglo.com/privacy/` externally |
| `/terms/` | 404 | `src/data/footer.json` (legal array) | Create `src/pages/terms/index.astro` as a stub, or redirect to live HHT terms URL |
| `/accessibility/` | 404 | `src/data/footer.json` (legal array) | Create `src/pages/accessibility/index.astro` with WCAG 2.1 AA compliance statement |
| `/pro/proadvantage/` | 404 | `src/content/en/pages/index.json` (ProAdvantage block `cta_href`); `src/pages/pro/index.astro` (multiple CTAs) | Either create the page or change all CTA hrefs to `/apply-for-dealership/` as the functional equivalent |
| `/inspiration/six-tv-wall-designs/` | 404 | `src/content/en/pages/index.json` (TVWallsBlock `cta_href`) | Change href to an existing URL -- `/blog/21-fireplace-accent-wall-ideas/` is the closest built article |
| `/fireplace-safety/safety-screen-request/` | 404 | `src/pages/fireplace-safety/index.astro` line 37 | Create the page or change link to `/request-a-consultation/` until built |
| `/fireplaces/global/` | 404 | `src/pages/where-to-buy/index.astro` line 77 (AU/NZ ref) | Remove the reference sentence entirely -- no AU/NZ localized pages exist in this build |
| `/ideas/cosmo-fireplace-every-room/` | 404 | `src/pages/ideas/index.astro` (featured cards array) | Change href to an existing blog post, or remove the featured card |
| `/ideas/military-makeover-collaboration/` | 404 | `src/pages/ideas/index.astro` (featured cards array) | Same as above -- no article exists at this path |
| `/ideas/design-trends/` | 404 | `src/pages/ideas/index.astro` (category grid, dynamically generated from `categories` array) | Remove or comment out the category grid section; none of the 6 generated slugs exist |
| `/ideas/room-by-room-inspiration/` | 404 | `src/pages/ideas/index.astro` | Same as above |
| `/ideas/renovation-stories/` | 404 | `src/pages/ideas/index.astro` | Same as above |
| `/ideas/hgtv-partnerships/` | 404 | `src/pages/ideas/index.astro` | Same as above |
| `/ideas/architect-features/` | 404 | `src/pages/ideas/index.astro` | Same as above |
| `/ideas/outdoor-living/` | 404 | `src/pages/ideas/index.astro` | Same as above |
| `/fireplaces/duzy-3/` | 404 | `src/pages/fireplaces/gas/index.astro` (card links via `p.id`) | Duzy 3 is a log-set (`placement: "log-set"`) -- it resolves at `/log-sets/duzy-3/` (200). The gas listing page filter may be too broad and pulling it in. Verify filter logic: `energy === 'gas' && placement !== 'log-set'` should exclude it |

**Notes on locale variant 404s:** All four locales (en, es, en-ca, fr-ca) use the same `footer.json`, so the `/privacy/`, `/terms/`, `/accessibility/` 404s affect every locale page. The `/pro/proadvantage/` 404 affects the homepage CTA in all four locales (the ProAdvantage block `cta_href` value is shared). Confidence: High -- all URLs curl-verified live against production.

---

## Section: Weak / Fabricated Copy

| File | Section / Location | Issue | Recommended Replacement |
|---|---|---|---|
| `src/components/global/Footer.astro` | Lines 16, 22, 28, 34 -- `optimized` label in all 4 locales | "Optimized by The Voice of Cash AI Platform" renders in the footer of every page in all four locales. This is agency attribution on a client pitch deliverable. An HHT reviewer sees this before they see the homepage headline. | Remove the `footer__optimized` element entirely for the pitch build. If attribution is desired for internal review, add it as an HTML comment not visible in rendered output |
| `src/content/en/pages/index.json` | Line 60 -- LoveYourFireplaceBlock `eyebrow` | "Limited Offer - Through May 1" -- the offer window expired on 2026-05-01. Site is being audited on 2026-05-02. Any HHT reviewer clicking through today sees a lapsed promotion on the homepage | Remove the date from the eyebrow: change to "Limited Offer" or "Limited-Time Savings" |
| `src/content/es/pages/index.json` | Same block, same field | Same expired date in ES locale | Same fix |
| `src/content/en-ca/pages/index.json` | Same block, same field | Same expired date in EN-CA locale | Same fix |
| `src/content/fr-ca/pages/index.json` | Same block, same field | Same expired date in FR-CA locale | Same fix |
| `src/pages/where-to-buy/index.astro` | Line 26 | Visible red-text label: "Demo: Type any ZIP code below + click 'Find Dealers' to see sample dealer results." -- This is an internal note rendered on a live production URL in plain sight | Remove the demo label. The form behavior explains itself |
| `src/pages/where-to-buy/results/index.astro` | Lines 86-87 | "Demo Results -- These are sample dealer cards..." amber notification bar visible at top of dealer results page | Remove the demo bar. Either leave the results as-is without the apology or replace the bar with production-framing copy |
| `src/pages/where-to-buy/dealers/pacific-hearth-design/index.astro` | Line 22 | "Demo: Featured Dealer Page" label in orange bold text | Remove the demo label |
| `src/pages/[...slug].astro` | Lines 80-82, 88, 96-101, 115, 132 | The catch-all fallback page is titled "Demo -- Heat & Glo", shows "Demo Site" pill badge, and contains three paragraphs of pitch sales copy explaining what the production engagement will build. Every link that leads to an unbuilt page hits this. Fourteen confirmed paths hit this page during this audit. | The fallback page concept is correct; the internal pitch copy must be replaced. Remove "Demo" branding, remove the "production engagement builds out..." paragraph, keep the navigation scaffolding |
| `src/pages/search/index.astro` | Line 15 | "Search wired to Pagefind index in production. Currently a placeholder shell for the pitch." -- Visible to any user who visits /search/ | Remove this line. The form can stand without the explanation |
| `src/pages/blog/index.astro` | Lines 46-50 | Blog empty state: "Blog posts ship as part of the production engagement. The blog framework is wired to a translate-loader-aware content collection..." -- Visible to anyone who reaches /blog/ without blog content loaded | The blog content collection DOES contain 6 markdown files but the page reads from `blog-en` not from `blog`. Verify the content collection name. If the collection resolves, this empty state never shows. If not, replace with neutral copy without pitch language |
| `src/pages/fireplaces/wood/index.astro` | Line 34 | "Wood-burning product pages populate from the legacy catalog as the rebuild scales beyond the pitch deliverable." -- Visible when wood filter returns 0 results | Change to: "Wood-burning fireplace pages are in progress. Browse the full lineup or contact your dealer for wood-burning models." |
| `src/pages/fireplaces/electric/index.astro` | Line 34 | Same pattern | Same fix |
| `src/pages/fireplaces/inserts/index.astro` | Line 38 | Same pattern | Same fix |
| `src/pages/fireplaces/outdoor/index.astro` | Line 34 | Same pattern | Same fix |
| `src/pages/accessories/wood-mantels/index.astro` | Line 11 | "...as the rebuild scales beyond the pitch deliverable." | Same fix |
| `src/pages/accessories/mantel-shelves/index.astro` | Line 11 | Same pattern | Same fix |
| `src/pages/accessories/stone-surrounds/index.astro` | Line 11 | Same pattern | Same fix |
| `src/pages/es/[...slug].astro` | Line 10 | Locale slug fallback shows raw h1: "Pagina no conectada." -- bare text, no layout, no navigation suggestion | Match the English fallback page pattern with locale-appropriate copy and a path back to es home |
| `src/pages/en-ca/[...slug].astro` | Line 10 | Same -- blank h1 rendered inside a `.placeholder` div | Same fix |
| `src/pages/fr-ca/[...slug].astro` | Line 10 | Same | Same fix |
| `src/content/en/pages/index.json` | Trust strip items: `"num": "2.4M"` (hearths installed), `"num": "1,400"` (authorized dealers) | Both figures are unverified per the prior claims audit. The 1,400+ dealer count is probably accurate based on HHT's own site claims; the 2.4M hearths figure has no verified sourcing. Both are in all four locale index files. | Flag both for HHT confirmation before pitch. If unconfirmable: "America's largest hearth brand" replaces the 2.4M figure; "1,400+ authorized dealers" can stay with HHT sign-off |
| `src/pages/about-us/company/index.astro` | Line 32 and line 87 | "The company pioneered the factory-built direct-vent gas fireplace category" and "Part of North America's largest hearth manufacturer" -- both unverified per prior audit. "Pioneered" is a common claim in the hearth industry not specific to Heat & Glo. "Largest hearth manufacturer in North America" is HHT's own marketing claim but needs HHT sign-off before repeating on pitch material. | Replace "pioneered" with "developed" or "introduced the direct-vent category to residential construction." Replace "largest" with "one of North America's leading" unless HHT confirms the superlative |
| `src/pages/history-and-heritage/index.astro` | Line 13 | "2001 -- Hearth & Home Technologies forms, bringing Heat & Glo into the HHT brand family." The year HHT formed as a separate entity from Lennox is approximately correct (HHT was spun out from Lennox International circa 2001), but the framing "HHT forms" is imprecise -- HHT was a pre-existing entity reorganized, not created, in 2001. This is low-risk but could be fact-checked by HHT's own team. | Soften to: "Heat & Glo joins the Hearth & Home Technologies portfolio." Remove the specific year unless HHT can confirm it |
| `src/pages/ideas/index.astro` | Category grid item `count` values (28, 24, 19, 14, 11, 7) | These counts are hardcoded but the underlying content does not exist. No content in any of the six category paths. The counts project confidence about a content library that is not built. | Remove the `count` display from the category tiles, or replace with a generic label like "Explore" |

---

## Section: Missing / Placeholder Images

| File | Location | What Should Go There |
|---|---|---|
| `src/pages/architect/index.astro` | Line 37: `<div class="aspect-[4/3] bg-neutral-100 rounded mb-4"></div>` -- every one of the 5 designer cards has a gray box instead of a photo | A headshot or project photo for each designer. Short-term fix: use a Bynder lifestyle image as a stand-in. Long-term: HHT provides designer photography |
| `src/pages/architect/ann-fritz/index.astro` | Line 12: same gray box pattern in the profile grid | Same as above -- designer headshot or signature project photo |
| `src/pages/architect/brandi-hagen/index.astro` | Line 12: gray box | Same |
| `src/pages/architect/chris-walker/index.astro` | Line 12: gray box | Same |
| `src/pages/architect/jordan-iverson/index.astro` | Line 12: gray box | Same |
| `src/pages/architect/katie-kurtz/index.astro` | Line 12: gray box | Same |
| `src/pages/press-and-media/today-show/index.astro` | Line 11: `<section class="aspect-video bg-neutral-100 rounded-lg mb-16 flex items-center justify-center text-neutral-400">[Today Show segment embed]</section>` -- a visible placeholder with text inside the box | Either embed the actual Today Show clip (if YouTube URL exists), use a frame-grab as a static image, or remove the embed section and describe the segment in copy |

**Verified: all 15 Bynder CDN image URLs tested return HTTP 200.** No broken image assets. The placeholder issues are structural (gray div, no src) not CDN failures.

---

## Section: Contrast / Accessibility

| File | Location | Issue | Fix Pattern |
|---|---|---|---|
| `src/pages/request-a-consultation/index.astro` | Lines 13-17 -- all four form fields and the textarea | `<input type="text" placeholder="Name">` -- zero `<label>` elements. The form relies entirely on placeholder text for field identification. When a user focuses the field, the placeholder disappears and there is no accessible label. Screen readers announce nothing useful. | Add matching `<label for="...">` elements to each input with a `sr-only` class or visible label. The WHERE to buy ZIP form already uses `<label for="zip" class="sr-only">` as the correct pattern |
| `src/pages/manuals/index.astro` | Line 13 -- search input | No `<label>` on the manual search input | Add `<label for="manual-search" class="sr-only">Model name or number</label>` |
| `src/pages/search/index.astro` | Line 12 -- search input | No `<label>` on the search input | Same fix pattern |
| `src/pages/apply-for-dealership/index.astro` | Lines 13-18 -- all six form fields | Zero `<label>` elements across the whole form, including the business-name and credentials fields. This is a trade-facing application form -- specifiers may have accessibility needs or use screen readers. | Add `<label>` to each field. The form is already `sm:col-span-2` grid-based, so labels can be `sr-only` without breaking layout |
| `src/pages/pro/index.astro` | Lines 33, 34 -- inline `onmouseover`/`onmouseout` style JavaScript on anchor elements | Hover color changes wired via inline JS event attributes instead of CSS. No keyboard-focus equivalent state. Keyboard-only users get no visual focus indicator. Appears on 7+ elements across the pro page. | Replace inline JS hover effects with CSS `:hover` and `:focus-visible` rules in a `<style>` block |
| `src/pages/about-us/index.astro` | Lines 47-50 -- section nav cards | Same pattern: `onmouseover`/`onmouseout` inline JS for border color, no `:focus-visible` | Same fix |
| `src/pages/fireplaces/see-through/index.astro` | Line 23 -- product grid | Product cards rendered as plain `<a>` blocks with no image, no visible card imagery, just text inside a border. On the see-through page this is design intent (minimal card) but the contrast between this page and the gas/wood/electric pages (which have `h-52` card images) creates a degraded experience for this category. | Add a product image to the see-through cards using the same `h-52 object-cover` pattern as other listing pages |
| Global: `src/layouts/BaseLayout.astro` | Not audited directly | The `noIndex={true}` flag is set on every page across the entire site. This is correct for a pitch demo, but the flag must be tracked as a production-launch checklist item. Any indexable production deploy must have this systematically removed. | Track as launch gate, not a copy fix |

---

## Section: Inconsistencies

| Pattern | Files Affected | Recommended Canonical |
|---|---|---|
| Hero image height: category/section pages use three different values with no clear hierarchy | `h-[280px]` -- `fireplaces/gas/`, `fireplaces/wood/`, `fireplaces/electric/`, `fireplaces/inserts/`, `fireplaces/outdoor/`, `fireplaces/see-through/`, `where-to-buy/results/` (7 pages). `h-[360px]` -- `fireplaces/index.astro`, `log-sets/`, `accessories/`, `blog/`, `ideas/`, `press-and-media/`, `where-to-buy/`, `fireplace-safety/`, `architect/`, `owner-resources/` (10 pages). `h-[400px]` / `style="height: 400px;"` -- `about-us/`, `about-us/epa-certification/`, `about-us/company/` (3 pages). `h-[420px]` -- `pro/`, `[...slug].astro` fallback, `blog/[slug].astro`, `where-to-buy/dealers/pacific-hearth-design/` (4 pages). | Establish a three-tier system: sub-category listing pages use `h-[280px]`, section index pages use `h-[360px]`, feature/hero pages (Pro, About Company) use `h-[420px]`. Remove the `h-[400px]` tier. |
| Hero gradient opacity: "from-black/85 via-black/65 to-black/30" vs. "from-black/90 via-black/70 to-black/20" vs. inline `rgba(0,0,0,0.88)` | The Tailwind utility version (`from-black/85`) appears on most category pages. The `/90` variant appears on `pro/index.astro`. Inline rgba versions appear on `about-us/index.astro`, `about-us/epa-certification/`, `about-us/company/`. | Standardize to the Tailwind utility version (`from-black/85 via-black/65 to-black/30`) for all right-to-left gradients. Pages using the inline `linear-gradient(to right, ...)` pattern should be refactored to match |
| Eyebrow color: two colors in use | Most pages use `text-orange-700` Tailwind class for eyebrow text. Several pages (pro, about-us/company, about-us/epa-certification) use the inline hex `color: #c44a08` or `color: #fdba74`. The Tailwind `text-orange-700` maps to `#c05621` which is close but not identical to `#c44a08`. | Pick one: use `text-orange-700` Tailwind class on all eyebrows, or define a CSS custom property `--orange-primary: #c44a08` and reference it everywhere. Do not mix inline styles and Tailwind for the same visual property |
| H1 font-size: mixes Tailwind utilities | `text-4xl` (history-and-heritage, key-technologies, warranty-information, manuals, fireplace-sale, request-a-consultation, continuing-education, and most stub pages). `text-5xl` (about-us, pro, blog, ideas, architect, fireplace-safety, log-sets, owner-resources, accessories, press-and-media, where-to-buy). `text-4xl` in gas/wood/electric/outdoor sub-category pages. | Section index pages should be `text-5xl`; sub-category and utility pages should be `text-4xl`. The stub/utility pages already follow this correctly. The inconsistency is mainly on sub-category fireplace pages which use `text-4xl` while peer pages like `/blog/` use `text-5xl`. |
| Form styling: some forms are Tailwind, some use inline styles | Contact/consultation/apply forms use Tailwind border/padding classes. `pro/index.astro` CTAs and most about-us section CTAs use inline `style=` attributes for background, padding, border-radius. | Pick the Tailwind/design-token approach. The inline style approach loses hover-state consistency and makes global style changes harder |
| Architect profile pages: no images | All 5 architect profiles (ann-fritz, brandi-hagen, chris-walker, jordan-iverson, katie-kurtz) use a `bg-neutral-100` placeholder div. The architect index page also uses the same placeholder for all 5 designer cards. This is 6 pages all showing the same gray rectangle. | Minimum viable fix: use a relevant Bynder project photo as a stand-in on each card. The `HNG-True_ForgedArch` or Mezzo images are appropriate for any of these profiles until real project photos are supplied by HHT |
| Product cards on see-through vs. all other listing pages | `fireplaces/see-through/index.astro` renders cards as text-only list items with no image (`<a class="block border rounded-lg p-5">`). Every other product listing page uses image-topped cards (`<img class="w-full h-52 object-cover">`). | Add the image-topped card pattern to see-through, using the Primo II hero image as a category stand-in |

---

## Section: Routing

| URL | Expected Behavior | Actual Behavior | Fix |
|---|---|---|---|
| `/fireplaces/duzy-3/` | 404 | 404 -- Duzy 3 is a log-set (`placement: "log-set"`) with a JSON in `products/`, not `log-sets/`. The `[family].astro` dynamic route pulls from `products-en` collection and generates a slug from `p.id`. The file is `duzy-3.json`, so the route would be `/fireplaces/duzy-3/`. However the gas listing page filters `placement !== 'log-set'` which correctly excludes it from the gas grid but the `[family].astro` includes all products regardless of placement. `duzy-3` resolves at `/log-sets/duzy-3/` (200) via the log-sets slug route. | The `[family].astro` probably generates the route (if it does, it returns 200). Verify by checking if `duzy-3.json` is in `products/` or `log-sets/`. It is in `products/`. So `[family].astro` would produce `/fireplaces/duzy-3/` as a 200. Live curl shows 404. Likely the `[family].astro` `getStaticPaths` filters it out. Fix: ensure either `/fireplaces/duzy-3/` redirects to `/log-sets/duzy-3/` or the product JSON is moved to the `log-sets/` collection |
| `/es/[any-unbuilt-path]/` | Expected: a usable locale fallback page | Actual: page renders with the BaseLayout header/footer but the body shows `<h1>Pagina no conectada.</h1>` in a barebones div with no navigation context. No CTA, no suggested path forward. | Replace the ES fallback body with a locale-appropriate version of the EN fallback page logic -- suggested navigation links back to `/es/` and the ES product catalog |
| `/en-ca/[any-unbuilt-path]/` | Same as above | Same bare blank `<h1>` | Same fix |
| `/fr-ca/[any-unbuilt-path]/` | Same | Same | Same -- French copy for the fallback |
| `/pro/proadvantage/` | Expected: ProAdvantage program landing page | 404 | Create the page or 301 to `/apply-for-dealership/`. This URL appears in multiple CTAs across the homepage, pro page, and about-us page |
| `/inspiration/six-tv-wall-designs/` | Expected: editorial article about TV wall designs | 404 | Fix the href in `content/en/pages/index.json` -- change to `/blog/21-fireplace-accent-wall-ideas/` or another existing article |
| `/fireplaces/?fuel=wood` | Expected: filtered fireplaces index | Actual: 200, but the `?fuel=wood` query parameter is not implemented -- the page ignores it and shows all fireplaces. The URL is linked from `about-us/epa-certification/index.astro` (two places). | Either implement the filter param or change the links to `/fireplaces/wood/` which correctly routes to the wood subcategory |

---

## Methodology

All 77 primary URLs were checked via live HTTP curl against `https://heatnglo-v2.vercel.app` (max 8 second timeout per request). All 15 Bynder CDN image URLs present in the EN homepage content were checked and all returned 200. Source files were read directly from `src/pages/`, `src/components/`, `src/content/`, and `src/data/`. Grep sweeps across `*.astro` and `*.json` files identified internal-facing copy strings ("demo", "pitch deliverable", "populate from the legacy catalog", "Voice of Cash"), dated copy ("Through May 1"), and placeholder patterns (`bg-neutral-100 rounded` divs without `<img>`). Locale-variant pages (es, en-ca, fr-ca) were curl-tested for all nav-linked paths; their source slug fallback files were read directly. Accessibility assessment was by source code review: label presence, aria-label usage, focus state CSS. No visual contrast ratios were measured with a colorimeter; contrast findings are based on CSS inspection of color values vs. known WCAG thresholds. No Playwright browser sessions were run -- no JavaScript-dependent interactions were tested. Forms were inspected in source only; actual submission behavior (the `/api/lead.ts` endpoint) was not end-to-end tested.

---

## Confidence Rating

**Medium-high.**

High confidence on: the 404 inventory (curl-verified), the footer attribution line (read in source), the expired date (read in all four locale JSONs), the placeholder gray-box architect images (read in source of all 6 files), the form label gaps (read in source), and the locale fallback copy (read in source). 

Limiting factors: blog empty state may be a collection naming issue rather than missing content (6 markdown files exist in `content/en/blog/` but the page reads `blog-en` -- if the collection resolves, the empty state never shows; if not, 6 posts are invisible). The `duzy-3.json` routing ambiguity requires a live deploy check to confirm whether `/fireplaces/duzy-3/` is a real 404 or whether `getStaticPaths` in `[family].astro` generates it. The `?fuel=wood` filter behavior requires a browser test to confirm the param is genuinely ignored. The "2.4M hearths installed" and "1,400+ authorized dealers" accuracy depends on HHT internal data not available to this audit.
