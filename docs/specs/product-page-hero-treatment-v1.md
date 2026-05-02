# Product Page Hero Treatment — Design Spec v1

**Date:** 2026-04-30
**Author:** Ghostface Killah (Tony Starks) for Heat & Glo rebuild
**Status:** Ready for engineering handoff, pending photography strategy confirmation from HHT
**Scope:** The above-the-fold hero section on `/fireplaces/<family>/` product family pages (Mezzo, Cosmo, Slimline, Pioneer, 6K/8K Series, etc.) and accessory category pages.

---

## Context and Conversion Theory

The product page hero is the moment of first impression for a buyer who has made it past the homepage and selected a specific fireplace family to evaluate. They came from a category browse page (`/fireplaces/gas/`), a dealer recommendation, a Google search for "Mezzo 48 fireplace," or a link from a design blog. However they arrived, they have demonstrated specific intent.

The homepage hero sells the brand and the category ("Heat & Glo makes fireplaces — here's why they're worth considering"). The product page hero does something completely different: it sells this specific family. It answers the buyer's first question before they ask it: "Is this the one?"

There are three conversion jobs this hero must perform simultaneously:

1. Confirm identity: the buyer landed on the right page. They searched for the Mezzo, and immediately they see the Mezzo, named, photographed, described in one sentence. No ambiguity.
2. Communicate scale: a fireplace lives in a room. The buyer needs to see it in a room, at scale, with light and material context, not against a white product-photography background. If the hero shows a Mezzo 60 in a 22-foot living room with a stone surround and oak floors, the buyer knows this is a large-statement piece. If it shows a cropped product shot, the buyer has no scale reference and will not understand what they are evaluating.
3. Move the buyer toward the dealer: the hero must generate enough desire and enough orientation (what sizes exist, what makes this family special) that the buyer's natural next action is to either scroll deeper for details or immediately click the dealer locator because they have seen enough. Both of these outcomes are wins. A hero that generates scroll-depth and a hero that generates immediate dealer-CTA clicks are both working correctly. A hero that generates an immediate back-navigation is the failure state.

The load-bearing assumption: a buyer who engages with the hero photography for more than 8 seconds (dwelling, not bouncing) is a higher-quality lead than a buyer who spends 8 seconds reading the description copy. The image does the heaviest persuasion work. All other hero elements are supporting infrastructure.

---

## UX Pattern

### Page flow position: above the fold, always

The hero is the first thing rendered on the page. It sits above the available-sizes nav strip, above the size sub-modules, above Complete the Look, above everything. It occupies the full viewport height minus the global navigation bar.

Vertical order of the full product page:

```
[Global nav bar]
---
[Product Page Hero]     <-- THIS SPEC
---
[Available sizes nav strip]
[Size sub-module 1] ... [Size sub-module N]
---
[Complete the Install module]
---
[Find a Dealer CTA section]
[Available in: US / Canada badge]
[Footer]
```

### Desktop layout (viewport >= 1024px)

The hero is a split-panel composition: photography fills 60% of the horizontal space on the right; the content column occupies 40% on the left. This is a deliberate inversion of the standard left-image/right-text pattern. The rationale: the buyer's eye arrives at the center of the browser window, and a fireplace photograph positioned right-of-center draws the eye while the content column on the left registers peripherally. When they focus the content column, they have already spent a moment on the photograph. Reverse the order and the content column competes with the image for first attention rather than following it.

