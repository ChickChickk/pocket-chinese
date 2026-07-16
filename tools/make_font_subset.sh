#!/bin/bash
# Subset TW-Kai (全字庫正楷體) to only the characters the app uses, as woff2.
# Usage: ./make_font_subset.sh /path/to/TW-Kai.ttf
# Re-run whenever data.js gains new characters (e.g. after enriching more example sentences).
set -euo pipefail
TTF="${1:?Usage: make_font_subset.sh /path/to/TW-Kai.ttf}"
DIR="$(cd "$(dirname "$0")" && pwd)"
CHARSET="$DIR/charset.txt"
OUT="$DIR/../fonts/tw-kai-subset.woff2"

node "$DIR/build_charset.js" > "$CHARSET"
echo "charset: $(node -e 'process.stdout.write(String([...require("fs").readFileSync(process.argv[1],"utf8")].length))' "$CHARSET") glyphs"

pyftsubset "$TTF" \
  --text-file="$CHARSET" \
  --output-file="$OUT" \
  --flavor=woff2 \
  --layout-features='*' \
  --no-hinting \
  --desubroutinize

echo "wrote $OUT ($(du -h "$OUT" | cut -f1))"
