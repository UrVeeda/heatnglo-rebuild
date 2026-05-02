# Browse the Lineup Module — Design Spec v1

**Date:** 2026-04-30
**Author:** Ghostface Killah (Tony Starks) for Heat & Glo rebuild
**Status:** Ready for engineering handoff, pending card count decision (4 vs 6 categories)
**Scope:** The Browse the Lineup card grid on the homepage, currently rendered from the `browse_lineup_block` in `src/content/en/pages/index.json`.

---

## Context and Conversion Theory

The Browse the Lineup module is the category navigation layer of the homepage. Its conversion job is not to sell a specific fireplace. It is to sort buyers into the correct funnel branch as fast as possible, with minimum friction and zero confusion.

A buyer who lands on the Heat & Glo homepage has already decided something: they are interested in a fireplace. They arrived from a Google search, a brand ad, a friend's recommendation, a dealer's suggestion. They are not a cold audience learning about fireplaces for the first time. They are a warm audience deciding where to go next on the site.

The Browse the Lineup module is the first directional signal after the homepage hero. The hero creates desire and captures attention (and collects a dealer-search ZIP). The Browse the Lineup module tells the buyer: "Now, which direction do you go?" It is the branching point of the entire funnel.

The module fails if:

1. A buyer looks at the card grid and does not immediately recognize which card applies to them. Category confusion at this moment sends buyers back to Google. That is an expensive failure on the highest-traffic page of the site.
2. A buyer who knows exactly what they want (gas fireplace, always has been) has to think for even a moment before clicking the Gas card. Any cognitive friction is a funnel leak.
3. The module is visually crowded or cluttered enough that buyers skip past it to something more specific below. If buyers scroll past Browse the Lineup without engaging, the module is not doing its sorting job and buyers are reaching deeper page content before they have been oriented.

The module's success is measured not by click rate alone but by whether buyers who click a card subsequently reach the dealer locator. Cards that funnel buyers all the way to dealer locator engagement are working. Cards that route buyers to a category landing page that itself produces a high bounce rate indicate a mismatch between the card's promise and the category landing page's delivery. The module spec and the category landing page spec must be developed in coordination.

The load-bearing assumption: buyers arrive on the homepage sorted into loosely defined preference buckets (gas, wood, electric, outdoor) and the module's job is to match those preference buckets to the correct category landing with enough clarity that the match is obvious, not inferred.

---

## UX Pattern

### Page flow position

The Browse the Lineup module sits after the hero block and the trust strip, and before the Love Your Fireplace editorial block. Per the current `index.json` structure, it is the third content block (position 3 of 8 in the `content_blocks` array).

This is the correct position. The trust strip above it (50 years, 2.4M+ hearths, 1,400+ dealers, Made in USA) provides the brand credentialing layer immediately before the buyer is asked to self-sort. The buyer sees the trust signal, reads the scale of the business, and then confronts the category cards. The trust strip makes the card engagement feel safe. The buyer is not sorting into a random ecommerce site — they are choosing within a 50-year-old established brand.

### Card count decision: 4 vs 6 categories

This is the key judgment call in the module spec. The locked IA (from `docs/ia-recommendations-2026-05-01.md`) establishes the new top-level categories as:

- Gas Fireplaces
- Wood Fireplaces
- Electric Fireplaces
- Gas Log Sets (new top-level, formerly buried under Gas)
- Outdoor (cross-cutting)
- Accessories (mantels + surrounds, new top-level)

All six are legitimate top-level categories in the new IA. The question is whether all six should appear in the Browse the Lineup grid, or whether a curated 4-card version better serves the homepage's conversion job.

**The case for 4 cards (curated subset)**

A 4-card grid at desktop is a clean 2x2 or a single row of 4. At mobile, 4 cards is 2 rows of 2 or a scrollable row of 4. Four options is a fast, low-cognitive-load decision: the buyer scans four tiles and one of them is clearly theirs.

