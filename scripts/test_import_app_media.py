"""Failure safety checks for the media importer; no Android device needed."""
import importlib.util
from pathlib import Path
import tempfile
import shutil
import subprocess
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location(
    "import_app_media", Path(__file__).with_name("import-app-media.py")
)
media = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(media)


class ImportFailureTest(unittest.TestCase):
    def test_missing_input_leaves_existing_assets_and_manifest_unchanged(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            marker = root / "data" / "app_media.json"
            marker.parent.mkdir()
            marker.write_text("existing manifest")
            with patch.object(media, "SITE_ROOT", root):
                with self.assertRaisesRegex(ValueError, "Missing or empty"):
                    media.import_media(root / "missing")
            self.assertEqual(marker.read_text(), "existing manifest")
            self.assertFalse((root / "static").exists())

    def test_corrupt_last_input_leaves_earlier_assets_unchanged(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            marker = root / "static" / "images" / "app" / "en" / "home.webp"
            marker.parent.mkdir(parents=True)
            marker.write_bytes(b"existing image")
            calls = []

            def reject_last(path):
                calls.append(path)
                if len(calls) == 20:
                    raise ValueError("Corrupt last video")
                return {"width": 100, "height": 200}

            with patch.object(media, "SITE_ROOT", root), patch.object(media, "validate", reject_last):
                with self.assertRaisesRegex(ValueError, "Corrupt last video"):
                    media.import_media(root / "captures")
            self.assertEqual(marker.read_bytes(), b"existing image")
            self.assertFalse((root / "data").exists())

    @unittest.skipUnless(shutil.which("ffprobe") and shutil.which("ffmpeg"), "Media tools required")
    def test_real_decoder_rejects_corrupt_image(self):
        with tempfile.TemporaryDirectory() as folder:
            corrupt = Path(folder) / "corrupt.png"
            corrupt.write_bytes(b"not a PNG file")
            with self.assertRaises((ValueError, subprocess.CalledProcessError)):
                media.validate(corrupt)

    def test_conversion_failure_leaves_existing_assets_unchanged(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            marker = root / "data" / "app_media.json"
            marker.parent.mkdir()
            marker.write_text("existing manifest")
            with patch.object(media, "SITE_ROOT", root), patch.object(
                media, "validate", return_value={"width": 100, "height": 200}
            ), patch.object(media, "run", side_effect=OSError("conversion failed")):
                with self.assertRaisesRegex(OSError, "conversion failed"):
                    media.import_media(root / "captures")
            self.assertEqual(marker.read_text(), "existing manifest")
            self.assertFalse((root / "static").exists())


if __name__ == "__main__":
    unittest.main()
