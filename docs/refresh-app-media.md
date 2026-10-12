# Refresh the localized app media

This flow does not regenerate or import the OpenGraph sharing card. Use the separate
[OpenGraph refresh guide](refresh-opengraph-media.md) when that asset is requested.

Use this guide when Lazulite's appearance changes and the website needs fresh screenshots or
video. Capture the real debug app with AASG; do not redraw, manually crop, or edit screenshots.
The Android repository's `aasg.yaml` and capture instrumentation define the journeys and effects.

## Required result

Every website language gets its own **dark-mode, gesture-navigation** assets:

| Website section | Capture ID | Published rendition |
| --- | --- | --- |
| Real-Time Audio Analysis | `home` | Pixel 8-framed screenshot |
| Bluetooth Glitch or Bad Connection? | `playback-health` | Transparent, feathered Playback health card |
| Smart Suggestions | `setup-tips-high-resolution` | Transparent, feathered setup card |
| See It In Action | `website-demo` | Hyperframes glass cues, Pixel 8 frame, half-resolution MP4 and matching poster |

The website languages `en`, `es`, `it`, and `ja` match AASG's locale IDs. Website `zh` maps to
AASG `zh-CN` (Simplified Chinese). Never use English captures as substitutes for another language.

`playback-health` follows the complete `store-3` journey: select **Pixel 8a multiple issues**,
hide the debug icon, refresh once, reveal the issues, expand Destination Supported Codecs, and
scroll to the bottom. Both audio underruns and outgoing buffer drops must be fully visible.
The instrumentation publishes the actual card bounds as the `playback-health` region. AASG crops
with 10 px padding and feathers 10 px to transparency, matching the setup card's treatment.
Do not alter fixtures, counters, expiry, or attribution safeguards to manufacture the image.

`website-demo` selects `pixel_8a__xm4__ldac.txt`, hides the debug icon, and records the complete
Home walkthrough: align Source, hold two seconds, expand Supported Codecs, align Destination,
open and swipe-dismiss Learn more, then scroll to the bottom. The local Hyperframes workspace
adds synchronized lapis-glass cues and the Hazel Pixel 8 frame at 30 fps / CRF 18. The full journey
is retained. The old `home-video` capture remains available independently, outside the website group.

## Prerequisites

- Android and website repositories checked out, with unrelated changes preserved.
- The Android repository's supported JDK, Android SDK, and Gradle wrapper.
- AASG 0.16.0+ supporting schema 10.
- `adb`, `ffmpeg`, `ffprobe`, `cwebp`, Python 3.9+, Node.js 22+ (for local Hyperframes and playback tests), a local Chrome/Chromium browser, and Hugo extended. Match Hugo to the version
  pinned in the website's `netlify.toml` and CI when refreshing the tracked snapshot.
- A dedicated API 33+ Android device or emulator, ADB-authorized and capable of gesture navigation.
  Runs install the debug app and test APK, grant diagnostic permissions, complete onboarding,
  and change app state. Do not run against a personal device.

AASG downloads and caches device-frame artwork on demand using the existing explicit configuration
opt-in. See the Android README for the upstream frame licensing note.

## Capture

Run from the Android repository. Identify the dedicated target with `adb devices -l`, then:

```bash
aasg doctor
aasg capture website --device <serial> --locale all --theme dark --navigation gestural --non-interactive --dry-run
aasg capture website --device <serial> --locale all --theme dark --navigation gestural --non-interactive
```

The dry run must list 20 capture variants: four captures in each of five locales. The real run
must finish with 20 successes and no failures. AASG uses the app's theme setting and manages device
navigation; the two card captures explicitly require gesture navigation even outside this group.
Do not trust the interactive picker's remembered appearance or locale choices.

Expected inputs to the website importer, with `<locale>` from `en`, `es`, `it`, `zh-CN`, `ja`:

```text
artifacts/screenshots/framed/<locale>/home-dark-gestural.png
artifacts/screenshots/cards/<locale>/playback-health-dark-gestural.png
artifacts/screenshots/cards/<locale>/setup-tips-high-resolution-dark-gestural.png
artifacts/videos/hyperframes/<locale>/website-demo-dark-gestural.mp4
```

Raw media, card-region metadata, and per-run reports remain in the Android repository's ignored
`artifacts/` tree. Check the latest report under `artifacts/aasg/runs/` to distinguish successful
new outputs from files retained from an older run.

## Render the localized website masters

After capture succeeds, use the Android repository's `tools/video/` workspace. Install its
pinned dependencies locally with `npm ci`; do not install skills or dependencies globally.
Use the successful capture run's ID, not a dry run or an unrelated latest run:

```bash
cd ../../android/lazulite-android/tools/video
npm ci
npm test
capture_run=<successful-run-id>
for locale in en es it zh-CN ja; do
  npm run render -- --locale "$locale" --theme dark --metadata "../../artifacts/aasg/runs/$capture_run/staging/website-demo/gestural/$locale/dark/metadata/website-demo-dark.metadata.json" || break
done
```