Six cards at desktop produces either a 3x2 grid (spacious) or a single row of 6 (cramped at most viewport widths). Six options starts to feel like a product menu rather than a category navigation. For buyers who know they want a gas fireplace, scrolling past Log Sets, Outdoor, and Accessories creates irrelevant visual noise before they reach their card.

The original 4-card configuration (Gas, Electric, Wood, Outdoor) covered the purchase intent of the vast majority of buyers. Log Sets are a distinct buyer (retrofitting an existing fireplace opening, not doing a new install), and Accessories are almost never the primary entry point for a homeowner's first visit. They are secondary discovery items.

**The case for 6 cards**

Log Sets as a buried sub-category actively loses buyers who are searching specifically for gas logs (they see "Gas Fireplaces" and click into it, then have to find log sets buried within that category). A top-level Log Sets card captures that intent immediately. Similarly, designers and architects often come to heatnglo.com specifically for mantel and surround options. An Accessories card gives them a direct path.

**Recommendation: 4-card at launch, Log Sets promoted to visible through the Gas card, with a revisit gate**

The rationale: six categories is the correct IA, but the homepage module is not the IA. It is a curated entry point. Accessories should be in the global navigation (always accessible) but do not need a homepage card for v1 — the Complete the Look module on product pages serves accessory discovery better than a homepage card. Log Sets should appear as a callout within the Gas Fireplaces category landing page ("Looking for log sets only?") per the IA cross-link discipline.

If 90-day data shows that buyers are landing on Gas category pages and bouncing at high rates (indicating they were looking for log sets, not full fireplaces), promote Log Sets to a homepage card at that point. The data should make this call, not speculation.

**The launch card set (4 cards):**

1. Gas Fireplaces (highest purchase volume, primary buyer segment)
2. Electric Fireplaces (second highest volume, growing segment, no-vent appeal)
3. Wood Fireplaces (distinct buyer, smaller volume, distinct EPA regulatory story)
4. Outdoor Fireplaces (seasonal but high-intent, distinct buyer — patio/outdoor living)

This matches the current `browse_lineup_block` in `index.json`, which is validation that the current data model and asset selection is already the right call at launch.

### Desktop layout (viewport >= 1024px): 4-card single row

```
+----------------------------------------------------------------------+
| Browse the Lineup                                                     |
| [eyebrow: "Browse the Lineup"]                                        |
|                                                                       |
| Four ways a Heat & Glo fits a room.                                   |
|                                                                       |
| +---------------+ +---------------+ +---------------+ +---------------+|
| |               | |               | |               | |               ||
| |  [IMAGE 4:3]  | |  [IMAGE 4:3]  | |  [IMAGE 4:3]  | |  [IMAGE 4:3]  ||
| |               | |               | |               | |               ||
| | Gas Fireplaces| | Electric Fire | | Wood Fireplac | | Outdoor Firef ||
| |               | | places        | | es            | | ireplaces     ||
| | Direct-vent,  | | Wall-mount,   | | EPA-certified,| | Patio,        ||
| | B-vent,       | | built-in,     | | low-emission  | | built-in, gas ||
| | ventless      | | inserts       | | burns         | | + wood        ||
| | 18 models     | | 9 models      | | 7 models      | | 11 models     ||
| |               | |               | |               | |               ||
| | [Browse Gas]  | | [Browse Elec] | | [Browse Wood] | | [Browse Outd] ||
| +---------------+ +---------------+ +---------------+ +---------------+|
+----------------------------------------------------------------------+
```

Cards are equal-width, equal-height within the row. The 4-column grid uses `grid-cols-4` at desktop. No card is made larger or given visual precedence over another — the buyer self-selects, and hierarchy in the grid would impose a recommendation the site is not positioned to make. (If HHT provides data showing Gas is 70% of purchase volume and wants the Gas card visually prominent, that is a valid product decision that would change this spec. Without that direction, equal treatment is the default.)