```
+------------------------------------------+-------------------------------------+
|                                          |                                     |
|   [eyebrow: GAS FIREPLACE · INDOOR]      |                                     |
|                                          |   [PRIMARY PHOTOGRAPHY]             |
|   Mezzo Series                           |                                     |
|   [family name in large serif or         |   Full-height image, Bynder CDN     |
|    display weight]                       |   object-cover, right-aligned        |
|                                          |   composition, room context.        |
|   [one-sentence value prop]              |                                     |
|   The thinnest gas fireplace frame       |                                     |
|   in its class — 1.5 inches of          |                                     |
|   black surround that disappears        |                                     |
|   into the wall.                        |                                     |
|                                          |                                     |
|   [SIZE SELECTOR QUICK-JUMP]             |                                     |
|   Available in:                          |                                     |
|   [32] [36] [48] [60] [72]              |                                     |
|   (pill buttons, each anchors to        |                                     |
|    that size's sub-module below)         |                                     |
|                                          |                                     |
|   [PRIMARY CTA]                          |                                     |
|   [Find a Dealer Near You]              |                                     |
|                                          |                                     |
|   [SECONDARY CTA]                        |                                     |
|   Download Spec Guide (PDF)             |                                     |
|    or  Design Guide (PDF)               |                                     |
|                                          |                                     |
|   [TRUST SIGNAL]                         |                                     |
|   Engineered since 1975 · Made in       |                                     |
|   Lake City, MN                         |                                     |
|                                          |                                     |
+------------------------------------------+-------------------------------------+
```

Content column details:

- Eyebrow: uppercase, small, neutral-500. Format: `{ENERGY} FIREPLACE · {PLACEMENT}`. Sourced from `data.energy` and `data.placement` on the product record. For a gas indoor unit: "GAS FIREPLACE · INDOOR." For a see-through: "GAS FIREPLACE · SEE-THROUGH." This is orientation copy, not marketing copy. Keep it utilitarian.
- Family name: the `h1` for the page. Large display weight. This is the product identity anchor. Font size should be large enough that the family name reads immediately at desktop resolution — 48px minimum, 64px preferred for longer names.
- Value prop: one sentence, maximum 20 words. This is the single hardest copy decision in the hero. It must: (a) differentiate this family from all other Heat & Glo families, (b) communicate the specific design or engineering distinction that makes this family worth caring about, and (c) do this in plain language that a homeowner, a designer, and a builder can all read and immediately understand. Write this per-family. No generic placeholder copy. No "experience the warmth" language.
- Size selector: "Available in:" label, then one pill button per size in the `data.sizes` array. Pill size labels should be the nominal size in inches, not the model code (show "48" not "SL-48" unless there is no clean nominal size). Clicking a pill scrolls the buyer to the corresponding size sub-module anchor below the hero. Active/hover state: pill background fills with brand orange, label inverts to white.
- Primary CTA: "Find a Dealer Near You." This is the money button. It routes to `/where-to-buy/` OR opens the dealer locator widget inline as a modal/drawer if the dealer widget is implemented as a client-side component. The product context (family name) should pre-populate any context field in the consultation form: when this buyer submits a consultation request, the dealer knows they were looking at the Mezzo, not just browsing generically.
- Secondary CTA: text link, not a full button. Routes to the family's spec PDF (`data.spec_pdf_url`) if one exists. If no spec PDF exists and a design guide exists, route there. If neither exists, suppress this element entirely. Do not show a grayed-out secondary CTA pointing nowhere. The secondary CTA serves architects, specifiers, and detail-oriented homeowners who want dimensionals before they commit to a dealer conversation.
- Trust signal: small, below both CTAs. "Engineered since 1975 · Made in Lake City, MN." Sourced from a global trust constant, not per-product. This is the brand credential, not the product credential. It sits below the CTAs because it is reassurance, not a primary persuasion element. The buyer should already want the product before they read the trust signal.

### Mobile layout (viewport < 768px)

Mobile inverts the layout. Photography moves above the content column, filling the full viewport width at a 16:9 or 4:3 crop (whichever the Bynder CDN transform produces — see Photography section). The content column stacks below, full-width.

