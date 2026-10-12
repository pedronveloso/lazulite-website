# Source code for Lazulite Android App website

Website live at: https://lazulite.app

## Development

**Prerequisites:** Hugo extended matching `HUGO_VERSION` in `netlify.toml` (currently 0.166.0).
Use the pinned version when refreshing the tracked SEO snapshot.

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
hugo && lychee --config .lychee.toml --root-dir "$(pwd)/public" \
  --remap "https://lazulite[.]app/(.*) file://$(pwd)/public/\$1" \
  --no-progress 'public/**/*.html'
```

The remap checks links to lazulite.app against the generated build, including pages that have not
been deployed yet. External links are still checked online.

Configuration lives in `.lychee.toml`. The CI workflow (`.github/workflows/link-check.yml`) also runs on a weekly schedule to catch external link rot.

## Deployment

Netlify deploys automatically on push to `main`. Hugo version and build command are configured in `netlify.toml`.

## Refresh app screenshots and video

Follow [Refresh the localized app media](docs/refresh-app-media.md) to capture all five languages
with AASG, import dark-mode gesture-navigation media, and validate the website before publication.
