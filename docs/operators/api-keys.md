# API Keys + Secrets Registry

Every API key, token, and secret the site uses. **This file never contains actual key values** (those live in Vercel env vars). It catalogs metadata: what each key is for, where it's stored, who owns rotation, when it last rotated.

---

## Active keys

| Key name (env var) | Provider | Purpose | Where stored | Owner | Last rotated | Rotation cadence |
|---|---|---|---|---|---|---|
| `URVEEDAOS_BASE_URL` | UrveedaOS (whitelabel GHL) | CRM endpoint base URL for lead capture | Vercel env (Production + Preview, Sensitive) | David | TBD | quarterly |
| `URVEEDAOS_API_KEY` | UrveedaOS | Lead capture POST auth | Vercel env (Production + Preview, Sensitive) | David | TBD | quarterly |
| `URVEEDAOS_LOCATION_ID` | UrveedaOS | Tenant ID for lead routing | Vercel env (Production + Preview) | David | n/a (not a secret) | n/a |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary | Image hosting cloud name | Vercel env (Production + Preview) | David | n/a (not a secret) | n/a |
| `CLOUDINARY_API_KEY` | Cloudinary | Image upload auth | Vercel env (Production + Preview, Sensitive) | David | TBD | quarterly |
| `CLOUDINARY_API_SECRET` | Cloudinary | Image upload auth secret | Vercel env (Production + Preview, Sensitive) | David | TBD | quarterly |

*(Table expands as integrations are added: Google Places API, Google Search Console, Brevo, Salesforce webhook, etc.)*

---

## Storage rules (applies to every secret)

These rules are non-negotiable post-2026-04-20 Vercel breach:

1. **Production + Preview only.** Never ship a secret to Development environment, ever. Vercel hard-blocks the combination of "Sensitive" + "Development" because Development variables exist to be pulled to local laptops via `vercel env pull` which defeats the purpose of marking it Sensitive.
2. **Sensitive flag must be ON** for every real secret. Vercel's default encryption-at-rest is not enough. The 2026-04-20 breach exposed every non-Sensitive env var across customers.
3. **Redeploy after every change.** A new env var or rotation does not take effect until the next deploy.
4. **Never commit secrets to the repo.** `.env` is gitignored. Sample values live in `.env.example` only.
5. **Never log secret values.** Even in error logs. If a build script needs to debug-print, redact.

Full breach + rotation history: `~/claude-os/lessons/security-vercel-apr-2026.md`.

---

## How to rotate a key

1. Generate the new key at the provider (Cloudinary, UrveedaOS, etc.).
2. In the Vercel dashboard, go to Settings → Environment Variables, find the key, click Edit.
3. Replace the value with the new key. Verify Sensitive is still ON. Verify scope is Production + Preview only (NOT Development).
4. Save.
5. Trigger a redeploy (Deployments → ... → Redeploy).
6. Verify the deploy succeeds and the integration works (test a lead capture, test an image upload, etc.).
7. Revoke the old key at the provider.
8. Update this ledger: bump "Last rotated" to today's date.
9. Update `~/claude-os/security/rotation-log.md` with the rotation event.

---

## How to add a new key

1. Generate at the provider.
2. Add to Vercel env (Production + Preview, Sensitive).
3. Add to `.env.example` with placeholder value.
4. Add to `astro.config.mjs` `env.schema` block with `envField.string({ context: 'server', access: 'secret' })`.
5. Add a row to this ledger: name, provider, purpose, owner, rotation cadence.
6. Commit `astro.config.mjs` + `.env.example` + this ledger update in one PR.
7. Redeploy.

---

## Annual key audit

Once a year (recommended quarter: Q1):
- Review every row in this table.
- Confirm the owner still works at HHT / VoC / etc.
- Confirm the integration is still in use (no orphan keys).
- Force-rotate any key whose "Last rotated" is more than 12 months stale.
- Cross-check against `~/claude-os/security/rotation-log.md` for missed rotations.

Keys that have been forgotten longer than they've been used are how breaches happen.
