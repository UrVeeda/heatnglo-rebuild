# Dealer Locator Widget — Design Spec v1

**Date:** 2026-04-30
**Author:** Ghostface Killah (Tony Starks) for Heat & Glo rebuild
**Status:** Ready for engineering handoff, pending HHT dealer data API confirmation
**Scope:** The dealer locator widget, rendered on `/where-to-buy/`, embedded in the homepage hero, embedded on product pages, and embedded in the global sticky CTA.

---

## Context and Conversion Theory

Heat & Glo does not sell direct. There is no add-to-cart. There is no checkout. Every meaningful buyer action on this site terminates at a dealer. That makes the dealer locator not a utility widget — it is the conversion endpoint for the entire site.

A buyer lands on the homepage and sees a striking fireplace. They read about the Mezzo family. They look at sizes. They compare gas vs electric. All of that work is pre-work. It builds desire and commitment. But the only place that desire becomes a business outcome is the moment a dealer's phone number, address, and hours appear on their screen.

The widget's job is not to be functional. It is to be frictionless. A buyer who types their ZIP and sees five dealer cards in two seconds has experienced a quality brand signal before they've spoken a word to any human. A buyer who types their ZIP and waits, or sees a broken map, or gets zero results with no explanation, has experienced a brand failure at the most critical moment in the entire funnel.

There is a secondary conversion function the widget performs: contact capture. The "Schedule a Consultation with This Dealer" CTA within each dealer card gives Heat & Glo an email and phone number on a lead who has already selected a dealer. That lead is warmer than almost anything else the site generates. This is not a throwaway form. It is the closest thing Heat & Glo has to a trackable, attributable, first-party conversion event.

The load-bearing assumption driving every design decision in this spec: the buyer who completes a ZIP search and clicks into a dealer card is measurably more likely to convert than a buyer who visits the site without using the locator. Instrument from day one to confirm or disprove this.

---

## UX Pattern

### Placement context: four surfaces

The widget renders in four distinct contexts. The UX pattern is consistent across all four, but layout constraints differ per surface.

**1. `/where-to-buy/` standalone page (primary surface)**
Full-width layout. Map gets 60% of horizontal space at desktop. List panel gets 40%. Search bar at the top. This is the most spacious treatment. No surrounding content competes for attention.

**2. Homepage hero embed**
Compressed to a single search bar row. ZIP input + "Find Dealers" button, horizontally arranged. No map, no list — those appear inline below the hero fold or navigate to `/where-to-buy/?zip=[zip]` with the results pre-populated. This embed should feel native to the hero, not like a widget dropped in from another page.

**3. Product page embed (in the Dealer CTA section)**
Same compressed single-row treatment as homepage. Sits in the lower portion of the product page, below the Complete the Look module, above the footer. Compact, functional, not a visual destination.

**4. Global sticky CTA bar**
The most compressed treatment. A single input field + button on the left of the sticky bar. No map, no list. Tap/click navigates to `/where-to-buy/?zip=[zip]`. Used at mobile most frequently.

The spec below is written primarily for the `/where-to-buy/` standalone page. Where behavior differs on other surfaces, it is called out.

### Desktop layout (viewport >= 1024px): `/where-to-buy/`

```
+----------------------------------------------------------------------+
| FIND A HEAT & GLO DEALER                                             |
| ZIP code or city, state                         [Find Dealers]       |
| __ Use my location                                                   |
+-------------------------------+--------------------------------------+
|                               |                                      |
|   [DEALER LIST PANEL]         |   [MAP VIEW]                        |
|                               |   (Mapbox GL or Google Maps embed)  |
|   Smith's Hearth & Patio      |                                      |
|   Platinum Dealer             |   [map pins, clustered]             |
|   2.3 mi · Charlotte, NC      |                                      |
|   (704) 555-0122              |   Pins are Heat & Glo orange.       |
|   Mon-Sat 9am-6pm             |   Selected dealer pin is            |
|   4.8★ (127 reviews)          |   highlighted (larger, accent).     |
|   [Schedule Consultation]     |                                      |
|   -------------------------   |                                      |
|   Blue Flame Fireplace        |                                      |
|   Gold Dealer                 |                                      |
|   4.1 mi · Concord, NC        |                                      |
|   (704) 555-0188              |                                      |
|   Mon-Fri 9am-5pm             |                                      |
|   4.6★ (89 reviews)           |                                      |
|   [Schedule Consultation]     |                                      |
|   -------------------------   |                                      |
|   [Show more results]         |                                      |
+-------------------------------+--------------------------------------+
| [List view] [Map view]  toggle (mobile only — desktop shows both)   |
+----------------------------------------------------------------------+
```

