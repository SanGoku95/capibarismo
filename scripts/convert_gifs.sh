#!/usr/bin/env bash
# Simple GIF to animated WebP converter using gif2webp
# Works on iPhone, Android, and all desktop browsers
set -euo pipefail

IN_DIR="${1:-.}"
OUT_DIR="${2:-./optimized}"

BIG_H="${BIG_H:-480}"
WEBP_Q="${WEBP_Q:-80}"
POSTER_Q="${POSTER_Q:-85}"

echo "[DEBUG] Input directory: $IN_DIR"
echo "[DEBUG] Output directory: $OUT_DIR"
echo "[DEBUG] Target height for tall images: $BIG_H"
echo "[DEBUG] WebP quality: $WEBP_Q"
echo "[DEBUG] Poster quality: $POSTER_Q"
echo ""

mkdir -p "$OUT_DIR"

# Check if gif2webp is available
if ! command -v gif2webp &> /dev/null; then
  echo "Error: gif2webp not found. Install it with:"
  echo "  macOS: brew install webp"
  echo "  Ubuntu/Debian: sudo apt-get install webp"
  exit 1
fi

echo "[DEBUG] gif2webp found at: $(command -v gif2webp)"
echo "[DEBUG] ffmpeg found at: $(command -v ffmpeg)"
echo ""

file_count=0
find "$IN_DIR" -type f -iname "*.gif" -print0 | while IFS= read -r -d '' src; do
  ((file_count++)) || true
  
  echo "[DEBUG] Processing file #$file_count"
  echo "[DEBUG] Source: $src"
  
  # Safety
  if [[ ! -f "$src" ]]; then
    echo "[WARN] Skip (missing): $src"
    continue
  fi

  # Dimensions
  w="$(ffprobe -v error -select_streams v:0 -show_entries stream=width  -of csv=p=0 "$src" </dev/null || true)"
  h="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$src" </dev/null || true)"
  w="${w:-0}"; h="${h:-0}"

  echo "[DEBUG] Original dimensions: ${w}x${h}"

  if [[ "$h" -ge 700 ]]; then 
    TH="$BIG_H"
    echo "[DEBUG] Height >= 700, will resize to: $TH"
  else 
    TH="$h"
    echo "[DEBUG] Height < 700, keeping original height: $TH"
  fi
  
  if [[ "$TH" -le 0 ]]; then
    echo "[ERROR] Skip (bad probe): $src"
    continue
  fi

  # Compute relative path for output structure
  rel="${src#"$IN_DIR"/}"
  subdir="$(dirname "$rel")"
  base="$(basename "$rel")"
  name="${base%.*}"

  echo "[DEBUG] Relative path: $rel"
  echo "[DEBUG] Subdirectory: $subdir"
  echo "[DEBUG] Base name: $base"
  echo "[DEBUG] Name without extension: $name"

  mkdir -p "$OUT_DIR/$subdir"

  out_webp="$OUT_DIR/$subdir/${name}_anim.webp"
  out_poster="$OUT_DIR/$subdir/${name}_poster.webp"

  echo "[DEBUG] Output animated WebP: $out_webp"
  echo "[DEBUG] Output poster: $out_poster"

  echo "=== $src (${w}x${h}) -> h=${TH}, q=${WEBP_Q} ==="

  # Need to resize? Create temp, convert that, then delete
  if [[ "$h" -ne "$TH" ]]; then
    echo "[DEBUG] Resize needed: $h != $TH"
    tmp_gif="$(mktemp).gif"
    echo "[DEBUG] Created temp file: $tmp_gif"
    trap "rm -f '$tmp_gif'" EXIT
    
    SCALE="scale=-1:${TH}:flags=lanczos"
    echo "[DEBUG] Running ffmpeg with scale: $SCALE"
    ffmpeg -nostdin -y -v error -i "$src" \
      -vf "${SCALE}" \
      "$tmp_gif"
    
    echo "[DEBUG] Temp GIF size: $(du -h "$tmp_gif" | awk '{print $1}')"
    echo "[DEBUG] Running gif2webp on resized GIF..."
    gif2webp -q "$WEBP_Q" -m 6 -lossy -mixed "$tmp_gif" -o "$out_webp"
    echo "[DEBUG] Removing temp file: $tmp_gif"
    rm -f "$tmp_gif"
  else
    echo "[DEBUG] No resize needed, converting directly"
    echo "[DEBUG] Running gif2webp on original..."
    gif2webp -q "$WEBP_Q" -m 6 -lossy -mixed "$src" -o "$out_webp"
  fi

  echo "[DEBUG] Creating poster frame..."
  # Poster (first frame) - still using ffmpeg for single frame
  ffmpeg -nostdin -y -v error -i "$src" \
    -vf "scale=-1:${TH}:flags=lanczos,format=rgba" \
    -frames:v 1 \
    -c:v libwebp -q:v "$POSTER_Q" \
    "$out_poster"

  echo "[DEBUG] Conversion complete!"
  echo "  anim:   $(du -h "$out_webp"  | awk '{print $1}')"
  echo "  poster: $(du -h "$out_poster"| awk '{print $1}')"
  echo ""
done

echo "Done. Outputs in: $OUT_DIR"