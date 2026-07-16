// Prints every non-Latin character the app can render, so the CJK font subset covers all of it.
// Scans the SOURCE FILES as raw text (robust to data formatting changes) rather than parsing
// structures — data.js/grammar.js are generated and their literal format has changed before.
// Must cover EVERY file with rendered Chinese, or those glyphs fall back to a system font and
// the page looks different across devices. Re-run via make_font_subset.sh when new chars appear.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const FILES = ["js/data.js", "js/grammar.js", "js/app.js", "index.html"];

const set = new Set();
const inRange = (cp) =>
  (cp >= 0x4e00 && cp <= 0x9fff) ||   // CJK Unified Ideographs
  (cp >= 0x3400 && cp <= 0x4dbf) ||   // CJK Ext A
  (cp >= 0xf900 && cp <= 0xfaff) ||   // CJK Compatibility Ideographs
  (cp >= 0x3105 && cp <= 0x312f) ||   // Bopomofo
  (cp >= 0x31a0 && cp <= 0x31bf) ||   // Bopomofo Extended
  (cp >= 0x3000 && cp <= 0x303f) ||   // CJK punctuation 。、「」…
  (cp >= 0xff00 && cp <= 0xffef) ||   // Fullwidth forms ？！：；
  cp === 0x00b7 ||                    // ·
  cp === 0x02c7 || cp === 0x02ca || cp === 0x02cb || cp === 0x02d9; // ˇ ˊ ˋ ˙ tone marks

for (const rel of FILES) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) { console.error("skip (missing): " + rel); continue; }
  for (const ch of fs.readFileSync(p, "utf8")) {
    if (inRange(ch.codePointAt(0))) set.add(ch);
  }
}

// Always include standard bopomofo ㄅ–ㄩ (U+3105–U+3129) + tone marks, even if not all are used
// yet. (U+312E/U+312F are obsolete letters TW-Kai has no glyphs for — never used in Mandarin.)
for (let cp = 0x3105; cp <= 0x3129; cp++) set.add(String.fromCodePoint(cp));
for (const ch of "ˊˇˋ˙·，。、？！；：「」『』（）〈〉《》—…～－") set.add(ch);

const chars = [...set].sort();
console.error("charset: " + chars.length + " characters from " + FILES.join(", "));
process.stdout.write(chars.join(""));
