(() => {
  "use strict";

  const STORAGE_KEY = "after-school-lectia-1-v1";
  const steps = ["welcome", "quiz", "ideas", "detective", "mix", "crazy"];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const storyParagraphs = [
    "Într-o după-amiază, Luca stătea în fața tabletei și încerca să scrie o poveste.",
    "Se gândea:",
    "— Despre ce să scriu?",
    "A încercat:",
    "— Un copil merge la școală.",
    "A șters.",
    "— Un câine aleargă în parc.",
    "A șters din nou.",
    "— Nu am nicio idee! oftă Luca.",
    "În acel moment, ecranul tabletei a început să strălucească.",
    "✨ Puf! ✨",
    "Din ecran a ieșit o creatură mică, cu o pălărie uriașă și buzunare pline cu bilețele colorate.",
    "— Bună! Eu sunt Ideea!",
    "— Ideea? întrebă Luca.",
    "— Exact! Și am o veste pentru tine: ideile sunt peste tot!",
    "Creatura a scos primul bilețel.",
    "🐱 O pisică",
    "— O pisică? întrebă Luca. Asta nu este o poveste!",
    "— Ai răbdare!",
    "A scos al doilea bilețel.",
    "🚀 O navă spațială",
    "Apoi al treilea.",
    "🔑 O cheie misterioasă",
    "Creatura a bătut din palme.",
    "Dintr-o dată, cele trei lucruri s-au combinat:",
    "O pisică găsește o cheie misterioasă într-o navă spațială.",
    "— Acum avem o idee! spuse ea.",
    "Luca a zâmbit.",
    "— Dar putem inventa și mai mult!",
    "— Exact! spuse Ideea. Poți porni de la orice: o întâmplare, un vis, un loc, un obiect, un personaj sau chiar de la întrebarea:",
    "„Ce-ar fi dacă...?”",
    "Luca se gândi puțin.",
    "— Ce-ar fi dacă pisica ar descoperi că cheia poate deschide o ușă către o altă planetă?",
    "Ideea începu să sară de bucurie.",
    "— Acum ai început cu adevărat să scrii o poveste!",
    "Luca deschise o pagină nouă și scrise:",
    "„Într-o noapte, o pisică pe nume Luna a găsit o cheie strălucitoare într-o navă spațială abandonată...”",
    "Și, din acel moment, ideile au început să curgă."
  ];

  const quizQuestions = [
    { prompt: "Ce încerca Luca să facă?", options: ["Să deseneze o pisică", "Să scrie o poveste", "Să construiască o navă spațială"], answer: 1 },
    { prompt: "Ce a apărut din tableta lui Luca?", options: ["Un dragon", "O creatură numită Ideea", "Un profesor"], answer: 1 },
    { prompt: "Ce avea creatura în buzunare?", options: ["Bomboane", "Creioane", "Bilețele cu idei"], answer: 2 },
    { prompt: "Ce trei lucruri a combinat Ideea?", options: ["O pisică, o navă spațială și o cheie misterioasă", "Un dragon, un castel și o coroană", "Un copil, o școală și un ghiozdan"], answer: 0 },
    { prompt: "De unde pot apărea ideile pentru o poveste?", options: ["Doar din cărți", "Din întâmplări, vise, personaje, locuri, obiecte și imaginație", "Doar de la profesori"], answer: 1 },
    { prompt: "Ce întrebare l-a ajutat pe Luca să dezvolte ideea?", options: ["„Unde mergem?”", "„Ce-ar fi dacă...?”", "„Cât durează?”"], answer: 1 },
    { prompt: "Ce a descoperit Luca?", options: ["Că poveștile trebuie copiate din cărți", "Că o idee simplă poate deveni o poveste prin imaginație", "Că toate poveștile trebuie să fie foarte lungi"], answer: 1 }
  ];

  const inspirationChoices = [
    { id: "dream", label: "Un vis", correct: true },
    { id: "true-event", label: "O întâmplare adevărată", correct: true },
    { id: "interesting-place", label: "Un loc interesant", correct: true },
    { id: "invented-character", label: "Un personaj inventat", correct: true },
    { id: "ordinary-object", label: "Un obiect obișnuit", correct: true },
    { id: "what-if", label: "O întrebare „Ce-ar fi dacă...?”", correct: true },
    { id: "imagination", label: "Imaginația", correct: true },
    { id: "only-books", label: "Doar cărțile", correct: false }
  ];

  const detectiveCases = [
    { prompt: "Situația 1", text: "Care propoziție ascunde cel mai bine o întrebare?", options: ["„Maria are 9 ani.”", "„Maria merge la școală.”", "„Maria găsește în ghiozdan o scrisoare pe care nu a pus-o nimeni acolo.”"], answer: 2 },
    { prompt: "Situația 2", text: "Care propoziție te face curios?", options: ["„Un câine este maro.”", "„Un câine descoperă că poate înțelege toate limbile oamenilor.”", "„Un câine are patru picioare.”"], answer: 1 },
    { prompt: "Situația 3", text: "Care propoziție deschide o aventură?", options: ["„Era o pădure.”", "„În pădure erau mulți copaci.”", "„În fiecare noapte, copacii din pădure își schimbau locul.”"], answer: 2 }
  ];

  const mixOptions = {
    character: ["O pisică detectiv", "Un roboțel curios", "O fetiță aventurieră", "Un dragon timid", "Un pirat", "O vulpe vorbitoare", "Un extraterestru", "Un magician"],
    place: ["O pădure misterioasă", "O școală", "O navă spațială", "Un castel medieval", "Fundul oceanului", "O lume de bomboane", "Un oraș futurist", "O insulă pustie"],
    situation: ["Găsește o cheie misterioasă", "Pierde ceva important", "Descoperă o ușă secretă", "Primește o hartă magică", "Întâlnește un personaj misterios", "Găsește un obiect care vorbește", "Se trezește într-o altă lume", "Primește o misiune secretă"]
  };

  const crazyOptions = ["🐧 Pinguin", "🚀 Rachetă", "🍕 Pizza", "👑 Coroană", "🐙 Caracatiță", "🎒 Ghiozdan", "🌋 Vulcan", "🧁 Brioșă", "🤖 Robot", "🌈 Curcubeu"];

  const defaultState = {
    quiz: Array(quizQuestions.length).fill(null),
    ideas: [],
    detective: Array(detectiveCases.length).fill(null),
    mix: { character: 0, place: 0, situation: 0, continuation: "" },
    crazy: { selected: [], continuation: "" },
    feedback: { quiz: "", ideas: "", detective: "", crazy: "" }
  };

  function cloneDefaults() {
    return JSON.parse(JSON.stringify(defaultState));
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved) return cloneDefaults();
      return {
        ...cloneDefaults(),
        ...saved,
        quiz: Array.isArray(saved.quiz) ? saved.quiz.slice(0, quizQuestions.length) : cloneDefaults().quiz,
        ideas: Array.isArray(saved.ideas) ? saved.ideas : [],
        detective: Array.isArray(saved.detective) ? saved.detective.slice(0, detectiveCases.length) : cloneDefaults().detective,
        mix: { ...cloneDefaults().mix, ...(saved.mix || {}) },
        crazy: { ...cloneDefaults().crazy, ...(saved.crazy || {}) },
        feedback: { ...cloneDefaults().feedback, ...(saved.feedback || {}) }
      };
    } catch (_) {
      return cloneDefaults();
    }
  }

  let state = loadState();

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* private browsing can disable storage */ }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  }

  function renderStory() {
    const story = $("#story");
    story.innerHTML = storyParagraphs.map((text, index) => {
      const classes = [];
      if (/^—/.test(text)) classes.push("story-dialogue");
      if (/✨|🐱|🚀|🔑/.test(text)) classes.push("story-emphasis");
      if (/„|O pisică găsește/.test(text)) classes.push("story-quote");
      return `<p class="${classes.join(" ")}">${escapeHtml(text)}</p>`;
    }).join("");
  }

  function renderQuiz() {
    $("#quizList").innerHTML = quizQuestions.map((question, qIndex) => `
      <div class="question-card">
        <fieldset>
          <legend>${qIndex + 1}. ${escapeHtml(question.prompt)}</legend>
          <div class="option-list">
            ${question.options.map((option, optionIndex) => `
              <label class="choice">
                <input type="radio" name="quiz-${qIndex}" value="${optionIndex}" ${state.quiz[qIndex] === optionIndex ? "checked" : ""}>
                <span class="choice-text">${String.fromCharCode(97 + optionIndex)}) ${escapeHtml(option)}</span>
              </label>`).join("")}
          </div>
        </fieldset>
      </div>`).join("");
    renderFeedback("#quizFeedback", state.feedback.quiz);
  }

  function renderIdeas() {
    $("#ideasChoices").innerHTML = inspirationChoices.map((choice) => `
      <label class="choice">
        <input type="checkbox" value="${choice.id}" ${state.ideas.includes(choice.id) ? "checked" : ""}>
        <span class="choice-text">${escapeHtml(choice.label)}</span>
      </label>`).join("");
    renderFeedback("#ideasFeedback", state.feedback.ideas);
  }

  function renderDetective() {
    $("#detectiveList").innerHTML = detectiveCases.map((item, caseIndex) => `
      <div class="question-card">
        <fieldset>
          <legend>${escapeHtml(item.prompt)} <span class="legend-subtitle">${escapeHtml(item.text)}</span></legend>
          <div class="option-list">
            ${item.options.map((option, optionIndex) => `
              <label class="choice">
                <input type="radio" name="detective-${caseIndex}" value="${optionIndex}" ${state.detective[caseIndex] === optionIndex ? "checked" : ""}>
                <span class="choice-text">${String.fromCharCode(97 + optionIndex)}) ${escapeHtml(option)}</span>
              </label>`).join("")}
          </div>
        </fieldset>
      </div>`).join("");
    renderFeedback("#detectiveFeedback", state.feedback.detective);
  }

  function fillSelect(select, values, selectedIndex) {
    select.innerHTML = values.map((value, index) => `<option value="${index}" ${index === Number(selectedIndex) ? "selected" : ""}>${escapeHtml(value)}</option>`).join("");
  }

  function renderMix() {
    fillSelect($("#mixCharacter"), mixOptions.character, state.mix.character);
    fillSelect($("#mixPlace"), mixOptions.place, state.mix.place);
    fillSelect($("#mixSituation"), mixOptions.situation, state.mix.situation);
    $("#mixContinuation").value = state.mix.continuation || "";
    if (state.mix.result) {
      $("#mixResult").innerHTML = `<span class="result-label">${escapeHtml(state.mix.result)}</span>`;
    }
  }

  function renderCrazy() {
    $("#crazyChoices").innerHTML = crazyOptions.map((label, index) => `
      <button class="chip ${state.crazy.selected.includes(index) ? "is-selected" : ""}" type="button" data-crazy-index="${index}" aria-pressed="${state.crazy.selected.includes(index)}">${escapeHtml(label)}</button>`).join("");
    const count = state.crazy.selected.length;
    $("#crazyCount").textContent = `Ai ales ${count} din 2.`;
    $("#crazyContinuation").value = state.crazy.continuation || "";
    if (count === 2) {
      const [first, second] = state.crazy.selected.map((index) => crazyOptions[index]);
      $("#crazyResult").innerHTML = `<span class="result-label">${escapeHtml(first)} + ${escapeHtml(second)}<br>Ce aventură începe când se întâlnesc?</span>`;
    } else {
      $("#crazyResult").innerHTML = `<span class="result-label">Alege două elemente ca să începi.</span>`;
    }
    renderFeedback("#crazyFeedback", state.feedback.crazy);
  }

  function renderFeedback(selector, message) {
    const target = $(selector);
    if (!target) return;
    target.className = "feedback";
    target.textContent = "";
    if (!message) return;
    target.textContent = message.text;
    target.classList.add(message.type === "success" ? "success" : "error");
  }

  function updateProgress(step) {
    const index = Math.max(0, steps.indexOf(step));
    const current = index + 1;
    $("#progressText").textContent = `Pasul ${current} din ${steps.length}`;
    $("#progressFill").style.width = `${(current / steps.length) * 100}%`;
    $(".progress-track").setAttribute("aria-valuenow", String(current));
  }

  function showStep(step, push = true) {
    if (!steps.includes(step)) step = "welcome";
    $$('[data-step-panel]').forEach((panel) => {
      const active = panel.dataset.stepPanel === step;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    $$(".step-link").forEach((link) => {
      const active = link.dataset.step === step;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "step"); else link.removeAttribute("aria-current");
    });
    updateProgress(step);
    if (push) history.pushState({ step }, "", `${location.pathname}?step=${encodeURIComponent(step)}`);
    const heading = $(`[data-step-panel="${step}"] h2`);
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      window.setTimeout(() => heading.focus({ preventScroll: true }), 0);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function checkQuiz() {
    const unanswered = state.quiz.filter((answer) => answer === null || answer === undefined).length;
    if (unanswered) {
      state.feedback.quiz = { type: "error", text: `Mai ai ${unanswered} ${unanswered === 1 ? "întrebare" : "întrebări"} fără răspuns.` };
      renderFeedback("#quizFeedback", state.feedback.quiz);
      saveState();
      return;
    }
    const score = state.quiz.reduce((sum, answer, index) => sum + (Number(answer) === quizQuestions[index].answer ? 1 : 0), 0);
    const text = score === quizQuestions.length
      ? "🎉 Perfect! Ai urmărit fiecare indiciu din poveste."
      : `Ai ${score} din ${quizQuestions.length} răspunsuri corecte. Recitește povestea și mai încearcă!`;
    state.feedback.quiz = { type: score === quizQuestions.length ? "success" : "error", text };
    renderFeedback("#quizFeedback", state.feedback.quiz);
    saveState();
  }

  function checkIdeas() {
    const selected = new Set(state.ideas);
    const correct = inspirationChoices.filter((choice) => choice.correct).map((choice) => choice.id);
    const isCorrect = selected.size === correct.length && correct.every((id) => selected.has(id));
    state.feedback.ideas = isCorrect
      ? { type: "success", text: "🎉 Bravo! Ai descoperit că ideile pot apărea aproape oriunde!" }
      : { type: "error", text: "Mai caută: toate sursele de inspirație sunt bune, dar „Doar cărțile” nu este singura posibilitate." };
    renderFeedback("#ideasFeedback", state.feedback.ideas);
    saveState();
  }

  function checkDetective() {
    const unanswered = state.detective.filter((answer) => answer === null || answer === undefined).length;
    if (unanswered) {
      state.feedback.detective = { type: "error", text: `Alege un răspuns în fiecare situație (${unanswered} lipsesc).` };
    } else {
      const score = state.detective.reduce((sum, answer, index) => sum + (Number(answer) === detectiveCases[index].answer ? 1 : 0), 0);
      state.feedback.detective = score === detectiveCases.length
        ? { type: "success", text: "🕵️ Ai ochi de detectiv! O idee bună ne face să vrem să aflăm ce se întâmplă mai departe." }
        : { type: "error", text: `Ai găsit ${score} din ${detectiveCases.length}. Caută propoziția care deschide cea mai mare întrebare.` };
    }
    renderFeedback("#detectiveFeedback", state.feedback.detective);
    saveState();
  }

  function createIdea() {
    const character = mixOptions.character[Number(state.mix.character)];
    const place = mixOptions.place[Number(state.mix.place)];
    const situation = mixOptions.situation[Number(state.mix.situation)];
    state.mix.result = `${character} ${situation.charAt(0).toLowerCase()}${situation.slice(1)} în ${place.toLowerCase()}.`;
    $("#mixResult").innerHTML = `<span class="result-label">${escapeHtml(state.mix.result)}</span>`;
    saveState();
  }

  function bindEvents() {
    $$(".step-link").forEach((button) => button.addEventListener("click", () => showStep(button.dataset.step)));
    $$('[data-next]').forEach((button) => button.addEventListener("click", () => showStep(button.dataset.next)));
    window.addEventListener("popstate", (event) => showStep(event.state?.step || new URLSearchParams(location.search).get("step") || "welcome", false));

    $("#quizList").addEventListener("change", (event) => {
      if (!event.target.matches("input[type=radio]")) return;
      const index = Number(event.target.name.replace("quiz-", ""));
      state.quiz[index] = Number(event.target.value);
      saveState();
    });
    $("#quizForm").addEventListener("submit", (event) => { event.preventDefault(); checkQuiz(); });
    $("#resetQuiz").addEventListener("click", () => {
      state.quiz = Array(quizQuestions.length).fill(null);
      state.feedback.quiz = "";
      renderQuiz();
      saveState();
    });

    $("#ideasChoices").addEventListener("change", (event) => {
      if (!event.target.matches("input[type=checkbox]")) return;
      state.ideas = $$("#ideasChoices input:checked").map((input) => input.value);
      saveState();
    });
    $("#checkIdeas").addEventListener("click", checkIdeas);
    $("#clearIdeas").addEventListener("click", () => { state.ideas = []; state.feedback.ideas = ""; renderIdeas(); saveState(); });

    $("#detectiveList").addEventListener("change", (event) => {
      if (!event.target.matches("input[type=radio]")) return;
      const index = Number(event.target.name.replace("detective-", ""));
      state.detective[index] = Number(event.target.value);
      saveState();
    });
    $("#detectiveForm").addEventListener("submit", (event) => { event.preventDefault(); checkDetective(); });

    ["mixCharacter", "mixPlace", "mixSituation"].forEach((id, index) => {
      $(`#${id}`).addEventListener("change", (event) => { state.mix[["character", "place", "situation"][index]] = Number(event.target.value); saveState(); });
    });
    $("#createIdea").addEventListener("click", createIdea);
    $("#mixContinuation").addEventListener("input", (event) => { state.mix.continuation = event.target.value; saveState(); });

    $("#crazyChoices").addEventListener("click", (event) => {
      const chip = event.target.closest("[data-crazy-index]");
      if (!chip) return;
      const index = Number(chip.dataset.crazyIndex);
      const selected = new Set(state.crazy.selected);
      if (selected.has(index)) selected.delete(index);
      else if (selected.size < 2) selected.add(index);
      else state.feedback.crazy = { type: "error", text: "Alege exact două elemente. Scoate unul dacă vrei să schimbi combinația." };
      state.crazy.selected = [...selected];
      if (state.crazy.selected.length === 2) state.feedback.crazy = "";
      renderCrazy();
      saveState();
    });
    $("#crazyContinuation").addEventListener("input", (event) => { state.crazy.continuation = event.target.value; saveState(); });
    $("#resetAll").addEventListener("click", () => {
      if (!window.confirm("Sigur vrei să ștergi răspunsurile de pe această tabletă?")) return;
      state = cloneDefaults();
      renderAll();
      saveState();
      showStep("welcome");
    });
  }

  function renderAll() {
    renderStory();
    renderQuiz();
    renderIdeas();
    renderDetective();
    renderMix();
    renderCrazy();
  }

  function setupInstallPrompt() {
    const installBtn = $("#installBtn");
    const hint = $("#installHint");
    let deferredPrompt = null;
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredPrompt = event;
      installBtn.hidden = false;
      hint.hidden = true;
    });
    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.hidden = true;
    });
    window.addEventListener("appinstalled", () => { installBtn.hidden = true; });
    if (!window.matchMedia("(display-mode: standalone)").matches) hint.hidden = false;
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  renderAll();
  const storyNext = document.querySelector('[data-step-panel="welcome"] [data-next]');
  if (storyNext) storyNext.addEventListener("click", () => { try { localStorage.setItem("after-school-lectia-1-story", "read"); } catch (_) {} });
  bindEvents();
  setupInstallPrompt();
  registerServiceWorker();
  const initialStep = new URLSearchParams(location.search).get("step");
  showStep(steps.includes(initialStep) ? initialStep : "welcome", false);
})();

