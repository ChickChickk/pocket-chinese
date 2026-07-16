// Deterministic pinyin(tone-marked) -> zhuyin converter (Taiwan convention: trailing tone marks).
const TONE = {
  "ā":["a",1],"á":["a",2],"ǎ":["a",3],"à":["a",4],
  "ē":["e",1],"é":["e",2],"ě":["e",3],"è":["e",4],
  "ī":["i",1],"í":["i",2],"ǐ":["i",3],"ì":["i",4],
  "ō":["o",1],"ó":["o",2],"ǒ":["o",3],"ò":["o",4],
  "ū":["u",1],"ú":["u",2],"ǔ":["u",3],"ù":["u",4],
  "ǖ":["ü",1],"ǘ":["ü",2],"ǚ":["ü",3],"ǜ":["ü",4],
  "ế":["ê",2],"ề":["ê",4]
};
const TONE_MARK = { 1: "", 2: "ˊ", 3: "ˇ", 4: "ˋ", 0: "˙" };

const INITIALS = { zh:"ㄓ",ch:"ㄔ",sh:"ㄕ",b:"ㄅ",p:"ㄆ",m:"ㄇ",f:"ㄈ",d:"ㄉ",t:"ㄊ",n:"ㄋ",l:"ㄌ",g:"ㄍ",k:"ㄎ",h:"ㄏ",j:"ㄐ",q:"ㄑ",x:"ㄒ",r:"ㄖ",z:"ㄗ",c:"ㄘ",s:"ㄙ" };
const FINALS = {
  a:"ㄚ",o:"ㄛ",e:"ㄜ","ê":"ㄝ",
  ai:"ㄞ",ei:"ㄟ",ao:"ㄠ",ou:"ㄡ",
  an:"ㄢ",en:"ㄣ",ang:"ㄤ",eng:"ㄥ",er:"ㄦ",
  i:"ㄧ",ia:"ㄧㄚ",ie:"ㄧㄝ",iao:"ㄧㄠ",iou:"ㄧㄡ",iu:"ㄧㄡ",ian:"ㄧㄢ","in":"ㄧㄣ",iang:"ㄧㄤ",ing:"ㄧㄥ",iong:"ㄩㄥ",
  u:"ㄨ",ua:"ㄨㄚ",uo:"ㄨㄛ",uai:"ㄨㄞ",uei:"ㄨㄟ",ui:"ㄨㄟ",uan:"ㄨㄢ",uen:"ㄨㄣ",un:"ㄨㄣ",uang:"ㄨㄤ",ueng:"ㄨㄥ",ong:"ㄨㄥ",
  "ü":"ㄩ","üe":"ㄩㄝ","üan":"ㄩㄢ","ün":"ㄩㄣ"
};
// zero-initial (y/w) whole syllables -> final key
const ZERO = {
  yi:"i",ya:"ia",ye:"ie",yao:"iao",you:"iou",yan:"ian",yin:"in",yang:"iang",ying:"ing",yong:"iong",
  yu:"ü",yue:"üe",yuan:"üan",yun:"ün",
  wu:"u",wa:"ua",wo:"uo",wai:"uai",wei:"uei",wan:"uan",wen:"uen",wang:"uang",weng:"ueng",
  w:"u",y:"i"
};

function stripTone(syl) {
  let base = "", tone = 0;
  for (const ch of syl) {
    if (TONE[ch]) { base += TONE[ch][0]; tone = TONE[ch][1]; }
    else base += ch;
  }
  return [base, tone];
}

function sylToZhuyin(pySyl) {
  let [base, tone] = stripTone(pySyl.trim().toLowerCase());
  base = base.replace(/v/g, "ü");
  const mark = TONE_MARK[tone];
  if (!base) return "";
  // zero-initial whole forms
  if (ZERO[base]) return FINALS[ZERO[base]] + mark;
  if (base === "er") return FINALS.er + mark;
  // detect initial
  let init = "", rest = base;
  const two = base.slice(0, 2);
  if (INITIALS[two]) { init = two; rest = base.slice(2); }
  else if (INITIALS[base[0]]) { init = base[0]; rest = base.slice(1); }
  // j/q/x + u.. => ü..
  if ((init === "j" || init === "q" || init === "x") && rest[0] === "u") rest = "ü" + rest.slice(1);
  // retroflex/sibilant + bare i => empty final
  if (["zh","ch","sh","r","z","c","s"].indexOf(init) >= 0 && rest === "i") rest = "";
  const iz = init ? INITIALS[init] : "";
  const fz = rest === "" ? "" : FINALS[rest];
  if (fz === undefined) return null; // unknown final -> signal
  return iz + fz + mark;
}

function convert(pinyin) {
  return pinyin.trim().split(/\s+/).map(sylToZhuyin).join(" ");
}

module.exports = { sylToZhuyin, convert };