Set `AASG_BIN` and `HYPERFRAMES_BROWSER_PATH` if needed; see the
[authoring workspace guide](../../../android/lazulite-android/tools/video/README.md).
Every render must succeed. The renderer checks that each sidecar matches the raw capture,
validates the composition, and fully decodes the pending master before replacing an older one.
Full-resolution raw, native-framed, and Hyperframes masters remain in the Android artifacts.
For a video-only refresh, capture `website-demo --locale all --theme dark --non-interactive`
and retain the existing screenshot inputs.

## Import and integrate

From the website repository, import the successful capture set:

```bash
python3 scripts/import-app-media.py --artifact-root ../../android/lazulite-android/artifacts
```

Supply the actual artifact directory if the checkouts have a different arrangement. The importer
validates all 20 inputs and stages every conversion before replacing website files. It creates:

- `static/images/app/<language>/home.webp`, `playback-health.webp`, `setup-tips.webp`, and
  `home-video-poster.webp` (quality-90 lossy WebP with lossless transparency, at Retina sizing,
  capped at source resolution).
- `static/videos/app/<language>/home.mp4` (the localized Hyperframes master resized to half width
  and height with Lanczos, rounded down to even dimensions, encoded as silent H.264/yuv420p,
  30 fps, CRF 18, with faststart). Current 1268×2668 masters become 634×1334 copies.
- `data/app_media.json` (language-specific paths, content hashes, and the resized media dimensions).

Posters come from the resized videos and use the same Retina sizing and encoding as screenshots.
Their dimensions are stored separately as `posterWidth` and `posterHeight`; video `width` and
`height` continue to describe the MP4. The importer never resizes or replaces the full-resolution
Android masters. A full import requires a Hyperframes video for every locale; there is no fallback
to the old Home video, native cues, or another language.

### Image dimensions and network optimization

Hugo copies these `static/` images directly; the shortcode does not use Hugo image processing or
`srcset`. CSS display sizing alone does not reduce downloaded bytes. The importer uses `cwebp`
to resize the screenshots from their original PNG captures before encoding. **Lossy WebP at quality
90 with lossless transparency is the default for every app image, including posters**. Retina sizing
retains enough pixels for small text while lossy color compression reduces network transfer size.
It preserves aspect ratios and feathered transparency, never enlarges a smaller source,
and updates manifest dimensions and content hashes. Always regenerate from originals, never from
previously generated website WebPs.

The reference desktop targets are **360 px** for framed Home, **520 px** for Playback health,
**420 px** for Smart Suggestions, and **360 px** for posters. For one displayed pixel on a 2× Retina
screen, supply two image pixels: **output width = min(display width × 2, original width)**.
The file targets are therefore **720, 1040, 840, and 720 px**, respectively, before the source cap.
This is one Retina-ready file per asset, with no additional `srcset` variants. Layout stays responsive:
smaller viewports use smaller display
widths, and the Playback health card can reach its CSS cap of 560 px in the single-column layout.
When the layout changes, review `IMAGE_WIDTHS`, `POSTER_WIDTH`, and `IMAGE_PIXEL_RATIO` in the importer
and this table. Higher-density screens may still scale beyond the available pixels; do not upscale
an original to compensate.

The importer invokes `cwebp -q 90 -alpha_q 100 -m 6 -resize <output-width> 0`.
The zero height keeps the aspect ratio. `-q 90` applies lossy compression to colors;
`-alpha_q 100` preserves the resized transparency channel losslessly, including feathered edges.
Resizing itself changes pixel values; the lossless guarantee applies to encoding the alpha after
resizing. Do not add `-lossless` or treat quality 100 as equivalent to lossless color encoding.
A poster extracted from an MP4 retains the video's existing compression and resolution limits.

Reference sizes from the October 12, 2026 refresh, as width × height. Original and website-file
sizes are image pixels. Display sizes are rounded CSS pixels measured at **1440 px desktop** and
**390 px mobile** viewport widths; heights can vary by a pixel because of rounding and borders.
Card heights vary with translated text. Framed screenshots and cropped cards are AASG renditions,
so their dimensions differ from the raw device screen.

