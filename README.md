# Pocket Chinese (Traditional / Taiwan)

A friendly, interactive pocket guide for beginners learning **Taiwanese Mandarin** —
with zhuyin (注音) + pinyin, tap-to-hear pronunciation, spaced-repetition flashcards,
quizzes, and a grammar reference.

A standalone fork of the Pocket Indonesian app, reusing its engine (SRS, flashcards,
quiz, progress, theming) with a Chinese-specific content and rendering layer.

**No build step, no dependencies.** Plain HTML, CSS, and JavaScript — open
`index.html` in a browser and it just works.

## Features

- **Words** — **1,000 practical words** across **42 themed chapters** (~24 words each), reached
  from Home's Contents list or the Continue button.
  Each card shows the 漢字, 注音·拼音, meaning, its measure word (for nouns), and a natural
  example sentence with pinyin.
- **Flashcards** with spaced repetition — front = 漢字 only (recognition); tap to reveal
  zhuyin + pinyin + meaning + example. Rate *Again* / *Got it*; tricky cards resurface sooner.
- **Quiz** in three reading modes: multiple choice (漢字 → meaning), pick-the-word
  (meaning → 漢字), and type-it (meaning → **type the 漢字**, the way Chinese is really typed:
  pinyin into your IME, which commits characters. Needs a Chinese keyboard/輸入法; spaces and
  any punctuation the IME commits are ignored).
- **Practice** (own section) — **7 chapters mirroring the 7 pattern groups, 125 fill-in-the-blank
  questions: exactly one per pattern.** Each chapter opens with a short explanation of what it
  drills. The English is withheld until you check — every sentence is solvable from the Chinese
  alone — and each checked answer links back to the pattern it tests.
- **Grammar** — a reference section with:
  - **注音 Zhuyin chart** — all initials 聲母 + finals 韻母 + tones 聲調, each with pinyin, an
    [IPA] sound, and **tap-to-hear audio** (aspirated pairs like ㄅ/ㄆ are marked 送氣 · puff).
  - **125 essential patterns** in 7 groups — function, structure formula, example, and a common warning.
  - **Contrasts** — side-by-side comparison of easily-confused patterns (才/就, 會/能/可以, 了/過/著…).
- **Audio** — Taiwanese Mandarin (`zh-TW`) text-to-speech, using Mei-Jia (macOS's standard
  Taiwan voice) where available and falling back through other Taiwan voices; it never drops to
  a mainland (zh-CN) voice while a Taiwan one exists. Sentences read slowly (0.6) for following
  along; single words and syllables read a little faster (0.8), since a compact voice slowed
  further smears the vowel and ㄅ "bo" starts to sound like "be".
- **Typeface** — Chinese renders in **TW-Kai (全字庫正楷體)**, Taiwan's official standard-glyph
  Kai font, **bundled as a subset** (`fonts/tw-kai-subset.woff2`) so it looks identical on every
  device. System Kai fonts are only a last-resort fallback.
- **Progress** tracking, daily streak + goal, word of the day, favorites, and search
  (漢字 / zhuyin / pinyin / meaning). All saved locally in the browser (namespaced `hua_`).
- **Print / Save as PDF** produces a clean linear book.
- **Light / Sepia / Dark** themes.

## Project structure

```
index.html         Markup shell
css/styles.css     All styling (theme variables + components)
js/data.js         1,000 words + 42 chapters (generated — see tools/)
js/grammar.js      Zhuyin chart + 125 grammar patterns (generated)
js/app.js          Application logic (vanilla JS)
fonts/             Bundled TW-Kai subset goes here (see fonts/README.md)
tools/             Reproducible data pipeline (see below)
```

## Data pipeline (`tools/`)

The word and grammar data is generated from source Markdown, so it's reproducible:

- `parse_cn.js` — builds `js/data.js` from `source_1000.md`, splitting the themes into
  ~24-word chapters and merging enrichment from `enrich.json`.
- `parse_grammar.js` — builds `js/grammar.js` from `grammar_src.md` (patterns, contrasts,
  practice) plus the zhuyin chart.
- `pinyin2zhuyin.js` — deterministic pinyin(tone-marks) → zhuyin converter, validated 100 %
  against the source data by `validate.js`. Used to annotate example sentences reliably.
- `batch_*.js` — author natural example sentences → generate zhuyin → merge into `enrich.json`.
- `make_font_subset.sh` + `build_charset.js` — subset TW-Kai to only the characters used.

## The bundled TW-Kai font (required)

`fonts/tw-kai-subset.woff2` (~610 KB) **must be committed and deployed.** Relying on system
Kai fonts does *not* work: a Mac has Kaiti/BiauKai and looks right, but phones have no Kai at
all and silently fall back to generic serif — so the site looks different per device.

Rebuild whenever new characters appear (e.g. after enriching more examples), or the new glyphs
fall back and the look breaks again:

```
tools/make_font_subset.sh /path/to/TW-Kai-98_1.ttf   # → fonts/tw-kai-subset.woff2
```

It regenerates the charset from `js/data.js`, `js/grammar.js`, `js/app.js` and `index.html`,
then verifies every character is covered and fails loudly if not.

Get TW-Kai from https://data.gov.tw/dataset/5961 — use the BMP file `TW-Kai-98_1.ttf`.
⚠️ Not `ebas927.ttf` / 全字庫說文解字 (EBAS): that one is ancient **seal script**, not 楷體.
See [fonts/README.md](fonts/README.md) for details.

## Status / roadmap

- **Words: complete.** All 1,000 have a natural example sentence with pinyin (every one
  unique), and all 370 countable nouns carry their measure word.
- **Grammar example pinyin** — the 125 pattern examples currently show 漢字 + English;
  pinyin annotation is pending.
- **Speaking quiz** (planned 4th mode) — read a character aloud; browser speech recognition
  offers a hint, then you self-rate. Not yet built.

## Credits

Content & code: Celia Ho. Engine adapted from Pocket Indonesian.

Typeface: **全字庫正楷體 (TW-Kai)** — 國家發展委員會「全字庫」, used under 政府資料開放授權條款
第1版 (Open Government Data License v1). https://www.cns11643.gov.tw
