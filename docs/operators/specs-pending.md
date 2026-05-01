# Specs Pending — Heat & Glo Product Catalog

Tracks every product family where the JSON file in `src/content/en/products/*.json` has null values for dimensional or BTU fields, because real spec sheets haven't been imported yet.

**Rule:** no fabricated values ship to production. If we don't have it from HHT's spec library, the field stays null and the page renders the "Specifications pending" inline note.

---

## Status legend

- 🟢 Complete — all dimensional + BTU values populated from verified HHT sources
- 🟡 Partial — some values populated, others still null
- 🔴 Pending — all dimensional + BTU values null, product is a scaffold only

---

## Current state (updated as products are populated)

| Family | File | Status | Sizes pending | Source needed |
|---|---|---|---|---|
| Mezzo | `src/content/en/products/mezzo.json` | 🔴 Pending | 32 / 36 / 48 / 60 / 72 | HHT Mezzo Series spec PDF |

*(Table grows as more product families are added to the catalog. Each product page starts here at 🔴 Pending and graduates to 🟢 Complete only when verified.)*

---

## How to clear a pending entry

1. Get the official HHT spec PDF for the product family (from David's contact at HHT, or from the legacy `heatnglo.com` `/manuals/` directory if that's the canonical source).
2. Open the corresponding JSON file in `src/content/en/products/<family>.json`.
3. For each `sizes[]` entry, populate `width_in`, `height_in`, `depth_in`, `btu_max`, and `spec_pdf_url` from the official spec sheet.
4. Add the source PDF to `public/specs/<family>-<size>.pdf` if hosting it ourselves, OR set `spec_pdf_url` to the HHT-hosted canonical link.
5. Set `draft: false` on the JSON file.
6. Update this ledger: change status from 🔴 Pending to 🟡 Partial (if some still missing) or 🟢 Complete (if all sizes done).
7. Commit with message format: `data: populate specs for [family] from HHT spec PDF`.

---

## Why this ledger exists

Without it, "I'll fill those values in later" becomes "I forgot which products had placeholders" becomes "we shipped a product page with null specs to production." The ledger forces a paper trail.

Lesson tied to the 2026-04-22 TVOC pitch incident where fabricated Lighthouse SEO scores shipped because no one was tracking which numbers were verified vs invented.