Each card contains:

1. Image. 4:3 ratio, `object-cover`, full card width. Sourced from Bynder CDN. Uses the existing URLs from the `browse_lineup_block` in `index.json`. Images show a fireplace in a room — not a product-isolated shot. The room context is essential: the buyer needs to see scale and placement, not a catalog illustration.
2. Category title. 18px semibold. The primary label. "Gas Fireplaces," "Electric Fireplaces," etc.
3. Subcopy line. Small, neutral-500. Lists 2-3 key sub-types and the model count. Sourced from the `sub` field in the current data model (already correct in `index.json`). This line is the disambiguation layer: a buyer who is not sure whether they want a gas fireplace or a gas insert can read "Direct-vent, B-vent, ventless · 18 models" and understand the scope of the Gas category before clicking.
4. CTA button. "Browse Gas," "Browse Electric," "Browse Wood," "Browse Outdoor." The CTA text is action-plus-category. Not "Browse" alone (requires scanning the card title to understand what is being browsed). Not "View Gas Fireplaces" (too long for a button). Two words: Browse + {category noun}.

### Card interaction: desktop hover behavior

Cards have two hover states that work together:

1. Mild image zoom on hover: the card image scales to approximately 105% inside its `overflow: hidden` container, with a 200ms ease-out transition. This is subtle — the zoom amount is small enough that the room context remains visible and nothing important is cropped out at the edges. The zoom signals interactivity without being aggressive.
2. Card title color shifts from neutral-900 to brand-primary (Heat & Glo orange or brand color equivalent). The CTA button deepens in background color (one shade darker than the default state).

**What the card does NOT do on hover:**

- No overlay layer with text on top of the image. The subcopy is always readable below the image, not as an image overlay, because overlays frequently fail color-contrast accessibility requirements and the subcopy is substantive enough to need its own readable space.
- No preview drawer or expanded state. Hover-to-preview patterns where a dropdown appears on card hover create navigation traps on some devices and add complexity without conversion benefit at this stage of the funnel. The buyer clicks to the category landing. That is the preview.
- The card does NOT navigate on hover. Hover-to-navigate (where the card link activates on hover without a click) is a fatal UX error on track pads and mixed-input devices. Click only.

**The full card is the link target at desktop.** The entire card surface is wrapped in an `<a>` element pointing to the category landing page. The "Browse Gas" button is a visual affordance within the card, not a separate click target. This is the opposite of the mobile card pattern for a deliberate reason: at desktop, hover provides enough affordance to understand that the card is interactive. At mobile, a card-sized tap target produces false positives during scroll.

### Mobile layout (viewport < 768px)

**Static 2x2 grid vs horizontal carousel: the decision**

The horizontal carousel pattern (swipe left to see more cards) is the default choice for mobile card grids in many design systems. For the Browse the Lineup module, it is the wrong choice.

A carousel hides content. The buyer sees 1-2 cards and must know to swipe to reveal the others. Discovery of hidden cards is imperfect: some buyers swipe, many do not. A buyer who does not swipe never sees Wood Fireplaces or Outdoor Fireplaces. Those category funnels receive less traffic, and the measurement data looks like low buyer interest when it is actually low visibility.

At 4 cards, a static 2x2 grid at mobile is the correct layout. Two rows of two cards each. All four categories visible without scrolling on most mobile viewport sizes (assuming reasonable card height). The buyer can see the complete decision surface in a single viewport without any swipe behavior.

```
+----------------------------------+
| Browse the Lineup                |
|                                  |
| Four ways a Heat & Glo           |
| fits a room.                     |
|                                  |
| +-------------+ +-------------+ |
| |  [IMAGE]    | |  [IMAGE]    | |
| | Gas         | | Electric    | |
| | Fireplaces  | | Fireplaces  | |
| | [Browse Gas]| | [Browse El] | |
| +-------------+ +-------------+ |
|                                  |
| +-------------+ +-------------+ |
| |  [IMAGE]    | |  [IMAGE]    | |
| | Wood        | | Outdoor     | |
| | Fireplaces  | | Fireplaces  | |
| | [Browse Wd] | | [Browse Od] | |
| +-------------+ +-------------+ |
+----------------------------------+
```

