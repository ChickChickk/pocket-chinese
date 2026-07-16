# Fonts

`tw-kai-subset.woff2` — a subset of **TW-Kai (全字庫正楷體)**, the Taiwan government's
official standard-glyph Kai font, containing only the ~1,080 characters this app renders
(hanzi, bopomofo, CJK punctuation). Referenced via `@font-face` in `css/styles.css`; it is
the display face for all Chinese text.

**This file must be committed and deployed.** It is what makes the app look the same on
every device. Without it the `@font-face` 404s and each device falls back to whatever
system Kai font it happens to have — a Mac has Kaiti/BiauKai and looks correct, while a
phone has no Kai at all and silently renders generic serif. The system fonts listed after
`TW-Kai` in `--cjk` are only a last-resort fallback, not the plan.

## Regenerating

Rebuild whenever new characters appear (e.g. after enriching more example sentences), or
those glyphs will fall back and break the consistent look:

```
tools/make_font_subset.sh /path/to/TW-Kai-98_1.ttf
```

The script rebuilds the charset from `js/data.js`, `js/grammar.js`, `js/app.js` and
`index.html`, then **verifies every needed character is present**, failing loudly if not.

## Getting TW-Kai

Dataset: https://data.gov.tw/dataset/5961 (全字庫). Use the BMP file **`TW-Kai-98_1.ttf`**
(~50 MB). The `*.ttf` sources are gitignored — only the small subset ships.

⚠️ Do **not** use `ebas927.ttf` / **全字庫說文解字 (EBAS)** from the same site — despite being
in the 全字庫 family, that font is ancient **seal script (小篆)**, not 楷體.

## License / attribution

TW-Kai is released under **政府資料開放授權條款第1版 (Open Government Data License v1)**
or the **SIL Open Font License 1.1** — the publisher offers both, and either permits
subsetting and redistribution with attribution.

> 字型：全字庫正楷體 (TW-Kai)，國家發展委員會「全字庫」，
> 依政府資料開放授權條款第1版授權。https://www.cns11643.gov.tw
