# Source code for Lazulite Android App website

Website live at: https://lazulite.app

## Development

**Prerequisites:** Hugo extended v0.101.0+ (Netlify pins to 0.101.0; local newer versions work fine)

```bash
# Start local dev server with live reload
hugo server

# Include draft content
hugo server -D

# Production build (outputs to public/)
hugo

# Refresh the tracked SEO snapshot
./scripts/seo-snapshot.sh --update
```

The dev server runs at http://localhost:1313 by default.

The tracked `public-seo-check/` snapshot is checked against a fresh Hugo build in CI. Run the update
command above after changing site content, configuration, or assets.

## Link checking

[Lychee](https://github.com/lycheeverse/lychee) runs in CI on every push and PR. To run locally:

```bash
# Build first, then check
hugo && lychee --config .lychee.toml --root-dir "$(pwd)/public" --no-progress 'public/**/*.html'
```

Configuration lives in `.lychee.toml`. The CI workflow (`.github/workflows/link-check.yml`) also runs on a weekly schedule to catch external link rot.

## Deployment

Netlify deploys automatically on push to `main`. Hugo version and build command are configured in `netlify.toml`.
