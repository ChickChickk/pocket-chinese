const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "grammar_src.md");
const OUT = path.join(__dirname, "..", "js", "grammar.js");
const ENRICH = path.join(__dirname, "grammar_enrich.json"); // { "<n>": "authored pinyin" }

const lines = fs.readFileSync(SRC, "utf8").split("\n");
const enrich = fs.existsSync(ENRICH) ? JSON.parse(fs.readFileSync(ENRICH, "utf8")) : {};

const groups = [];
let curGroup = null, curPat = null, field = null, quote = [];

function flushPat() {
  if (!curPat) return;
  curPat.example = { hanzi: (quote[0] || "").trim(), en: (quote[1] || "").trim(), pinyin: enrich[String(curPat.n)] || null };
  delete curPat._quote;
  curGroup.patterns.push(curPat);
  curPat = null; quote = [];
}

let mode = "patterns";
const comparisons = [], stages = [];
// Practice is chaptered: "## Chapter: <title>", an "intro:" paragraph, then one table row per
// pattern — | # | sentence with ___ | answer (／ splits multiple blanks) | English |
const practice = [];
let curPC = null, introLines = null;
const flushIntro = () => { if (curPC && introLines) { curPC.intro = introLines.join(" ").replace(/\s+/g, " ").trim(); introLines = null; } };

