/* ============================================================
   Pocket Chinese — app logic (vanilla JS, no framework)
   ============================================================ */
(function () {
  "use strict";
  var D = window.DATA;
  var CATEGORIES = D.CATEGORIES,
    WORDS = D.WORDS,
    GRAMMAR = D.GRAMMAR;
  var TIME_WORDS = D.TIME_WORDS,
    MARKERS = D.MARKERS,
    TIME_COMPARE = D.TIME_COMPARE,
    ONE_VERB_TABLE = D.ONE_VERB_TABLE,
    TIME_QUICK_REF = D.TIME_QUICK_REF,
    TIME_MISTAKES = D.TIME_MISTAKES,
    SENTENCE_ORDER = D.SENTENCE_ORDER,
    NEGATION = D.NEGATION,
    QUESTIONS = D.QUESTIONS;
  var NUMBER_BASICS = D.NUMBER_BASICS,
    NUMBER_BASIC_EXAMPLES = D.NUMBER_BASIC_EXAMPLES,
    NUMBER_BUILDING = D.NUMBER_BUILDING,
    NUMBER_CLASSIFIERS = D.NUMBER_CLASSIFIERS,
    NUMBER_ASKING = D.NUMBER_ASKING,
    NUMBER_PRICES = D.NUMBER_PRICES,
    NUMBER_TIME = D.NUMBER_TIME,
    NUMBER_DATES = D.NUMBER_DATES,
    NUMBER_ORDINALS = D.NUMBER_ORDINALS,
    NUMBER_DURATION = D.NUMBER_DURATION,
    NUMBER_OTHER_FORMS = D.NUMBER_OTHER_FORMS,
    ONE_NUMBER_TABLE = D.ONE_NUMBER_TABLE,
    NUMBER_QUICK_REF = D.NUMBER_QUICK_REF,
    NUMBER_MISTAKES = D.NUMBER_MISTAKES;
  var REPETITION = D.REPETITION,
    REPETITION_GUIDE = D.REPETITION_GUIDE,
    REPETITION_COMPARE = D.REPETITION_COMPARE,
    REPETITION_INFORMAL = D.REPETITION_INFORMAL,
    REPETITION_QUICK_REF = D.REPETITION_QUICK_REF,
    REPETITION_MISTAKES = D.REPETITION_MISTAKES;
  var FACTS = D.FACTS;

  var THEMES = ["light", "sepia", "dark"];
  var INT = [0, 0, 1, 3, 7, 21]; // Leitner box → days until due
  var TOTAL = WORDS.length;

  var SPEAKER =
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"></path><path d="M16.5 8.5a5 5 0 0 1 0 7"></path></svg>';
  var CHEV =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>';
  // No "Browse": the chapter view is reached from Home's Contents list and the Continue button.
  var NAV = [
    ["home", "Home"],
    ["grammar", "Grammar"],
    ["flash", "Flashcards"],
    ["quiz", "Quiz"],
    ["practice", "Practice"],
    ["progress", "Progress"],
  ];

  // ---------- state ----------
  var state = loadState();

  function loadState() {
    var srs = null,
      fav = {},
      weak = {},
      activity = { streak: 0, todayCount: 0, lastDate: "", dailyGoal: 10 };
    var view = "home",
      chapter = 0,
      theme = "sepia",
      voice = "",
      visited = false;
    try {
      srs = JSON.parse(localStorage.getItem("hua_srs") || "null");
      fav = JSON.parse(localStorage.getItem("hua_fav") || "{}") || {};
      weak = JSON.parse(localStorage.getItem("hua_weak") || "{}") || {};
      var a = JSON.parse(localStorage.getItem("hua_activity") || "{}") || {};
      for (var k in a) activity[k] = a[k];
      var rawChapter = localStorage.getItem("hua_chapter");
      // null = never opened a chapter. Cannot use the value: chapter 1 is stored as 0, and a
      // first-time visitor defaults to 0 too — so only the key's presence distinguishes them.
      visited = rawChapter !== null;
      chapter = parseInt(rawChapter || "0", 10) || 0;
      voice = localStorage.getItem("hua_voice") || ""; // "" = auto-pick
    } catch (e) {}
    if (!srs) srs = {};
    return {
      view: view,
      chapter: chapter,
      theme: theme,
      search: "",
      srs: srs,
      fav: fav,
      weak: weak,
      activity: activity,
      flashScope: "all",
      flashOrder: [],
      flashIdx: 0,
      flashFlipped: false,
      quizScope: "all",
      quizMode: "mc",
      quiz: null,
      voice: voice,
      visited: visited,
      ui: { grammarTab: "zhuyin", gp: null },
    };
  }
  function save() {
    try {
      localStorage.setItem("hua_srs", JSON.stringify(state.srs));
      localStorage.setItem("hua_fav", JSON.stringify(state.fav));
      localStorage.setItem("hua_weak", JSON.stringify(state.weak));
      localStorage.setItem("hua_activity", JSON.stringify(state.activity));
      localStorage.setItem("hua_chapter", String(state.chapter));
      localStorage.setItem("hua_voice", state.voice || "");
    } catch (e) {}
  }

  // ---------- helpers ----------
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function attr(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;");
  }
  function norm(s) {
    return (s || "")
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/[^a-z\s-]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  // Pinyin normalizer for the type-it quiz: strip tone marks, spaces, and treat ü/v/u alike,
  // so a learner can type toneless pinyin the way a real IME accepts it (nihao, ni hao, nǐ hǎo).
  var TONE_MAP = {
    ā: "a",
    á: "a",
    ǎ: "a",
    à: "a",
    ē: "e",
    é: "e",
    ě: "e",
    è: "e",
    ī: "i",
    í: "i",
    ǐ: "i",
    ì: "i",
    ō: "o",
    ó: "o",
    ǒ: "o",
    ò: "o",
    ū: "u",
    ú: "u",
    ǔ: "u",
    ù: "u",
    ǖ: "u",
    ǘ: "u",
    ǚ: "u",
    ǜ: "u",
    ü: "u",
    ń: "n",
    ň: "n",
    ǹ: "n",
  };
  function normPinyin(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹ]/g, function (c) {
        return TONE_MAP[c] || c;
      })
      .replace(/v/g, "u")
      .replace(/[^a-z]/g, "");
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }
  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }
  function top() {
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
  }
  function isMastered(num) {
    var r = state.srs[num];
    return !!(r && r.box >= 4);
  }
  function isSeen(num) {
    var r = state.srs[num];
    return !!(r && r.seen);
  }
  function wordByNum(num) {
    for (var i = 0; i < WORDS.length; i++)
      if (WORDS[i].num === num) return WORDS[i];
    return null;
  }

  var VOICES = [],
    CHOSEN_VOICE = null;
  // Every zh voice on this device, Taiwan ones first — powers the voice picker.
  function zhVoices() {
    var zh = VOICES.filter(function (v) {
      return /zh|cmn|Chinese|Mandarin/i.test(v.lang + " " + v.name);
    });
    return zh.sort(function (a, b) {
      var rank = function (v) {
        return /zh[-_]TW/i.test(v.lang) ? 0 : /zh[-_]?(HK|Hant)/i.test(v.lang) ? 1 : 2;
      };
      return rank(a) - rank(b) || a.name.localeCompare(b.name);
    });
  }
  function pickVoice() {
    // An explicit choice always wins — TTS quality varies wildly per device, so the
    // user's ear beats our heuristics.
    if (state && state.voice) {
      var saved = VOICES.filter(function (v) {
        return v.name === state.voice;
      })[0];
      if (saved) return saved;
    }
    if (CHOSEN_VOICE) return CHOSEN_VOICE;
    var byName = function (re) {
      return VOICES.filter(function (v) {
        return re.test(v.name);
      })[0];
    };
    var byLang = function (re) {
      return VOICES.filter(function (v) {
        return re.test(v.lang);
      })[0];
    };
    var v =
      byName(/Mei-?Jia|美佳/i) || // macOS — Taiwanese Mandarin, female
      byName(/(國語|國语).*(臺灣|台灣|Taiwan)|Taiwan/i) || // Chrome — Google 國語（臺灣）
      byLang(/zh[-_]TW/i) || // any Taiwan voice
      byName(/Ya-?ting|Hsiao|Sinji/i) || // other female CJK fallbacks
      byLang(/zh[-_]?(HK|Hant)/i) ||
      byLang(/zh|cmn/i) ||
      null;
    if (v) CHOSEN_VOICE = v;
    return v;
  }
  // Sentences read slowly (0.72) so learners can follow. But a short, isolated utterance
  // smears at that speed — the vowel loses its shape, which is how ㄅ "bo" ends up sounding
  // like "be". Those read near-normal instead.
  //
  // Decided from the text rather than tagged at each call site: speakBtn alone is reused for
  // word cards, word-of-the-day, flashcard fronts, quiz reveals and the tones table, so
  // per-caller flags would inevitably be missed.
  // Words stay a little faster than sentences on purpose: taken too slow, an isolated syllable
  // smears and ㄅ "bo" starts to sound like "be". 0.8 is the floor that still held its shape.
  var RATE_SENTENCE = 0.6,
    RATE_SYLLABLE = 0.8;
  function autoRate(text) {
    var t = String(text || "");
    // Punctuation is the real signal — every example sentence carries 。？！ — so the length
    // check is only a safety net for unpunctuated text. It sits above the longest headword
    // (5 chars, e.g. 筆記型電腦) so genuine words are never dragged to sentence speed.
    if (/[。！？，、；：]/.test(t)) return RATE_SENTENCE;
    var hanzi = (t.match(/[\u3400-\u9fff]/g) || []).length;
    return hanzi > 5 ? RATE_SENTENCE : RATE_SYLLABLE;
  }
  function speak(text) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-TW";
      u.rate = autoRate(text);
      u.pitch = 1.05;
      var v = pickVoice();
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  // ---------- SRS / study ----------
  function poolFor(scope) {
    if (scope === "all") return WORDS.slice();
    if (scope === "due")
      return WORDS.filter(function (x) {
        var r = state.srs[x.num];
        return r && r.seen && r.due <= Date.now();
      });
    if (scope === "weak")
      return WORDS.filter(function (x) {
        return state.weak[x.num];
      });
    if (scope === "star")
      return WORDS.filter(function (x) {
        return state.fav[x.num];
      });
    return WORDS.filter(function (x) {
      return x.cat === Number(scope);
    });
  }
  function dueCount() {
    return WORDS.filter(function (x) {
      var r = state.srs[x.num];
      return r && r.seen && r.due <= Date.now();
    }).length;
  }
  function weakCount() {
    return WORDS.filter(function (x) {
      return state.weak[x.num];
    }).length;
  }
  function favCount() {
    var n = 0;
    for (var k in state.fav) if (state.fav[k]) n++;
    return n;
  }

  function gradeWord(num, correct) {
    var rec = state.srs[num] || { box: 0, due: 0, seen: false };
    var box = correct ? Math.min(5, (rec.box || 0) + 1) : 1;
    state.srs[num] = {
      box: box,
      due: Date.now() + (INT[box] || 0) * 86400000,
      seen: true,
    };
    if (correct) {
      if (box >= 3) delete state.weak[num];
    } else {
      state.weak[num] = true;
    }
  }
  function study() {
    var today = todayStr(),
      a = state.activity;
    if (a.lastDate !== today) {
      var y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      a.streak = a.lastDate === y ? (a.streak || 0) + 1 : 1;
      a.todayCount = 0;
      a.lastDate = today;
    }
    a.todayCount = (a.todayCount || 0) + 1;
  }
  function displayActivity() {
    var today = todayStr(),
      y = new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      a = state.activity;
    return {
      streak: a.lastDate === today || a.lastDate === y ? a.streak || 0 : 0,
      todayCount: a.lastDate === today ? a.todayCount || 0 : 0,
      dailyGoal: a.dailyGoal || 10,
    };
  }

  // ---------- navigation actions ----------
  function setView(v) {
    state.view = v;
    state.search = "";
    var s = document.getElementById("search");
    if (s) s.value = "";
    save();
    render();
    top();
  }
  function openChapter(i) {
    state.view = "browse";
    state.chapter = i;
    state.search = "";
    var s = document.getElementById("search");
    if (s) s.value = "";
    save();
    render();
    top();
  }
  function cycleTheme() {
    var i = (THEMES.indexOf(state.theme) + 1) % THEMES.length;
    state.theme = THEMES[i];
    document.documentElement.setAttribute("data-theme", state.theme);
    save();
    var btn = document.getElementById("theme-btn");
    if (btn) btn.title = "Theme: " + state.theme + " (click to change)";
  }
  function toggleFav(num) {
    if (state.fav[num]) delete state.fav[num];
    else state.fav[num] = true;
    save();
    render();
  }
  function toggleMastered(num) {
    if (isMastered(num)) delete state.srs[num];
    else
      state.srs[num] = { box: 5, due: Date.now() + 21 * 86400000, seen: true };
    save();
    render();
  }
  function setGoal(n) {
    state.activity.dailyGoal = n;
    save();
    render();
  }

  // ---------- flashcards ----------
  function startFlash(scope) {
    state.view = "flash";
    state.flashScope = scope;
    state.flashOrder = shuffle(
      poolFor(scope).map(function (x) {
        return x.num;
      }),
    );
    state.flashIdx = 0;
    state.flashFlipped = false;
    state.search = "";
    var s = document.getElementById("search");
    if (s) s.value = "";
    save();
    render();
    top();
  }
  function enterFlash() {
    state.view = "flash";
    state.search = "";
    if (state.flashOrder.length === 0) {
      startFlash(state.flashScope || "all");
      return;
    }
    save();
    render();
    top();
  }
  function flip() {
    state.flashFlipped = !state.flashFlipped;
    var f = document.querySelector(".flip");
    if (f) f.classList.toggle("flipped", state.flashFlipped);
    var c = document.getElementById("deck-controls");
    if (c) c.innerHTML = deckControlsInner();
  }
  function rate(good) {
    var num = state.flashOrder[state.flashIdx];
    if (num == null) return;
    gradeWord(num, good);
    if (!good) state.flashOrder.push(num);
    state.flashIdx++;
    state.flashFlipped = false;
    save();
    study();
    render();
  }
  function skipCard() {
    state.flashIdx++;
    state.flashFlipped = false;
    render();
  }

  // ---------- quiz ----------
  // Type-it wants the characters, typed the way Chinese is actually typed: pinyin into an
  // IME, which commits 漢字. So the answer is compared as 漢字, not pinyin.
  function normHanzi(s) {
    // Keep only CJK characters, dropping spaces, latin, and any punctuation the IME might
    // commit (。，！？ and halfwidth forms) so a stray keystroke can't fail a right answer.
    return String(s || "").replace(/[^\u3400-\u9fff]/g, "");
  }
  function acceptable(w) {
    return [normHanzi(w.hanzi)].filter(Boolean);
  }
  function buildQuiz(scope, mode) {
    var pool = shuffle(poolFor(scope));
    pool = pool.slice(0, Math.min(10, pool.length));
    return pool.map(function (w) {
      var q = {
        num: w.num,
        hanzi: w.hanzi,
        zhuyin: w.zhuyin,
        pinyin: w.pinyin,
        meaning: w.meaning,
      };
      if (mode === "mc") {
        var d = shuffle(
          WORDS.filter(function (x) {
            return x.meaning !== w.meaning;
          }),
        )
          .slice(0, 3)
          .map(function (x) {
            return x.meaning;
          });
        var opts = shuffle([w.meaning].concat(d));
        q.options = opts;
        q.correctIndex = opts.indexOf(w.meaning);
      } else if (mode === "reverse") {
        var d2 = shuffle(
          WORDS.filter(function (x) {
            return x.hanzi !== w.hanzi;
          }),
        )
          .slice(0, 3)
          .map(function (x) {
            return x.hanzi;
          });
        var opts2 = shuffle([w.hanzi].concat(d2));
        q.options = opts2;
        q.correctIndex = opts2.indexOf(w.hanzi);
      } else {
        q.accept = acceptable(w);
      }
      return q;
    });
  }
  function startQuiz(scope, mode) {
    mode = mode || state.quizMode || "mc";
    state.view = "quiz";
    state.quizScope = scope;
    state.quizMode = mode;
    state.quiz = {
      questions: buildQuiz(scope, mode),
      idx: 0,
      score: 0,
      answered: false,
      selected: null,
      typedCorrect: false,
    };
    state.search = "";
    var s = document.getElementById("search");
    if (s) s.value = "";
    save();
    render();
    top();
  }
  function enterQuiz() {
    state.view = "quiz";
    state.search = "";
    if (!state.quiz) {
      startQuiz(state.quizScope || "all", state.quizMode);
      return;
    }
    save();
    render();
    top();
  }
  function answerQuiz(i) {
    var q = state.quiz;
    if (!q || q.answered) return;
    var cur = q.questions[q.idx],
      correct = i === cur.correctIndex;
    gradeWord(cur.num, correct);
    q.answered = true;
    q.selected = i;
    q.typedCorrect = correct;
    q.score += correct ? 1 : 0;
    save();
    study();
    render();
  }
  function submitType() {
    var q = state.quiz;
    if (!q || q.answered) return;
    var cur = q.questions[q.idx];
    var inp = normHanzi(
      (document.getElementById("type-input") || {}).value || "",
    );
    var correct = inp.length > 0 && cur.accept.indexOf(inp) >= 0;
    gradeWord(cur.num, correct);
    q.answered = true;
    q.typedCorrect = correct;
    q.score += correct ? 1 : 0;
    save();
    study();
    render();
  }
  function nextQuiz() {
    var q = state.quiz;
    q.idx++;
    q.answered = false;
    q.selected = null;
    q.typedCorrect = false;
    render();
  }

  function resetProgress() {
    if (
      typeof confirm === "function" &&
      !confirm(
        "Reset all progress (learned words, favorites, streak)? This cannot be undone.",
      )
    )
      return;
    state.srs = {};
    state.weak = {};
    state.fav = {};
    state.activity = {
      streak: 0,
      todayCount: 0,
      lastDate: "",
      dailyGoal: state.activity.dailyGoal || 10,
    };
    save();
    render();
  }

  function encouragement(pct) {
    if (pct >= 100)
      return (
        "太厲害了! (Amazing!) You have mastered all " +
        TOTAL +
        ". 加油 paid off!"
      );
    if (pct >= 75)
      return "So close! The finish line is right there — keep going!";
    if (pct >= 50)
      return "More than halfway. 很棒! (Great!) You are doing brilliantly.";
    if (pct >= 25) return "Great momentum — a quarter of the way and climbing!";
    if (pct > 0)
      return "A wonderful start. Every word counts. 加油! (You've got this!)";
    return "Every journey begins with one word. 開始學習吧! (Let's start learning!)";
  }

  // ---------- view builders ----------
  function chapterStats() {
    return CATEGORIES.map(function (c, i) {
      var inCat = WORDS.filter(function (w) {
        return w.cat === i;
      });
      var lc = inCat.filter(function (w) {
        return isMastered(w.num);
      }).length;
      var pct = Math.round((lc / inCat.length) * 100);
      return {
        i: i,
        num: i + 1,
        title: c.title,
        range: c.start + "–" + c.end,
        count: inCat.length,
        learned: lc,
        pct: pct,
        note: c.note,
      };
    });
  }
  function speakBtn(text, size) {
    return (
      '<button class="mini-btn" data-act="speak" data-say="' +
      attr(text) +
      '" title="Listen" style="width:' +
      (size || 32) +
      "px;height:" +
      (size || 32) +
      'px">' +
      SPEAKER +
      "</button>"
    );
  }
  function favBtn(num, size) {
    var on = !!state.fav[num];
    return (
      '<button class="mini-btn fav-btn' +
      (on ? " on" : "") +
      '" data-act="fav" data-arg="' +
      num +
      '" title="Favorite" style="width:' +
      (size || 32) +
      "px;height:" +
      (size || 32) +
      'px">' +
      (on ? "★" : "☆") +
      "</button>"
    );
  }
  function measureLine(w) {
    if (!w.measure) return "";
    return (
      '<div class="casual">measure word: <b>' +
      esc(w.measure.hanzi) +
      "</b> " +
      '<span class="pron" style="margin-left:4px">' +
      esc(w.measure.zhuyin) +
      " · " +
      esc(w.measure.pinyin) +
      "</span></div>"
    );
  }
  function wordCard(w, showCat) {
    var mastered = isMastered(w.num);
    return (
      '<div class="word-card' +
      (mastered ? " mastered" : "") +
      '">' +
      '<div class="word-head"><div class="info">' +
      '<div class="word-title"><span class="num">#' +
      w.num +
      '</span><span class="std">' +
      esc(w.hanzi) +
      "</span></div>" +
      '<span class="pron">' +
      esc(w.zhuyin) +
      " · " +
      esc(w.pinyin) +
      "</span>" +
      '</div><div class="word-actions">' +
      speakBtn(w.hanzi) +
      favBtn(w.num) +
      "</div></div>" +
      '<div class="meaning">' +
      esc(w.meaning) +
      "</div>" +
      measureLine(w) +
      (showCat
        ? '<span class="cat-tag">' + esc(CATEGORIES[w.cat].title) + "</span>"
        : "") +
      (w.example
        ? '<div class="example"><span class="id">“' +
          esc(w.example.hanzi) +
          "”</span>" +
          '<span class="pron" style="display:block;margin:2px 0 4px">' +
          esc(w.example.pinyin) +
          "</span>" +
          '<span class="en">' +
          esc(w.example.en) +
          "</span></div>"
        : "") +
      '<button class="learn-badge' +
      (mastered ? " on" : "") +
      '" data-act="mastered" data-arg="' +
      w.num +
      '">' +
      (mastered ? "✓ Mastered" : "+ Mark mastered") +
      "</button>" +
      "</div>"
    );
  }

  function homeView() {
    var chs = chapterStats();
    var act = displayActivity();
    var goalPct = Math.min(
      100,
      Math.round((act.todayCount / act.dailyGoal) * 100),
    );
    var due = dueCount();
    // word of the day
    var t = todayStr(),
      h = 0;
    for (var k = 0; k < t.length; k++) h = (h * 31 + t.charCodeAt(k)) >>> 0;
    var w = WORDS[h % WORDS.length];
    var tf = t + "|fact",
      hf = 0;
    for (var kf = 0; kf < tf.length; kf++)
      hf = (hf * 31 + tf.charCodeAt(kf)) >>> 0;
    var fact = FACTS[hf % FACTS.length];
    var goalBtns = [5, 10, 20]
      .map(function (n) {
        return (
          '<button class="' +
          (act.dailyGoal === n ? "active" : "") +
          '" data-act="goal" data-arg="' +
          n +
          '">' +
          n +
          "</button>"
        );
      })
      .join("");

    return (
      "<section>" +
      '<div class="hero"><div class="kicker">歡迎 · Welcome</div>' +
      "<h1>" +
      TOTAL +
      " Traditional Chinese<br>Words &amp; Phrases</h1>" +
      "<p>A friendly pocket guide for beginners learning Taiwanese Mandarin — with tap-to-hear pronunciation, zhuyin &amp; pinyin, smart flashcards, and real example sentences.</p></div>" +
      '<div class="row center" style="margin:28px 0 8px">' +
      (state.visited
        ? '<button class="btn btn-primary" data-act="continueCh">Continue Chapter ' +
          (state.chapter + 1) +
          "</button>"
        : '<button class="btn btn-primary" data-act="startCh1">Start with Chapter 1</button>') +
      '<button class="btn btn-ghost" data-act="startFlashAll">Shuffle flashcards</button>' +
      '<button class="btn btn-link" data-act="print">Print / Save PDF</button>' +
      "</div>" +
      '<div class="didyouknow"><span class="tag">Fun fact</span><p>' +
      esc(fact) +
      "</p></div>" +
      '<div class="today">' +
      // WOTD
      '<div class="panel"><div class="kicker"><span>Word of the day</span><div class="panel-actions">' +
      speakBtn(w.hanzi, 30) +
      favBtn(w.num, 30) +
      "</div></div>" +
      '<div class="big" style="font-size:44px">' +
      esc(w.hanzi) +
      "</div>" +
      '<div class="pron">' +
      esc(w.zhuyin) +
      " · " +
      esc(w.pinyin) +
      "</div>" +
      '<div class="meaning">' +
      esc(w.meaning) +
      "</div>" +
      (w.example
        ? '<div class="example" style="border:none;padding:0"><span class="id">“' +
          esc(w.example.hanzi) +
          '”</span><span class="en">' +
          esc(w.example.en) +
          "</span></div>"
        : "") +
      "</div>" +
      // streak & goal
      '<div class="panel"><span class="kicker">Daily practice</span>' +
      '<div style="display:flex;align-items:baseline;gap:10px"><span class="big" style="font-size:46px">' +
      act.streak +
      '</span><span style="font-size:14px;color:var(--muted)">day streak</span></div>' +
      '<div><div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--muted);margin-bottom:5px"><span>Today\'s goal</span><span>' +
      act.todayCount +
      " / " +
      act.dailyGoal +
      '</span></div><div class="meter"><span style="width:' +
      goalPct +
      '%"></span></div></div>' +
      '<div class="goal-btns"><span style="font-size:12px;color:var(--muted)">Goal:</span>' +
      goalBtns +
      "</div></div>" +
      // review due
      '<div class="panel" style="justify-content:space-between"><div><span class="kicker">Spaced review</span>' +
      '<div class="big" style="font-size:46px;margin-top:8px">' +
      due +
      "</div>" +
      '<div style="font-size:14px;color:var(--muted)">' +
      (due === 1 ? "word ready to review" : "words ready to review") +
      "</div></div>" +
      '<button class="btn ' +
      (due > 0 ? "btn-primary" : "btn-ghost") +
      '" style="padding:11px 16px;font-size:14px" data-act="startReview">' +
      (due > 0 ? "Start review" : "Learn new words") +
      "</button></div>" +
      "</div>" +
      '<div class="rule"><h2>Contents</h2><div class="line"></div><span class="count">' +
      CATEGORIES.length +
      " chapters · " +
      TOTAL +
      " words</span></div>" +
      '<div class="grid-ch">' +
      chs
        .map(function (c) {
          return (
            '<button class="ch-card" data-act="chapter" data-arg="' +
            c.i +
            '">' +
            '<div class="top"><span class="num mono">CH ' +
            c.num +
            '</span><span class="mono" style="font-size:11px;color:var(--muted2)">' +
            c.range +
            "</span></div>" +
            '<div class="title">' +
            esc(c.title) +
            "</div>" +
            '<div class="prog"><span class="meter"><span style="width:' +
            c.pct +
            '%"></span></span><span style="font-size:12px;color:var(--muted)">' +
            c.learned +
            "/" +
            c.count +
            "</span></div></button>"
          );
        })
        .join("") +
      "</div></section>"
    );
  }

  function chapterOptions(sel) {
    return CATEGORIES.map(function (c, i) {
      return (
        '<option value="' +
        i +
        '"' +
        (sel === i ? " selected" : "") +
        ">" +
        (i + 1) +
        ". " +
        esc(c.title) +
        "</option>"
      );
    }).join("");
  }

  function scopeOptions(sel) {
    var opts = [
      { v: "all", l: "All " + TOTAL + " words" },
      { v: "due", l: "Due for review (" + dueCount() + ")" },
      { v: "weak", l: "Weak words (" + weakCount() + ")" },
      { v: "star", l: "Starred (" + favCount() + ")" },
    ].concat(
      CATEGORIES.map(function (c, i) {
        return { v: String(i), l: i + 1 + ". " + c.title };
      }),
    );
    return opts
      .map(function (o) {
        return (
          '<option value="' +
          o.v +
          '"' +
          (String(sel) === o.v ? " selected" : "") +
          ">" +
          esc(o.l) +
          "</option>"
        );
      })
      .join("");
  }

  function browseView() {
    var c = CATEGORIES[state.chapter] || CATEGORIES[0];
    var words = WORDS.filter(function (w) {
      return w.cat === state.chapter;
    });
    var hasPrev = state.chapter > 0,
      hasNext = state.chapter < CATEGORIES.length - 1;
    return (
      '<section><div class="page-head"><div>' +
      '<div class="sub">Chapter ' +
      (state.chapter + 1) +
      " of " +
      CATEGORIES.length +
      " · words " +
      c.start +
      "–" +
      c.end +
      "</div>" +
      "<h1>" +
      esc(c.title) +
      "</h1></div>" +
      '<div class="row"><select class="select" id="chapter-select">' +
      chapterOptions(state.chapter) +
      "</select>" +
      '<button class="btn btn-ghost btn-sm" data-act="flashChapter">Flashcards</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="quizChapter">Quiz this chapter</button></div></div>' +
      '<div class="didyouknow"><span class="tag">Did you know</span><p>' +
      esc(c.note) +
      "</p></div>" +
      '<div class="grid-words">' +
      words
        .map(function (w) {
          return wordCard(w, false);
        })
        .join("") +
      "</div>" +
      '<div class="pager">' +
      (hasPrev
        ? '<button class="btn btn-ghost btn-sm" data-act="prev">← Previous</button>'
        : "") +
      '<span class="spacer"></span>' +
      (hasNext
        ? '<button class="btn btn-primary btn-sm" data-act="next">Next chapter →</button>'
        : "") +
      "</div></section>"
    );
  }

  function deckControlsInner() {
    if (state.flashFlipped) {
      return '<button class="no" data-act="again">Again</button><button class="yes" data-act="gotit">Got it ✓</button>';
    }
    return '<button class="skip" data-act="skip">Skip</button><button class="flip-btn" data-act="flip">Reveal meaning</button>';
  }
  function flashView() {
    var len = state.flashOrder.length;
    var head =
      '<div class="deck-head"><div><h1>Flashcards</h1><p>Rate each card — hard ones come back sooner (spaced repetition).</p></div>' +
      '<select class="select" id="flash-scope">' +
      scopeOptions(state.flashScope) +
      "</select></div>";
    if (len === 0) {
      var et = "Nothing here yet",
        em = "Pick another deck to get started.";
      if (state.flashScope === "due") {
        et = "All caught up!";
        em =
          "No words are due for review right now. Learn some new ones or come back later.";
      } else if (state.flashScope === "weak") {
        et = "No weak words";
        em =
          "You have no tricky words flagged. Take a quiz and any you miss will land here.";
      } else if (state.flashScope === "star") {
        et = "No favorites yet";
        em = "Tap the star on any word to save it here for focused practice.";
      }
      return (
        "<section>" +
        head +
        '<div class="state-box"><div class="h">' +
        esc(et) +
        "</div><p>" +
        esc(em) +
        '</p><button class="btn btn-primary" data-act="startFlashAll">Shuffle all ' +
        TOTAL +
        "</button></div></section>"
      );
    }
    if (state.flashIdx >= len) {
      return (
        "<section>" +
        head +
        '<div class="state-box"><div class="h">Deck complete!</div><p>做得好! (Well done!) Come back later and spaced repetition will resurface the tricky ones.</p>' +
        '<div class="row center"><button class="btn btn-primary" data-act="flashRestart">Go again</button><button class="btn btn-ghost" data-act="progress">See progress</button></div></div></section>'
      );
    }
    var w = wordByNum(state.flashOrder[state.flashIdx]);
    var pos = Math.min(state.flashIdx + 1, len);
    return (
      "<section>" +
      head +
      '<div class="deck-meta"><span class="mono">' +
      pos +
      " / " +
      len +
      '</span><button class="btn-link" data-act="flashRestart">Shuffle again</button></div>' +
      '<div class="flip-scene"><div class="flip' +
      (state.flashFlipped ? " flipped" : "") +
      '" data-act="flip">' +
      '<div class="face face-front"><div class="corner">' +
      speakBtn(w.hanzi, 34) +
      favBtn(w.num, 34) +
      "</div>" +
      '<span class="lbl">Character</span><span class="word" style="font-size:64px">' +
      esc(w.hanzi) +
      "</span>" +
      '<span class="hint">tap to reveal reading &amp; meaning</span></div>' +
      '<div class="face face-back"><span class="lbl">Reading &amp; meaning</span>' +
      '<span class="pron" style="font-size:18px">' +
      esc(w.zhuyin) +
      " · " +
      esc(w.pinyin) +
      "</span>" +
      '<span class="mean">' +
      esc(w.meaning) +
      "</span>" +
      (w.example
        ? '<div class="div"></div>' +
          '<span class="ex">“' +
          esc(w.example.hanzi) +
          "”</span>" +
          '<span class="pron">' +
          esc(w.example.pinyin) +
          "</span>" +
          '<span class="en">' +
          esc(w.example.en) +
          "</span>" +
          '<button class="pill-btn" data-act="speak" data-say="' +
          attr(w.example.hanzi) +
          '">' +
          SPEAKER +
          "<span>Hear sentence</span></button>"
        : "") +
      "</div>" +
      "</div></div>" +
      '<div class="deck-controls" id="deck-controls">' +
      deckControlsInner() +
      "</div></section>"
    );
  }

  function quizView() {
    var q = state.quiz;
    var head =
      '<div class="deck-head"><div><h1>Quiz yourself</h1><p>Right answers strengthen a word; wrong ones go to your weak list.</p></div>' +
      '<select class="select" id="quiz-scope">' +
      scopeOptions(state.quizScope) +
      "</select></div>";
    var modes = [
      ["mc", "Multiple choice"],
      ["reverse", "Pick the word"],
      ["type", "Type it"],
    ];
    var seg =
      '<div class="seg">' +
      modes
        .map(function (m) {
          return (
            '<button class="' +
            (state.quizMode === m[0] ? "active" : "") +
            '" data-act="quizMode" data-arg="' +
            m[0] +
            '">' +
            m[1] +
            "</button>"
          );
        })
        .join("") +
      "</div>";

    if (!q || q.questions.length === 0) {
      var em = "This deck has no words yet.";
      if (state.quizScope === "weak") em = "No weak words to review — nice!";
      else if (state.quizScope === "star")
        em = "Star some words first, then quiz them here.";
      else if (state.quizScope === "due")
        em = "Nothing is due for review right now.";
      return (
        "<section>" +
        head +
        seg +
        '<div class="state-box"><div class="h">Nothing to quiz here yet</div><p>' +
        esc(em) +
        '</p><button class="btn btn-primary" data-act="startQuizAll">Quiz all ' +
        TOTAL +
        "</button></div></section>"
      );
    }
    if (q.idx >= q.questions.length) {
      var t = q.questions.length,
        pct = t ? Math.round((q.score / t) * 100) : 0;
      var msg =
        pct >= 90
          ? "Outstanding! You really know these words."
          : pct >= 70
            ? "Great work — solid progress!"
            : pct >= 40
              ? "Nice effort — review and try again!"
              : "Good start — practice makes perfect. 加油!";
      return (
        "<section>" +
        head +
        seg +
        '<div class="state-box"><div class="kicker" style="justify-content:center;display:flex">Round complete</div>' +
        '<div class="big-score">' +
        q.score +
        "<small>/" +
        t +
        '</small></div><p style="max-width:380px;margin:16px auto 26px;color:var(--ink2);font-size:16px;line-height:1.5">' +
        esc(msg) +
        "</p>" +
        '<div class="row center"><button class="btn btn-primary" data-act="restartQuiz">Play again</button><button class="btn btn-ghost" data-act="browse">Back to browsing</button></div></div></section>'
      );
    }

    var cur = q.questions[q.idx],
      mode = state.quizMode;
    var body =
      '<div class="deck-meta"><span class="mono">Question ' +
      (q.idx + 1) +
      " of " +
      q.questions.length +
      '</span><span class="mono" style="color:var(--olive)">Score ' +
      q.score +
      "/" +
      q.questions.length +
      "</span></div>";

    // prompt
    var promptMain,
      qlabel,
      psub = "",
      audio = false;
    if (mode === "mc") {
      qlabel = "What does this word mean?";
      promptMain = cur.hanzi;
      psub = cur.zhuyin + " · " + cur.pinyin;
      audio = true;
    } else if (mode === "reverse") {
      qlabel = "Which character(s) mean this?";
      promptMain = cur.meaning;
    } else {
      qlabel = "Type the characters for:";
      promptMain = cur.meaning;
    }
    body +=
      '<div class="quiz-prompt"><div class="q">' +
      esc(qlabel) +
      '</div><div class="main">' +
      esc(promptMain) +
      "</div>" +
      (psub ? '<div class="psub">' + esc(psub) + "</div>" : "") +
      (audio
        ? '<button class="pill-btn" style="margin-top:14px" data-act="speak" data-say="' +
          attr(cur.hanzi) +
          '">' +
          SPEAKER +
          "<span>Listen</span></button>"
        : "") +
      "</div>";

    // answer area
    if (mode === "mc" || mode === "reverse") {
      body +=
        '<div class="opts">' +
        cur.options
          .map(function (opt, i) {
            var cls = "opt",
              mark = "";
            if (q.answered) {
              if (i === cur.correctIndex) {
                cls += " correct";
                mark = "✓";
              } else if (i === q.selected) {
                cls += " wrong";
                mark = "✗";
              } else cls += " dim";
            }
            return (
              '<button class="' +
              cls +
              '" data-act="answer" data-arg="' +
              i +
              '"><span>' +
              esc(opt) +
              '</span><span class="mono">' +
              mark +
              "</span></button>"
            );
          })
          .join("") +
        "</div>";
    } else {
      var icls =
        "type-input" + (q.answered ? (q.typedCorrect ? " ok" : " bad") : "");
      body +=
        '<input class="' +
        icls +
        '" id="type-input" type="text" lang="zh-TW" placeholder="用中文輸入法打出漢字…" autocomplete="off" autocapitalize="off" spellcheck="false"' +
        (q.answered ? " disabled" : "") +
        ">" +
        '<div class="type-hint">Type it in Chinese — pinyin into your IME, same as you would normally. Needs a Chinese keyboard/輸入法.</div>';
      if (!q.answered)
        body +=
          '<button class="btn btn-primary" style="width:100%;margin-top:12px;border-radius:13px" data-act="submitType">Check answer</button>';
      else
        body +=
          '<div class="answer-reveal"><div><div class="lbl">Answer</div><div class="w">' +
          esc(cur.hanzi) +
          ' <span class="pron">' +
          esc(cur.zhuyin) +
          " · " +
          esc(cur.pinyin) +
          "</span></div></div>" +
          speakBtn(cur.hanzi, 38) +
          "</div>";
    }

    if (q.answered) {
      var correct =
        mode === "type" ? q.typedCorrect : q.selected === cur.correctIndex;
      body +=
        '<div class="feedback-row"><span class="feedback ' +
        (correct ? "good" : "bad") +
        '">' +
        (correct
          ? "對! (Correct!) Nicely done."
          : "Not quite — keep at it, that is how we learn!") +
        "</span>" +
        '<button class="btn btn-primary btn-sm" data-act="nextQuiz">Next →</button></div>';
    }
    return "<section>" + head + seg + body + "</section>";
  }

  function progressView() {
    var mastered = WORDS.filter(function (w) {
      return isMastered(w.num);
    }).length;
    var seen = WORDS.filter(function (w) {
      return isSeen(w.num);
    }).length;
    var learning = seen - mastered;
    var pct = Math.round((mastered / TOTAL) * 100);
    var act = displayActivity();
    var chs = chapterStats();
    return (
      '<section><h1 class="serif" style="font-weight:500;font-size:42px;margin:0 0 24px;color:var(--ink)">Your progress</h1>' +
      '<div class="stats">' +
      '<div class="stat"><div class="n" style="color:var(--olive)">' +
      mastered +
      '</div><div class="k">mastered</div></div>' +
      '<div class="stat"><div class="n" style="color:var(--accent)">' +
      learning +
      '</div><div class="k">still learning</div></div>' +
      '<div class="stat"><div class="n" style="color:var(--ink)">' +
      act.streak +
      '</div><div class="k">day streak</div></div>' +
      '<div class="stat"><div class="n" style="color:var(--ink)">' +
      favCount() +
      '</div><div class="k">favorites</div></div>' +
      "</div>" +
      '<div class="encourage"><div class="meter"><span style="width:' +
      pct +
      '%"></span></div><p>' +
      esc(encouragement(pct)) +
      "</p></div>" +
      '<div class="rule" style="margin-top:0"><h2 style="font-size:24px">By chapter</h2><div class="line"></div></div>' +
      '<div class="ch-rows">' +
      chs
        .map(function (c) {
          return (
            '<button class="ch-row" data-act="chapter" data-arg="' +
            c.i +
            '"><span class="num">CH ' +
            c.num +
            '</span><span class="title">' +
            esc(c.title) +
            "</span>" +
            '<span class="meter"><span style="width:' +
            c.pct +
            '%"></span></span><span class="frac">' +
            c.learned +
            "/" +
            c.count +
            "</span></button>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="row" style="margin-top:30px"><button class="btn btn-ghost btn-sm" data-act="print">Print / Save the book as PDF</button>' +
      '<button class="btn-link" style="color:var(--nobd)" data-act="reset">Reset progress</button></div></section>'
    );
  }

  function searchView() {
    var qq = state.search.trim().toLowerCase();
    var qp = normPinyin(qq);
    var res = WORDS.filter(function (w) {
      return (
        w.hanzi.indexOf(qq) >= 0 ||
        w.zhuyin.indexOf(qq) >= 0 ||
        w.meaning.toLowerCase().indexOf(qq) >= 0 ||
        w.pinyin.toLowerCase().indexOf(qq) >= 0 ||
        (qp.length > 0 && normPinyin(w.pinyin).indexOf(qp) >= 0) ||
        (w.example && w.example.hanzi.indexOf(qq) >= 0) ||
        (w.example && w.example.en.toLowerCase().indexOf(qq) >= 0)
      );
    });
    var head =
      '<div class="search-head"><h1>Search</h1><span class="n">' +
      res.length +
      " results for “" +
      esc(state.search) +
      '”</span><button class="btn-link" data-act="clearSearch">clear</button></div>';
    if (res.length === 0) {
      return (
        "<section>" +
        head +
        '<div class="no-results"><div class="h">No matches</div><p>Try another word, meaning, or part of a pronunciation.</p></div></section>'
      );
    }
    return (
      "<section>" +
      head +
      '<div class="grid-words">' +
      res
        .map(function (w) {
          return wordCard(w, true);
        })
        .join("") +
      "</div></section>"
    );
  }

  // ---------- grammar ----------
  function affixCard(a) {
    var open = !!state.ui.openAffix[a.id];
    var uses = a.uses
      .map(function (u) {
        return (
          '<div class="use">' +
          (u.name ? '<div class="use-name">' + esc(u.name) + "</div>" : "") +
          '<div class="deriv">' +
          u.derivations
            .map(function (d) {
              return (
                '<span class="d"><span class="from">' +
                esc(d.from) +
                '</span><span class="arrow">→</span><span class="to">' +
                esc(d.to) +
                '</span> <span class="gloss">' +
                esc(d.gloss) +
                "</span></span>"
              );
            })
            .join("") +
          "</div>" +
          u.sentences
            .map(function (s) {
              return (
                '<div class="ex-line">' +
                speakBtn(s.id, 30) +
                '<span class="id">“' +
                esc(s.id) +
                '”</span><span class="en">' +
                esc(s.en) +
                "</span></div>"
              );
            })
            .join("") +
          "</div>"
        );
      })
      .join("");
    return (
      '<div class="affix' +
      (open ? " open" : "") +
      '" id="affix-' +
      a.id +
      '">' +
      '<button class="affix-head" data-act="affix" data-arg="' +
      a.id +
      '"><span class="affix-mark">' +
      esc(a.label) +
      "</span>" +
      '<span><span class="tag">Makes ' +
      esc(a.tag) +
      '</span><div class="rem">' +
      esc(a.remember) +
      "</div></span>" +
      '<span class="chev">' +
      CHEV +
      "</span></button>" +
      '<div class="affix-body"><div class="formula">' +
      esc(a.formula) +
      "</div>" +
      uses +
      (a.note ? '<div class="affix-note">' + esc(a.note) + "</div>" : "") +
      "</div></div>"
    );
  }
  function familyTool() {
    var fam =
      FAMILIES.filter(function (f) {
        return f.root === state.ui.family;
      })[0] || FAMILIES[0];
    return (
      '<div class="family-tool"><div class="family-tabs">' +
      FAMILIES.map(function (f) {
        return (
          '<button class="' +
          (f.root === fam.root ? "active" : "") +
          '" data-act="family" data-arg="' +
          attr(f.root) +
          '">' +
          esc(f.root) +
          "</button>"
        );
      }).join("") +
      "</div>" +
      '<div class="family-root"><span class="r">' +
      esc(fam.root) +
      '</span><span class="g">— ' +
      esc(fam.gloss) +
      "</span></div>" +
      '<div class="family-grid">' +
      fam.members
        .map(function (m) {
          return (
            '<div class="member"><div class="top"><span class="w">' +
            esc(m.word) +
            "</span>" +
            speakBtn(m.word, 30) +
            "</div>" +
            '<div class="build">' +
            esc(m.build) +
            '</div><div class="g">' +
            esc(m.gloss) +
            "</div></div>"
          );
        })
        .join("") +
      "</div></div>"
    );
  }
  function soundTable(title, rows) {
    return (
      '<div class="table-scroll"><table class="ref"><caption>' +
      esc(title) +
      "</caption><thead><tr><th>Root begins with</th><th>Becomes</th><th>Example</th></tr></thead><tbody>" +
      rows
        .map(function (r) {
          return (
            "<tr><td>" +
            esc(r.begins) +
            '</td><td class="form">' +
            esc(r.form) +
            '</td><td class="ex">' +
            esc(r.ex) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div>"
    );
  }
  var BASIC_AFFIX_IDS = ["me", "ber", "pe", "an"];
  var GRAMMAR_TABS = [
    ["alphabet", "Alphabet"],
    ["order", "Sentence Order"],
    ["numbers", "Numbers"],
    ["time", "Time & Aspect"],
    ["neg", "Negation & Questions"],
    ["repeat", "Repetition"],
    ["affixes", "Affixes"],
  ];

  function exLine(s) {
    return (
      '<div class="ex-line">' +
      speakBtn(s.id, 30) +
      '<span class="id">“' +
      esc(s.id) +
      '”</span><span class="en">' +
      esc(s.en) +
      "</span></div>"
    );
  }

  function alphabetTab() {
    return (
      '<p class="grammar-intro">Indonesian uses the same Latin alphabet as English, so the letter shapes are already familiar. What is different is how each letter is <em>named</em> when spoken aloud, and how consistently it is pronounced inside a word — Indonesian spelling has very few exceptions.</p>' +
      '<div class="rule"><h2>The alphabet</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">' +
      esc(ALPHABET.spelling) +
      "</p>" +
      refRows(
        "A–Z",
        ["Letter", "Name", "Sound in words"],
        ALPHABET.letters.map(function (l) {
          return [l.letter, l.name + " (" + l.pron + ")", l.sound];
        }),
      ) +
      '<div class="rule"><h2>Hear each letter in a word</h2><div class="line"></div></div>' +
      '<div class="use" style="border-top:none;padding-top:0">' +
      ALPHABET.letters
        .map(function (l) {
          return exLine({ id: l.example, en: l.meaning });
        })
        .join("") +
      "</div>" +
      '<div class="rule"><h2>Letter combinations</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">A few letter pairs make a single, distinct sound of their own.</p>' +
      refRows(
        "Digraphs & diphthongs",
        ["Combo", "Sound"],
        ALPHABET.digraphs.map(function (d) {
          return [d.combo, d.sound];
        }),
      ) +
      '<div class="use" style="border-top:none;padding-top:0">' +
      ALPHABET.digraphs
        .map(function (d) {
          return exLine({ id: d.example, en: d.meaning });
        })
        .join("") +
      "</div>" +
      '<div class="rule"><h2>Good to know</h2><div class="line"></div></div>' +
      '<p class="grammar-intro">' +
      esc(ALPHABET.note) +
      "</p>"
    );
  }

  function affixesTab() {
    var basic = AFFIXES.filter(function (a) {
      return BASIC_AFFIX_IDS.indexOf(a.id) !== -1;
    });
    var advanced = AFFIXES.filter(function (a) {
      return BASIC_AFFIX_IDS.indexOf(a.id) === -1;
    });
    return (
      '<p class="grammar-intro">Indonesian builds a huge vocabulary from small root words plus a handful of prefixes and suffixes. Learn these eight patterns and you can often guess a word you have never seen before. Tap a card to open it, and tap ▶ to hear the examples.</p>' +
      '<div class="rule"><h2>Cheat sheet</h2><div class="line"></div></div>' +
      '<div class="table-scroll"><table class="ref cheat"><thead><tr><th>Affix</th><th>Pattern</th><th>Meaning</th></tr></thead><tbody>' +
      SUMMARY.map(function (s) {
        return (
          '<tr><td class="affix">' +
          esc(s.affix) +
          '</td><td class="formula">' +
          esc(s.formula) +
          "</td><td>" +
          esc(s.fn) +
          "</td></tr>"
        );
      }).join("") +
      "</tbody></table></div>" +
      '<div class="rule"><h2>Basic affixes</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">Start here — these four cover most everyday sentences.</p>' +
      '<div class="affix-list">' +
      basic.map(affixCard).join("") +
      "</div>" +
      '<div class="rule"><h2>More advanced affixes</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">Trickier patterns for once the basics feel comfortable.</p>' +
      '<div class="affix-list">' +
      advanced.map(affixCard).join("") +
      "</div>" +
      '<div class="rule"><h2>Word-family explorer</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">Pick a root word and watch a whole family of words grow out of it.</p>' +
      familyTool() +
      '<div class="rule"><h2>Why me- and pe- change spelling</h2><div class="line"></div></div>' +
      '<p class="grammar-intro">These two prefixes shift their spelling to match the first sound of the root — it simply makes them easier to say.</p>' +
      '<div class="table-wrap">' +
      soundTable("The me- prefix", SOUND.me) +
      soundTable("The pe- prefix", SOUND.pe) +
      "</div>"
    );
  }

  function wordTable(title, rows) {
    return (
      '<div class="table-scroll"><table class="ref"><caption>' +
      esc(title) +
      "</caption><thead><tr><th>Indonesian</th><th>Meaning</th></tr></thead><tbody>" +
      rows
        .map(function (r) {
          return (
            '<tr><td class="form">' +
            esc(r.id) +
            "</td><td>" +
            esc(r.en) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div>"
    );
  }
  function refRows(title, headers, rows, cheat) {
    return (
      '<div class="table-scroll"><table class="ref' +
      (cheat ? " cheat" : "") +
      '"><caption>' +
      esc(title) +
      "</caption><thead><tr>" +
      headers
        .map(function (h) {
          return "<th>" + esc(h) + "</th>";
        })
        .join("") +
      "</tr></thead><tbody>" +
      rows
        .map(function (r) {
          return (
            "<tr>" +
            r
              .map(function (c, i) {
                return (
                  '<td class="' +
                  (i === 0 ? "form" : "") +
                  '">' +
                  esc(c) +
                  "</td>"
                );
              })
              .join("") +
            "</tr>"
          );
        })
        .join("") +
      "</tbody></table></div>"
    );
  }

  function markerCard(m) {
    var key = "time_" + m.id;
    var open = !!state.ui.openAffix[key];
    var informal = m.informal
      ? '<div class="use" style="border-top:none;padding-top:0"><div class="use-name">Informal: ' +
        esc(m.informal.label) +
        "</div>" +
        (m.informal.note
          ? '<p style="margin:0 0 10px;color:var(--muted);font-size:13.5px">' +
            esc(m.informal.note) +
            "</p>"
          : "") +
        m.informal.examples.map(exLine).join("") +
        "</div>"
      : "";
    return (
      '<div class="affix' +
      (open ? " open" : "") +
      '" id="marker-' +
      m.id +
      '">' +
      '<button class="affix-head" data-act="marker" data-arg="' +
      m.id +
      '"><span class="affix-mark">' +
      esc(m.label) +
      "</span>" +
      '<span><span class="tag">' +
      esc(m.tag) +
      '</span><div class="rem">' +
      esc(m.remember) +
      "</div></span>" +
      '<span class="chev">' +
      CHEV +
      "</span></button>" +
      '<div class="affix-body"><div class="formula">' +
      esc(m.formula) +
      '</div><div class="use" style="border-top:none;padding-top:0">' +
      m.examples.map(exLine).join("") +
      "</div>" +
      informal +
      (m.note ? '<div class="affix-note">' + esc(m.note) + "</div>" : "") +
      "</div></div>"
    );
  }

  function compareList(items) {
    return (
      '<div class="compare-list">' +
      items
        .map(function (c) {
          return (
            '<div class="compare-pair"><span class="ca">' +
            esc(c.a) +
            '</span><span class="vs">vs</span><span class="cb">' +
            esc(c.b) +
            "</span><p>" +
            esc(c.note) +
            "</p></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function timeTab() {
    return (
      '<p class="grammar-intro">Indonesian verbs usually do not change for tense — the verb <em>makan</em> (eat) stays <em>makan</em> whether you ate yesterday, are eating now, or will eat tomorrow. Instead, time words say <em>when</em>, and action markers say <em>what stage</em> the action is in.</p>' +
      '<div class="rule"><h2>Quick reference</h2><div class="line"></div></div>' +
      '<div class="table-scroll"><table class="ref cheat"><thead><tr><th>Meaning</th><th>Formula</th><th>Example</th></tr></thead><tbody>' +
      TIME_QUICK_REF.map(function (r) {
        return (
          "<tr><td>" +
          esc(r.meaning) +
          '</td><td class="formula">' +
          esc(r.formula) +
          '</td><td class="ex">' +
          esc(r.example) +
          "</td></tr>"
        );
      }).join("") +
      "</tbody></table></div>" +
      '<div class="rule"><h2>Time words</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">These say when something happens — past, present, or future.</p>' +
      '<div class="table-wrap">' +
      wordTable("Past", TIME_WORDS.past) +
      wordTable("Present", TIME_WORDS.present) +
      wordTable("Future", TIME_WORDS.future) +
      "</div>" +
      '<div class="rule"><h2>Action markers</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">These small words show the stage of an action — in progress, completed, not yet, recent, continuing, experienced before, or planned. Tap a card to open it.</p>' +
      '<div class="affix-list">' +
      MARKERS.map(markerCard).join("") +
      "</div>" +
      '<div class="rule"><h2>Easy to confuse</h2><div class="line"></div></div>' +
      compareList(TIME_COMPARE) +
      '<div class="rule"><h2>One verb, many situations</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">The verb <em>makan</em> never changes — only the words around it do.</p>' +
      '<div class="table-scroll"><table class="ref cheat"><thead><tr><th>Indonesian</th><th>Meaning</th><th>Shows</th></tr></thead><tbody>' +
      ONE_VERB_TABLE.map(function (r) {
        return (
          '<tr><td class="ex">' +
          esc(r.id) +
          "</td><td>" +
          esc(r.en) +
          "</td><td>" +
          esc(r.note) +
          "</td></tr>"
        );
      }).join("") +
      "</tbody></table></div>" +
      '<div class="rule"><h2>Common beginner mistakes</h2><div class="line"></div></div>' +
      '<div class="mistakes">' +
      TIME_MISTAKES.map(function (m) {
        return (
          '<div class="mistake"><div class="mistake-title">' +
          esc(m.title) +
          "</div>" +
          (m.wrong ? '<div class="wrong">✗ ' + esc(m.wrong) + "</div>" : "") +
          '<div class="right">✓ ' +
          esc(m.right) +
          "</div>" +
          "<p>" +
          esc(m.note) +
          "</p></div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function orderRuleBlock(r) {
    return (
      '<div class="order-rule"><div class="order-title">' +
      esc(r.title) +
      '</div><div class="formula">' +
      esc(r.formula) +
      "</div>" +
      r.examples.map(exLine).join("") +
      "</div>"
    );
  }

  function orderTab() {
    return (
      '<div class="rule"><h2>Basic sentence order</h2><div class="line"></div></div>' +
      '<p class="grammar-intro">' +
      esc(SENTENCE_ORDER.intro) +
      "</p>" +
      '<div class="formula" style="margin-bottom:18px">' +
      esc(SENTENCE_ORDER.formula) +
      "</div>" +
      '<div class="use" style="border-top:none;padding-top:0">' +
      SENTENCE_ORDER.examples
        .map(function (s) {
          return (
            '<div class="ex-line">' +
            speakBtn(s.id, 30) +
            '<span class="id">“' +
            esc(s.id) +
            '”</span><span class="en">' +
            esc(s.en) +
            '</span><span class="ex-note">' +
            esc(s.breakdown) +
            "</span></div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="rule"><h2>Word order rules</h2><div class="line"></div></div>' +
      '<div class="affix-list">' +
      SENTENCE_ORDER.rules.map(orderRuleBlock).join("") +
      "</div>" +
      '<p class="grammar-intro" style="margin-top:20px">' +
      esc(SENTENCE_ORDER.note) +
      "</p>"
    );
  }

  function negCard(n) {
    return (
      '<div class="order-rule"><div class="order-title">' +
      esc(n.label) +
      ' <span class="order-tag">— ' +
      esc(n.tag) +
      "</span></div>" +
      '<div class="formula">' +
      esc(n.formula) +
      "</div>" +
      n.examples.map(exLine).join("") +
      (n.note ? '<p class="order-note">' + esc(n.note) + "</p>" : "") +
      "</div>"
    );
  }

  function negTab() {
    return (
      '<div class="rule"><h2>Negation</h2><div class="line"></div></div>' +
      '<p class="grammar-intro">Indonesian uses three main negative words, depending on what is being negated.</p>' +
      '<div class="affix-list">' +
      NEGATION.map(negCard).join("") +
      "</div>" +
      '<div class="rule"><h2>Questions</h2><div class="line"></div></div>' +
      '<p class="grammar-intro">' +
      esc(QUESTIONS.intro) +
      "</p>" +
      '<div class="use" style="border-top:none;padding-top:0">' +
      QUESTIONS.examples.map(exLine).join("") +
      "</div>" +
      '<div class="use-name" style="margin-top:18px">Informal</div>' +
      '<div class="use" style="border-top:none;padding-top:0">' +
      QUESTIONS.informal.map(exLine).join("") +
      "</div>" +
      '<p class="grammar-intro" style="margin-top:16px">' +
      esc(QUESTIONS.note) +
      "</p>"
    );
  }

  function repetitionTab() {
    return (
      '<p class="grammar-intro">Indonesian often repeats a word to add a new meaning — the repeated form does not always mean “more than one.” It can show a plural, a casual activity, a repeated action, the way an action is done, distribution, frequency, or a fixed expression. The rule to remember: repeat a word only when the repetition adds one of these specific meanings.</p>' +
      '<div class="rule"><h2>Quick reference</h2><div class="line"></div></div>' +
      refRows(
        "Formula summary",
        ["Meaning", "Formula", "Example"],
        REPETITION_QUICK_REF.map(function (r) {
          return [r.meaning, r.formula, r.example];
        }),
        true,
      ) +
      '<div class="rule"><h2>Which pattern do you need?</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">Ask yourself what meaning you want, then repeat that word.</p>' +
      '<div class="mistakes">' +
      REPETITION_GUIDE.map(function (g) {
        return (
          '<div class="mistake"><div class="mistake-title">' +
          esc(g.q) +
          "</div>" +
          '<div class="right">→ ' +
          esc(g.a) +
          "</div>" +
          "<p>" +
          esc(g.example) +
          "</p></div>"
        );
      }).join("") +
      "</div>" +
      '<div class="rule"><h2>Six patterns</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">Tap a card to open it, and tap ▶ to hear the examples.</p>' +
      '<div class="affix-list">' +
      REPETITION.map(affixCard).join("") +
      "</div>" +
      '<div class="rule"><h2>Quick comparison</h2><div class="line"></div></div>' +
      refRows(
        "Normal word vs. repeated form",
        ["Normal word", "Repeated form", "New meaning"],
        REPETITION_COMPARE.map(function (r) {
          return [r.word, r.repeated, r.meaning];
        }),
      ) +
      '<div class="rule"><h2>Informal writing</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">In casual text messages, Indonesians often write the number 2 instead of repeating the word. This is common in chats, but should not be used in formal writing.</p>' +
      refRows(
        "Shorthand",
        ["Full form", "Informal shorthand"],
        REPETITION_INFORMAL.map(function (r) {
          return [r.full, r.short];
        }),
      ) +
      '<div class="rule"><h2>Common beginner mistakes</h2><div class="line"></div></div>' +
      '<div class="mistakes">' +
      REPETITION_MISTAKES.map(function (m) {
        return (
          '<div class="mistake"><div class="mistake-title">' +
          esc(m.title) +
          "</div>" +
          (m.wrong ? '<div class="wrong">✗ ' + esc(m.wrong) + "</div>" : "") +
          '<div class="right">✓ ' +
          esc(m.right) +
          "</div>" +
          "<p>" +
          esc(m.note) +
          "</p></div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function numbersTab() {
    return (
      '<p class="grammar-intro">Indonesian numbers are refreshingly logical. Once you know 0 to 10, you build almost any number by stacking a few simple blocks — belas, puluh, ratus, ribu, juta. The same numbers also handle prices, ages, dates, and clock time, so a little practice here goes a long way.</p>' +
      '<div class="rule"><h2>Quick reference</h2><div class="line"></div></div>' +
      refRows(
        "Formula summary",
        ["Meaning", "Formula", "Example"],
        NUMBER_QUICK_REF.map(function (r) {
          return [r.meaning, r.formula, r.example];
        }),
        true,
      ) +
      '<div class="rule"><h2>Basic numbers: 0–10</h2><div class="line"></div></div>' +
      refRows(
        "0–10",
        ["Number", "Indonesian", "Pronunciation"],
        NUMBER_BASICS.map(function (b) {
          return [b.n, b.id, b.pron];
        }),
      ) +
      '<div class="use" style="border-top:none;padding-top:14px">' +
      NUMBER_BASIC_EXAMPLES.map(exLine).join("") +
      "</div>" +
      '<div class="rule"><h2>Building bigger numbers</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">Each block below adds one layer. Tap a card to see how it works.</p>' +
      '<div class="affix-list">' +
      NUMBER_BUILDING.map(affixCard).join("") +
      "</div>" +
      '<div class="rule"><h2>Numbers with nouns</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">A number usually comes right before the noun, and the noun itself never changes for plural — the number already says there is more than one. Some nouns also use a small counting word (a classifier) in between.</p>' +
      refRows(
        "Common classifiers",
        ["Classifier", "Used for", "Example"],
        NUMBER_CLASSIFIERS.map(function (c) {
          return [c.classifier, c.use, c.example];
        }),
      ) +
      '<p class="grammar-intro" style="margin-top:14px">In casual speech the classifier is often dropped once the meaning is clear — “Saya beli dua apel” (I bought two apples) is perfectly natural.</p>' +
      '<div class="rule"><h2>Asking “how many” and “how much”</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">berapa asks for a number — a quantity, a price, a time, an age.</p>' +
      '<div class="use" style="border-top:none;padding-top:0">' +
      NUMBER_ASKING.map(exLine).join("") +
      "</div>" +
      '<div class="rule"><h2>Prices</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">Because the rupiah has large denominations, everyday prices usually land in the thousands (ribu).</p>' +
      refRows(
        "Price examples",
        ["Price", "Indonesian"],
        NUMBER_PRICES.table.map(function (p) {
          return [p.price, p.id];
        }),
      ) +
      '<div class="use" style="border-top:none;padding-top:14px">' +
      NUMBER_PRICES.dialogue
        .map(function (d) {
          return exLine({ id: d.spk + ": " + d.id, en: d.en });
        })
        .join("") +
      "</div>" +
      '<div class="rule"><h2>Telling time</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">Clock time is just numbers plus a few small connector words. Tap a card to open it.</p>' +
      '<div class="affix-list">' +
      NUMBER_TIME.map(markerCard).join("") +
      "</div>" +
      '<div class="rule"><h2>Dates, months, and years</h2><div class="line"></div></div>' +
      wordTable("Months", NUMBER_DATES.months) +
      '<div class="formula" style="margin:14px 0">' +
      esc(NUMBER_DATES.formula) +
      "</div>" +
      '<div class="use" style="border-top:none;padding-top:0">' +
      NUMBER_DATES.examples.map(exLine).join("") +
      NUMBER_DATES.yearExamples.map(exLine).join("") +
      "</div>" +
      '<p class="grammar-intro" style="margin-top:14px">' +
      esc(NUMBER_DATES.note) +
      "</p>" +
      '<div class="rule"><h2>Ordinal numbers</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">Ordinals (first, second, third…) usually add ke- to the front of the number.</p>' +
      refRows(
        "Ordinals",
        ["English", "Indonesian"],
        NUMBER_ORDINALS.table.map(function (o) {
          return [o.en, o.id];
        }),
      ) +
      '<div class="use" style="border-top:none;padding-top:14px">' +
      NUMBER_ORDINALS.examples.map(exLine).join("") +
      "</div>" +
      '<p class="grammar-intro" style="margin-top:14px">' +
      esc(NUMBER_ORDINALS.note) +
      "</p>" +
      '<div class="rule"><h2>Duration, ago, and from now</h2><div class="line"></div></div>' +
      '<div class="formula" style="margin-bottom:14px">' +
      esc(NUMBER_DURATION.formula) +
      "</div>" +
      '<div class="use" style="border-top:none;padding-top:0">' +
      NUMBER_DURATION.examples.map(exLine).join("") +
      "</div>" +
      compareList(NUMBER_DURATION.agoLagi) +
      '<div class="rule"><h2>Other number forms</h2><div class="line"></div></div>' +
      refRows(
        "Halves, quarters, decimals, percent",
        ["Form", "Example", "Meaning"],
        NUMBER_OTHER_FORMS.map(function (f) {
          return [f.form, f.id, f.en];
        }),
      ) +
      '<div class="rule"><h2>One number, many situations</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:14px">Watch how dua puluh lima (25) stays exactly the same — only the noun around it changes what is being counted.</p>' +
      refRows(
        "dua puluh lima in context",
        ["Indonesian", "Meaning", "Context"],
        ONE_NUMBER_TABLE.map(function (r) {
          return [r.id, r.en, r.note];
        }),
        true,
      ) +
      '<div class="rule"><h2>Common beginner mistakes</h2><div class="line"></div></div>' +
      '<div class="mistakes">' +
      NUMBER_MISTAKES.map(function (m) {
        return (
          '<div class="mistake"><div class="mistake-title">' +
          esc(m.title) +
          "</div>" +
          '<div class="wrong">✗ ' +
          esc(m.wrong) +
          "</div>" +
          '<div class="right">✓ ' +
          esc(m.right) +
          "</div>" +
          "<p>" +
          esc(m.note) +
          "</p></div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function grammarPatternCard(p) {
    var ex =
      '<div class="ex-line">' +
      speakBtn(p.example.hanzi, 30) +
      '<span class="id">“' +
      esc(p.example.hanzi) +
      "”</span>" +
      (p.example.pinyin
        ? '<span class="gpron">' + esc(p.example.pinyin) + "</span>"
        : "") +
      '<span class="en">' +
      esc(p.example.en) +
      "</span></div>";
    return (
      '<div class="order-rule"><div class="order-title">' +
      esc(p.pattern) +
      ' <span class="order-tag">— ' +
      esc(p.func.replace(/\.$/, "")) +
      "</span></div>" +
      '<div class="formula">' +
      esc(p.structure) +
      "</div>" +
      ex +
      (p.warning ? '<p class="order-note">⚠ ' + esc(p.warning) + "</p>" : "") +
      "</div>"
    );
  }
  function grammarGroup(g) {
    return (
      '<div class="affix-list">' +
      g.patterns.map(grammarPatternCard).join("") +
      "</div>"
    );
  }
  function grammarContrasts() {
    return (
      '<p class="grammar-intro">Patterns that are easy to mix up, side by side.</p>' +
      '<div class="table-scroll"><table class="ref cheat"><thead><tr><th>Pair</th><th>Main difference</th></tr></thead><tbody>' +
      GRAMMAR.comparisons
        .map(function (c) {
          return (
            '<tr><td class="formula">' +
            esc(c.pair) +
            "</td><td>" +
            esc(c.diff) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div>"
    );
  }
  function grammarPractice() {
    var gp = state.ui.gp,
      checked = !!(gp && gp.checked),
      ans = (gp && gp.answers) || {};
    var rows = GRAMMAR.practice
      .map(function (it, i) {
        var parts = it.sentence.split("___"),
          html = '<span class="gp-n">' + (i + 1) + ".</span> ";
        for (var k = 0; k < parts.length; k++) {
          html += '<span class="gp-text">' + esc(parts[k]) + "</span>";
          if (k < parts.length - 1) {
            var id = "gp-" + i + "-" + k,
              val = ans[id] != null ? ans[id] : "";
            if (checked) {
              var correct = it.answer[k] || "",
                ok = val.trim() === correct;
              html +=
                '<span class="gp-ans ' +
                (ok ? "ok" : "bad") +
                '">' +
                esc(val || "—") +
                (ok ? "" : " → " + esc(correct)) +
                "</span>";
            } else {
              html +=
                '<input class="gp-input" data-gp="' +
                id +
                '" value="' +
                attr(val) +
                '" autocomplete="off" autocapitalize="off" spellcheck="false">';
            }
          }
        }
        return '<div class="gp-row">' + html + "</div>";
      })
      .join("");
    var controls = checked
      ? '<button class="btn btn-ghost btn-sm" data-act="gReset">Try again</button>'
      : '<button class="btn btn-primary btn-sm" data-act="gCheck">Check answers</button>';
    return (
      '<p class="grammar-intro">Fill in the missing word in each sentence, then check. Everything you need is in the Chinese — read the time words and particles.</p>' +
      '<div class="gp-list">' +
      rows +
      '</div><div class="row" style="margin-top:18px">' +
      controls +
      "</div>"
    );
  }
  function practiceView() {
    return (
      '<section><div class="page-head"><div>' +
      '<div class="sub">Grammar · Put it to use</div>' +
      "<h1>Practice</h1></div></div>" +
      grammarPractice() +
      "</section>"
    );
  }
  function zyGrid(rows, showAsp) {
    return (
      '<div class="zy-grid">' +
      rows
        .map(function (r) {
          var asp = showAsp && r[2].indexOf("ʰ") >= 0;
          return (
            '<button class="zy-cell' +
            (asp ? " asp" : "") +
            '" data-act="speak" data-say="' +
            attr(r[3]) +
            '" title="Tap to hear (' +
            attr(r[3]) +
            ')">' +
            '<span class="zy-play">' +
            SPEAKER +
            "</span>" +
            '<div class="zy-sym">' +
            esc(r[0]) +
            '</div><div class="zy-py">' +
            esc(r[1]) +
            '</div><div class="zy-ipa">[' +
            esc(r[2]) +
            "]</div>" +
            (asp ? '<div class="zy-asp">送氣 · puff</div>' : "") +
            "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  }
  // Speech quality varies hugely between devices and voices, so let the learner audition
  // the zh voices their own device has and keep the one that sounds right to them.
  function voicePicker() {
    var list = zhVoices();
    if (!list.length)
      return (
        '<div class="didyouknow"><span class="tag">Audio</span><p>Your device has no Chinese voice installed, so tap-to-hear will not work. On macOS add one in <b>System Settings → Accessibility → Spoken Content → System Voice → Manage Voices</b> (Chinese, Taiwan).</p></div>'
      );
    var cur = pickVoice();
    var opts = ['<option value="">Auto (' + esc(cur ? cur.name : "none") + ")</option>"]
      .concat(
        list.map(function (v) {
          var tw = /zh[-_]TW/i.test(v.lang);
          return (
            '<option value="' +
            attr(v.name) +
            '"' +
            (state.voice === v.name ? " selected" : "") +
            ">" +
            esc(v.name) +
            " — " +
            esc(v.lang) +
            (tw ? " ✓ Taiwan" : "") +
            "</option>"
          );
        })
      )
      .join("");
    return (
      '<div class="voice-pick">' +
      '<span class="kicker" style="margin:0">Voice</span>' +
      '<select class="select" id="voice-select">' +
      opts +
      "</select>" +
      '<button class="btn btn-ghost btn-sm" data-act="speak" data-say="ㄅㄆㄇㄈ的發音" title="Test">▶ Test</button>' +
      '<span class="voice-hint">Voices differ a lot by device — if the sound is off, try another (✓ Taiwan ones are best).</span>' +
      "</div>"
    );
  }
  function grammarZhuyin() {
    var z = GRAMMAR.zhuyin;
    return (
      '<p class="grammar-intro">注音符號 (zhùyīn fúhào) is the phonetic system used in Taiwan. Each symbol is one sound — its pinyin and [IPA] pronunciation are shown so you know how to read it.</p>' +
      voicePicker() +
      '<div class="rule"><h2>Initials 聲母</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:12px">The pairs <b>ㄅ b / ㄆ p</b>, <b>ㄉ d / ㄊ t</b>, <b>ㄍ g / ㄎ k</b>, <b>ㄐ j / ㄑ q</b>, <b>ㄓ zh / ㄔ ch</b>, <b>ㄗ z / ㄘ c</b> differ by a <b>puff of air (送氣)</b>. The second of each pair — marked <b>送氣 · puff</b> below — is aspirated: hold your hand to your mouth and you should feel the puff. The first has no puff. That puff is the main thing that tells them apart.</p>' +
      zyGrid(z.initials, true) +
      '<div class="rule"><h2>Finals 韻母</h2><div class="line"></div></div>' +
      zyGrid(z.finals) +
      '<div class="rule"><h2>Tones 聲調</h2><div class="line"></div></div>' +
      '<p class="grammar-intro" style="margin-bottom:12px">Every syllable carries a tone — the same sound in a different tone is a different word.</p>' +
      '<div class="table-scroll"><table class="ref cheat"><thead><tr><th>Mark</th><th>Tone</th><th>Example</th><th>How it sounds</th></tr></thead><tbody>' +
      z.tones
        .map(function (t) {
          return (
            '<tr><td class="zy-tone">' +
            esc(t[0]) +
            "</td><td>" +
            esc(t[1]) +
            '</td><td class="formula">' +
            speakBtn(t[4], 26) +
            " " +
            esc(t[2]) +
            "</td><td>" +
            esc(t[3]) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div>"
    );
  }
  function grammarView() {
    var tab = state.ui.grammarTab || "zhuyin";
    var tabsArr = [["zhuyin", "注音 Zhuyin"]]
      .concat(
        GRAMMAR.groups.map(function (g, i) {
          return ["g" + i, i + 1 + ". " + g.title];
        }),
      )
      .concat([["contrasts", "Contrasts"]]);
    var tabsHtml =
      '<div class="family-tabs grammar-tabs">' +
      tabsArr
        .map(function (t) {
          return (
            '<button class="' +
            (tab === t[0] ? "active" : "") +
            '" data-act="gtab" data-arg="' +
            t[0] +
            '">' +
            esc(t[1]) +
            "</button>"
          );
        })
        .join("") +
      "</div>";
    var body;
    if (tab === "zhuyin") body = grammarZhuyin();
    else if (tab === "contrasts") body = grammarContrasts();
    else {
      var gi = parseInt(tab.slice(1), 10) || 0;
      body = grammarGroup(GRAMMAR.groups[gi] || GRAMMAR.groups[0]);
    }
    var intro =
      '<p class="grammar-intro" style="margin-top:2px">125 essential patterns in 7 groups. Tap ▶ to hear an example. Suggested order — ' +
      esc(
        GRAMMAR.stages
          .map(function (s) {
            return s.replace(/^Stage \d+: /, "");
          })
          .join(" → "),
      ) +
      "</p>";
    return (
      '<section><div class="page-head"><div><div class="sub">Appendix · How Chinese works</div>' +
      "<h1>Grammar</h1></div></div>" +
      intro +
      tabsHtml +
      body +
      "</section>"
    );
  }

  // ---------- render ----------
  function effectiveView() {
    return state.search.trim().length > 0 ? "search" : state.view;
  }
  function render() {
    var v = effectiveView();
    // nav active
    var navEl = document.getElementById("nav");
    if (navEl) {
      navEl.innerHTML = NAV.map(function (n) {
        return (
          '<button class="' +
          (v === n[0] ? "active" : "") +
          '" data-act="' +
          n[0] +
          '">' +
          n[1] +
          "</button>"
        );
      }).join("");
    }
    // chip
    var mastered = WORDS.filter(function (w) {
      return isMastered(w.num);
    }).length;
    var pct = Math.round((mastered / TOTAL) * 100);
    var chip = document.getElementById("progress-chip");
    if (chip)
      chip.innerHTML =
        '<span class="mono">' +
        mastered +
        "/" +
        TOTAL +
        '</span><span class="bar-track"><span style="width:' +
        pct +
        '%"></span></span>';

    var app = document.getElementById("app");
    app.className = "app" + (v === "flash" || v === "quiz" ? " narrow" : "");
    var html;
    if (v === "home") html = homeView();
    else if (v === "browse") html = browseView();
    else if (v === "flash") html = flashView();
    else if (v === "quiz") html = quizView();
    else if (v === "progress") html = progressView();
    else if (v === "grammar") html = grammarView();
    else if (v === "practice") html = practiceView();
    else html = searchView();
    app.innerHTML = html;
  }

  function buildPrintBook() {
    var el = document.getElementById("print-book");
    var html =
      '<div class="pcover"><div class="kicker">A friendly pocket guide</div>' +
      '<h1>Pocket Chinese</h1><p style="font-size:15px;color:#6B6153">' +
      TOTAL +
      " Traditional Chinese words &amp; phrases for beginners · zhuyin, pinyin, meanings &amp; examples</p></div>";
    CATEGORIES.forEach(function (c, i) {
      html +=
        '<div class="pchap"><div class="kicker">Chapter ' +
        (i + 1) +
        " · words " +
        c.start +
        "–" +
        c.end +
        "</div>" +
        "<h2>" +
        esc(c.title) +
        '</h2><p class="pnote">' +
        esc(c.note) +
        "</p>";
      WORDS.filter(function (w) {
        return w.cat === i;
      }).forEach(function (w) {
        html +=
          '<div class="prow"><span class="num">#' +
          w.num +
          '</span><div><span class="std">' +
          esc(w.hanzi) +
          "</span>" +
          '<span class="pron">' +
          esc(w.zhuyin) +
          " · " +
          esc(w.pinyin) +
          '</span> <span style="font-size:14px;color:#4A4136;margin-left:8px">— ' +
          esc(w.meaning) +
          (w.measure ? " (measure: " + esc(w.measure.hanzi) + ")" : "") +
          "</span>" +
          (w.example
            ? '<div style="font-size:13px;color:#8A7E6E;margin-top:2px"><span style="font-style:italic;color:#5C5348">' +
              esc(w.example.hanzi) +
              "</span> " +
              esc(w.example.en) +
              "</div>"
            : "") +
          "</div></div>";
      });
      html += "</div>";
    });
    el.innerHTML = html;
  }

  // ---------- events ----------
  var ACTIONS = {
    home: function () {
      setView("home");
    },
    browse: function () {
      setView("browse");
    },
    flash: function () {
      enterFlash();
    },
    quiz: function () {
      enterQuiz();
    },
    grammar: function () {
      setView("grammar");
    },
    practice: function () {
      setView("practice");
    },
    progress: function () {
      setView("progress");
    },
    theme: function () {
      cycleTheme();
    },
    startCh1: function () {
      openChapter(0);
    },
    continueCh: function () {
      openChapter(state.chapter);
    },
    chapter: function (arg) {
      openChapter(Number(arg));
    },
    prev: function () {
      if (state.chapter > 0) openChapter(state.chapter - 1);
    },
    next: function () {
      if (state.chapter < CATEGORIES.length - 1) openChapter(state.chapter + 1);
    },
    startFlashAll: function () {
      startFlash("all");
    },
    startQuizAll: function () {
      startQuiz("all", state.quizMode);
    },
    startReview: function () {
      startFlash("due");
    },
    flashChapter: function () {
      startFlash(String(state.chapter));
    },
    quizChapter: function () {
      startQuiz(String(state.chapter), state.quizMode);
    },
    flashRestart: function () {
      startFlash(state.flashScope);
    },
    restartQuiz: function () {
      startQuiz(state.quizScope, state.quizMode);
    },
    flip: function () {
      flip();
    },
    again: function () {
      rate(false);
    },
    gotit: function () {
      rate(true);
    },
    skip: function () {
      skipCard();
    },
    answer: function (arg) {
      answerQuiz(Number(arg));
    },
    submitType: function () {
      submitType();
    },
    nextQuiz: function () {
      nextQuiz();
    },
    quizMode: function (arg) {
      startQuiz(state.quizScope, arg);
    },
    fav: function (arg) {
      toggleFav(Number(arg));
    },
    mastered: function (arg) {
      toggleMastered(Number(arg));
    },
    goal: function (arg) {
      setGoal(Number(arg));
    },
    affix: function (arg) {
      state.ui.openAffix[arg] = !state.ui.openAffix[arg];
      render();
    },
    marker: function (arg) {
      var k = "time_" + arg;
      state.ui.openAffix[k] = !state.ui.openAffix[k];
      render();
    },
    family: function (arg) {
      state.ui.family = arg;
      render();
    },
    gtab: function (arg) {
      state.ui.grammarTab = arg;
      render();
    },
    gCheck: function () {
      var answers = {};
      var inputs = document.querySelectorAll("[data-gp]");
      for (var i = 0; i < inputs.length; i++)
        answers[inputs[i].getAttribute("data-gp")] = inputs[i].value || "";
      state.ui.gp = { answers: answers, checked: true };
      render();
    },
    gReset: function () {
      state.ui.gp = null;
      render();
    },
    clearSearch: function () {
      state.search = "";
      var s = document.getElementById("search");
      if (s) s.value = "";
      render();
    },
    print: function () {
      try {
        window.print();
      } catch (e) {}
    },
    reset: function () {
      resetProgress();
    },
    menu: function () {
      var nav = document.getElementById("nav");
      if (nav) nav.classList.toggle("open");
    },
  };

  function closeMobileNav() {
    var nav = document.getElementById("nav");
    if (nav) nav.classList.remove("open");
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act]");
    if (!t) {
      var nav = document.getElementById("nav");
      if (
        nav &&
        nav.classList.contains("open") &&
        !e.target.closest("#menu-btn")
      )
        closeMobileNav();
      return;
    }
    var act = t.getAttribute("data-act");
    if (act === "speak") {
      e.stopPropagation();
      speak(t.getAttribute("data-say"));
      return;
    }
    if (t.closest("#nav") && act !== "menu") closeMobileNav();
    if (ACTIONS[act]) {
      e.preventDefault();
      ACTIONS[act](t.getAttribute("data-arg"));
    }
  });
  document.addEventListener("change", function (e) {
    if (e.target.id === "flash-scope") startFlash(e.target.value);
    else if (e.target.id === "quiz-scope")
      startQuiz(e.target.value, state.quizMode);
    else if (e.target.id === "chapter-select")
      openChapter(Number(e.target.value));
    else if (e.target.id === "voice-select") {
      state.voice = e.target.value || "";
      CHOSEN_VOICE = null; // let pickVoice() re-resolve
      save();
      render();
      speak("ㄅㄆㄇㄈ的發音"); // audition the new choice immediately
    }
  });
  document.addEventListener("input", function (e) {
    if (e.target.id === "search") {
      state.search = e.target.value;
      render();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.target.id === "type-input" && e.key === "Enter") {
      e.preventDefault();
      if (state.quiz && state.quiz.answered) nextQuiz();
      else submitType();
    }
  });

  // ---------- init ----------
  function init() {
    document.documentElement.setAttribute("data-theme", state.theme);
    var tb = document.getElementById("theme-btn");
    if (tb) tb.title = "Theme: " + state.theme + " (click to change)";
    if (window.speechSynthesis) {
      VOICES = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function () {
        VOICES = window.speechSynthesis.getVoices();
      };
    }
    buildPrintBook();
    render();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
