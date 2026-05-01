# Complete the Look Module — Design Spec v1

**Date:** 2026-05-01
**Author:** Ghostface Killah (Tony Starks) for Heat & Glo rebuild
**Status:** Ready for engineering handoff, pending HHT product team data sign-off
**Scope:** Per-fireplace-family product page module surfacing compatible accessories
(mantel-shelves, stone-surrounds, wood-mantels; hearth-stones reserved for future)

---

## Context and Conversion Theory

Heat & Glo does not sell direct. The buyer's journey ends at a dealer consultation, not a cart.
The module's job is not to close a sale. Its job is to expand the buyer's mental basket before
they hit "Find a Dealer."

A buyer who walks into a dealer consultation thinking "I want a Mezzo 48 AND a stone surround"
is a fundamentally different conversation than a buyer thinking only "I want a fireplace."
The first conversation is higher-value, harder to walk back, and produces a larger ticket.

The module exists at one inflection point: after the buyer has decided they like this fireplace
family (they've scrolled through sizes, they're committed enough to still be reading), but before
they have committed to a specific dealer. That is the exact moment to show them what a complete
install looks like. Not as a hard upsell. As a natural "and here's what goes around it" beat.

Every CTA in the module routes to either the accessory's own product page (where another dealer
CTA lives) or directly to the dealer locator with consultation context pre-populated. No dead ends.

---

## UX Pattern

### Page flow position

The module sits AFTER the size sub-modules and BEFORE the dealer CTA section. The current
`[family].astro` renderer already stubs this with a `complete_the_look` conditional block at
lines 84-96. This spec replaces that placeholder with a fully-specified component.

Rationale for this position: by the time the buyer reaches the module they have already processed
sizes, specs, and dimensionals. They know roughly what they want. This is the enrichment beat,
not the introduction. Placing it earlier (e.g., after the hero) would interrupt the evaluation
flow before the buyer is committed. Placing it after the dealer CTA would bury it post-conversion.

The page vertical order for a family page:

```
[hero + family description]
[available sizes nav strip]
[size sub-module 1] ... [size sub-module N]
---
[Complete the Look module]          <-- THIS SPEC
---
[Find a Dealer CTA section]
[Available in: US / Canada badge]
```

### Desktop layout (viewport >= 768px)

The module renders as a contained section with a top border rule visually separating it from the
spec content above.

```
+-----------------------------------------------------------------+
| Complete the Install                           [Browse all accessories >] |
| Pair this fireplace with the finishing pieces that make the     |
| room complete. Bring the list to your dealer consultation.      |
|                                                                 |
| +-------------------+ +-------------------+ +-------------------+ |
| |  [image 4:3]      | |  [image 4:3]      | |  [image 4:3]      | |
| |                   | |                   | |                   | |
| | Stone Surrounds   | | Wood Mantels      | | Mantel Shelves    | |
| | Designed for      | | Designed for      | | Designed for      | |
| | linear gas        | | linear gas        | | linear gas        | |
| | fireplaces        | | fireplaces        | | fireplaces        | |
| |                   | |                   | |                   | |
| | [Plan this piece] | | [Plan this piece] | | [Plan this piece] | |
| +-------------------+ +-------------------+ +-------------------+ |
+-----------------------------------------------------------------+
```

Card count per row: 3 at desktop (lg+), matching the current 3 active accessory types.
When a 4th type (hearth-stones) goes live, the grid shifts to 4-up at xl breakpoint and
stays 2-up at md breakpoint. Do not build a 4-column grid until hearth-stones are active.

Each card contains:
1. Image (4:3 ratio, lazy-loaded, `object-cover`). Falls back to a category illustration
   placeholder (see Edge Cases: no image). Alt text format: `{accessory_title} compatible
   with {family} Series gas fireplace` (auto-generated from data).
