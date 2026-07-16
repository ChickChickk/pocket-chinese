// Chapters 21-25 (words 482-599): Home & daily life (2/2), Transportation x2, Shopping & money x2.
// All source examples were template filler ("家裡有垃圾。", "我每天使用捷運。",
// "請問黑色怎麼處理？") — every one rewritten.
const fs = require("fs");
const { convert } = require("./pinyin2zhuyin.js");
const ENRICH_PATH = __dirname + "/enrich.json";

const M = (hanzi, pinyin) => ({ hanzi, zhuyin: convert(pinyin), pinyin });
const GE = M("個", "gè"), TAI = M("台", "tái"), BA = M("把", "bǎ"), JIAN_yi = M("件", "jiàn");
const TIAO = M("條", "tiáo"), SHUANG = M("雙", "shuāng"), DING = M("頂", "dǐng"), KUAI = M("塊", "kuài");
const PING = M("瓶", "píng"), ZHI = M("支", "zhī"), CHUANG = M("床", "chuáng"), ZHANG = M("張", "zhāng");
const JIA = M("家", "jiā"), JIA_ji = M("架", "jià"), SOU = M("艘", "sōu"), BAN = M("班", "bān");
const ZHONG = M("種", "zhǒng"), WEI = M("位", "wèi");

// [num, hanzi, pinyin(syllable-spaced, no punctuation), en, measure|null]
const BATCH = [
  // ---- Ch21: Home & daily life (2/2) ----
  [482, "台灣很潮濕，烘衣機很實用。", "tái wān hěn cháo shī hōng yī jī hěn shí yòng", "Taiwan is humid, so a dryer is very practical.", TAI],
  [483, "我很少看電視。", "wǒ hěn shǎo kàn diàn shì", "I rarely watch TV.", TAI],
  [484, "遙控器不見了。", "yáo kòng qì bú jiàn le", "The remote control is missing.", GE],
  [485, "我把鑰匙忘在家裡了。", "wǒ bǎ yào shi wàng zài jiā lǐ le", "I left my keys at home.", BA],
  [486, "門鎖壞了，打不開。", "mén suǒ huài le dǎ bù kāi", "The lock is broken — it won't open.", BA],
  [487, "請幫我把垃圾拿出去。", "qǐng bāng wǒ bǎ lè sè ná chū qù", "Please take the trash out for me.", null],
  [488, "垃圾袋要去便利商店買。", "lè sè dài yào qù biàn lì shāng diàn mǎi", "You buy trash bags at the convenience store.", GE],
  [489, "垃圾車每天晚上七點來。", "lè sè chē měi tiān wǎn shàng qī diǎn lái", "The garbage truck comes at seven every evening.", TAI],
  [490, "我要去洗衣服。", "wǒ yào qù xǐ yī fú", "I'm going to do the laundry.", JIAN_yi],
  [491, "這條褲子有點緊。", "zhè tiáo kù zi yǒu diǎn jǐn", "These pants are a bit tight.", TIAO],
  [492, "這件裙子很適合你。", "zhè jiàn qún zi hěn shì hé nǐ", "This skirt suits you well.", JIAN_yi],
  [493, "外面很冷，記得穿外套。", "wài miàn hěn lěng jì de chuān wài tào", "It's cold out — remember to wear a jacket.", JIAN_yi],
  [494, "進門前請脫鞋子。", "jìn mén qián qǐng tuō xié zi", "Please take off your shoes before coming in.", SHUANG],
  [495, "我少了一隻襪子。", "wǒ shǎo le yì zhī wà zi", "I'm missing one sock.", SHUANG],
  [496, "太陽很大，戴帽子吧。", "tài yáng hěn dà dài mào zi ba", "The sun is strong — put on a hat.", DING],
  [497, "這條毛巾是乾淨的。", "zhè tiáo máo jīn shì gān jìng de", "This towel is clean.", TIAO],
  [498, "請用肥皂洗手。", "qǐng yòng féi zào xǐ shǒu", "Please wash your hands with soap.", KUAI],
  [499, "洗髮精用完了。", "xǐ fǎ jīng yòng wán le", "The shampoo has run out.", PING],
  [500, "牙刷應該三個月換一次。", "yá shuā yīng gāi sān ge yuè huàn yí cì", "A toothbrush should be replaced every three months.", ZHI],
  [501, "我擠了一點牙膏。", "wǒ jǐ le yì diǎn yá gāo", "I squeezed out a little toothpaste.", TIAO],
  [502, "冬天要蓋厚棉被。", "dōng tiān yào gài hòu mián bèi", "In winter you need a thick quilt.", CHUANG],
  [503, "這個枕頭太軟了。", "zhè ge zhěn tóu tài ruǎn le", "This pillow is too soft.", GE],
  [504, "台北的租金很貴。", "tái běi de zū jīn hěn guì", "Rent in Taipei is expensive.", null],
  [505, "押金會在退租時退還。", "yā jīn huì zài tuì zū shí tuì huán", "The deposit is returned when you move out.", null],

  // ---- Ch22: Transportation & directions (1/2) ----
  [506, "台北的大眾交通很方便。", "tái běi de dà zhòng jiāo tōng hěn fāng biàn", "Taipei's public transportation is very convenient.", null],
  [507, "這條路很窄。", "zhè tiáo lù hěn zhǎi", "This road is narrow.", TIAO],
  [508, "這條街上有很多小吃。", "zhè tiáo jiē shàng yǒu hěn duō xiǎo chī", "There are lots of snack shops on this street.", TIAO],
  [509, "在下一個十字路口右轉。", "zài xià yí ge shí zì lù kǒu yòu zhuǎn", "Turn right at the next intersection.", GE],
  [510, "前面有紅綠燈，請慢一點。", "qián miàn yǒu hóng lǜ dēng qǐng màn yì diǎn", "There's a traffic light ahead — please slow down.", GE],
  [511, "機車不能停在人行道上。", "jī chē bù néng tíng zài rén xíng dào shàng", "Scooters can't park on the sidewalk.", TIAO],
  [512, "請走斑馬線過馬路。", "qǐng zǒu bān mǎ xiàn guò mǎ lù", "Please use the crosswalk.", TIAO],
  [513, "我好像走錯方向了。", "wǒ hǎo xiàng zǒu cuò fāng xiàng le", "I think I went the wrong way.", GE],
  [514, "郵局在銀行的左邊。", "yóu jú zài yín háng de zuǒ biān", "The post office is to the left of the bank.", null],
  [515, "便利商店在右邊。", "biàn lì shāng diàn zài yòu biān", "The convenience store is on the right.", null],
  [516, "車站就在前面。", "chē zhàn jiù zài qián miàn", "The station is just ahead.", null],
  [517, "廁所在餐廳後面。", "cè suǒ zài cān tīng hòu miàn", "The toilet is behind the restaurant.", null],
  [518, "直走大概五分鐘就到了。", "zhí zǒu dà gài wǔ fēn zhōng jiù dào le", "Go straight for about five minutes and you're there.", null],
  [519, "在第二個路口左轉。", "zài dì èr ge lù kǒu zuǒ zhuǎn", "Turn left at the second intersection.", null],
  [520, "看到郵局就右轉。", "kàn dào yóu jú jiù yòu zhuǎn", "Turn right when you see the post office.", null],
  [521, "過馬路要小心。", "guò mǎ lù yào xiǎo xīn", "Be careful crossing the road.", null],
  [522, "我用手機看地圖。", "wǒ yòng shǒu jī kàn dì tú", "I use my phone to look at the map.", ZHANG],
  [523, "請給我你的地址。", "qǐng gěi wǒ nǐ de dì zhǐ", "Please give me your address.", GE],
  [524, "車站前面有很多計程車。", "chē zhàn qián miàn yǒu hěn duō jì chéng chē", "There are lots of taxis in front of the station.", GE],
  [525, "這班公車會到台北車站嗎？", "zhè bān gōng chē huì dào tái běi chē zhàn ma", "Does this bus go to Taipei Main Station?", TAI],
  [526, "搭捷運比開車快。", "dā jié yùn bǐ kāi chē kuài", "The MRT is faster than driving.", null],
  [527, "火車誤點了半小時。", "huǒ chē wù diǎn le bàn xiǎo shí", "The train was half an hour late.", BAN],
  [528, "坐高鐵到高雄只要兩個小時。", "zuò gāo tiě dào gāo xióng zhǐ yào liǎng ge xiǎo shí", "The high-speed rail to Kaohsiung takes only two hours.", null],
  [529, "我們叫一台計程車吧。", "wǒ men jiào yì tái jì chéng chē ba", "Let's call a taxi.", TAI],

  // ---- Ch23: Transportation & directions (2/2) ----
  [530, "台灣的機車非常多。", "tái wān de jī chē fēi cháng duō", "There are a huge number of scooters in Taiwan.", TAI],
  [531, "我騎腳踏車上學。", "wǒ qí jiǎo tà chē shàng xué", "I ride a bicycle to school.", TAI],
  [532, "我還沒買汽車。", "wǒ hái méi mǎi qì chē", "I haven't bought a car yet.", TAI],
  [533, "飛機準時起飛了。", "fēi jī zhǔn shí qǐ fēi le", "The plane took off on time.", JIA_ji],
  [534, "我們坐船去綠島。", "wǒ men zuò chuán qù lǜ dǎo", "We're taking a boat to Green Island.", SOU],
  [535, "火車在第三月台。", "huǒ chē zài dì sān yuè tái", "The train is at platform three.", GE],
  [536, "我買了兩張車票。", "wǒ mǎi le liǎng zhāng chē piào", "I bought two tickets.", ZHANG],
  [537, "用悠遊卡搭捷運有折扣。", "yòng yōu yóu kǎ dā jié yùn yǒu zhé kòu", "You get a discount using an EasyCard on the MRT.", ZHANG],
  [538, "請從前門上車。", "qǐng cóng qián mén shàng chē", "Please board through the front door.", null],
  [539, "我下一站下車。", "wǒ xià yí zhàn xià chē", "I'm getting off at the next stop.", null],
  [540, "你要在台北車站轉車。", "nǐ yào zài tái běi chē zhàn zhuǎn chē", "You need to transfer at Taipei Main Station.", null],
  [541, "我每天搭車上班。", "wǒ měi tiān dā chē shàng bān", "I commute by public transport every day.", null],
  [542, "喝酒不開車。", "hē jiǔ bù kāi chē", "Don't drink and drive.", null],
  [543, "騎車一定要戴安全帽。", "qí chē yí dìng yào dài ān quán mào", "You must wear a helmet when riding.", null],
  [544, "這裡不能停車。", "zhè lǐ bù néng tíng chē", "You can't park here.", null],
  [545, "下班時間很容易塞車。", "xià bān shí jiān hěn róng yì sāi chē", "It gets jammed easily at rush hour.", null],
  [546, "快到站了，準備下車。", "kuài dào zhàn le zhǔn bèi xià chē", "We're arriving soon — get ready to get off.", null],
  [547, "這班車的終點站是淡水。", "zhè bān chē de zhōng diǎn zhàn shì dàn shuǐ", "This train's last stop is Tamsui.", GE],
  [548, "入口在另一邊。", "rù kǒu zài lìng yì biān", "The entrance is on the other side.", GE],
  [549, "請走三號出口。", "qǐng zǒu sān hào chū kǒu", "Please take exit three.", GE],
  [550, "假日的班次比較少。", "jià rì de bān cì bǐ jiào shǎo", "There are fewer services on holidays.", null],
  [551, "請看牆上的時刻表。", "qǐng kàn qiáng shàng de shí kè biǎo", "Please check the timetable on the wall.", ZHANG],
  [552, "因為颱風，班機延誤了。", "yīn wèi tái fēng bān jī yán wù le", "The flight was delayed because of the typhoon.", null],

  // ---- Ch24: Shopping & money (1/2) ----
  [553, "這家商店晚上十點關門。", "zhè jiā shāng diàn wǎn shàng shí diǎn guān mén", "This shop closes at ten at night.", JIA],
  [554, "百貨公司在週年慶打折。", "bǎi huò gōng sī zài zhōu nián qìng dǎ zhé", "The department store has discounts during its anniversary sale.", JIA],
  [555, "我去超市買菜。", "wǒ qù chāo shì mǎi cài", "I'm going to the supermarket for groceries.", JIA],
  [556, "台灣的便利商店二十四小時營業。", "tái wān de biàn lì shāng diàn èr shí sì xiǎo shí yíng yè", "Convenience stores in Taiwan are open 24 hours.", JIA],
  [557, "早上的市場很熱鬧。", "zǎo shàng de shì chǎng hěn rè nào", "The morning market is lively.", GE],
  [558, "我常在網路商店買東西。", "wǒ cháng zài wǎng lù shāng diàn mǎi dōng xi", "I often buy things from online shops.", JIA],
  [559, "我要去買一些東西。", "wǒ yào qù mǎi yì xiē dōng xi", "I'm going to buy a few things.", GE],
  [560, "這件商品正在特價。", "zhè jiàn shāng pǐn zhèng zài tè jià", "This product is on sale.", JIAN_yi],
  [561, "我不在意品牌。", "wǒ bú zài yì pǐn pái", "I don't care about brands.", GE],
  [562, "這裡的價格比較合理。", "zhè lǐ de jià gé bǐ jiào hé lǐ", "The prices here are more reasonable.", null],
  [563, "這個多少錢？", "zhè ge duō shǎo qián", "How much is this?", null],
  [564, "可以算便宜一點嗎？", "kě yǐ suàn pián yi yì diǎn ma", "Could you make it a bit cheaper?", null],
  [565, "這件外套太貴了。", "zhè jiàn wài tào tài guì le", "This jacket is too expensive.", null],
  [566, "會員有額外的折扣。", "huì yuán yǒu é wài de zhé kòu", "Members get an extra discount.", null],
  [567, "這些水果今天特價。", "zhè xiē shuǐ guǒ jīn tiān tè jià", "This fruit is on special today.", null],
  [568, "原價一千，現在只要八百。", "yuán jià yì qiān xiàn zài zhǐ yào bā bǎi", "The original price was one thousand; now it's only eight hundred.", null],
  [569, "請問有別的尺寸嗎？", "qǐng wèn yǒu bié de chǐ cùn ma", "Do you have other sizes?", null],
  [570, "這個大小剛剛好。", "zhè ge dà xiǎo gāng gāng hǎo", "This size is just right.", null],
  [571, "我喜歡這個顏色。", "wǒ xǐ huān zhè ge yán sè", "I like this color.", ZHONG],
  [572, "我買了一件黑色的外套。", "wǒ mǎi le yí jiàn hēi sè de wài tào", "I bought a black jacket.", null],
  [573, "白色的衣服容易髒。", "bái sè de yī fú róng yì zāng", "White clothes get dirty easily.", null],
  [574, "紅色在台灣代表喜氣。", "hóng sè zài tái wān dài biǎo xǐ qì", "Red represents good fortune in Taiwan.", null],
  [575, "我最喜歡藍色。", "wǒ zuì xǐ huān lán sè", "Blue is my favorite color.", null],
  [576, "綠色的燈亮了，可以走了。", "lǜ sè de dēng liàng le kě yǐ zǒu le", "The green light is on — we can go.", null],

  // ---- Ch25: Shopping & money (2/2) ----
  [577, "這朵花是黃色的。", "zhè duǒ huā shì huáng sè de", "This flower is yellow.", null],
  [578, "請問可以試穿嗎？", "qǐng wèn kě yǐ shì chuān ma", "May I try this on?", null],
  [579, "這個顏色很適合你。", "zhè ge yán sè hěn shì hé nǐ", "This color really suits you.", null],
  [580, "這家店只收現金。", "zhè jiā diàn zhǐ shōu xiàn jīn", "This shop only takes cash.", null],
  [581, "可以刷信用卡嗎？", "kě yǐ shuā xìn yòng kǎ ma", "Can I pay by credit card?", ZHANG],
  [582, "現在很多人用行動支付。", "xiàn zài hěn duō rén yòng xíng dòng zhī fù", "A lot of people use mobile payment now.", null],
  [583, "我的錢包不見了。", "wǒ de qián bāo bú jiàn le", "My wallet is missing.", GE],
  [584, "我身上只有幾個硬幣。", "wǒ shēn shàng zhǐ yǒu jǐ ge yìng bì", "I only have a few coins on me.", GE],
  [585, "這張鈔票是假的。", "zhè zhāng chāo piào shì jiǎ de", "This banknote is fake.", ZHANG],
  [586, "記得對發票，可能會中獎。", "jì de duì fā piào kě néng huì zhòng jiǎng", "Remember to check your receipt — you might win the lottery.", ZHANG],
  [587, "請給我收據。", "qǐng gěi wǒ shōu jù", "Please give me a receipt.", ZHANG],
  [588, "我要用載具存發票。", "wǒ yào yòng zài jù cún fā piào", "I want to save the invoice to my carrier.", GE],
  [589, "請到櫃檯付款。", "qǐng dào guì tái fù kuǎn", "Please pay at the counter.", null],
  [590, "退款需要三個工作天。", "tuì kuǎn xū yào sān ge gōng zuò tiān", "A refund takes three business days.", null],
  [591, "七天內可以退貨。", "qī tiān nèi kě yǐ tuì huò", "You can return it within seven days.", null],
  [592, "尺寸不對可以換貨。", "chǐ cùn bú duì kě yǐ huàn huò", "If the size is wrong you can exchange it.", null],
  [593, "這台電腦保固兩年。", "zhè tái diàn nǎo bǎo gù liǎng nián", "This computer has a two-year warranty.", null],
  [594, "這個顏色缺貨了。", "zhè ge yán sè quē huò le", "This color is out of stock.", null],
  [595, "請問這個還有貨嗎？", "qǐng wèn zhè ge hái yǒu huò ma", "Do you still have this in stock?", null],
  [596, "我自己帶購物袋。", "wǒ zì jǐ dài gòu wù dài", "I bring my own shopping bag.", GE],
  [597, "請掃描條碼。", "qǐng sǎo miáo tiáo mǎ", "Please scan the barcode.", GE],
  [598, "請問您是會員嗎？", "qǐng wèn nín shì huì yuán ma", "Are you a member?", WEI],
  [599, "點數可以換贈品。", "diǎn shù kě yǐ huàn zèng pǐn", "Points can be exchanged for gifts.", null]
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
