# Nootropix Email Design System

Reusable Klaviyo HTML system extracted from the **Welcome Series** email. Use this when building new campaigns so every send shares the same tokens, layout rules, and component patterns.

## Quick start

1. Copy `base-template.html` to a new file (e.g. `email-my-campaign.html`).
2. Replace `{{EMAIL_TITLE}}`, `{{PREHEADER}}`, and `{{EMAIL_BODY}}`.
3. Paste components from `components/` into the body (replace `{{PLACEHOLDERS}}`).
4. Set UTMs: `utm_source=klaviyo`, `utm_medium=email`, `utm_campaign=<campaign_slug>`, `utm_content=<block>`.
5. Paste the finished HTML into Klaviyo → campaign → source editor.

Reference implementation: `examples/welcome-series.html`

## File map

| File | Purpose |
|---|---|
| `tokens.json` | Color, type, spacing, asset, and Klaviyo token reference |
| `base-template.html` | Document shell with shared `<head>` styles |
| `components/_head-styles.html` | Shared CSS only (for maintenance) |
| `components/*.html` | Copy-paste blocks with `{{PLACEHOLDERS}}` |
| `examples/welcome-series.html` | Canonical welcome email |
| `examples/campaign-starter.html` | Minimal blank campaign |

## Design tokens

### Colors (light → dark)

| Token | Light | Dark | Use |
|---|---|---|---|
| Canvas | `#ECEDE9` | `#0E0F0D` | Page background |
| Shell | `#F9FAF7` | `#151613` | 600px container |
| Heading | `#11120F` | `#F3F4EF` | Headlines, strong |
| Text | `#30312E` | `#F3F4EF` | Body copy |
| Muted | `#74766F` | `#A7A9A2` | Secondary text |
| Yellow | `#FFD007` | `#FFD007` | Chips, CTA accent |
| Soft card | `#F7F8F5` | `#272825` | Panels |
| Soft border | `#E1E3DD` | `#363832` | Rules, soft borders |
| Card inner | `#FFFFFF` | `#1D1E1B` | White goal cards |
| Yellow card | `#FFF7D3` | `#342F16` | Callouts |
| Yellow border | `#EFD56A` | `#66591C` | Callout border |
| Link | `#2B16B7` | `#A9A2FF` | Inline links |
| CTA bg | `#151613` | `#FFD007` | Button fill |
| CTA fg | `#FFFFFF` | `#11120F` | Button text |

### Typography

- **Font:** Lexend, system-ui stack
- **Hero:** 31px mobile / 38px desktop, weight 700
- **Section title:** 20px, weight 700
- **Body:** 16px / 1.65, weight 400
- **Label / eyebrow:** 10px, weight 700, uppercase, 1px tracking
- **Footer:** 11px + 10px legal

### Layout

| Rule | Value |
|---|---|
| Max width | 600px |
| Outer margin (desktop) | 14px vertical |
| Outer margin (mobile) | 0 (full bleed) |
| Shell radius | 18px (desktop only) |
| Gutters | 22px mobile / 36px desktop |
| Card radius | 16px soft/yellow, 18px white cards |
| CTA radius | 12px |
| Logo | 132×28px, left-aligned |

## Components

| Component | File | When to use |
|---|---|---|
| Head styles | `_head-styles.html` | Inside `<head>` — one per email |
| Header | `header.html` | Logo + delivery badge |
| Rule | `rule.html` | Divider after header or before footer |
| Hero | `hero.html` | Eyebrow chip + H1 |
| Section intro | `section-intro.html` | Eyebrow + H2 + optional body |
| Body paragraph | `body-paragraph.html` | Single 16px paragraph row |
| Soft card | `soft-card.html` | Proof points, lists, grouped copy |
| Soft card item | `soft-card-item.html` | Title + body inside soft card |
| Yellow card | `yellow-card.html` | Priority notes, removal tests |
| Goal card | `goal-card.html` | Single tile in 2-col grid |
| Goal grid row | `goal-grid-row.html` | Two goal cards side by side |
| Hero image | `hero-image.html` | Full-width image block |
| CTA (accent) | `cta-full-width.html` | Primary CTA with yellow bar + VML |
| CTA (simple) | `cta-simple.html` | Secondary full-width button |
| Footer | `footer.html` | Legal + Klaviyo unsubscribe tags |

## Email-client rules

- **Tables + inline styles** for all structure (no flexbox/grid in production emails).
- **Outlook:** include MSO 96-DPI meta and VML `v:roundrect` on primary CTAs (`cta-full-width.html`).
- **Preheader:** hidden `<div>` before the outer table; pad with `&nbsp;͏` to avoid inbox snippet bleed.
- **Images:** `width` + `height` attributes, `alt` text, `border="0"`, responsive `max-width:100%`.
- **Dark mode:** `prefers-color-scheme: dark` overrides in shared CSS; logo uses `.logo-img` invert filter.
- **Klaviyo tags:** preserve exactly:
  - `{% unsubscribe 'Unsubscribe' %}`
  - `{% manage_preferences 'Manage preferences' %}`
- **Do not modify** dynamic feed, profile-property, or coupon tags in live templates.

## UTM convention

```
https://nootropix.ae/{path}?utm_source=klaviyo&utm_medium=email&utm_campaign={slug}&utm_content={block}
```

| Block | `utm_content` examples |
|---|---|
| Logo | `logo` |
| Hero image | `hero_image` |
| Primary CTA | `cta_shop`, `offer_link` |
| Footer | `footer` |
| Inline link | `ps_quiz`, `intro_link` |

## Building a new campaign

### 1. Define metadata

```
Subject:     ...
Preheader:   ...
Eyebrow:     ...
UTM campaign: edu_my_topic
```

### 2. Assemble body sections

Typical editorial flow:

1. `header.html` + `rule.html`
2. `hero.html`
3. `body-paragraph.html` (intro)
4. `soft-card.html` or `yellow-card.html` (structured content)
5. `section-intro.html` (mid-email section)
6. `goal-grid-row.html` (optional comparison tiles)
7. `cta-full-width.html` or `cta-simple.html`
8. `footer.html`

### 3. Validate before send

- [ ] Preheader matches brief
- [ ] All links include UTMs
- [ ] Klaviyo unsubscribe tags present in footer
- [ ] No hardcoded `.shop` URLs (use `nootropix.ae`)
- [ ] Test in Klaviyo preview (mobile + desktop)
- [ ] Primary CTA has VML fallback for Outlook

## CSS class reference

Classes are defined in `_head-styles.html` and duplicated in `base-template.html`:

| Class | Role |
|---|---|
| `.font` | Lexend stack |
| `.shell` | 600px container |
| `.pad` | Horizontal gutters (responsive) |
| `.heading` | Headline color |
| `.text` | Body color |
| `.muted` | Secondary color |
| `.body-copy` | 16px body sizing |
| `.section-title` | 20px section H2 |
| `.hero-title` | Responsive H1 sizing |
| `.soft` | Soft card surface |
| `.yellow` | Yellow callout surface |
| `.card-inner` | White card surface |
| `.rule` | Horizontal divider |
| `.link` | Inline link color |
| `.button` | CTA surface |
| `.goal-cell` | 2-col grid cell (stacks mobile) |

## Changelog

- **1.0.0** — Initial system from Welcome Series email
