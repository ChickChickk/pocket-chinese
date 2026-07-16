# Fonts

`tw-kai-subset.woff2` — a subset of **TW-Kai (全字庫正楷體)**, the Taiwan
government's official standard-glyph Kai font, containing only the ~1,000
characters this app renders. It's referenced via `@font-face` in `css/styles.css`
and is the display face for all Chinese text; system Kai fonts (Windows 標楷體,
macOS Kaiti TC) are the fallback if it's missing.

## Regenerating

The subset must be rebuilt whenever `js/data.js` gains new characters (e.g. after
enriching more example sentences):

```
tools/make_font_subset.sh /path/to/TW-Kai.ttf
```

Get TW-Kai from the 全字庫 site (https://www.cns11643.gov.tw → 字型下載 →
全字庫正楷體). It's an open government font, free to redistribute.
