#!/usr/bin/env bash
# Simple GIF to animated WebP converter
# Works on iPhone, Android, and all desktop browsers
set -euo pipefail

IN_DIR="${1:-.}"
OUT_DIR="${2:-./optimized}"

FPS="${FPS:-15}"
BIG_H="${BIG_H:-480}"
WEBP_Q="${WEBP_Q:-80}"
POSTER_Q="${POSTER_Q:-85}"

mkdir -p "$OUT_DIR"

find "$IN_DIR" -type f -iname "*.gif" -print0 | while IFS= read -r -d '' src; do
  # Safety
  if [[ ! -f "$src" ]]; then
    echo "Skip (missing): $src"
    continue
  fi

  # Dimensions
  w="$(ffprobe -v error -select_streams v:0 -show_entries stream=width  -of csv=p=0 "$src" </dev/null || true)"
  h="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$src" </dev/null || true)"
  w="${w:-0}"; h="${h:-0}"

  if [[ "$h" -ge 700 ]]; then TH="$BIG_H"; else TH="$h"; fi
  if [[ "$TH" -le 0 ]]; then
    echo "Skip (bad probe): $src"
    continue
  fi

  # Compute relative path for output structure (DO NOT use this for input)
  rel="${src#"$IN_DIR"/}"
  subdir="$(dirname "$rel")"
  base="$(basename "$rel")"
  name="${base%.*}"

  mkdir -p "$OUT_DIR/$subdir"

  out_webp="$OUT_DIR/$subdir/${name}_anim.webp"
  out_poster="$OUT_DIR/$subdir/${name}_poster.webp"

  echo "=== $src (${w}x${h}) -> h=${TH}, fps=${FPS} ==="

  SCALE="scale=-1:${TH}:flags=lanczos"

  # Poster (first frame)
  ffmpeg -nostdin -y -v error -i "$src" \
    -vf "${SCALE},format=rgba" \
    -frames:v 1 \
    -c:v libwebp -q:v "$POSTER_Q" \
    "$out_poster"

  # Animated WebP - fixed ghosting with proper settings
  ffmpeg -nostdin -y -v error -i "$src" \
    -vf "fps=${FPS},${SCALE},split[a][b];[a]palettegen=reserve_transparent=1[pal];[b][pal]paletteuse=dither=none" \
    -c:v libwebp -pix_fmt yuva420p \
    -lossless 0 -compression_level 6 -q:v "$WEBP_Q" \
    -loop 0 -an -vsync 0 -auto-alt-ref 0 \
    "$out_webp"

  echo "  anim:  $(du -h "$out_webp"  | awk '{print $1}')"
  echo "  poster:$(du -h "$out_poster"| awk '{print $1}')"
  echo
done

echo "Done. Outputs in: $OUT_DIR"