The list panel is scrollable independently of the map. Map stays fixed while the buyer scrolls the list. When a buyer hovers or focuses a dealer card in the list, the corresponding map pin highlights. When a buyer clicks a map pin, the list panel scrolls to that dealer card and it receives a visual focus state (left border accent in brand orange, subtle background fill).

Default: show the 5 nearest dealers. Each dealer card in the list uses a numeric position indicator (1, 2, 3 ...) that matches the number on the map pin, so list and map are spatially correlated without hovering.

**List panel: what each dealer card shows**

All data sources from `src/data/dealers.json` (see `docs/operators/dealer-database.md` schema):

1. Dealer name. 16px semibold.
2. Tier badge. "Platinum Dealer," "Gold Dealer," "Authorized Dealer." Small pill badge, brand-tinted. Platinum is highest. (See Edge Cases: tier badge visibility for the public-facing question.)
3. Distance. "2.3 mi" (US) or "3.7 km" (CA). Calculated from the searched centroid to `lat`/`lng` in the dealer record. Displayed in miles for US ZIP searches, kilometers for CA postal searches.
4. Location line. City, State/Province. Not the full street address on the card by default. Full address available in the expanded state (see below).
5. Phone number. Tap-to-call on mobile (`<a href="tel:...">`). Formatted per country: US as (XXX) XXX-XXXX, CA as (XXX) XXX-XXXX.
6. Hours today. Not all hours. Today's hours. "Mon 9am-6pm" when today is Monday. "Closed today" when the dealer is closed. "Hours unavailable" when the record has no hours data. This field matters most to the buyer who is about to leave the house.
7. Rating. "4.8 (127 reviews)" with a static star graphic. Star count as a visual glyph, not raw number. Sourced from Google Places data in the dealer record. If `rating` is null (not enriched yet), this row does not render. Do not show empty stars or a zero-rating.
8. Schedule Consultation CTA. Primary button. See "Consultation CTA Flow" section below.

**Expandable state (secondary disclosure)**

Clicking anywhere on the dealer card except the Schedule Consultation button expands the card to reveal:
- Full street address
- Full weekly hours table (Mon-Sun)
- A "Get Directions" link (opens Google Maps directions from browser geolocation or the searched centroid)
- A "View on Map" link (mobile: pan map to this dealer; desktop: highlight and zoom pin)

The expansion is an accordion-style in-place reveal. The card does not navigate away. This keeps the buyer in the list context while they inspect details.

### Mobile layout (viewport < 768px): `/where-to-buy/`

At mobile, map and list cannot co-exist. Default view is the list view. A sticky toggle bar at the bottom of the screen switches between List and Map.

```
+----------------------------------+
| Find a Dealer                    |
| +----------------------------+   |
| | ZIP or city, state      [>]|   |
| +----------------------------+   |
| __ Use my location               |
+----------------------------------+
| 1  Smith's Hearth & Patio        |
|    Platinum Dealer  |  2.3 mi    |
|    Charlotte, NC                 |
|    (704) 555-0122                |
|    Mon 9am-6pm                   |
|    4.8★ (127)                    |
|    [Schedule Consultation]       |
+----------------------------------+
| 2  Blue Flame Fireplace          |
|    Gold Dealer  |  4.1 mi        |
|    Concord, NC                   |
|    (704) 555-0188                |
|    Mon 9am-5pm                   |
|    4.6★ (89)                     |
|    [Schedule Consultation]       |
+----------------------------------+
| [Show more results]              |
+----------------------------------+
[ LIST VIEW ]    [ MAP VIEW ]   <-- sticky bottom toggle bar
```

