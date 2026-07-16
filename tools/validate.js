const fs = require("fs");
const { convert } = require("./pinyin2zhuyin.js");
const RAW = JSON.parse(fs.readFileSync(__dirname + "/raw_rows.json", "utf8"));

let ok = 0, bad = 0;
const mismatches = [];
for (const w of RAW) {
  const got = convert(w.pinyin);
  // normalize spacing for comparison
  const exp = w.zhuyin.replace(/\s+/g, " ").trim();
  const g = got.replace(/\s+/g, " ").trim();
  if (g === exp) ok++;
  else { bad++; if (mismatches.length < 40) mismatches.push({ num: w.num, hanzi: w.hanzi, pinyin: w.pinyin, exp, got: g }); }
}
console.log("MATCH:", ok, "/", ok + bad, "(" + (100 * ok / (ok + bad)).toFixed(1) + "%)");
console.log("first mismatches:");
for (const m of mismatches) console.log(JSON.stringify(m));
