// Chapters 36-42 (words 836-1000): Weather & nature x2, Emotions & personality x2,
// Conversation & social interaction, Problems/emergencies/abstract x2.  FINAL BATCH.
// Ch40 (930-952) had genuinely natural source examples — kept and annotated.
// Ch36-39, 41-42 were template filler ("發生偷時，請先保持冷靜。") — rewritten.
const fs = require("fs");
const { convert } = require("./pinyin2zhuyin.js");
const ENRICH_PATH = __dirname + "/enrich.json";

const M = (hanzi, pinyin) => ({ hanzi, zhuyin: convert(pinyin), pinyin });
const GE = M("個", "gè"), CHANG = M("場", "chǎng"), ZHEN = M("陣", "zhèn"), DAO = M("道", "dào");
const DUO = M("朵", "duǒ"), PIAN = M("片", "piàn"), KE_tree = M("棵", "kē"), KE_round = M("顆", "kē");
const ZHI = M("隻", "zhī"), BA = M("把", "bǎ"), JIAN_yi = M("件", "jiàn"), ZHONG = M("種", "zhǒng");
const CI = M("次", "cì"), TIAO = M("條", "tiáo");

// [num, hanzi, pinyin(syllable-spaced, no punctuation), en, measure|null]
const BATCH = [
  // ---- Ch36: Weather & nature (1/2) ----
  [836, "今天的天氣很好。", "jīn tiān de tiān qì hěn hǎo", "The weather is lovely today.", null],
  [837, "難得的晴天，出去走走吧。", "nán dé de qíng tiān chū qù zǒu zǒu ba", "A rare sunny day — let's go out.", null],
  [838, "陰天讓人想睡覺。", "yīn tiān ràng rén xiǎng shuì jiào", "Cloudy days make you sleepy.", null],
  [839, "下雨了，記得帶傘。", "xià yǔ le jì de dài sǎn", "It's raining — remember your umbrella.", null],
  [840, "昨天下了一場大雨。", "zuó tiān xià le yì chǎng dà yǔ", "There was a heavy downpour yesterday.", CHANG],
  [841, "外面下著小雨。", "wài miàn xià zhe xiǎo yǔ", "It's drizzling outside.", CHANG],
  [842, "颱風要來了，快去買菜。", "tái fēng yào lái le kuài qù mǎi cài", "A typhoon is coming — go buy groceries.", GE],
  [843, "今天的風很大。", "jīn tiān de fēng hěn dà", "The wind is strong today.", ZHEN],
  [844, "強風把傘吹壞了。", "qiáng fēng bǎ sǎn chuī huài le", "The strong wind broke my umbrella.", ZHEN],
  [845, "我聽到打雷的聲音。", "wǒ tīng dào dǎ léi de shēng yīn", "I heard the sound of thunder.", null],
  [846, "剛剛有一道閃電。", "gāng gāng yǒu yí dào shǎn diàn", "There was a flash of lightning just now.", DAO],
  [847, "天上的雲很白。", "tiān shàng de yún hěn bái", "The clouds in the sky are very white.", DUO],
  [848, "今天的太陽好大。", "jīn tiān de tài yáng hǎo dà", "The sun is really strong today.", GE],
  [849, "天空是藍色的。", "tiān kōng shì lán sè de", "The sky is blue.", PIAN],
  [850, "今天的溫度只有十度。", "jīn tiān de wēn dù zhǐ yǒu shí dù", "Today's temperature is only ten degrees.", null],
  [851, "現在氣溫三十度。", "xiàn zài qì wēn sān shí dù", "It's thirty degrees right now.", null],
  [852, "夏天的台灣很熱。", "xià tiān de tái wān hěn rè", "Taiwan is very hot in summer.", null],
  [853, "今天特別冷，多穿一點。", "jīn tiān tè bié lěng duō chuān yì diǎn", "It's especially cold today — wear more.", null],
  [854, "晚上有點涼。", "wǎn shàng yǒu diǎn liáng", "It's a bit cool in the evening.", null],
  [855, "春天的天氣很溫暖。", "chūn tiān de tiān qì hěn wēn nuǎn", "Spring weather is warm.", null],
  [856, "台灣的夏天很潮濕。", "tái wān de xià tiān hěn cháo shī", "Taiwan's summers are very humid.", null],
  [857, "冬天的空氣很乾燥。", "dōng tiān de kōng qì hěn gān zào", "The air is dry in winter.", null],
  [858, "下雨前特別悶熱。", "xià yǔ qián tè bié mèn rè", "It's especially muggy before it rains.", null],
  [859, "我最喜歡的季節是秋天。", "wǒ zuì xǐ huān de jì jié shì qiū tiān", "My favorite season is autumn.", GE],

  // ---- Ch37: Weather & nature (2/2) ----
  [860, "春天有很多花。", "chūn tiān yǒu hěn duō huā", "There are lots of flowers in spring.", null],
  [861, "夏天我常去海邊。", "xià tiān wǒ cháng qù hǎi biān", "I often go to the seaside in summer.", null],
  [862, "秋天的天氣最舒服。", "qiū tiān de tiān qì zuì shū fú", "Autumn weather is the most comfortable.", null],
  [863, "台灣的冬天不會下雪。", "tái wān de dōng tiān bú huì xià xuě", "It doesn't snow in Taiwan's winter.", null],
  [864, "我忘了帶雨傘。", "wǒ wàng le dài yǔ sǎn", "I forgot to bring an umbrella.", BA],
  [865, "騎車下雨要穿雨衣。", "qí chē xià yǔ yào chuān yǔ yī", "Wear a raincoat when riding in the rain.", JIAN_yi],
  [866, "出門記得擦防曬。", "chū mén jì de cā fáng shài", "Remember to put on sunscreen before going out.", null],
  [867, "山上的空氣很新鮮。", "shān shàng de kōng qì hěn xīn xiān", "The air in the mountains is fresh.", null],
  [868, "空氣污染越來越嚴重。", "kōng qì wū rǎn yuè lái yuè yán zhòng", "Air pollution is getting worse and worse.", null],
  [869, "台灣常常有地震。", "tái wān cháng cháng yǒu dì zhèn", "Taiwan has earthquakes often.", CI],
  [870, "房子搖晃了幾秒。", "fáng zi yáo huǎng le jǐ miǎo", "The house shook for a few seconds.", null],
  [871, "我喜歡親近大自然。", "wǒ xǐ huān qīn jìn dà zì rán", "I like being close to nature.", null],
  [872, "這棵樹有一百年了。", "zhè kē shù yǒu yì bǎi nián le", "This tree is a hundred years old.", KE_tree],
  [873, "這朵花很香。", "zhè duǒ huā hěn xiāng", "This flower smells lovely.", DUO],
  [874, "公園的草很綠。", "gōng yuán de cǎo hěn lǜ", "The grass in the park is very green.", null],
  [875, "森林裡很涼快。", "sēn lín lǐ hěn liáng kuài", "It's cool in the forest.", PIAN],
  [876, "台灣四面都是海。", "tái wān sì miàn dōu shì hǎi", "Taiwan is surrounded by sea on all sides.", PIAN],
  [877, "我們在沙灘上散步。", "wǒ men zài shā tān shàng sàn bù", "We took a walk on the beach.", PIAN],
  [878, "這顆石頭很重。", "zhè kē shí tóu hěn zhòng", "This stone is very heavy.", KE_round],
  [879, "動物園裡有很多動物。", "dòng wù yuán lǐ yǒu hěn duō dòng wù", "There are many animals in the zoo.", ZHI],
  [880, "我家的狗很聰明。", "wǒ jiā de gǒu hěn cōng míng", "My dog is very smart.", ZHI],
  [881, "這隻貓很愛睡覺。", "zhè zhī māo hěn ài shuì jiào", "This cat loves to sleep.", ZHI],
  [882, "樹上有一隻鳥。", "shù shàng yǒu yì zhī niǎo", "There's a bird in the tree.", ZHI],

  // ---- Ch38: Emotions & personality (1/2) ----
  [883, "收到禮物我很開心。", "shōu dào lǐ wù wǒ hěn kāi xīn", "I'm happy to have received the gift.", null],
  [884, "很高興認識你。", "hěn gāo xìng rèn shì nǐ", "Nice to meet you.", null],
  [885, "祝你生日快樂。", "zhù nǐ shēng rì kuài lè", "Happy birthday to you.", null],
  [886, "聽到這個消息我很難過。", "tīng dào zhè ge xiāo xí wǒ hěn nán guò", "I'm sad to hear this news.", null],
  [887, "她哭得很傷心。", "tā kū de hěn shāng xīn", "She cried her heart out.", null],
  [888, "他還在生我的氣。", "tā hái zài shēng wǒ de qì", "He's still angry with me.", null],
  [889, "面試前我很緊張。", "miàn shì qián wǒ hěn jǐn zhāng", "I was nervous before the interview.", null],
  [890, "媽媽很擔心我。", "mā ma hěn dān xīn wǒ", "My mom worries about me a lot.", null],
  [891, "我很害怕蟑螂。", "wǒ hěn hài pà zhāng láng", "I'm really scared of cockroaches.", null],
  [892, "你放心，我會處理。", "nǐ fàng xīn wǒ huì chǔ lǐ", "Don't worry — I'll handle it.", null],
  [893, "結果讓我有點失望。", "jié guǒ ràng wǒ yǒu diǎn shī wàng", "The result left me a little disappointed.", null],
  [894, "要出國了，我好興奮。", "yào chū guó le wǒ hǎo xìng fèn", "I'm going abroad — I'm so excited.", null],
  [895, "這個消息讓大家很驚訝。", "zhè ge xiāo xí ràng dà jiā hěn jīng yà", "This news surprised everyone.", null],
  [896, "我也很無奈，沒辦法。", "wǒ yě hěn wú nài méi bàn fǎ", "I feel helpless too — there's nothing to be done.", null],
  [897, "那個場面有點尷尬。", "nà ge chǎng miàn yǒu diǎn gān gà", "That situation was a bit awkward.", null],
  [898, "一個人住有時候很孤單。", "yí ge rén zhù yǒu shí hòu hěn gū dān", "Living alone is sometimes lonely.", null],
  [899, "最近的事讓我很心煩。", "zuì jìn de shì ràng wǒ hěn xīn fán", "Recent events have been troubling me.", null],
  [900, "工作的壓力很大。", "gōng zuò de yā lì hěn dà", "The pressure at work is heavy.", null],
  [901, "今天心情不錯。", "jīn tiān xīn qíng bú cuò", "I'm in a good mood today.", null],
  [902, "這種感覺很奇怪。", "zhè zhǒng gǎn jué hěn qí guài", "This feeling is strange.", ZHONG],
  [903, "客戶對結果很滿意。", "kè hù duì jié guǒ hěn mǎn yì", "The client is very satisfied with the result.", null],
  [904, "大家對這個決定很不滿。", "dà jiā duì zhè ge jué dìng hěn bù mǎn", "Everyone is dissatisfied with this decision.", null],
  [905, "我有點後悔沒去。", "wǒ yǒu diǎn hòu huǐ méi qù", "I kind of regret not going.", null],
  [906, "我很羨慕你可以到處旅行。", "wǒ hěn xiàn mù nǐ kě yǐ dào chù lǚ xíng", "I envy that you can travel everywhere.", null],

  // ---- Ch39: Emotions & personality (2/2) ----
  [907, "這部電影讓我很感動。", "zhè bù diàn yǐng ràng wǒ hěn gǎn dòng", "This movie really moved me.", null],
  [908, "他說話很有自信。", "tā shuō huà hěn yǒu zì xìn", "He speaks with a lot of confidence.", null],
  [909, "她在陌生人面前很害羞。", "tā zài mò shēng rén miàn qián hěn hài xiū", "She's shy around strangers.", null],
  [910, "你要勇敢一點。", "nǐ yào yǒng gǎn yì diǎn", "You need to be a bit braver.", null],
  [911, "路上小心。", "lù shàng xiǎo xīn", "Take care on your way.", null],
  [912, "他工作很認真。", "tā gōng zuò hěn rèn zhēn", "He works very conscientiously.", null],
  [913, "只要努力就有機會。", "zhǐ yào nǔ lì jiù yǒu jī huì", "As long as you work hard, there's a chance.", null],
  [914, "我今天好懶，不想出門。", "wǒ jīn tiān hǎo lǎn bù xiǎng chū mén", "I'm so lazy today — I don't want to go out.", null],
  [915, "台灣人很友善。", "tái wān rén hěn yǒu shàn", "Taiwanese people are very friendly.", null],
  [916, "你太客氣了。", "nǐ tài kè qì le", "You're too polite.", null],
  [917, "誠實最重要。", "chéng shí zuì zhòng yào", "Honesty matters most.", null],
  [918, "這位老師很有耐心。", "zhè wèi lǎo shī hěn yǒu nài xīn", "This teacher is very patient.", null],
  [919, "這個孩子很聰明。", "zhè ge hái zi hěn cōng míng", "This child is very clever.", null],
  [920, "他很幽默，大家都喜歡他。", "tā hěn yōu mò dà jiā dōu xǐ huān tā", "He's funny — everyone likes him.", null],
  [921, "她說話很溫柔。", "tā shuō huà hěn wēn róu", "She speaks very gently.", null],
  [922, "他說話比較直接。", "tā shuō huà bǐ jiào zhí jiē", "He's fairly direct in how he speaks.", null],
  [923, "老闆對客人很熱情。", "lǎo bǎn duì kè rén hěn rè qíng", "The owner is warm toward customers.", null],
  [924, "遇到問題要冷靜。", "yù dào wèn tí yào lěng jìng", "Stay calm when you run into problems.", null],
  [925, "她從小就很獨立。", "tā cóng xiǎo jiù hěn dú lì", "She's been independent since she was little.", null],
  [926, "不要想太多負面的事。", "bú yào xiǎng tài duō fù miàn de shì", "Don't dwell on negative things.", null],
  [927, "他的態度很正面。", "tā de tài dù hěn zhèng miàn", "His attitude is very positive.", null],
  [928, "我們的個性完全不同。", "wǒ men de gè xìng wán quán bù tóng", "Our personalities are completely different.", ZHONG],
  [929, "早起是個好習慣。", "zǎo qǐ shì ge hǎo xí guàn", "Getting up early is a good habit.", GE],

  // ---- Ch40: Conversation & social interaction (source examples were good — kept) ----
  [930, "你好，很高興認識你。", "nǐ hǎo hěn gāo xìng rèn shì nǐ", "Hello, nice to meet you.", null],
  [931, "早安，你今天好嗎？", "zǎo ān nǐ jīn tiān hǎo ma", "Good morning — how are you today?", null],
  [932, "晚安，明天見。", "wǎn ān míng tiān jiàn", "Good night — see you tomorrow.", null],
  [933, "我要走了，再見。", "wǒ yào zǒu le zài jiàn", "I'm heading off — goodbye.", null],
  [934, "謝謝你的幫忙。", "xiè xiè nǐ de bāng máng", "Thank you for your help.", null],
  [935, "不客氣，這是我應該做的。", "bú kè qì zhè shì wǒ yīng gāi zuò de", "You're welcome — it's the least I could do.", null],
  [936, "對不起，我來晚了。", "duì bù qǐ wǒ lái wǎn le", "Sorry, I'm late.", null],
  [937, "沒關係，下次注意就好。", "méi guān xì xià cì zhù yì jiù hǎo", "It's okay — just be careful next time.", null],
  [938, "請坐這裡。", "qǐng zuò zhè lǐ", "Please sit here.", null],
  [939, "不好意思，可以借過一下嗎？", "bù hǎo yì si kě yǐ jiè guò yí xià ma", "Excuse me, may I get past?", null],
  [940, "請問，捷運站怎麼走？", "qǐng wèn jié yùn zhàn zěn me zǒu", "Excuse me, how do I get to the MRT station?", null],
  [941, "歡迎來台灣。", "huān yíng lái tái wān", "Welcome to Taiwan.", null],
  [942, "恭喜你找到新工作。", "gōng xǐ nǐ zhǎo dào xīn gōng zuò", "Congratulations on your new job.", null],
  [943, "明天要考試，加油！", "míng tiān yào kǎo shì jiā yóu", "You have an exam tomorrow — you've got this!", null],
  [944, "今天辛苦了，早點休息。", "jīn tiān xīn kǔ le zǎo diǎn xiū xí", "Thanks for your hard work today — rest early.", null],
  [945, "好久不見，你最近好嗎？", "hǎo jiǔ bú jiàn nǐ zuì jìn hǎo ma", "Long time no see — how have you been?", null],
  [946, "原來如此，我現在懂了。", "yuán lái rú cǐ wǒ xiàn zài dǒng le", "I see — now I understand.", null],
  [947, "沒問題，我可以幫你。", "méi wèn tí wǒ kě yǐ bāng nǐ", "No problem — I can help you.", null],
  [948, "這裡不行停車。", "zhè lǐ bù xíng tíng chē", "You can't park here.", null],
  [949, "我還不確定，要看情況。", "wǒ hái bú què dìng yào kàn qíng kuàng", "I'm not sure yet — it depends.", null],
  [950, "吃什麼都可以，我隨便。", "chī shén me dōu kě yǐ wǒ suí biàn", "Anything's fine with me.", null],
  [951, "不用急，慢慢來。", "bú yòng jí màn màn lái", "No rush — take your time.", null],
  [952, "別擔心，問題會解決的。", "bié dān xīn wèn tí huì jiě jué de", "Don't worry — the problem will get sorted out.", null],

  // ---- Ch41: Problems, emergencies & abstract essentials (1/2) ----
  [953, "謝謝你的幫助。", "xiè xiè nǐ de bāng zhù", "Thank you for your help.", null],
  [954, "救命！有人掉到水裡了！", "jiù mìng yǒu rén diào dào shuǐ lǐ le", "Help! Someone fell into the water!", null],
  [955, "小偷偷走了我的錢包。", "xiǎo tōu tōu zǒu le wǒ de qián bāo", "A thief stole my wallet.", GE],
  [956, "我的腳踏車被偷了。", "wǒ de jiǎo tà chē bèi tōu le", "My bicycle was stolen.", null],
  [957, "我遺失了我的證件。", "wǒ yí shī le wǒ de zhèng jiàn", "I lost my ID.", null],
  [958, "我終於找到鑰匙了。", "wǒ zhōng yú zhǎo dào yào shi le", "I finally found my keys.", null],
  [959, "我的手機壞掉了。", "wǒ de shǒu jī huài diào le", "My phone is broken.", null],
  [960, "這張卡不能用。", "zhè zhāng kǎ bù néng yòng", "This card doesn't work.", null],
  [961, "電腦沒有反應。", "diàn nǎo méi yǒu fǎn yīng", "The computer isn't responding.", null],
  [962, "電梯卡住了。", "diàn tī kǎ zhù le", "The elevator is stuck.", null],
  [963, "昨天晚上停電了。", "zuó tiān wǎn shàng tíng diàn le", "The power went out last night.", null],
  [964, "浴室的天花板在漏水。", "yù shì de tiān huā bǎn zài lòu shuǐ", "The bathroom ceiling is leaking.", null],
  [965, "發生火災要走樓梯。", "fā shēng huǒ zāi yào zǒu lóu tī", "In a fire, use the stairs.", CHANG],
  [966, "出事了要馬上報警。", "chū shì le yào mǎ shàng bào jǐng", "If something happens, call the police right away.", null],
  [967, "這是緊急情況。", "zhè shì jǐn jí qíng kuàng", "This is an emergency.", null],
  [968, "路上發生了意外。", "lù shàng fā shēng le yì wài", "There was an accident on the road.", CHANG],
  [969, "因為颱風，班機取消了。", "yīn wèi tái fēng bān jī qǔ xiāo le", "The flight was cancelled because of the typhoon.", null],
  [970, "會議改期到下星期。", "huì yì gǎi qí dào xià xīng qí", "The meeting was rescheduled to next week.", null],
  [971, "再不走就來不及了。", "zài bù zǒu jiù lái bù jí le", "If we don't leave now, we won't make it.", null],
  [972, "我趕不上最後一班車。", "wǒ gǎn bù shàng zuì hòu yì bān chē", "I can't catch the last train.", null],
  [973, "我錯過了那班車。", "wǒ cuò guò le nà bān chē", "I missed that train.", null],
  [974, "活動延後一個星期。", "huó dòng yán hòu yí ge xīng qí", "The event was postponed by a week.", null],
  [975, "我們提前到了。", "wǒ men tí qián dào le", "We arrived ahead of time.", null],
  [976, "遲到的原因是塞車。", "chí dào de yuán yīn shì sāi chē", "The reason for being late was traffic.", GE],

  // ---- Ch42: Problems, emergencies & abstract essentials (2/2) ----
  [977, "這個方法很有效。", "zhè ge fāng fǎ hěn yǒu xiào", "This method is very effective.", GE],
  [978, "情況有點複雜。", "qíng kuàng yǒu diǎn fù zá", "The situation is a bit complicated.", GE],
  [979, "這是個好機會。", "zhè shì ge hǎo jī huì", "This is a good opportunity.", GE],
  [980, "這次的經驗很寶貴。", "zhè cì de jīng yàn hěn bǎo guì", "This experience was valuable.", CI],
  [981, "這本書的內容很有趣。", "zhè běn shū de nèi róng hěn yǒu qù", "This book's content is interesting.", null],
  [982, "這部分我不太懂。", "zhè bù fèn wǒ bú tài dǒng", "I don't quite understand this part.", GE],
  [983, "這方面我沒有經驗。", "zhè fāng miàn wǒ méi yǒu jīng yàn", "I have no experience in this area.", GE],
  [984, "這家店的種類很多。", "zhè jiā diàn de zhǒng lèi hěn duō", "This shop has a wide variety.", ZHONG],
  [985, "每個人的方式不一樣。", "měi ge rén de fāng shì bù yí yàng", "Everyone's way of doing it is different.", ZHONG],
  [986, "這個工作的條件不錯。", "zhè ge gōng zuò de tiáo jiàn bú cuò", "The terms of this job are pretty good.", GE],
  [987, "請遵守遊戲規則。", "qǐng zūn shǒu yóu xì guī zé", "Please follow the rules of the game.", TIAO],
  [988, "我們要遵守法律。", "wǒ men yào zūn shǒu fǎ lǜ", "We must obey the law.", TIAO],
  [989, "台灣的文化很多元。", "tái wān de wén huà hěn duō yuán", "Taiwan's culture is very diverse.", ZHONG],
  [990, "我很滿意現在的生活。", "wǒ hěn mǎn yì xiàn zài de shēng huó", "I'm very satisfied with my life right now.", ZHONG],
  [991, "我對未來很有信心。", "wǒ duì wèi lái hěn yǒu xìn xīn", "I'm confident about the future.", null],
  [992, "過去的事就別想了。", "guò qù de shì jiù bié xiǎng le", "Don't dwell on things that are past.", null],
  [993, "謝謝你的建議。", "xiè xiè nǐ de jiàn yì", "Thank you for your suggestion.", GE],
  [994, "我想聽聽你的意見。", "wǒ xiǎng tīng tīng nǐ de yì jiàn", "I'd like to hear your opinion.", GE],
  [995, "我有一個想法。", "wǒ yǒu yí ge xiǎng fǎ", "I have an idea.", GE],
  [996, "這個改變很重要。", "zhè ge gǎi biàn hěn zhòng yào", "This change is important.", GE],
  [997, "天氣影響了我們的計畫。", "tiān qì yǐng xiǎng le wǒ men de jì huà", "The weather affected our plans.", GE],
  [998, "他終於成功了。", "tā zhōng yú chéng gōng le", "He finally succeeded.", null],
  [999, "失敗是成功之母。", "shī bài shì chéng gōng zhī mǔ", "Failure is the mother of success.", CI],
  [1000, "大家都知道健康的重要性。", "dà jiā dōu zhī dào jiàn kāng de zhòng yào xìng", "Everyone knows the importance of health.", null]
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
