# Pocket Chinese — Project Conclusion

_Traditional Chinese (Taiwan) → English learning app. Summary of the planning + build session, 2026-07-15._

## What this is

A **standalone fork** of the Pocket Indonesian app, rebuilt for learning **Taiwanese Mandarin**
(target = Chinese, glossed in English — the same pattern as the Indonesian app).

**Why a fork, not a multi-language switcher:** the learning engine (spaced-repetition flashcards,
quiz, browse, progress, theming) is small and reusable, but the content, pronunciation, and grammar
layers diverge hard from Indonesian. Abstracting a shared "engine + language pack" before a second
app exists would be guessing at the seam. So: build Chinese concretely first, ship it, and only
*then* decide whether to unify. Lives in its own repo (`~/Documents/PROJECT/learn-chinese/`).

## Settled design decisions

- **Traditional characters only (Taiwan)** — Taiwan MOE readings, `zh-TW` audio voice.
- **Both zhuyin and pinyin.** Pinyin uses **tone marks** (not numbers), **citation tones**
  (dictionary form, not sandhi — e.g. 你好 stored as `nǐ hǎo`).
- **Measure words included**, fully annotated with their own hanzi/zhuyin/pinyin; `null` for
  verbs/adjectives/adverbs.
- **Data is user-supplied and fully annotated.** Per-word schema:
  `num, cat, hanzi, zhuyin, pinyin, meaning, measure {hanzi,zhuyin,pinyin}|null, example {hanzi,zhuyin,pinyin,en}`.
- **Flashcards:** front = hanzi only (forces recognition); back = zhuyin + pinyin + meaning + example.
- **Reading quiz modes:** multiple choice (hanzi→meaning), pick-the-word (meaning→hanzi),
  type-it (**type pinyin** the way an IME accepts it — toneless OK, ü/v/u interchangeable — reveals hanzi).
- **Speaking quiz (planned):** show hanzi → read aloud → browser speech recognition shows
  "Heard: …" as a **hint, never a hard fail** → reveal + play native audio → self-rate.
  Falls back to pure shadowing if no mic/ASR.

## What's built and browser-verified

- New standalone repo, seeded from the Indonesian engine, with the schema above.
- `js/data.js` holds **8 sample words** (書 吃 朋友 水 老師 貓 大 喝) to prove the app end to end.
- Home / branding (繁 Pocket Chinese), browse word cards, flashcards, all three reading quiz
  modes (type-it toneless matching verified), `zh-TW` voice, `hua_` storage prefix, search, print book.
- Verified live in Chrome via Playwright — renders cleanly, no errors.

## What's left

1. **The real word list** — replace the 8 samples (fill `WORDS_TEMPLATE.md`).
2. **Speaking quiz** — the 4th mode (mic + ASR hint); net-new code, not yet built.
   Privacy note: this mode sends mic audio to the browser's speech service — the app's
   "nothing sent anywhere" claim will need a carve-out.
3. **Chinese grammar section** — the Indonesian grammar code is still present but unreachable
   (removed from nav); replace with measure words, 了/過/著 aspect, tones, etc.

## Next step

**Deliver the word list.** It drops straight into `js/data.js` and renders immediately.
The engine, schema, and reading quizzes are done and waiting on the vocabulary.