2. Accessory title (e.g., "Stone Surrounds"). 16px semibold.
3. Compatibility label: "Designed for linear gas fireplaces" (or "Designed for {energy}
   {placement} fireplaces" auto-generated from product data). 14px neutral-500.
4. Primary CTA button: "Plan this piece" (see Copy section for full rationale). Full-width
   within the card at mobile, auto-width at desktop.

No price. No price band. No "starting at" language. Heat & Glo does not publish MSRP at
the product-page level and the spec brief explicitly excludes pricing hints.

### Module-level secondary CTA

Top-right of the module header, desktop only. Inline text link: "Browse all accessories"
pointing to `/accessories/`. On mobile this link moves below the card grid as a centered
text link with a right-arrow character (not an em dash, not a chevron SVG unless the
icon library already has one loaded on this page).

### Mobile layout (viewport < 768px)

Cards stack vertically in a single column. Scroll is standard document scroll, not a
horizontal scroll carousel. Rationale: the buyer is evaluating, not browsing a storefront.
Horizontal carousels work for product-discovery contexts (think Amazon "Customers also bought").
This is a consultation prep context. The buyer should read all three cards, not swipe past them.

```
+----------------------------------+
| Complete the Install             |
| Pair this fireplace with the     |
| finishing pieces that make the   |
| room complete.                   |
|                                  |
| +------------------------------+ |
| | [image 4:3]                  | |
| | Stone Surrounds              | |
| | Designed for linear gas      | |
| | fireplaces                   | |
| | [Plan this piece]            | |
| +------------------------------+ |
|                                  |
| +------------------------------+ |
| | [image 4:3]                  | |
| | Wood Mantels                 | |
| | Designed for linear gas      | |
| | fireplaces                   | |
| | [Plan this piece]            | |
| +------------------------------+ |
|                                  |
| +------------------------------+ |
| | [image 4:3]                  | |
| | Mantel Shelves               | |
| | Designed for linear gas      | |
| | fireplaces                   | |
| | [Plan this piece]            | |
| +------------------------------+ |
|                                  |
| Browse all accessories >         |
+----------------------------------+
```

CTA prominence on mobile: the "Plan this piece" button on each card is full-width,
minimum 44px touch target height. Background is Heat & Glo's primary brand color (use the
`btn-primary` class already defined in the design system). This is not a ghost/outline button.
These are the most important interactive elements on the lower half of the page.

### Interaction patterns

**Hover (desktop):** Card lifts with a subtle box-shadow transition (`shadow-md` to `shadow-lg`,
150ms ease-out). The card border transitions from `border-neutral-200` to `border-neutral-400`.
No image zoom. No overlay. The entire card surface is clickable and navigates to the accessory
page, but the explicit "Plan this piece" button is the primary affordance.

**Focus (keyboard):** Cards receive a visible focus ring (`outline-2 outline-offset-2
outline-brand-primary`). Tab order: module heading, card 1 CTA, card 2 CTA, card 3 CTA,
"Browse all accessories" link. The heading and compatibility label are not interactive.

**Tap (mobile):** No hover state. Standard active/pressed state on the button. The full card
is NOT clickable on mobile because accidental card-area taps are common during scroll. Only
the explicit "Plan this piece" button navigates. This is a deliberate deviation from desktop
behavior. On desktop the card-as-link pattern works because hover provides clear affordance.
On mobile, a card-sized tap target produces false positives during scroll.

**No animation on entrance.** Do not add intersection-observer fade-in or slide-up on scroll.
Rationale: the buyer on a product page is in evaluation mode, not being entertained. Motion
for its own sake adds visual noise and can delay perceived readiness of the CTA. If the design
system later adopts a site-wide entrance animation pattern, revisit this.

### Loading state

The module is static-rendered at build time via Astro's `getCollection` calls. There is no
client-side fetch. No skeleton loader is needed. If `complete_the_look[]` is empty the module
does not render (see Edge Cases). If the array is populated but an accessory record cannot be
resolved (e.g., slug in the array does not match any `accessories-en` collection entry),
the build should throw a hard error at compile time so the mismatch is caught before deploy,
not silently hidden at runtime.

This means the Astro component consuming this spec must do the accessory lookup at build time
using `getCollection('accessories-en')` filtered to slugs in `complete_the_look[]`, not at
runtime. This is the correct Astro pattern and it also enforces data integrity.

---

## Measurement

### The attribution problem

Heat & Glo's conversion event (dealer consultation scheduled) does not happen on heatnglo.com.
It happens on the dealer's calendar system, or by phone, or in the dealer's showroom. There is
no pixel on the dealer's scheduling page. This makes direct attribution of "Complete the Look
engagement caused a higher-value consultation" impossible to measure with standard web analytics.

