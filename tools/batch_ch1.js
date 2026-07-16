const fs = require("fs");
const { convert } = require("./pinyin2zhuyin.js");
const ENRICH_PATH = __dirname + "/enrich.json";

// [num, hanzi, pinyin(syllable-spaced, no punctuation), english, measure|null]
const BATCH = [
  [1, "我是學生。", "wǒ shì xué shēng", "I am a student.", null],
  [2, "你今天有空嗎？", "nǐ jīn tiān yǒu kòng ma", "Are you free today?", null],
  [3, "他住在台北。", "tā zhù zài tái běi", "He lives in Taipei.", null],
  [4, "她是我的同事。", "tā shì wǒ de tóng shì", "She is my coworker.", null],
  [5, "我們一起吃飯吧。", "wǒ men yì qǐ chī fàn ba", "Let's eat together.", null],
  [6, "你們準備好了嗎？", "nǐ men zhǔn bèi hǎo le ma", "Are you all ready?", null],
  [7, "他們已經到了。", "tā men yǐ jīng dào le", "They have already arrived.", null],
  [8, "這是我的手機。", "zhè shì wǒ de shǒu jī", "This is my phone.", null],
  [9, "那家店很好吃。", "nà jiā diàn hěn hǎo chī", "That restaurant is really good.", null],
  [10, "你要哪一個？", "nǐ yào nǎ yí ge", "Which one do you want?", null],
  [11, "門口的人是誰？", "mén kǒu de rén shì shuí", "Who is the person at the door?", null],
  [12, "你想吃什麼？", "nǐ xiǎng chī shén me", "What do you want to eat?", null],
  [13, "最近的捷運站在哪裡？", "zuì jìn de jié yùn zhàn zài nǎ lǐ", "Where is the nearest MRT station?", null],
  [14, "這個字怎麼念？", "zhè ge zì zěn me niàn", "How is this character pronounced?", null],
  [15, "你為什麼遲到？", "nǐ wèi shén me chí dào", "Why are you late?", null],
  [16, "你有幾個兄弟姊妹？", "nǐ yǒu jǐ ge xiōng dì jiě mèi", "How many siblings do you have?", null],
  [17, "這件衣服多少錢？", "zhè jiàn yī fú duō shǎo qián", "How much is this piece of clothing?", null],
  [18, "這是我的書。", "zhè shì wǒ de shū", "This is my book.", null],
  [19, "我吃過晚餐了。", "wǒ chī guò wǎn cān le", "I've eaten dinner.", null],
  [20, "我去過台南。", "wǒ qù guò tái nán", "I've been to Tainan.", null],
  [21, "門一直開著。", "mén yì zhí kāi zhe", "The door is standing open.", null],
  [22, "你會說中文嗎？", "nǐ huì shuō zhōng wén ma", "Can you speak Chinese?", null],
  [23, "我很好，你呢？", "wǒ hěn hǎo nǐ ne", "I'm fine — and you?", null],
  [24, "我們先休息一下吧。", "wǒ men xiān xiū xí yí xià ba", "Let's take a break first.", null]
];

const enrich = fs.existsSync(ENRICH_PATH) ? JSON.parse(fs.readFileSync(ENRICH_PATH, "utf8")) : {};
for (const [num, hanzi, pinyin, en, measure] of BATCH) {
  const zhuyin = convert(pinyin);
  if (zhuyin.indexOf("null") >= 0) { console.error("BAD conversion for", num, pinyin, "->", zhuyin); process.exit(1); }
  enrich[String(num)] = { example: { hanzi, zhuyin, pinyin, en }, measure };
}
fs.writeFileSync(ENRICH_PATH, JSON.stringify(enrich, null, 1));
console.log("enriched", BATCH.length, "words; total enriched now:", Object.keys(enrich).length);
console.log("sample #5 zhuyin:", enrich["5"].example.zhuyin);
console.log("sample #13 zhuyin:", enrich["13"].example.zhuyin);
