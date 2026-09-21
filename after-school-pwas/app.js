const lessons = [
  { id: 1, icon: "💡", title: "Fabrica de idei", summary: "Descoperă de unde vin ideile și amestecă personaje, locuri și surprize.", accent: "#ffd166" },
  { id: 2, icon: "🤖", title: "Personajul meu", summary: "Construiește un personaj cu trăsături, dorințe, frici și voce proprie.", accent: "#7bdcb5" },
  { id: 3, icon: "🌌", title: "Unde și când", summary: "Alege decorul, momentul și detaliile pe care personajul le vede, aude și simte.", accent: "#9b8cff" },
  { id: 4, icon: "🚪", title: "Ce se întâmplă", summary: "Pornește aventura cu o problemă, o misiune și un obstacol.", accent: "#ef6f6c" },
  { id: 5, icon: "✨", title: "Fă povestea interesantă", summary: "Adaugă descrieri, emoții și dialog ca scena să prindă viață.", accent: "#ffad66" },
  { id: 6, icon: "🧩", title: "Construim povestea", summary: "Pune începutul, aventura, momentul important și finalul în ordine.", accent: "#62c6df" },
  { id: 7, icon: "📖", title: "Povestea mea", summary: "Scrie, verifică și prezintă povestea ta ca un autor adevărat.", accent: "#f28bb4" },
  { id: 8, icon: "🖼️", title: "Povestea din 3 imagini", summary: "Leagă trei imagini aparent diferite într-o aventură proprie.", accent: "#a4cf6b" },
];

const base = new URL(".", window.location.href);
// Fără un număr de pas: fiecare aplicație își poate relua progresul local,
// iar prima deschidere pornește din propriul ecran introductiv.
const lessonUrl = (id) => new URL(`lectia-${id}/`, base).href;
const grid = document.querySelector("#lesson-grid");
const qrSelect = document.querySelector("#qr-lesson");
const qrUrl = document.querySelector("#qr-url");
const qrImage = document.querySelector("#qr-image");
const qrOpen = document.querySelector("#qr-open");
const status = document.querySelector("#save-status");

function setStatus(message) { status.textContent = message; window.clearTimeout(setStatus.timer); setStatus.timer = window.setTimeout(() => { status.textContent = "Pregătit"; }, 2600); }

for (const lesson of lessons) {
  const card = document.createElement("article");
  card.className = "lesson-card";
  card.style.setProperty("--card-accent", lesson.accent);
  card.innerHTML = `<span class="lesson-number" aria-label="Lecția ${lesson.id}">${lesson.id}</span><div class="lesson-icon" aria-hidden="true">${lesson.icon}</div><h3>Lecția ${lesson.id} · ${lesson.title}</h3><p>${lesson.summary}</p><a class="lesson-link" href="${lessonUrl(lesson.id)}">Deschide lecția ${lesson.id}</a>`;
  grid.append(card);
  const option = document.createElement("option");
  option.value = String(lesson.id);
  option.textContent = `Lecția ${lesson.id} · ${lesson.title}`;
  qrSelect.append(option);
}

function refreshQr() {
  const url = lessonUrl(Number(qrSelect.value));
  qrUrl.textContent = url;
  qrOpen.href = url;
  // The image is only a printing aid; the lesson itself remains fully offline after installation.
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=176x176&margin=8&data=${encodeURIComponent(url)}`;
}
qrSelect.addEventListener("change", refreshQr);
refreshQr();

document.querySelector("#copy-index-link").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(window.location.href); setStatus("Link copiat"); }
  catch { setStatus("Selectează și copiază linkul din bara browserului"); }
});

let deferredInstall;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault(); deferredInstall = event;
  const button = document.querySelector("#install-button"); button.hidden = false;
  button.addEventListener("click", async () => { deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; button.hidden = true; }, { once: true });
});

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));