This is not a failure of the measurement plan. It is the nature of the business model. The
measurement plan must be honest about what is measurable and what is not.

### What IS measurable (instrument from day one)

All events below use GA4 standard event names or custom event names prefixed `hngl_`.

**1. Module view**
Fire when the module enters the viewport (IntersectionObserver, 50% threshold).

```
gtag('event', 'hngl_ctl_viewed', {
  fireplace_family: 'mezzo',         // data.family, lowercase
  accessory_count: 3,                // complete_the_look.length
  page_locale: 'en-us'              // from Astro locale context
});
```

**2. Card CTA click ("Plan this piece")**
Fire on each individual card click.

```
gtag('event', 'hngl_ctl_card_click', {
  fireplace_family: 'mezzo',
  accessory_slug: 'stone-surrounds', // the slug being clicked
  accessory_type: 'stone-surround',  // from accessory record's accessory_type field
  card_position: 1,                  // 1-indexed position in the module (1, 2, 3)
  page_locale: 'en-us'
});
```

**3. "Browse all accessories" click**
Fire on the secondary module-level CTA.

```
gtag('event', 'hngl_ctl_hub_click', {
  fireplace_family: 'mezzo',
  page_locale: 'en-us'
});
```

**4. Dealer CTA click after Complete the Look engagement**
This is a sequence event, not a separate tag. GA4's Explore funnel report can sequence
`hngl_ctl_card_click` (or `hngl_ctl_viewed`) followed by `hngl_dealer_cta_click` within the
same session. The dealer CTA on the page should already be tagged with a GA4 event (confirm this
is part of the dealer-locator CTA spec). The funnel report produces:

"X% of sessions that engaged with Complete the Look also clicked Find a Dealer."

This is the closest approximation to attribution available without dealer-side data.

**5. GA4 custom dimension: `fireplace_engaged_with_ctl`**
Session-scoped boolean custom dimension. Set to `true` when `hngl_ctl_card_click` fires
in a session. This lets us build audience segments in GA4 (and, if HHT uses Google Ads,
retargeting audiences) of "buyers who engaged with accessory content but did not click
Find a Dealer." These are re-engagement targets.

### What is NOT measurable (be honest with HHT)

- Whether the buyer mentioned accessories when they walked into the dealer. Not trackable.
- Whether the dealer consultation resulted in a higher ticket because the buyer had accessories
  in mind. Not trackable without dealer CRM data shared with HHT.
- Whether the buyer printed or saved the accessory page and brought it to the consultation.
  Partially trackable via print stylesheet hit (print media query fires no events by default;
  would require a print-detection JS pattern, which is low-ROI to instrument).

### Success benchmarks

These are launch targets for the first 90 days post-launch, to be reviewed with David and HHT.

| Metric | Success | Failure (module is dead weight) |
|--------|---------|----------------------------------|
| `hngl_ctl_viewed` rate among fireplace family page sessions | 60%+ (module is visible to most visitors who reach that scroll depth) | Under 30% (buyers are bouncing before they reach the module) |
| `hngl_ctl_card_click` rate among sessions where module was viewed | 10%+ | Under 3% |
| Dealer CTA click rate in sessions with `hngl_ctl_card_click` | Higher than dealer CTA click rate in sessions without | No difference (module has no measurable funnel effect) |
| `hngl_ctl_hub_click` rate | Secondary metric; any engagement validates the hub link justifies its space | |

If the module-viewed rate is under 30%, the problem is page layout, not the module itself
(buyers are not reaching it). Fix the page depth, not the module copy.

If the card click rate is under 3%, the problem is relevance or CTA copy. A/B test the CTA
text first (see Copy section for alternates), then consider moving the module higher in the page.

### Instrument from day one vs layer in post-launch

Instrument from day one. The events are lightweight (no third-party scripts, no new dependencies).
Building the component without analytics and adding it later means the first 30-60 days of live
traffic produce no learnable data. Heat & Glo's rebuild is not a soft launch; it replaces a
live site. Every session from day one is signal. Do not discard it.

---

## Edge Cases

### 1. Product has zero compatible accessories

When `complete_the_look[]` is an empty array (or absent from the JSON), the module does not
render. This is already handled in the current Astro stub at line 84:
`{data.complete_the_look && data.complete_the_look.length > 0 && (...)}`.

