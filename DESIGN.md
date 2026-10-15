---
name: Lazulite Website
description: A lapis-accented instrument panel for a Bluetooth audio inspector, with app-matched dark and light themes.
colors:
  dark-background: "#0B1017"
  dark-surface: "#131B25"
  dark-surface-raised: "#1A2532"
  dark-hairline: "#223040"
  dark-text-primary: "#E4EAF0"
  dark-text-secondary: "#A3B2C2"
  dark-text-muted: "#7D8FA3"
  dark-accent: "#3E8FD8"
  dark-accent-bright: "#6FB2E8"
  dark-on-accent: "#0B1017"
  dark-signal-excellent: "#D9B36C"
  dark-signal-good: "#3E8FD8"
  dark-signal-fair: "#C98A3D"
  dark-signal-poor: "#CF726A"
  dark-interactive-text: "#6FB2E8"
  dark-link-hover: "#6FB2E8"
  dark-button-hover: "#6FB2E8"
  dark-button-hover-border: "#6FB2E8"
  dark-media-background: "#0B1017"
  dark-focus-ring: "#6FB2E8"
  light-background: "#F3F6F9"
  light-surface: "#FFFFFF"
  light-surface-raised: "#E9EEF4"
  light-hairline: "#D2DBE5"
  light-text-primary: "#0E151D"
  light-text-secondary: "#3C4C5C"
  light-text-muted: "#5A6C7D"
  light-accent: "#1E6DB5"
  light-accent-bright: "#3E8FD8"
  light-on-accent: "#FFFFFF"
  light-signal-excellent: "#8E6E23"
  light-signal-good: "#1E6DB5"
  light-signal-fair: "#8A5A16"
  light-signal-poor: "#A3382F"
  light-interactive-text: "#1E6DB5"
  light-link-hover: "#0E151D"
  light-button-hover: "#1E6DB5"
  light-button-hover-border: "#0E151D"
  light-media-background: "#F3F6F9"
  light-focus-ring: "#1E6DB5"
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
  button-primary-dark:
    backgroundColor: "{colors.dark-accent}"
    textColor: "{colors.dark-on-accent}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
    height: "44px"
  button-primary-hover-dark:
    backgroundColor: "{colors.dark-button-hover}"
    textColor: "{colors.dark-on-accent}"
  button-secondary-dark:
    backgroundColor: "transparent"
    textColor: "{colors.dark-text-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
    height: "44px"
  button-secondary-hover-dark:
    backgroundColor: "transparent"
    textColor: "{colors.dark-link-hover}"
  panel-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-text-secondary}"
    rounded: "{rounded.md}"
    padding: "24px"
  panel-raised-dark:
    backgroundColor: "{colors.dark-surface-raised}"
    textColor: "{colors.dark-text-secondary}"
    rounded: "{rounded.md}"
    padding: "24px"
  header-selector-dark:
    backgroundColor: "transparent"
    textColor: "{colors.dark-text-secondary}"
    rounded: "{rounded.sm}"
    padding: "0.35rem 0.75rem"
    height: "44px"
  header-selector-popover-dark:
    backgroundColor: "{colors.dark-surface-raised}"
    textColor: "{colors.dark-text-secondary}"
    rounded: "{rounded.md}"
    padding: "4px"
    width: "12rem"
  section-label-dark:
    textColor: "{colors.dark-text-muted}"
    typography: "{typography.label}"
  badge-excellent-dark:
    textColor: "{colors.dark-signal-excellent}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "3px 8px"
  badge-good-dark:
    textColor: "{colors.dark-signal-good}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "3px 8px"
  badge-fair-dark:
    textColor: "{colors.dark-signal-fair}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "3px 8px"
  badge-poor-dark:
    textColor: "{colors.dark-signal-poor}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "3px 8px"
  button-primary-light:
    backgroundColor: "{colors.light-accent}"
    textColor: "{colors.light-on-accent}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
    height: "44px"
  button-primary-hover-light:
    backgroundColor: "{colors.light-button-hover}"
    textColor: "{colors.light-on-accent}"
  button-secondary-light:
    backgroundColor: "transparent"
    textColor: "{colors.light-text-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
    height: "44px"
  button-secondary-hover-light:
    backgroundColor: "transparent"
    textColor: "{colors.light-link-hover}"
  panel-light:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-text-secondary}"
    rounded: "{rounded.md}"
    padding: "24px"
  panel-raised-light:
    backgroundColor: "{colors.light-surface-raised}"
    textColor: "{colors.light-text-secondary}"
    rounded: "{rounded.md}"
    padding: "24px"
  header-selector-light:
    backgroundColor: "transparent"
    textColor: "{colors.light-text-secondary}"
    rounded: "{rounded.sm}"
    padding: "0.35rem 0.75rem"
    height: "44px"
  header-selector-popover-light:
    backgroundColor: "{colors.light-surface-raised}"
    textColor: "{colors.light-text-secondary}"
    rounded: "{rounded.md}"
    padding: "4px"
    width: "12rem"
  section-label-light:
    textColor: "{colors.light-text-muted}"
    typography: "{typography.label}"
  badge-excellent-light:
    textColor: "{colors.light-signal-excellent}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "3px 8px"
  badge-good-light:
    textColor: "{colors.light-signal-good}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "3px 8px"
  badge-fair-light:
    textColor: "{colors.light-signal-fair}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "3px 8px"
  badge-poor-light:
    textColor: "{colors.light-signal-poor}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "3px 8px"