The Schedule Consultation button on each mobile card is full-width, minimum 44px touch height. The phone number is a tap-to-call link. Distance is displayed inline with the tier badge on one line to conserve vertical space.

Map view at mobile is full-screen. The bottom sheet slides up from the bottom to show the selected dealer's card when a pin is tapped. The bottom sheet is 40% of screen height maximum. A grab handle at the top lets the buyer expand to full-list mode.

### Search mechanics

**Input: ZIP code (US) and postal code (CA)**

- US input: accepts 5-digit numeric ZIP. Input type `text`, not `number`, because leading zeros (e.g., 02109 Boston) get stripped by number inputs. Pattern validation: `^\d{5}$` for US detection.
- CA input: accepts FSA format (A1A) or FSA+LDU format (A1A 1A1). Pattern: `^[A-Za-z]\d[A-Za-z](\s?\d[A-Za-z]\d)?$`. Detection: first character is alpha.
- City, state text input: secondary option. Geocodes to a centroid via the Maps API, then runs the same radius search.
- "Use my location" geolocation: calls `navigator.geolocation.getCurrentPosition()`, uses returned `lat`/`lng` as the search centroid.

**Branched routing by geography**

US ZIP searches route to US dealer records (`country: "US"` in the dealer dataset).
CA postal searches route to CA dealer records (`country: "CA"`).
AU/NZ product pages route to an AU/NZ dealer endpoint (`?region=au-nz`). Per the locked IA decision, AU/NZ content lives off the US site. On any `/au/` or `/nz/` prefixed page, the dealer widget appends `region=au-nz` to its API query and the endpoint resolves AU/NZ dealer records. This is the only branching. There is no AU/NZ-specific widget UI; it is the same widget, different data source.

**Results radius**

Default radius: 50 miles (US), 80 km (CA). If fewer than 3 results within the default radius, auto-expand to 100 miles / 160 km and show a notice: "Expanded search area. Showing dealers within 100 miles."

If zero results after expansion, show the no-match state (see Edge Cases).

**Result count**

Show 5 results by default. "Show more results" lazy-appends 5 more. Cap at 25 total. Beyond 25 dealers the buyer has enough to choose from; showing more creates decision paralysis and increases page weight.

### Consultation CTA flow: email and phone capture

This is the highest-value interaction on the entire `/where-to-buy/` page.

The Schedule Consultation button does NOT navigate to the dealer's own website. It opens a modal (or a slide-in panel on mobile) with a short form:

```
Talk to [Smith's Hearth & Patio]
+-------------------------------------------------+
| Your name               [__________________]   |
| Your email              [__________________]   |
| Your phone              [__________________]   |
| What are you interested in?                     |
| ( ) Gas fireplace    ( ) Electric fireplace     |
| ( ) Wood fireplace   ( ) Gas insert (retrofit)  |
| ( ) Log sets         ( ) Accessories/surrounds  |
| Best time to reach you                          |
| [Dropdown: Morning / Afternoon / Evening]       |
|                                                 |
| [Send to Smith's Hearth & Patio]               |
| Privacy: your info goes to this dealer only.   |
+-------------------------------------------------+
```

