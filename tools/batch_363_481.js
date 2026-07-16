// Chapters 16-20 (words 363-481): Food & drinks x2, Dining & cooking x2, Home & daily life (1/2).
// Every source example here was template filler ("我想吃訂位。" / "家裡有家。") — all rewritten.
const fs = require("fs");
const { convert } = require("./pinyin2zhuyin.js");
const ENRICH_PATH = __dirname + "/enrich.json";

// measure words — zhuyin auto-generated from pinyin so it can't drift
const M = (hanzi, pinyin) => ({ hanzi, zhuyin: convert(pinyin), pinyin });
const GE = M("個", "gè"), WAN = M("碗", "wǎn"), BEI = M("杯", "bēi"), PING = M("瓶", "píng");
const KUAI = M("塊", "kuài"), TIAO = M("條", "tiáo"), KE = M("顆", "kē"), GEN = M("根", "gēn");
const ZHONG = M("種", "zhǒng"), FEN = M("份", "fèn"), DUN = M("頓", "dùn"), GUO = M("鍋", "guō");
const TAO = M("套", "tào"), SHUANG = M("雙", "shuāng"), ZHI = M("支", "zhī"), BA = M("把", "bǎ");
const ZHANG = M("張", "zhāng"), JIAN = M("間", "jiān"), SHAN = M("扇", "shàn"), MIAN = M("面", "miàn");
const TAI = M("台", "tái"), ZHAN = M("盞", "zhǎn");

