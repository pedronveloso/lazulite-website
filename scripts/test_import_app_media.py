"""Failure safety checks for the media importer; no Android device needed."""
import importlib.util
import hashlib
import json
from pathlib import Path
import tempfile
import shutil
import subprocess
import struct
import unittest
from unittest.mock import patch
import zlib

SPEC = importlib.util.spec_from_file_location(
    "import_app_media", Path(__file__).with_name("import-app-media.py")
)
media = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(media)


class ImportFailureTest(unittest.TestCase):
    def test_every_locale_requires_its_own_hyperframes_master(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            inputs = []
            with patch.object(media, "SITE_ROOT", root), patch.object(
                media, "validate", side_effect=lambda path: inputs.append(path)
            ), patch.object(media, "run", side_effect=OSError("stop before conversion")):
                with self.assertRaisesRegex(OSError, "stop before conversion"):
                    media.import_media(root / "captures")
            self.assertEqual(inputs[3::4], [
                root / "captures" / "videos" / "hyperframes" / locale /
                "website-demo-dark-gestural.mp4" for locale in media.LOCALES.values()
            ])

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


@unittest.skipUnless(all(shutil.which(tool) for tool in ("ffmpeg", "ffprobe", "cwebp")),
                     "Media tools required")
class WebsiteVideoTest(unittest.TestCase):
    def assert_lossy_webp(self, path):
        data = path.read_bytes()
        chunks, offset = [], 12
        while offset + 8 <= len(data):
            chunks.append(data[offset:offset + 4])
            length = struct.unpack("<I", data[offset + 4:offset + 8])[0]
            offset += 8 + length + length % 2
        self.assertIn(b"VP8 ", chunks, "Lossy WebP required")
        self.assertNotIn(b"VP8L", chunks)

    def fixture(self, artifact_root, width=100, height=204):
        image = artifact_root / "fixture.png"
        image.parent.mkdir(parents=True, exist_ok=True)
        media.run("ffmpeg", "-v", "error", "-f", "lavfi", "-i", "color=c=blue:s=32x48",
                  "-frames:v", "1", str(image))
        for locale, color in zip(media.LOCALES.values(), ("red", "green", "blue", "yellow", "cyan")):
            for kind, capture in media.IMAGES.values():
                target = artifact_root / "screenshots" / kind / locale / f"{capture}-dark-gestural.png"
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(image, target)
            video = artifact_root / "videos" / "hyperframes" / locale / "website-demo-dark-gestural.mp4"
            video.parent.mkdir(parents=True, exist_ok=True)
            media.run("ffmpeg", "-v", "error", "-f", "lavfi", "-i",
                      f"color=c={color}:s={width}x{height}:r=30", "-t", "0.4", "-an",
                      "-c:v", "libx264", "-pix_fmt", "yuv420p", str(video))

    def test_scaled_localized_videos_posters_and_originals(self):
        for size in ((100, 204), (102, 206)):
            with self.subTest(source_size=size), tempfile.TemporaryDirectory() as folder:
                root = Path(folder)
                captures, site = root / "captures", root / "site"
                self.fixture(captures, *size)
                originals = {path: hashlib.sha256(path.read_bytes()).hexdigest()
                             for path in captures.rglob("*") if path.is_file()}
                with patch.object(media, "SITE_ROOT", site):
                    media.import_media(captures)
                manifest = json.loads((site / "data" / "app_media.json").read_text())
                hashes = set()
                for lang in media.LOCALES:
                    video = site / "static" / "videos" / "app" / lang / "home.mp4"
                    poster = site / "static" / "images" / "app" / lang / "home-video-poster.webp"
                    expected = {"width": 50, "height": 102}
                    self.assertEqual(media.validate(video), expected)
                    self.assertEqual(media.validate(poster), expected)
                    self.assertEqual({k: manifest[lang]["home-video"][k] for k in expected}, expected)
                    self.assertEqual(manifest[lang]["home-video"]["src"],
                                     media.public_url(video, f"/videos/app/{lang}/home.mp4"))
                    self.assertEqual(manifest[lang]["home-video"]["poster"],
                                     media.public_url(poster, f"/images/app/{lang}/home-video-poster.webp"))
                    probe = json.loads(media.run("ffprobe", "-v", "error", "-show_streams",
                                                 "-show_format", "-of", "json", str(video)))
                    self.assertEqual(len(probe["streams"]), 1)
                    stream = probe["streams"][0]
                    self.assertEqual(stream["codec_name"], "h264")
                    self.assertEqual(stream["pix_fmt"], "yuv420p")
                    self.assertEqual(stream["r_frame_rate"], "30/1")
                    self.assertAlmostEqual(float(probe["format"]["duration"]), 0.4, places=3)
                    hashes.add(hashlib.sha256(video.read_bytes()).hexdigest())
                self.assertEqual(len(hashes), 5, "Localized footage must remain distinct")
                self.assertEqual(originals, {path: hashlib.sha256(path.read_bytes()).hexdigest()
                                            for path in originals})

    def test_images_only_resizes_from_masters_preserving_alpha_and_videos(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            captures, site = root / "captures", root / "site"
            self.fixture(captures, width=800, height=1280)
            with patch.object(media, "SITE_ROOT", site):
                media.import_media(captures)
            videos = {path: path.read_bytes() for path in (site / "static/videos").rglob("*.mp4")}
            previous = json.loads((site / "data/app_media.json").read_text())
            # Screenshot-only imports must not need the Hyperframes masters.
            shutil.rmtree(captures / "videos")

            def chunk(kind, data):
                return (struct.pack(">I", len(data)) + kind + data +
                        struct.pack(">I", zlib.crc32(kind + data)))

            # A real RGBA capture with transparent, feathered, and opaque regions.
            row = b"\0" + b"".join(bytes((40, 80, 160, min(255, x * 3))) for x in range(1024))
            png = (b"\x89PNG\r\n\x1a\n" +
                   chunk(b"IHDR", struct.pack(">IIBBBBB", 1024, 640, 8, 6, 0, 0, 0)) +
                   chunk(b"IDAT", zlib.compress(row * 640)) + chunk(b"IEND", b""))
            originals = list(captures.rglob("*-dark-gestural.png"))
            for path in originals:
                path.write_bytes(png)
            with patch.object(media, "SITE_ROOT", site):
                media.import_media(captures, images_only=True)
            manifest = json.loads((site / "data/app_media.json").read_text())
            for lang in media.LOCALES:
                for role, width in media.IMAGE_WIDTHS.items():
                    output = site / "static/images/app" / lang / f"{role}.webp"
                    size = media.validate(output)
                    width = min(width * media.IMAGE_PIXEL_RATIO, 1024)
                    self.assertEqual(size["width"], width)
                    self.assertLessEqual(abs(size["height"] - width * 640 / 1024), 1)
                    self.assertEqual({key: manifest[lang][role][key] for key in size}, size)
                    self.assertNotEqual(manifest[lang][role]["src"], previous[lang][role]["src"])
                    self.assert_lossy_webp(output)
                    alpha = subprocess.run([
                        "ffmpeg", "-v", "error", "-i", str(output), "-vf", "alphaextract",
                        "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "gray", "-"
                    ], check=True, capture_output=True).stdout
                    self.assertLess(min(alpha), 20)
                    self.assertEqual(max(alpha), 255)
                    self.assertTrue(any(0 < value < 255 for value in alpha))
                    if width == 1024:
                        self.assertEqual(alpha, bytes(min(255, x * 3) for x in range(1024)) * 640,
                                         "Unscaled transparency must round-trip exactly")
                poster = site / "static/images/app" / lang / "home-video-poster.webp"
                self.assertEqual(media.validate(poster), {"width": 400, "height": 640})
                self.assert_lossy_webp(poster)
                entry = manifest[lang]["home-video"]
                self.assertEqual((entry["posterWidth"], entry["posterHeight"]), (400, 640))
                self.assertEqual(entry["src"], previous[lang]["home-video"]["src"])
                self.assertEqual((entry["width"], entry["height"]), (400, 640))
            self.assertTrue(all(path.read_bytes() == data for path, data in videos.items()))
            self.assertTrue(all(path.read_bytes() == png for path in originals))

    def test_images_only_missing_existing_video_keeps_site_unchanged(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            captures, site = root / "captures", root / "site"
            self.fixture(captures)
            with patch.object(media, "SITE_ROOT", site):
                media.import_media(captures)
            (site / "static/videos/app/ja/home.mp4").unlink()
            before = {path: path.read_bytes() for path in site.rglob("*") if path.is_file()}
            with patch.object(media, "SITE_ROOT", site):
                with self.assertRaisesRegex(ValueError, "Missing or empty"):
                    media.import_media(captures, images_only=True)
            self.assertEqual(before, {path: path.read_bytes() for path in site.rglob("*")
                                      if path.is_file()})

    def test_missing_localized_master_does_not_fall_back_or_replace_site(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            captures, site = root / "captures", root / "site"
            self.fixture(captures)
            master = captures / "videos" / "hyperframes" / "ja" / "website-demo-dark-gestural.mp4"
            legacy = captures / "videos" / "framed" / "ja" / "home-video-dark-gestural.mp4"
            legacy.parent.mkdir(parents=True)
            shutil.copyfile(master, legacy)
            master.unlink()
            marker = site / "data" / "app_media.json"
            marker.parent.mkdir(parents=True)
            marker.write_text("previous website manifest")
            with patch.object(media, "SITE_ROOT", site):
                with self.assertRaisesRegex(ValueError, "Missing or empty"):
                    media.import_media(captures)
            self.assertEqual(marker.read_text(), "previous website manifest")
            self.assertFalse((site / "static").exists())


if __name__ == "__main__":
    unittest.main()
