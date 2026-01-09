#!/usr/bin/env bash
set -euo pipefail

IN_DIR="${1:-.}"
OUT_DIR="${2:-./optimized}"

FPS="${FPS:-15}"
BIG_H="${BIG_H:-480}"
CRF="${CRF:-35}"
SPEED="${SPEED:-4}"
WEBP_Q="${WEBP_Q:-60}"
POSTER_Q="${POSTER_Q:-80}"

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

  out_webm="$OUT_DIR/$subdir/${name}_vp9_alpha_h${TH}_fps${FPS}_crf${CRF}.webm"
  out_webp="$OUT_DIR/$subdir/${name}_anim_h${TH}_fps${FPS}_q${WEBP_Q}.webp"
  out_poster="$OUT_DIR/$subdir/${name}_poster_h${TH}_q${POSTER_Q}.webp"

  echo "=== $src (${w}x${h}) -> h=${TH}, fps=${FPS} ==="

  SCALE="scale=-1:${TH}:flags=lanczos"

  # VP9 + alpha
  ffmpeg -nostdin -y -v error -i "$src" \
    -vf "fps=${FPS},${SCALE},format=yuva420p" \
    -c:v libvpx-vp9 -pix_fmt yuva420p \
    -b:v 0 -crf "$CRF" -row-mt 1 -speed "$SPEED" \
    -auto-alt-ref 0 \
    -metadata:s:v:0 alpha_mode=1 \
    -an "$out_webm"

  # Poster (first frame)
  ffmpeg -nostdin -y -v error -i "$src" \
    -vf "${SCALE},format=rgba" \
    -frames:v 1 \
    -c:v libwebp -q:v "$POSTER_Q" \
    "$out_poster"

  # Animated WebP fallback
  ffmpeg -nostdin -y -v error -i "$src" \
    -vf "fps=${FPS},${SCALE}" \
    -c:v libwebp -pix_fmt yuva420p \
    -lossless 0 -q:v "$WEBP_Q" \
    -loop 0 -an -vsync 0 \
    "$out_webp"

  echo "  webm:  $(du -h "$out_webm"  | awk '{print $1}')"
  echo "  webp:  $(du -h "$out_webp"  | awk '{print $1}')"
  echo "  poster:$(du -h "$out_poster"| awk '{print $1}')"
  echo
done

echo "Done. Outputs in: $OUT_DIR"
