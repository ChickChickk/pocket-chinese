const fs = require("fs");
const { convert } = require("./pinyin2zhuyin.js");
const ENRICH_PATH = __dirname + "/enrich.json";

// [num, hanzi, pinyin(syllable-spaced, no punctuation), en]  — adjectives + adverbs, measure null
const BATCH = [
  [169, "圖書館裡很安靜。", "tú shū guǎn lǐ hěn ān jìng", "It's very quiet in the library."],
  [170, "外面的馬路很吵。", "wài miàn de mǎ lù hěn chǎo", "The street outside is noisy."],
  [171, "這道題很簡單。", "zhè dào tí hěn jiǎn dān", "This question is simple."],
  [172, "中文的發音有點難。", "zhōng wén de fā yīn yǒu diǎn nán", "Chinese pronunciation is a bit hard."],
  [173, "這個字很容易記。", "zhè ge zì hěn róng yì jì", "This character is easy to remember."],
  [174, "這件事很重要。", "zhè jiàn shì hěn zhòng yào", "This matter is important."],
  [175, "今天是個特別的日子。", "jīn tiān shì ge tè bié de rì zi", "Today is a special day."],
  [176, "這兩件衣服顏色一樣。", "zhè liǎng jiàn yī fú yán sè yí yàng", "These two shirts are the same color."],
  [177, "我們的想法不同。", "wǒ men de xiǎng fǎ bù tóng", "Our ideas are different."],
  [178, "你的答案是對的。", "nǐ de dá àn shì duì de", "Your answer is correct."],
  [179, "我寫錯了一個字。", "wǒ xiě cuò le yí ge zì", "I wrote one character wrong."],
  [180, "老師講得很清楚。", "lǎo shī jiǎng de hěn qīng chǔ", "The teacher explained it clearly."],
  [181, "這張照片有點模糊。", "zhè zhāng zhào piàn yǒu diǎn mó hú", "This photo is a bit blurry."],
  [182, "住在捷運站附近很方便。", "zhù zài jié yùn zhàn fù jìn hěn fāng biàn", "It's convenient to live near an MRT station."],
  [183, "這件事有點麻煩。", "zhè jiàn shì yǒu diǎn má fán", "This is a bit of a hassle."],
  [184, "晚上一個人走路要注意安全。", "wǎn shàng yí ge rén zǒu lù yào zhù yì ān quán", "Be careful walking alone at night."],
  [185, "這裡很危險，別靠近。", "zhè lǐ hěn wēi xiǎn bié kào jìn", "It's dangerous here — don't go near."],
  [186, "他的身體很健康。", "tā de shēn tǐ hěn jiàn kāng", "He's very healthy."],
  [187, "他的感冒很嚴重。", "tā de gǎn mào hěn yán zhòng", "His cold is serious."],
  [188, "一切都很正常。", "yí qiè dōu hěn zhèng cháng", "Everything is normal."],
  [189, "這個味道有點奇怪。", "zhè ge wèi dào yǒu diǎn qí guài", "This smell is a bit strange."],
  [190, "這本書很有趣。", "zhè běn shū hěn yǒu qù", "This book is interesting."],
  [191, "這部電影很無聊。", "zhè bù diàn yǐng hěn wú liáo", "This movie is boring."],
  [192, "我最近工作很忙。", "wǒ zuì jìn gōng zuò hěn máng", "I've been very busy with work lately."],
  [193, "今天非常熱。", "jīn tiān fēi cháng rè", "It's extremely hot today."],
  [194, "這家店的東西真的很好吃。", "zhè jiā diàn de dōng xi zhēn de hěn hǎo chī", "This shop's food is really delicious."],
  [195, "我今天有點累。", "wǒ jīn tiān yǒu diǎn lèi", "I'm a little tired today."],
  [196, "請給我一點時間。", "qǐng gěi wǒ yì diǎn shí jiān", "Please give me a little time."],
  [197, "我完全不懂。", "wǒ wán quán bù dǒng", "I completely don't understand."],
  [198, "時間差不多了，我們走吧。", "shí jiān chà bu duō le wǒ men zǒu ba", "It's about time — let's go."],
  [199, "從這裡到車站大概十分鐘。", "cóng zhè lǐ dào chē zhàn dà gài shí fēn zhōng", "It's about ten minutes from here to the station."],
  [200, "他今天可能不會來。", "tā jīn tiān kě néng bú huì lái", "He might not come today."],
  [201, "我明天一定準時到。", "wǒ míng tiān yí dìng zhǔn shí dào", "I'll definitely arrive on time tomorrow."],
  [202, "也許明天會下雨。", "yě xǔ míng tiān huì xià yǔ", "Maybe it'll rain tomorrow."],
  [203, "當然可以，沒問題。", "dāng rán kě yǐ méi wèn tí", "Of course, no problem."],
  [204, "其實我不太喜歡咖啡。", "qí shí wǒ bú tài xǐ huān kā fēi", "Actually, I don't really like coffee."],
  [205, "我特別地喜歡這首歌。", "wǒ tè bié de xǐ huān zhè shǒu gē", "I especially like this song."],
  [206, "我主要負責這個部分。", "wǒ zhǔ yào fù zé zhè ge bù fèn", "I'm mainly responsible for this part."],
  [207, "我通常七點起床。", "wǒ tōng cháng qī diǎn qǐ chuáng", "I usually get up at seven."],
  [208, "我常常在這家店吃飯。", "wǒ cháng cháng zài zhè jiā diàn chī fàn", "I often eat at this restaurant."],
  [209, "我有時候會自己煮飯。", "wǒ yǒu shí hòu huì zì jǐ zhǔ fàn", "Sometimes I cook for myself."],
  [210, "我偶爾會去看電影。", "wǒ ǒu ěr huì qù kàn diàn yǐng", "I occasionally go to the movies."],
  [211, "我很少喝酒。", "wǒ hěn shǎo hē jiǔ", "I rarely drink alcohol."],
  [212, "他從來不遲到。", "tā cóng lái bù chí dào", "He is never late."],
  [213, "我每天走路上班。", "wǒ měi tiān zǒu lù shàng bān", "I walk to work every day."],
  [214, "我們每週開一次會。", "wǒ men měi zhōu kāi yí cì huì", "We have a meeting once a week."],
  [215, "我每月存一點錢。", "wǒ měi yuè cún yì diǎn qián", "I save a little money every month."],
  [216, "他一直在講電話。", "tā yì zhí zài jiǎng diàn huà", "He's been on the phone the whole time."],
  [217, "我馬上就到。", "wǒ mǎ shàng jiù dào", "I'll be there right away."],
  [218, "請立刻離開。", "qǐng lì kè lí kāi", "Please leave immediately."],
  [219, "快遲到了，趕快走吧。", "kuài chí dào le gǎn kuài zǒu ba", "We're about to be late — hurry up."],
  [220, "別急，慢慢來。", "bié jí màn màn lái", "Don't rush — take your time."],
  [221, "我們一起去吃午餐吧。", "wǒ men yì qǐ qù chī wǔ cān ba", "Let's go have lunch together."],
  [222, "這件事我自己來就好。", "zhè jiàn shì wǒ zì jǐ lái jiù hǎo", "I'll handle this myself."],
  [223, "我已經吃過了。", "wǒ yǐ jīng chī guò le", "I've already eaten."],
  [224, "我還沒決定要去哪裡。", "wǒ hái méi jué dìng yào qù nǎ lǐ", "I haven't decided where to go yet."],
  [225, "剛才有人打電話找你。", "gāng cái yǒu rén dǎ diàn huà zhǎo nǐ", "Someone called for you just now."],
  [226, "我剛剛才到家。", "wǒ gāng gāng cái dào jiā", "I just got home."],
  [227, "我正在開會。", "wǒ zhèng zài kāi huì", "I'm in a meeting right now."],
  [228, "我終於把工作做完了。", "wǒ zhōng yú bǎ gōng zuò zuò wán le", "I finally finished the work."],
  [229, "我先走了，再見。", "wǒ xiān zǒu le zài jiàn", "I'll head off first — bye."],
  [230, "我們後來就沒聯絡了。", "wǒ men hòu lái jiù méi lián luò le", "We lost touch afterwards."],
  [231, "我以前住在台中。", "wǒ yǐ qián zhù zài tái zhōng", "I used to live in Taichung."],
  [232, "下班以後我要去運動。", "xià bān yǐ hòu wǒ yào qù yùn dòng", "After work I'm going to exercise."],
  [233, "我目前住在台北。", "wǒ mù qián zhù zài tái běi", "I currently live in Taipei."],
  [234, "你最近好嗎？", "nǐ zuì jìn hǎo ma", "How have you been lately?"],
  [235, "附近有一家便利商店。", "fù jìn yǒu yì jiā biàn lì shāng diàn", "There's a convenience store nearby."],
  [236, "這裡到處都是人。", "zhè lǐ dào chù dōu shì rén", "It's crowded everywhere here."],
  [237, "包包裡面有什麼？", "bāo bāo lǐ miàn yǒu shén me", "What's inside the bag?"],
  [238, "外面在下雨。", "wài miàn zài xià yǔ", "It's raining outside."],
  [239, "桌子上面有一本書。", "zhuō zi shàng miàn yǒu yì běn shū", "There's a book on the table."],
  [240, "椅子下面有一隻貓。", "yǐ zi xià miàn yǒu yì zhī māo", "There's a cat under the chair."]
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
