#!/usr/bin/env bash
# filepath: scripts/convert_gifs.sh
set -euo pipefail

IN_DIR="${1:-.}"
OUT_DIR="${2:-./optimized}"

# Quality settings - lower CRF = better quality (18-28 recommended for VP9)
FPS="${FPS:-15}"
BIG_H="${BIG_H:-480}"
CRF="${CRF:-24}"              # Lower CRF for better edge/alpha quality
WEBP_Q="${WEBP_Q:-80}"        # Higher quality for animated WebP
POSTER_Q="${POSTER_Q:-85}"
HEVC_BITRATE="${HEVC_BITRATE:-4M}"  # Higher bitrate for better HEVC quality

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

  # Step 1: Use ImageMagick to coalesce (fix GIF disposal) and export as PNG sequence
  # PNG is supported by img2webp, ffmpeg, and preserves alpha perfectly
  echo "  Extracting frames with proper disposal..."
  $MAGICK "$src" -coalesce -resize "x${TH}" -background none "$TMPDIR/frame_%04d.png"
  
  FRAME_COUNT=$(ls "$TMPDIR"/frame_*.png 2>/dev/null | wc -l | tr -d ' ')
  echo "  Extracted $FRAME_COUNT frames"

  # Output files
  out_poster="$OUT_DIR/$subdir/${name}_poster.webp"
  out_webp="$OUT_DIR/$subdir/${name}_anim.webp"
  out_webm="$OUT_DIR/$subdir/${name}_video.webm"
  out_hevc="$OUT_DIR/$subdir/${name}_hevc.mov"

  # Poster (first frame)
  echo "  Creating poster..."
  ffmpeg -nostdin -y -v error -i "$TMPDIR/frame_0000.png" \
    -c:v libwebp -lossless 0 -q:v "$POSTER_Q" -pix_fmt yuva420p \
    "$out_poster"

  # Animated WebP - use img2webp for better animation/alpha support
  DELAY=$((1000 / FPS))
  if command -v img2webp &>/dev/null; then
    echo "  Creating animated WebP with img2webp..."
    img2webp -loop 0 -d "$DELAY" -q "$WEBP_Q" -m 4 "$TMPDIR"/frame_*.png -o "$out_webp"
  elif command -v gif2webp &>/dev/null; then
    echo "  Creating animated WebP with gif2webp..."
    $MAGICK "$src" -coalesce -resize "x${TH}" -background none "$TMPDIR/clean.gif"
    gif2webp -q "$WEBP_Q" -m 4 -lossy "$TMPDIR/clean.gif" -o "$out_webp"
  else
    echo "  Creating animated WebP with ffmpeg..."
    ffmpeg -nostdin -y -v error -framerate "$FPS" -i "$TMPDIR/frame_%04d.png" \
      -c:v libwebp -pix_fmt yuva420p -lossless 0 -q:v "$WEBP_Q" \
      -loop 0 -an "$out_webp"
  fi

  # VP9 WebM with alpha (for Android/Chrome)
  echo "  Creating VP9 WebM..."
  ffmpeg -nostdin -y -v error -framerate "$FPS" -i "$TMPDIR/frame_%04d.png" \
    -c:v libvpx-vp9 -pix_fmt yuva420p \
    -b:v 0 -crf "$CRF" -row-mt 1 \
    -auto-alt-ref 0 \
    -an "$out_webm"

  # HEVC with alpha for Safari (macOS only - uses VideoToolbox)
  # NOTE: Must be pre-generated on macOS and committed - won't work on Linux CI/Vercel
  if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q hevc_videotoolbox; then
    echo "  Creating HEVC for Safari..."
    ffmpeg -nostdin -y -v error -framerate "$FPS" -i "$TMPDIR/frame_%04d.png" \
      -c:v hevc_videotoolbox \
      -b:v "$HEVC_BITRATE" \
      -tag:v hvc1 \
      -alpha_quality 0.9 \
      -movflags +faststart \
      -an "$out_hevc" 2>/dev/null || \
    ffmpeg -nostdin -y -v error -framerate "$FPS" -i "$TMPDIR/frame_%04d.png" \
      -c:v hevc_videotoolbox \
      -b:v "$HEVC_BITRATE" \
      -tag:v hvc1 \
      -movflags +faststart \
      -an "$out_hevc" 2>/dev/null || \
    echo "  (HEVC encoding failed)"
    
    if [[ -f "$out_hevc" ]]; then
      echo "  hevc:   $(du -h "$out_hevc" | awk '{print $1}')"
    fi
  else
    echo "  (HEVC skipped - hevc_videotoolbox not available)"
  fi

  rm -rf "$TMPDIR"

  echo "  poster: $(du -h "$out_poster"| awk '{print $1}')"
  echo "  anim:   $(du -h "$out_webp"  | awk '{print $1}')"
  echo "  video:  $(du -h "$out_webm"  | awk '{print $1}')"
  echo
done

echo "Done. Outputs in: $OUT_DIR"