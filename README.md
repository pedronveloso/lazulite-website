# Source code for Lazulite Android App website

Website live at: https://lazulite.app

## Development

**Prerequisites:** Hugo extended matching `HUGO_VERSION` in `netlify.toml` (currently 0.168.0).
Use the pinned version when refreshing the tracked SEO snapshot. Node.js and npm are also required
to bundle the self-hosted GSAP animation code.

```bash
# Install the pinned animation dependency before building
npm ci

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

## Google Ads measurement

The shared head includes Google Ads tag `AW-18521711197` on all HTML pages and
languages. It loads only in production builds on the hosts listed in
`params.analyticsDomains` in `config.toml`. Umami uses the same domain list;
missing or empty configuration fails the build. Local and Netlify preview visits
do not send measurements. Google Ads also stays unloaded when the browser sends
Global Privacy Control (`navigator.globalPrivacyControl === true`) or Do Not
Track (`navigator.doNotTrack === '1'`). Umami retains its existing DNT behavior.
Consent Mode keeps advertising storage, analytics storage, advertising user
data, and ad personalization denied, with ads data redaction enabled. This uses
Google's cookieless measurement requests; there is no consent banner or opt-in
path that enables advertising cookies.

This installs the base tag. Tracking a specific conversion, such as a Google
Play link click, also requires configuring that conversion in Google Ads and
using its supplied event snippet and conversion label where applicable. A Play
Store link click is a download intent, not a verified app installation.

## Refresh app screenshots and video

Follow [Refresh the localized app media](docs/refresh-app-media.md) to capture all five languages
with AASG, import dark-mode gesture-navigation media, and validate the website before publication.

## Refresh the OpenGraph image

Follow [Refresh the OpenGraph image](docs/refresh-opengraph-media.md) for the separate Android
Hyperframes render and `scripts/import-opengraph-media.py` import. Screenshot and video refreshes
leave this 1200 × 630 card unchanged.

## Captured-device catalog

`static/data/captured-devices.json` is published at
<https://lazulite.app/data/captured-devices.json>. It records phones and tablets
with a reviewed Lazulite v2 diagnostic capture, not a compatibility guarantee.
The initial entries come from the diagnostic-summary headers of the Android
repository's current-format debug assets.

After manually reviewing a private submission, add its `manufacturer`, `model`,
and numeric Android major version (`androidMajor`) to `devices`. Copy the values
from the export header, not the filename or receiver name. Keep entries sorted
by manufacturer/model (case-insensitive), then Android version, with no duplicate
combinations. Keep `schemaVersion: 1` and `payloadFormatVersion: 2`.

Only this metadata is public. Do not add submitted logs, addresses, destination
names, playback details, or contributor identifiers to this repository or public
Android fixtures. Uploading a capture does not automatically update the catalog.
Publish the catalog before releasing the Android invitation feature.

Validate with `node --test scripts/test-captured-devices.mjs`, then refresh the
tracked output using `./scripts/seo-snapshot.sh --update`.
