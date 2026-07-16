# CH→EN Word List Template (Traditional / Taiwan)

Fill in your words using the structure below. Each word is one object.
When you're done, hand this file back and I'll wire it into the app with no reformatting.

## Field reference

| Field | What it is | Notes |
|---|---|---|
| `num` | Stable ID, 1, 2, 3… | Never changes once assigned — SRS/progress keys off it. Just number them in order. |
| `cat` | Chapter index, starting at **0** | 0 = first chapter, 1 = second, etc. (See chapter list at bottom.) |
| `hanzi` | The word, **traditional** characters | e.g. `書`, `朋友` |
| `zhuyin` | Bopomofo, tone marks inline | e.g. `ㄕㄨ`, `ㄆㄥˊ ㄧㄡˇ` — space between syllables |
| `pinyin` | Pinyin with **tone marks**, citation tone | e.g. `shū`, `péngyǒu` — not tone numbers, not sandhi |
| `meaning` | English gloss | Keep it short: `book`, `friend`, `to eat` |
| `measure` | Measure word object, or `null` | `null` for verbs / adjectives / adverbs. Nouns get `{hanzi, zhuyin, pinyin}`. One canonical measure word each. |
| `example` | One example sentence, fully annotated | `{hanzi, zhuyin, pinyin, en}` — `en` is the English translation |

## Worked examples (copy this shape)

```js
// A noun WITH a measure word
{
  num: 1,
  cat: 0,
  hanzi:  "書",
  zhuyin: "ㄕㄨ",
  pinyin: "shū",
  meaning: "book",
  measure: { hanzi: "本", zhuyin: "ㄅㄣˇ", pinyin: "běn" },
  example: {
    hanzi:  "我有三本書。",
    zhuyin: "ㄨㄛˇ ㄧㄡˇ ㄙㄢ ㄅㄣˇ ㄕㄨ。",
    pinyin: "wǒ yǒu sān běn shū.",
    en:     "I have three books."
  }
},

// A verb WITHOUT a measure word
{
  num: 2,
  cat: 0,
  hanzi:  "吃",
  zhuyin: "ㄔ",
  pinyin: "chī",
  meaning: "to eat",
  measure: null,
  example: {
    hanzi:  "我想吃飯。",
    zhuyin: "ㄨㄛˇ ㄒㄧㄤˇ ㄔ ㄈㄢˋ。",
    pinyin: "wǒ xiǎng chī fàn.",
    en:     "I want to eat."
  }
},
```

## Blank row to copy

```js
{
  num: ,
  cat: ,
  hanzi:  "",
  zhuyin: "",
  pinyin: "",
  meaning: "",
  measure: null,   // or { hanzi: "", zhuyin: "", pinyin: "" }
  example: { hanzi: "", zhuyin: "", pinyin: "", en: "" }
},
```

## Chapters (edit freely — these are just a starting scaffold)

List your chapter titles here in order; the index is the `cat` value.

```
0 — (your first chapter title)
1 —
2 —
...
```

> Tip: you don't have to fill `zhuyin`/`pinyin` perfectly by hand — if you give me
> `hanzi` + `meaning` + `example.hanzi` + `en`, I can draft the Taiwan-standard
> zhuyin/pinyin and measure words for you to check. But since you said you'll
> supply fully-annotated data, this template assumes you're filling it all in.