At mobile, only the "Browse {Category}" button is the click/tap target. The card image and title are NOT wrapped in the `<a>`. The button is the tap target, minimum 44px height, full card width minus padding.

If the module is ever expanded to 6 cards, a 2x3 grid at mobile is still preferable to a carousel. Six cards in two columns of three rows is fully visible after one short scroll. The carousel is the option of last resort, not the default.

### Card order: how it is determined

The current order in `index.json` is: Gas, Electric, Wood, Outdoor.

**The order is correct and should be maintained at launch.** Rationale:

- Gas is first because it represents the highest purchase-volume category and the widest buyer applicability (new install, retrofit, any room). Putting the highest-volume category first serves the most buyers fastest.
- Electric is second because it is the fastest-growing category (no vent, no gas line, broadest installation footprint). Many buyers arrive comparing Gas vs Electric. Placing them adjacently on the grid serves that comparison behavior.
- Wood is third. It is a distinct buyer segment with specific preferences (real flame, crackling fire, no gas line requirement). Third position is visible and accessible; Wood buyers will find this card. They do not need it to be first.
- Outdoor is fourth. It is a seasonal category (peak inquiry in spring/summer) and a distinct physical context (not living room, not bedroom — it is patio). Placing it last reflects that it is the most specialized context of the four.

**Season-aware card ordering** is technically possible: during Q1 and Q2 (spring), elevate Outdoor to second position; during Q3 and Q4 (fall/winter), drop it to fourth. The `browse_lineup_block` in `index.json` would need to support conditional card ordering based on the current date at build time, or the cards need to be re-orderable at the CMS level via CloudCannon.

This is a v2 enhancement, not a v1 requirement. The data to validate season-aware ordering does not exist until the site has been live for a full year. Launch with static order, evaluate with seasonal data, implement dynamic ordering if the data justifies it.

**Purchase-volume-first ordering** requires HHT to share category-level sales volume data with the agency. If HHT provides that data and the order differs from the recommended Gas-Electric-Wood-Outdoor sequence, update accordingly. The current order is the agency's best inference from public market context, not confirmed internal data.

---

## Conversion Theory and Measurement Plan

### What this module replaces

The current `browse_lineup_block` in `index.json` is the existing representation of this module in the data layer. The current data is already well-structured and mostly correct. The spec replaces the engineering implementation (whatever the current component renders) with a fully-specified component, and formalizes the measurement plan that should surround it.

The module replaces the idea of using the global navigation alone to guide buyers into category funnels. Navigation bars are persistent but passive. The Browse the Lineup module is active: it presents the categories as visual, clickable invitations, with photography and model counts, at exactly the moment the buyer is primed to self-sort. Navigation bars get used by buyers who already know where they are going. Browse the Lineup serves buyers who have arrived from a generic entry point (brand search, homepage URL) and need to be shown the map.

### What IS measurable (instrument from day one)

**1. Card click by category**

```
gtag('event', 'hngl_browse_card_click', {
  card_category: 'gas-fireplaces',   // from cta_href slug
  card_position: 1,                  // 1-indexed grid position
  page_locale: 'en-us'
});
```

Fire on both the card-area click (desktop) and the button click (mobile). The `source` parameter is not needed here because the module only lives on the homepage.

**2. Module view**
Fire when 50% of the module enters the viewport.

```
gtag('event', 'hngl_browse_lineup_viewed', {
  card_count: 4,
  page_locale: 'en-us'
});
```

