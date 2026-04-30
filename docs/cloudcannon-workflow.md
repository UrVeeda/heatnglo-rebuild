# CloudCannon ↔ Agency workflow — Heat & Glo

The bidirectional editing model. Every save (yours or the agency's) commits to Git; every commit triggers a Vercel rebuild in 60–90 seconds.

## Branch model

- **`main`** — production. CloudCannon commits client edits here directly. Vercel auto-deploys.
- **AI-agent feature branches** — short-lived, named `feat/<topic>` or `fix/<topic>`. Agency builds new components, integrations, design changes here.
- All AI-agent branches reach `main` via Pull Request. PR template at `.cloudcannon/pr-templates/standard.md`.

## Conflict resolution

Content files (`src/content/`, `src/data/`) are CLIENT territory. Code files (`src/components/`, `src/layouts/`, `src/pages/`, `src/lib/`) are AGENCY territory. The two almost never overlap, so simultaneous edits rarely conflict.

When they do conflict:
- **Content file edited by both sides:** client wins. Agency rebases their branch onto the new client commit.
- **Code file edited by both sides:** agency wins. (Client shouldn't be editing code via CC's data editor — if it happens, agency reverts and asks the client what they were trying to do.)
- **Component schema change** (added/removed a prop on a block): agency must update the structure file in `.cloudcannon/structures/` AND the block defaults. Client's existing instances of that block need a migration step (handled in the same PR).

CC's Version History keeps both attempts even on a conflict — nothing gets lost.

## Sync-error recovery (3 paths)

When CC pauses sync (red dot), the editor sees three options:

| Path | When to use it |
|---|---|
| **Reset to remote** | GitHub has the right state; local has stale or corrupt data. Loses any local-only edits. |
| **Start a new branch** | Want to preserve your in-progress work for the agency to merge later. |
| **Switch to another branch** | Multiple branches active and you want to abandon this one. Rare. |

If unsure: screenshot the error and post in `#dev-requests`. Don't guess — sync errors compound when mishandled.

## Translation cascade

EN is source of truth. After every Publish, the translate-loader script (`scripts/translate-content.mjs`) runs at build time:
1. Reads every `src/content/en/**/*.json`
2. Hashes the EN body to detect actual changes
3. For each non-EN locale (es, en-ca, fr-ca), calls Anthropic with the locale-specific system prompt
4. Writes the translated JSON to `src/content/<locale>/...` matching the same path
5. Hand-edited overrides marked `_locked: true` in the destination file are preserved

The auto-generated locales appear in CC's sidebar but are read-only by default (`disable_add: true`, `_enabled_editors: [data]`). Editors override individual translated strings only via the `_locked: true` flag inside the JSON entry.

## Post-launch operating model

**Every push to `main` could break the editor.** That's a real constraint, not paranoia. Agency-side pre-flight before every push:

```bash
npm run build       # must pass
npm run check       # must return 0 errors
grep -r 'data-editable' src/components/blocks/  # editable regions intact on every block
```

If any block was added or modified, also verify:
- `src/cloudcannon/componentMap.ts` has the new block's `_type` → component binding
- `.cloudcannon/structures/content-blocks.cloudcannon.structures.yml` has a Structure value for the new block with full field-completeness
- The block component implements the Block Delivery Standard variant props (bg_variant / alignment / density / hidden_on_mobile / cta_*_variant)

Agency-side announcement protocol:
- Major change (new block type, integration add, design shift) → post a heads-up in `#site-updates` 24 hours before merging to `main`
- Bug fix / typo fix / non-visible internal change → can ship without notice but must tag the commit message clearly
- Breaking schema change (removing a block, renaming a prop): never ship without explicit client approval + a migration plan for existing instances

## Phase 6 → Phase 7 → Phase 8 → Phase 9 sequencing

| Phase | What's done | What's next |
|---|---|---|
| 1 | Intake/audit/handoff docs | — |
| 2 | Astro 5 scaffold | — |
| 3 | Layout + global components | — |
| 4 | 9 block components decomposed | — |
| 5 | Content extracted to collections + translate-loader scaffolded | — |
| **6** | **CloudCannon config wired** | **Phase 7 (lead capture) → Phase 8 (sitemap rebuild) → Phase 9 (launch QA)** |
| 7 | Pending — needs kickoff-call answers (CRM destination, Discord webhook URL) | — |
| 8 | Pending — needs sitemap crawl execution (243 URLs → Cloudinary → CloudCannon entries) | — |
| 9 | Pending — DNS cutover + handoff call | — |

Phase 6 is the client-handoff GATE per the agency template. Until Phase 6 is committed AND CloudCannon's Visual Editor renders the homepage end-to-end without errors, Phase 7's API endpoint and Phase 8's per-URL templates are blocked.
