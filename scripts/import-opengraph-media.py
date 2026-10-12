#!/usr/bin/env python3
"""Import the independently rendered 1200 × 630 Android OpenGraph master."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

SITE_ROOT = Path(__file__).resolve().parent.parent
MASTER = Path("images/opengraph/en/lazulite.png")


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validate_master(source):
    provenance = json.loads(Path(f"{source}.provenance.json").read_text())
    digest = sha256(source)
    if (provenance.get("schema") != 1 or provenance.get("format") != "png"
            or provenance.get("locale") != "en"
            or (provenance.get("width"), provenance.get("height")) != (1200, 630)
            or provenance.get("outputSha256") != digest):
        raise ValueError("OpenGraph provenance does not match the rendered master")
    result = subprocess.run([
        "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
        "stream=codec_name,width,height", "-of", "json", str(source),
    ], check=True, capture_output=True, text=True)
    streams = json.loads(result.stdout)["streams"]
    if streams != [{"codec_name": "png", "width": 1200, "height": 630}]:
        raise ValueError("OpenGraph master must be a 1200 × 630 PNG; do not resize it")
    subprocess.run([
        "ffmpeg", "-v", "error", "-xerror", "-i", str(source), "-f", "null", "-",
    ], check=True, capture_output=True, text=True)
    return digest


def import_media(artifact_root, site_root=SITE_ROOT):
    source = artifact_root / MASTER
    digest = validate_master(source)
    manifest = {
        "src": f"/images/opengraph/lazulite.png?v={digest[:16]}",
        "width": 1200,
        "height": 630,
        "type": "image/png",
        "alt": "Lazulite Bluetooth audio inspector. Follow your audio from playback app through LDAC to headphones.",
        "sha256": digest,
    }
    # No conversion: preserve the lossless master and its crisp authored type byte-for-byte.
    # Validate everything before staging either website output beside its destination.
    staged = []
    try:
        for relative, content in (
            ("static/images/opengraph/lazulite.png", source.read_bytes()),
            ("data/opengraph_media.json", (json.dumps(manifest, indent=2) + "\n").encode()),
        ):
            target = site_root / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile(dir=target.parent, delete=False) as incoming:
                staged.append((Path(incoming.name), target))
                incoming.write(content)
        for pending, target in staged:
            os.replace(pending, target)
    finally:
        for pending, _ in staged:
            pending.unlink(missing_ok=True)
    print("Imported the 1200 × 630 OpenGraph PNG. Screenshot and video assets unchanged.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifact-root", required=True, type=Path,
                        help="Android repository's artifacts directory")
    args = parser.parse_args()
    for command in ("ffprobe", "ffmpeg"):
        if shutil.which(command) is None:
            parser.exit(1, f"Required tool not found: {command}\n")
    try:
        import_media(args.artifact_root.resolve())
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError) as error:
        detail = error.stderr if isinstance(error, subprocess.CalledProcessError) else str(error)
        parser.exit(1, f"OpenGraph import failed: {detail}\n")


if __name__ == "__main__":
    main()
