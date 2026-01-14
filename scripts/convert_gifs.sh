#!/usr/bin/env bash
# filepath: scripts/convert_gifs.sh
set -euo pipefail

IN_DIR="${1:-.}"
OUT_DIR="${2:-./optimized}"

FPS="${FPS:-15}"
BIG_H="${BIG_H:-480}"
CRF="${CRF:-35}"
WEBP_Q="${WEBP_Q:-75}"
POSTER_Q="${POSTER_Q:-80}"

# Detect ImageMagick command (v7=magick, v6=convert)
if command -v magick &>/dev/null; then
  MAGICK="magick"
elif command -v convert &>/dev/null; then
  MAGICK="convert"
else
  echo "Error: ImageMagick not found. Install with: brew install imagemagick"
  exit 1
fi

mkdir -p "$OUT_DIR"

find "$IN_DIR" -type f -iname "*.gif" -print0 | while IFS= read -r -d '' src; do
  if [[ ! -f "$src" ]]; then
    echo "Skip (missing): $src"
    continue
  fi

  h="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$src" </dev/null || true)"
  h="${h:-0}"
  if [[ "$h" -ge 700 ]]; then TH="$BIG_H"; else TH="$h"; fi
  if [[ "$TH" -le 0 ]]; then
    echo "Skip (bad probe): $src"
    continue
  fi

  rel="${src#"$IN_DIR"/}"
  subdir="$(dirname "$rel")"
  base="$(basename "$rel")"
  name="${base%.*}"

  mkdir -p "$OUT_DIR/$subdir"
  TMPDIR=$(mktemp -d)
  
  echo "=== Processing: $src -> h=${TH} ==="

  # Step 1: Use ImageMagick to coalesce (fix disposal) and export as TGA sequence (always supported)
  echo "  Extracting frames with proper disposal..."
  $MAGICK "$src" -coalesce -resize "x${TH}" -background none "$TMPDIR/frame_%04d.tga"
  
  FRAME_COUNT=$(ls "$TMPDIR"/frame_*.tga 2>/dev/null | wc -l | tr -d ' ')
  echo "  Extracted $FRAME_COUNT frames"

  # Simple naming: name_poster.webp, name_anim.webp, name_video.webm
  out_poster="$OUT_DIR/$subdir/${name}_poster.webp"
  out_webp="$OUT_DIR/$subdir/${name}_anim.webp"
  out_webm="$OUT_DIR/$subdir/${name}_video.webm"

  # Poster (first frame) - use ffmpeg instead of magick
  ffmpeg -nostdin -y -v error -i "$TMPDIR/frame_0000.tga" \
    -c:v libwebp -lossless 0 -q:v "$POSTER_Q" -pix_fmt yuva420p \
    "$out_poster"

  # Animated WebP (fallback for iOS)
  ffmpeg -nostdin -y -v error -framerate "$FPS" -i "$TMPDIR/frame_%04d.tga" \
    -c:v libwebp -pix_fmt yuva420p -lossless 0 -q:v "$WEBP_Q" \
    -loop 0 -an "$out_webp"

  # VP9 WebM with alpha (for Android/Chrome)
  ffmpeg -nostdin -y -v error -framerate "$FPS" -i "$TMPDIR/frame_%04d.tga" \
    -c:v libvpx-vp9 -pix_fmt yuva420p \
    -b:v 0 -crf "$CRF" -row-mt 1 \
    -auto-alt-ref 0 \
    -an "$out_webm"

  rm -rf "$TMPDIR"

  echo "  poster: $(du -h "$out_poster"| awk '{print $1}')"
  echo "  anim:   $(du -h "$out_webp"  | awk '{print $1}')"
  echo "  video:  $(du -h "$out_webm"  | awk '{print $1}')"
  echo
done

echo "Done. Outputs in: $OUT_DIR"