```
+----------------------------------+
|                                  |
|   [PHOTOGRAPHY - full width      |
|    16:9 or 4:3 crop, room view]  |
|                                  |
+----------------------------------+
| GAS FIREPLACE · INDOOR           |
|                                  |
| Mezzo Series                     |
| [family name, h1, display size]  |
|                                  |
| [value prop, one sentence]       |
|                                  |
| Available in:                    |
| [32] [36] [48] [60] [72]        |
| (scrollable row, not wrapping)   |
|                                  |
| [Find a Dealer Near You]         |
| [Download Spec Guide]            |
|                                  |
| Engineered since 1975 ·          |
| Made in Lake City, MN            |
+----------------------------------+
```

Size selector row on mobile: do not wrap the pills to a second line. Put the row in a horizontally scrollable container (`overflow-x: auto`, `-webkit-overflow-scrolling: touch`). If there are 5 size options and only 3 fit in the viewport width, the buyer can swipe the row. This is preferable to wrapping because it preserves the single-line visual rhythm. A size-selector that wraps to two lines at mobile looks like a broken layout, not a design decision.

Find a Dealer CTA on mobile: full-width button, minimum 48px height. This is the primary touch target on the entire page. Do not make it smaller to accommodate the secondary CTA below it.

### Photography strategy: family-wide vs per-size

This is the most consequential design decision in the hero spec. The answer has downstream effects on Bynder CDN asset requirements, build complexity, and buyer experience.

**Option A: one family-wide hero image**
One photograph for the Mezzo Series, used at all size variants. The image shows a Mezzo in a room, at a size that roughly represents the midpoint of the family (a 48 or 60 for the Mezzo, which goes 32-72). When the buyer scrolls to the 32 sub-module, they have already seen a 60 in a photo. There is a representational gap.

**Option B: per-size hero images**
Each size in the size selector has its own hero photograph. When the buyer clicks the "48" pill, the hero image updates (soft cross-fade) to show a Mezzo 48 in a room context. This gives buyers the most accurate scale reference.

**Recommendation: Option A at launch, Option B as a v2 enhancement**

Rationale: Option B requires 5 hero photographs per fireplace family. At 105 fireplace families, this is 525 curated lifestyle photographs at Bynder CDN. HHT's current image inventory does not have this coverage at the level of quality needed for above-the-fold hero treatment. Launching with incomplete per-size photography (some sizes with a rich room photo, other sizes with a white-background product shot as fallback) produces an inconsistent, low-quality experience on the page that matters most.

Option A with one strong family-wide photograph is a better experience than Option B with mixed photography quality. The size sub-modules below the hero can have per-size photography at a smaller scale (gallery images within the sub-module), which addresses the scale-reference problem without requiring hero-quality photography for every size.

**When to reconsider Option B:** if HHT provides a complete photography brief confirming Bynder CDN assets for all sizes of the launch families, Option B is the correct call. The spec should be revisited before component build if that asset brief arrives.

### Hero photography specifications (Bynder CDN)

All hero photography uses the Bynder CDN transform API, consistent with the existing pattern throughout the build (see `index.json` content block images for the URL format).

Desktop transform: `?io=transform:fill,width:1200,height:900` (4:3 portrait crop, right-panel at 60% width)
Mobile transform: `?io=transform:fill,width:800,height:600` (4:3 landscape crop, full-width banner)

Alt text format: `{Family name} {energy} fireplace in a {descriptor} room setting` — auto-generated from product data plus a `hero_image_alt` field on the product record if the HHT marketing team provides a curated description.

The hero image is NOT lazy-loaded. It is the Largest Contentful Paint element. It must load as a priority resource. Use `loading="eager"` and `fetchpriority="high"` on the `<img>` element. Lazy-loading the hero photograph is a performance anti-pattern that increases LCP time and hurts Core Web Vitals scores.

### The relationship between the hero and the size sub-modules

The hero operates as an orientation layer. The size sub-modules below it are the evaluation layer. The relationship must be explicit in the UX:

