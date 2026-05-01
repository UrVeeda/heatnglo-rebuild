# Product Database

Index of every product family in `src/content/en/products/*.json` with status, specs status, gallery status, last updated. Source-of-truth dashboard for "where are we with the catalog."

---

## Status legend

- **Page status:** 🟢 Live (draft: false, ready for production) / 🟡 Staging (draft: true, on staging only) / 🔴 Stub (file exists, mostly empty)
- **Specs status:** 🟢 Complete / 🟡 Partial / 🔴 Pending — see `specs-pending.md` for detail
- **Gallery status:** 🟢 Full (4+ Bynder images mapped) / 🟡 Partial / 🔴 Empty
- **Cross-refs:** 🟢 Wired / 🟡 Partial / 🔴 None — refers to `complete_the_look[]` and `compatible_fireplaces[]` populated

---

## Current catalog (105 products planned)

### Gas — Indoor

| Family | Page | Specs | Gallery | Cross-refs | Last updated |
|---|---|---|---|---|---|
| Mezzo | 🟡 Staging | 🔴 Pending | 🔴 Empty | 🟡 Partial (3 accessory slugs wired) | 2026-05-01 |
| Cosmo | 🔴 Stub (not yet created) | — | — | — | — |
| 6K/8K Modern | 🔴 Stub | — | — | — | — |
| 6K/8K Series | 🔴 Stub | — | — | — | — |
| Cerona | 🔴 Stub | — | — | — | — |
| Phoenix TrueView | 🔴 Stub | — | — | — | — |
| Primo II | 🔴 Stub | — | — | — | — |
| SlimLine Series | 🔴 Stub | — | — | — | — |
| SlimLine Fusion | 🔴 Stub | — | — | — | — |
| True | 🔴 Stub | — | — | — | — |

### Gas — Inserts

| Family | Page | Specs | Gallery | Cross-refs | Last updated |
|---|---|---|---|---|---|
| Cosmo Insert | 🔴 Stub | — | — | — | — |
| Escape | 🔴 Stub | — | — | — | — |
| Provident | 🔴 Stub | — | — | — | — |
| Supreme | 🔴 Stub | — | — | — | — |
| SupremeX | 🔴 Stub | — | — | — | — |

### Gas — See-Through

| Family | Page | Specs | Gallery | Cross-refs | Last updated |
|---|---|---|---|---|---|
| Corner | 🔴 Stub | — | — | — | — |
| Escape See-Through | 🔴 Stub | — | — | — | — |
| Fortress | 🔴 Stub | — | — | — | — |
| Mezzo See-Through | 🔴 Stub | — | — | — | — |
| Pier | 🔴 Stub | — | — | — | — |
| Primo II See-Through | 🔴 Stub | — | — | — | — |
| ST 36 | 🔴 Stub | — | — | — | — |
| Twilight | 🔴 Stub | — | — | — | — |
| Twilight Modern | 🔴 Stub | — | — | — | — |

### Gas — Outdoor

| Family | Page | Specs | Gallery | Cross-refs | Last updated |
|---|---|---|---|---|---|
| Courtyard | 🔴 Stub | — | — | — | — |
| Lanai | 🔴 Stub | — | — | — | — |
| Lanai See-Through | 🔴 Stub | — | — | — | — |
| Vesper Vent-Free | 🔴 Stub | — | — | — | — |

### Gas — Freestanding

| Family | Page | Specs | Gallery | Cross-refs | Last updated |
|---|---|---|---|---|---|
| Supreme FS | 🔴 Stub | — | — | — | — |

### Gas — Log Sets (top-level `/log-sets/` per IA decision)

17 products across indoor + outdoor. All currently stubs. Tracked separately because they live at top-level `/log-sets/` not under `/fireplaces/gas/`.

| Family | Page | Specs | Gallery | Cross-refs | Last updated |
|---|---|---|---|---|---|
| Duzy 2 / 3 / 5 | 🔴 Stub | — | — | — | — |
| Contemporary | 🔴 Stub | — | — | — | — |
| Heritage Oak | 🔴 Stub | — | — | — | — |
| Grand Birch | 🔴 Stub | — | — | — | — |
| Grand Oak | 🔴 Stub | — | — | — | — |
| Kindled Stack | 🔴 Stub | — | — | — | — |
| Smoldering Timberland Oak | 🔴 Stub | — | — | — | — |
| Timberland Oak Vented | 🔴 Stub | — | — | — | — |
| Woodland Birch | 🔴 Stub | — | — | — | — |
| Fireside Supreme Oak See-Through | 🔴 Stub | — | — | — | — |
| Outdoor Grand Birch | 🔴 Stub | — | — | — | — |
| Outdoor Grand Oak | 🔴 Stub | — | — | — | — |
| Outdoor Heritage Oak | 🔴 Stub | — | — | — | — |
| Outdoor Kindled Stack | 🔴 Stub | — | — | — | — |
| Outdoor Smoldering Timberland Oak | 🔴 Stub | — | — | — | — |
| Outdoor Timberland Oak Vented | 🔴 Stub | — | — | — | — |
| Outdoor Woodland Birch | 🔴 Stub | — | — | — | — |

### Wood — Indoor + Outdoor (9 products)

Exclaim, NorthStar, Pioneer II, Pioneer III, Royal Hearth, Rutherford (indoor) + Castlewood, Cottagewood, Villawood (outdoor). All stubs.

### Electric (10 products)

Built-In Electric, Inception, Scion, Triton (built-in) + Allusion Edge / Platinum / Slim, Format (wall-mount) + Electric Insert + Forum Outdoor. All stubs.

### Global — AU/NZ (7 products)

3X-AU, 5X-AU, 6KX-AU, AU Series Insert, Mezzo Series, Mezzo Series See-Through, SLR-X AU. All stubs. These get the AU/NZ hreflang treatment per the locked IA decision.

### Mantels & Surrounds (4 products → moved to /accessories/)

Mantel Shelves, Stone Sets, Wood Mantels & Surrounds. Lives in `src/content/en/accessories/` not `products/`.

---

## How to update this ledger

When a product page is created or updated, update its row here:
- Bump "Last updated" to today's date
- Update Page / Specs / Gallery / Cross-refs status indicators
- If a brand-new product is added, add a new row in the right category section

This is the operator's "where are we" view at a glance. If the homepage's BrowseLineup card says "Mezzo" but Mezzo's row is still 🔴 Stub here, that's drift to fix.
