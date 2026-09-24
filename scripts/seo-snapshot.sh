#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
snapshot="$repo_root/public-seo-check"
mode="${1:-check}"

if [[ "$mode" != "check" && "$mode" != "--update" ]]; then
  echo "Usage: $0 [--update]" >&2
  exit 2
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT
build_dir="$tmp_dir/site"

hugo --source "$repo_root" --destination "$build_dir"

if [[ "$mode" == "--update" ]]; then
  mkdir -p "$snapshot"
  rsync -a --delete --exclude='.DS_Store' "$build_dir/" "$snapshot/"
  echo "Updated public-seo-check from the current Hugo build."
  exit 0
fi

if ! diff -qr -x '.DS_Store' "$snapshot" "$build_dir"; then
  echo >&2
  echo "The tracked SEO snapshot is out of date. Refresh it with:" >&2
  echo "  ./scripts/seo-snapshot.sh --update" >&2
  exit 1
fi

echo "The tracked SEO snapshot matches the current Hugo build."