1. The size selector pills in the hero are a navigation promise. Clicking "48" scrolls the buyer to the Mezzo 48 sub-module. That sub-module must exist and must deliver detailed dimensional data, spec tables, and photography. If the sub-module is a placeholder or empty, the pill click is a broken promise.
2. The hero's value prop describes the family. The size sub-modules describe each specific model. There should be no contradiction between the family-level value prop and the size-level copy. (If the family value prop says "the thinnest frame in its class," the size sub-module copy should not mention that a competing brand also has a thin frame for a specific size. Family value props are big-picture; size copy is precise and dimensional.)
3. The "Find a Dealer" CTA in the hero is for buyers who know enough after seeing the hero. The "Find a Dealer" CTA at the bottom of the page (in the Dealer CTA section, after Complete the Look) is for buyers who needed to read the full page before committing. Both should be present. The hero CTA is not optional even though a similar CTA exists at the bottom of the page. These are two different buyer states.

---

## Conversion Theory and Measurement Plan

### The attribution problem (honest accounting)

The product page hero generates no direct revenue event. Everything it produces is an intermediate signal: scroll depth, size selector engagement, CTA clicks, spec PDF downloads. The terminal event (dealer consultation request) happens further down the funnel. Measurement of the hero is about understanding which buyers it moves forward and which buyers it loses.

### What IS measurable (instrument from day one)

**1. Hero image dwell**
Passive scroll depth is a proxy. If the buyer scrolls past the hero (past the fold) they have engaged at minimum. If they scroll past the hero AND return to it (backward scroll), they are considering. Time on page is not the same as hero dwell. Instrument scroll depth specifically.

```
gtag('event', 'hngl_product_hero_scroll_past', {
  fireplace_family: 'mezzo',
  page_locale: 'en-us'
});
```

Fire this once when the buyer scrolls below the hero fold. Do not fire repeatedly.

**2. Size selector pill click**

```
gtag('event', 'hngl_product_size_select', {
  fireplace_family: 'mezzo',
  size_selected: '48',           // the pill value
  source: 'hero',                // 'hero' vs future sources (size strip nav, etc.)
  page_locale: 'en-us'
});
```

**3. Primary CTA click (Find a Dealer)**

```
gtag('event', 'hngl_product_hero_dealer_cta', {
  fireplace_family: 'mezzo',
  page_locale: 'en-us'
});
```

**4. Secondary CTA click (spec PDF or design guide download)**

```
gtag('event', 'hngl_product_hero_spec_download', {
  fireplace_family: 'mezzo',
  document_type: 'spec-pdf',    // 'spec-pdf', 'design-guide'
  page_locale: 'en-us'
});
```

**5. Bounce rate on product family pages**
Monitor in GA4 as standard engagement rate. A product page that has the hero fully loaded but a 70%+ bounce rate (buyer arrives, does not scroll at all, leaves) indicates the hero photograph or family name is not matching search intent. The buyer expected something different from what the page shows.

### Success vs failure thresholds (90-day post-launch review targets)

| Metric | Success | Failure threshold | Action if failure |
|--------|---------|-------------------|-------------------|
| Scroll-past-hero rate among product page sessions | 55%+ | Under 30% | Hero is not compelling enough to invite scroll — A/B test photograph selection or value prop copy |
| Size selector click rate among scroll-past-hero sessions | 25%+ | Under 8% | Size pills not visible or understood — increase pill contrast, evaluate label clarity |
| Primary CTA (dealer) click rate on product pages | 5%+ per session | Under 1% | CTA is buried — check rendering, button color contrast, position on mobile |
| Spec PDF download rate | Tracked but not a success/failure metric — it is a researcher behavior, not a conversion behavior. High download rate = specifiers on the site, which is correct but different from homeowner buyer flow. | |
| Bounce rate on product family pages | Under 50% | Above 65% | Hero photograph or page is not matching search intent — audit which queries route to the page |

### What is NOT measurable

- Whether the buyer's choice of which size to click in the hero influenced their eventual purchase size. Traceable only with dealer-CRM data sharing.
- Whether a spec PDF download resulted in a designer specifying the product in a project. Traceable only with PRO program registration data.

---

## Edge Cases