| Asset | Language | Original AASG rendition | Website file | Desktop display | Mobile display |
| --- | --- | --- | --- | --- | --- |
| Home, with device frame | All five | 1267 × 2667 | 720 × 1516 | 360 × 758 | 311 × 655 |
| Playback health card | English | 1016 × 555 | 1016 × 555 | 520 × 284 | 311 × 170 |
| Playback health card | Spanish | 1016 × 727 | 1016 × 727 | 520 × 372 | 311 × 223 |
| Playback health card | Italian | 1016 × 603 | 1016 × 603 | 520 × 309 | 311 × 185 |
| Playback health card | Chinese, Japanese | 1016 × 560 | 1016 × 560 | 520 × 287 | 311 × 171 |
| Smart Suggestions card | English, Spanish, Italian | 1016 × 551 | 840 × 456 | 420 × 229 | 311 × 170 |
| Smart Suggestions card | Chinese | 1016 × 514 | 840 × 425 | 420 × 213 | 311 × 158 |
| Smart Suggestions card | Japanese | 1016 × 562 | 840 × 465 | 420 × 233 | 311 × 173 |
| Video poster | All five | 634 × 1334 extracted frame | 634 × 1334 | 360 × 757 | 311 × 654 |
| Video | All five | 1268 × 2668 master | 634 × 1334 | 360 × 757 | 311 × 654 |

To resize or refresh images without re-encoding or replacing any website video, run:

```bash
python3 scripts/import-app-media.py --artifact-root ../../android/lazulite-android/artifacts --images-only
```

This mode validates all 15 PNG captures and the five existing `static/videos/app/<language>/home.mp4`
files before conversion. It regenerates the screenshots and posters, then updates the manifest;
MP4 bytes and video URLs stay unchanged. It does not require the Hyperframes masters. Missing or
invalid inputs and conversion failures leave the published files unchanged. Use the normal import
command when refreshing videos too.

Measure file sizes again after future captures. Keep the Retina pixel dimensions when optimizing
compression; reducing to 1× CSS dimensions makes text softer on high-density displays.
The October 12, 2026 quality-90 Retina set totals **887,708 bytes** across 20 images, down from
1,813,620 bytes for the same dimensions encoded losslessly (51.1% smaller).

The `app-media` Hugo shortcode selects assets using the page language and role. The four homepage
roles are `home`, `playback-health`, `setup-tips`, and `home-video`. The manifest adds content hashes to asset URLs to invalidate the site's immutable image cache.
Stable filenames mean ordinary
refreshes require no homepage edits. If the UI meaning changes, revise translated descriptions too.

The video is muted, looping, inline, and has native playback controls. It loads when visible and
plays automatically only when reduced motion is disabled. Reduced motion and no-JavaScript
visitors see the corresponding poster. Retain controls so visitors can pause playback.

Captured cards and framed phones provide their own edges: do not add website borders or rounding
that hide feathering or duplicate the device frame. Preserve aspect ratios and check mobile layout.
Keep shared logos, download badges, and the existing social-preview image intact.

## Validate and hand off

1. Inspect all localized Home images, both cards, and video posters. Confirm the correct language,
   dark theme, gesture navigation on full screens, hidden debug icon, readable text, complete cards,
   both Playback health issue rows, and feathered transparency.
2. Play all five videos; verify the frame, language, silent audio, duration, looping and pause controls.
3. Build the website, update its tracked snapshot, and check it:

   ```bash
   hugo --minify
   ./scripts/seo-snapshot.sh --update
   ./scripts/seo-snapshot.sh
   python3 -m unittest discover -s scripts -p 'test_*.py'
   node --test scripts/test-app-media.mjs
   lychee --config .lychee.toml --root-dir "$(pwd)/public" \
     --remap "https://lazulite[.]app/(.*) file://$(pwd)/public/\$1" \
     --no-progress 'public/**/*.html'
   ```

4. Preview `/`, `/es/`, `/it/`, `/zh/`, and `/ja/` at desktop and mobile widths. Check media selection
   after language switching, video controls, reduced-motion preference changes, and poster fallback.
5. If capture code changed, run `./gradlew spotlessApply`, the Android CI validation command from
   `AGENTS.md`, and the focused `CaptureCompositionTest` on the dedicated device. Do not generate
   baseline profiles or run macrobenchmarks for a media refresh.
6. Review diffs in both repositories. Leave changes uncommitted unless explicitly asked to commit.
   Publication follows the normal reviewed website deployment process; importing media does not deploy.

Keep copy faithful to the app: Playback health shows recent Android-reported evidence, with device-
dependent coverage. It does not measure wireless packet loss, identify Wi-Fi interference, prove a
cause, or establish an audible interruption. Observations update on refresh. Consult the Android
`PRODUCT.md` for terminology and translation guidance.

## Partial failures

If capture fails, inspect its run report and fix the failing journey or environment before importing.
Rerun only the failing capture IDs with the same locale/theme/navigation settings; omit
`--navigation` when selecting only the fixed-gestural card captures. Confirm that every input now
belongs to the intended refresh; file existence alone cannot prove freshness.

Missing, empty, or undecodable input and conversion failures stop the importer before it replaces
website assets. Fix the input and rerun the import. An interrupted installation or filesystem error
can leave some stable assets replaced; rerun the complete import to restore a consistent set, then
rebuild and refresh the snapshot. Do not hand-edit generated files under `public/` or the snapshot.
