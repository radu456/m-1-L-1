(function () {
  "use strict";
  var STORAGE_KEY = "after-school-lesson-4-v1";
  var STEP_TITLES = ["Povestea și înțelegerea", "Problemă sau nu?", "Alege misiunea", "Potrivește problema", "Pune un obstacol", "Dacă ai fi personajul", "Cum reacționează?", "Problema mea", "Planul aventurii", "Misiunea autorului"];
  var state = load();
  var selectedDrag = null;
  var toastTimer = null;
  var quizQuestions = [
    { text: "Unde ajunge Max?", options: ["Într-un castel", "Într-un tunel luminat de stele", "Într-o școală", "Pe o plajă"], answer: 1 },
    { text: "Ce se întâmplă după ce Max intră?", options: ["Găsește o comoară", "Ușa se închide în urma lui", "Se întâlnește cu un prieten", "Se întoarce acasă"], answer: 1 },
    { text: "Care este problema lui Max?", options: ["Îi este foame", "A pierdut un joc", "Nu mai poate ieși pe ușa pe care a intrat", "Nu îi place pădurea"], answer: 2 },
    { text: "Ce trebuie să facă Max?", options: ["Să stea pe loc", "Să adoarmă", "Să meargă înainte și să găsească o soluție", "Să uite ce s-a întâmplat"], answer: 2 },
    { text: "De ce este problema importantă într-o poveste?", options: ["Pentru că face povestea mai lungă", "Pentru că îl face pe personaj să acționeze și creează aventura", "Pentru că adaugă mai multe personaje", "Pentru că povestea trebuie să fie complicată"], answer: 1 }
  ];
  var problemItems = [
    { id: "map", label: "Personajul pierde harta.", zone: "problem" },
    { id: "secret-door", label: "Personajul găsește o ușă secretă.", zone: "problem" },
    { id: "castle-trap", label: "Personajul rămâne blocat într-un castel.", zone: "problem" },
    { id: "breakfast", label: "Personajul mănâncă micul dejun.", zone: "not-problem" },
    { id: "friend-missing", label: "Un prieten dispare.", zone: "problem" },
    { id: "school", label: "Personajul merge liniștit la școală.", zone: "not-problem" },
    { id: "storm-bridge", label: "O furtună distruge podul.", zone: "problem" },
    { id: "sunset-object", label: "Personajul trebuie să găsească un obiect înainte de apus.", zone: "problem" },
    { id: "locker", label: "Personajul își pune ghiozdanul în dulap.", zone: "not-problem" }
  ];
  var pairItems = [
    { id: "A", label: "A. Și-a pierdut harta.", zone: "4" },
    { id: "B", label: "B. Prietenul lui a dispărut.", zone: "2" },
    { id: "C", label: "C. O ușă secretă s-a închis.", zone: "3" },
    { id: "D", label: "D. Un obiect magic a fost furat.", zone: "1" },
    { id: "E", label: "E. Mai sunt doar 10 minute până la apus.", zone: "5" }
  ];
  var missionZones = [
    { id: "1", title: "1 · Să găsească obiectul magic." },
    { id: "2", title: "2 · Să-și găsească prietenul." },
    { id: "3", title: "3 · Să găsească o altă ieșire." },
    { id: "4", title: "4 · Să găsească drumul." },
    { id: "5", title: "5 · Să ajungă la destinație la timp." }
  ];
  var obstacleOptions = ["O ușă încuiată", "Un pod rupt", "O furtună", "O hartă greșită", "Un labirint", "Un paznic misterios", "Un râu prea adânc", "Un animal care blochează drumul", "O enigmă dificilă", "Personajul își pierde obiectul important"];
  var missionOptions = ["Să găsească un obiect pierdut", "Să salveze pe cineva", "Să descopere un secret", "Să găsească drumul spre casă", "Să ajungă într-un loc înainte să fie prea târziu", "Să rezolve o enigmă", "Să găsească o comoară", "Să repare ceva important", "Să ajute un personaj aflat în pericol", "Să descopere cine a lăsat un mesaj misterios"];
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
    var expected = id === "problemChoices" ? problemItems.filter(function (x) { return x.zone === "problem"; }).map(function (x) { return x.label; }) : id === "bridgeActions" ? ["Caută o altă cale.", "Construiește o soluție pentru a traversa.", "Cere ajutorul cuiva.", "Încearcă să găsească un alt pod."] : null;
    var verified = expected && Object.prototype.hasOwnProperty.call(state.multiFeedback, id);
    var h = "<fieldset class=\"question-card\"><legend>" + legend + (max ? " <span class=\"score\">(maximum " + max + ")</span>" : "") + "</legend><div class=\"choice-grid\">";
    options.forEach(function (o) { var selected = chosen.indexOf(o) >= 0; var cls = verified ? (expected.indexOf(o) >= 0 ? " is-correct" : selected ? " is-wrong" : "") : ""; if (verified && expected.indexOf(o) >= 0 && !selected) cls += " correct-answer"; h += "<label class=\"choice" + cls + "\"><input type=\"checkbox\" name=\"" + id + "\" value=\"" + esc(o) + "\" data-field=\"" + id + "\"" + (selected ? " checked" : "") + "><span>" + o + "</span>" + (verified && expected.indexOf(o) >= 0 ? "<span class=\"answer-mark\">✓</span>" : verified && selected ? "<span class=\"answer-mark\">✕</span>" : "") + "</label>"; });
    return h + "</div>" + (verified ? "<div class=\"answer-explanation " + (chosen.length === expected.length && expected.every(function (x) { return chosen.indexOf(x) >= 0; }) ? "good\" >✅ Toate variantele potrivite sunt verzi." : "bad\" >❌ Verde = răspuns potrivit; roșu = alegere nepotrivită. Răspunsurile potrivite sunt marcate cu verde.") + "</div>" : "") + "</fieldset>";
  }
  function quiz(id) {
    var old = state.quiz[id] || [];
    var verified = state.scores[id] != null;
    var h = "<div class=\"question-list\">";
    quizQuestions.forEach(function (q, qi) {
      h += "<fieldset class=\"question-card\"><legend>" + (qi + 1) + ". " + q.text + "</legend><div class=\"choice-grid\">";
      q.options.forEach(function (o, oi) { var picked = String(old[qi]) === String(oi), right = oi === q.answer; var cls = verified && (picked || right) ? (right ? " is-correct" : " is-wrong") : ""; if (verified && right && !picked) cls += " correct-answer"; h += "<label class=\"choice" + cls + "\"><input type=\"radio\" name=\"" + id + "-q" + qi + "\" value=\"" + oi + "\" data-quiz-id=\"" + id + "\" data-q-index=\"" + qi + "\"" + (picked ? " checked" : "") + "><span>" + o + "</span>" + (verified && right ? "<span class=\"answer-mark\">✓</span>" : verified && picked ? "<span class=\"answer-mark\">✕</span>" : "") + "</label>"; });
      h += verified ? "</div><div class=\"answer-explanation " + (String(old[qi]) === String(q.answer) ? "good\" >✅ Corect!" : "bad\" >❌ Răspunsul corect este: <strong>" + q.options[q.answer] + "</strong>.") + "</div></fieldset>" : "</div></fieldset>";
    });
    h += "</div><div class=\"action-row\"><button class=\"secondary-button\" type=\"button\" data-action=\"quiz\" data-id=\"" + id + "\">Verifică răspunsurile</button>";
    if (state.scores[id] != null) h += "<div class=\"feedback " + (state.scores[id] === quizQuestions.length ? "" : "neutral") + "\" role=\"status\">" + (state.scores[id] === quizQuestions.length ? "Excelent! Ai înțeles problema lui Max. 🌟" : "Bună încercare! Recitește scena și mai verifică.") + " <span class=\"score\">" + state.scores[id] + "/" + quizQuestions.length + "</span></div>";
    return h + "</div>";
  }
  function chip(group, item, assigned, verified) { var actual = (state.drags[group] || {})[item.id] || "tray"; var cls = assigned ? " assigned" : ""; if (verified) cls += actual === item.zone ? " is-correct" : " is-wrong"; var expectedLabel = group === "problem-match" ? ((missionZones.find(function (z) { return z.id === item.zone; }) || {}).title || ("Misiunea " + item.zone)) : (item.zone === "problem" ? "Este o problemă" : "Nu este o problemă"); return "<button class=\"drag-chip" + cls + "\" type=\"button\" draggable=\"true\" data-drag-group=\"" + group + "\" data-drag-id=\"" + item.id + "\">" + item.label + (verified ? (actual === item.zone ? " ✓" : " ✕ · corect: " + esc(expectedLabel)) : "") + "</button>"; }
  function board(group, items, zones, instruction) {
    var a = state.drags[group] || {};
    var verified = Object.prototype.hasOwnProperty.call(state.dragFeedback, group);
    var h = "<p class=\"tip\"><strong>Joacă-te:</strong> " + instruction + " Trage cartonașul sau atinge-l, apoi categoria.</p><div class=\"drag-board\">";
    zones.forEach(function (z) {
      h += "<section class=\"drag-column\" data-drop-group=\"" + group + "\" data-drop-zone=\"" + z.id + "\" tabindex=\"0\"><h3>" + z.title + "</h3><p class=\"drop-hint\">Atinge aici pentru a-l pune.</p><div class=\"drag-tray\">";
      items.forEach(function (it) { if (a[it.id] === z.id) h += chip(group, it, true, verified); });
      h += "</div></section>";
    });
    h += "<section class=\"drag-column\" data-drop-group=\"" + group + "\" data-drop-zone=\"tray\" tabindex=\"0\"><h3>Cartonașe rămase</h3><p class=\"drop-hint\">Mută aici pentru a-l elibera.</p><div class=\"drag-tray\">";
    items.forEach(function (it) { if (!a[it.id] || a[it.id] === "tray") h += chip(group, it, false, verified); });
    return h + "</div></section></div>";
  }
  function render(index) {
    var h = "";
    if (index === 1) {
      h = start("Pasul 1", "Povestea: Ușa s-a deschis", "🌟") + "<div class=\"story\"><p>Max ajunse în pădure aproape de seară. În fața lui se afla ușa albastră dintre cei doi copaci.</p><p>Curios, apăsă clanța. Ușa se deschise. Dincolo era un tunel luminat de mici stele.</p><p>Deodată, ușa se închise în urma lui. — Oh, nu! Cum mă mai întorc? În fața lui apăru o singură cale: tunelul. Max porni înainte.</p></div><p class=\"tip\"><strong>Ideea-cheie:</strong> aventura începe când personajului i se întâmplă ceva care îl obligă să acționeze.</p><h3>Înțelegerea poveștii</h3>" + quiz("story4") + end();
    } else if (index === 2) {
      h = start("Pasul 2", "Problemă sau nu?", "💥") + "<p>Alege situațiile care pot porni o aventură. O problemă îl face pe personaj să trebuiască să facă ceva.</p>" + checks("problemChoices", problemItems.map(function (x) { return x.label; }), 0, "Situații care pot deveni probleme") + "<div class=\"action-row\"><button class=\"secondary-button\" type=\"button\" data-action=\"problem-check\">Verifică alegerile</button>" + (state.multiFeedback.problemChoices ? "<div class=\"feedback\" role=\"status\">" + state.multiFeedback.problemChoices + "</div>" : "") + "</div>" + end();
    } else if (index === 3) {
      h = start("Pasul 3", "Ce fel de aventură?", "🎯") + "<p>Alege misiunea personajului, apoi scrie cu cuvintele tale ce trebuie să facă.</p><div class=\"choice-grid\">";
      missionOptions.forEach(function (o) { h += choice("mission", o, o, "radio", value("mission") === o, "mission"); });
      h += "</div><div class=\"field-grid\" style=\"margin-top:16px\">" + field("missionOwn", "Ce trebuie să facă personajul tău?", value("missionOwn"), true, true) + "</div>" + end();
    } else if (index === 4) {
      h = start("Pasul 4", "Potrivește problema cu misiunea", "🧩") + "<p>Fiecare problemă îi dă personajului un motiv să pornească la drum. Potrivește cartonașele.</p>" + board("problem-match", pairItems, missionZones, "Alege misiunea care rezolvă problema.") + "<div class=\"action-row\"><button class=\"secondary-button\" type=\"button\" data-action=\"match-check\">Verifică potrivirile</button>" + (state.dragFeedback["problem-match"] ? "<div class=\"feedback\" role=\"status\">" + state.dragFeedback["problem-match"] + "</div>" : "") + "</div><div class=\"tip\">Răspunsuri: A → 4 · B → 2 · C → 3 · D → 1 · E → 5.</div>" + end();
    } else if (index === 5) {
      h = start("Pasul 5", "Pune un obstacol!", "🚧") + "<p>Un obstacol face misiunea mai dificilă. De exemplu: Max trebuie să găsească ieșirea, dar singurul drum este blocat de un bolovan uriaș.</p><div class=\"choice-grid\">";
      obstacleOptions.forEach(function (o) { h += choice("obstacle", o, o, "radio", value("obstacle") === o, "obstacle"); });
      h += "</div>" + end();
    } else if (index === 6) {
      var actions = ["Caută o altă cale.", "Construiește o soluție pentru a traversa.", "Cere ajutorul cuiva.", "Așteaptă fără să facă nimic.", "Încearcă să găsească un alt pod."];
      h = start("Pasul 6", "Dacă ai fi personajul...", "🎲") + "<p><strong>Situație:</strong> personajul trebuie să ajungă la un castel, dar podul peste râu s-a rupt. Ce ar putea face?</p>" + checks("bridgeActions", actions, 0, "Idei care încearcă să rezolve problema") + "<div class=\"action-row\"><button class=\"secondary-button\" type=\"button\" data-action=\"bridge-check\">Verifică ideile</button>" + (state.multiFeedback.bridgeActions ? "<div class=\"feedback\" role=\"status\">" + state.multiFeedback.bridgeActions + "</div>" : "") + "</div><div class=\"field-grid\" style=\"margin-top:16px\">" + field("bridgeOwn", "Tu ce ai face dacă ai fi personajul?", value("bridgeOwn"), true, true) + "</div>" + end();
    } else if (index === 7) {
      var name = value("characterName") || prior(["characterName", "name", "personaj", "nume"]) || "personajul tău";
      var traits = value("traits") || prior(["traits", "trăsături", "traitsText"]) || "curios și curajos";
      var fear = value("fear") || prior(["fear", "frică", "fearText"]) || "necunoscut";
      h = start("Pasul 7", "Cum reacționează personajul?", "❤️") + "<p>Personajul tău este <strong>" + esc(name) + "</strong>. Îți amintești că este <strong>" + esc(traits) + "</strong> și că îi este frică de <strong>" + esc(fear) + "</strong>.</p><div class=\"story\"><strong>Situație:</strong> personajul găsește o ușă întunecată și aude un zgomot în spatele ei.</div><p>Ce face?</p><div class=\"choice-grid\">";
      ["Deschide imediat ușa.", "Se sperie și fuge.", "Se apropie încet.", "Își cheamă un prieten.", "Caută mai întâi un indiciu.", "Se ascunde și așteaptă."].forEach(function (o) { h += choice("reaction", o, o, "radio", value("reaction") === o, "reaction"); });
      h += "</div><div class=\"field-grid\" style=\"margin-top:16px\">" + field("reactionReason", "De ce ar reacționa așa?", value("reactionReason"), true, true, "Nu există un singur răspuns corect. Reacția trebuie să se potrivească personalității.") + "</div>" + end();
    } else if (index === 8) {
      h = start("Pasul 8", "Construiește problema poveștii tale", "✍️") + "<p>Folosește personajul și decorul din lecțiile anterioare. O problemă bună îl obligă pe erou să acționeze.</p><div class=\"field-grid\">" +
        field("characterName", "Personaj", value("characterName") || prior(["characterName", "name", "personaj", "nume"]), false, false) +
        field("ownPlace", "Locul", value("ownPlace") || prior(["buildPlace", "decor", "place"]), false, false) +
        field("ownProblem", "Problema lui este", value("ownProblem"), true, true, "Exemplu: ușa secretă s-a închis și nu mai găsește ieșirea.") +
        field("ownMission", "Misiunea devine", value("ownMission") || value("missionOwn"), true, true) + "</div>" + end();
    } else if (index === 9) {
      h = start("Pasul 9", "Planul aventurii", "🗺️") + "<p>Leagă toate piesele: problemă, misiune, obstacol și soluție.</p><div class=\"field-grid\">" +
        field("planProblem", "Problema", value("planProblem") || value("ownProblem"), true, false) +
        field("planMission", "Misiunea", value("planMission") || value("ownMission") || value("mission"), true, false) +
        field("planObstacle", "Obstacolul", value("planObstacle") || value("obstacle"), true, false) +
        field("planSolution", "Cum încearcă personajul să rezolve?", value("planSolution") || value("bridgeOwn"), true, false) + "</div><div class=\"tip\">Un autor poate alege mai multe soluții. Important este ca personajul să încerce să rezolve problema.</div>" + end();
    } else {
      h = start("Pasul 10", "Misiunea autorului", "🏆") + "<p>Ai creat un motor pentru poveste: ceva de rezolvat, o misiune și un obstacol. Spune planul cu voce tare unui coleg.</p><div class=\"summary-list\">";
      [["Personaj", value("characterName") || prior(["characterName", "name", "personaj", "nume"]) || "—"], ["Problemă", value("ownProblem") || value("planProblem") || "—"], ["Misiune", value("ownMission") || value("mission") || "—"], ["Obstacol", value("planObstacle") || value("obstacle") || "—"]].forEach(function (r) { h += "<div class=\"summary-row\"><strong>" + r[0] + "</strong><span>" + esc(r[1]) + "</span></div>"; });
      h += "</div><div class=\"badge-card\"><div class=\"badge\" aria-hidden=\"true\">🏅</div><div><h3>Insigna: Constructor de aventuri</h3><p>Bravo! Ai dat personajului tău un motiv să pornească la drum.</p></div></div>" + end();
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
  function checkQuiz(id) {
    var answers = [], score = 0;
    quizQuestions.forEach(function (q, i) {
      var n = document.querySelector("#stepHost input[data-quiz-id=\"" + id + "\"][data-q-index=\"" + i + "\"]:checked");
      answers[i] = n ? Number(n.value) : null;
      if (answers[i] === q.answer) score += 1;
    });
    state.quiz[id] = answers; state.scores[id] = score; save(); render(state.currentStep); toast("Am verificat: " + score + "/" + quizQuestions.length + ".");
  }
  function checkProblems() {
    var chosen = Array.isArray(value("problemChoices")) ? value("problemChoices") : [];
    var correct = problemItems.filter(function (x) { return x.zone === "problem"; }).map(function (x) { return x.label; });
    var ok = chosen.length === correct.length && correct.every(function (x) { return chosen.indexOf(x) >= 0; });
    state.multiFeedback.problemChoices = ok ? "Bravo! O problemă îl face pe personaj să trebuiască să facă ceva." : "Roșu = nu este o problemă pentru această poveste. Variantele potrivite sunt: pierderea hărții, ușa secretă, castelul blocat, dispariția prietenului, furtuna care distruge podul și obiectul de găsit înainte de apus.";
    save(); render(state.currentStep);
  }
  function checkBridge() {
    var chosen = Array.isArray(value("bridgeActions")) ? value("bridgeActions") : [];
    var correct = ["Caută o altă cale.", "Construiește o soluție pentru a traversa.", "Cere ajutorul cuiva.", "Încearcă să găsească un alt pod."];
    var ok = chosen.length === correct.length && correct.every(function (x) { return chosen.indexOf(x) >= 0; });
    state.multiFeedback.bridgeActions = ok ? "Exact! Toate variantele care încearcă să rezolve problema sunt potrivite." : "Verzi sunt: caută o altă cale, construiește o soluție, cere ajutor și caută alt pod. „Așteaptă fără să facă nimic” rămâne roșu.";
    save(); render(state.currentStep);
  }
  function checkDrag(group) {
    var assigned = state.drags[group] || {};
    var items = group === "problem-match" ? pairItems : problemItems;
    var ok = items.every(function (x) { return assigned[x.id] === x.zone; });
    state.dragFeedback[group] = ok ? "Foarte bine! Fiecare problemă are o misiune potrivită. 🌟" : "Roșu = potrivire greșită; fiecare cartonaș arată acum numărul misiunii corecte. Mută-l și verifică din nou.";
    save(); render(state.currentStep);
  }
  function dragPayload(s) { var p = String(s || "").split("::"); return p.length === 2 ? { group: p[0], id: p[1] } : null; }
  function assign(group, id, zone) { if (!state.drags[group]) state.drags[group] = {}; state.drags[group][id] = zone === "tray" ? "" : zone; selectedDrag = null; save(); render(state.currentStep); }
  function bindDrag() {
    document.querySelectorAll("#stepHost [data-drag-id]").forEach(function (n) {
      n.addEventListener("click", function (event) {
        event.stopPropagation();
        selectedDrag = { group: n.getAttribute("data-drag-group"), id: n.getAttribute("data-drag-id") };
        document.querySelectorAll("#stepHost .drag-chip").forEach(function (x) { x.classList.remove("is-selected"); });
        n.classList.add("is-selected"); toast("Acum atinge misiunea potrivită.");
      });
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
        if (a === "quiz") checkQuiz(id);
        if (a === "problem-check") checkProblems();
        if (a === "bridge-check") checkBridge();
        if (a === "match-check") checkDrag(id);
      });
    });
  }
  function go(step) { collect(); state.currentStep = Math.max(1, Math.min(STEP_TITLES.length, step)); if (state.currentStep === STEP_TITLES.length) state.complete = true; save(); render(state.currentStep); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function network() { var n = el("offlineBadge"); var online = navigator.onLine !== false; n.textContent = online ? "● Online" : "● Offline"; n.classList.toggle("online", online); n.classList.toggle("offline", !online); }
  function reset() { if (!window.confirm("Ștergi toate răspunsurile acestei lecții?")) return; try { localStorage.removeItem(STORAGE_KEY); } catch (e) {} state = load(); toast("Răspunsurile au fost șterse."); render(1); }
  function init() {
    var p = new URLSearchParams(window.location.search), urlStep = Number(p.get("step"));
    if (urlStep >= 1 && urlStep <= STEP_TITLES.length) state.currentStep = urlStep;
    el("prevBtn").addEventListener("click", function () { go(state.currentStep - 1); });
    el("nextBtn").addEventListener("click", function () { if (state.currentStep < STEP_TITLES.length) go(state.currentStep + 1); else toast("Lecția este terminată. Bravo! 🏆"); });
    el("resetBtn").addEventListener("click", reset);
    window.addEventListener("online", network); window.addEventListener("offline", network); network();
    render(Math.max(1, Math.min(STEP_TITLES.length, state.currentStep || 1)));
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(function () {});
  }
  document.addEventListener("DOMContentLoaded", init);
})();

