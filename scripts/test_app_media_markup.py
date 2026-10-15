"""Verify the published localized markup and immutable media references together."""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import unittest
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent


class MediaMarkup(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.sources = []
        self.videos = []
        self.feed(html)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "source" and "data-theme" in attrs:
            self.sources.append(attrs)
        if tag == "video" and "data-app-video" in attrs:
            self.videos.append(attrs)


class AppMediaMarkupTest(unittest.TestCase):
    def test_every_language_publishes_both_themes_and_native_picture_fallbacks(self):
        manifest = json.loads((ROOT / "data/app_media.json").read_text())
        for lang, appearances in manifest.items():
            with self.subTest(language=lang):
                self.assertEqual(set(appearances), {"light", "dark"})
                page = ROOT / "public-seo-check" / ("" if lang == "en" else lang) / "index.html"
                markup = MediaMarkup(page.read_text())
                self.assertEqual(len(markup.sources), 8)
                self.assertEqual(len(markup.videos), 1)
                video = markup.videos[0]
                self.assertNotIn("src", video, "video must wait for visibility and motion checks")
                self.assertEqual(video["preload"], "none")
                for theme, roles in appearances.items():
                    expected = {entry["poster"] if role == "home-video" else entry["src"]
                                for role, entry in roles.items()}
                    sources = [entry for entry in markup.sources if entry["data-theme"] == theme]
                    self.assertEqual({entry["srcset"] for entry in sources}, expected)
                    if theme == "light":
                        self.assertTrue(all(entry["media"] == "(prefers-color-scheme: light)"
                                            for entry in sources))
                    else:
                        self.assertTrue(all("media" not in entry for entry in sources))
                    self.assertEqual(json.loads(video[f"data-{theme}"]), roles["home-video"])
                    for entry in roles.values():
                        for field in ("src", "poster"):
                            if field not in entry:
                                continue
                            url = urlsplit(entry[field])
                            asset = ROOT / "static" / url.path.lstrip("/")
                            self.assertTrue(asset.is_file(), str(asset))
                            digest = hashlib.sha256(asset.read_bytes()).hexdigest()[:16]
                            self.assertEqual(url.query, f"v={digest}")


if __name__ == "__main__":
    unittest.main()
