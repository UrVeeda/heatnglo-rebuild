# Promotions Calendar

Active, upcoming, and historical promotions for Heat & Glo. The active promotion is also reflected in `src/content/en/settings/site.json` under `rebate`, where it drives the homepage hero copy. This ledger is the planning + history view.

---

## Active promotion

| Field | Value |
|---|---|
| Name | Gas Insert Rebate |
| Headline copy | Save up to $650 when you upgrade your old wood-burning fireplace to a beautiful, easy-to-use Heat & Glo gas insert |
| Amount (USD) | $650 |
| Amount (CAD) | TBD |
| URL | `/promotions/gas-insert-rebate/` |
| Eligibility | Trade-in of qualifying wood-burning unit + purchase of qualifying gas insert |
| Start | (verify with HHT marketing) |
| End | (verify with HHT marketing — the homepage currently has no expiry visible) |
| Source authority | HHT marketing team |

**Action item:** confirm exact promotion start + end dates with HHT marketing before the next deploy. The site shouldn't say "save $650" if the rebate has actually expired.

---

## Upcoming promotions (planned)

*(Empty until HHT marketing shares the editorial calendar. Suggested cadence: Q3 push for early winter heating, Q4 holiday gift cards on outdoor units, Q1 promotion-light period, Q2 spring outdoor fireplace push.)*

| Window | Promotion | Status | Notes |
|---|---|---|---|
| | | | |

---

## Historical promotions

Once a promotion ends, move its row from "Active" to here so the team has a long memory of what's been run before. Useful for "we tried that two years ago and the conversion rate was X."

| Period | Name | Amount | Outcome notes |
|---|---|---|---|
| | | | |

---

## How to update the active promotion (operator runbook)

1. Open CloudCannon, navigate to Settings → site → rebate.
2. Update `amount_usd`, `amount_cad`, `expires_at`.
3. (If the promotion changes name/structure entirely) Edit the homepage hero block via Pages → Home → Hero, update headline copy + CTA destination URL.
4. Move the previous active promotion's row in this ledger from "Active" to "Historical" with end-date + outcome notes.
5. Add the new active promotion's row to "Active" above.
6. Commit + deploy.
7. Visual-spot-check the live homepage on desktop + mobile + the `/promotions/<slug>/` destination page.

---

## Why this ledger and not just CloudCannon

CloudCannon is great for the live state (what does the site say RIGHT NOW). It's not great for the calendar (what's coming next quarter, what ran two years ago). The calendar lives here so planning conversations have a written history.
