# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for the Lazulite Android App, built with Hugo and deployed on Netlify. The site showcases an Android app that analyzes audio quality and Bluetooth transmission.

## Key Commands

### Build and Deploy
- `hugo` - Build static site (outputs to `public/`)
- `hugo server` - Start local dev server (http://localhost:1313)
- `hugo server -D` - Include draft content in dev server
- Netlify deploys automatically on push using Hugo 0.160.1 (configured in `netlify.toml`)

### Testing
- `cypress open` - Open Cypress test runner for e2e tests (requires `hugo server` running on port 8888)
- `cypress run` - Run Cypress tests headlessly
- Tests go in `cypress/e2e/` (no tests exist yet; directory must be created)
- Tests configured in `cypress.config.js` with baseUrl `http://localhost:8888`

## Architecture

### Site Configuration
- **Base URL**: https://lazulite.app (production)
- **Theme**: Custom "lazulite" theme in `themes/lazulite/`
- **Config**: `config.toml` contains site settings, menu items (Privacy Policy, FAQ), and social links
- **Contact**: lazulite.app@example.com (configured in `config.toml`)

### Content Structure
Content lives in `content/` as markdown files:
- `_index.md` - Homepage with app features and Google Play Store link
- `faq.md` - FAQ page for ADB setup and app functionality questions
- `privacy.md` - Privacy policy page
- `posts/` - Blog posts (minimal usage)

Menu items are defined in `config.toml` under `[menu.header]` with weight-based ordering.

### Content Editing
- Content markdown files support raw HTML (enabled via `markup.goldmark.renderer.unsafe = true` in `config.toml`) — `_index.md` is almost entirely raw HTML sections
- New blog posts should be placed in `content/posts/` with draft front matter

### Theme Architecture
The custom "lazulite" theme (based on "Nightfall"):
- **Layouts**: `themes/lazulite/layouts/` contains HTML templates
  - `baseof.html` - Base template with head/header/footer structure
  - `index.html` - Homepage layout
  - `_default/single.html` - Single page layout (FAQ, Privacy)
  - `partials/` - Reusable components (header, footer, social)
- **Styles**: SCSS in `themes/lazulite/assets/sass/` with component-based organization
  - Design tokens (colors, spacing, breakpoints, fonts) live in `utils/_variables.scss`
  - Modern UI components (buttons, cards, hero, feature grid, badges) are in `components/_modern.scss`
  - Homepage-specific layout styles are in `pages/_index.scss`
- **Fonts**: OpenSans (body) and FiraMono (headings/code) in `themes/lazulite/static/fonts/`
- **Design**: Dark theme (`#282634` background), neon accent palette (cyan `#00F5FF`, purple `#BF40FF`, blue `#5B9FFF`), responsive/mobile-first

### Static Assets
- `static/images/` - App screenshots and Google Play badge
- Hugo copies `static/` contents directly to `public/` during build
- `public/` and `resources/_gen/` are build artifacts; do not edit them directly
