# Heat & Glo — Operator Docs

The site has two layers of state that need maintaining over time. This directory tracks both, in one place, so nothing falls off.

---

## Layer 1: Content (managed in CloudCannon)

Everything in `src/content/` is editable by HHT operators directly through CloudCannon's visual editor. This is the dashboard for content. No code review required.

What lives here:
- Page content (homepage, about, fireplace category landings)
- Product family pages with size variants
- Accessory pages
- Blog posts
- FAQ answers
- Site settings (company info, current promotions, social links)
- Testimonials (when populated)

How operators use it:
- Log into the CloudCannon project
- Navigate the sidebar (organized by collection: Pages, Products, Accessories, Blog, FAQ, Settings)
- Edit, preview, save, schedule, publish
- All changes commit to the GitHub repo and trigger a Vercel deploy

If something is BROKEN in CloudCannon, see `cloudcannon-workflow.md` and `phase-6-gotchas.md`.

---

## Layer 2: Operational state (managed in this directory)

The rest of the things that make the site work are tracked here as markdown ledgers. These don't change often enough to need a CloudCannon UI, but they're load-bearing and must not get lost.

### Data verification ledgers

These track the gap between what's published and what's verified.

- **`../data/marketing-claims.md`** — every numerical or factual claim ("12,400+ verified owners", "since 1975", etc.) with source URL, verbatim quote, and verification status (✅ verified, ⚠️ unverified, ❌ removed). New claims added here BEFORE they ship to production. Operator owns the verification.
- **`specs-pending.md`** — product families where dimensional or BTU values are null in the JSON because real spec sheets haven't been imported yet. List shrinks as HHT supplies the spec library.

### Product + dealer state

- **`product-database.md`** — index of every product in `src/content/en/products/`, with status (draft / live), specs status (pending / partial / complete), gallery status, last-updated date. Source-of-truth dashboard for "where are we with the catalog."
- **`dealer-database.md`** — current state of the dealer locator data. Where it's stored, how it's regenerated (Playwright pass against `/where-to-buy/`), how often it should refresh, who owns the refresh job.

### Editorial calendar

- **`promotions-calendar.md`** — current active promotion (the $650 gas insert rebate at time of writing), upcoming promotions by month, historical archive. Operators flip the active promotion via Settings in CloudCannon, but the planning + history lives here.
- **`seasonality-calendar.md`** — month-by-month content/messaging shifts: when winter heating messaging takes the homepage, when outdoor fireplace messaging shifts in for spring, holiday hooks, regional weather considerations.

### Infrastructure

- **`api-keys.md`** — registry of every API key + secret used by the site. Where it's stored (Vercel env vars), what it unlocks, who has access, rotation cadence. Never contains the actual key values, only metadata.
- **`site-management-runbook.md`** — how operators do common ops tasks: update a promotion, add a new product, verify a marketing claim, rotate an API key, regenerate the dealer database, escalate a CloudCannon issue.

---

## Update cadence

| Document | Refresh trigger | Owner |
|---|---|---|
| marketing-claims.md | Every new claim added to a page | Page editor before publish |
| specs-pending.md | When HHT delivers spec PDFs | Whoever imports the specs |
| product-database.md | Every new product added or status change | Person managing the catalog |
| dealer-database.md | Quarterly + on dealer-network changes | Whoever owns the dealer locator |
| promotions-calendar.md | Each month at the editorial review | Marketing lead |
| seasonality-calendar.md | Annually, or as messaging strategy evolves | Marketing lead |
| api-keys.md | On every key rotation or new integration | Tech lead |
| site-management-runbook.md | When a new ops task gets formalized | Whoever wrote the new SOP |

---

## What is NOT in this directory

- **The actual content** (lives in CloudCannon / `src/content/`)
- **The actual API key values** (live in Vercel env vars, this directory only catalogs metadata)
- **The actual dealer records** (live in `src/data/dealers.json` once the Playwright pass populates it, this directory only tracks the refresh process)
- **Code-level architecture** (lives in the main `docs/` directory, not under `operators/`)

---

## How to use this directory if you're a new operator

1. Read this README first.
2. Then read `site-management-runbook.md` for the common-task playbook.
3. When you hit a task that's not in the runbook, write the steps you took into the runbook so the next operator doesn't reinvent it.
4. If you find data drift (the site says one thing, the ledger says another), fix the ledger AND escalate, the drift means something upstream broke.

This directory is the operator's source of truth. Treat it like the safety log on a manufacturing floor.
