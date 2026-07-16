const fs = require("fs");
const { convert } = require("./pinyin2zhuyin.js");
const ENRICH_PATH = __dirname + "/enrich.json";

// [num, hanzi, pinyin(syllable-spaced, no punctuation), en]  — all verbs/adjectives → measure null
const BATCH = [
  [97, "我拿了兩本書。", "wǒ ná le liǎng běn shū", "I took two books."],
  [98, "請把鑰匙放在桌上。", "qǐng bǎ yào shi fàng zài zhuō shàng", "Please put the keys on the table."],
  [99, "請給我一杯水。", "qǐng gěi wǒ yì bēi shuǐ", "Please give me a glass of water."],
  [100, "出門記得帶傘。", "chū mén jì de dài sǎn", "Remember to bring an umbrella when you go out."],
  [101, "我送了她一份禮物。", "wǒ sòng le tā yí fèn lǐ wù", "I gave her a gift."],
  [102, "可以借我一支筆嗎？", "kě yǐ jiè wǒ yì zhī bǐ ma", "Can you lend me a pen?"],
  [103, "我明天把書還給你。", "wǒ míng tiān bǎ shū huán gěi nǐ", "I'll return the book to you tomorrow."],
  [104, "我想買一件外套。", "wǒ xiǎng mǎi yí jiàn wài tào", "I want to buy a jacket."],
  [105, "這家店賣手機。", "zhè jiā diàn mài shǒu jī", "This shop sells phones."],
  [106, "我可以用信用卡付嗎？", "wǒ kě yǐ yòng xìn yòng kǎ fù ma", "Can I pay by credit card?"],
  [107, "店員找錢給我。", "diàn yuán zhǎo qián gěi wǒ", "The clerk gave me change."],
  [108, "我可以用一下你的手機嗎？", "wǒ kě yǐ yòng yí xià nǐ de shǒu jī ma", "Can I use your phone for a moment?"],
  [109, "我想換一件大一點的。", "wǒ xiǎng huàn yí jiàn dà yì diǎn de", "I'd like to exchange it for a bigger one."],
  [110, "我的手機壞了，要拿去修。", "wǒ de shǒu jī huài le yào ná qù xiū", "My phone is broken; I need to get it repaired."],
  [111, "我每天洗頭。", "wǒ měi tiān xǐ tóu", "I wash my hair every day."],
  [112, "我週末清理房間。", "wǒ zhōu mò qīng lǐ fáng jiān", "I clean my room on weekends."],
  [113, "我在整理行李。", "wǒ zài zhěng lǐ xíng lǐ", "I'm organizing my luggage."],
  [114, "請把垃圾丟到垃圾桶。", "qǐng bǎ lè sè diū dào lè sè tǒng", "Please throw the trash in the bin."],
  [115, "今天很冷，多穿一點。", "jīn tiān hěn lěng duō chuān yì diǎn", "It's cold today — wear a bit more."],
  [116, "進門前請先脫鞋。", "jìn mén qián qǐng xiān tuō xié", "Please take off your shoes before coming in."],
  [117, "你吃早餐了嗎？", "nǐ chī zǎo cān le ma", "Have you eaten breakfast?"],
  [118, "我想喝一杯熱茶。", "wǒ xiǎng hē yì bēi rè chá", "I'd like a cup of hot tea."],
  [119, "今天我來煮晚餐。", "jīn tiān wǒ lái zhǔ wǎn cān", "I'll cook dinner today."],
  [120, "我在廚房切菜。", "wǒ zài chú fáng qiē cài", "I'm cutting vegetables in the kitchen."],
  [121, "我們點了三道菜。", "wǒ men diǎn le sān dào cài", "We ordered three dishes."],
  [122, "我昨天很早睡。", "wǒ zuó tiān hěn zǎo shuì", "I went to bed early yesterday."],
  [123, "我每天七點起床。", "wǒ měi tiān qī diǎn qǐ chuáng", "I get up at seven every day."],
  [124, "你累了就休息一下。", "nǐ lèi le jiù xiū xí yí xià", "Rest for a bit if you're tired."],
  [125, "我習慣晚上洗澡。", "wǒ xí guàn wǎn shàng xǐ zǎo", "I usually shower at night."],
  [126, "睡前記得刷牙。", "shuì qián jì de shuā yá", "Remember to brush your teeth before bed."],
  [127, "他在銀行工作。", "tā zài yín háng gōng zuò", "He works at a bank."],
  [128, "我正在學習中文。", "wǒ zhèng zài xué xí zhōng wén", "I'm studying Chinese."],
  [129, "老師教我們中文。", "lǎo shī jiāo wǒ men zhōng wén", "The teacher teaches us Chinese."],
  [130, "我每天練習說中文。", "wǒ měi tiān liàn xí shuō zhōng wén", "I practice speaking Chinese every day."],
  [131, "我在寫一封信。", "wǒ zài xiě yì fēng xìn", "I'm writing a letter."],
  [132, "我喜歡讀小說。", "wǒ xǐ huān dú xiǎo shuō", "I like reading novels."],
  [133, "他打字很快。", "tā dǎ zì hěn kuài", "He types fast."],
  [134, "妹妹很會畫畫。", "mèi mei hěn huì huà huà", "My little sister is good at drawing."],
  [135, "我們拍張照吧。", "wǒ men pāi zhāng zhào ba", "Let's take a photo."],
  [136, "我把照片傳給你。", "wǒ bǎ zhào piàn chuán gěi nǐ", "I'll send you the photo."],
  [137, "我想下載這個應用程式。", "wǒ xiǎng xià zài zhè ge yìng yòng chéng shì", "I want to download this app."],
  [138, "請把檔案上傳到雲端。", "qǐng bǎ dàng àn shàng chuán dào yún duān", "Please upload the file to the cloud."],
  [139, "請按這個按鈕。", "qǐng àn zhè ge àn niǔ", "Please press this button."],
  [140, "點擊這裡看更多。", "diǎn jī zhè lǐ kàn gèng duō", "Click here to see more."],
  [141, "請先登入你的帳號。", "qǐng xiān dēng rù nǐ de zhàng hào", "Please log in to your account first."],
  [142, "用完請記得登出。", "yòng wán qǐng jì de dēng chū", "Remember to log out when you're done."],
  [143, "我在網路上搜尋資料。", "wǒ zài wǎng lù shàng sōu xún zī liào", "I'm searching for information online."],
  [144, "出發前檢查一下行李。", "chū fā qián jiǎn chá yí xià xíng lǐ", "Check your luggage before you leave."],
  [145, "這家餐廳的服務很好。", "zhè jiā cān tīng de fú wù hěn hǎo", "This restaurant's service is very good."],
  [146, "這個雞蛋壞掉了。", "zhè ge jī dàn huài diào le", "This egg has gone bad."],
  [147, "他們家很大。", "tā men jiā hěn dà", "Their house is big."],
  [148, "這雙鞋有點小。", "zhè shuāng xié yǒu diǎn xiǎo", "These shoes are a little small."],
  [149, "那棟大樓很高。", "nà dòng dà lóu hěn gāo", "That building is very tall."],
  [150, "我比姐姐矮。", "wǒ bǐ jiě jie ǎi", "I'm shorter than my older sister."],
  [151, "這條路很長。", "zhè tiáo lù hěn cháng", "This road is long."],
  [152, "今天的會議很短。", "jīn tiān de huì yì hěn duǎn", "Today's meeting was short."],
  [153, "這裡的人很多。", "zhè lǐ de rén hěn duō", "There are a lot of people here."],
  [154, "今天客人比較少。", "jīn tiān kè rén bǐ jiào shǎo", "There are fewer customers today."],
  [155, "高鐵很快。", "gāo tiě hěn kuài", "The high-speed rail is fast."],
  [156, "你可以說慢一點嗎？", "nǐ kě yǐ shuō màn yì diǎn ma", "Could you speak a little slower?"],
  [157, "我今天到得很早。", "wǒ jīn tiān dào de hěn zǎo", "I arrived early today."],
  [158, "現在很晚了，快睡吧。", "xiàn zài hěn wǎn le kuài shuì ba", "It's late now — go to sleep."],
  [159, "我買了一支新手機。", "wǒ mǎi le yì zhī xīn shǒu jī", "I bought a new phone."],
  [160, "這台電腦有點舊了。", "zhè tái diàn nǎo yǒu diǎn jiù le", "This computer is a bit old."],
  [161, "他看起來很年輕。", "tā kàn qǐ lái hěn nián qīng", "He looks young."],
  [162, "我爺爺年紀很老了。", "wǒ yé ye nián jì hěn lǎo le", "My grandpa is very old."],
  [163, "這件洋裝很漂亮。", "zhè jiàn yáng zhuāng hěn piào liàng", "This dress is beautiful."],
  [164, "他今天穿得很帥。", "tā jīn tiān chuān de hěn shuài", "He looks handsome today."],
  [165, "這隻小狗好可愛。", "zhè zhī xiǎo gǒu hǎo kě ài", "This puppy is so cute."],
  [166, "這個顏色有點醜。", "zhè ge yán sè yǒu diǎn chǒu", "This color is a bit ugly."],
  [167, "這間廁所很乾淨。", "zhè jiān cè suǒ hěn gān jìng", "This bathroom is clean."],
  [168, "你的鞋子很髒。", "nǐ de xié zi hěn zāng", "Your shoes are dirty."]
];

const enrich = fs.existsSync(ENRICH_PATH) ? JSON.parse(fs.readFileSync(ENRICH_PATH, "utf8")) : {};
let bad = 0;
for (const [num, hanzi, pinyin, en] of BATCH) {
  const zhuyin = convert(pinyin);
  if (zhuyin.indexOf("null") >= 0) { console.error("BAD:", num, pinyin, "->", zhuyin); bad++; continue; }
  enrich[String(num)] = { example: { hanzi, zhuyin, pinyin, en }, measure: null };
}
if (bad) { console.error(bad, "bad conversions — aborting"); process.exit(1); }
fs.writeFileSync(ENRICH_PATH, JSON.stringify(enrich, null, 1));
console.log("added", BATCH.length, "; total enriched:", Object.keys(enrich).length);
