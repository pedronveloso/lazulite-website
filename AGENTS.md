# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, etc.) when working with code in this repository. `CLAUDE.md` is a symlink to this file.

## Project Overview

Static website for the Lazulite Android App, built with Hugo and deployed on Netlify. The site showcases an Android app that analyzes audio quality and Bluetooth transmission.

## Key Commands

### Build and Deploy
- `hugo` - Build static site (outputs to `public/`)
- `hugo server` - Start local dev server (http://localhost:1313)
- `hugo server -D` - Include draft content in dev server
- Netlify deploys automatically on push using Hugo 0.163.0 (configured in `netlify.toml`)

### Testing
- There is no automated test setup. `package.json` is empty and no Cypress/test config exists.

## Architecture

### Site Configuration
- **Base URL**: https://lazulite.app (production)
- **Theme**: Custom "lazulite" theme in `themes/lazulite/`
- **Config**: `config.toml` contains site settings, per-language menus, social links, and SEO params (`playStoreUrl`, `socialImage`, per-language `description`/`homeTitle`)
- **Contact**: lazuliteapp@gmail.com (configured in `config.toml`)

### Internationalization
The site is multilingual. Languages are defined under `[languages.*]` in `config.toml`:
- `en` (English, default), `es` (Español), `zh` (简体中文)
- Each language sets its own `locale`, `params` (`footerHtml`, `description`, `homeTitle`), and menu items under `[[languages.XX.menu.header]]` (weight-based ordering)
- Translated content uses the `name.<lang>.md` convention (e.g. `faq.es.md`, `faq.zh.md`); the unsuffixed file is English

### Content Structure
Content lives in `content/` as markdown files:
- `_index.md` - Homepage with app features and Google Play Store link
- `faq.md` - FAQ page for ADB setup and app functionality questions
- `privacy.md` - Privacy policy page
- `posts/` - Blog posts (minimal usage)
- Each of the above has `.es.md` and `.zh.md` translations

### Content Editing
- Content markdown files support raw HTML (enabled via `markup.goldmark.renderer.unsafe = true` in `config.toml`) — `_index.md` is almost entirely raw HTML sections
- New blog posts should be placed in `content/posts/` with draft front matter

### Theme Architecture
The custom "lazulite" theme (based on "Nightfall"):
- **Layouts**: `themes/lazulite/layouts/` contains HTML templates
  - `baseof.html` - Base template with head/header/footer structure
  - `index.html` - Homepage layout
  - `_default/single.html` - Single page layout (FAQ, Privacy)
  - `partials/` - Reusable components (header, footer, social, `custom-head.html` for fonts/SEO tags)
- **Styles**: SCSS in `themes/lazulite/assets/sass/` with component-based organization
  - Design tokens (colors, spacing, breakpoints, fonts) live in `utils/_variables.scss`
  - Modern UI components (buttons, cards, hero, feature grid, badges) are in `components/_modern.scss`
  - Homepage-specific layout styles are in `pages/_index.scss`
- **Fonts**: Barlow Condensed (display/headings) and Epilogue (body) loaded via Google Fonts in `partials/custom-head.html`; Fira Mono for code. (The old OpenSans/FiraMono files under `static/fonts/` are legacy/unused.)
- **Design**: Dark theme on deep cool slate (`#12131A` base), amber/gold accent (`#C49C3C`) with muted teal (`#3A9E8A`), responsive/mobile-first. The palette evokes precision audio instruments (VU meters, tube warmth) — no neon or gradient text. Old neon variable names (`$neon-cyan`, etc.) remain in `_variables.scss` only as legacy aliases remapped to the new palette.

### Static Assets
- `static/images/` - App screenshots and Google Play badge
- Hugo copies `static/` contents directly to `public/` during build
- `public/` and `resources/_gen/` are build artifacts; do not edit them directly
