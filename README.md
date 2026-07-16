# Pocket Chinese (Traditional / Taiwan)

A friendly, interactive pocket guide for beginners learning **Taiwanese Mandarin** —
with zhuyin (注音) + pinyin, tap-to-hear pronunciation, spaced-repetition flashcards,
quizzes, and a grammar reference.

A standalone fork of the Pocket Indonesian app, reusing its engine (SRS, flashcards,
quiz, progress, theming) with a Chinese-specific content and rendering layer.

**No build step, no dependencies.** Plain HTML, CSS, and JavaScript — open
`index.html` in a browser and it just works.

## Features

- **Browse** — **1,000 practical words** across **42 themed chapters** (~24 words each).
  Each card shows the 漢字, 注音·拼音, meaning, its measure word (for nouns), and a natural
  example sentence with pinyin.
- **Flashcards** with spaced repetition — front = 漢字 only (recognition); tap to reveal
  zhuyin + pinyin + meaning + example. Rate *Again* / *Got it*; tricky cards resurface sooner.
- **Quiz** in three reading modes: multiple choice (漢字 → meaning), pick-the-word
  (meaning → 漢字), and type-it (**type the pinyin** — toneless accepted, ü/v/u interchangeable —
  and the 漢字 is revealed).
- **Grammar** — a reference section with:
  - **注音 Zhuyin chart** — all initials 聲母 + finals 韻母 + tones 聲調, each with pinyin, an
    [IPA] sound, and **tap-to-hear audio** (aspirated pairs like ㄅ/ㄆ are marked 送氣 · puff).
  - **125 essential patterns** in 7 groups — function, structure formula, example, and a common warning.
  - **Contrasts** — side-by-side comparison of easily-confused patterns (才/就, 會/能/可以, 了/過/著…).
  - **Practice** — an interactive fill-in-the-blank exercise with instant feedback.
- **Audio** — Taiwanese Mandarin (`zh-TW`) text-to-speech, preferring a female voice
  (Mei-Jia / Google 國語（臺灣）), at a gentle learning pace.
- **Typeface** — Chinese renders in **Kai (楷體)**, the style used to teach characters in Taiwan
  (system Kai fallback now; optional bundled TW-Kai subset — see below).
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

## Bundling the TW-Kai font (optional)

Chinese already renders in Kai on any device that has a system Kai font. To guarantee the
**TW-Kai (全字庫正楷體)** look for *every* visitor (e.g. on phones), bundle a subset:

```
tools/make_font_subset.sh /path/to/TW-Kai.ttf   # → fonts/tw-kai-subset.woff2
```

TW-Kai is a free, openly-redistributable Taiwan government font
(https://www.cns11643.gov.tw → 字型下載 → 全字庫正楷體). Re-run after adding new characters.

## Status / roadmap

- **Words:** all 1,000 are in. **Natural example sentences** are being added in reviewable
  batches (the rest show 漢字 + zhuyin + pinyin + meaning until their example is written).
- **Grammar example pinyin** — the 125 pattern examples currently show 漢字 + English;
  pinyin annotation is pending.
- **Speaking quiz** (planned 4th mode) — read a character aloud; browser speech recognition
  offers a hint, then you self-rate. Not yet built.

## Credits

Content & code: Celia Ho. Engine adapted from Pocket Indonesian.