---

# Design System: Lazulite Website

## Overview

**Creative North Star: "The Instrument Panel"**

The website carries the app's identity onto a page. Lazulite is a measurement tool: quiet tonal panels, hairline rules, a single lapis-blue accent, and numbers that stay put. Mineral navy gives the dark theme its ground; the light theme uses cool, pale neutrals with the same restrained structure. Nothing decorates; everything informs.

The audience is informed, skeptical, and evidence-minded, so the page earns trust through precision and plain statements. The Android app defines the shared palettes and typography in `Color.kt`, `Theme.kt`, and `Typography.kt`; mirror changes here after the app. Website-specific interaction roles live in `themes/lazulite/assets/sass/utils/_variables.scss`. Product intent, terminology, and voice belong in `PRODUCT.md` and the shared Android product reference.

**Key Characteristics:**

- App-matched dark and light palettes; tonal surfaces and 1px hairlines.
- One lapis accent; gold, amber, and muted red only support labeled signal tiers.
- Sora, sentence case, tight corners, and tabular measured values.
- Flat surfaces without shadows, gradients, glows, or decorative motion.
- Authentic app captures match the resolved website theme.

**Anti-references.** The previous amber and teal identity, Barlow Condensed all-caps headings, neon or cyan gradients, gradient text, glassmorphism, pill-shaped SaaS cards with drop shadows, generic Material or Pixel app styling, and AI-product-page tropes.

## Colors

The frontmatter records both complete palettes. Prefixes identify the palette; runtime CSS properties use the unprefixed role, such as `--surface`. SCSS component aliases resolve to `var(--role)` at runtime. The maps in `utils/_variables.scss` and their exposure in `sass/_global.scss` are the implementation source of truth.

### Primary

- **Lapis / Deep Lapis** (`accent`): dark-theme lapis and light-theme deep lapis respectively. Use for wordmarks, primary fills, markers, and ordinary links.
- **Lapis Bright** (`accent-bright`): a brighter accent step, not a universal interactive-text or focus token. Its light-theme value does not meet 3:1 against Raised Surface.
- **On Accent** (`on-accent`): text and selection foreground on accent fills. It is Mineral Navy in dark mode and white in light mode; do not derive it from the page background.
- **Interactive Text** (`interactive-text`): inline code and links embedded in running copy. Bright lapis in dark mode, deep lapis in light mode.
- **Link Hover** (`link-hover`): general link and secondary-button hover text. Bright lapis in dark mode, primary text in light mode. Reading-column links and header navigation retain their component-specific primary-text hover.
- **Button Hover / Border** (`button-hover`, `button-hover-border`): dark primary buttons brighten their fill and border; light primary buttons retain the deep-lapis fill and change the border to primary text. Keep `on-accent` text in both states.
- **Focus Ring** (`focus-ring`): the visible keyboard outline, bright lapis in dark mode and deep lapis in light mode. The light ring uses the deeper accent to preserve contrast on raised surfaces.

### Neutral

