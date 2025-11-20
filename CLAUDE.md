# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for the Lazulite Android App, built with Hugo and deployed on Netlify. The site showcases an Android app that analyzes audio quality and Bluetooth transmission.

## Key Commands

### Build and Deploy
- `hugo` - Build static site (outputs to `public/`)
- `hugo server` - Start local dev server (http://localhost:1313)
- `hugo server -D` - Include draft content in dev server
- Netlify deploys automatically on push using Hugo 0.101.0 (configured in `netlify.toml`)

### Testing
- `cypress open` - Open Cypress test runner for e2e tests
- `cypress run` - Run Cypress tests headlessly
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

### Theme Architecture
The custom "lazulite" theme (based on "Nightfall"):
- **Layouts**: `themes/lazulite/layouts/` contains HTML templates
  - `baseof.html` - Base template with head/header/footer structure
  - `index.html` - Homepage layout
  - `_default/single.html` - Single page layout (FAQ, Privacy)
  - `partials/` - Reusable components (header, footer, social)
- **Styles**: SCSS in `themes/lazulite/assets/` with component-based organization
- **Fonts**: Custom OpenSans and FiraMono fonts in `static/`
- **Design**: Dark theme, responsive/mobile-first, optimized for app showcase

### Static Assets
- `static/images/` - App screenshots and Google Play badge
- Hugo copies `static/` contents directly to `public/` during build