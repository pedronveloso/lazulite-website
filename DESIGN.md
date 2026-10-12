---
name: Lazulite Website
description: A mineral-navy, lapis-accented instrument panel for a Bluetooth audio inspector. Dark, hairline-ruled, set in Sora.
colors:
  background: "#0B1017"
  surface: "#131B25"
  surface-raised: "#1A2532"
  hairline: "#223040"
  text-primary: "#E4EAF0"
  text-secondary: "#A3B2C2"
  text-muted: "#7D8FA3"
  accent: "#3E8FD8"
  accent-bright: "#6FB2E8"
  signal-excellent: "#D9B36C"
  signal-good: "#3E8FD8"
  signal-fair: "#C98A3D"
  signal-poor: "#CF726A"
typography:
  wordmark:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 8vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.06em"
  headline:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "0.08em"
  metric:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
rounded:
  xs: "2px"
  sm: "4px"
  md: "6px"
  lg: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.background}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent-bright}"
    textColor: "{colors.background}"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
    height: "44px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "24px"
  panel-raised:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "24px"
  section-label:
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
  badge:
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "3px 8px"
---

# Design System: Lazulite Website

## 1. Overview

**Creative North Star: "The Instrument Panel."**

The website is the app's identity carried onto a page, not a separate brand. Lazulite is a
measurement tool: its surfaces are quiet mineral-navy panels, ruled with hairlines, with a single
lapis-blue accent and numbers that stay put. Nothing decorates; everything informs. Dark is home.
The audience (see `PRODUCT.md` in the Android repository) is informed, skeptical, and
evidence-minded, so the page earns trust through precision and plain statements rather than
spectacle.

**Source of truth.** The Android app defines this system. Tokens mirror
`ui/main/Color.kt`, `Theme.kt`, and `Typography.kt` in `lazulite-android` (dark theme). Change
the app first, then mirror here. Product intent, terminology, and voice live in that repo's
`PRODUCT.md`; this file covers the website's visual implementation only.

**Key characteristics**

- Dark only. Mineral navy ground, tonal surfaces, 1px hairlines. No shadows, gradients, or glows.
- One accent (lapis). Gold, amber, and muted red appear only as signal tiers, and always with text.
- Sora everywhere, sentence case. Uppercase is reserved for the wordmark and section labels.
- Tight corners (2 to 10 px). No pills, no large radii.
- Measured values use tabular figures; label left, value right.
- Motion explains state (a disclosure opening, a border brightening). It never decorates.

**Anti-references.** The previous amber and teal identity, Barlow Condensed all-caps headings,
neon or cyan-on-dark gradients, gradient text, glassmorphism, rounded SaaS cards with drop
shadows, generic Material or Pixel app styling, and AI-product-page tropes.

## 2. Colors

A navy-tinted neutral ladder with one lapis accent and a four-step signal ramp. Names are roles,
never hues. Tokens live in `themes/lazulite/assets/sass/utils/_variables.scss` and are exposed as
CSS custom properties in `_global.scss`.

### Neutrals (ground and text)

- **Mineral Navy** (`background`, `#0B1017`): the page and the app's own ground. Also the text colour on accent fills and the video letterbox colour.
- **Surface** (`surface`, `#131B25`): header, footer, alternate sections, panels, FAQ items.
- **Raised Surface** (`surface-raised`, `#1A2532`): popovers, code chips, version chips; one step above Surface.
- **Hairline** (`hairline`, `#223040`): every border and divider, 1px.
- **Text Primary** (`text-primary`, `#E4EAF0`): headings, emphasised values, wordmark neighbours.
- **Text Secondary** (`text-secondary`, `#A3B2C2`): body copy.
- **Text Muted** (`text-muted`, `#7D8FA3`): section labels, footer, metadata. Still above 4.5:1 on the ground; do not go lower.

### Accent

- **Lapis** (`accent`, `#3E8FD8`): wordmark, primary button fill, markers, links on the ground, focus-adjacent emphasis.
- **Lapis Bright** (`accent-bright`, `#6FB2E8`): hover state, focus ring, body-copy links, inline code.

### Signal ramp

| Token | Hex | Meaning |
| --- | --- | --- |
| `signal-excellent` | `#D9B36C` | Gold: top tier |
| `signal-good` | `#3E8FD8` | Lapis: good / nominal |
| `signal-fair` | `#C98A3D` | Amber: caution |
| `signal-poor` | `#CF726A` | Muted red: poor or error |

These are interface classifications, not promises about what a listener will hear. Always pair
with visible text or an icon (PRODUCT.md principle 5).

**The One Accent Rule.** Lapis is the only accent. Never reintroduce amber as a brand colour or
teal as a data colour; amber and gold exist solely inside the signal ramp.

## 3. Typography

**Face:** Sora (300 to 700 weights shipped by the app; the site self-hosts 400, 500, 600, 700 as
woff2 under `themes/lazulite/static/fonts/Sora/`, SIL OFL 1.1). Fallback: `system-ui`. Sora has
no CJK glyphs, so `html:lang(ja)` and `html:lang(zh)` select regional stacks (Hiragino Sans /
Yu Gothic UI / Noto Sans CJK JP; PingFang SC / Microsoft YaHei UI / Noto Sans CJK SC). Monospace
(`ui-monospace` stack) is for command snippets and inline code only.

