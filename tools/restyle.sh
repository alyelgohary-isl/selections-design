#!/usr/bin/env bash
# Put a restyled photograph (Nano Banana 2 edit of the client's own photo: same room and millwork,
# tidier contents) back into the site at the original's exact size.
#   tools/restyle.sh <generated.png> <slug>
# Keeps the untouched original as work/photos-original/<slug>.webp the first time it runs.
set -euo pipefail
gen="${1:?generated photo}"; slug="${2:?slug}"
root="$(cd "$(dirname "$0")/.." && pwd)"; out="$root/public/assets/img"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
mkdir -p "$root/work/photos-original"
[ -f "$root/work/photos-original/$slug.webp" ] || cp "$out/$slug.webp" "$root/work/photos-original/$slug.webp"
size="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$root/work/photos-original/$slug.webp")"
w="${size%x*}"; h="${size#*x}"
ffmpeg -loglevel error -y -i "$gen" -vf "scale=${w}:${h}:flags=lanczos" "$tmp/photo.png"
cwebp -quiet -q 80 -m 6 "$tmp/photo.png" -o "$out/$slug.webp"
printf "%s  %sx%s  %s\n" "$slug" "$w" "$h" "$(du -h "$out/$slug.webp" | cut -f1)"
