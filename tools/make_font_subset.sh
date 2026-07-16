#!/bin/bash
# Subset TW-Kai (全字庫正楷體) to only the characters the app uses, as woff2.
#
#   ./make_font_subset.sh /path/to/TW-Kai-98_1.ttf
#
# WHY THIS MATTERS: without the bundled subset, the @font-face in css/styles.css 404s and every
# device falls back to whatever system Kai font it happens to have — so the page looks different
# on a Mac (has Kaiti) vs a phone (has none). The subset guarantees identical rendering.
#
# RE-RUN whenever new characters appear (e.g. after enriching more example sentences), or those
# new glyphs will fall back to a system font. The coverage check below fails loudly if you forget.
#
# Get TW-Kai: https://data.gov.tw/dataset/5961 (全字庫, 政府資料開放授權條款 v1 / OFL-1.1 — both
# permit subsetting + redistribution with attribution). Use the BMP file TW-Kai-98_1.ttf.
# NOTE: do NOT use the 全字庫說文解字 (EBAS) file — that's ancient seal script, not Kai.
set -euo pipefail

TTF="${1:?Usage: make_font_subset.sh /path/to/TW-Kai-98_1.ttf}"
DIR="$(cd "$(dirname "$0")" && pwd)"
CHARSET="$DIR/charset.txt"
OUT="$DIR/../fonts/tw-kai-subset.woff2"

export PATH="$HOME/Library/Python/3.9/bin:$PATH"
command -v pyftsubset >/dev/null || { echo "pyftsubset not found. Install: pip3 install 'fonttools[woff]' brotli"; exit 1; }

mkdir -p "$(dirname "$OUT")"
node "$DIR/build_charset.js" > "$CHARSET"

pyftsubset "$TTF" \
  --text-file="$CHARSET" \
  --output-file="$OUT" \
  --flavor=woff2 \
  --layout-features='*' \
  --no-hinting \
  --desubroutinize

# Coverage check — every character the app renders must exist in the subset.
python3 - "$OUT" "$CHARSET" <<'EOF'
import sys
from fontTools.ttLib import TTFont
out, charset = sys.argv[1], sys.argv[2]
cmap = TTFont(out, lazy=True).getBestCmap()
need = open(charset, encoding="utf-8").read()
missing = sorted({c for c in need if ord(c) not in cmap})
if missing:
    print("FAIL: %d characters missing from subset: %s" % (len(missing), "".join(missing)))
    sys.exit(1)
print("coverage OK: all %d characters present" % len({*need}))
EOF

echo "wrote $OUT ($(du -h "$OUT" | cut -f1))"
