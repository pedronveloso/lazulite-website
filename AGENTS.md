# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, etc.) when working with code in this repository. `CLAUDE.md` is a symlink to this file.

## Project Overview

Static website for the Lazulite Android App, built with Hugo and deployed on Netlify. The site showcases an Android app that analyzes audio quality and Bluetooth transmission.

## Key Commands

### Build and Deploy
- `npm ci` - Install the pinned GSAP dependency before the first Hugo build. Hugo bundles `assets/js/home-motion.js` and `assets/js/signal-field.js`; no CDN or separate JavaScript build step is required.
- `hugo` - Build static site (outputs to `public/`)
- `hugo server` - Start local dev server (http://localhost:1313)
- `hugo server -D` - Include draft content in dev server
- Netlify deploys automatically on push using Hugo 0.168.0 (configured via `HUGO_VERSION` in `netlify.toml`) — keep this in sync with the local Hugo binary (`hugo version`) when either is upgraded

### Testing
- Run `node --test scripts/test-*.mjs` for theme resolution/selector and app-media behavior.
- Run `python3 -m unittest discover -s scripts -p 'test_*.py'` for media-import and metadata checks.
- `./scripts/seo-snapshot.sh` checks the tracked Hugo output. Use the Hugo version pinned in CI and Netlify.
- There is no browser test framework; verify desktop/mobile behavior in the local preview.

### GSAP Skills
- Consult the repository's `.agents/skills/gsap-*/SKILL.md` guidance when implementing or reviewing GSAP animations. Always read [gsap-performance](.agents/skills/gsap-performance/SKILL.md); performance is a priority for all motion work.
- Read [gsap-core](.agents/skills/gsap-core/SKILL.md), [gsap-timeline](.agents/skills/gsap-timeline/SKILL.md), [gsap-scrolltrigger](.agents/skills/gsap-scrolltrigger/SKILL.md), and the other installed GSAP skills as relevant to the change.
- Prefer transforms and opacity, batch layout reads and writes, avoid unnecessary per-frame work, and clean up animations according to the lifecycle specified in `PRODUCT.md` and `DESIGN.md`. Preserve the requirement that scrolling does not cancel headphone motion.

## Architecture

### Site Configuration
- **Base URL**: https://lazulite.app (production)
- **Theme**: Custom "lazulite" theme in `themes/lazulite/`
- **Config**: `config.toml` contains site settings, per-language menus, social links, and SEO params (`playStoreUrl`, `socialImage`, per-language `description`/`homeTitle`)
- **Contact**: lazuliteapp@gmail.com (configured in `config.toml`)

### Internationalization
The site is multilingual. Languages are defined under `[languages.*]` in `config.toml`:
- `en` (English, default), `es` (Español), `zh` (简体中文), `it` (Italiano), `ja` (日本語)
- Each language sets its own `locale`, `params` (`footerHtml`, `description`, `homeTitle`), and menu items under `[[languages.XX.menu.header]]` (weight-based ordering)
- Translated content uses the `name.<lang>.md` convention (e.g. `faq.es.md`, `faq.zh.md`, `faq.it.md`, `faq.ja.md`); the unsuffixed file is English

### Content Structure
Content lives in `content/` as markdown files:
- `_index.md` - Homepage with app features and Google Play Store link
- `faq.md` - FAQ page for ADB setup and app functionality questions
- `privacy.md` - Privacy policy page
- `whats-new.md` - App release notes
- `posts/` - Blog posts (minimal usage)
- Each of the above (except `posts/`) has `.es.md`, `.zh.md`, `.it.md`, and `.ja.md` translations

### Content Editing
- Consult [PRODUCT.md](PRODUCT.md) for website audience, positioning, terminology, voice, translation guidance, and audience-specific copy decisions. The shared [Android product reference](../../android/lazulite-android/PRODUCT.md) remains the source of truth for app capabilities and shared product identity.
- Content markdown files support raw HTML (enabled via `markup.goldmark.renderer.unsafe = true` in `config.toml`) — `_index.md` is almost entirely raw HTML sections
- Style content with the theme's semantic classes (`btn btn-primary`, `btn-secondary`, `accent-text`, `section-title`, `feature-body`, `feature-list`, `panel`, `section-label`, `metric-row`, `badge-*`). Do not add inline `style=` attributes, hard-coded colours, or colour-named classes; add a class to the theme instead.
- New blog posts should be placed in `content/posts/` with draft front matter

### Design System
- [`DESIGN.md`](DESIGN.md) is the visual source of truth for the site: tokens, typography, components, and do's and don'ts. Read it before changing styles, markup, or media treatment, and keep it updated with any token or component change.
- The site mirrors the Android app's dark and light themes (`Color.kt`, `Theme.kt`, `Typography.kt` in `lazulite-android`). Change the app first, then mirror here. Product intent, terminology, and the shared visual language live in the Android [PRODUCT.md](../../android/lazulite-android/PRODUCT.md#visual-language).
- Default to System appearance, following browser preference with a 07:00–19:00 local-time light fallback when neither preference is exposed. App screenshots, cards, video, and posters follow the resolved website appearance. Capture refreshes require an explicit media request; use the theme-aware importer and preserve unselected appearances.

### Theme Architecture
The custom "lazulite" theme (based on "Nightfall"):
- **Layouts**: `themes/lazulite/layouts/` contains HTML templates
  - `baseof.html` - Base template with head/header/footer structure
  - `index.html` - Homepage layout
  - `_default/single.html` - Single page layout (FAQ, Privacy)
  - `partials/` - Reusable components (header, footer, social, `custom-head.html` for fonts/SEO tags)
- **Styles**: SCSS in `themes/lazulite/assets/sass/` with component-based organization
  - Design tokens (colors, spacing, radii, breakpoints, fonts) live in `utils/_variables.scss`
  - Shared UI components (buttons, panel, section label, metric row, badges, hero, sections, two-column) are in `components/_modern.scss`
  - Single-page (FAQ, privacy, what's new) styles are in `pages/_single.scss`; homepage layout styles are in `pages/_index.scss`
- **Fonts**: Sora (the app's brand face), self-hosted as woff2 in `themes/lazulite/static/fonts/Sora/` (weights 400/500/600/700, SIL OFL licence alongside) and declared in `utils/_fonts.scss`; the two body weights are preloaded in `partials/custom-head.html`. There are no third-party font requests. Sora has no CJK glyphs, so `html:lang(ja)` / `html:lang(zh)` select regional system stacks in `_global.scss`. Code uses the system monospace stack.
- **Design**: Dark and light palettes mirrored from Android, tonal surfaces and 1px hairlines, a single lapis accent, and the app's four-step signal ramp, with tight 2 to 10 px radii, no shadows, gradients, or glows. Palette values live in `utils/_variables.scss`; `_global.scss` exposes them as theme-aware CSS custom properties. Component SCSS aliases resolve at runtime; never hard-code a hex value in a component or content file. Components are in `components/_modern.scss` and the page stylesheets. See [`DESIGN.md`](DESIGN.md).

### Static Assets
- `static/images/` - App screenshots and Google Play badge
- Hugo copies `static/` contents directly to `public/` during build
- Refresh localized app images with `scripts/import-app-media.py` from original AASG PNGs, using lossy WebP at quality 90 with lossless transparency (`-q 90 -alpha_q 100`), at 2× CSS display width for Retina, capped at the original resolution. Preserve feathering and aspect ratios; never resize previously generated website images. Follow [the media refresh guide](docs/refresh-app-media.md) for targets, commands, and validation.
- `public/` and `resources/_gen/` are build artifacts; do not edit them directly
- `public-seo-check/` is a tracked snapshot of the Hugo build that CI diffs against a fresh build. Style, template, content, config, or font changes alter it: refresh it with `./scripts/seo-snapshot.sh --update` and commit the result.
- OpenGraph has an independent Android Hyperframes render and `scripts/import-opengraph-media.py`
  import. Follow `docs/refresh-opengraph-media.md`; a screenshot/video refresh must not regenerate
  the card. Its lossless 1200 × 630 PNG and `data/opengraph_media.json` are separate from app media.
