// Prints every character the app renders in the CJK font: all hanzi/examples/measures/
// chapter titles+notes+facts from data.js, plus bopomofo, tone marks, and CJK punctuation.
const fs = require("fs");
const path = require("path");
const s = fs.readFileSync(path.join(__dirname, "..", "js", "data.js"), "utf8");
const grab = (name) => JSON.parse(s.match(new RegExp("const " + name + " = (\\[.*?\\]);", "s"))[1]);
const CATEGORIES = grab("CATEGORIES"), WORDS = grab("WORDS"), FACTS = grab("FACTS");

const set = new Set();
const add = (t) => { if (t) for (const ch of t) set.add(ch); };
for (const w of WORDS) { add(w.hanzi); if (w.measure) add(w.measure.hanzi); if (w.example) { add(w.example.hanzi); add(w.example.zhuyin); } }
for (const c of CATEGORIES) { add(c.title); add(c.note); }
FACTS.forEach(add);

// bopomofo block ㄅ–ㄩ (U+3105–U+312F) + tone marks + common CJK punctuation + middle dot
for (let cp = 0x3105; cp <= 0x312f; cp++) set.add(String.fromCodePoint(cp));
for (const ch of "ˊˇˋ˙·，。、？！；：「」『』（）〈〉《》—…～－") set.add(ch);

// keep only non-ASCII (Latin handled by Newsreader/Mulish/Space Mono)
const chars = [...set].filter((c) => c.codePointAt(0) > 0x2000 || c === "·" || c.codePointAt(0) > 0x02c0);
process.stdout.write(chars.join(""));
