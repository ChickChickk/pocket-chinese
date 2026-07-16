// Chapters 26-30 (words 600-717): Work & office x2, Study & language x2, Health & body (1/2).
const fs = require("fs");
const { convert } = require("./pinyin2zhuyin.js");
const ENRICH_PATH = __dirname + "/enrich.json";

const M = (hanzi, pinyin) => ({ hanzi, zhuyin: convert(pinyin), pinyin });
const GE = M("個", "gè"), JIA = M("家", "jiā"), JIAN_yi = M("件", "jiàn"), ZHANG = M("張", "zhāng");
const FEN = M("份", "fèn"), TANG = M("堂", "táng"), BEN = M("本", "běn"), ZHI = M("支", "zhī");
const ZHONG = M("種", "zhǒng"), MEN = M("門", "mén"), SUO = M("所", "suǒ"), CI = M("次", "cì");
const KE = M("顆", "kē"), ZHI_only = M("隻", "zhī"), SHUANG = M("雙", "shuāng"), TIAO = M("條", "tiáo");

// [num, hanzi, pinyin(syllable-spaced, no punctuation), en, measure|null]
const BATCH = [
  // ---- Ch26: Work & office (1/2) ----
  [600, "我們公司有五十個員工。", "wǒ men gōng sī yǒu wǔ shí ge yuán gōng", "Our company has fifty employees.", JIA],
  [601, "我的辦公室在十樓。", "wǒ de bàn gōng shì zài shí lóu", "My office is on the tenth floor.", GE],
  [602, "這件事要問其他部門。", "zhè jiàn shì yào wèn qí tā bù mén", "You need to ask another department about this.", GE],
  [603, "他升上了主管的職位。", "tā shēng shàng le zhǔ guǎn de zhí wèi", "He was promoted to a supervisor position.", GE],
  [604, "請問您的職業是什麼？", "qǐng wèn nín de zhí yè shì shén me", "What's your occupation?", ZHONG],
  [605, "我每天九點上班。", "wǒ měi tiān jiǔ diǎn shàng bān", "I start work at nine every day.", null],
  [606, "我今天可以準時下班。", "wǒ jīn tiān kě yǐ zhǔn shí xià bān", "I can get off work on time today.", null],
  [607, "這個星期我加了三天班。", "zhè ge xīng qí wǒ jiā le sān tiān bān", "I worked overtime three days this week.", null],
  [608, "我明天想請假。", "wǒ míng tiān xiǎng qǐng jià", "I'd like to take tomorrow off.", null],
  [609, "這份工作的薪水不錯。", "zhè fèn gōng zuò de xīn shuǐ bú cuò", "The salary for this job is pretty good.", null],
  [610, "我把履歷寄過去了。", "wǒ bǎ lǚ lì jì guò qù le", "I sent my résumé over.", FEN],
  [611, "我下午有一場面試。", "wǒ xià wǔ yǒu yì chǎng miàn shì", "I have an interview this afternoon.", null],
  [612, "會議改到三點了。", "huì yì gǎi dào sān diǎn le", "The meeting was moved to three o'clock.", GE],
  [613, "這個專案下個月完成。", "zhè ge zhuān àn xià ge yuè wán chéng", "This project finishes next month.", GE],
  [614, "這個任務比較急。", "zhè ge rèn wù bǐ jiào jí", "This task is rather urgent.", GE],
  [615, "最近的工作量太大了。", "zuì jìn de gōng zuò liàng tài dà le", "The workload has been too heavy lately.", null],
  [616, "請問進度如何？", "qǐng wèn jìn dù rú hé", "How's the progress coming along?", null],
  [617, "期限是這個星期五。", "qī xiàn shì zhè ge xīng qí wǔ", "The deadline is this Friday.", GE],
  [618, "我們先確認優先順序。", "wǒ men xiān què rèn yōu xiān shùn xù", "Let's confirm the priorities first.", null],
  [619, "今年的目標很清楚。", "jīn nián de mù biāo hěn qīng chǔ", "This year's goals are very clear.", GE],
  [620, "我的計畫有點改變。", "wǒ de jì huà yǒu diǎn gǎi biàn", "My plan has changed a little.", GE],
  [621, "結果比我想的好。", "jié guǒ bǐ wǒ xiǎng de hǎo", "The result was better than I expected.", GE],
  [622, "這個問題很難解決。", "zhè ge wèn tí hěn nán jiě jué", "This problem is hard to solve.", GE],
  [623, "我們一起想辦法解決。", "wǒ men yì qǐ xiǎng bàn fǎ jiě jué", "Let's figure out how to solve it together.", null],

  // ---- Ch27: Work & office (2/2) ----
  [624, "這件事我們再討論。", "zhè jiàn shì wǒ men zài tǎo lùn", "Let's discuss this again.", null],
  [625, "很高興跟你合作。", "hěn gāo xìng gēn nǐ hé zuò", "It's a pleasure working with you.", null],
  [626, "這個部分由我負責。", "zhè ge bù fèn yóu wǒ fù zé", "I'm responsible for this part.", null],
  [627, "我來安排時間。", "wǒ lái ān pái shí jiān", "I'll arrange the time.", null],
  [628, "有消息我會通知你。", "yǒu xiāo xí wǒ huì tōng zhī nǐ", "I'll let you know if there's any news.", null],
  [629, "報告下星期要交。", "bào gào xià xīng qí yào jiāo", "The report is due next week.", FEN],
  [630, "我還在整理資料。", "wǒ hái zài zhěng lǐ zī liào", "I'm still organizing the materials.", FEN],
  [631, "這份文件請幫我簽名。", "zhè fèn wén jiàn qǐng bāng wǒ qiān míng", "Please sign this document for me.", FEN],
  [632, "請填寫這張表格。", "qǐng tián xiě zhè zhāng biǎo gé", "Please fill out this form.", ZHANG],
  [633, "檔案太大，寄不出去。", "dàng àn tài dà jì bù chū qù", "The file is too big to send.", GE],
  [634, "資料夾裡有三個檔案。", "zī liào jiā lǐ yǒu sān ge dàng àn", "There are three files in the folder.", GE],
  [635, "我剛剛寄了電子郵件給你。", "wǒ gāng gāng jì le diàn zi yóu jiàn gěi nǐ", "I just sent you an email.", FEN],
  [636, "我收到你的訊息了。", "wǒ shōu dào nǐ de xùn xí le", "I got your message.", GE],
  [637, "我等一下打電話給你。", "wǒ děng yí xià dǎ diàn huà gěi nǐ", "I'll call you in a bit.", null],
  [638, "客戶對價格不太滿意。", "kè hù duì jià gé bú tài mǎn yì", "The client isn't very happy with the price.", GE],
  [639, "請先確認客戶的需求。", "qǐng xiān què rèn kè hù de xū qiú", "Please confirm the client's requirements first.", GE],
  [640, "這個功能還在開發中。", "zhè ge gōng néng hái zài kāi fā zhōng", "This feature is still in development.", GE],
  [641, "測試通過了嗎？", "cè shì tōng guò le ma", "Did it pass the test?", CI],
  [642, "這是我的錯誤，我來改。", "zhè shì wǒ de cuò wù wǒ lái gǎi", "This is my mistake — I'll fix it.", GE],
  [643, "系統明天要維護。", "xì tǒng míng tiān yào wéi hù", "The system will be under maintenance tomorrow.", GE],
  [644, "我沒有這個權限。", "wǒ méi yǒu zhè ge quán xiàn", "I don't have this permission.", null],
  [645, "我忘記我的帳號了。", "wǒ wàng jì wǒ de zhàng hào le", "I forgot my account name.", GE],
  [646, "密碼至少要八個字。", "mì mǎ zhì shǎo yào bā ge zì", "The password needs at least eight characters.", GE],

  // ---- Ch28: Study & language (1/2) ----
  [647, "我的學校離家很近。", "wǒ de xué xiào lí jiā hěn jìn", "My school is close to home.", JIA],
  [648, "她在台大念大學。", "tā zài tái dà niàn dà xué", "She's studying at National Taiwan University.", JIA],
  [649, "我想考研究所。", "wǒ xiǎng kǎo yán jiù suǒ", "I want to apply for graduate school.", SUO],
  [650, "教室在三樓。", "jiào shì zài sān lóu", "The classroom is on the third floor.", JIAN_yi],
  [651, "這個課程要上一年。", "zhè ge kè chéng yào shàng yì nián", "This course runs for a year.", MEN],
  [652, "今天的課堂很有趣。", "jīn tiān de kè táng hěn yǒu qù", "Today's class was interesting.", TANG],
  [653, "我還沒寫功課。", "wǒ hái méi xiě gōng kè", "I haven't done my homework yet.", null],
  [654, "作業明天要交。", "zuò yè míng tiān yào jiāo", "The assignment is due tomorrow.", FEN],
  [655, "下星期有中文考試。", "xià xīng qí yǒu zhōng wén kǎo shì", "There's a Chinese exam next week.", CI],
  [656, "他的成績一直很好。", "tā de chéng jī yì zhí hěn hǎo", "His grades have always been good.", null],
  [657, "這次的分數比上次高。", "zhè cì de fēn shù bǐ shàng cì gāo", "This score is higher than last time.", null],
  [658, "我今年六月畢業。", "wǒ jīn nián liù yuè bì yè", "I graduate this June.", null],
  [659, "這個學期我修五門課。", "zhè ge xué qí wǒ xiū wǔ mén kè", "I'm taking five courses this semester.", GE],
  [660, "我最喜歡的科目是歷史。", "wǒ zuì xǐ huān de kē mù shì lì shǐ", "My favorite subject is history.", MEN],
  [661, "我學中文兩年了。", "wǒ xué zhōng wén liǎng nián le", "I've been learning Chinese for two years.", null],
  [662, "他的英文說得很流利。", "tā de yīng wén shuō de hěn liú lì", "He speaks English fluently.", null],
  [663, "學語言需要時間。", "xué yǔ yán xū yào shí jiān", "Learning a language takes time.", ZHONG],
  [664, "我每天背十個單字。", "wǒ měi tiān bèi shí ge dān zì", "I memorize ten vocabulary words a day.", GE],
  [665, "這個句子我看不懂。", "zhè ge jù zi wǒ kàn bù dǒng", "I don't understand this sentence.", GE],
  [666, "中文的文法其實不難。", "zhōng wén de wén fǎ qí shí bù nán", "Chinese grammar actually isn't hard.", null],
  [667, "我的發音還要再練習。", "wǒ de fā yīn hái yào zài liàn xí", "My pronunciation still needs practice.", null],
  [668, "中文有四個聲調。", "zhōng wén yǒu sì ge shēng diào", "Chinese has four tones.", GE],
  [669, "拼音和注音都可以學。", "pīn yīn hàn zhù yīn dōu kě yǐ xué", "You can learn either pinyin or zhuyin.", null],
  [670, "這個漢字怎麼寫？", "zhè ge hàn zì zěn me xiě", "How do you write this character?", GE],

  // ---- Ch29: Study & language (2/2) ----
  [671, "台灣用繁體字。", "tái wān yòng fán tǐ zì", "Taiwan uses traditional characters.", GE],
  [672, "簡體字的筆畫比較少。", "jiǎn tǐ zì de bǐ huà bǐ jiào shǎo", "Simplified characters have fewer strokes.", GE],
  [673, "這個字是什麼意思？", "zhè ge zì shì shén me yì si", "What does this character mean?", GE],
  [674, "這句話的翻譯不太對。", "zhè jù huà de fān yì bú tài duì", "The translation of this sentence isn't quite right.", null],
  [675, "老師舉了一個例子。", "lǎo shī jǔ le yí ge lì zi", "The teacher gave an example.", GE],
  [676, "這題的答案是什麼？", "zhè tí de dá àn shì shén me", "What's the answer to this question?", GE],
  [677, "上課我都會做筆記。", "shàng kè wǒ dōu huì zuò bǐ jì", "I always take notes in class.", null],
  [678, "請把課本翻到第十頁。", "qǐng bǎ kè běn fān dào dì shí yè", "Please turn to page ten in the textbook.", BEN],
  [679, "我用手機查字典。", "wǒ yòng shǒu jī chá zì diǎn", "I use my phone to look things up in the dictionary.", BEN],
  [680, "請借我一支鉛筆。", "qǐng jiè wǒ yì zhī qiān bǐ", "Please lend me a pencil.", ZHI],
  [681, "考試不能用鉛筆，要用原子筆。", "kǎo shì bù néng yòng qiān bǐ yào yòng yuán zi bǐ", "You can't use a pencil on the exam — use a ballpoint pen.", ZHI],
  [682, "橡皮擦借我一下。", "xiàng pí cā jiè wǒ yí xià", "Lend me your eraser for a second.", GE],
  [683, "請給我一張紙。", "qǐng gěi wǒ yì zhāng zhǐ", "Please give me a piece of paper.", ZHANG],
  [684, "老師發了問題單。", "lǎo shī fā le wèn tí dān", "The teacher handed out the question sheet.", ZHANG],
  [685, "這些練習題有點難。", "zhè xiē liàn xí tí yǒu diǎn nán", "These practice questions are a bit hard.", null],
  [686, "上課前我會先預習。", "shàng kè qián wǒ huì xiān yù xí", "I preview the material before class.", null],
  [687, "考試前要好好複習。", "kǎo shì qián yào hǎo hǎo fù xí", "You should review properly before the exam.", null],
  [688, "我背了一整晚的單字。", "wǒ bèi le yì zhěng wǎn de dān zì", "I memorized vocabulary all night.", null],
  [689, "老師解釋得很清楚。", "lǎo shī jiě shì de hěn qīng chǔ", "The teacher explained it very clearly.", null],
  [690, "你的中文進步很多。", "nǐ de zhōng wén jìn bù hěn duō", "Your Chinese has improved a lot.", null],
  [691, "我的中文還是初級程度。", "wǒ de zhōng wén hái shì chū jí chéng dù", "My Chinese is still at a beginner level.", null],
  [692, "這本書適合初級的學生。", "zhè běn shū shì hé chū jí de xué shēng", "This book is suitable for beginner students.", null],
  [693, "我想上中級的課。", "wǒ xiǎng shàng zhōng jí de kè", "I'd like to take the intermediate class.", null],

  // ---- Ch30: Health & body (1/2) ----
  [694, "多運動對身體好。", "duō yùn dòng duì shēn tǐ hǎo", "Exercising more is good for your body.", null],
  [695, "我的頭有點痛。", "wǒ de tóu yǒu diǎn tòng", "My head hurts a little.", GE],
  [696, "他的臉曬紅了。", "tā de liǎn shài hóng le", "His face got sunburned.", ZHANG],
  [697, "看太久手機眼睛會累。", "kàn tài jiǔ shǒu jī yǎn jīng huì lèi", "Looking at your phone too long tires your eyes.", SHUANG],
  [698, "他的耳朵很靈。", "tā de ěr duo hěn líng", "He has sharp ears.", ZHI_only],
  [699, "我鼻子過敏，一直打噴嚏。", "wǒ bí zi guò mǐn yì zhí dǎ pēn tì", "My nose is allergic — I keep sneezing.", GE],
  [700, "他嘴巴很甜，很會說話。", "tā zuǐ ba hěn tián hěn huì shuō huà", "He's sweet-talking — very good with words.", ZHANG],
  [701, "我每天刷兩次牙齒。", "wǒ měi tiān shuā liǎng cì yá chǐ", "I brush my teeth twice a day.", KE],
  [702, "我的喉嚨怪怪的。", "wǒ de hóu lóng guài guài de", "My throat feels off.", GE],
  [703, "我的脖子很酸。", "wǒ de bó zi hěn suān", "My neck is sore.", GE],
  [704, "他幫我按摩肩膀。", "tā bāng wǒ àn mó jiān bǎng", "He massaged my shoulders for me.", GE],
  [705, "吃飯前要洗手。", "chī fàn qián yào xǐ shǒu", "Wash your hands before eating.", SHUANG],
  [706, "我的手指被門夾到了。", "wǒ de shǒu zhǐ bèi mén jiá dào le", "I caught my finger in the door.", GE],
  [707, "我肚子好餓。", "wǒ dù zi hǎo è", "I'm so hungry.", GE],
  [708, "坐太久背部會痛。", "zuò tài jiǔ bèi bù huì tòng", "Sitting too long makes your back hurt.", null],
  [709, "走了一天，腿好酸。", "zǒu le yì tiān tuǐ hǎo suān", "After walking all day, my legs ache.", TIAO],
  [710, "我的腳有點腫。", "wǒ de jiǎo yǒu diǎn zhǒng", "My foot is a bit swollen.", ZHI_only],
  [711, "冬天皮膚容易乾。", "dōng tiān pí fū róng yì gān", "Skin gets dry easily in winter.", null],
  [712, "運動對心臟很好。", "yùn dòng duì xīn zàng hěn hǎo", "Exercise is good for your heart.", KE],
  [713, "我看到血就想暈。", "wǒ kàn dào xuè jiù xiǎng yūn", "I feel faint at the sight of blood.", null],
  [714, "他生病了，今天沒來。", "tā shēng bìng le jīn tiān méi lái", "He's sick — he didn't come today.", null],
  [715, "我最近感冒了。", "wǒ zuì jìn gǎn mào le", "I've caught a cold recently.", CI],
  [716, "他發燒到三十九度。", "tā fā shāo dào sān shí jiǔ dù", "His fever went up to thirty-nine degrees.", null],
  [717, "我咳嗽了一個星期。", "wǒ ké sòu le yí ge xīng qí", "I've been coughing for a week.", null]
];

const enrich = fs.existsSync(ENRICH_PATH) ? JSON.parse(fs.readFileSync(ENRICH_PATH, "utf8")) : {};
let bad = 0;
for (const [num, hanzi, pinyin, en, measure] of BATCH) {
  const zhuyin = convert(pinyin);
  if (!zhuyin || zhuyin.indexOf("null") >= 0) { console.error("BAD:", num, pinyin, "->", zhuyin); bad++; continue; }
  enrich[String(num)] = { example: { hanzi, zhuyin, pinyin, en }, measure: measure || null };
}
if (bad) { console.error(bad, "bad conversions — aborting"); process.exit(1); }
fs.writeFileSync(ENRICH_PATH, JSON.stringify(enrich, null, 1));
console.log("added", BATCH.length, "; total enriched:", Object.keys(enrich).length);
