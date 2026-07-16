// Chapters 31-35 (words 718-835): Health & body (2/2), Technology & internet x2,
// Places & public services x2.  NOTE: 741 過敏 was already enriched (commit dafb541) — skipped here.
const fs = require("fs");
const { convert } = require("./pinyin2zhuyin.js");
const ENRICH_PATH = __dirname + "/enrich.json";

const M = (hanzi, pinyin) => ({ hanzi, zhuyin: convert(pinyin), pinyin });
const GE = M("個", "gè"), TAI = M("台", "tái"), ZHANG = M("張", "zhāng"), JIA = M("家", "jiā");
const ZHI = M("支", "zhī"), FU = M("副", "fù"), TIAO = M("條", "tiáo"), ZUO = M("座", "zuò");
const JIAN = M("間", "jiān"), BU = M("部", "bù"), ZHONG = M("種", "zhǒng"), CI = M("次", "cì");
const BEN = M("本", "běn"), FEN = M("份", "fèn");

// [num, hanzi, pinyin(syllable-spaced, no punctuation), en, measure|null]
const BATCH = [
  // ---- Ch31: Health & body (2/2)  (741 過敏 already done) ----
  [718, "我一直流鼻水。", "wǒ yì zhí liú bí shuǐ", "My nose keeps running.", null],
  [719, "我頭痛，想早點休息。", "wǒ tóu tòng xiǎng zǎo diǎn xiū xí", "I have a headache — I want to rest early.", null],
  [720, "我肚子痛，可能吃壞了。", "wǒ dù zi tòng kě néng chī huài le", "My stomach hurts — I may have eaten something bad.", null],
  [721, "我喉嚨痛，說話很難受。", "wǒ hóu lóng tòng shuō huà hěn nán shòu", "My throat hurts — talking is uncomfortable.", null],
  [722, "他打球受傷了。", "tā dǎ qiú shòu shāng le", "He got injured playing ball.", null],
  [723, "這裡壓下去會痛。", "zhè lǐ yā xià qù huì tòng", "It hurts when you press here.", null],
  [724, "被蚊子咬，好癢。", "bèi wén zi yǎo hǎo yǎng", "I got bitten by a mosquito — it's so itchy.", null],
  [725, "我的腳踝腫起來了。", "wǒ de jiǎo huái zhǒng qǐ lái le", "My ankle has swollen up.", null],
  [726, "我坐車會暈。", "wǒ zuò chē huì yūn", "I get carsick.", null],
  [727, "他吃壞肚子，吐了。", "tā chī huài dù zi tù le", "He ate something bad and threw up.", null],
  [728, "我昨天拉肚子。", "wǒ zuó tiān lā dù zi", "I had diarrhea yesterday.", null],
  [729, "這個藥飯後吃。", "zhè ge yào fàn hòu chī", "Take this medicine after meals.", ZHONG],
  [730, "藥局就在轉角。", "yào jú jiù zài zhuǎn jiǎo", "The pharmacy is just around the corner.", JIA],
  [731, "我先去診所看看。", "wǒ xiān qù zhěn suǒ kàn kàn", "I'll go to the clinic and get it checked.", JIA],
  [732, "他被送到醫院了。", "tā bèi sòng dào yī yuàn le", "He was taken to the hospital.", JIA],
  [733, "看醫生要先掛號。", "kàn yī shēng yào xiān guà hào", "You have to register before seeing the doctor.", null],
  [734, "不舒服就去看醫生。", "bù shū fú jiù qù kàn yī shēng", "If you feel unwell, go see a doctor.", null],
  [735, "我預約了明天下午。", "wǒ yù yuē le míng tiān xià wǔ", "I made an appointment for tomorrow afternoon.", null],
  [736, "台灣的健保很方便。", "tái wān de jiàn bǎo hěn fāng biàn", "Taiwan's National Health Insurance is very convenient.", null],
  [737, "看病記得帶健保卡。", "kàn bìng jì de dài jiàn bǎo kǎ", "Remember to bring your NHI card when seeing a doctor.", ZHANG],
  [738, "半夜他去掛急診。", "bàn yè tā qù guà jí zhěn", "He went to the emergency room in the middle of the night.", null],
  [739, "救護車很快就到了。", "jiù hù chē hěn kuài jiù dào le", "The ambulance arrived very quickly.", TAI],
  [740, "醫生要他在家休養。", "yī shēng yào tā zài jiā xiū yǎng", "The doctor told him to recuperate at home.", null],

  // ---- Ch32: Technology & internet (1/2) ----
  [742, "我的電腦跑得很慢。", "wǒ de diàn nǎo pǎo de hěn màn", "My computer runs very slowly.", TAI],
  [743, "我出差都帶筆記型電腦。", "wǒ chū chāi dōu dài bǐ jì xíng diàn nǎo", "I bring my laptop on business trips.", TAI],
  [744, "我的手機沒電了。", "wǒ de shǒu jī méi diàn le", "My phone is out of battery.", ZHI],
  [745, "我用平板看影片。", "wǒ yòng píng bǎn kàn yǐng piàn", "I watch videos on my tablet.", TAI],
  [746, "螢幕太亮了，眼睛不舒服。", "yíng mù tài liàng le yǎn jīng bù shū fú", "The screen is too bright — it hurts my eyes.", GE],
  [747, "這個鍵盤打起來很舒服。", "zhè ge jiàn pán dǎ qǐ lái hěn shū fú", "This keyboard is comfortable to type on.", GE],
  [748, "滑鼠好像壞了。", "huá shǔ hǎo xiàng huài le", "The mouse seems to be broken.", ZHI],
  [749, "我戴耳機聽音樂。", "wǒ dài ěr jī tīng yīn yuè", "I listen to music with earphones.", FU],
  [750, "你有帶充電器嗎？", "nǐ yǒu dài chōng diàn qì ma", "Did you bring a charger?", GE],
  [751, "這支手機的電池很耐用。", "zhè zhī shǒu jī de diàn chí hěn nài yòng", "This phone's battery lasts a long time.", GE],
  [752, "我用相機拍風景。", "wǒ yòng xiāng jī pāi fēng jǐng", "I photograph scenery with my camera.", TAI],
  [753, "這裡的網路很快。", "zhè lǐ de wǎng lù hěn kuài", "The internet here is fast.", null],
  [754, "請問有無線網路嗎？", "qǐng wèn yǒu wú xiàn wǎng lù ma", "Is there Wi-Fi here?", null],
  [755, "山上的訊號不好。", "shān shàng de xùn hào bù hǎo", "The signal is bad up in the mountains.", null],
  [756, "這個應用程式很好用。", "zhè ge yīng yòng chéng shì hěn hǎo yòng", "This app is really useful.", GE],
  [757, "這個網站可以買票。", "zhè ge wǎng zhàn kě yǐ mǎi piào", "You can buy tickets on this website.", GE],
  [758, "這個網頁打不開。", "zhè ge wǎng yè dǎ bù kāi", "This webpage won't load.", GE],
  [759, "我把連結傳給你。", "wǒ bǎ lián jié chuán gěi nǐ", "I'll send you the link.", GE],
  [760, "請用別的瀏覽器試試。", "qǐng yòng bié de liú lǎn qì shì shì", "Please try a different browser.", GE],
  [761, "我用搜尋引擎找資料。", "wǒ yòng sōu xún yǐn qíng zhǎo zī liào", "I use a search engine to find information.", GE],
  [762, "他很少用社群媒體。", "tā hěn shǎo yòng shè qún méi tǐ", "He rarely uses social media.", null],
  [763, "我拍了很多照片。", "wǒ pāi le hěn duō zhào piàn", "I took a lot of photos.", ZHANG],
  [764, "這部影片很好笑。", "zhè bù yǐng piàn hěn hǎo xiào", "This video is hilarious.", BU],
  [765, "我一邊工作一邊聽音樂。", "wǒ yì biān gōng zuò yì biān tīng yīn yuè", "I listen to music while I work.", null],

  // ---- Ch33: Technology & internet (2/2) ----
  [766, "電視的聲音太大了。", "diàn shì de shēng yīn tài dà le", "The TV is too loud.", null],
  [767, "麥克風好像沒開。", "mài kè fēng hǎo xiàng méi kāi", "The microphone doesn't seem to be on.", ZHI],
  [768, "我早上八點就開機了。", "wǒ zǎo shàng bā diǎn jiù kāi jī le", "I turned the computer on at eight this morning.", null],
  [769, "下班前記得關機。", "xià bān qián jì de guān jī", "Remember to shut down before leaving work.", null],
  [770, "重新啟動就好了。", "chóng xīn qǐ dòng jiù hǎo le", "Just restart it and it'll be fine.", null],
  [771, "我的手機正在充電。", "wǒ de shǒu jī zhèng zài chōng diàn", "My phone is charging.", null],
  [772, "電腦連線失敗了。", "diàn nǎo lián xiàn shī bài le", "The computer failed to connect.", null],
  [773, "剛剛突然斷線了。", "gāng gāng tú rán duàn xiàn le", "It suddenly disconnected just now.", null],
  [774, "我幫你安裝這個軟體。", "wǒ bāng nǐ ān zhuāng zhè ge ruǎn tǐ", "I'll install this software for you.", null],
  [775, "不用的話就解除安裝吧。", "bú yòng de huà jiù jiě chú ān zhuāng ba", "If you don't use it, just uninstall it.", null],
  [776, "你可以在設定裡改。", "nǐ kě yǐ zài shè dìng lǐ gǎi", "You can change it in the settings.", null],
  [777, "通知欄有很多訊息。", "tōng zhī lán yǒu hěn duō xùn xí", "There are lots of messages in the notification panel.", GE],
  [778, "我截圖傳給你看。", "wǒ jié tú chuán gěi nǐ kàn", "I'll screenshot it and send it to you.", ZHANG],
  [779, "請掃描這個條碼。", "qǐng sǎo miáo zhè ge tiáo mǎ", "Please scan this barcode.", null],
  [780, "我複製了你的檔案。", "wǒ fù zhì le nǐ de dàng àn", "I copied your file.", null],
  [781, "複製之後貼上就好。", "fù zhì zhī hòu tiē shàng jiù hǎo", "Just copy it and then paste it.", null],
  [782, "這些照片可以刪除了。", "zhè xiē zhào piàn kě yǐ shān chú le", "These photos can be deleted now.", null],
  [783, "記得先儲存檔案。", "jì de xiān chǔ cún dàng àn", "Remember to save the file first.", null],
  [784, "我把資料分享給大家。", "wǒ bǎ zī liào fēn xiǎng gěi dà jiā", "I shared the materials with everyone.", null],
  [785, "手機的容量不夠了。", "shǒu jī de róng liàng bú gòu le", "My phone doesn't have enough storage.", null],
  [786, "這台電腦的記憶體很大。", "zhè tái diàn nǎo de jì yì tǐ hěn dà", "This computer has a lot of memory.", null],
  [787, "我把檔案存在雲端。", "wǒ bǎ dàng àn cún zài yún duān", "I keep my files in the cloud.", null],
  [788, "驗證碼寄到你的手機了。", "yàn zhèng mǎ jì dào nǐ de shǒu jī le", "The verification code was sent to your phone.", GE],

  // ---- Ch34: Places & public services (1/2) ----
  [789, "這個地方很安靜。", "zhè ge dì fāng hěn ān jìng", "This place is very quiet.", GE],
  [790, "台北是個大城市。", "tái běi shì ge dà chéng shì", "Taipei is a big city.", ZUO],
  [791, "鄉下的空氣比較好。", "xiāng xià de kōng qì bǐ jiào hǎo", "The air is better in the countryside.", null],
  [792, "你來自哪個國家？", "nǐ lái zì nǎ ge guó jiā", "Which country are you from?", GE],
  [793, "我很喜歡台灣。", "wǒ hěn xǐ huān tái wān", "I really like Taiwan.", null],
  [794, "我住在台北。", "wǒ zhù zài tái běi", "I live in Taipei.", null],
  [795, "我常去公園散步。", "wǒ cháng qù gōng yuán sàn bù", "I often go to the park for a walk.", ZUO],
  [796, "圖書館很安靜，適合念書。", "tú shū guǎn hěn ān jìng shì hé niàn shū", "The library is quiet — good for studying.", JIAN],
  [797, "我要去銀行辦事。", "wǒ yào qù yín háng bàn shì", "I need to go to the bank to take care of something.", JIA],
  [798, "郵局五點就關了。", "yóu jú wǔ diǎn jiù guān le", "The post office closes at five.", JIA],
  [799, "有問題可以去派出所。", "yǒu wèn tí kě yǐ qù pài chū suǒ", "If there's a problem you can go to the police station.", GE],
  [800, "消防隊很快就來了。", "xiāo fáng duì hěn kuài jiù lái le", "The fire department arrived very quickly.", null],
  [801, "我去市政府辦手續。", "wǒ qù shì zhèng fǔ bàn shǒu xù", "I'm going to the city government to do the paperwork.", null],
  [802, "簽證的事要問移民署。", "qiān zhèng de shì yào wèn yí mín shǔ", "You need to ask the immigration office about visas.", null],
  [803, "戶政事務所可以辦地址。", "hù zhèng shì wù suǒ kě yǐ bàn dì zhǐ", "You can register your address at the household registration office.", GE],
  [804, "區公所離這裡不遠。", "qū gōng suǒ lí zhè lǐ bù yuǎn", "The district office isn't far from here.", GE],
  [805, "我們提早兩小時到機場。", "wǒ men tí zǎo liǎng xiǎo shí dào jī chǎng", "We got to the airport two hours early.", ZUO],
  [806, "這家旅館很乾淨。", "zhè jiā lǚ guǎn hěn gān jìng", "This hotel is very clean.", JIA],
  [807, "我們住在海邊的民宿。", "wǒ men zhù zài hǎi biān de mín sù", "We're staying at a guesthouse by the sea.", JIA],
  [808, "我住學校的宿舍。", "wǒ zhù xué xiào de sù shè", "I live in the school dormitory.", JIAN],
  [809, "我每週去健身房三次。", "wǒ měi zhōu qù jiàn shēn fáng sān cì", "I go to the gym three times a week.", JIA],
  [810, "夏天我常去游泳池。", "xià tiān wǒ cháng qù yóu yǒng chí", "I often go to the swimming pool in summer.", ZUO],
  [811, "週末我們去電影院看電影。", "zhōu mò wǒ men qù diàn yǐng yuàn kàn diàn yǐng", "We're going to the cinema this weekend.", JIA],
  [812, "故宮是有名的博物館。", "gù gōng shì yǒu míng de bó wù guǎn", "The National Palace Museum is a famous museum.", JIAN],

  // ---- Ch35: Places & public services (2/2) ----
  [813, "台灣的夜市很熱鬧。", "tái wān de yè shì hěn rè nào", "Taiwan's night markets are lively.", GE],
  [814, "這座寺廟很古老。", "zhè zuò sì miào hěn gǔ lǎo", "This temple is very old.", ZUO],
  [815, "他每個星期天去教會。", "tā měi ge xīng qí tiān qù jiào huì", "He goes to church every Sunday.", JIAN],
  [816, "廟前面有很多小吃。", "miào qián miàn yǒu hěn duō xiǎo chī", "There are lots of snack stalls in front of the temple.", ZUO],
  [817, "我們去海邊看日出。", "wǒ men qù hǎi biān kàn rì chū", "We're going to the seaside to watch the sunrise.", null],
  [818, "台灣有很多高山。", "tái wān yǒu hěn duō gāo shān", "Taiwan has many high mountains.", ZUO],
  [819, "這條河的水很乾淨。", "zhè tiáo hé de shuǐ hěn gān jìng", "The water in this river is very clean.", TIAO],
  [820, "日月潭是台灣最有名的湖。", "rì yuè tán shì tái wān zuì yǒu míng de hú", "Sun Moon Lake is Taiwan's most famous lake.", GE],
  [821, "不好意思，請問廁所在哪裡？", "bù hǎo yì si qǐng wèn cè suǒ zài nǎ lǐ", "Excuse me, where is the toilet?", null],
  [822, "有問題可以問服務台。", "yǒu wèn tí kě yǐ wèn fú wù tái", "You can ask at the service desk if you have questions.", GE],
  [823, "請到櫃台辦理。", "qǐng dào guì tái bàn lǐ", "Please go to the counter to take care of it.", GE],
  [824, "請先抽號碼牌。", "qǐng xiān chōu hào mǎ pái", "Please take a queue number first.", ZHANG],
  [825, "大家都在排隊。", "dà jiā dōu zài pái duì", "Everyone is lining up.", null],
  [826, "我要申請居留證。", "wǒ yào shēn qǐng jū liú zhèng", "I need to apply for a residence permit.", null],
  [827, "這件事今天可以辦理。", "zhè jiàn shì jīn tiān kě yǐ bàn lǐ", "This can be taken care of today.", null],
  [828, "請帶證件來。", "qǐng dài zhèng jiàn lái", "Please bring your ID.", ZHANG],
  [829, "我的護照快過期了。", "wǒ de hù zhào kuài guò qí le", "My passport is about to expire.", BEN],
  [830, "我的簽證下個月到期。", "wǒ de qiān zhèng xià ge yuè dào qí", "My visa expires next month.", ZHANG],
  [831, "外國人要辦居留證。", "wài guó rén yào bàn jū liú zhèng", "Foreigners need to get a residence permit.", ZHANG],
  [832, "打工要先有工作證。", "dǎ gōng yào xiān yǒu gōng zuò zhèng", "You need a work permit before taking a job.", ZHANG],
  [833, "請填這張表單。", "qǐng tián zhè zhāng biǎo dān", "Please fill out this form.", ZHANG],
  [834, "請附上護照的影本。", "qǐng fù shàng hù zhào de yǐng běn", "Please attach a photocopy of your passport.", FEN],
  [835, "正本請自己保留。", "zhèng běn qǐng zì jǐ bǎo liú", "Please keep the original document yourself.", FEN]
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