- **Ground** (`background`): page canvas and mobile navigation sheet; mineral navy in dark mode, cool pale ground in light mode.
- **Surface** (`surface`): header, footer, panels, FAQ items, and the alternate section surface.
- **Raised Surface** (`surface-raised`): selector popovers, inline code backgrounds, and version chips. A tonal step, not a shadow.
- **Hairline** (`hairline`): borders and dividers, normally 1px.
- **Primary / Secondary / Muted Text** (`text-primary`, `text-secondary`, `text-muted`): headings and values / body text / labels and metadata. Choose text by hierarchy and retain readable contrast.
- **Media Ground** (`media-background`): Mineral Navy in dark mode and cool pale ground in light mode, matching the background rendered into each framed video. Keep this an independent video role.

### Signal ramp

The `signal-excellent`, `signal-good`, `signal-fair`, and `signal-poor` roles retain gold, lapis, amber, and muted red classifications with palette-specific contrast. These are interface classifications, not promises about what a listener will hear. Always pair status color with visible text or an icon.

**The One Accent Rule.** Lapis is the only brand accent. Gold and amber belong to the signal ramp; do not reintroduce amber as a brand color or teal as a data color.

**The Semantic Role Rule.** Use the runtime role for the job. Page ground, text on accent, interactive text, hover, focus, and media ground remain distinct even when dark-theme values coincide.

## Typography

**Face:** Sora; the site self-hosts weights 400, 500, 600, and 700 under `themes/lazulite/static/fonts/Sora/` (SIL OFL 1.1). Fallback is the platform UI stack. Sora has no CJK glyphs: Japanese uses Hiragino Sans / Yu Gothic UI / Noto Sans CJK JP, and Simplified Chinese uses PingFang SC / Microsoft YaHei UI / Noto Sans CJK SC. Components inherit the regional family. System monospace is reserved for commands and inline code.

- **Wordmark:** uppercase semibold lapis; the hero uses the responsive wordmark token, while the header uses a compact 1rem size with 0.08em tracking.
- **Headline:** semibold sentence case, slightly negative tracking; responsive section and page titles.
- **Title:** semibold, 15px, for FAQ questions, buttons, and panel titles.
- **Body:** regular, 15–16px, with approximately 1.7 line height and a 65ch reading measure. The base body uses 1.6; reading-page paragraphs use 1.75.
- **Label:** semibold, 11px, tracked uppercase for section hierarchy and metadata.
- **Metric:** tabular figures for bitrates, versions, dates, and changing measurements.

**The Sentence Case Rule.** Headings use sentence case. Uppercase belongs to the wordmark and section-label treatment, including reading-page label-style third-level headings. CJK hierarchy must remain clear without case changes.

## Layout

The main container is 1200px, with a 720px reading column and 65ch running-copy measure. Spacing steps of 4 / 8 / 12 / 16 / 24px mirror the app; 32 / 48 / 64px provide page rhythm. Two-column feature rows collapse at 768px. The header switches to its hamburger sheet at 992px, independently of feature rows; the small-screen breakpoint is 576px.

Sections use hairline separation; the established alternate Surface band remains available. Preserve the page composition and density when extending a palette. The mobile sheet scrolls within the viewport below the 56px header, and selector popovers flow inside it rather than clipping beyond the screen.

## Elevation & Depth

Flat. Depth comes from Ground, Surface, Raised Surface, and 1px hairlines. There are no box shadows, text shadows, blurs, gradients, or glows. Both header popovers sit on Raised Surface above the sticky header.

Interactive emphasis is a border, fill, or text-color change over 150ms ease. FAQ markers rotate over 200ms; hamburger strokes use 200ms ease-out and the mobile sheet uses 400ms ease-out. These transitions explain state. Reduced-motion preferences reduce transition and animation durations to 0.01ms.

**The No-Shadow Rule.** If something needs to stand out, change its tone or border. Do not add a shadow.

## Shapes

Tight corners follow the established scale: 2px badges and icon edges, 4px buttons and selector triggers, 6px panels and popovers, and a 10px maximum token for existing larger shapes. Borders remain thin and deliberate. Do not introduce pills or large rounded cards.

## Components

### Buttons

Sora semibold, sentence case, 44px minimum height, 4px corners, and 10px × 24px padding. Primary buttons use `accent` and `on-accent`; hover uses the independent button fill and border roles. In light mode this means white text on deep lapis, with an unchanged hover fill and a primary-text hover border. Secondary buttons are transparent with a hairline outline and primary text; hover changes the border to accent and the text to `link-hover`.

All keyboard focus uses a 2px `focus-ring` outline with a 3px offset. Never substitute the brighter light accent for this role.

