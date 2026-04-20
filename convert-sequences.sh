#!/usr/bin/env bash
# Converts PNG frame sequences to MP4 for scroll-scrubbed animations.
# Run once locally; commit the resulting .mp4 files (or upload to your server).
#
# Requires ffmpeg:
#   macOS:   brew install ffmpeg
#   Windows: winget install ffmpeg  (then restart your terminal)
#   Linux:   sudo apt install ffmpeg
#
# Output: sequence1.mp4 and sequence2.mp4 in the project root.
# Estimated sizes vs current PNGs:
#   sequence1: 63MB PNG → ~4–6MB MP4
#   sequence2: 100MB PNG → ~5–8MB MP4

set -e

command -v ffmpeg >/dev/null 2>&1 || { echo "ERROR: ffmpeg not found. Install it first."; exit 1; }

# ── Quality knob ─────────────────────────────────────────────────────────────
# CRF scale: 18 = near-lossless, 23 = default, 28 = smaller/more artifacts.
# 23 is the right starting point. Go to 20 if you see banding in dark areas.
CRF=23
FPS=24

for seq in 1 2; do
  dir="sequence${seq}"
  out="sequence${seq}.mp4"

  if [ ! -d "$dir" ]; then
    echo "Skipping sequence${seq}: directory '$dir' not found."
    continue
  fi

  echo "Converting $dir/ → $out  (CRF=$CRF, ${FPS}fps) ..."

  ffmpeg -y \
    -framerate $FPS \
    -i "${dir}/ezgif-frame-%03d.png" \
    -c:v libx264 \
    -preset slow \
    -crf $CRF \
    -pix_fmt yuv420p \
    -movflags +faststart \
    "$out"

  # Print before/after size comparison
  png_size=$(du -sh "$dir" | cut -f1)
  mp4_size=$(du -sh "$out" | cut -f1)
  echo "  Done: ${png_size} PNG → ${mp4_size} MP4"
done

echo ""
echo "All done. Next steps:"
echo "  1. Check the videos look correct (open in a browser or media player)."
echo "  2. Place sequence1.mp4 and sequence2.mp4 in your deployment root."
echo "  3. The site will auto-switch to video; PNG folders are no longer needed."
echo "  4. If you need to re-export, bump CACHE_VERSION in sw.js so users re-download."
