# Zod → CloudCannon `_inputs` mapping

Phase 6 wires `_inputs` against this map. Reference + agency template — no code yet.

| Zod | CloudCannon `_inputs` type | Notes |
|---|---|---|
| `z.string()` | `text` | Use `textarea` for multi-line; `markdown` for rich text |
| `z.string().email()` | `email` | |
| `z.string().url()` | `url` | Add `hide_link_to_*` options as needed |
| `z.string().regex(...)` | `text` with `pattern` + `pattern_message` | Single-quote YAML regex with backslashes |
| `z.number()` | `number` | Require `min`, `max`, `step` in options (CC breaks without them) |
| `z.number().min().max()` | `range` | |
| `z.boolean()` | `checkbox` or `switch` | |
| `z.enum([...])` | `select` with `options.values` | Use `_select_data` for long lists |
| `z.array(z.enum([...]))` | `multiselect` + `empty_type: array` | |
| `z.array(z.object({...}))` | `array` + `_structures` entry | Every field must be in the structure value |
| `z.object({...})` | `object` with `subtype: object` or `tabbed` | |
| `z.coerce.date()` | `datetime` | Respect site timezone (America/Chicago for HHT HQ) |
| `z.string()` (image path) | `image` with `paths.uploads` + `allowed_sources` | Phase 6 wires Cloudinary DAM |
| `.nullish()` | `empty_type: null` or `string`/`array` per field type | YAML bare keys parse as null |
| `z.any()` | `object` (or omit from `_inputs` and edit raw via the data editor) | Used for `structuredData` @graph blocks |

## Heat & Glo specific mappings

### Block-level variant inputs (Block Delivery Standard §7c)

```yaml
_inputs:
  bg_variant:        { type: select, options: { values: [paper, cream, ink, brand] } }
  alignment:         { type: select, options: { values: [left, center] } }
  density:           { type: select, options: { values: [compact, default, roomy] } }
  hidden_on_mobile:  { type: switch }
  cta_primary_variant:    { type: select, options: { values: [orange, orange-outline, ink, ghost] } }
  cta_secondary_variant:  { type: select, options: { values: [orange, orange-outline, ink, ghost] } }
  cta_variant:            { type: select, options: { values: [orange, orange-outline, ink, ghost] } }
  media_position:    { type: select, options: { values: [left, right] } }
  emphasis:          { type: select, options: { values: [regular, bold] } }
  stars:             { type: number, options: { min: 0, max: 5, step: 1 } }
```

### Block content inputs

| Field | Schema | CC `_inputs` |
|---|---|---|
| `heading`, `lede`, `paragraph_1`, `paragraph_2`, `quote_body`, `answer` | `z.string()` | `markdown` (rich text) |
| `eyebrow`, `cta_*_text`, `zip_label`, `attribution_name`, `question` | `z.string()` | `text` |
| `cta_*_href`, `zip_action` | `z.string()` | `url` with `paths.uploads` excluded |
| `*_image`, `*_image_url`, `background_image`, `media_image` | `z.string()` | `image` with Cloudinary `allowed_sources` |
| `*_alt` | `z.string()` | `text` |
| `items[]`, `cards[]`, `logos[]` | `z.array(z.object(...))` | `array` + `_structures.{trust_items,lineup_cards,press_logos,faq_items}` |

### Page-level inputs

| Field | Schema | CC `_inputs` |
|---|---|---|
| `title`, `description` | `z.string()` | `text` |
| `ogImage` | `z.string().nullish()` | `image` with `empty_type: null` |
| `noIndex` | `z.boolean()` | `switch` |
| `content_blocks` | `z.array(z.object({_type: z.string()}).passthrough())` | `array` + `_structures.content_blocks` (the Phase 4 structures file) |
| `structuredData` | `z.any().nullish()` | omit from `_inputs` — raw JSON edit via data editor |

### Settings collection inputs

```yaml
_inputs:
  company.name:    { type: text }
  company.parent:  { type: text }
  company.phone:   { type: text, options: { pattern: '^[0-9-+() ]+$' } }
  company.email:   { type: email }
  company.address: { type: textarea }
  company.founded: { type: number, options: { min: 1900, max: 2100, step: 1 } }
  rebate.amount_usd:  { type: text }
  rebate.amount_cad:  { type: text }
  rebate.expires_at:  { type: datetime }
  social:          { type: object }
```

## Per-locale input behavior

The 4-locale matrix means `pages-en` is editor-facing, while `pages-{es,en-ca,fr-ca}` are translate-loader output. In `cloudcannon.config.yml`, restrict edit access:
- `pages-en` collection: `disable_add: false`, full edit
- `pages-es` / `pages-en-ca` / `pages-fr-ca`: `disable_add: true`, optional `disable_edit: true` — the translate-loader is the source of truth, except for fields editors mark `_locked: true`

Phase 6 wires this into `cloudcannon.config.yml` `collection_groups` + per-collection `_inputs` overrides.

## GFM table gotcha (carry-forward from agency template)

If any rich-text field might contain Markdown tables, the GFM parser needs exactly ONE header row; extra header rows get saved as raw HTML. Note this in the rich-text editor config.
