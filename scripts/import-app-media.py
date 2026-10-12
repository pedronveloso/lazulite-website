#!/usr/bin/env python3
"""Import localized AASG images and half-resolution Hyperframes website videos."""

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
# Display widths in CSS pixels; serve two image pixels per CSS pixel for Retina.
# Cap at the source resolution. Keep in sync
# with the sizing table in docs/refresh-app-media.md when the layout changes.
IMAGE_WIDTHS = {"home": 360, "playback-health": 520, "setup-tips": 420}
POSTER_WIDTH = 360
IMAGE_PIXEL_RATIO = 2
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


def image_webp(source, output, display_width):
    # Always start from the capture, never an already compressed website image.
    width = min(display_width * IMAGE_PIXEL_RATIO, dimensions(source)["width"])
    # Compress colors at quality 90 while preserving the resized alpha losslessly.
    run("cwebp", "-quiet", "-q", "90", "-alpha_q", "100", "-m", "6",
        "-resize", str(width), "0", str(source), "-o", str(output))
    return validate(output)


def import_media(artifact_root, images_only=False):
    sources = {}
    for lang, locale in LOCALES.items():
        sources[lang] = {
            role: artifact_root / "screenshots" / kind / locale / f"{capture}-dark-gestural.png"
            for role, (kind, capture) in IMAGES.items()
        }
        sources[lang]["home-video"] = (
            SITE_ROOT / "static" / "videos" / "app" / lang / "home.mp4"
            if images_only else
            artifact_root / "videos" / "hyperframes" / locale / "website-demo-dark-gestural.mp4"
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
                size = image_webp(media[role], output, IMAGE_WIDTHS[role])
                manifest[lang][role] = {
                    "src": public_url(output, f"/images/app/{lang}/{output.name}"), **size
                }
            video = media["home-video"]
            if not images_only:
                video = video_dir / "home.mp4"
                # Resize only the website copy. Keep full-resolution Android masters.
                # Round down to even dimensions for H.264/yuv420p compatibility.
                run("ffmpeg", "-v", "error", "-i", str(media["home-video"]),
                    "-map", "0:v:0", "-vf", "scale=trunc(iw/4)*2:trunc(ih/4)*2:flags=lanczos,fps=30",
                    "-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
                    "-movflags", "+faststart", str(video))
            poster = image_dir / "home-video-poster.webp"
            poster_png = staging / f"poster-{lang}.png"
            run("ffmpeg", "-v", "error", "-i", str(video), "-frames:v", "1", str(poster_png))
            poster_size = image_webp(poster_png, poster, POSTER_WIDTH)
            poster_png.unlink()
            manifest[lang]["home-video"] = {
                "src": public_url(video, f"/videos/app/{lang}/home.mp4"),
                "poster": public_url(poster, f"/images/app/{lang}/{poster.name}"), **validate(video),
                "posterWidth": poster_size["width"], "posterHeight": poster_size["height"]
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
    print("Imported 15 resized screenshots and 5 resized video posters. " +
          ("Existing website videos unchanged." if images_only else
           "Imported 5 half-resolution website videos."))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifact-root", required=True, type=Path,
                        help="Android repository's AASG artifacts directory")
    parser.add_argument("--images-only", action="store_true",
                        help="Resize screenshots and regenerate posters from existing website MP4s; leave videos unchanged")
    args = parser.parse_args()
    for command in ("ffmpeg", "ffprobe", "cwebp"):
        if shutil.which(command) is None:
            parser.exit(1, f"Required tool not found: {command}\n")
    try:
        import_media(args.artifact_root.resolve(), images_only=args.images_only)
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError) as error:
        detail = error.stderr if isinstance(error, subprocess.CalledProcessError) else str(error)
        parser.exit(1, f"Media import failed: {detail}\n")


if __name__ == "__main__":
    main()