**3. GA4 custom dimension: `entry_category`**
Session-scoped. Set to the `card_category` value when `hngl_browse_card_click` fires. This lets GA4 segment all downstream behavior by "which category did this buyer enter through?" Buyers who entered through "Gas Fireplaces" can be compared to buyers who entered through "Electric Fireplaces" for scroll depth, dealer locator engagement, and consultation request rate. This is high-value segmentation data that accumulates over the life of the site.

**4. Category landing page engagement rate (downstream signal)**
The Browse the Lineup module's success is partially measured by what happens after the click. If 30% of buyers click the Gas card but the Gas category landing page has a 70% immediate bounce rate, the module is working but the landing page is not. Track category landing page engagement rate as a leading indicator for the module's downstream value.

### Success vs failure thresholds (90-day post-launch review targets)

| Metric | Success | Failure threshold | Action if failure |
|--------|---------|-------------------|-------------------|
| Module view rate among homepage sessions | 70%+ (module is above the fold enough that most visitors see it) | Under 40% | Module is below the fold at many viewport sizes — review placement, reduce hero height |
| Card click rate among module-view sessions | 25%+ | Under 10% | Cards not visually compelling — A/B test images, or subcopy is not clarifying category scope |
| Click distribution across cards | No single card below 10% of total card clicks (all categories are getting self-selection) | One card below 5% of total clicks for >60 days | The low-click card's category label or image may not resonate — revise copy or image |
| Category landing engagement rate (after card click) | 50%+ engage (scroll past fold, or click a product) | Under 25% | Category landing page is not delivering on the card's visual promise |

### What is NOT measurable

- Whether a buyer who clicked Gas initially was persuaded by the Electric card they saw in passing. Intent comparison is not trackable without qualitative research (survey, session recording review).
- Whether the visual order of the cards influences which category gets more clicks (the first card likely gets a position bias uplift). Testable only with an A/B test rotating card order, which is a v2 exercise.

---

## Edge Cases

### 1. Category landing page does not exist yet

During the build, some category landing pages referenced by the card `cta_href` values may not yet be fully built. The correct behavior: the card still renders and still links. A 404 on the category landing page is caught by the 404 handler. Do not suppress a Browse the Lineup card because its destination is under construction.

This creates a task: confirm that all four category landing page routes (`/products/gas-fireplaces/`, `/products/electric-fireplaces/`, `/products/wood-fireplaces/`, `/products/outdoor-fireplaces/`) have at minimum a placeholder that renders without a 404 before launch. Buyers who click a card and hit a 404 experience the worst possible brand moment at the moment they have just expressed category intent.

### 2. Image fails to load

If a card image 404s (Bynder CDN URL is broken or asset is removed), the image container shows the brand warm-gray background with the category title in large centered type. Same fallback pattern as the product page hero. This is a designed state, not an error state. The card remains fully functional and navigates correctly. Flag missing images as a build-time warning.

### 3. Category subcopy ("18 models") goes stale

The `sub` field on each card in `index.json` currently reads "18 models," "9 models," etc. These numbers need to be updated whenever HHT adds or removes products from a category. The risk: a card says "18 models" when there are now 21, and a buyer who clicks through expecting 18 finds more. This is a low-stakes discrepancy (more models is a positive surprise) but the pattern of manually-maintained counts that drift from reality is a content debt risk.

**Mitigation for v2:** source the model count dynamically from the Astro content collection at build time rather than hardcoding it in `index.json`. At build time, count the products in the `products-en` collection filtered by energy type, and inject that count into the card subcopy. This ensures the count is always accurate and the maintenance burden disappears.

For v1, the hardcoded count is acceptable. Document this as a content maintenance obligation for HHT: when products are added or discontinued, update the Browse the Lineup card subcopy in `index.json`.

### 4. Screen reader and keyboard navigation

The module is a `<section>` with `aria-labelledby` pointing to the module heading (`id="browse-lineup-heading"`).

Each card is a `<div>` (not a `<section>`, not an `<article>` — cards are navigation elements, not independent content objects). The entire card at desktop is wrapped in a single `<a>`. At mobile, the `<a>` wraps only the button element within the card.

