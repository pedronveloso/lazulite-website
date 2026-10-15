"""Exercise the production head partial in isolated, multilingual Hugo builds."""

from html.parser import HTMLParser
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import tomllib
import unittest


SITE_ROOT = Path(__file__).resolve().parent.parent
LANGUAGES = ("en", "es", "zh", "it", "ja")


class Metadata(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = {}
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        if tag == "meta":
            attrs = dict(attrs)
            key = attrs.get("property", attrs.get("name"))
            if key:
                self.tags[key] = attrs.get("content")


class OpenGraphMetadataTest(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.site = Path(temporary.name)
        self.config = {
            "baseURL": "https://lazulite.app/",
            "title": "Lazulite",
            "defaultContentLanguage": "en",
            "disableKinds": ["taxonomy", "term", "rss", "sitemap", "404"],
            "languages": {lang: {"weight": index + 1}
                          for index, lang in enumerate(LANGUAGES)},
            "params": {"socialImage": "/images/fallback.png",
                       "socialImageWidth": 1200, "socialImageHeight": 630},
        }
        self.manifest = json.loads((SITE_ROOT / "data/opengraph_media.json").read_text())
        partials = self.site / "layouts/partials"
        partials.mkdir(parents=True)
        shutil.copyfile(SITE_ROOT / "themes/lazulite/layouts/partials/head.html",
                        partials / "head.html")
        # Only unrelated style/font rendering is stubbed; metadata uses the real partial.
        (partials / "custom-head.html").write_text("")
        styles = self.site / "assets/sass"
        styles.mkdir(parents=True)
        (styles / "main.scss").write_text("body { margin: 0; }\n")
        core = self.site / "assets/js"
        core.mkdir()
        shutil.copyfile(SITE_ROOT / "themes/lazulite/assets/js/theme-core.js", core / "theme-core.js")
        layout = '<html><head>{{ partial "head.html" . }}</head><body></body></html>'
        (self.site / "layouts/index.html").write_text(layout)
        defaults = self.site / "layouts/_default"
        defaults.mkdir()
        (defaults / "single.html").write_text(layout)
        catalogs = self.site / "i18n"
        catalogs.mkdir()
        content = self.site / "content"
        content.mkdir()
        self.translations = {}
        for lang in LANGUAGES:
            catalog = SITE_ROOT / f"themes/lazulite/i18n/{lang}.toml"
            shutil.copyfile(catalog, catalogs / catalog.name)
            self.translations[lang] = tomllib.loads(catalog.read_text())["opengraph_image_alt"]["other"]
            suffix = "" if lang == "en" else f".{lang}"
            (content / f"_index{suffix}.md").write_text('+++\ntitle = "Home"\n+++\n')
            (content / f"example{suffix}.md").write_text('+++\ntitle = "Example page"\n+++\n')

    def build(self):
        (self.site / "hugo.json").write_text(json.dumps(self.config))
        data = self.site / "data"
        data.mkdir(exist_ok=True)
        manifest = data / "opengraph_media.json"
        if self.manifest is None:
            manifest.unlink(missing_ok=True)
        else:
            manifest.write_text(json.dumps(self.manifest))
        result = subprocess.run([
            "hugo", "--source", str(self.site), "--destination", str(self.site / "public"),
        ], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def metadata(self, lang="en", page=""):
        prefix = "" if lang == "en" else f"{lang}/"
        path = self.site / "public" / prefix / page / "index.html"
        return Metadata(path.read_text()).tags

    def test_theme_startup_is_inline_before_styles_and_menu_wiring_is_deferred(self):
        self.build()
        html = (self.site / "public/index.html").read_text()
        self.assertIn("LazuliteTheme", html)
        self.assertLess(html.index("LazuliteTheme"), html.index('rel="stylesheet"'))
        self.assertIn('<script src="/js/theme.js" defer></script>', html)
        self.assertNotIn('<script src="/js/theme.js"></script>', html)
        self.assertIn('media="(prefers-color-scheme: dark)"', html)
        self.assertIn('media="(prefers-color-scheme: light)"', html)
        self.assertEqual(html.count('name="theme-color"'), 2)

    def test_manifest_type_is_authoritative_for_versioned_urls(self):
        for source in ("/images/card.webp?v=abc123", "/images/card.png?v=abc123"):
            with self.subTest(source=source):
                # Even a misleading extension must not override the declared type.
                self.manifest.update(src=source, type="image/webp")
                self.build()
                self.assertEqual(self.metadata()["og:image:type"], "image/webp")

    def test_configured_fallback_uses_url_path_for_type(self):
        self.manifest = None
        for extension, mime in (("webp", "image/webp"), ("jpg", "image/jpeg"),
                                ("jpeg", "image/jpeg"), ("svg", "image/svg+xml"),
                                ("png", "image/png")):
            with self.subTest(extension=extension):
                source = f"/images/fallback.{extension}?v=abc123#preview"
                self.config["params"]["socialImage"] = source
                self.build()
                tags = self.metadata()
                self.assertEqual(tags["og:image:type"], mime)
                self.assertEqual(tags["og:image"], f"https://lazulite.app{source}")

    def test_localized_alt_and_shared_image_metadata_across_pages(self):
        self.build()
        self.assertEqual(len(set(self.translations.values())), len(LANGUAGES))
        for lang in LANGUAGES:
            for page in ("", "example"):
                with self.subTest(lang=lang, page=page):
                    tags = self.metadata(lang, page)
                    self.assertEqual(tags["og:image:alt"], self.translations[lang])
                    self.assertEqual(tags["twitter:image:alt"], self.translations[lang])
                    expected_url = f'https://lazulite.app{self.manifest["src"]}'
                    self.assertEqual(tags["og:image"], expected_url)
                    self.assertEqual(tags["twitter:image"], expected_url)
                    self.assertEqual(tags["og:image:type"], "image/png")
                    self.assertEqual(tags["og:image:width"], "1200")
                    self.assertEqual(tags["og:image:height"], "630")

    def test_manifest_alt_is_used_when_translation_is_unavailable(self):
        for catalog in (self.site / "i18n").glob("*.toml"):
            catalog.write_text("")
        self.manifest["alt"] = "English fallback description."
        self.build()
        for lang in LANGUAGES:
            with self.subTest(lang=lang):
                tags = self.metadata(lang)
                self.assertEqual(tags["og:image:alt"], self.manifest["alt"])
                self.assertEqual(tags["twitter:image:alt"], self.manifest["alt"])


if __name__ == "__main__":
    unittest.main()