The spec formalizes this: the guard is intentional. Do not render an empty module with a
"No accessories listed yet" placeholder. An empty state here reads as product incompleteness
and erodes buyer confidence at exactly the wrong moment (they are about to click Find a Dealer).

The data obligation falls on HHT's product team: every fireplace family in the catalog should
have `complete_the_look[]` populated before that product page goes live. This is a content
launch gate, not an engineering fallback.

### 2. Accessory slug in the array does not resolve to a collection entry

As noted in Loading State: the Astro component should throw a build-time error, not silently
omit the card. A missing accessory slug means either the accessory record has not been created
yet, or the slug was typo'd. Both of these are data errors that should be caught at build,
not discovered post-deploy by a buyer who sees a module with one card instead of three.

Implementation pattern for the Astro component:

```astro
---
const allAccessories = await getCollection('accessories-en');
const accessoryMap = Object.fromEntries(allAccessories.map(a => [a.id, a]));

const ctlAccessories = data.complete_the_look.map((slug: string) => {
  const acc = accessoryMap[slug];
  if (!acc) throw new Error(
    `[CompleteTheLook] Slug "${slug}" in ${product.id} does not match any accessories-en entry.`
  );
  return acc;
});
---
```

### 3. Accessory is flagged as unavailable or discontinued

The current `accessorySchema` in `content.config.ts` does not have an `available` or `active`
boolean field. This is a schema gap that should be resolved before the accessory records are
populated, not after.

Recommendation: add `available: z.boolean().default(true)` to `accessorySchema`. When an
accessory's `available` is `false`, two behaviors:
- The accessory still renders in the Complete the Look module but with a "Currently unavailable
  through dealers" label replacing the "Plan this piece" CTA. Do not hide the card entirely.
  A buyer who sees a product listed but unavailable learns something useful (it exists, it
  pairs, ask your dealer about timing). A buyer who sees only two cards on a three-card grid
  loses context.
- The accessory's own product page renders a similar "Currently unavailable" treatment
  instead of the dealer CTA.

This spec cannot enforce the schema change; that is a task for the engineering pass after this
spec is approved. Flag it as a pre-launch dependency.

### 4. More than 4 compatible accessories listed

The current catalog has 3 active accessory types and all fireplaces in the data show all 3.
A scenario where a fireplace has more than 4 entries in `complete_the_look[]` is unlikely
at launch but possible if hearth-stones activate and some future accessory type is added.

Rule: show a maximum of 4 cards in the module at desktop (2x2 grid), and 3 at mobile
(single column, all visible). If more than 4 slugs are in the array, show the first 4 and
append a "See all finishing pieces for the {family}" text link at the bottom that routes to
`/accessories/?compatible={family-slug}`. This requires the accessories hub to support a
`compatible` query parameter filter, which should be specced in the hub build.

For now (3 active types, all shown), the "more than 4" path is not live. Do not build the
overflow UI until it's needed. Document the rule here so future engineers don't have to
reverse-engineer the intent.

### 5. Screen reader and keyboard navigation

The module is a `<section>` with an `aria-label="Complete the Install"` attribute (matching
the visible heading exactly, so screen readers do not read it twice; use `aria-labelledby`
pointing to the heading `id` instead, with the heading getting `id="ctl-heading"`).

Each card is an `<article>` element. The "Plan this piece" button is a standard `<a>` styled
as a button (not a `<button>` element, because it navigates; use `<a role="button"` only if
there is a JavaScript behavior, not navigation). Alt text for card images is auto-generated
as described in the Desktop layout section.

The compatibility label ("Designed for linear gas fireplaces") is a `<p>` with no special
ARIA role. It is supplementary descriptive text, not interactive.

Tab order through the module: the section heading receives no tab stop. Each card's "Plan
this piece" link receives a tab stop. The "Browse all accessories" link receives a tab stop.
That is 4 tab stops maximum through the module (3 cards + 1 hub link), which is acceptable.

### 6. Print stylesheet

The module renders as a definition list in the print stylesheet. CSS:

```css
@media print {
  .ctl-module .ctl-cards {
    display: block;
  }
  .ctl-module .ctl-card {
    display: list-item;
    margin-left: 1.5em;
    page-break-inside: avoid;
  }
  .ctl-module .ctl-card img {
    display: none; /* suppress images in print */
  }
  .ctl-module .ctl-card-cta {
    display: none; /* suppress interactive CTAs in print */
  }
  .ctl-module .ctl-card::before {
    content: attr(data-accessory-title) " — compatible with this fireplace";
    font-weight: bold;
    display: block;
  }
  .ctl-hub-link {
    display: none;
  }
}
```

The printed output is a bulleted list of accessory names under a "Complete the Install"
heading. A buyer printing the product spec page (architects, specifiers, homeowners building
a binder for their contractor) gets the accessory context without broken image boxes or
dead hyperlinks.

---

## Copy

### Module heading

Current stub: "Complete the Look" (all caps).

Rejected options and reasons:
- "Complete the Look": Retail-adjacent phrasing. Implies fashion/apparel. Does not communicate
  that these are structural finish elements for a major home installation.
- "Accessories": Too generic. Any product page can say "accessories." This word does not create
  desire or frame the install holistically.
- "Finish the Room": Slightly better directional cue, still vague about what is being finished.
- "What Goes Around It": Colloquial, potentially confusing for non-native English readers. Heat
  & Glo serves an en-CA / fr-CA audience as well.

**Recommended heading: "Complete the Install"**

Rationale: "Install" is the functional frame. This buyer is planning an installation, not a
fashion choice. The word "install" activates the planning mindset: they are going to need these
pieces, they should think about them now, they should bring this to their dealer. "Complete"
positions the fireplace they have already evaluated as the anchor, and the accessories as the
natural completion. The phrase is direct, professional, and translates cleanly to French
("Completez l'installation") and Spanish ("Complete la instalacion") without losing meaning.
It also matches Heat & Glo's audience: homeowners and designers who are making a significant,
considered home improvement decision, not impulse buyers.

### Module subhead / framing copy

One line below the heading, before the cards.

**Recommended:** "Pair this fireplace with the finishing pieces that make the room complete.
Bring the list to your dealer consultation."

The second sentence does conversion work. It plants the specific behavior the buyer should
perform (bring this list to the consultation), which makes the consultation more valuable to
the dealer and more likely to result in a complete-install purchase.

### Per-card compatibility label (line 3 of each card)

Automatically generated from product data. Pattern:
"Designed for {energy} {placement} fireplaces"

For the Mezzo (gas, indoor): "Designed for gas indoor fireplaces"
For a see-through configuration: "Designed for gas see-through fireplaces"

This label should be generated at build time, not hard-coded per card. The `[family].astro`
page already has `data.energy` and `data.placement` on the product object. Pass both into the
CompleteTheLook component as props.

### Primary CTA on each card

**Rejected options:**
- "Add to my consultation": "Add to" implies a cart or a list-building tool that does not
  exist on the site. Creates an expectation of a saved list feature that would need to be
  built or the buyer would feel misled when no list appears.
- "View pairing details": Passive. "View" is the weakest verb in UX copy. It tells the buyer
  they will be looking at something, not doing something. It also implies the details are
  complex, which creates hesitation.
- "See on dealer page": Confusing. Accessories do not live on "a dealer page." They live on
  an accessory product page on heatnglo.com.
- "Learn more": The worst option. Generic beyond salvage.
- "Explore": Same problem as "learn more." Explorers do not schedule consultations.

**Recommended: "Plan this piece"**

Rationale: "Plan" is a verb that activates the buyer's decision-making mindset. They are in
planning mode on this page. "This piece" is respectful of the accessory's significance: a
wood mantel or stone surround is not a trinket, it is a design element that costs hundreds
to thousands of dollars and defines a room. "Plan this piece" tells the buyer exactly what
they are doing (planning their installation) and positions the click as a step in that plan,
not an interruption. It does not promise a cart, a save, or a discount. It promises information
and a path to the dealer.

**Alternate for A/B test at 90 days:** "See details" (minimal, if "Plan this piece" tests
below 3% CTR). This is the fallback, not the launch copy.

### Secondary CTA (module-level link to accessories hub)

**Recommended:** "Browse all accessories"