### 1. Product record has no hero image

When `data.hero_image` (or the first entry in `data.gallery`) is null or unresolved, the photography panel renders a brand-color fill (Heat & Glo warm gray or brand orange at low opacity) with the family name as large centered type. This is the photography-fallback state.

Do not render a broken image element. Do not show a placeholder box with an "image coming soon" label. The brand-color fill reads as a design choice; a broken image reads as a technical failure. Buyers cannot distinguish an intentional minimal design from a photography placeholder. Treat this as a designed state, not an error state.

Flag families with missing hero images as a content launch gate. The engineering team should produce a build-time warning (not a build-breaking error) listing all family pages that are rendering the fallback hero state. HHT's marketing team uses this list to prioritize photography delivery.

### 2. Family has only one available size

When `data.sizes` has exactly one entry, the size selector renders as static text rather than a clickable pill: "Available in: 48-inch model." No pills, because pills imply a selection to be made, and there is no selection when there is only one option. The single size label links directly to the size sub-module anchor.

### 3. Value prop copy is missing from product data

If `data.hero_value_prop` is null or absent, the hero renders without the value prop line. The layout accommodates this by removing that row of the content column; the family name and CTAs remain. Do not fall back to `data.description` for the value prop — the description is written for body-copy reading depth, not for the condensed hero format. An improperly truncated description in the hero position reads worse than no value prop at all.

This means the `data.hero_value_prop` field must be part of the product content schema, populated for every family before that family's page goes live. This is a content gate, parallel to the `complete_the_look[]` population gate in the Complete the Look spec.

### 4. Spec PDF link is broken or the URL returns a 404

