# Site Management Runbook

How to do common operator tasks on Heat & Glo. This is the playbook a new operator can read end-to-end on day one and use as their working reference.

---

## Common task index

1. [Update the active promotion](#update-the-active-promotion)
2. [Add a new product family](#add-a-new-product-family)
3. [Populate dimensional + BTU specs for a product](#populate-dimensional--btu-specs-for-a-product)
4. [Verify a marketing claim](#verify-a-marketing-claim)
5. [Add or update a blog post](#add-or-update-a-blog-post)
6. [Refresh the dealer database](#refresh-the-dealer-database)
7. [Rotate an API key](#rotate-an-api-key)
8. [Switch homepage hero for a new season](#switch-homepage-hero-for-a-new-season)
9. [Add a new accessory](#add-a-new-accessory)
10. [Diagnose a CloudCannon issue](#diagnose-a-cloudcannon-issue)

---

## Update the active promotion

1. Open CloudCannon, go to Settings → site → rebate.
2. Update `amount_usd`, `amount_cad`, `expires_at`.
3. If the headline copy or CTA destination changes too, edit Pages → Home → Hero.
4. Move the previous promo's row in `promotions-calendar.md` from Active to Historical.
5. Save + publish in CloudCannon.
6. Confirm the live site reflects the change within 5 minutes (Vercel deploy time).

## Add a new product family

1. Decide the URL slug (e.g. `cosmo`, `supremex`, etc.). Should match the legacy slug if migrating from the WP site so 301 redirects align.
2. Create `src/content/en/products/<slug>.json` modeling on `mezzo.json`.
3. Fill in `family`, `energy`, `placement`, `legacy_slugs`, `sizes` array (use null for dimensional values until you have HHT spec sheets).
4. Set `draft: true` until the page is ready for production.
5. Add the new product's row to `product-database.md` under the right category section.
6. If specs are pending, add a row to `specs-pending.md`.
7. Commit + push. The dynamic route at `src/pages/fireplaces/[family].astro` picks it up automatically.

## Populate dimensional + BTU specs for a product

1. Get the official HHT spec PDF for the product family.
2. Open `src/content/en/products/<slug>.json`.
3. For each `sizes[]` entry, populate `width_in`, `height_in`, `depth_in`, `btu_max`, `spec_pdf_url` from the official sheet.
4. Host the PDF: copy to `public/specs/<slug>-<size>.pdf` and reference as `/specs/<slug>-<size>.pdf`, OR set `spec_pdf_url` to the canonical HHT-hosted link.
5. Set `draft: false` on the JSON.
6. Update the product's row in `product-database.md`: bump status to 🟢 Live, specs status to 🟢 Complete.
7. Update `specs-pending.md`: change status from 🔴 Pending to 🟢 Complete (or remove the row if all sizes are done).
8. Commit with message: `data: populate specs for [family] from HHT spec PDF`.

## Verify a marketing claim

1. Find the claim in `docs/data/marketing-claims.md`.
2. If status is ⚠️ unverified, dig until you have a primary source (HHT internal doc, third-party verification, public data).
3. Update the claim's row: paste source URL, paste verbatim quote, set status to ✅ verified OR ❌ remove (and remove from the page in the same commit).
4. If the source contradicts the claim on the page, fix the page copy first, then update the ledger.
5. Never publish a ⚠️ unverified claim. If you can't verify, remove from the page.

## Add or update a blog post

1. Open CloudCannon, go to Blog.
2. Create new post or edit existing. Fill `title`, `description`, `excerpt`, `category`, `tags`, `hero` image, body.
3. To feature on homepage: set the post's `featured: true` flag (only one featured at a time).
4. Save + publish in CloudCannon.
5. Confirm the post appears at `/blog/<slug>/` within 5 minutes.

## Refresh the dealer database

See `dealer-database.md` for full process. Summary:
1. Run the Playwright pass (script TBD): `node scripts/scrape-dealers.mjs`.
2. Review the diff between the old `src/data/dealers.json` and the new output.
3. Spot-check 3 random dealers manually against HHT's `/where-to-buy/` legacy widget.
4. If diff looks clean, commit + push. If diff looks wrong (sudden drop in dealer count, etc.), STOP and escalate.

## Rotate an API key

See `api-keys.md` for the full procedure. Summary:
1. Generate new key at the provider.
2. Update Vercel env var (Production + Preview only, Sensitive ON).
3. Trigger redeploy.
4. Verify the integration works.
5. Revoke old key.
6. Update `api-keys.md` with the new "Last rotated" date.
7. Append to `~/claude-os/security/rotation-log.md`.

## Switch homepage hero for a new season

See `seasonality-calendar.md` for the season-mode framework. Summary:
1. Open CloudCannon → Pages → Home → Hero.
2. Update headline, eyebrow, primary CTA text + URL, secondary CTA, background image (Bynder URL with `?io=transform:fill,width:1920,height:1080`).
3. Update TrustStrip if the seasonal stats change.
4. Save + publish.

## Add a new accessory

1. Create `src/content/en/accessories/<slug>.json`.
2. Fill `accessory_type` (mantel-shelf / stone-surround / wood-mantel / hearth-stone), `compatible_fireplaces[]` (slug list).
3. For each fireplace product the accessory pairs with, add this accessory's slug to that product's `complete_the_look[]` array.
4. Save + commit.

## Diagnose a CloudCannon issue

If the CC editor crashes, errors, or shows the wrong block menu:
1. Check `phase-6-gotchas.md` for the 20 known issue patterns.
2. Hard-refresh the CC iframe (cmd-shift-R).
3. If a new content block isn't appearing in "+ Add Block," check that it's listed in `cloudcannon.config.yml` under `_structures.content_blocks`.
4. If a tile preview is missing, check the collection's `preview` and `picker_preview` configs.
5. If still broken: open a thread in the agency's Discord with screenshots + the exact error text.

---

## When something is on this list but the steps don't match what you did

Update this runbook. The runbook only stays useful if it reflects what operators actually do. If you found a faster way, document it. If you hit a step that no longer works, fix it. The next operator inherits the result.

---

## When something is NOT on this list

You hit an unknown task. Three options:
1. Improvise carefully + add the task to this runbook with the steps that worked
2. Ask in Discord first, then add the task once the answer is known
3. Skip + flag — if it's not urgent, it can wait until the agency gets to it

The first option is the right move 80% of the time.
