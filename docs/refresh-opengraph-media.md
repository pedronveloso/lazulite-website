# Refresh the OpenGraph image

The social sharing card has a separate flow from website screenshots and the app demo video.
Do not regenerate it as part of `import-app-media.py`, the AASG `website` capture group, or a
general screenshot refresh.

The Android repository owns the composition, photographic plate, real app/LDAC logos, local
Sora fonts, and Hyperframes render. Follow the complete
[OpenGraph production guide](../../../android/lazulite-android/docs/opengraph-media.md).

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
hugo
./scripts/seo-snapshot.sh --update
./scripts/seo-snapshot.sh
```

The importer requires `artifacts/images/opengraph/en/lazulite.png` and its matching
`.provenance.json` sidecar. It fully decodes and validates the exact 1200 × 630 PNG before
copying it byte-for-byte into `static/images/opengraph/lazulite.png`. It creates
`data/opengraph_media.json`, whose content hash updates the immutable-cache URL.

The head template uses this manifest for OpenGraph and Twitter image URLs, dimensions, alt
text, and the SoftwareApplication image. This is one English campaign card shared across site
languages, independent of their localized app captures. Verify the image and metadata before
publishing. Importing does not deploy.
