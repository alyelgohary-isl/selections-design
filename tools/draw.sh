#!/usr/bin/env bash
# Turn one of the client's photographs into a registered pair: the photo and an ink line
# drawing of the same frame, pixel-aligned, so a sheet can wipe from drawing to room.
#   tools/draw.sh <source image> <slug> <width> [low] [high]
# Writes public/assets/img/<slug>.webp (photo) and public/assets/img/<slug>-line.webp (drawing).
# low/high are the Canny thresholds (0–1): raise them for busy or dark photos.
# PHOTO_ONLY=1 skips the drawing (gallery images).
set -euo pipefail
src="${1:?source image}"; slug="${2:?slug}"; width="${3:?width}"; low="${4:-0.07}"; high="${5:-0.18}"
out="$(cd "$(dirname "$0")/.." && pwd)/public/assets/img"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
mkdir -p "$out"
# ink #1c1713 on white: the page multiplies it onto the paper ground
INK="r='28+227*val/255':g='23+232*val/255':b='19+236*val/255'"
ffmpeg -loglevel error -y -i "$src" -vf "scale=${width}:-2:flags=lanczos" "$tmp/photo.png"
cwebp -quiet -q 80 -m 6 "$tmp/photo.png" -o "$out/$slug.webp"
if [ -z "${PHOTO_ONLY:-}" ]; then
  ffmpeg -loglevel error -y -i "$src" -vf "scale=${width}:-2:flags=lanczos,format=gray,gblur=sigma=1.6,edgedetect=low=${low}:high=${high},negate,erosion,gblur=sigma=0.7,format=rgb24,lutrgb=$INK" "$tmp/line.png"
  cwebp -quiet -q 72 -m 6 "$tmp/line.png" -o "$out/$slug-line.webp"
  printf "%s  %s  %s\n" "$slug" "$(du -h "$out/$slug.webp" | cut -f1)" "$(du -h "$out/$slug-line.webp" | cut -f1)"
else
  printf "%s  %s\n" "$slug" "$(du -h "$out/$slug.webp" | cut -f1)"
fi
