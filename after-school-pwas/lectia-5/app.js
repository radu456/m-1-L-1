(function () {
  "use strict";
  var STORAGE_KEY = "after-school-lesson-5-v1";
  var STEP_TITLES = ["Povestea și înțelegerea", "Descrierea", "Îmbogățește propoziția", "Ce aude personajul?", "Ce simte personajul?", "Arată emoția", "Cine spune replica?", "Completează dialogul", "Transformă scena", "Misiunea autorului"];
  var state = load();
  var selectedDrag = null;
  var toastTimer = null;
  var quizQuestions = [
    { text: "Cum era ușa?", options: ["Nouă și strălucitoare", "Veche și acoperită de urme ciudate", "Roșie și foarte mare", "Mică și galbenă"], answer: 1 },
    { text: "Ce auzea Max?", options: ["Muzică", "Pași", "Un foșnet", "Râsete"], answer: 2 },
    { text: "Cum crezi că se simțea Max?", options: ["Foarte vesel", "Speriat și neliniștit", "Plictisit", "Somnoros"], answer: 1 },
    { text: "Ce a văzut Max în întuneric?", options: ["O ușă", "Un animal", "Două lumini verzi", "O hartă"], answer: 2 },
    { text: "De ce scena este interesantă?", options: ["Pentru că este foarte lungă", "Pentru că are detalii, emoții și dialog", "Pentru că are multe personaje", "Pentru că folosește cuvinte complicate"], answer: 1 }
  ];
  var descriptionQuestions = [{ text: "Care descriere te ajută să-ți imaginezi mai bine locul?", options: ["Varianta A: Era o pădure.", "Varianta B: Era o pădure întunecată, cu copaci foarte înalți și frunze care se mișcau în vânt."], answer: 1 }];
  var showQuestions = [
    { text: "Care propoziție arată că personajul este speriat?", options: ["„Max era speriat.”", "„Max făcu un pas înapoi și își strânse mâinile.”"], answer: 1 },
    { text: "Care propoziție arată că personajul este nervos?", options: ["„Personajul era nervos.”", "„Strânse pumnii și lovi cu piciorul în pământ.”"], answer: 1 },
    { text: "Care propoziție arată că personajul este fericit?", options: ["„Personajul era fericit.”", "„Zâmbi larg și începu să sară de bucurie.”"], answer: 1 },
    { text: "Care propoziție arată că personajul este speriat de ușă?", options: ["„Personajul era speriat.”", "„Se ascunse după ușă și privi în jur cu ochii mari.”"], answer: 1 }
  ];
  var soundOptions = ["Pași", "O ușă care scârțâie", "Vântul", "Un șoarece", "Un ceas care ticăie", "O voce misterioasă", "O melodie", "Un obiect care cade"];
  var emotionOptions = ["Speriat", "Curios", "Uimit", "Entuziasmat", "Neliniștit", "Curajos", "Confuz", "Bucuros", "Nervos"];
  var dialogueItems = [
    { id: "A", label: "A. „Hai să vedem ce este acolo!”", zone: "max" },
    { id: "B", label: "B. „Stai! Mai întâi trebuie să verificăm dacă este sigur.”", zone: "lia" },
    { id: "C", label: "C. „Dar dacă în spatele ușii este ceva important?”", zone: "max" },
    { id: "D", label: "D. „Nu știm ce ne așteaptă. Trebuie să fim atenți.”", zone: "lia" }
  ];
  function el(id) { return document.getElementById(id); }
  function esc(value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function parse(raw) { try { return JSON.parse(raw); } catch (e) { return null; } }
  function load() {
    var blank = { currentStep: 1, fields: {}, quiz: {}, scores: {}, drags: {}, dragFeedback: {}, multiFeedback: {}, complete: false };
    try {
      var p = parse(localStorage.getItem(STORAGE_KEY) || "");
      if (!p) return blank;
      return { currentStep: Number(p.currentStep) || 1, fields: p.fields || {}, quiz: p.quiz || {}, scores: p.scores || {}, drags: p.drags || {}, dragFeedback: p.dragFeedback || {}, multiFeedback: p.multiFeedback || {}, complete: !!p.complete };
    } catch (e) { return blank; }
  }
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {} }
  function value(key) { return state.fields[key] == null ? "" : state.fields[key]; }
  function prior(keys) {
    try {
      for (var i = 0; i < localStorage.length; i += 1) {
        var k = localStorage.key(i) || "";
        if (k === STORAGE_KEY || k.indexOf("after-school-lesson-") !== 0) continue;
        var p = parse(localStorage.getItem(k) || "");
        var f = p && p.fields ? p.fields : p;
        for (var j = 0; f && j < keys.length; j += 1) if (f[keys[j]]) return f[keys[j]];
      }
    } catch (e) {}
    return "";
  }
  function toast(text) { var n = el("toast"); if (!n) return; n.textContent = text || ""; clearTimeout(toastTimer); if (text) toastTimer = setTimeout(function () { n.textContent = ""; }, 3200); }
  function head(k, t, e) { return "<div class=\"step-heading\"><div class=\"emoji\" aria-hidden=\"true\">" + e + "</div><div><p class=\"step-kicker\">" + k + "</p><h2>" + t + "</h2></div></div>"; }
  function start(k, t, e) { return "<article class=\"step-card\">" + head(k, t, e); }
  function end() { return "</article>"; }
  function choice(name, val, label, type, checked, field, max) {
    var a = " type=\"" + (type || "radio") + "\" name=\"" + name + "\" value=\"" + esc(val) + "\"";
    if (field) a += " data-field=\"" + field + "\"";
    if (max) a += " data-max=\"" + max + "\"";
    if (checked) a += " checked";
    return "<label class=\"choice\"><input" + a + "><span>" + label + "</span></label>";
  }
  function field(id, label, v, multi, full, hint) {
    var tag = multi ? "textarea" : "input";
    return "<div class=\"field" + (full ? " full" : "") + "\"><label for=\"" + id + "\">" + label + "</label><" + tag + (multi ? "" : " type=\"text\"") + " id=\"" + id + "\" data-field=\"" + id + "\">" + (multi ? esc(v) : "") + "</" + tag + ">" + (hint ? "<small>" + hint + "</small>" : "") + "</div>";
  }
  function checks(id, options, max, legend) {
    var chosen = Array.isArray(value(id)) ? value(id) : [];
    var h = "<fieldset class=\"question-card\"><legend>" + legend + (max ? " <span class=\"score\">(maximum " + max + ")</span>" : "") + "</legend><div class=\"choice-grid\">";
    options.forEach(function (o) { h += choice(id, o, o, "checkbox", chosen.indexOf(o) >= 0, id, max); });
    return h + "</div></fieldset>";
  }
  function quiz(id, questions) {
    var old = state.quiz[id] || [];
    var h = "<div class=\"question-list\">";
    questions.forEach(function (q, qi) {
      h += "<fieldset class=\"question-card\"><legend>" + (qi + 1) + ". " + q.text + "</legend><div class=\"choice-grid\">";
      q.options.forEach(function (o, oi) { h += "<label class=\"choice\"><input type=\"radio\" name=\"" + id + "-q" + qi + "\" value=\"" + oi + "\" data-quiz-id=\"" + id + "\" data-q-index=\"" + qi + "\"" + (String(old[qi]) === String(oi) ? " checked" : "") + "><span>" + o + "</span></label>"; });
      h += "</div></fieldset>";
    });
    h += "</div><div class=\"action-row\"><button class=\"secondary-button\" type=\"button\" data-action=\"quiz\" data-id=\"" + id + "\">Verifică răspunsurile</button>";
    var score = state.scores[id];
    if (score != null) h += "<div class=\"feedback " + (score === questions.length ? "" : "neutral") + "\" role=\"status\">" + (score === questions.length ? "Bravo! Ai găsit ingredientele unei scene interesante. 🌟" : "Bună încercare! Recitește scena și verifică.") + " <span class=\"score\">" + score + "/" + questions.length + "</span></div>";
    return h + "</div>";
  }
  function chip(group, item, assigned) { return "<button class=\"drag-chip" + (assigned ? " assigned" : "") + "\" type=\"button\" draggable=\"true\" data-drag-group=\"" + group + "\" data-drag-id=\"" + item.id + "\">" + item.label + "</button>"; }
  function board(group, items, zones, instruction) {
    var a = state.drags[group] || {};
    var h = "<p class=\"tip\"><strong>Joacă-te:</strong> " + instruction + " Trage replica sau atinge-o, apoi personajul.</p><div class=\"drag-board\">";
    zones.forEach(function (z) {
      h += "<section class=\"drag-column\" data-drop-group=\"" + group + "\" data-drop-zone=\"" + z.id + "\" data-zone=\"" + z.id + "\" tabindex=\"0\"><h3>" + z.title + "</h3><p class=\"drop-hint\">Atinge aici pentru a o pune.</p><div class=\"drag-tray\">";
      items.forEach(function (it) { if (a[it.id] === z.id) h += chip(group, it, true); });
      h += "</div></section>";
    });
    h += "<section class=\"drag-column\" data-drop-group=\"" + group + "\" data-drop-zone=\"tray\" data-zone=\"tray\" tabindex=\"0\"><h3>Replici rămase</h3><p class=\"drop-hint\">Mută aici pentru a o elibera.</p><div class=\"drag-tray\">";
    items.forEach(function (it) { if (!a[it.id] || a[it.id] === "tray") h += chip(group, it, false); });
    return h + "</div></section></div>";
  }
  function render(index) {
    var h = "";
    if (index === 1) {
      h = start("Pasul 1", "Povestea: Ce era în spatele ușii?", "🌟") + "<div class=\"story\"><p>Max se opri în fața ușii. Era veche și acoperită de urme ciudate. Dincolo de ea se auzea un foșnet.</p><p>Max își strânse mâinile. — Cine este acolo? întrebă el. Nimeni nu răspunse.</p><p>Ușa se deschise încet. Max făcu un pas înapoi. Apoi văzu două lumini verzi în întuneric. — Nu-mi place deloc asta...</p></div><p class=\"tip\"><strong>Ideea-cheie:</strong> o poveste devine mai interesantă când cititorul poate vedea, auzi și simți ceea ce trăiește personajul.</p><h3>Înțelegerea poveștii</h3>" + quiz("story5", quizQuestions) + end();
    } else if (index === 2) {
      h = start("Pasul 2", "Descrierea — fă-mă să văd!", "👀") + "<p>O descriere ne ajută să ne imaginăm ceea ce vede personajul.</p><div class=\"story\"><strong>Varianta A:</strong> „Era o pădure.”<br><br><strong>Varianta B:</strong> „Era o pădure întunecată, cu copaci foarte înalți și frunze care se mișcau în vânt.”</div>" + quiz("description5", descriptionQuestions) + end();
    } else if (index === 3) {
      h = start("Pasul 3", "Îmbogățește propoziția", "🎨") + "<p>Transformă „Era un castel.” într-o imagine mai interesantă alegând cuvinte care îl descriu.</p>" + checks("castleWords", ["mare", "vechi", "misterios", "întunecat", "strălucitor", "plictisitor"], 0, "Cuvinte pentru castel") + "<p>Acum descrie și pădurea:</p>" + checks("forestWords", ["liniștită", "întunecată", "misterioasă", "fermecată", "luminoasă", "zgomotoasă"], 0, "Cuvinte pentru pădure") + "<div class=\"tip\">Toate pot fi corecte în funcție de poveste. Tu alegi atmosfera.</div>" + end();
    } else if (index === 4) {
      h = start("Pasul 4", "Ce aude personajul?", "👂") + "<p>Personajul tău intră într-o casă abandonată. Alege maximum 3 sunete și spune care face scena mai misterioasă.</p>" + checks("sounds", soundOptions, 3, "Sunete") + "<div class=\"field-grid\" style=\"margin-top:16px\">" + field("mysteriousSound", "Care dintre sunetele alese face scena mai misterioasă?", value("mysteriousSound"), true, true) + "</div>" + end();
    } else if (index === 5) {
      h = start("Pasul 5", "Ce simte personajul?", "❤️") + "<p>Ușa din fața personajului se deschide singură. Alege emoțiile care se potrivesc, apoi explică de ce.</p>" + checks("emotions", emotionOptions, 0, "Emoții posibile") + "<div class=\"field-grid\" style=\"margin-top:16px\">" + field("emotionReason", "De ce se simte așa?", value("emotionReason"), true, true) + "</div><div class=\"feedback\" role=\"status\">Foarte bine! Emoțiile fac personajele să pară reale.</div>" + end();
    } else if (index === 6) {
      h = start("Pasul 6", "Arată emoția fără să o spui", "🎭") + "<p>Nu trebuie să spunem direct „era speriat”. Putem arăta emoția prin acțiuni.</p>" + quiz("show5", showQuestions) + end();
    } else if (index === 7) {
      h = start("Pasul 7", "Cine spune replica?", "💬") + "<p><strong>Max</strong> este curios. <strong>Lia</strong> este precaută. Trage fiecare replică la personajul potrivit.</p>" + board("dialog-match", dialogueItems, [{ id: "max", title: "👦 Max — curios" }, { id: "lia", title: "👧 Lia — precaută" }], "Asociază replica cu personalitatea.") + "<div class=\"action-row\"><button class=\"secondary-button\" type=\"button\" data-action=\"dialog-check\">Verifică replicile</button>" + (state.dragFeedback["dialog-match"] ? "<div class=\"feedback\" role=\"status\">" + state.dragFeedback["dialog-match"] + "</div>" : "") + "</div>" + end();
    } else if (index === 8) {
      h = start("Pasul 8", "Completează dialogul", "✍️") + "<p>Scrie continuarea. Sunt răspunsuri creative — nu există un singur răspuns corect.</p><div class=\"field-grid\">" +
        field("dialog1", "— Nu știu, dar cred că...", value("dialog1"), true, false) +
        field("dialog2", "— Dar dacă...", value("dialog2"), true, false) +
        field("dialog3", "— Am aflat că...", value("dialog3"), true, false) +
        field("dialog4", "— Nu-ți face griji. Eu...", value("dialog4"), true, false) + "</div><div class=\"tip\">Dialogul este conversația dintre personaje. Replicile pot arăta curaj, teamă, curiozitate sau prudență.</div>" + end();
    } else if (index === 9) {
      var name = value("characterName") || prior(["characterName", "name", "personaj", "nume"]) || "Personajul meu";
      var place = value("place") || prior(["ownPlace", "buildPlace", "decor", "place"]) || "un loc misterios";
      var problem = value("problem") || prior(["ownProblem", "planProblem", "problem"]) || "o problemă neașteptată";
      h = start("Pasul 9", "Transformă scena!", "🪄") + "<p>Scena simplă este: „" + esc(name) + " ajunge la castel. Vede o ușă.” Adaugă detalii, sunete, emoții și o replică.</p><div class=\"field-grid\">" +
        field("sceneVisual", "👀 Un detaliu vizual", value("sceneVisual") || place, true, false) +
        field("sceneSound", "👂 Un sunet", value("sceneSound"), true, false) +
        field("sceneEmotion", "❤️ O emoție", value("sceneEmotion"), true, false) +
        field("sceneLine", "💬 O replică", value("sceneLine"), true, false) +
        field("ownScene", "Scena mea (5–7 propoziții)", value("ownScene"), true, true, "Include un detaliu despre loc, un sunet, o emoție, o acțiune și cel puțin o replică.") + "</div><div class=\"tip\">Poți începe cu: „" + esc(name) + " se afla...” · „În jur...” · „Deodată...” · „A auzit...” · „S-a simțit...”</div>" + end();
    } else {
      var name2 = value("characterName") || prior(["characterName", "name", "personaj", "nume"]) || "Personajul meu";
      h = start("Pasul 10", "Misiunea autorului — dau viață scenei mele", "🏆") + "<p>Ai adăugat ingredientele care fac o scenă vie. Verifică rezumatul și citește scena cu voce tare.</p><div class=\"summary-list\">";
      [["Personaj", name2], ["Loc", value("place") || prior(["ownPlace", "buildPlace", "decor"]) || "—"], ["Problemă", value("problem") || prior(["ownProblem", "planProblem"]) || "—"], ["Detaliu", value("sceneVisual") || "—"], ["Sunet", value("sceneSound") || "—"], ["Emoție", value("sceneEmotion") || "—"], ["Dialog", value("sceneLine") || "—"]].forEach(function (r) { h += "<div class=\"summary-row\"><strong>" + r[0] + "</strong><span>" + esc(r[1]) + "</span></div>"; });
      h += "</div><div class=\"story\"><strong>Mini-provocare:</strong> transformă „Era foarte speriat.” într-o acțiune. Exemplu: „Îi tremurau mâinile și făcu încet un pas înapoi.”<br><div class=\"field-grid\" style=\"margin-top:12px\">" + field("showDontTell", "Scrie varianta ta", value("showDontTell"), true, true) + "</div></div><div class=\"badge-card\"><div class=\"badge\" aria-hidden=\"true\">🏅</div><div><h3>Insigna: Maestrul cuvintelor</h3><p>Bravo, Autorule! Povestea ta poate fi văzută, auzită și simțită.</p></div></div>" + end();
    }
    el("stepHost").innerHTML = h;
    chrome(index);
    bind();
  }
  function chrome(index) {
    el("stepTitle").textContent = STEP_TITLES[index - 1] || "Pas";
    el("stepCount").textContent = index + " / " + STEP_TITLES.length;
    el("progressBar").style.width = Math.round(index / STEP_TITLES.length * 100) + "%";
    el("prevBtn").disabled = index <= 1;
    el("nextBtn").textContent = index >= STEP_TITLES.length ? "Gata ✓" : "Continuă →";
    try { history.replaceState(null, "", "./?step=" + index); } catch (e) {}
  }
  function collect() {
    document.querySelectorAll("#stepHost [data-field]").forEach(function (n) {
      var k = n.getAttribute("data-field");
      if (n.type === "checkbox") {
        var nodes = document.querySelectorAll("#stepHost input[type=checkbox][data-field=\"" + k + "\"]:checked");
        state.fields[k] = Array.prototype.map.call(nodes, function (x) { return x.value; });
      } else if (n.type === "radio") {
        if (n.checked) state.fields[k] = n.value;
      } else state.fields[k] = n.value;
    });
    save();
  }
  function bindFields() {
    document.querySelectorAll("#stepHost [data-field]").forEach(function (n) {
      var k = n.getAttribute("data-field");
      if (n.type === "checkbox") n.checked = Array.isArray(state.fields[k]) && state.fields[k].indexOf(n.value) >= 0;
      else if (n.type === "radio") n.checked = String(state.fields[k] || "") === String(n.value);
      else if (state.fields[k] != null && n.value !== state.fields[k]) n.value = state.fields[k];
      n.addEventListener(n.type === "text" || n.tagName === "TEXTAREA" ? "input" : "change", function () {
        var max = Number(n.getAttribute("data-max") || 0);
        if (n.type === "checkbox" && max) {
          var count = document.querySelectorAll("#stepHost input[type=checkbox][data-field=\"" + k + "\"]:checked").length;
          if (count > max) { n.checked = false; toast("Alege cel mult " + max + " variante."); return; }
        }
        collect();
      });
    });
  }
  function checkQuiz(id, questions) {
    var answers = [], score = 0;
    questions.forEach(function (q, i) {
      var n = document.querySelector("#stepHost input[data-quiz-id=\"" + id + "\"][data-q-index=\"" + i + "\"]:checked");
      answers[i] = n ? Number(n.value) : null;
      if (answers[i] === q.answer) score += 1;
    });
    state.quiz[id] = answers; state.scores[id] = score; save(); render(state.currentStep); toast("Am verificat: " + score + "/" + questions.length + ".");
  }
  function checkDialog() {
    var a = state.drags["dialog-match"] || {};
    var ok = dialogueItems.every(function (x) { return a[x.id] === x.zone; });
    state.dragFeedback["dialog-match"] = ok ? "Perfect! Max este curios, iar Lia este atentă și precaută. 🌟" : "Mai încearcă: gândește-te la personalitatea fiecărui personaj.";
    save(); render(state.currentStep);
  }
  function dragPayload(s) { var p = String(s || "").split("::"); return p.length === 2 ? { group: p[0], id: p[1] } : null; }
  function assign(group, id, zone) { if (!state.drags[group]) state.drags[group] = {}; state.drags[group][id] = zone === "tray" ? "" : zone; selectedDrag = null; save(); render(state.currentStep); }
  function bindDrag() {
    document.querySelectorAll("#stepHost [data-drag-id]").forEach(function (n) {
      n.addEventListener("click", function (event) { event.stopPropagation(); selectedDrag = { group: n.getAttribute("data-drag-group"), id: n.getAttribute("data-drag-id") }; document.querySelectorAll("#stepHost .drag-chip").forEach(function (x) { x.classList.remove("is-selected"); }); n.classList.add("is-selected"); toast("Acum atinge personajul potrivit."); });
      n.addEventListener("dragstart", function (e) { var p = n.getAttribute("data-drag-group") + "::" + n.getAttribute("data-drag-id"); e.dataTransfer.setData("text/plain", p); selectedDrag = dragPayload(p); n.classList.add("is-selected"); });
      n.addEventListener("dragend", function () { n.classList.remove("is-selected"); });
    });
    document.querySelectorAll("#stepHost [data-drop-group]").forEach(function (z) {
      z.addEventListener("click", function () { if (selectedDrag && selectedDrag.group === z.getAttribute("data-drop-group")) assign(selectedDrag.group, selectedDrag.id, z.getAttribute("data-drop-zone")); });
      z.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && selectedDrag && selectedDrag.group === z.getAttribute("data-drop-group")) { e.preventDefault(); assign(selectedDrag.group, selectedDrag.id, z.getAttribute("data-drop-zone")); } });
      z.addEventListener("dragover", function (e) { e.preventDefault(); z.classList.add("is-over"); });
      z.addEventListener("dragleave", function () { z.classList.remove("is-over"); });
      z.addEventListener("drop", function (e) { e.preventDefault(); z.classList.remove("is-over"); var p = dragPayload(e.dataTransfer.getData("text/plain")); if (p && p.group === z.getAttribute("data-drop-group")) assign(p.group, p.id, z.getAttribute("data-drop-zone")); });
    });
  }
  function bind() {
    bindFields(); bindDrag();
    document.querySelectorAll("#stepHost [data-action]").forEach(function (b) {
      b.addEventListener("click", function () {
        collect();
        var a = b.getAttribute("data-action"), id = b.getAttribute("data-id");
        if (a === "quiz") checkQuiz(id, id === "story5" ? quizQuestions : id === "description5" ? descriptionQuestions : showQuestions);
        if (a === "dialog-check") checkDialog();
      });
    });
  }
  function go(step) { collect(); state.currentStep = Math.max(1, Math.min(STEP_TITLES.length, step)); if (state.currentStep === STEP_TITLES.length) state.complete = true; save(); render(state.currentStep); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function network() { var n = el("offlineBadge"); var online = navigator.onLine !== false; n.textContent = online ? "● Online" : "● Offline"; n.classList.toggle("online", online); n.classList.toggle("offline", !online); }
  function reset() { if (!window.confirm("Ștergi toate răspunsurile acestei lecții?")) return; try { localStorage.removeItem(STORAGE_KEY); } catch (e) {} state = load(); toast("Răspunsurile au fost șterse."); render(1); }
  function init() {
    var p = new URLSearchParams(window.location.search), s = Number(p.get("step"));
    if (s >= 1 && s <= STEP_TITLES.length) state.currentStep = s;
    el("prevBtn").addEventListener("click", function () { go(state.currentStep - 1); });
    el("nextBtn").addEventListener("click", function () { if (state.currentStep < STEP_TITLES.length) go(state.currentStep + 1); else toast("Lecția este terminată. Bravo! 🏆"); });
    el("resetBtn").addEventListener("click", reset); window.addEventListener("online", network); window.addEventListener("offline", network); network();
    render(Math.max(1, Math.min(STEP_TITLES.length, state.currentStep || 1)));
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(function () {});
  }
  document.addEventListener("DOMContentLoaded", init);
})();