Simple. Direct. No cleverness required here. The buyer who clicks this is already engaged and
wants to see the full range. Do not over-copy this link. It should be lowercase, not all-caps.

---

## Data Dependencies and Pre-launch Gates

The following must be in place before the module can ship on any product page:

1. Accessory content records exist in `src/content/en/accessories/` for all three active
   slugs: `stone-surrounds.json`, `wood-mantels.json`, `mantel-shelves.json`. Each record
   must have at minimum: `title`, `description`, `accessory_type`, `compatible_fireplaces[]`,
   and at least one `gallery[]` image. No image = the placeholder fallback renders.
2. The `accessorySchema` in `content.config.ts` has an `available` boolean field added
   (default: true) to support the unavailable-accessory edge case.
3. Every fireplace family JSON file that ships has `complete_the_look[]` populated. Families
   without this field populated should not go live with the module placeholder showing.
4. GA4 property has the three custom events and the `fireplace_engaged_with_ctl` session-scoped
   custom dimension configured. Do not ship the module without the GA4 event schema registered,
   or the events will be counted but not queryable in Explore.
5. The dealer CTA section on the family page has its own GA4 event tag (`hngl_dealer_cta_click`
   at minimum) so the post-CTL funnel sequence can be measured.

---

## Component Location and Implementation Notes

The module should be extracted as a standalone Astro component at:
`src/components/CompleteTheLook.astro`

Props interface:

```typescript
interface Props {
  slugs: string[];           // data.complete_the_look
  fireplaceFamilyId: string; // product.id (for build-time error messages)
  familyName: string;        // data.family (for alt text, compatibility label)
  energy: string;            // data.energy
  placement: string;         // data.placement
  locale?: string;           // default 'en'
}
```

The component fetches the accessory collection and resolves slugs at build time. It is
not a client-side component (`client:load` / `client:visible` is NOT needed; this is pure
static HTML). The only client-side JavaScript is the GA4 event emission on CTA click, which
is a standard inline `onclick` attribute or a small `<script>` block scoped to the section.

The `[family].astro` renderer imports and calls the component in place of the current stub
at lines 84-96, passing the four required props from `data` and `product.id`.

---

## Open Questions for HHT Product Team (must resolve before content population)

1. **Do the three accessory types (stone-surrounds, wood-mantels, mantel-shelves) apply
   uniformly to ALL 105 fireplace families, or does HHT have a compatibility matrix that
   restricts which surrounds work with which fireplace opening sizes?** If there is a
   compatibility matrix, the `complete_the_look[]` array on each product JSON needs to be
   populated from that matrix, not as a blanket "all three for everyone." Incorrect pairings
   (e.g., a surround that does not fit a Mezzo 32 opening) erode dealer trust.

2. **Does HHT have a Bynder CDN image for each accessory type in a 4:3 crop suitable for
   the card format?** If not, the card image falls back to a category illustration. The module
   works either way, but the illustration fallback is visually weaker. Surface this to the
   HHT marketing team before launch so they can prioritize the photography.

3. **Is there a planned "My Dealer List" or consultation-builder feature anywhere in HHT's
   product roadmap?** If so, the "Add to my consultation" CTA option (rejected above for
   not existing yet) becomes the right answer and the "Plan this piece" copy should be held
   as a temp. This spec should be revisited before implementation if that feature is in-flight.

4. **Does HHT's dealer portal or CRM already capture consultation line items at the
   product-page level?** If dealers log "buyer came in with Mezzo 48 + stone surround on
   their list," that is a direct measurement signal that renders the GA4 funnel approximation
   unnecessary. Answering this question determines whether the measurement plan is the final
   answer or a stopgap until dealer-side data sharing is possible.

---

_Spec version: v1. Next revision triggered by: hearth-stones activation, or 90-day A/B test results on CTA copy._

---

## Resolutions

**2026-05-01 Cash decision on the accessory-compatibility-matrix open question:** any accessory is universal across all fireplace families and sizes. NO compatibility matrix needed. The `complete_the_look[]` flat-slug-list shape on each product JSON stands as the canonical data model. The CTL module ships in v1 as designed (no filter engine, no per-size accessory restriction, the surround-fits-all assumption is the production assumption).

This closes the load-bearing open question Ghostface flagged in the conversion theory section. Build proceeds on the simpler data model.
