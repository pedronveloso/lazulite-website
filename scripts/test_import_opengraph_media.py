import hashlib
import importlib.util
import json
from pathlib import Path
import struct
import tempfile
import unittest
import zlib

spec = importlib.util.spec_from_file_location(
    "opengraph_media", Path(__file__).with_name("import-opengraph-media.py")
)
media = importlib.util.module_from_spec(spec)
spec.loader.exec_module(media)


def png(width, height):
    def chunk(kind, data):
        return (struct.pack(">I", len(data)) + kind + data
                + struct.pack(">I", zlib.crc32(kind + data)))
    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress((b"\0" + b"\x0b\x10\x17" * width) * height))
            + chunk(b"IEND", b""))


class OpenGraphImportTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        root = Path(self.temporary.name)
        self.artifacts = root / "artifacts"
        self.site = root / "site"
        self.source = self.artifacts / media.MASTER
        self.source.parent.mkdir(parents=True)
        self.write_master()

    def write_master(self, width=1200, height=630):
        self.source.write_bytes(png(width, height))
        self.provenance = Path(f"{self.source}.provenance.json")
        self.provenance.write_text(json.dumps({
            "schema": 1, "format": "png", "locale": "en", "width": 1200, "height": 630,
            "outputSha256": hashlib.sha256(self.source.read_bytes()).hexdigest(),
        }))

    def test_import_preserves_png_and_is_independent_of_screenshots(self):
        screenshot = self.site / "static/images/app/en/home.webp"
        screenshot.parent.mkdir(parents=True)
        screenshot.write_bytes(b"existing screenshot")
        media.import_media(self.artifacts, self.site)
        output = self.site / "static/images/opengraph/lazulite.png"
        self.assertEqual(output.read_bytes(), self.source.read_bytes())
        self.assertEqual(screenshot.read_bytes(), b"existing screenshot")
        manifest = json.loads((self.site / "data/opengraph_media.json").read_text())
        self.assertEqual((manifest["width"], manifest["height"]), (1200, 630))
        self.assertTrue(manifest["src"].endswith(manifest["sha256"][:16]))
        self.assertFalse((self.site / "data/app_media.json").exists())

    def test_mismatched_provenance_preserves_previous_publication(self):
        media.import_media(self.artifacts, self.site)
        output = self.site / "static/images/opengraph/lazulite.png"
        manifest = self.site / "data/opengraph_media.json"
        before = (output.read_bytes(), manifest.read_bytes())
        self.source.write_bytes(png(1200, 630) + b"changed")
        with self.assertRaisesRegex(ValueError, "provenance"):
            media.import_media(self.artifacts, self.site)
        self.assertEqual(before, (output.read_bytes(), manifest.read_bytes()))

    def test_rejects_wrong_actual_dimensions_even_with_matching_hash(self):
        self.write_master(600, 315)
        with self.assertRaisesRegex(ValueError, "1200"):
            media.import_media(self.artifacts, self.site)
        self.assertFalse(self.site.exists())

    def test_requires_provenance(self):
        self.provenance.unlink()
        with self.assertRaises(FileNotFoundError):
            media.import_media(self.artifacts, self.site)
        self.assertFalse(self.site.exists())


if __name__ == "__main__":
    unittest.main()