The secondary CTA links to `data.spec_pdf_url`. If that URL 404s (the PDF was moved or deleted in HHT's document management system), the CTA button is visible but leads to a broken destination. 

Mitigation: at build time, the `[family].astro` component should verify that `spec_pdf_url` is a reachable URL. If the check fails, suppress the secondary CTA rather than rendering a broken link. This requires a lightweight build-time HTTP check (a HEAD request to the PDF URL during `getStaticPaths`). It adds some build time but prevents dead secondary CTAs at launch.

If a build-time check is out of scope for v1, add a note in the component: "TODO: validate spec_pdf_url at build time before v2 launch."

### 5. Screen reader and keyboard navigation

- The `<h1>` is the family name. This is the page's primary heading. The eyebrow above it (energy + placement) is a `<p>` element, not an `<h2>` or any heading element. It is supplementary orientation, not document structure.
- The size selector pills are `<a>` elements pointing to anchor links. They are not `<button>` elements because they navigate, not trigger JavaScript. Each pill's accessible label is "Jump to {size} sub-section" (`aria-label` attribute), not just the numeric label, because a screen reader reading "32 36 48 60 72" in sequence is not meaningful.
- The photography panel has an `alt` attribute on the `<img>`. It is not a decorative image; it is contextual. Use the auto-generated alt text format defined in the Photography section.
- The primary CTA button has no separate `aria-label` beyond its visible text ("Find a Dealer Near You"). The visible text is already descriptive.
- The trust signal text is a `<p>`. Not a `<small>` (deprecated semantic meaning). Not an `aria-hidden` element — this information is accessible to screen reader users.

### 6. Print

The hero hero image prints at a reasonable size (set `max-height: 4in` in the print stylesheet so it does not consume a full printed page). The size selector pills do not print (they are navigation, not content). The family name, value prop, and trust signal print as standard text. The CTAs are suppressed in print, but the URL they point to is rendered as a parenthetical text note: "Find a dealer: heatnglo.com/where-to-buy/" — this gives a printing buyer an actionable path.

```css
@media print {
  .product-hero-photo { max-height: 4in; object-fit: contain; }
  .product-hero-size-selector { display: none; }
  .product-hero-cta-primary::after {
    content: ' (heatnglo.com/where-to-buy/)';
    font-size: 0.85em;
    font-weight: normal;
  }
  .product-hero-cta-secondary { display: none; }
}
```

---

## Copy Patterns

### Eyebrow format

Pattern: `{ENERGY TYPE} FIREPLACE · {PLACEMENT CONTEXT}`

Examples:
- "GAS FIREPLACE · INDOOR"
- "GAS FIREPLACE · OUTDOOR"
- "GAS FIREPLACE · SEE-THROUGH"
- "ELECTRIC FIREPLACE · WALL-MOUNT"
- "WOOD FIREPLACE · INDOOR"

The eyebrow uses `data.energy` and `data.placement` directly. Standardize the capitalization in the data layer rather than in CSS `text-transform`. CSS text-transform affects the visual render but screen readers still read the underlying case. If the data is stored lowercase ("gas," "indoor"), the CSS uppercases it visually; the screen reader says "gas fireplace · indoor" in lowercase. That is fine. But if the data is already uppercase, the CSS `text-transform: uppercase` is a no-op and the accessibility is consistent.

### Family name (h1)

Use `data.family` exactly. Do not append "Series" unless it is already in the data value. The current product records show "Mezzo" (without "Series"), "Cosmo," "Slimline," etc. If HHT's brand standard is "Mezzo Series," that belongs in the data, not added by the template.

### Value prop: writing brief for HHT product team

The value prop is one sentence. Maximum 20 words. It answers one question: what does this fireplace family do that no other Heat & Glo family does, or what does it do better than comparable products in the market?

It is NOT:
- A feature list ("gas fireplace with IPI ignition and IntelliFire Plus technology")
- A category description ("a gas fireplace for your indoor living space")
- A generic aspiration phrase ("experience warmth and comfort in every room")

It IS:
- A specific claim ("The thinnest frame in the direct-vent gas category at 1.5 inches")
- A design distinction ("Clean-face design means the only thing you see is the flame")
- A performance statement ("60% more flame coverage than the previous generation")

If HHT's product team cannot supply a value prop that meets this test, prompt them with: "What would a designer say to justify choosing this family over the next Heat & Glo family in the same price range?" That conversation produces a value prop. Generic product descriptions do not.

### Size selector: "Available in:"

The label above the pills is "Available in:" — not "Choose a size" (implies they should pick one, when browsing all is also valid) and not "Models" (too technical for a homeowner audience). "Available in:" positions the pills as disclosure of what exists, not as a required selection.

If sizes are named with nominal widths ("Mezzo 32," "Mezzo 48"), the pill shows only the number ("32," "48"). The family name is already the page heading; repeating it in every pill adds no information. If sizes have non-numeric identifiers (model codes like "SL-7X"), display those as-is; do not invent nominal widths that do not exist in the product record.

### Primary CTA: "Find a Dealer Near You"

Not "Shop Now" (Heat & Glo does not sell direct).
Not "Get a Quote" (quotes come from dealers, not from heatnglo.com).
Not "Learn More" (weakest CTA verb in existence).
Not "Contact Us" (routes to a generic form, not a local dealer).

"Find a Dealer Near You" tells the buyer exactly what clicking does. The "Near You" modifier is important: it personalizes the CTA to their geography and makes the dealer locator feel like a discovery, not a referral. It also sets an expectation: there IS a dealer near them (this is true for 95%+ of US buyers). The CTA communicates confidence in the network.

### Secondary CTA: "Download Spec Guide" vs "Download Design Guide"

Use "Spec Guide" if the linked PDF is a dimensional/technical document (targeted at designers, builders, specifiers).
Use "Design Guide" if the linked PDF is an inspiration/configuration document (targeted at homeowners making design choices).

If both exist as separate documents, show both, stacked: "Download Spec Guide" above "Download Design Guide." Two secondary CTAs is the maximum. Three secondary CTAs collapses the hierarchy.

### Trust signal line

"Engineered since 1975 · Made in Lake City, MN"

This is a global constant. Both facts are sourced from the trust_strip_block in `index.json` (50 years / MN manufacturing). The trust signal on the product page is abbreviated (no icon, no large numerals) because the homepage trust strip has already introduced these facts to most buyers. On the product page it reads as a quiet credential, not a headline.

---

## Data Dependencies and Pre-launch Gates

1. Every family page in the launch set has `data.hero_image` (or `data.gallery[0]`) populated with a Bynder CDN URL pointing to a real, accessible lifestyle photograph. Families without this field render the fallback state. This is flagged in a build-time warning list for HHT marketing to action.
2. Every family page has `data.hero_value_prop` populated with a single-sentence family distinction. This is a content launch gate. Do not let family pages go live with a null value prop — suppress the field's row in the hero layout, not the entire hero.
3. `data.spec_pdf_url` is validated at build time (HEAD request) or suppressed if absent.
4. All GA4 events listed in the Measurement section are configured in the GA4 property before launch (not after). The `hngl_product_size_select` event especially has high diagnostic value in the first 30 days.
5. Per the locked IA: the size sub-modules below the hero must have their own sections with proper `id` attributes matching the size identifiers in `data.sizes[].id`. If the sub-module anchors do not exist, the size selector pills navigate to nothing. This is an existing pattern in the current `[family].astro` renderer (each size `<article>` has `id={s.id}`) but confirm the IDs match the pill values when the hero component is implemented.

---

## Component Location and Implementation Notes

The hero section replaces the current `<header class="mb-12">` block in `[family].astro` (lines 42-47 of the current renderer). The current header is a minimal placeholder. This spec is the full-production replacement.

The hero component should be extracted as:
`src/components/ProductHero.astro`

Props interface:

```typescript
interface Props {
  familyName: string;           // data.family
  energy: string;               // data.energy
  placement: string;            // data.placement
  heroImage: string | null;     // data.hero_image or data.gallery[0]
  heroImageAlt: string;         // data.hero_image_alt or auto-generated
  valueProp: string | null;     // data.hero_value_prop
  sizes: Array<{
    id: string;                 // anchor ID
    label: string;              // display label (nominal width or model code)
  }>;
  dealerCtaHref: string;        // '/where-to-buy/' + optional query params
  specPdfUrl: string | null;    // data.spec_pdf_url (null if not present or 404)
  designGuideUrl: string | null; // data.design_guide_url
  locale?: string;              // default 'en'
  productFamilyId: string;      // for GA4 event payload
}
```

The component is static-rendered (`client:load` is NOT needed for the hero shell). The only client-side JavaScript is the GA4 event emission on pill clicks and CTA clicks, implemented as small inline `onclick` handlers or a scoped `<script>` block.

---

## Open Questions for HHT Product Team

1. **Is there a per-family `hero_value_prop` field in HHT's product database, or does this need to be written by the HHT marketing team for all 105 families?** The field must exist before family pages go live. Understanding who writes it (agency, HHT marketing, or a hybrid) determines the content production timeline.
2. **Does HHT have Bynder CDN assets at the required dimensions (4:3 portrait, lifestyle/room context) for all launch families?** This drives the photography-strategy decision (Option A family-wide vs Option B per-size). The agency cannot make this call — it requires an asset audit from HHT's DAM team.
3. **Is the secondary CTA a spec PDF (dimensionals) or a design/inspirations guide PDF?** Both exist for some families. The distinction matters for CTA copy. The correct framing differs by document type.
4. **Should the "Find a Dealer Near You" CTA in the hero pre-populate any context into the dealer locator or consultation form?** For example: clicking from the Mezzo page could pre-fill "Interest: Gas Fireplace" in the consultation form and track the originating family in the GA4 event. This requires a query parameter on the CTA href (e.g., `/where-to-buy/?from=mezzo&interest=gas`). Confirm whether this level of context threading is in scope.

---

_Spec version: v1. Next revision triggered by: HHT photography asset brief, per-size photography confirmation, or 90-day measurement review._