At desktop (full-card link): the card `<a>` has an `aria-label` that includes the full category context: `aria-label="Browse Gas Fireplaces — direct-vent, B-vent, ventless, 18 models"`. This gives a screen reader user the full card context in one announcement without having to tab through the image alt text and subcopy separately.

At mobile (button-only link): the card image has a descriptive `alt` attribute (same text as `image_alt` in the data). The category title is a heading element (`<h3>`). The button's accessible label is its visible text: "Browse Gas." The screen reader user gets: heading "Gas Fireplaces," then button "Browse Gas." This is sufficient.

Tab order through the module at desktop: heading (no tab stop), card 1 link, card 2 link, card 3 link, card 4 link. Four tab stops, which is acceptable.

### 5. Print

At print, the image grid does not render. The categories render as a bulleted list:

```css
@media print {
  .browse-lineup-grid { display: block; }
  .browse-lineup-card { display: list-item; margin-left: 1.5em; }
  .browse-lineup-card img { display: none; }
  .browse-lineup-card-cta { display: none; }
  .browse-lineup-card::before {
    content: attr(data-category-title);
    font-weight: bold;
  }
}
```

This handles the rare case of a buyer printing the homepage (unlikely, but possible in an educational or comparison context).

### 6. If category count grows to 6 in a future revision

When the decision is made to promote Log Sets and/or Accessories to the homepage card grid, the grid layout shifts to `grid-cols-3` for a 3x2 layout at desktop (or `grid-cols-6` if forcing a single row — but at most viewport widths, 6 cards in one row produces cards too narrow for readable subcopy). The mobile layout shifts to a 2x3 grid (still no carousel).

The `browse_lineup_block` data model in `index.json` already supports more than 4 cards (it is a `cards: []` array). Adding card entries does not break the data model. The component should be built to handle 4 or 6 cards gracefully, using the card count to determine the grid column count:

```
card count: 4 → grid-cols-4 desktop, grid-cols-2 mobile
card count: 5 → grid-cols-5 desktop (unusual, avoid), grid-cols-2 mobile
card count: 6 → grid-cols-3 desktop, grid-cols-2 mobile
```

Do not build a 5-card layout. If a fifth category is added, the right response is to evaluate whether a sixth is also needed before shipping, or to keep 4 and move the fifth into the navigation only.

---

## Copy Patterns

### Module eyebrow

Current: "Browse the Lineup" — this is correct. Keep it. The eyebrow is a wayfinding label, not a headline. It tells the buyer where they are in the page structure. Changing it to something evocative ("Find Your Flame Type") is a regression; it adds personality at the cost of orientation clarity.

### Module heading

Current: "Four ways a Heat & Glo fits a room." — strong. Keep it. This heading does what the best copy does: it is specific ("Four ways"), it is honest about what this section does (shows you four things), and it reframes the product decision as a room-fit question. "A Heat & Glo" rather than "Heat & Glo" is a subtle distinction that humanizes the product (you are picking one specific fireplace, not a brand).

If the card count changes to 6, the heading becomes "Six ways a Heat & Glo fits a room." Mechanically simple.

### Module subhead (lede)

Current: "Gas, electric, wood, and outdoor — every Heat & Glo fireplace is engineered for the way American homes actually live." — strong. The phrase "the way American homes actually live" is earned confidence. It implies specificity of design intent without making a specific claim that requires substantiation. "Actually" is doing work: it distinguishes Heat & Glo from aspirational/lifestyle-only brands.

If the locale is `en-CA`, update this line: "Gas, electric, wood, and outdoor — every Heat & Glo fireplace is engineered for the way Canadian homes actually live." The word "Canadian" is the only change; the sentence structure is identical.

### Card category titles

