#!/usr/bin/env bash
# Fit a generated line drawing (Nano Banana 2, edit mode, from the client's photo) to its photograph,
# so it can replace the traced drawing made by tools/draw.sh.
#   tools/redraw.sh <generated.png> <slug>
# Reads public/assets/img/<slug>.webp for the exact size, stretches the drawing to it (the model returns a
# slightly different aspect ratio), drops any colour or grey wash it left behind, and writes
# public/assets/img/<slug>-line.webp in the same ink as the rest.
set -euo pipefail
gen="${1:?generated drawing}"; slug="${2:?slug}"
# LO/HI: grey levels mapped to full ink / to paper. Raise both when the model drew in pale grey (LO=120 HI=225).
lo="${LO:-60}"; hi="${HI:-140}"
out="$(cd "$(dirname "$0")/.." && pwd)/public/assets/img"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
size="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$out/$slug.webp")"
w="${size%x*}"; h="${size#*x}"
INK="r='28+227*val/255':g='23+232*val/255':b='19+236*val/255'"
# levels: at or below LO is full ink, at or above HI (paper, floor tint, soft shadow) is white
ffmpeg -loglevel error -y -i "$gen" -vf "scale=${w}:${h}:flags=lanczos,format=gray,lutyuv=y='clip((val-${lo})*255/(${hi}-${lo}),0,255)',format=rgb24,lutrgb=$INK" "$tmp/line.png"
cwebp -quiet -q 78 -m 6 "$tmp/line.png" -o "$out/$slug-line.webp"
printf "%s-line  %sx%s  %s\n" "$slug" "$w" "$h" "$(du -h "$out/$slug-line.webp" | cut -f1)"
