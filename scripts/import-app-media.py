#!/usr/bin/env python3
"""Import the complete dark/gestural AASG website set after staging and validation."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

LOCALES = {"en": "en", "es": "es", "it": "it", "zh": "zh-CN", "ja": "ja"}
IMAGES = {
    "home": ("framed", "home"),
    "playback-health": ("cards", "playback-health"),
    "setup-tips": ("cards", "setup-tips-high-resolution"),
}
SITE_ROOT = Path(__file__).resolve().parent.parent


def run(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True).stdout


def dimensions(path):
    streams = json.loads(run(
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height", "-of", "json", str(path)
    ))["streams"]
    if len(streams) != 1 or min(streams[0].values()) <= 0:
        raise ValueError(f"No usable image/video dimensions: {path}")
    return streams[0]


def validate(path):
    if not path.is_file() or path.stat().st_size == 0:
        raise ValueError(f"Missing or empty capture: {path}")
    size = dimensions(path)
    # Probe alone accepts truncated media; decode the complete input as well.
    run("ffmpeg", "-v", "error", "-xerror", "-i", str(path), "-f", "null", "-")
    return size


def public_url(path, url):
    # The site serves images with immutable caching; refresh URLs when bytes change.
    version = hashlib.sha256(path.read_bytes()).hexdigest()[:16]
    return f"{url}?v={version}"


def import_media(artifact_root):
    sources = {}
    for lang, locale in LOCALES.items():
        sources[lang] = {
            role: artifact_root / "screenshots" / kind / locale / f"{capture}-dark-gestural.png"
            for role, (kind, capture) in IMAGES.items()
        }
        sources[lang]["home-video"] = (
            artifact_root / "videos" / "framed" / locale / "home-video-dark-gestural.mp4"
        )
    for media in sources.values():
        for path in media.values():
            validate(path)

    # All conversions finish before any published file changes.
    with tempfile.TemporaryDirectory(prefix="lazulite-media-") as temporary:
        staging = Path(temporary)
        manifest = {}
        for lang, media in sources.items():
            manifest[lang] = {}
            image_dir = staging / "static" / "images" / "app" / lang
            video_dir = staging / "static" / "videos" / "app" / lang
            image_dir.mkdir(parents=True)
            video_dir.mkdir(parents=True)
            for role in IMAGES:
                output = image_dir / f"{role}.webp"
                run("cwebp", "-quiet", "-q", "90", "-alpha_q", "100", "-m", "6",
                    str(media[role]), "-o", str(output))
                manifest[lang][role] = {
                    "src": public_url(output, f"/images/app/{lang}/{output.name}"), **validate(output)
                }
            video = video_dir / "home.mp4"
            # Stream-copy with faststart: preserve AASG's encoded frames and duration.
            run("ffmpeg", "-v", "error", "-i", str(media["home-video"]),
                "-map", "0:v:0", "-c", "copy", "-movflags", "+faststart", str(video))
            poster = image_dir / "home-video-poster.webp"
            poster_png = staging / f"poster-{lang}.png"
            run("ffmpeg", "-v", "error", "-i", str(video), "-frames:v", "1", str(poster_png))
            run("cwebp", "-quiet", "-q", "90", "-m", "6", str(poster_png), "-o", str(poster))
            poster_png.unlink()
            validate(poster)
            manifest[lang]["home-video"] = {
                "src": public_url(video, f"/videos/app/{lang}/home.mp4"),
                "poster": public_url(poster, f"/images/app/{lang}/{poster.name}"), **validate(video)
            }
        manifest_path = staging / "data" / "app_media.json"
        manifest_path.parent.mkdir()
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
        for staged in sorted(staging.rglob("*")):
            if staged.is_file() and staged != manifest_path:
                target = SITE_ROOT / staged.relative_to(staging)
                target.parent.mkdir(parents=True, exist_ok=True)
                # Stage beside the target so replacement stays atomic across filesystems.
                with tempfile.NamedTemporaryFile(dir=target.parent, delete=False) as incoming:
                    incoming_path = Path(incoming.name)
                try:
                    shutil.copyfile(staged, incoming_path)
                    os.replace(incoming_path, target)
                finally:
                    incoming_path.unlink(missing_ok=True)
        target_manifest = SITE_ROOT / "data" / "app_media.json"
        target_manifest.parent.mkdir(exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=target_manifest.parent, delete=False) as incoming:
            incoming_path = Path(incoming.name)
        try:
            shutil.copyfile(manifest_path, incoming_path)
            os.replace(incoming_path, target_manifest)
        finally:
            incoming_path.unlink(missing_ok=True)
    print("Imported 15 localized images, 5 framed videos, and 5 video posters.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifact-root", required=True, type=Path,
                        help="Android repository's AASG artifacts directory")
    args = parser.parse_args()
    for command in ("ffmpeg", "ffprobe", "cwebp"):
        if shutil.which(command) is None:
            parser.exit(1, f"Required tool not found: {command}\n")
    try:
        import_media(args.artifact_root.resolve())
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError) as error:
        detail = error.stderr if isinstance(error, subprocess.CalledProcessError) else str(error)
        parser.exit(1, f"Media import failed: {detail}\n")


if __name__ == "__main__":
    main()