// [num, hanzi, pinyin(syllable-spaced, no punctuation), en, measure|null]
const BATCH = [
  // ---- Ch16: Food & drinks (1/2) ----
  [363, "冰箱裡沒有食物了。", "bīng xiāng lǐ méi yǒu shí wù le", "There's no food left in the fridge.", null],
  [364, "我每天都吃早餐。", "wǒ měi tiān dōu chī zǎo cān", "I eat breakfast every day.", DUN],
  [365, "我們中午一起吃午餐吧。", "wǒ men zhōng wǔ yì qǐ chī wǔ cān ba", "Let's have lunch together at noon.", DUN],
  [366, "今天的晚餐我請客。", "jīn tiān de wǎn cān wǒ qǐng kè", "Dinner's on me today.", DUN],
  [367, "你吃飯了嗎？", "nǐ chī fàn le ma", "Have you eaten?", WAN],
  [368, "這家的牛肉麵很有名。", "zhè jiā de niú ròu miàn hěn yǒu míng", "This place's beef noodles are famous.", WAN],
  [369, "我買了一個麵包當早餐。", "wǒ mǎi le yí ge miàn bāo dāng zǎo cān", "I bought a bread roll for breakfast.", GE],
  [370, "生病的時候我只想喝粥。", "shēng bìng de shí hòu wǒ zhǐ xiǎng hē zhōu", "When I'm sick I only want congee.", WAN],
  [371, "這碗湯有點燙。", "zhè wǎn tāng yǒu diǎn tàng", "This soup is a bit too hot.", WAN],
  [372, "記得多喝水。", "jì de duō hē shuǐ", "Remember to drink more water.", BEI],
  [373, "你要喝茶還是咖啡？", "nǐ yào hē chá hái shì kā fēi", "Would you like tea or coffee?", BEI],
  [374, "我需要一杯咖啡提神。", "wǒ xū yào yì bēi kā fēi tí shén", "I need a cup of coffee to wake up.", BEI],
  [375, "冰箱裡還有牛奶嗎？", "bīng xiāng lǐ hái yǒu niú nǎi ma", "Is there still milk in the fridge?", BEI],
  [376, "這杯果汁是現榨的。", "zhè bēi guǒ zhī shì xiàn zhà de", "This juice is freshly squeezed.", BEI],
  [377, "天氣熱，來一瓶啤酒吧。", "tiān qì rè lái yì píng pí jiǔ ba", "It's hot — let's have a beer.", PING],
  [378, "我比較喜歡吃雞肉。", "wǒ bǐ jiào xǐ huān chī jī ròu", "I prefer chicken.", KUAI],
  [379, "這道菜用的是豬肉。", "zhè dào cài yòng de shì zhū ròu", "This dish is made with pork.", KUAI],
  [380, "牛肉麵是台灣的代表美食。", "niú ròu miàn shì tái wān de dài biǎo měi shí", "Beef noodle soup is Taiwan's signature dish.", KUAI],
  [381, "這條魚很新鮮。", "zhè tiáo yú hěn xīn xiān", "This fish is very fresh.", TIAO],
  [382, "我早餐吃了兩顆蛋。", "wǒ zǎo cān chī le liǎng kē dàn", "I ate two eggs for breakfast.", KE],
  [383, "臭豆腐是台灣有名的小吃。", "chòu dòu fǔ shì tái wān yǒu míng de xiǎo chī", "Stinky tofu is a famous Taiwanese snack.", KUAI],
  [384, "多吃蔬菜對身體好。", "duō chī shū cài duì shēn tǐ hǎo", "Eating more vegetables is good for you.", null],
  [385, "我每天都吃水果。", "wǒ měi tiān dōu chī shuǐ guǒ", "I eat fruit every day.", null],
  [386, "我買了三顆蘋果。", "wǒ mǎi le sān kē píng guǒ", "I bought three apples.", KE],

  // ---- Ch17: Food & drinks (2/2) ----
  [387, "台灣的香蕉又香又甜。", "tái wān de xiāng jiāo yòu xiāng yòu tián", "Taiwanese bananas are fragrant and sweet.", GEN],
  [388, "冬天的橘子特別甜。", "dōng tiān de jú zi tè bié tián", "Winter oranges are especially sweet.", KE],
  [389, "夏天吃西瓜最消暑。", "xià tiān chī xī guā zuì xiāo shǔ", "Eating watermelon in summer is the best way to cool off.", KE],
  [390, "我用馬鈴薯煮了濃湯。", "wǒ yòng mǎ líng shǔ zhǔ le nóng tāng", "I made soup with potatoes.", KE],
  [391, "番茄炒蛋是家常菜。", "fān qié chǎo dàn shì jiā cháng cài", "Tomato and egg is a home-style dish.", KE],
  [392, "切洋蔥讓我流眼淚。", "qiē yáng cōng ràng wǒ liú yǎn lèi", "Cutting onions makes me cry.", KE],
  [393, "我早上買了一個飯糰。", "wǒ zǎo shàng mǎi le yí ge fàn tuán", "I bought a rice ball this morning.", GE],
  [394, "我一次可以吃二十顆水餃。", "wǒ yí cì kě yǐ chī èr shí kē shuǐ jiǎo", "I can eat twenty dumplings in one sitting.", KE],
  [395, "中午我通常買便當。", "zhōng wǔ wǒ tōng cháng mǎi biàn dāng", "I usually buy a lunchbox at noon.", GE],
  [396, "冬天最適合吃火鍋。", "dōng tiān zuì shì hé chī huǒ guō", "Winter is the best time for hot pot.", GUO],
  [397, "台灣的夜市有很多小吃。", "tái wān de yè shì yǒu hěn duō xiǎo chī", "Taiwan's night markets have lots of snacks.", ZHONG],
  [398, "吃完飯我想來份甜點。", "chī wán fàn wǒ xiǎng lái fèn tián diǎn", "After the meal I'd like a dessert.", FEN],
  [399, "我的咖啡不加糖。", "wǒ de kā fēi bù jiā táng", "I don't take sugar in my coffee.", null],
  [400, "這道菜要再加一點鹽。", "zhè dào cài yào zài jiā yì diǎn yán", "This dish needs a bit more salt.", null],
  [401, "我不敢吃太辣的東西。", "wǒ bù gǎn chī tài là de dōng xi", "I can't handle very spicy food.", null],
  [402, "這個蛋糕太甜了。", "zhè ge dàn gāo tài tián le", "This cake is too sweet.", null],
  [403, "這個檸檬很酸。", "zhè ge níng méng hěn suān", "This lemon is very sour.", null],
  [404, "這杯咖啡有點苦。", "zhè bēi kā fēi yǒu diǎn kǔ", "This coffee is a little bitter.", null],
  [405, "湯太鹹了，加點水吧。", "tāng tài xián le jiā diǎn shuǐ ba", "The soup is too salty — add some water.", null],
  [406, "這家的滷肉飯真好吃。", "zhè jiā de lǔ ròu fàn zhēn hǎo chī", "This place's braised pork rice is really delicious.", null],
  [407, "這個便當有點難吃。", "zhè ge biàn dāng yǒu diǎn nán chī", "This lunchbox doesn't taste very good.", null],
  [408, "我還沒吃飯，好餓。", "wǒ hái méi chī fàn hǎo è", "I haven't eaten yet — I'm so hungry.", null],
  [409, "運動完我覺得很渴。", "yùn dòng wán wǒ jué de hěn kě", "After exercising I feel thirsty.", null],
  [410, "我吃飽了，謝謝。", "wǒ chī bǎo le xiè xiè", "I'm full, thank you.", null],

  // ---- Ch18: Dining & cooking (1/2) ----
  [411, "請問內用還是外帶？", "qǐng wèn nèi yòng hái shì wài dài", "For here or to go?", null],
  [412, "我要外帶一杯咖啡。", "wǒ yào wài dài yì bēi kā fēi", "I'd like a coffee to go.", null],
  [413, "我要訂位，兩個人。", "wǒ yào dìng wèi liǎng ge rén", "I'd like to reserve a table for two.", null],
  [414, "請問可以點餐了嗎？", "qǐng wèn kě yǐ diǎn cān le ma", "May we order now?", null],
  [415, "我們再加點一份甜點。", "wǒ men zài jiā diǎn yí fèn tián diǎn", "Let's order one more dessert.", null],
  [416, "麻煩幫我結帳。", "má fán bāng wǒ jié zhàng", "Could I have the bill, please.", null],
  [417, "吃不完可以打包嗎？", "chī bù wán kě yǐ dǎ bāo ma", "Can I take the leftovers to go?", null],
  [418, "請給我一套餐具。", "qǐng gěi wǒ yí tào cān jù", "Please give me a set of utensils.", TAO],
  [419, "我不太會用筷子。", "wǒ bú tài huì yòng kuài zi", "I'm not very good with chopsticks.", SHUANG],
  [420, "請再給我一支湯匙。", "qǐng zài gěi wǒ yì zhī tāng shi", "Please give me another spoon.", ZHI],
  [421, "小孩子用叉子比較安全。", "xiǎo hái zi yòng chā zi bǐ jiào ān quán", "It's safer for children to use a fork.", ZHI],
  [422, "這把刀子很利。", "zhè bǎ dāo zi hěn lì", "This knife is very sharp.", BA],
  [423, "請幫我拿一個碗。", "qǐng bāng wǒ ná yí ge wǎn", "Please get me a bowl.", GE],
  [424, "這個盤子破了。", "zhè ge pán zi pò le", "This plate is broken.", GE],
  [425, "這個杯子是我的。", "zhè ge bēi zi shì wǒ de", "This cup is mine.", GE],
  [426, "我不需要吸管，謝謝。", "wǒ bù xū yào xī guǎn xiè xiè", "I don't need a straw, thanks.", ZHI],
  [427, "可以給我一張紙巾嗎？", "kě yǐ gěi wǒ yì zhāng zhǐ jīn ma", "Could I get a napkin?", ZHANG],
  [428, "飲料裡的冰塊太多了。", "yǐn liào lǐ de bīng kuài tài duō le", "There's too much ice in the drink.", KUAI],
  [429, "請給我一杯溫水。", "qǐng gěi wǒ yì bēi wēn shuǐ", "Please give me a glass of warm water.", BEI],
  [430, "多喝開水對身體好。", "duō hē kāi shuǐ duì shēn tǐ hǎo", "Drinking plenty of water is good for you.", BEI],
  [431, "我要一份雞排。", "wǒ yào yí fèn jī pái", "I'd like one fried chicken cutlet.", null],
  [432, "我一餐吃兩碗飯。", "wǒ yì cān chī liǎng wǎn fàn", "I eat two bowls of rice per meal.", null],
  [433, "這個套餐比較划算。", "zhè ge tào cān bǐ jiào huá suàn", "This set meal is better value.", FEN],
  [434, "你想喝什麼飲料？", "nǐ xiǎng hē shén me yǐn liào", "What would you like to drink?", BEI],

  // ---- Ch19: Dining & cooking (2/2) ----
  [435, "珍珠是我最愛的配料。", "zhēn zhū shì wǒ zuì ài de pèi liào", "Pearls are my favorite topping.", ZHONG],
  [436, "這種醬料有點辣。", "zhè zhǒng jiàng liào yǒu diǎn là", "This sauce is a bit spicy.", ZHONG],
  [437, "我吃素食，請不要加肉。", "wǒ chī sù shí qǐng bú yào jiā ròu", "I'm vegetarian — please don't add meat.", null],
  [438, "這家店葷食素食都有。", "zhè jiā diàn hūn shí sù shí dōu yǒu", "This shop has both meat and vegetarian options.", null],
  [439, "我的餐點要不辣的。", "wǒ de cān diǎn yào bú là de", "I'd like my meal not spicy.", null],
  [440, "我的珍奶要少冰。", "wǒ de zhēn nǎi yào shǎo bīng", "I'd like less ice in my bubble tea.", null],
  [441, "天氣冷，我要去冰。", "tiān qì lěng wǒ yào qù bīng", "It's cold — I'll have it without ice.", null],
  [442, "這杯我要半糖。", "zhè bēi wǒ yào bàn táng", "I'd like this one with half sugar.", null],
  [443, "我通常都點無糖。", "wǒ tōng cháng dōu diǎn wú táng", "I usually order it sugar-free.", null],
  [444, "請幫我加熱便當。", "qǐng bāng wǒ jiā rè biàn dāng", "Please heat up my lunchbox.", null],
  [445, "開封後請冷藏。", "kāi fēng hòu qǐng lěng cáng", "Refrigerate after opening.", null],
  [446, "這些水餃要冷凍保存。", "zhè xiē shuǐ jiǎo yào lěng dòng bǎo cún", "These dumplings need to be kept frozen.", null],
  [447, "我今天烤了一個蛋糕。", "wǒ jīn tiān kǎo le yí ge dàn gāo", "I baked a cake today.", null],
  [448, "炸的東西吃多了不健康。", "zhà de dōng xi chī duō le bú jiàn kāng", "Eating too much fried food isn't healthy.", null],
  [449, "我炒了一盤青菜。", "wǒ chǎo le yì pán qīng cài", "I stir-fried a plate of greens.", null],
  [450, "這條魚用蒸的比較好吃。", "zhè tiáo yú yòng zhēng de bǐ jiào hǎo chī", "This fish tastes better steamed.", null],
  [451, "請把醬料攪拌均勻。", "qǐng bǎ jiàng liào jiǎo bàn jūn yún", "Please stir the sauce evenly.", null],
  [452, "這道菜的味道很特別。", "zhè dào cài de wèi dào hěn tè bié", "This dish has a very distinctive flavor.", ZHONG],
  [453, "這些蔬菜很新鮮。", "zhè xiē shū cài hěn xīn xiān", "These vegetables are very fresh.", null],
  [454, "這瓶牛奶已經過期了。", "zhè píng niú nǎi yǐ jīng guò qī le", "This milk has already expired.", null],
  [455, "這塊肉還沒熟。", "zhè kuài ròu hái méi shú", "This piece of meat isn't cooked yet.", null],
  [456, "我不敢吃生的魚。", "wǒ bù gǎn chī shēng de yú", "I don't dare eat raw fish.", null],
  [457, "我在廚房煮飯。", "wǒ zài chú fáng zhǔ fàn", "I'm cooking in the kitchen.", JIAN],

  // ---- Ch20: Home & daily life (1/2) ----
  [458, "我的家離公司很近。", "wǒ de jiā lí gōng sī hěn jìn", "My home is close to the office.", GE],
  [459, "這間房子很舊了。", "zhè jiān fáng zi hěn jiù le", "This house is quite old.", JIAN],
  [460, "我住在一間小公寓。", "wǒ zhù zài yì jiān xiǎo gōng yù", "I live in a small apartment.", JIAN],
  [461, "我的房間在二樓。", "wǒ de fáng jiān zài èr lóu", "My room is on the second floor.", JIAN],
  [462, "我們在客廳看電視。", "wǒ men zài kè tīng kàn diàn shì", "We watch TV in the living room.", JIAN],
  [463, "這間臥室有大窗戶。", "zhè jiān wò shì yǒu dà chuāng hù", "This bedroom has a big window.", JIAN],
  [464, "浴室裡沒有熱水。", "yù shì lǐ méi yǒu rè shuǐ", "There's no hot water in the bathroom.", JIAN],
  [465, "請問廁所在哪裡？", "qǐng wèn cè suǒ zài nǎ lǐ", "Excuse me, where's the toilet?", JIAN],
  [466, "我在陽台曬衣服。", "wǒ zài yáng tái shài yī fú", "I hang the laundry on the balcony.", GE],
  [467, "請把門關上。", "qǐng bǎ mén guān shàng", "Please close the door.", SHAN],
  [468, "打開窗戶通風吧。", "dǎ kāi chuāng hù tōng fēng ba", "Let's open the window to air the place out.", SHAN],
  [469, "這面牆要重新油漆。", "zhè miàn qiáng yào chóng xīn yóu qī", "This wall needs repainting.", MIAN],
  [470, "地板剛拖過，小心滑。", "dì bǎn gāng tuō guò xiǎo xīn huá", "The floor was just mopped — careful, it's slippery.", null],
  [471, "我每天爬樓梯運動。", "wǒ měi tiān pá lóu tī yùn dòng", "I climb the stairs for exercise every day.", null],
  [472, "電梯壞了，我們走樓梯吧。", "diàn tī huài le wǒ men zǒu lóu tī ba", "The elevator's broken — let's take the stairs.", TAI],
  [473, "這張桌子太小了。", "zhè zhāng zhuō zi tài xiǎo le", "This table is too small.", ZHANG],
  [474, "請把椅子搬過來。", "qǐng bǎ yǐ zi bān guò lái", "Please bring the chair over.", BA],
  [475, "這張床睡起來很舒服。", "zhè zhāng chuáng shuì qǐ lái hěn shū fú", "This bed is comfortable to sleep on.", ZHANG],
  [476, "他在沙發上睡著了。", "tā zài shā fā shàng shuì zháo le", "He fell asleep on the sofa.", ZHANG],
  [477, "碗放在櫃子裡。", "wǎn fàng zài guì zi lǐ", "The bowls are in the cabinet.", GE],
  [478, "這盞燈不太亮。", "zhè zhǎn dēng bú tài liàng", "This lamp isn't very bright.", ZHAN],
  [479, "夏天沒有冷氣受不了。", "xià tiān méi yǒu lěng qì shòu bù liǎo", "Summer is unbearable without air conditioning.", TAI],
  [480, "請把電風扇打開。", "qǐng bǎ diàn fēng shàn dǎ kāi", "Please turn on the electric fan.", TAI],
  [481, "洗衣機在陽台。", "xǐ yī jī zài yáng tái", "The washing machine is on the balcony.", TAI]
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