- "Gas Fireplaces" — not "Gas" alone (incomplete), not "Gas Fireplace Models" (redundant)
- "Electric Fireplaces" — same principle
- "Wood Fireplaces" — not "Wood-Burning Fireplaces" (accurate but long for a card title)
- "Outdoor Fireplaces" — not "Outdoor Fire Features" (the current `index.json` uses "Outdoor Fireplaces," which is the correct simplification)

### Card subcopy ("sub" field)

Pattern: `{key sub-types} · {model count}`

The subcopy line is the disambiguation layer. It exists for buyers who are not sure which category they belong to. A buyer who has a gas line but has not decided between a direct-vent and a B-vent (they might not even know the difference yet) sees "Direct-vent, B-vent, ventless" and understands this category covers all gas options. They click.

The model count ("18 models") does two things: it communicates selection depth (there are enough choices to fit their room and budget), and it creates a reason-to-click (the buyer wants to see what those 18 models are).

### CTA button text

Pattern: "Browse {Category Noun}"

- "Browse Gas" — not "Browse Gas Fireplaces" (redundant with the card title above it), not "See Gas" ("see" is weaker than "browse" in this context — "browse" implies volition and selection behavior, "see" implies passive observation)
- "Browse Electric"
- "Browse Wood"
- "Browse Outdoor"

The short form works because the category title on the card already provides the full context. The button restates the action and the destination abbreviation. On a full-width button at mobile, "Browse Gas" is more legible than "Browse Gas Fireplaces" at the button's rendered size.

### Alignment

Current `index.json` has `"alignment": "center"`. The eyebrow, heading, and lede are center-aligned above the card grid. This is correct for a module sitting in the middle of the homepage flow: centered text above a symmetric grid reads as designed, not lazy. The individual card content (title, subcopy, CTA) is left-aligned within each card. This contrast between center-aligned module intro and left-aligned card content is a standard pattern that creates visual hierarchy without complexity.

---

## Data Dependencies and Pre-launch Gates

1. All four `cta_href` values in the cards must resolve to live or placeholder category landing pages. Confirm `/products/gas-fireplaces/`, `/products/electric-fireplaces/`, `/products/wood-fireplaces/`, and `/products/outdoor-fireplaces/` are routed before the module ships.
2. All four Bynder CDN image URLs are reachable (HTTP 200). The current `index.json` URLs are present and were sourced in the Phase 8 crawl, but CDN asset availability should be re-validated at pre-launch. Bynder transform parameters must be confirmed compatible with the CDN's current API version.
3. GA4 property has `hngl_browse_card_click` event and `entry_category` session-scoped custom dimension registered before launch.
4. The `en-CA` locale version of the lede copy ("Canadian homes actually live") is in the `en-CA` page JSON before the Canada locale pages go live.

---

## Component Location and Implementation Notes

The module replaces and formalizes the existing `browse_lineup_block` handling in the homepage renderer. It should be extracted as:
`src/components/BrowseTheLineup.astro`

Props interface:

```typescript
interface Props {
  eyebrow: string;          // "Browse the Lineup"
  heading: string;          // "Four ways a Heat & Glo fits a room."
  lede: string;             // subhead body copy
  alignment: 'center' | 'left';  // module-level heading alignment
  cards: Array<{
    image: string;          // Bynder CDN URL
    image_alt: string;      // descriptive alt text
    title: string;          // "Gas Fireplaces"
    sub: string;            // "Direct-vent, B-vent, ventless · 18 models"
    cta_text: string;       // "Browse Gas"
    cta_href: string;       // "/products/gas-fireplaces/"
  }>;
  locale?: string;          // default 'en'
}
```

The component is fully static-rendered. No client-side JavaScript required for the module shell. The GA4 event emission on card clicks is a small inline `onclick` attribute or a scoped `<script>` block. The module does not require `client:load` or `client:visible`.

---

_Spec version: v1. Next revision triggered by: card count decision (4 vs 6 categories), 90-day click distribution data, or season-aware ordering data becoming available after a full calendar year._
