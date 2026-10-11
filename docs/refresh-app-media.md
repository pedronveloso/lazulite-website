# Refresh the localized app media

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
| See It In Action | `home-video` | Pixel 8-framed MP4 and matching first-frame poster |

The website languages `en`, `es`, `it`, and `ja` match AASG's locale IDs. Website `zh` maps to
AASG `zh-CN` (Simplified Chinese). Never use English captures as substitutes for another language.

`playback-health` follows the complete `store-3` journey: select **Pixel 8a multiple issues**,
hide the debug icon, refresh once, reveal the issues, expand Destination Supported Codecs, and
scroll to the bottom. Both audio underruns and outgoing buffer drops must be fully visible.
The instrumentation publishes the actual card bounds as the `playback-health` region. AASG crops
with 10 px padding and feathers 10 px to transparency, matching the setup card's treatment.
Do not alter fixtures, counters, expiry, or attribution safeguards to manufacture the image.

`home-video` uses the S20 / XM4 LDAC fixture and the existing Pixel 8 video pipeline: silent,
1.5 seconds, 30 fps. It is a Home recording, not the separate Source Supported Codecs journey.

## Prerequisites

- Android and website repositories checked out, with unrelated changes preserved.
- The Android repository's supported JDK, Android SDK, and Gradle wrapper.
- AASG CLI supporting schema 9 (this workflow was verified with 0.15.0).
- `adb`, `ffmpeg`, `ffprobe`, `cwebp`, Python 3.9+, Node.js (for playback tests), and Hugo extended. Match Hugo to the version
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
artifacts/videos/framed/<locale>/home-video-dark-gestural.mp4
```

Raw media, card-region metadata, and per-run reports remain in the Android repository's ignored
`artifacts/` tree. Check the latest report under `artifacts/aasg/runs/` to distinguish successful
new outputs from files retained from an older run.

## Import and integrate

From the website repository, import the successful capture set:

```bash
python3 scripts/import-app-media.py --artifact-root ../../android/lazulite-android/artifacts
```

Supply the actual artifact directory if the checkouts have a different arrangement. The importer
validates all 20 inputs and stages every conversion before replacing website files. It creates:

- `static/images/app/<language>/home.webp`, `playback-health.webp`, `setup-tips.webp`, and
  `home-video-poster.webp` (quality 90 WebP with preserved image transparency).
- `static/videos/app/<language>/home.mp4` (AASG's framed video, stream-copied with faststart).
- `data/app_media.json` (language-specific paths and real media dimensions).

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
