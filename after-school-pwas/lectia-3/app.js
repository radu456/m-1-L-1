(function () {
  "use strict";

  var LESSON_ID = 3;
  var STORAGE_KEY = "after-school-lesson-3-v1";
  var STEP_TITLES = [
    "Povestea și înțelegerea",
    "Alege decorul",
    "Real sau fantastic?",
    "Când are loc aventura?",
    "Ce vede, aude și simte?",
    "Decorul trăsnit",
    "Detectivul decorului",
    "Construim decorul",
    "Descrie lumea ta",
    "Misiunea autorului"
  ];
  var state = loadState();
  var selectedDrag = null;
  var toastTimer = null;

  var quizQuestions = [
    { text: "Unde se afla personajul?", options: ["Într-un castel", "Într-o pădure", "Pe o plajă", "Într-un oraș"], answer: 1 },
    { text: "Când se întâmpla aventura?", options: ["Dimineața", "La prânz", "Aproape seara", "În mijlocul nopții"], answer: 2 },
    { text: "Ce a găsit personajul?", options: ["O comoară", "Un dragon", "O ușă albastră între doi copaci", "O casă"], answer: 2 },
    { text: "Cum era atmosfera din pădure?", options: ["Gălăgioasă și agitată", "Liniștită și misterioasă", "Foarte veselă", "Foarte aglomerată"], answer: 1 },
    { text: "Ce poate face un loc mai interesant într-o poveste?", options: ["Doar numele locului", "Detaliile despre ceea ce vedem, auzim sau simțim", "Numărul personajelor", "Lungimea poveștii"], answer: 1 }
  ];

  var sortItems = [
    { id: "school", label: "O școală", zone: "real" },
    { id: "park", label: "Un parc", zone: "real" },
    { id: "house", label: "O casă", zone: "real" },
    { id: "city", label: "Un oraș", zone: "real" },
    { id: "forest", label: "O pădure", zone: "real" },
    { id: "beach", label: "O plajă", zone: "real" },
    { id: "museum", label: "Un muzeu", zone: "real" },
    { id: "village", label: "Un sat", zone: "real" },
    { id: "floating-castle", label: "Un castel plutitor", zone: "fantastic" },
    { id: "robot-planet", label: "O planetă a roboților", zone: "fantastic" },
    { id: "underwater-city", label: "Un oraș sub apă", zone: "fantastic" },
    { id: "talking-forest", label: "O pădure în care copacii vorbesc", zone: "fantastic" },
    { id: "dragon-school", label: "O școală pentru dragoni", zone: "fantastic" },
    { id: "moving-island", label: "O insulă care se mută", zone: "fantastic" },
    { id: "magic-lab", label: "Un laborator de magie", zone: "fantastic" },
    { id: "cloud-land", label: "Un tărâm al norilor", zone: "fantastic" }
  ];

  var sensory = {
    see: ["Copaci uriași", "Lumini ciudate", "O ușă misterioasă", "Animale", "Un castel", "Urme pe pământ", "Un obiect strălucitor", "O persoană necunoscută"],
    hear: ["Vântul", "Pași", "O voce", "Păsări", "Muzică", "Un zgomot ciudat", "Apă", "Un șuierat", "Liniște"],
    feel: ["Curiozitate", "Bucurie", "Teamă", "Entuziasm", "Neliniște", "Uimire", "Curaj", "Tristețe", "Nerăbdare"]
  };

  function el(id) { return document.getElementById(id); }
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeParse(raw) {
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  function loadState() {
    var blank = { currentStep: 1, fields: {}, quiz: {}, scores: {}, drags: {}, dragFeedback: {}, multiFeedback: {}, complete: false };
    try {
      var parsed = safeParse(localStorage.getItem(STORAGE_KEY) || "");
      if (!parsed || typeof parsed !== "object") return blank;
      return {
        currentStep: Number(parsed.currentStep) || 1,
        fields: parsed.fields || {},
        quiz: parsed.quiz || {},
        scores: parsed.scores || {},
        drags: parsed.drags || {},
        dragFeedback: parsed.dragFeedback || {},
        multiFeedback: parsed.multiFeedback || {},
        complete: !!parsed.complete
      };
    } catch (e) { return blank; }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function showToast(message) {
    var node = el("toast");
    if (!node) return;
    node.textContent = message || "";
    clearTimeout(toastTimer);
    if (message) toastTimer = setTimeout(function () { node.textContent = ""; }, 3200);
  }
  function fieldValue(key) { return state.fields[key] == null ? "" : state.fields[key]; }
  function priorValue(keys) {
    try {
      for (var i = 0; i < localStorage.length; i += 1) {
        var key = localStorage.key(i) || "";
        if (key === STORAGE_KEY || key.indexOf("after-school-lesson-") !== 0) continue;
        var parsed = safeParse(localStorage.getItem(key) || "");
        var fields = parsed && parsed.fields ? parsed.fields : parsed;
        if (!fields) continue;
        for (var j = 0; j < keys.length; j += 1) {
          if (fields[keys[j]]) return fields[keys[j]];
        }
      }
    } catch (e) {}
    return "";
  }
  function heading(kicker, title, emoji) {
    return "<div class=\"step-heading\"><div class=\"emoji\" aria-hidden=\"true\">" + emoji + "</div><div><p class=\"step-kicker\">" + kicker + "</p><h2>" + title + "</h2></div></div>";
  }
  function cardStart(kicker, title, emoji) { return "<article class=\"step-card\">" + heading(kicker, title, emoji); }
  function cardEnd() { return "</article>"; }
  function choice(name, value, label, type, checked, field, max) {
    var attrs = " type=\"" + (type || "radio") + "\" name=\"" + name + "\" value=\"" + esc(value) + "\"";
    if (field) attrs += " data-field=\"" + field + "\"";
    if (max) attrs += " data-max=\"" + max + "\"";
    if (checked) attrs += " checked";
    return "<label class=\"choice\"><input" + attrs + "><span>" + label + "</span></label>";
  }
  function field(id, label, value, multiline, full, hint) {
    var tag = multiline ? "textarea" : "input";
    var extra = multiline ? "" : " type=\"text\"";
    return "<div class=\"field" + (full ? " full" : "") + "\"><label for=\"" + id + "\">" + label + "</label><" + tag + " id=\"" + id + "\" data-field=\"" + id + "\"" + extra + ">" + (multiline ? esc(value) : "") + "</" + tag + ">" + (hint ? "<small>" + hint + "</small>" : "") + "</div>";
  }
  function checkboxGroup(id, options, max, legend) {
    var selected = Array.isArray(fieldValue(id)) ? fieldValue(id) : [];
    var html = "<fieldset class=\"question-card\"><legend>" + legend + (max ? " <span class=\"score\">(maximum " + max + ")</span>" : "") + "</legend><div class=\"choice-grid\">";
    options.forEach(function (option) { html += choice(id, option, option, "checkbox", selected.indexOf(option) >= 0, id, max); });
    return html + "</div></fieldset>";
  }
  function renderQuiz(id, questions) {
    var saved = state.quiz[id] || [];
    var html = "<div class=\"question-list\">";
    questions.forEach(function (question, qi) {
      html += "<fieldset class=\"question-card\"><legend>" + (qi + 1) + ". " + question.text + "</legend><div class=\"choice-grid\">";
      question.options.forEach(function (option, oi) {
        html += "<label class=\"choice\"><input type=\"radio\" name=\"" + id + "-q" + qi + "\" value=\"" + oi + "\" data-quiz-id=\"" + id + "\" data-q-index=\"" + qi + "\"" + (String(saved[qi]) === String(oi) ? " checked" : "") + "><span>" + option + "</span></label>";
      });
      html += "</div></fieldset>";
    });
    html += "</div><div class=\"action-row\"><button class=\"secondary-button\" type=\"button\" data-action=\"check-quiz\" data-id=\"" + id + "\">Verifică răspunsurile</button>";
    if (state.scores[id] != null) {
      var score = state.scores[id];
      html += "<div class=\"feedback " + (score === questions.length ? "" : "neutral") + "\" role=\"status\">" + (score === questions.length ? "Excelent! Ai înțeles povestea. 🌟" : "Bună încercare! Recitește scena și mai verifică o dată.") + " <span class=\"score\">" + score + "/" + questions.length + "</span></div>";
    }
    return html + "</div>";
  }
  function renderDragBoard(group, items, zones, instruction) {
    var assigned = state.drags[group] || {};
    var html = "<p class=\"tip\"><strong>Joacă-te:</strong> " + instruction + " Poți trage cu degetul sau poți atinge un cartonaș, apoi categoria.</p><div class=\"drag-board\">";
    zones.forEach(function (zone) {
      html += "<section class=\"drag-column\" data-drop-group=\"" + group + "\" data-drop-zone=\"" + zone.id + "\" data-zone=\"" + zone.id + "\" tabindex=\"0\"><h3>" + zone.title + "</h3><p class=\"drop-hint\">Atinge aici pentru a-l pune în categorie.</p><div class=\"drag-tray\">";
      items.forEach(function (item) {
        if (assigned[item.id] === zone.id) html += dragChip(group, item, true);
      });
      html += "</div></section>";
    });
    html += "<section class=\"drag-column\" data-drop-group=\"" + group + "\" data-drop-zone=\"tray\" data-zone=\"tray\" tabindex=\"0\"><h3>Cartonașe rămase</h3><p class=\"drop-hint\">Aici se întorc cartonașele.</p><div class=\"drag-tray\">";
    items.forEach(function (item) {
      if (!assigned[item.id] || assigned[item.id] === "tray") html += dragChip(group, item, false);
    });
    html += "</div></section></div>";
    return html;
  }
  function dragChip(group, item, assigned) {
    return "<button class=\"drag-chip" + (assigned ? " assigned" : "") + "\" type=\"button\" draggable=\"true\" data-drag-group=\"" + group + "\" data-drag-id=\"" + item.id + "\" aria-label=\"" + esc(item.label) + "\">" + item.label + "</button>";
  }
  function renderStep3() {
    return cardStart("Pasul 3", "Real sau fantastic?", "🔍") +
      "<p>Unele locuri seamănă cu lumea noastră. Altele ne lasă să inventăm orice. Sortează fiecare loc.</p>" +
      renderDragBoard("decor-sort", sortItems, [{ id: "real", title: "🏠 Decor real" }, { id: "fantastic", title: "🪄 Decor fantastic" }], "Alege locul potrivit.") +
      "<div class=\"action-row\"><button class=\"secondary-button\" type=\"button\" data-action=\"check-drag\" data-id=\"decor-sort\">Verifică sortarea</button>" +
      (state.dragFeedback["decor-sort"] ? "<div class=\"feedback\" role=\"status\">" + state.dragFeedback["decor-sort"] + "</div>" : "") + "</div>" + cardEnd();
  }
  function renderStep(index) {
    var html = "";
    if (index === 1) {
      html = cardStart("Pasul 1", "Povestea: Ușa care nu era acolo", "🌟") +
        "<div class=\"story\"><p>Personajul creat de tine mergea printr-un loc pe care îl cunoștea bine. Era aproape seară când, deodată, observă ceva ciudat.</p><p>În mijlocul unei păduri apăru o ușă albastră, prinsă între doi copaci. În jur era liniște. Frunzele se mișcau ușor, iar dincolo de ușă se auzea un sunet misterios.</p><p>— Oare unde duce? se întrebă el.</p><p>Puse mâna pe clanță. Și atunci ușa începu să strălucească...</p></div><p class=\"tip\"><strong>Ideea-cheie:</strong> un loc, un moment al zilei și atmosfera pot transforma complet o poveste.</p><h3>Înțelegerea poveștii</h3>" +
        renderQuiz("story3", quizQuestions) + cardEnd();
    } else if (index === 2) {
      var decor = ["O pădure misterioasă", "Un castel vechi", "O insulă pustie", "Un oraș aglomerat", "O școală", "O casă abandonată", "Un laborator secret", "O navă spațială", "O lume sub apă", "Un tărâm magic", "O planetă necunoscută", "Un sat ascuns în munți"];
      html = cardStart("Pasul 2", "Unde începe aventura?", "🎮") + "<p>Alege un singur loc pentru povestea ta. Nu există un răspuns greșit: un autor poate transforma orice loc într-un loc interesant.</p><div class=\"choice-grid\">";
      decor.forEach(function (item) { html += choice("decor", item, item, "radio", fieldValue("decor") === item, "decor"); });
      html += "</div><div class=\"action-row\"><div class=\"feedback\" role=\"status\">Ai ales lumea în care va începe aventura! 🌍</div></div>" + cardEnd();
    } else if (index === 3) {
      html = renderStep3();
    } else if (index === 4) {
      var moments = ["Dimineața", "La prânz", "După-amiaza", "La apus", "Seara", "În mijlocul nopții", "În timpul unei furtuni", "Într-o noapte cu lună plină", "Într-o dimineață de iarnă"];
      html = cardStart("Pasul 4", "Când are loc aventura?", "☀️🌙") + "<p>Alege momentul care se potrivește cu atmosfera pe care o dorești.</p><div class=\"choice-grid\">";
      moments.forEach(function (item) { html += choice("moment", item, item, "radio", fieldValue("moment") === item, "moment"); });
      html += "</div><div class=\"field-grid\" style=\"margin-top:16px\">" + field("momentReason", "De ce ai ales acest moment?", fieldValue("momentReason"), true, true, "Exemplu: Am ales noaptea pentru că vreau ca povestea să fie misterioasă.") + "</div>" + cardEnd();
    } else if (index === 5) {
      html = cardStart("Pasul 5", "Privește lumea prin ochii personajului", "👀") + "<p>Imaginează-ți că personajul tău se află în locul ales. Alege cel mult 3 idei din fiecare categorie.</p>" +
        checkboxGroup("see", sensory.see, 3, "👁️ Ce vede?") + checkboxGroup("hear", sensory.hear, 3, "👂 Ce aude?") + checkboxGroup("feel", sensory.feel, 3, "❤️ Ce simte?") +
        "<div class=\"feedback\" role=\"status\">Excelent! Ai început să construiești o lume pe care cititorul o poate vedea, auzi și simți.</div>" + cardEnd();
    } else if (index === 6) {
      html = cardStart("Pasul 6", "Decorul trăsnit", "🎨") + "<p>Alege un decor și adaugă un element surprinzător. Uneori cele mai bune idei apar când punem împreună două lucruri care nu par să se potrivească.</p><div class=\"field-grid\">" +
        field("wildPlace", "Decorul meu este", fieldValue("wildPlace"), false, false, "Exemplu: o pădure") +
        field("surprise", "Elementul surprinzător este", fieldValue("surprise"), false, false, "Exemplu: o rachetă") +
        field("surpriseEvent", "Ce se întâmplă când apare?", fieldValue("surpriseEvent"), true, true) + "</div><div class=\"tip\">🌳 Pădure + 🚀 rachetă · 🏰 Castel + 🤖 robot · 🏫 Școală + 🐉 dragon</div>" + cardEnd();
    } else if (index === 7) {
      var details = ["Culoarea frunzelor", "Un sunet", "O urmă misterioasă", "Mirosul pădurii", "O lumină ciudată", "Nimic – descrierea este deja perfectă"];
      html = cardStart("Pasul 7", "Detectivul decorului", "🕵️") + "<p><strong>Descriere:</strong> „Personajul intră într-o pădure. Sunt mulți copaci. Merge înainte și vede o ușă.”</p><p>Ce am putea adăuga ca pădurea să fie mai interesantă? Alege primele 5 idei.</p>" +
        checkboxGroup("missingDetails", details, 5, "Detalii care pot îmbogăți scena") +
        "<div class=\"action-row\"><button class=\"secondary-button\" type=\"button\" data-action=\"check-multi\" data-id=\"missingDetails\">Verifică ideile</button>" +
        (state.multiFeedback.missingDetails ? "<div class=\"feedback\" role=\"status\">" + state.multiFeedback.missingDetails + "</div>" : "") + "</div>" + cardEnd();
    } else if (index === 8) {
      var name = fieldValue("characterName") || priorValue(["characterName", "name", "personaj", "nume"]) || "";
      html = cardStart("Pasul 8", "Construim decorul personajului meu", "✍️") + "<p>Acum folosești personajul creat în Lecția 2 și îl trimiți într-o lume nouă.</p><div class=\"field-grid\">" +
        field("characterName", "Personajul tău se numește", name, false, false) +
        field("buildPlace", "Unde îl trimiți?", fieldValue("buildPlace"), false, false) +
        field("buildMoment", "Când începe aventura?", fieldValue("buildMoment"), false, false) +
        field("buildSee", "Ce vede?", fieldValue("buildSee"), true, false) +
        field("buildHear", "Ce aude?", fieldValue("buildHear"), true, false) +
        field("buildFeel", "Ce simte?", fieldValue("buildFeel"), true, false) + "</div>" + cardEnd();
    } else if (index === 9) {
      html = cardStart("Pasul 9", "Descrie lumea ta", "🌍") + "<p>Scrie 3–5 propoziții despre locul în care începe povestea ta. Poți porni de la aceste începuturi:</p><div class=\"tip\">„Povestea mea începe în...” · „Era...” · „În jur se vedeau...” · „Se auzea...” · „Personajul meu se simțea...”</div>" +
        "<div class=\"field-grid\">" + field("worldDescription", "Povestea mea începe...", fieldValue("worldDescription"), true, true, "Nu există un răspuns unic corect.") + "</div><div class=\"story\"><strong>Exemplu:</strong> Povestea mea începe într-o pădure misterioasă. Era aproape seară. Copacii erau foarte înalți și se auzea vântul printre frunze. Personajul meu era curios, dar puțin speriat.</div>" + cardEnd();
    } else {
      var summary = [
        ["Personaj", fieldValue("characterName") || priorValue(["characterName", "name", "personaj", "nume"]) || "Personajul meu"],
        ["Loc", fieldValue("buildPlace") || fieldValue("decor") || "—"],
        ["Moment", fieldValue("buildMoment") || fieldValue("moment") || "—"],
        ["Lumea", fieldValue("worldDescription") || "Completează descrierea la pasul 9."]
      ];
      html = cardStart("Pasul 10", "Misiunea autorului", "🏆") + "<p>Ai pus împreună locul, timpul și detaliile senzoriale. Privește rezumatul și spune cu voce tare cum începe povestea ta.</p><div class=\"summary-list\">";
      summary.forEach(function (row) { html += "<div class=\"summary-row\"><strong>" + row[0] + "</strong><span>" + esc(row[1]) + "</span></div>"; });
      html += "</div><div class=\"badge-card\"><div class=\"badge\" aria-hidden=\"true\">🏅</div><div><h3>Insigna: Exploratorul decorului</h3><p>Bravo, Autorule! Ai creat o lume pe care cititorul o poate vedea, auzi și simți.</p></div></div>" + cardEnd();
    }
    el("stepHost").innerHTML = html;
    updateChrome(index);
    bindStep();
  }
  function updateChrome(index) {
    var total = STEP_TITLES.length;
    el("stepTitle").textContent = STEP_TITLES[index - 1] || "Pas";
    el("stepCount").textContent = index + " / " + total;
    el("progressBar").style.width = Math.round(index / total * 100) + "%";
    el("prevBtn").disabled = index <= 1;
    el("nextBtn").textContent = index >= total ? "Gata ✓" : "Continuă →";
    if (index >= total) el("nextBtn").setAttribute("aria-label", "Lecția este terminată");
    else el("nextBtn").removeAttribute("aria-label");
    try { history.replaceState(null, "", "./?step=" + index); } catch (e) {}
  }
  function collectFields() {
    var nodes = document.querySelectorAll("#stepHost [data-field]");
    nodes.forEach(function (node) {
      var key = node.getAttribute("data-field");
      if (node.type === "checkbox") {
        var all = document.querySelectorAll("#stepHost input[type=checkbox][data-field=\"" + key + "\"]:checked");
        state.fields[key] = Array.prototype.map.call(all, function (item) { return item.value; });
      } else if (node.type === "radio") {
        if (node.checked) state.fields[key] = node.value;
      } else {
        state.fields[key] = node.value;
      }
    });
    saveState();
  }
  function bindFields() {
    document.querySelectorAll("#stepHost [data-field]").forEach(function (node) {
      var key = node.getAttribute("data-field");
      if (node.type === "checkbox") {
        var selected = Array.isArray(state.fields[key]) ? state.fields[key] : [];
        node.checked = selected.indexOf(node.value) >= 0;
      } else if (node.type === "radio") {
        node.checked = String(state.fields[key] || "") === String(node.value);
      } else if (state.fields[key] != null && node.value !== state.fields[key]) {
        node.value = state.fields[key];
      }
      var eventName = node.type === "text" || node.tagName === "TEXTAREA" ? "input" : "change";
      node.addEventListener(eventName, function () {
        if (node.type === "checkbox") {
          var max = Number(node.getAttribute("data-max") || 0);
          var selectedNodes = document.querySelectorAll("#stepHost input[type=checkbox][data-field=\"" + key + "\"]:checked");
          if (max && selectedNodes.length > max) {
            node.checked = false;
            showToast("Alege cel mult " + max + " variante.");
            return;
          }
        }
        collectFields();
      });
    });
  }
  function checkQuiz(id) {
    var answers = [];
    var score = 0;
    quizQuestions.forEach(function (question, qi) {
      var selected = document.querySelector("#stepHost input[data-quiz-id=\"" + id + "\"][data-q-index=\"" + qi + "\"]:checked");
      answers[qi] = selected ? Number(selected.value) : null;
      if (answers[qi] === question.answer) score += 1;
    });
    state.quiz[id] = answers;
    state.scores[id] = score;
    saveState();
    renderStep(state.currentStep);
    showToast("Am verificat răspunsurile: " + score + "/" + quizQuestions.length + ".");
  }
  function checkMulti(id) {
    var selected = Array.isArray(state.fields[id]) ? state.fields[id] : [];
    var correct = ["Culoarea frunzelor", "Un sunet", "O urmă misterioasă", "Mirosul pădurii", "O lumină ciudată"];
    var good = selected.length === 5 && correct.every(function (item) { return selected.indexOf(item) >= 0; });
    state.multiFeedback[id] = good ? "Exact! 🌟 Detaliile îi permit cititorului să-și imagineze scena." : "Mai încearcă: primele 5 variante sunt detalii utile, nu „Nimic”.";
    saveState();
    renderStep(state.currentStep);
  }
  function checkDrag(group) {
    var assigned = state.drags[group] || {};
    var good = sortItems.every(function (item) { return assigned[item.id] === item.zone; });
    state.dragFeedback[group] = good ? "Perfect! 🌟 Un decor real seamănă cu lumea pe care o cunoaștem, iar unul fantastic ne permite să inventăm aproape orice." : "Unele cartonașe mai au nevoie de o categorie. Mută-le și verifică din nou.";
    saveState();
    renderStep(state.currentStep);
  }
  function parseDragData(text) {
    var parts = String(text || "").split("::");
    return parts.length === 2 ? { group: parts[0], id: parts[1] } : null;
  }
  function assignDrag(group, id, zone) {
    if (!state.drags[group]) state.drags[group] = {};
    state.drags[group][id] = zone === "tray" ? "" : zone;
    selectedDrag = null;
    saveState();
    renderStep(state.currentStep);
  }
  function bindDrag() {
    document.querySelectorAll("#stepHost [data-drag-id]").forEach(function (chip) {
      chip.addEventListener("click", function (event) {
        event.stopPropagation();
        selectedDrag = { group: chip.getAttribute("data-drag-group"), id: chip.getAttribute("data-drag-id") };
        document.querySelectorAll("#stepHost .drag-chip").forEach(function (other) { other.classList.remove("is-selected"); });
        chip.classList.add("is-selected");
        showToast("Acum atinge categoria dorită.");
      });
      chip.addEventListener("dragstart", function (event) {
        var payload = chip.getAttribute("data-drag-group") + "::" + chip.getAttribute("data-drag-id");
        event.dataTransfer.setData("text/plain", payload);
        selectedDrag = parseDragData(payload);
        chip.classList.add("is-selected");
      });
      chip.addEventListener("dragend", function () { chip.classList.remove("is-selected"); });
    });
    document.querySelectorAll("#stepHost [data-drop-group]").forEach(function (zone) {
      zone.addEventListener("click", function () {
        if (selectedDrag && selectedDrag.group === zone.getAttribute("data-drop-group")) assignDrag(selectedDrag.group, selectedDrag.id, zone.getAttribute("data-drop-zone"));
      });
      zone.addEventListener("keydown", function (event) {
        if ((event.key === "Enter" || event.key === " ") && selectedDrag && selectedDrag.group === zone.getAttribute("data-drop-group")) {
          event.preventDefault();
          assignDrag(selectedDrag.group, selectedDrag.id, zone.getAttribute("data-drop-zone"));
        }
      });
      zone.addEventListener("dragover", function (event) { event.preventDefault(); zone.classList.add("is-over"); });
      zone.addEventListener("dragleave", function () { zone.classList.remove("is-over"); });
      zone.addEventListener("drop", function (event) {
        event.preventDefault();
        zone.classList.remove("is-over");
        var payload = parseDragData(event.dataTransfer.getData("text/plain"));
        if (payload && payload.group === zone.getAttribute("data-drop-group")) assignDrag(payload.group, payload.id, zone.getAttribute("data-drop-zone"));
      });
    });
  }
  function bindStep() {
    bindFields();
    bindDrag();
    document.querySelectorAll("#stepHost [data-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-action");
        var id = button.getAttribute("data-id");
        collectFields();
        if (action === "check-quiz") checkQuiz(id);
        if (action === "check-multi") checkMulti(id);
        if (action === "check-drag") checkDrag(id);
      });
    });
  }
  function navigate(next) {
    collectFields();
    state.currentStep = Math.max(1, Math.min(STEP_TITLES.length, next));
    if (state.currentStep === STEP_TITLES.length) state.complete = true;
    saveState();
    renderStep(state.currentStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function updateNetworkBadge() {
    var badge = el("offlineBadge");
    if (!badge) return;
    var online = navigator.onLine !== false;
    badge.textContent = online ? "● Online" : "● Offline";
    badge.classList.toggle("online", online);
    badge.classList.toggle("offline", !online);
  }
  function resetLesson() {
    if (!window.confirm("Ștergi toate răspunsurile acestei lecții?")) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state = loadState();
    showToast("Răspunsurile au fost șterse.");
    renderStep(1);
  }
  function init() {
    var params = new URLSearchParams(window.location.search);
    var fromUrl = Number(params.get("step"));
    if (fromUrl >= 1 && fromUrl <= STEP_TITLES.length) state.currentStep = fromUrl;
    state.currentStep = Math.max(1, Math.min(STEP_TITLES.length, Number(state.currentStep) || 1));
    el("prevBtn").addEventListener("click", function () { navigate(state.currentStep - 1); });
    el("nextBtn").addEventListener("click", function () {
      if (state.currentStep < STEP_TITLES.length) navigate(state.currentStep + 1);
      else showToast("Lecția este terminată. Bravo! 🏆");
    });
    el("resetBtn").addEventListener("click", resetLesson);
    window.addEventListener("online", updateNetworkBadge);
    window.addEventListener("offline", updateNetworkBadge);
    updateNetworkBadge();
    renderStep(state.currentStep);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(function () {});
  }
  document.addEventListener("DOMContentLoaded", init);
})();

