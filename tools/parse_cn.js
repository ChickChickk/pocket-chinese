const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "source_1000.md");
const OUT_DATA = path.join(__dirname, "..", "js", "data.js");
const OUT_RAW = path.join(__dirname, "raw_rows.json");
const OUT_ENRICH = path.join(__dirname, "enrich.json");
const OUT_SAY = path.join(__dirname, "say_overrides.json");

const lines = fs.readFileSync(SRC, "utf8").split("\n");

// The 22 vocab sections in order (title -> short learner note)
const NOTES = {
  "Core grammar & function words": "The connective tissue of every sentence — pronouns, particles (的, 了, 過), and question words. Master these and you can frame almost anything.",
  "Essential verbs": "The highest-frequency verbs. Chinese verbs never conjugate — 吃 stays 吃 for past, present, or future; particles and time words carry the meaning.",
  "Actions & daily verbs": "Concrete everyday actions — take, put, wash, cook, click. The building blocks of describing what you do all day.",
  "Common adjectives": "Describing words. In Chinese an adjective can be a full predicate on its own: 這個很大 needs no verb 'to be'.",
  "Adverbs, frequency & degree": "The words that fine-tune a sentence — very, always, already, immediately. Small words that make speech sound native.",
  "Numbers, time & dates": "Numbers, clock time, days, and dates. Taiwan says 星期 for weekday and counts dates as 月 + 號.",
  "Measure words": "Chinese counts nouns with a measure word between the number and the noun — 一本書, 三張票. Learn each noun with its measure word.",
  "People, family & relationships": "Family, friends, and roles. Taiwanese address elders and strangers with kinship terms as a sign of warmth.",
  "Food & drinks": "Food is at the heart of Taiwanese life. 吃飽了嗎？(Have you eaten?) is asked as casually as 'how are you?'",
  "Dining & cooking": "Ordering, paying, and cooking. 內用 or 外帶？(dine in or take out?) is the first thing you'll be asked.",
  "Home & daily life": "Around the home — rooms, furniture, appliances, and the daily routine.",
  "Transportation & directions": "Getting around. Taiwan runs on the MRT (捷運), buses, and the YouBike — plus the trusty 悠遊卡.",
  "Shopping & money": "Shops, prices, payment, and returns. Remember to ask for your 發票 (receipt/invoice) — it doubles as a lottery ticket.",
  "Work & office": "The workplace — meetings, deadlines, documents, and accounts.",
  "Study & language": "School and language learning — the words you need to talk about learning Chinese itself.",
  "Health & body": "The body, symptoms, and seeing a doctor. Taiwan's 健保 (National Health Insurance) makes clinics cheap and easy.",
  "Technology & internet": "Devices, apps, and the internet — much of daily life in Taiwan runs through your phone.",
  "Places & public services": "Places around town and government offices — banks, post offices, and the paperwork of daily life.",
  "Weather & nature": "Weather, seasons, and the natural world. Taiwan has a rainy season and typhoon (颱風) season — keep an umbrella handy.",
  "Emotions & personality": "Feelings and character traits — how to say how you feel and describe the people around you.",
  "Conversation & social interaction": "The glue of everyday exchanges — greetings, thanks, apologies, and polite phrases.",
  "Problems, emergencies & abstract essentials": "Handling problems and higher-level abstract nouns for more precise expression."
};
const SECTION_ORDER = Object.keys(NOTES);
const SECTION_SET = new Set(SECTION_ORDER);

const themeIndex = {};
SECTION_ORDER.forEach((t, i) => (themeIndex[t] = i));