### Panels and FAQ items

Panels use Surface, a 1px hairline, 6px corners, and 24px padding; the raised variant uses Raised Surface. FAQ disclosures use the same surface and outline, with an accent border on hover or open. Their plus marker rotates 45 degrees when open. Static panels do not acquire interaction states merely because they look like a disclosure.

### Header, appearance, and language

The 56px sticky header uses Surface and a bottom hairline: app icon and lapis wordmark left, sentence-case navigation right. The appearance dropdown sits beside language on desktop; both live inside the hamburger sheet at 992px and below. Both triggers include a decorative 16px inline SVG: a half-filled appearance circle and a language globe, followed by the selected label and a matching 12px chevron. Icons inherit the current text color, remain hidden from assistive technology, and require no font or external asset request. They share the `headerSelector` visual treatment: outlined 4px trigger, 44px minimum target, Raised Surface popover with 6px corners, 4px inset, and at least 44px choice rows.

Appearance choices are native radios labeled System, Light, and Dark, translated in English, Spanish, Italian, Simplified Chinese, and Japanese. Use native radio keyboard behavior, visible focus, Escape to close and return to the trigger, outside-click dismissal, and at most one open selector. The trigger displays the saved preference, so System remains labeled System even when the resolved palette is light or dark.

The preference persists in `localStorage` as `lazulite-theme`, with `system` as the default for absent or invalid data. System prioritizes a reported browser color preference. If neither light nor dark is exposed, visitor-local time uses light from 07:00 inclusive to 19:00 exclusive and dark otherwise. Follow live browser preference changes, the next fallback time boundary, page return, focus, visibility restoration, and cross-tab storage changes. The root `data-theme` carries only the resolved `light` or `dark` value. Resolution runs before stylesheet paint and updates browser chrome; it needs no backend API.

Without JavaScript, CSS follows the browser preference, with dark as its unsupported-browser fallback, and the inactive appearance control stays hidden. The time fallback and saved manual preference require JavaScript.

The footer remains a Surface strip with a top hairline and muted 12px text.

### Section labels and metric rows

Labels use the tracked muted treatment. A metric row places its label left and a tabular primary-text value right, separated by a 16px gap and 8px vertical padding. Use this established pattern for compact measured-value presentations.

### Badges and code

Signal badges use the label treatment, 3px × 8px padding, a 1px current-color outline, and 2px corners. Every badge names its tier. They are status displays, not interactive controls. Inline code uses Raised Surface and `interactive-text`; command blocks use Surface, a hairline, 6px corners, and primary text.

### App media

Screenshots, semantic cards, video, and posters are real AASG captures for each theme and language. Select the variant using the resolved root `data-theme`, including manual and automatic changes. Without JavaScript, pictures follow the browser color preference with a dark fallback. Preserve capture colors, feathering, proportions, and frames. Media supplies its own edges; do not add an outer border, radius, shadow, tint, filter, or redraw. Video letterboxing uses the theme-specific `media-background` role. Changing appearance restarts the matching demo from zero; load video only when visible and reduced motion is disabled. Reduced-motion and no-JavaScript visitors see the matching poster. Retain native playback controls. Refresh captures only through the documented media workflow.

## Do's and Don'ts

### Do

- **Do** use runtime semantic color properties in components and keep both palette maps aligned with the app.
- **Do** keep page ground, on-accent text, interactive text, hover, focus, and media ground as separate roles.
- **Do** keep text contrast at 4.5:1 or better and preserve the 2px theme-specific focus ring.
- **Do** verify English and Japanese at desktop and mobile widths in both themes.
- **Do** use tabular figures for measurements, versions, and dates.
- **Do** preserve native radio keyboard behavior and translated System, Light, and Dark choices in all five languages.
- **Do** use authentic app media for each language and appearance, with a matching video background and poster.

### Don't

- **Don't** use amber, gold, or teal as additional brand accents.
- **Don't** add shadows, gradients, glows, glass, or pill shapes.
- **Don't** set ordinary headings in all caps or condensed faces, or reintroduce Barlow Condensed, Epilogue, or Fira Mono.
- **Don't** use color as the only carrier of status.
- **Don't** add decorative motion; honor reduced-motion preferences.
- **Don't** hard-code component colors, add inline styles in content, or use color-named classes.
- **Don't** infer light-theme button text, focus, hover, or media colors from a dark-theme coincidence.
