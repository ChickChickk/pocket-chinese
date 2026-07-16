# Pocket Chinese (Traditional / Taiwan)

A friendly, interactive pocket guide for beginners learning **Taiwanese Mandarin** —
with zhuyin + pinyin, tap-to-hear pronunciation, spaced-repetition flashcards, and quizzes.

A standalone fork of the Pocket Indonesian app, reusing its engine (SRS, flashcards,
quiz, progress, theming) with a Chinese-specific content and rendering layer.

**No build step, no dependencies.** Plain HTML, CSS, and JavaScript — open
`index.html` in a browser and it just works.

## Word schema (`js/data.js`)

Each word is fully annotated. Fill `WORDS` using this shape (see `WORDS_TEMPLATE.md`):

```js
{
  num, cat,
  hanzi, zhuyin, pinyin, meaning,
  measure: { hanzi, zhuyin, pinyin } | null,   // null for verbs/adjectives/adverbs
  example: { hanzi, zhuyin, pinyin, en }
}
```

- Traditional characters (Taiwan), Taiwan MOE readings.
- Pinyin uses **tone marks**, citation tones (e.g. 你好 → `nǐ hǎo`).
- `js/data.js` currently holds **8 sample words** to prove the app end to end — replace with the real list.

## What's wired

- **Browse / chapters** — word cards showing hanzi, zhuyin·pinyin, meaning, measure-word line, fully-annotated example.
- **Flashcards** (SRS) — front = hanzi only (recognition); back = zhuyin + pinyin + meaning + example.
- **Quiz — reading modes:** multiple choice (hanzi→meaning), pick-the-word (meaning→hanzi), type-it (**type pinyin**, toneless accepted, ü/v/u interchangeable, reveals hanzi).
- **Audio** — `zh-TW` speech synthesis reading the hanzi.
- **Progress**, streak, word of the day, favorites, search (hanzi / zhuyin / pinyin / meaning), print book.
- Storage namespaced under `hua_` (won't collide with the Indonesian app).

## TODO (not yet built)

- **Speaking quiz** (4th mode): show hanzi → read aloud → `webkitSpeechRecognition` (`zh-TW`)
  shows "Heard: …" as a **hint, never a hard fail** → reveal + play native audio → self-rate.
  Must fall back to pure shadowing when ASR/mic is unavailable. **Privacy:** this mode sends mic
  audio to the browser speech service — the "nothing sent anywhere" claim needs a carve-out.
- **Chinese grammar section** — the Indonesian grammar code is still present but unreachable (grammar
  removed from nav). Replace with measure words, 了/過/著 aspect, tones, etc.
- Real word list + chapter structure.

## Credits

Content & code: Celia Ho. Engine adapted from Pocket Indonesian.