// Pass 1: parse rows, tagging each word with its THEME index.
const parsed = [];
const RAW = [];
let curTheme = -1;
let num = 0;
for (const line of lines) {
  const h = line.match(/^##\s+(.*?)\s*$/);
  if (h) { curTheme = SECTION_SET.has(h[1]) ? themeIndex[h[1]] : -1; continue; }
  if (curTheme < 0) continue;
  if (!line.startsWith("|")) continue;
  const cells = line.split("|").map((c) => c.trim());
  if (cells.length < 9) continue;
  if (!/^\d+$/.test(cells[1])) continue;
  num++;
  parsed.push({ num, theme: curTheme, hanzi: cells[2], zhuyin: cells[3], pinyin: cells[4], meaning: cells[5] });
  RAW.push({ num, theme: curTheme, section: SECTION_ORDER[curTheme], hanzi: cells[2], zhuyin: cells[3], pinyin: cells[4], meaning: cells[5], srcExample: cells[6], srcTranslation: cells[7], stage: cells[8] });
}

// Optional enrichment: enrich.json = { "<num>": { example:{hanzi,zhuyin,pinyin,en}, measure:{hanzi,zhuyin,pinyin}|null } }
let ENRICH = {};
if (fs.existsSync(OUT_ENRICH)) { try { ENRICH = JSON.parse(fs.readFileSync(OUT_ENRICH, "utf8")); } catch (e) { console.warn("enrich.json parse failed:", e.message); } }

// What to SPEAK when the bare 漢字 would be read with the wrong reading — see say_overrides.json.
let SAY = {};
if (fs.existsSync(OUT_SAY)) { try { SAY = JSON.parse(fs.readFileSync(OUT_SAY, "utf8")); } catch (e) { console.warn("say_overrides.json parse failed:", e.message); } }

// Pass 2: split each theme into study-set chapters of ~24 (max 26), even distribution.
const MAX = 26;
const CATEGORIES = [];
const WORDS = [];
for (let t = 0; t < SECTION_ORDER.length; t++) {
  const themeWords = parsed.filter((w) => w.theme === t);
  const nChunks = Math.ceil(themeWords.length / MAX);
  const size = Math.ceil(themeWords.length / nChunks);
  for (let c = 0; c < nChunks; c++) {
    const chunk = themeWords.slice(c * size, (c + 1) * size);
    if (!chunk.length) continue;
    const catId = CATEGORIES.length;
    const title = nChunks > 1 ? SECTION_ORDER[t] + " (" + (c + 1) + "/" + nChunks + ")" : SECTION_ORDER[t];
    CATEGORIES.push({ title, note: NOTES[SECTION_ORDER[t]], start: chunk[0].num, end: chunk[chunk.length - 1].num });
    for (const w of chunk) {
      const e = ENRICH[String(w.num)] || {};
      const sayOverride = (SAY[String(w.num)] || {}).say || null;
      WORDS.push({
        num: w.num, cat: catId, hanzi: w.hanzi, zhuyin: w.zhuyin, pinyin: w.pinyin, meaning: w.meaning,
        measure: e.measure || null,
        example: e.example || null,
        say: sayOverride // null = speak the hanzi itself
      });
    }
  }
}

const FACTS = [
  "Mandarin has no verb tenses — 吃 (eat) stays 吃 whether it happened yesterday, now, or tomorrow. Time words and particles do the work.",
  "Traditional characters often hide meaning clues: 好 (good) is 女 (woman) + 子 (child).",
  "Every Chinese syllable carries a tone — mā 媽 (mother) and mǎ 馬 (horse) differ only in tone.",
  "Zhuyin (ㄅㄆㄇㄈ) is the phonetic system taught in Taiwan — 37 symbols, learned before characters.",
  "Chinese counts nouns with a measure word: 一本書 (a book), 一張票 (a ticket), 一杯咖啡 (a cup of coffee)."
];

const header = "/* Pocket Chinese (Traditional / Taiwan) — 1,000 practical words.\n" +
  "   Headwords parsed from the source list; example sentences are being rewritten into natural\n" +
  "   native Taiwanese Mandarin (with zhuyin + pinyin) in reviewable batches. example:null = not yet enriched. */\n\n";

const body =
  "const CATEGORIES = " + JSON.stringify(CATEGORIES) + ";\n\n" +
  "const WORDS = " + JSON.stringify(WORDS) + ";\n\n" +
  "const FACTS = " + JSON.stringify(FACTS) + ";\n\n" +
  "window.DATA = { CATEGORIES, WORDS, FACTS };\n";

fs.writeFileSync(OUT_DATA, header + body);
fs.writeFileSync(OUT_RAW, JSON.stringify(RAW, null, 0));

// js/data.js is committed pretty-printed (see commit "Format JavaScript data files"). This
// generator emits compact JSON, so format it here — otherwise every regen reverts the repo's
// formatting and produces a useless 12k-line diff.
try {
  require("child_process").execSync('npx --no-install prettier --write "' + OUT_DATA + '"', { stdio: "pipe" });
  console.log("formatted js/data.js with prettier");
} catch (e) {
  console.warn("WARNING: prettier not available — js/data.js left unformatted, which will\n" +
               "         produce a huge diff against the committed pretty-printed version.\n" +
               "         Run: npx prettier --write js/data.js");
}

console.log("words:", WORDS.length, "chapters:", CATEGORIES.length);
console.log("per-chapter counts:", CATEGORIES.map((c, i) => WORDS.filter((w) => w.cat === i).length).join(","));