- **Wordmark** (600, 0.06em, uppercase, lapis): "LAZULITE" in the header and hero.
- **Headline** (600, -0.02em, sentence case): page and section titles; h1 to h4 step down with tracking from -0.02em to -0.01em.
- **Title** (600, 15 px): FAQ questions, buttons, card titles.
- **Body** (400, 15 to 16 px, 1.7 line height, 65ch measure): all running text, secondary colour.
- **Section label** (600, 11 px, 0.08em, uppercase, muted): hierarchy and metadata, never body copy.
- **Metric** (400, `font-variant-numeric: tabular-nums`): bitrates, versions, dates; any value a refresh could change. Sora's `tnum` keeps digits from shifting.

**The Sentence Case Rule.** Headings are sentence case at semibold weight. All-caps is a label
treatment, applied by the `section-label` mixin or the wordmark and nowhere else. Uppercase does
nothing in CJK, so never rely on it to carry hierarchy.

## 4. Elevation

Flat. Depth comes from tonal layering (Ground, Surface, Raised Surface) and 1px hairlines, exactly
as in the app. There are no box shadows, text shadows, or blurs. The only overlay (the language
popover) sits on Raised Surface with a hairline and `z-index` above the sticky header.

Interactive emphasis is a border or text colour shift to `accent` / `accent-bright` over 150 ms.
Elements do not lift, scale, or glow on hover.

**The No-Shadow Rule.** If something needs to stand out, change its tone or border. Do not add a
shadow.

## 5. Components

### Buttons

Sora 600, sentence case, 44 px minimum height, 4 px radius. **Primary** (`btn btn-primary`) is a
lapis fill with Mineral Navy text; hover moves to `accent-bright`. **Secondary** (`btn
btn-secondary`) is a hairline outline with primary text; hover moves the border to lapis. Class
names are semantic; do not reintroduce colour names (`btn-cyan`, `btn-purple`).

### Panel and FAQ items

`panel` (and `<details>` in `.postWrapper`) is Surface fill, 1px hairline, 6 px radius. Open or
hovered, the border turns lapis. The FAQ marker is a `+` in lapis that rotates 45 degrees when
open.

### Header and footer

56 px sticky header on Surface with a bottom hairline: wordmark left (lapis, uppercase), sentence
case links in secondary text, a 4 px-radius outlined language trigger. Mobile uses a hamburger
that opens a full-width Mineral Navy sheet. The footer is a Surface strip with a top hairline and
muted 12 px text.

### Section label and metric row

`section-label` is the uppercase tracked muted label. `metric-row` puts a label on the left and a
tabular value on the right, like the app's detail rows. Use them for any "name: measured value"
presentation instead of a table or a bullet list.

### Badges (signal chips)

Uppercase 11 px label in a signal colour with a 1px currentColor outline and 2 px radius. Tiers
are `badge-excellent`, `badge-good`, `badge-fair`, `badge-poor`; the text always names the tier.

### Code and commands

Inline `code` sits on Raised Surface in `accent-bright`; `pre code` blocks are Surface with a
hairline and 6 px radius, primary text colour.

### App media

Screenshots, cards, and video are real AASG dark-mode captures; never redraw or restyle them.
Phone frames and feathered cards supply their own edges, so media has no extra border, radius, or
shadow. Video letterboxing uses the Mineral Navy ground.

### Layout and responsiveness

Container 1200 px (`$width`), reading column 720 px (`$width-narrow`) with 65ch paragraphs.
Breakpoints at 992, 768, and 576 px; two-column feature rows collapse to one column at 768 px
and the header collapses to a hamburger. Spacing steps 4 / 8 / 12 / 16 / 24 mirror the app; 32,
48, and 64 px are page rhythm only. Sections are separated by hairlines, not background bands,
except the single alternate Surface band for Smart Suggestions.

## 6. Do's and Don'ts

### Do

- **Do** read colours, type, radii, and spacing from `_variables.scss` (SCSS) or the CSS custom properties; never hard-code a hex value in a component or in content markdown.
- **Do** keep the app and site in lockstep: when `Color.kt`, `Theme.kt`, or `Typography.kt` change, update tokens here and `DESIGN.md` together.
- **Do** keep copy within the product claim boundaries in the Android `PRODUCT.md`: report evidence, never a cause or a guaranteed audible effect.
- **Do** keep text contrast at 4.5:1 or better and keep the 2 px `accent-bright` focus ring visible.
- **Do** verify every page in English and Japanese; wrapping and fallback fonts differ.
- **Do** use `tabular-nums` for anything that is a measurement, version, or date.

### Don't

- **Don't** use amber, gold, or teal outside the signal ramp, or add a second accent.
- **Don't** add shadows, gradients, glows, gradient text, glass, or pill shapes.
- **Don't** set headings in all caps or condensed faces; do not reintroduce Barlow Condensed, Epilogue, or Fira Mono.
- **Don't** use colour as the only carrier of status.
- **Don't** add decorative motion (floating logo, parallax, pulsing dots); honour `prefers-reduced-motion`.
- **Don't** use inline `style=` attributes or colour-named classes in content; add a semantic class to the theme instead.
- **Don't** add a light theme without recapturing light-mode media and updating this file; the site is dark-only.
