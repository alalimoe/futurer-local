# NX-01 homepage focus lens

Native Futurer section based on the approved [focus-lens prototype](https://nootropix-focus-lens.moeeeeee.chatgpt.site).

## Integration

`templates/index.json` places **NX-01 focus lens** first and disables the previous `new_hero_rYGHCA` section. Existing header, footer, and other homepage sections keep their settings. The old hero can be restored by hiding this section and showing the original in Customize.

The section uses the NX-01 Baseline product and the existing `nx-01_baseline_2x_floating.png` Shopify image. If that image is unavailable, it uses the selected product's featured image. Select the transparent floating-bottles image in Customize for the approved appearance.

## Customize

Open **Home page → NX-01 focus lens** in the theme editor. Product, image, copy, CTA, colours, image size, lens radius, magnification, softness, and floating motion are editable. Six ingredient blocks can be edited, reordered, or removed. Blank copy fields use English or Arabic defaults; custom copy can be translated with the store's translation workflow. The section inherits theme fonts.

The formula view shows six selected ingredients, with quantities per three-capsule serving. It explicitly links to the product's full formula. Keep ingredient blocks and serving notes synchronized with any product changes. Changing the selected product does not automatically change the copy or ingredient blocks.

## Behaviour

- WebGL draws the product and formula into a texture, applies two Gaussian-blur passes, then composites a sharp magnifying lens with edge refraction and chromatic separation.
- Mouse movement, touch dragging, and keyboard arrow keys move the lens; Home recentres it. Detail/formula, pause, reset, and lens controls are included.
- A Canvas 2D renderer handles unavailable WebGL or a lost WebGL context. If enhancement fails entirely, the normal product image, CTA, and accessible HTML ingredient list remain.
- Rendering pauses offscreen and when the tab is hidden. Reduced-motion settings stop ambient movement. Frame rate is capped near 30 fps, pixel ratio is capped at 1.5, and slow rendering reduces resolution.
- A custom element manages initialization and cleanup when Shopify reloads sections. No external JavaScript, CSS libraries, fonts, or analytics are added.

## Review before publishing

Preview this branch in an unpublished Shopify theme. Check the actual theme header/font combination, select the correct transparent image, test theme-editor setting changes, and inspect GPU rendering on a WebGL-enabled desktop and mobile device. Local browser review cannot replace those Shopify and device checks.

## Validation performed

- Shopify's theme checker passes the new section, English locale, and homepage template. It reports 948 existing Arabic-locale diagnostics: 912 keys without a default translation and 36 missing translations. All were compared with the base commit; none involve the new `nx_focus` namespace.
- The English and Arabic namespace keys match. Existing homepage content/settings and old locale entries were compared with the base commit and preserved.
- Liquid was parsed and rendered with fixture product data for local browser checks. Desktop, 390px, and 320px layouts were reviewed, including Arabic RTL. The 320px document has no horizontal overflow. Formula selection, pause, keyboard movement, lens toggle, and the accessible ingredient disclosure were exercised.
- This browser used Canvas 2D. GPU rendering and actual Shopify theme-editor integration still require an unpublished-theme preview.
