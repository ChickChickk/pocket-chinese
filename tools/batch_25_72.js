const fs = require("fs");
const { convert } = require("./pinyin2zhuyin.js");
const ENRICH_PATH = __dirname + "/enrich.json";

const BATCH = [
  [25, "好漂亮啊！", "hǎo piào liàng a", "It's so beautiful!", null],
  [26, "我也想去。", "wǒ yě xiǎng qù", "I want to go too.", null],
  [27, "大家都知道這件事。", "dà jiā dōu zhī dào zhè jiàn shì", "Everyone knows about this.", null],
  [28, "他今天又遲到了。", "tā jīn tiān yòu chí dào le", "He was late again today.", null],
  [29, "我們明天再討論。", "wǒ men míng tiān zài tǎo lùn", "We'll discuss it again tomorrow.", null],
  [30, "我還沒吃早餐。", "wǒ hái méi chī zǎo cān", "I haven't eaten breakfast yet.", null],
  [31, "我下班後就回家。", "wǒ xià bān hòu jiù huí jiā", "I'll go home right after work.", null],
  [32, "他晚上十點才到家。", "tā wǎn shàng shí diǎn cái dào jiā", "He didn't get home until 10 p.m.", null],
  [33, "今天很冷。", "jīn tiān hěn lěng", "It's very cold today.", null],
  [34, "這杯咖啡太甜了。", "zhè bēi kā fēi tài tián le", "This coffee is too sweet.", null],
  [35, "這是我最喜歡的歌。", "zhè shì wǒ zuì xǐ huān de gē", "This is my favorite song.", null],
  [36, "今天比昨天更熱。", "jīn tiān bǐ zuó tiān gèng rè", "Today is hotter than yesterday.", null],
  [37, "這個方法比較簡單。", "zhè ge fāng fǎ bǐ jiào jiǎn dān", "This method is relatively simple.", null],
  [38, "我不喝咖啡。", "wǒ bù hē kā fēi", "I don't drink coffee.", null],
  [39, "我今天沒帶錢。", "wǒ jīn tiān méi dài qián", "I didn't bring money today.", null],
  [40, "別忘了帶護照。", "bié wàng le dài hù zhào", "Don't forget to bring your passport.", null],
  [41, "我只買了一杯茶。", "wǒ zhǐ mǎi le yì bēi chá", "I bought only one cup of tea.", null],
  [42, "他連自己的名字都寫錯了。", "tā lián zì jǐ de míng zì dōu xiě cuò le", "He even wrote his own name wrong.", null],
  [43, "我喜歡茶和咖啡。", "wǒ xǐ huān chá hé kā fēi", "I like tea and coffee.", null],
  [44, "你可以搭公車或捷運。", "nǐ kě yǐ dā gōng chē huò jié yùn", "You can take the bus or the MRT.", null],
  [45, "我很累，但是還要工作。", "wǒ hěn lèi dàn shì hái yào gōng zuò", "I'm tired, but I still have to work.", null],
  [46, "外面下雨，所以我帶了雨傘。", "wài miàn xià yǔ suǒ yǐ wǒ dài le yǔ sǎn", "It's raining, so I brought an umbrella.", null],
  [47, "因為塞車，我遲到了。", "yīn wèi sāi chē wǒ chí dào le", "I was late because of traffic.", null],
  [48, "如果有問題，請告訴我。", "rú guǒ yǒu wèn tí qǐng gào sù wǒ", "If there's a problem, please tell me.", null],
  [49, "我是印尼人。", "wǒ shì yìn ní rén", "I'm Indonesian.", null],
  [50, "我有兩個問題。", "wǒ yǒu liǎng ge wèn tí", "I have two questions.", null],
  [51, "我現在在公司。", "wǒ xiàn zài zài gōng sī", "I'm at the office right now.", null],
  [52, "我明天要去銀行。", "wǒ míng tiān yào qù yín háng", "I'm going to the bank tomorrow.", null],
  [53, "你什麼時候來台灣？", "nǐ shén me shí hòu lái tái wān", "When are you coming to Taiwan?", null],
  [54, "我晚上九點回家。", "wǒ wǎn shàng jiǔ diǎn huí jiā", "I get home at 9 p.m.", null],
  [55, "我們走路去車站。", "wǒ men zǒu lù qù chē zhàn", "We walk to the station.", null],
  [56, "我已經到公司了。", "wǒ yǐ jīng dào gōng sī le", "I've already arrived at the office.", null],
  [57, "請進來坐。", "qǐng jìn lái zuò", "Please come in and sit down.", null],
  [58, "他剛從房間出來。", "tā gāng cóng fáng jiān chū lái", "He just came out of the room.", null],
  [59, "我們坐電梯上樓。", "wǒ men zuò diàn tī shàng lóu", "We take the elevator upstairs.", null],
  [60, "我現在要下樓。", "wǒ xiàn zài yào xià lóu", "I'm going downstairs now.", null],
  [61, "請幫我開門。", "qǐng bāng wǒ kāi mén", "Please open the door for me.", null],
  [62, "離開前記得關燈。", "lí kāi qián jì de guān dēng", "Remember to turn off the light before you leave.", null],
  [63, "我每天坐捷運上班。", "wǒ měi tiān zuò jié yùn shàng bān", "I take the MRT to work every day.", null],
  [64, "請站在這裡等。", "qǐng zhàn zài zhè lǐ děng", "Please stand here and wait.", null],
  [65, "我晚上喜歡看電影。", "wǒ wǎn shàng xǐ huān kàn diàn yǐng", "I like watching movies at night.", null],
  [66, "請仔細聽老師說。", "qǐng zǐ xì tīng lǎo shī shuō", "Please listen carefully to the teacher.", null],
  [67, "你可以再說一次嗎？", "nǐ kě yǐ zài shuō yí cì ma", "Can you say it once more?", null],
  [68, "他中文講得很好。", "tā zhōng wén jiǎng de hěn hǎo", "He speaks Chinese very well.", null],
  [69, "我想問一個問題。", "wǒ xiǎng wèn yí ge wèn tí", "I'd like to ask a question.", null],
  [70, "請用中文回答。", "qǐng yòng zhōng wén huí dá", "Please answer in Chinese.", null],
  [71, "我知道那家店在哪裡。", "wǒ zhī dào nà jiā diàn zài nǎ lǐ", "I know where that store is.", null],
  [72, "我在大學認識她。", "wǒ zài dà xué rèn shì tā", "I met her at university.", null]
];

const enrich = fs.existsSync(ENRICH_PATH) ? JSON.parse(fs.readFileSync(ENRICH_PATH, "utf8")) : {};
let bad = 0;
for (const [num, hanzi, pinyin, en, measure] of BATCH) {
  const zhuyin = convert(pinyin);
  if (zhuyin.indexOf("null") >= 0) { console.error("BAD:", num, pinyin, "->", zhuyin); bad++; continue; }
  enrich[String(num)] = { example: { hanzi, zhuyin, pinyin, en }, measure };
}
if (bad) { console.error(bad, "bad conversions — aborting write"); process.exit(1); }
fs.writeFileSync(ENRICH_PATH, JSON.stringify(enrich, null, 1));
console.log("added", BATCH.length, "; total enriched:", Object.keys(enrich).length);
