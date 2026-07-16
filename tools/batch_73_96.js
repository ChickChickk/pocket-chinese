const fs = require("fs");
const { convert } = require("./pinyin2zhuyin.js");
const ENRICH_PATH = __dirname + "/enrich.json";

const BATCH = [
  [73, "我想先了解工作內容。", "wǒ xiǎng xiān liǎo jiě gōng zuò nèi róng", "I want to understand the job first.", null],
  [74, "這個文法我不太懂。", "zhè ge wén fǎ wǒ bú tài dǒng", "I don't really understand this grammar.", null],
  [75, "我想喝一杯咖啡。", "wǒ xiǎng hē yì bēi kā fēi", "I'd like to drink a cup of coffee.", null],
  [76, "我覺得這個方法很好。", "wǒ jué de zhè ge fāng fǎ hěn hǎo", "I think this method is good.", null],
  [77, "我相信你可以做到。", "wǒ xiāng xìn nǐ kě yǐ zuò dào", "I believe you can do it.", null],
  [78, "記得明天帶證件。", "jì de míng tiān dài zhèng jiàn", "Remember to bring your ID tomorrow.", null],
  [79, "我忘記帶雨傘了。", "wǒ wàng jì dài yǔ sǎn le", "I forgot to bring an umbrella.", null],
  [80, "我要一份雞肉便當。", "wǒ yào yí fèn jī ròu biàn dāng", "I'd like one chicken lunchbox.", null],
  [81, "我需要你的幫助。", "wǒ xū yào nǐ de bāng zhù", "I need your help.", null],
  [82, "這裡可以拍照嗎？", "zhè lǐ kě yǐ pāi zhào ma", "May I take photos here?", null],
  [83, "我會說一點中文。", "wǒ huì shuō yì diǎn zhōng wén", "I can speak a little Chinese.", null],
  [84, "你今天能來嗎？", "nǐ jīn tiān néng lái ma", "Are you able to come today?", null],
  [85, "你應該早點休息。", "nǐ yīng gāi zǎo diǎn xiū xí", "You should rest earlier.", null],
  [86, "進去以前必須買票。", "jìn qù yǐ qián bì xū mǎi piào", "You must buy a ticket before going in.", null],
  [87, "我願意試試看。", "wǒ yuàn yì shì shì kàn", "I'm willing to give it a try.", null],
  [88, "我很喜歡台灣小吃。", "wǒ hěn xǐ huān tái wān xiǎo chī", "I really like Taiwanese snacks.", null],
  [89, "我愛我的家人。", "wǒ ài wǒ de jiā rén", "I love my family.", null],
  [90, "我討厭塞車。", "wǒ tǎo yàn sāi chē", "I hate traffic jams.", null],
  [91, "希望明天天氣很好。", "xī wàng míng tiān tiān qì hěn hǎo", "I hope the weather is nice tomorrow.", null],
  [92, "我決定接受這份工作。", "wǒ jué dìng jiē shòu zhè fèn gōng zuò", "I've decided to accept this job.", null],
  [93, "你可以選擇不同的方案。", "nǐ kě yǐ xuǎn zé bù tóng de fāng àn", "You can choose a different option.", null],
  [94, "我正在準備明天的面試。", "wǒ zhèng zài zhǔn bèi míng tiān de miàn shì", "I'm preparing for tomorrow's interview.", null],
  [95, "會議九點開始。", "huì yì jiǔ diǎn kāi shǐ", "The meeting starts at nine.", null],
  [96, "請繼續說。", "qǐng jì xù shuō", "Please go on.", null]
];

const enrich = fs.existsSync(ENRICH_PATH) ? JSON.parse(fs.readFileSync(ENRICH_PATH, "utf8")) : {};
let bad = 0;
for (const [num, hanzi, pinyin, en, measure] of BATCH) {
  const zhuyin = convert(pinyin);
  if (zhuyin.indexOf("null") >= 0) { console.error("BAD:", num, pinyin, "->", zhuyin); bad++; continue; }
  enrich[String(num)] = { example: { hanzi, zhuyin, pinyin, en }, measure };
}
if (bad) { console.error(bad, "bad — aborting"); process.exit(1); }
fs.writeFileSync(ENRICH_PATH, JSON.stringify(enrich, null, 1));
console.log("added", BATCH.length, "; total enriched:", Object.keys(enrich).length);
