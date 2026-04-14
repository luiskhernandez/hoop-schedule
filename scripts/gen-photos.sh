#!/bin/zsh
# Generates public/photos.json from whatever files exist in public/photos/
# Run this after adding/removing scoresheet photos.

PHOTO_DIR="$(dirname "$0")/../public/photos"
OUT="$(dirname "$0")/../public/photos.json"

echo "{" > "$OUT"
first=true
for f in "$PHOTO_DIR"/*.jpg "$PHOTO_DIR"/*.jpeg "$PHOTO_DIR"/*.png "$PHOTO_DIR"/*.webp; do
  [ -f "$f" ] || continue
  filename=$(basename "$f")
  id="${filename%.*}"
  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> "$OUT"
  fi
  printf '  "%s": "photos/%s"' "$id" "$filename" >> "$OUT"
done
echo "" >> "$OUT"
echo "}" >> "$OUT"

echo "Generated photos.json"