On submit, the form data is:
1. Emailed to the dealer's contact email (known from the dealer record, or passed to HHT's dealer-management API if one exists).
2. Stored as a lead record server-side (Supabase `leads` table or HHT's system, whichever is confirmed).
3. The buyer receives a confirmation email: "Your request has been sent to Smith's Hearth & Patio. They'll reach out within 1 business day."
4. A GA4 event fires: `hngl_consultation_request` (see Measurement section).

The form has three required fields: name, email, phone. The interest checkboxes and time preference are optional but the data is valuable for dealer context. If all three required fields are filled, the submit button activates.

**What the form does NOT do:** it does not auto-route to the dealer's scheduler. This is intentional. Most Heat & Glo dealers do not have a public calendar integration. The form creates a warm handoff. The dealer calls back. This mirrors how dealer showrooms actually operate.

---

## Conversion Theory and Measurement Plan

### The attribution problem (honest accounting)

The locator widget's terminal conversion event happens off-site: the buyer walks into the showroom, or calls the dealer, or the dealer calls back after the form submit. None of these events are trackable with standard web analytics.

What IS trackable is the funnel from site session to form submission. Form submission is the last trackable event Heat & Glo controls. Use it as the proxy for conversion quality.

### What IS measurable (instrument from day one)

All GA4 events below use the `hngl_` prefix for namespace clarity.

**1. Widget opened (search initiated)**
Fires when the user focuses the ZIP/postal input on any surface.

```
gtag('event', 'hngl_dealer_search_start', {
  surface: 'where-to-buy',      // 'hero', 'product-page', 'sticky-cta'
  page_locale: 'en-us'
});
```

**2. Search results returned**
Fires when results render successfully after a search submission.

```
gtag('event', 'hngl_dealer_search_success', {
  surface: 'where-to-buy',
  result_count: 5,              // number of results shown
  search_input_type: 'zip',     // 'zip', 'postal', 'city-state', 'geolocation'
  region: 'us',                 // 'us', 'ca', 'au-nz'
  page_locale: 'en-us'
});
```

**3. Zero results (no-match state)**

```
gtag('event', 'hngl_dealer_search_no_results', {
  surface: 'where-to-buy',
  search_input_type: 'zip',
  region: 'us',
  page_locale: 'en-us'
  // Do NOT log the actual ZIP/postal code — PII concern
});
```

**4. Dealer card expanded**

```
gtag('event', 'hngl_dealer_card_expand', {
  dealer_tier: 'platinum',      // tier of the expanded card
  card_position: 1,             // 1-indexed in results
  surface: 'where-to-buy',
  page_locale: 'en-us'
});
```

**5. Schedule Consultation CTA clicked (modal opened)**

```
gtag('event', 'hngl_consultation_cta_click', {
  dealer_tier: 'platinum',
  card_position: 1,
  surface: 'where-to-buy',
  page_locale: 'en-us'
});
```

**6. Consultation form submitted**
This is the site's primary macro-conversion event. It should be marked as a conversion in GA4.

```
gtag('event', 'hngl_consultation_request', {
  dealer_tier: 'platinum',
  interest: ['gas-fireplace'],   // array of checked interest values
  surface: 'where-to-buy',
  page_locale: 'en-us'
  // Do NOT log name, email, phone — PII
});
```

**7. Phone number tap (mobile)**

```
gtag('event', 'hngl_dealer_phone_tap', {
  dealer_tier: 'platinum',
  card_position: 1,
  page_locale: 'en-us'
});
```

**8. GA4 custom dimension: `engaged_with_dealer_locator`**
Session-scoped boolean. Set to `true` on `hngl_dealer_search_success`. Used for audience segmentation: buyers who searched for a dealer but did not submit a consultation request are re-engagement candidates.

### Success vs failure thresholds (90-day post-launch review targets)

| Metric | Success | Failure threshold | Action if failure |
|--------|---------|-------------------|-------------------|
| Search completion rate among sessions that opened the widget | 80%+ | Under 50% | Widget UX friction — test geo-default, simplify input |
| Results return rate (searches that return 1+ dealers) | 95%+ | Under 85% | Data coverage gap — run Playwright re-pull, expand default radius |
| Dealer card expand rate among sessions with search results | 30%+ | Under 10% | Copy/card design not communicating value — A/B test card layout |
| Consultation CTA click rate among card-expand sessions | 20%+ | Under 5% | Form CTA copy or placement — A/B test button text |
| Consultation form submit rate among CTA-click sessions | 70%+ | Under 40% | Form fields too many or wrong sequence — shorten or reorder |
| `hngl_consultation_request` rate per 1,000 site sessions | 15+ | Under 5 | Locator not visible enough in the funnel — promote embed placements |

### What is NOT measurable (be honest with HHT)

- Whether the buyer actually visited the dealer after submitting the form.
- Whether the dealer followed up with the buyer within the stated 1 business day.
- Whether the consultation resulted in a purchase.
- The ticket size or product mix of any resulting sale.

All of this becomes measurable if HHT shares dealer-CRM data (whether consultations were logged, whether they converted, what product lines). If HHT has a dealer portal with consultation tracking, the integration is worth prioritizing. Without it, the consultation request form is the measurement ceiling.

---

## Edge Cases

### 1. Zero results after radius expansion

When no dealers exist within 100 miles / 160 km:

```
+------------------------------------------+
| No dealers found near [ZIP code].        |
|                                          |
| You can reach our customer team at       |
| (888) 427-3973, available Mon-Fri        |
| 8am-5pm CT. They'll connect you with     |
| the nearest authorized dealer.           |
|                                          |
| Or try a nearby city or ZIP code:        |
| [input field with retry affordance]      |
+------------------------------------------+
```

Do not show an empty list with a generic "No results" label. The buyer has expressed high intent (they searched). The no-match state should give them an immediate fallback path (phone number) and a search retry that stays in place. Do not navigate them away.

The phone number (888) 427-3973 is the HHT customer line referenced in the dealer-database.md stub. Confirm this is the correct public-facing number before launch.

### 2. Geolocation permission denied

When `navigator.geolocation` is blocked or the browser returns an error:

The "Use my location" link silently becomes non-functional. Do not throw an error message to the buyer. Do not show a browser-permission dialog again. Show a subtle inline note: "Location access unavailable. Enter a ZIP code or city above." This keeps the buyer in the flow without confronting them with a technical error they did not cause.

### 3. Single dealer in results

When only one dealer is returned, the list shows one card. The map shows one pin, centered and slightly zoomed out to show city context. Do not show "Showing 1 result" as a failure state — it is a correct result. The card at single-result state should receive a slightly elevated visual treatment (no position number badge needed; it is the only card) and the Schedule Consultation button is extra prominent because there is no decision to make.

### 4. Dealer record with incomplete data

Data completeness varies. Some records may lack `rating`, `hours`, or phone. Rules:

- No `rating`: omit the rating row entirely. No empty stars.
- No `hours`: show "Call for hours" with the phone number.
- No `phone`: show "Visit to schedule" with the dealer address only. The Schedule Consultation form still works; it is not dependent on having the dealer's direct phone.
- No `lat`/`lng`: this dealer cannot appear in search results (distance calculation is impossible). Log a build-time warning to the console. These records are invisible to buyers until enriched. This is a data integrity issue, not a UI problem to paper over.

### 5. CA postal code treated as US ZIP

A Canadian postal code starting with a letter (e.g., "M5G") will not pass US ZIP validation. The detection logic checks the first character: if alpha, treat as CA postal. If the buyer types only the FSA (3 characters), accept it and geocode to the FSA centroid (less precise than a full postal code, but usable).

UK postcodes and AU postcodes also start with letters. The widget does not serve UK or AU buyers on the US site. If an AU/NZ visitor arrives at `/where-to-buy/` on the US site, the form still runs but will return zero results (no AU dealers in the US dataset). The no-match state should show a note: "Looking for an Australian or New Zealand dealer? Visit [au.heatnglo.com]" — this handles the stray AU/NZ visitor gracefully.

### 6. Map provider failure

If the map tile provider is unavailable (network error, API limit hit), the list panel continues to function independently. The map container shows a neutral gray fill with "Map temporarily unavailable. Use the list below." The buyer can still find a dealer and submit a consultation request without the map.

This is not a hypothetical edge case. Maps embeds fail at scale when API quotas are misconfigured. The widget should be designed so the list panel is the primary UI and the map is an enhancement, not a dependency.

### 7. Dealer locator in the global sticky CTA (scroll behavior)

The sticky CTA bar appears after the buyer scrolls 300px from the top of any page. On pages that already have a full dealer locator (i.e., `/where-to-buy/` itself), the sticky CTA should suppress on that page. It would be redundant and distracting to show a dealer locator input bar on a page that is entirely a dealer locator.

Implementation: on the `/where-to-buy/` page, add a data attribute or class that suppresses the sticky CTA rendering. Confirm this behavior with the engineering team — it requires the sticky CTA component to be context-aware.

### 8. Accessibility

The search input has a visible `<label>` element, not placeholder-as-label. Placeholder text disappears on focus; a buyer using a screen reader or an older browser should not lose the label context while typing.

The map component uses the Maps API's built-in keyboard navigation for pins. Each dealer card in the list is a focusable element. Tab order: search input, geolocation button, dealer card 1 (expand), dealer card 1 Schedule Consultation, dealer card 2 (expand), dealer card 2 Schedule Consultation, etc. The map is skipped in tab order for list-first accessibility (add `tabindex="-1"` to the map container; keyboard users navigate via the list).

The consultation modal traps focus within the modal on open. Escape key closes the modal. Focus returns to the Schedule Consultation button that opened it. Standard modal accessibility patterns per ARIA authoring practices.

### 9. Print

At print, the map does not render. The list of dealers renders as a definition list: dealer name, address, phone, hours. The Schedule Consultation button is suppressed in print (it's interactive). The "Get Directions" link renders as a text URL (not a bare hyperlink, but the full Google Maps URL formatted for reading). A buyer printing the page is likely printing a shortlist of dealers to bring to a conversation. Give them actionable information.

```css
@media print {
  .dealer-map { display: none; }
  .dealer-consultation-btn { display: none; }
  .dealer-list { display: block; }
  .dealer-card { page-break-inside: avoid; margin-bottom: 1.5em; }
}
```

---

## Copy Patterns

### Page heading (`/where-to-buy/`)

**Recommended:** "Find a Heat & Glo Dealer"

Rationale: functionally direct. The buyer arrived here to find a dealer. Confirm that is exactly what this page does. No artful phrasing. No "Discover Your Nearest Showroom." The buyer is task-oriented at this point in the funnel; their patience for brand voice copywriting is near zero. Get them to the input field.

**Subhead (optional, below the heading):** "1,400+ authorized dealers across the US and Canada. Enter your ZIP code to find the nearest showroom."

The subhead does two things: communicates network breadth (builds confidence that a result will be found) and sets the exact action (enter ZIP code, not "search" or "look up" or "find").

### Input label

"ZIP code or city, state" (US default)
"Postal code or city, province" (CA, detected by browser locale or explicit CA flag)
Do not combine them into one placeholder. Keep the label as a proper `<label>` element, not placeholder text.

### "Use my location" link text

"Use my location" — straightforward. No emoji. No icon-only treatment without text (the icon alone is not universally understood, especially by older demographics who are a significant segment of Heat & Glo's homeowner audience).

### Search button

"Find Dealers" — not "Search," not "Go," not an arrow-only icon. "Find Dealers" restates the action and the result in two words. Arrow-only icons are acceptable on the compressed homepage hero embed where space is constrained, but on the full `/where-to-buy/` page use the text.

### No-match state headline

"No dealers found near you." — direct. Not "Oops" or "Hmm" or any apologetic softening. The buyer needs information, not personality. Follow immediately with the fallback (phone number + retry input).

### Schedule Consultation button text

"Schedule Consultation" — not "Contact Dealer," not "Get a Quote," not "Request Info." Consultation is the specific offer. It implies a scheduled event, a professional interaction, expertise. It positions the buyer's next step as a peer-level conversation, not a sales pitch they are walking into.

### Consultation modal headline

"Talk to [Dealer Name]" — personalized to the specific dealer they selected. Not a generic "Schedule a Consultation." The buyer chose this dealer from a list. Acknowledging their choice by naming the dealer reinforces that the form is a direct channel to that specific business.

### Tier badges

"Platinum Dealer" / "Gold Dealer" / "Authorized Dealer" — straightforward designation language. If HHT decides tier is not public-facing (open question in dealer-database.md), remove these entirely. Do not replace them with invented tier language. If tiers are suppressed, show nothing in that badge slot rather than a placeholder.

### Confirmation email subject line (to buyer)

"Your consultation request has been sent to [Dealer Name]"

### Confirmation email body (to buyer, short)

"[Dealer Name] will reach out within 1 business day. In the meantime, you can call them directly at [phone]."

---

## Architecture and Data Dependencies

### Client-side rendering requirement

The dealer locator is one of the few genuinely client-side components in this Astro build. The search, the map, and the results are all dynamic (buyer enters a ZIP, widget queries the dealer dataset, renders results). This requires a `client:load` island in Astro.

The search logic queries `src/data/dealers.json` client-side (the full dataset is loaded to the client, filtered in-browser by radius calculation). At 1,400 dealers with ~10 fields each, the dataset is approximately 200-400KB uncompressed, 40-80KB gzipped. This is acceptable. No server API route is needed for search if the dataset is static. If the dataset grows past 5,000 records, revisit with a server-side search endpoint.

### Map provider decision (open for HHT to confirm)

Two options, both viable:

- **Mapbox GL JS**: clean API, strong Tailwind/component compatibility, requires a Mapbox token. Generous free tier.
- **Google Maps JavaScript API**: broader familiarity, required if Google Places is also used for ratings enrichment (same API key, same billing relationship). Preferred if the dealer-enrichment pipeline already uses Places.

The spec is written provider-agnostic. The branched routing logic, the pin behavior, and the bottom-sheet mobile pattern work on either. Confirm with the engineering team which provider the enrichment pipeline (dealer-database.md) uses, and match the map provider to avoid two separate API relationships.

### Consultation form data routing

Three viable architectures:

1. **Supabase `leads` table + Brevo transactional email**: buyer form submits to a Supabase insert, a Supabase Edge Function triggers a Brevo transactional email to the dealer and a confirmation to the buyer. This is the preferred path given existing Supabase + Brevo infrastructure.
2. **HHT dealer-management API direct integration**: if HHT confirms a dealer portal API, form submissions route there instead of Supabase. Supabase still stores a local copy as a safety record.
3. **Simple email-to-dealer only (no server storage)**: acceptable for MVP. Form submits to a Vercel serverless function that sends a Brevo email to the dealer. No database. No lead archive. Lowest engineering lift but no analytics on lead volume over time.

Recommended for launch: option 1. The Supabase + Brevo infrastructure already exists. A `leads` table with `dealer_id`, `buyer_name`, `buyer_email`, `buyer_phone`, `interest[]`, `preferred_time`, `submitted_at`, `surface` captures everything needed for future analysis.

### Pre-launch dependencies

1. `src/data/dealers.json` must be populated (Playwright pass + Places enrichment complete) before the widget ships. Shipping a dealer locator with no dealers is not acceptable. The stub state (phone number fallback) is the holding pattern until data is ready.
2. Map API provider confirmed and token in environment variables.
3. Supabase `leads` table created with the schema above (or HHT API integration confirmed).
4. Brevo transactional email templates for buyer confirmation and dealer notification created and tested.
5. GA4 custom events schema (`hngl_consultation_request` marked as a conversion, `engaged_with_dealer_locator` custom dimension registered) configured before launch — not after.
6. The "tier is public-facing" open question resolved with HHT (affects card design and badge copy).

---

## Open Questions for HHT (must resolve before launch)

1. **Is the dealer tier (Platinum / Gold / Authorized) displayed publicly in the consumer locator?** If it is public, the spec as written is correct. If tier is internal-only, remove the badge slot entirely and recalculate card height.
2. **Does HHT have a dealer-management API?** If yes, form submissions should route there rather than (or in addition to) Supabase. If no, Supabase is the canonical data store.
3. **What is the public-facing HHT customer phone number for the no-match fallback?** The dealer-database.md stub uses (888) 427-3973. Confirm this is current and staffed for dealer inquiries.
4. **Does HHT want a "1 business day" response commitment in the confirmation email, or should that language be softer?** This is a service-level promise. If dealers do not reliably follow up within 1 business day, the promise erodes trust. Confirm the SLA is real before publishing it.
5. **Are there dealers who opt out of the public locator (exclude flag)?** The dealer-database.md flags this as an open question. The exclusion flag must be part of the dataset schema before the Playwright pass runs.

---

_Spec version: v1. Next revision triggered by: dealer dataset completion, map provider decision, or 90-day post-launch measurement review._