for (let raw of lines) {
  const line = raw.replace(/\s+$/, "");
  let m;
  if ((m = line.match(/^# (\d+)\. (.+)$/))) { flushPat(); curGroup = { title: m[2], patterns: [] }; groups.push(curGroup); mode = "patterns"; continue; }
  if (line === "# Quick comparisons") { flushPat(); mode = "comparisons"; continue; }
  if (line === "# Practice") { flushPat(); mode = "practice"; continue; }
  if (line === "# Suggested learning order") { flushIntro(); mode = "stages"; continue; }

  if (mode === "patterns") {
    if ((m = line.match(/^## (\d+)\. (.+)$/))) { flushPat(); curPat = { n: +m[1], pattern: m[2].trim() }; field = null; quote = []; continue; }
    if (!curPat) continue;
    if ((m = line.match(/^\*\*Function:\*\*\s*(.+)$/))) { curPat.func = m[1].trim(); continue; }
    if ((m = line.match(/^\*\*Structure:\*\*\s*`?(.+?)`?\s*$/))) { curPat.structure = m[1].trim(); continue; }
    if ((m = line.match(/^\*\*Common warning:\*\*\s*(.+)$/))) { curPat.warning = m[1].trim(); continue; }
    if (line.startsWith(">")) { quote.push(line.replace(/^>\s?/, "").replace(/\s*$/, "")); continue; }
  } else if (mode === "comparisons") {
    if ((m = line.match(/^\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/))) {
      if (/^-+$/.test(m[1].replace(/[|\s-]/g, "-")) || m[1] === "Pair") continue;
      comparisons.push({ pair: m[1], diff: m[2] });
    }
  } else if (mode === "practice") {
    if ((m = line.match(/^## Chapter:\s*(.+)$/))) {
      flushIntro();
      curPC = { title: m[1].trim(), intro: "", items: [] };
      practice.push(curPC);
      continue;
    }
    if (!curPC) continue;
    if ((m = line.match(/^intro:\s*(.+)$/))) { introLines = [m[1]]; continue; }
    // the intro wraps over several lines until a blank line or the table starts
    if (introLines && line && !line.startsWith("|")) { introLines.push(line.trim()); continue; }
    if (introLines && (!line || line.startsWith("|"))) flushIntro();
    if ((m = line.match(/^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/))) {
      curPC.items.push({
        n: +m[1],                                                   // the pattern it drills
        sentence: m[2].trim(),
        answer: m[3].split(/[／/]/).map((x) => x.trim()).filter(Boolean),
        en: m[4].trim(),                                            // revealed on check only
      });
    }
  } else if (mode === "stages") {
    if ((m = line.match(/^-\s*(.+)$/))) stages.push(m[1].replace(/\*\*/g, "").trim());
  }
}
flushPat();
flushIntro(); // in case the file ends without a following section

// Zhuyin (注音符號) reference — [symbol, pinyin, IPA sound, hanzi-to-speak]
// The 4th value is a real syllable the zh-TW TTS can pronounce (initials use the
// traditional recitation reading: ㄅ→波 bo, ㄆ→坡 po…; finals use their standalone reading).
const ZHUYIN = {
  initials: [
    ["ㄅ","b","p","波"],["ㄆ","p","pʰ","坡"],["ㄇ","m","m","摸"],["ㄈ","f","f","佛"],["ㄉ","d","t","的"],["ㄊ","t","tʰ","特"],["ㄋ","n","n","呢"],
    ["ㄌ","l","l","勒"],["ㄍ","g","k","哥"],["ㄎ","k","kʰ","科"],["ㄏ","h","x","喝"],["ㄐ","j","tɕ","基"],["ㄑ","q","tɕʰ","欺"],["ㄒ","x","ɕ","西"],
    ["ㄓ","zh","tʂ","知"],["ㄔ","ch","tʂʰ","吃"],["ㄕ","sh","ʂ","師"],["ㄖ","r","ʐ","日"],["ㄗ","z","ts","資"],["ㄘ","c","tsʰ","疵"],["ㄙ","s","s","思"]
  ],
  finals: [
    ["ㄚ","a","a","啊"],["ㄛ","o","ɔ","喔"],["ㄜ","e","ɤ","鵝"],["ㄝ","ê","ɛ","耶"],["ㄞ","ai","aɪ","愛"],["ㄟ","ei","eɪ","誒"],["ㄠ","ao","ɑʊ","熬"],
    ["ㄡ","ou","ɤʊ","歐"],["ㄢ","an","an","安"],["ㄣ","en","ən","恩"],["ㄤ","ang","ɑŋ","昂"],["ㄥ","eng","əŋ","鞥"],["ㄦ","er","ɑɻ","兒"],
    ["ㄧ","i / yi","i","衣"],["ㄨ","u / wu","u","屋"],["ㄩ","ü / yu","y","魚"],
    ["ㄧㄚ","ia / ya","ia","呀"],["ㄧㄝ","ie / ye","iɛ","耶"],["ㄧㄠ","iao / yao","iaʊ","腰"],["ㄧㄡ","iu / you","iɤʊ","憂"],
    ["ㄧㄢ","ian / yan","iɛn","煙"],["ㄧㄣ","in / yin","in","因"],["ㄧㄤ","iang / yang","iaŋ","央"],["ㄧㄥ","ing / ying","iŋ","英"],
    ["ㄨㄚ","ua / wa","ua","挖"],["ㄨㄛ","uo / wo","uɔ","窩"],["ㄨㄞ","uai / wai","uai","歪"],["ㄨㄟ","ui / wei","ueɪ","威"],
    ["ㄨㄢ","uan / wan","uan","彎"],["ㄨㄣ","un / wen","uən","溫"],["ㄨㄤ","uang / wang","uaŋ","汪"],["ㄨㄥ","ong / weng","ʊŋ","翁"],
    ["ㄩㄝ","üe / yue","yœ","約"],["ㄩㄢ","üan / yuan","yɛn","冤"],["ㄩㄣ","ün / yun","yn","暈"],["ㄩㄥ","iong / yong","iʊŋ","用"]
  ],
  tones: [
    ["(none)","1st tone · high level","ㄇㄚ · mā","steady and high","媽"],
    ["ˊ","2nd tone · rising","ㄇㄚˊ · má","rises, like a question","麻"],
    ["ˇ","3rd tone · low-dipping","ㄇㄚˇ · mǎ","dips down, then up","馬"],
    ["ˋ","4th tone · falling","ㄇㄚˋ · mà","sharp, falling","罵"],
    ["˙","neutral · light","ㄇㄚ˙ · ma","short and soft","嗎"]
  ]
};

const GRAMMAR = { zhuyin: ZHUYIN, groups, comparisons, practice, stages };
const nPat = groups.reduce((s, g) => s + g.patterns.length, 0);

fs.writeFileSync(OUT, "window.DATA = window.DATA || {};\nwindow.DATA.GRAMMAR = " + JSON.stringify(GRAMMAR) + ";\n");
console.log("groups:", groups.length, "patterns:", nPat, "comparisons:", comparisons.length, "practice:", practice.length, "stages:", stages.length);
console.log("group sizes:", groups.map((g) => g.patterns.length).join(","));
