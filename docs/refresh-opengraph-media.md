# Refresh the OpenGraph image

The social sharing card has a separate flow from website screenshots and the app demo video.
Do not regenerate it as part of `import-app-media.py`, the AASG `website` capture group, or a
general screenshot refresh.

The Android repository owns the composition, photographic plate, real app/LDAC logos, local
Sora fonts, and Hyperframes render. Follow the complete
[OpenGraph production guide](../../../android/lazulite-android/docs/opengraph-media.md).
Cross-repository links and commands assume sibling checkouts at `dev/web/lazulite-website`
and `dev/android/lazulite-android`.

From the Android repository:

```shell
cd tools/video
npm ci
npm run render:opengraph
```

From this website repository:

```shell
python3 scripts/import-opengraph-media.py --artifact-root ../../android/lazulite-android/artifacts
python3 -m unittest discover -s scripts -p 'test_import_opengraph_media.py'
python3 -m unittest discover -s scripts -p 'test_opengraph_metadata.py'
./scripts/seo-snapshot.sh --update
./scripts/seo-snapshot.sh
```

The snapshot script builds Hugo into a temporary directory itself; a separate `hugo` build is
unnecessary for this workflow. Metadata tests require Python 3.11+ and the website's pinned
Hugo extended release.

The importer requires `artifacts/images/opengraph/en/lazulite.png` and its matching
`.provenance.json` sidecar. It fully decodes and validates the exact 1200 × 630 PNG before
copying it byte-for-byte into `static/images/opengraph/lazulite.png`. It creates
`data/opengraph_media.json`, whose content hash updates the immutable-cache URL.

The head template uses this manifest for OpenGraph and Twitter image URLs, MIME type, dimensions,
and the SoftwareApplication image. The artwork is one English campaign card shared across site
languages, independent of their localized app captures. Both image alt tags use the page locale's
`opengraph_image_alt` translation, with the manifest's English description as fallback. These
descriptions refer to the shared image and stay consistent across pages within each locale.
Verify the image and metadata before publishing. Importing does not deploy.
