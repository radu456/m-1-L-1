/* Lecția 7 – Povestea mea. Atelier digital de scriere pentru copii. */
(() => {
  'use strict';

  const STORE = 'after-school:lectia-7:v1';
  const app = document.getElementById('app');
  const steps = [
    { id: 'start', label: 'Astăzi ești autor' },
    { id: 'recap', label: 'Recapitularea poveștii mele' },
    { id: 'checklist', label: 'Am tot ce îmi trebuie?' },
    { id: 'title-read', label: 'Găsește titlul' },
    { id: 'title-create', label: 'Creează titlul tău' },
    { id: 'curious', label: 'Ce titlu te face curios?' },
    { id: 'beginning', label: 'Construim începutul' },
    { id: 'problem', label: 'Problema apare' },
    { id: 'adventure', label: 'Aventura' },
    { id: 'key', label: 'Momentul cel mai important' },
    { id: 'emotion', label: 'Arată ce simte personajul' },
    { id: 'dialogue', label: 'Adaugă un dialog' },
    { id: 'ending', label: 'Scrie finalul' },
    { id: 'detail', label: 'Adaugă un ultim detaliu' },
    { id: 'story', label: 'Acum scrie povestea' },
    { id: 'verify', label: 'Verifică povestea' },
    { id: 'cover', label: 'Creează coperta' },
    { id: 'present', label: 'Prezintă povestea' },
    { id: 'mission', label: 'Eu sunt autor' },
    { id: 'diploma', label: 'Diploma autorului' }
  ];

  const recapDefault = {
    characterName: '', characterType: '', characterTraits: '', characterLikes: '', characterFear: '', characterWish: '',
    setting: '', time: '', atmosphere: '', problem: '', mission: '', obstacle: '', keyMoment: '', solution: '', ending: ''
  };
  const defaultState = {
    current: 0, recap: recapDefault, checklist: {},
    titleType: '', title: '', curious: '', curiousWhy: '', beginning: { who: '', where: '', start: '' },
    problem: { until: '', mission: '' }, adventure: { action: '', obstacle: '', then: '' },
    key: { difficult: '', between: '', chose: '', because: '' }, emotion: '', emotionText: '',
    dialogue: ['', '', ''], ending: { finally: '', solved: '', learned: '' }, detailType: '', detailText: '',
    storyText: '', verify: {}, coverAuthor: '', coverStyle: '', coverElement: '', presentation: { name: '', character: '', happens: '', moment: '', why: '' },
    completed: false
  };
  let state = load();
  let recorder = null;
  let recordingChunks = [];
  let recordingUrl = '';

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const getPath = path => path.split('.').reduce((obj, key) => obj == null ? '' : obj[key], state) ?? '';
  function setPath(path, value) { const parts = path.split('.'); let obj = state; parts.slice(0, -1).forEach(key => { if (!obj[key] || typeof obj[key] !== 'object') obj[key] = {}; obj = obj[key]; }); obj[parts.at(-1)] = value; }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function deepMerge(base, extra) { if (!extra || typeof extra !== 'object') return base; Object.keys(extra).forEach(key => { if (extra[key] && typeof extra[key] === 'object' && !Array.isArray(extra[key]) && base[key] && typeof base[key] === 'object') deepMerge(base[key], extra[key]); else base[key] = extra[key]; }); return base; }
  function load() { try { return deepMerge(clone(defaultState), JSON.parse(localStorage.getItem(STORE) || 'null') || {}); } catch (_) { return clone(defaultState); } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (_) {} }
  function answer(group, value) { return getPath(group) === value; }
  function checked(path) { return getPath(path) === true; }
  function progress() { return Math.round(((state.current + 1) / steps.length) * 100); }
  function resolveStep(raw) { if (!raw) return clamp(Number(state.current) || 0, 0, steps.length - 1); if (/^\d+$/.test(raw)) return clamp(Number(raw), 0, steps.length - 1); const i = steps.findIndex(step => step.id === raw); return i >= 0 ? i : 0; }
  function go(index, replace = false) { state.current = clamp(index, 0, steps.length - 1); save(); const url = new URL(location.href); url.searchParams.set('step', steps[state.current].id); history[replace ? 'replaceState' : 'pushState']({}, '', url); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  function field(path, label, placeholder = '', multiline = true, extra = '') {
    const value = esc(getPath(path));
    return `<label class="field-label">${esc(label)}${extra}<span class="field-hint">${esc(placeholder)}</span>${multiline ? `<textarea data-field="${esc(path)}" placeholder="${esc(placeholder)}">${value}</textarea>` : `<input type="text" data-field="${esc(path)}" value="${value}" placeholder="${esc(placeholder)}">`}</label>`;
  }
  function radio(path, value, label) { return `<label class="choice"><input type="radio" data-choice="${esc(path)}" name="${esc(path)}" value="${esc(value)}" ${answer(path, value) ? 'checked' : ''}><span>${label}</span></label>`; }
  function check(path, label) { return `<label class="check-row"><input type="checkbox" data-check="${esc(path)}" ${checked(path) ? 'checked' : ''}><span>${label}</span></label>`; }
  function introBlock(text) { return `<p class="intro">${text}</p>`; }

  function shell(content) {
    const step = steps[state.current];
    const isFirst = state.current === 0;
    return `<div class="app-shell"><header class="topbar"><div class="brand"><div class="brand-mark" aria-hidden="true">✍️</div><div><h1>Lecția 7 · Povestea mea</h1><p>De la idee la povestea finală · 8–9 ani</p></div></div><div class="progress-wrap"><div class="progress-label"><span>Pasul ${state.current + 1} din ${steps.length}</span><strong>${progress()}%</strong></div><div class="progress" role="progressbar" aria-valuenow="${progress()}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progress()}%"></span></div></div></header>${content}<nav class="nav" aria-label="Navigare lecție"><div class="nav-group"><button class="btn ghost" data-action="prev" ${isFirst ? 'disabled' : ''}>← Înapoi</button><button class="btn ghost" data-action="reset">↺ Reîncepe</button></div><div class="status" role="status" aria-live="polite">${esc(step.label)}</div><div class="nav-group">${state.current < steps.length - 1 ? '<button class="btn primary" data-action="next">Continuă →</button>' : '<button class="btn accent" data-action="finish">Salvează diploma ✨</button>'}</div></nav></div>`;
  }

  function start() { return `<section class="hero"><div class="card hero-copy"><p class="step-kicker">Misiunea finală</p><h2>Astăzi ești autor!</h2><p class="lead">Ai pornit de la o idee, ai creat un personaj, o lume, o problemă, o aventură și o soluție. Acum toate devin o poveste adevărată.</p><div class="tip"><strong>Bine ai venit la ultima misiune, Autorule!</strong><br>Poți reveni la orice pas și poți modifica ideile.</div><button class="btn primary" data-action="next">Începem cartea mea 🚀</button></div><div class="card hero-art" aria-label="Ilustrație cu o carte"><div class="book"><span>POVESTEA<br>MEA</span></div></div></section><section class="content-card"><p class="step-kicker">Ce vei exersa</p><h2>De la idee la povestea finală</h2><ul class="objective-list"><li>să alegi un titlu potrivit;</li><li>să îți organizezi începutul, aventura și finalul;</li><li>să folosești personaje, descrieri, emoții și dialog;</li><li>să îți verifici povestea și să o prezinți cu încredere.</li></ul></section>`; }

  function previousHints() {
    const hint = {};
    try {
      Object.keys(localStorage).filter(k => /lectia|after-school/i.test(k) && k !== STORE).forEach(k => {
        const value = JSON.parse(localStorage.getItem(k) || 'null');
        const stack = [value];
        while (stack.length) { const item = stack.pop(); if (!item || typeof item !== 'object') continue; Object.entries(item).forEach(([key, val]) => { if (val && typeof val === 'object') stack.push(val); else if (typeof val === 'string' && val.trim()) hint[key.toLowerCase()] ||= val; }); }
      });
    } catch (_) {}
    return hint;
  }
  function recap() {
    const hints = previousHints();
    const hintFor = (key, aliases) => getPath(`recap.${key}`) || aliases.map(a => hints[a]).find(Boolean) || '';
    const fields = [
      ['characterName','Nume','Cum îl cheamă?', ['charactername','name']], ['characterType','Este','Copil, robot, animal…', ['charactertype','type']], ['characterTraits','Este','Cum este?', ['charactertraits','traits']], ['characterLikes','Îi place','Ce îi place?', ['characterlikes','likes']], ['characterFear','Îi este frică de','Ce îl sperie?', ['characterfear','fear']], ['characterWish','Își dorește','Ce își dorește?', ['characterwish','wish']], ['setting','Locul','Unde are loc povestea?', ['storysetting','setting']], ['time','Momentul','Când se întâmplă?', ['storytime','time']], ['atmosphere','Atmosfera','Cum arată sau se simte locul?', ['settingdescription','atmosphere']], ['problem','Problema','Ce problemă există?', ['storyproblem','problem']], ['mission','Misiunea','Ce trebuie să facă?', ['storymission','mission']], ['obstacle','Obstacolul','Ce îl oprește?', ['storyobstacle','obstacle']], ['keyMoment','Momentul important','Când devine totul intens?', ['storykeymoment','keymoment']], ['solution','Soluția','Cum rezolvă?', ['storysolution','solution']], ['ending','Finalul','Cum se termină?', ['storyending','ending']]
    ];
    return `<section class="content-card"><p class="step-kicker">2 · Recapitularea poveștii mele</p><h2>Ideile tale de până acum</h2>${introBlock('Aplicația afișează informațiile salvate din pașii anteriori. Dacă nu apar încă, le poți completa acum; ele rămân pe tabletă.')}<div class="grid-2">${fields.map(([key,label,placeholder,aliases]) => field(`recap.${key}`, label, hintFor(key, aliases), false)).join('')}</div><div class="tip">🔎 Recapitularea este harta poveștii tale. Nu trebuie să fie perfectă ca să poți începe.</div></section>`;
  }

  const checklistItems = [['character','Am un personaj.'],['setting','Știu unde are loc povestea.'],['time','Știu când are loc povestea.'],['problem','Am o problemă.'],['mission','Personajul meu are o misiune.'],['obstacle','Există un obstacol.'],['key','Am un moment important.'],['solution','Știu cum se rezolvă problema.'],['ending','Am un final.']];
  function checklist() {
    const done = checklistItems.filter(([key]) => checked(`checklist.${key}`)).length;
    const all = done === checklistItems.length;
    return `<section class="content-card"><p class="step-kicker">3 · Testul „Am tot ce îmi trebuie?”</p><h2>Verifică planul de autor</h2>${introBlock('Bifează ce ai deja. Dacă lipsește ceva, nicio problemă: te poți întoarce la recapitulare și îl completezi.')}<div class="check-grid">${checklistItems.map(([key,label]) => check(`checklist.${key}`, label)).join('')}</div><div class="feedback ${all ? 'good' : 'warn'}">${all ? '🎉 Perfect! Ești pregătit să scrii!' : `${done}/${checklistItems.length} bifate. Un autor bun verifică întotdeauna povestea înainte să înceapă.`}</div>${!all ? '<button class="btn ghost" data-action="jump-missing" style="margin-top:12px">Mergi la recapitulare</button>' : ''}</section>`;
  }

  function titleRead() { return `<section class="content-card"><p class="step-kicker">4 · Găsește titlul</p><h2>Titlul este prima impresie</h2>${introBlock('Un titlu bun îl face pe cititor să vrea să afle mai mult. Privește exemplul și alege titlul care se potrivește.')}<div class="story"><p><strong>Poveste:</strong> „Un copil găsește o ușă secretă într-o pădure și descoperă o lume magică.”</p></div><fieldset class="question"><legend>Care este un titlu potrivit?</legend><div class="choice-list">${radio('exampleTitle','copil','Copilul')}${radio('exampleTitle','padure','Pădurea')}${radio('exampleTitle','usa','Ușa din Pădurea Fermecată')}${radio('exampleTitle','zi','O zi obișnuită')}</div>${getPath('exampleTitle') ? `<div class="feedback ${answer('exampleTitle','usa') ? 'good' : 'bad'}">${answer('exampleTitle','usa') ? '✅ Da! Titlul spune ceva special și ne face curioși.' : '💡 Caută titlul care arată ușa secretă și locul magic.'}</div>` : ''}</fieldset></section>`; }

  function titleCreate() { return `<section class="content-card"><p class="step-kicker">5 · Creează titlul tău</p><h2>Alege o direcție și scrie titlul</h2>${introBlock('Poți schimba titlul mai târziu. Alege tipul care te inspiră, apoi scrie o variantă personală.')}<div class="grid-2"><fieldset class="question"><legend>Tipul titlului</legend><div class="choice-list">${radio('titleType','misterios','🔍 Misterios – „Ușa care nu trebuia deschisă”')}${radio('titleType','personaj','👤 Despre personaj – „Aventura lui Max”')}${radio('titleType','loc','🏰 Despre loc – „Secretul Castelului Albastru”')}${radio('titleType','amuzant','😄 Amuzant – „Roboțelul care se temea de întuneric”')}${radio('titleType','inventat','✨ Inventat de mine')}</div></fieldset><div class="writing-card">${field('title','Titlul poveștii tale','Scrie un titlu care te reprezintă.', false)}<div class="tip">Provocare: poți inventa un titlu care îl face pe cititor curios?</div></div></div></section>`; }

  function curious() { return `<section class="content-card"><p class="step-kicker">6 · Curiozitatea cititorului</p><h2>Care titlu te face curios?</h2>${introBlock('Povestea este despre un copil care găsește un portal către o altă lume. Alege titlul care te face să vrei să afli ce se întâmplă.')}<fieldset class="question"><legend>Alege titlul</legend><div class="choice-list">${radio('curious','poveste','„O poveste”')}${radio('curious','portal','„Portalul”')}${radio('curious','dincolo','„Ce se afla dincolo de portal?”')}${radio('curious','copil','„Copilul”')}</div></fieldset><fieldset class="question" style="margin-top:14px"><legend>De ce?</legend><div class="choice-list">${radio('curiousWhy','dorinta','Pentru că ne face să vrem să aflăm ce se întâmplă.')}${radio('curiousWhy','scurt','Pentru că este cel mai scurt.')}${radio('curiousWhy','cuvinte','Pentru că are mai multe cuvinte.')}</div></fieldset>${answer('curious','dincolo') && answer('curiousWhy','dorinta') ? '<div class="feedback good">✅ Exact! Un titlu bun deschide o întrebare în mintea cititorului.</div>' : (getPath('curious') || getPath('curiousWhy') ? '<div class="feedback warn">💡 Varianta curioasă este „Ce se afla dincolo de portal?” și motivul este că ne face să vrem să aflăm.</div>' : '')}</section>`; }

  function beginning() { return `<section class="content-card"><p class="step-kicker">7 · Construim povestea – începutul</p><h2>🟢 ÎNCEPUTUL</h2>${introBlock('Spune cine este personajul, unde se află și ce face la început.')}<div class="grid-3"><div class="writing-card">${field('beginning.who','Cine este personajul?','Nume și un detaliu despre el.')}</div><div class="writing-card">${field('beginning.where','Unde se află?','Locul de început.')}</div><div class="writing-card">${field('beginning.start','Ce face la început?','Acțiunea care pornește povestea.')}</div></div><div class="tip">Poți începe cu: „Într-o zi…”, „Într-o dimineață…”, „Totul a început când…”, „Într-un loc ascuns…”, „Nimeni nu știa că…”</div></section>`; }
  function problem() { return `<section class="content-card"><p class="step-kicker">8 · Problema apare</p><h2>🟡 Totul se schimbă</h2>${introBlock('O problemă sau o misiune îl trimite pe personaj într-o aventură.')}<div class="grid-2"><div class="writing-card">${field('problem.until','„Totul mergea bine până când…”','Ce s-a întâmplat?')}</div><div class="writing-card">${field('problem.mission','„Personajul și-a dat seama că trebuia să…”','Ce misiune are acum?')}</div></div></section>`; }
  function adventure() { return `<section class="content-card"><p class="step-kicker">9 · Aventura</p><h2>🟠 MIJLOCUL</h2>${introBlock('Scrie pașii prin care personajul încearcă să rezolve problema.')}<div class="grid-3"><div class="writing-card">${field('adventure.action','Ce face personajul?','Prima încercare.')}</div><div class="writing-card">${field('adventure.obstacle','Ce obstacol întâlnește?','Ce îl oprește?')}</div><div class="writing-card">${field('adventure.then','Ce se întâmplă apoi?','Urmarea acțiunii.')}</div></div><div class="tip"><strong>Cuvinte care te pot ajuta:</strong> Deodată… · În acel moment… · După câteva minute… · Dar atunci… · Spre surprinderea lui… · Fără să stea pe gânduri…</div></section>`; }
  function key() { return `<section class="content-card"><p class="step-kicker">10 · Momentul cel mai important</p><h2>🔥 Personajul ia o decizie</h2>${introBlock('Aici lucrurile devin foarte importante. Personajul trebuie să aleagă sau să găsească o soluție.')}<div class="grid-2"><div class="writing-card">${field('key.difficult','Cea mai dificilă situație a fost când…','Descrie momentul.')}${field('key.between','Personajul a trebuit să aleagă între…','Două variante.')}</div><div class="writing-card">${field('key.chose','A ales să…','Decizia.')}${field('key.because','Pentru că…','Motivul deciziei.')}</div></div></section>`; }
  const emotions = [['curaj','Curaj'],['teama','Teamă'],['bucurie','Bucurie'],['uimire','Uimire'],['tristete','Tristețe'],['furie','Furie'],['entuziasm','Entuziasm'],['neliniste','Neliniște'],['speranta','Speranță']];
  function emotion() { return `<section class="content-card"><p class="step-kicker">11 · Arată ce simte personajul</p><h2>❤️ Emoția se vede în acțiuni</h2>${introBlock('Alege o emoție, apoi arată-o fără să folosești chiar cuvântul emoției.')}<div class="choice-list">${emotions.map(([v,l]) => radio('emotion',v,l)).join('')}</div><div class="story"><p>Exemplu: ❌ „Max era speriat.”</p><p>✅ „Max simți că îi tremură mâinile și făcu un pas înapoi.”</p></div>${field('emotionText','Scrie cum se vede emoția','Folosește gesturi, gânduri sau reacții.')}</section>`; }
  function dialogue() { return `<section class="content-card"><p class="step-kicker">12 · Adaugă un dialog</p><h2>💬 Lasă personajele să vorbească</h2>${introBlock('O replică face povestea mai vie. Completează cele trei rânduri; răspunsul este liber.')}<div class="grid-3">${field('dialogue.0','Prima replică','— „…?”')}${field('dialogue.1','A doua replică','— „….”')}${field('dialogue.2','Replica de acțiune','— „Atunci trebuie să ….”')}</div><div class="tip">Folosește semnul întrebării când personajul întreabă și ghilimele pentru cuvintele rostite.</div></section>`; }
  function ending() { return `<section class="content-card"><p class="step-kicker">13 · Scrie finalul</p><h2>🔵 FINALUL</h2>${introBlock('Arată cum se rezolvă problema și ce înțelege personajul.')}<div class="grid-3"><div class="writing-card">${field('ending.finally','„În cele din urmă…”','Ce s-a întâmplat?')}</div><div class="writing-card">${field('ending.solved','„Problema a fost rezolvată atunci când…”','Momentul soluției.')}</div><div class="writing-card">${field('ending.learned','„La sfârșit, personajul a înțeles că…”','Ideea sau lecția.')}</div></div></section>`; }
  const details = [['obiect','Un obiect misterios'],['replica','O ultimă replică'],['surpriza','O surpriză'],['lectie','O lecție învățată'],['intrebare','O nouă întrebare'],['indiciu','Un indiciu pentru o nouă aventură'],['inventat','Inventez eu ceva']];
  function detail() { return `<section class="content-card"><p class="step-kicker">14 · Adaugă un ultim detaliu</p><h2>✨ Fă finalul memorabil</h2>${introBlock('Alege un detaliu mic care rămâne în mintea cititorului.')}<div class="choice-list">${details.map(([v,l]) => radio('detailType',v,l)).join('')}</div>${field('detailText','Detaliul meu','Scrie-l în 1–3 propoziții.')}</section>`; }
  function story() { return `<section class="content-card"><p class="step-kicker">15 · Acum scrie povestea!</p><h2>✍️ Povestea mea</h2>${introBlock('Folosește toate ideile create și scrie povestea ta completă. 8–15 propoziții sunt suficiente.')}<div class="tip">Povestea trebuie să aibă: un titlu, un început, un personaj, un loc, o problemă, o aventură, un obstacol, un moment important, o soluție și un final.</div><label class="field-label">Titlul (poți folosi titlul ales)<input type="text" data-field="title" value="${esc(state.title)}" placeholder="Titlul poveștii"></label><label class="field-label">Povestea completă<textarea class="big-text" data-field="storyText" placeholder="Scrie aici povestea ta…">${esc(state.storyText)}</textarea></label><div class="status">${state.storyText.trim().length} caractere · scrie în ritmul tău</div></section>`; }
  const verifyItems = [['character','Am spus cine este personajul meu.'],['setting','Am spus unde se întâmplă povestea.'],['problem','Personajul are o problemă sau o misiune.'],['adventure','Se întâmplă ceva important.'],['emotion','Am arătat ce simte personajul.'],['dialogue','Am folosit cel puțin o replică.'],['ending','Povestea mea are un final.'],['writing','Am verificat dacă propozițiile mele au sens.']];
  function verify() { const done = verifyItems.filter(([key]) => checked(`verify.${key}`)).length; const all = done === verifyItems.length; return `<section class="content-card"><p class="step-kicker">16 · Verifică povestea ca un autor adevărat</p><h2>🔎 Ultima revizie</h2>${introBlock('Bifează fiecare lucru pe care l-ai verificat. Nu căutăm perfecțiune, ci o poveste care se înțelege și îți aparține.')}<div class="check-grid">${verifyItems.map(([key,label]) => check(`verify.${key}`, label)).join('')}</div><div class="feedback ${all ? 'good' : 'warn'}">${all ? '✅ Povestea ta este pregătită pentru copertă și prezentare!' : `${done}/${verifyItems.length} verificate. Mai ai puțin.`}</div></section>`; }
  const coverStyles = [['natura','🌲 Aventură în natură'],['castel','🏰 Castel misterios'],['spatiu','🚀 Aventură în spațiu'],['magic','🪄 Lume magică'],['fantezie','🐉 Fantezie'],['mister','🔍 Mister'],['desenez','🎨 Desenez eu']];
  function cover() { const styleLabel = coverStyles.find(([v]) => v === state.coverStyle)?.[1] || 'Alege un stil'; return `<section class="content-card"><p class="step-kicker">17 · Creează coperta</p><h2>🎨 Transformă povestea într-o carte</h2>${introBlock('Completează titlul și autorul, apoi alege stilul și elementul principal al copertei.')}<div class="grid-2"><div><label class="field-label">📖 Titlu<input type="text" data-field="title" value="${esc(state.title)}" placeholder="Titlul poveștii"></label>${field('coverAuthor','✍️ Autor','Numele copilului', false)}<fieldset class="question"><legend>Alege coperta</legend><div class="choice-list">${coverStyles.map(([v,l]) => radio('coverStyle',v,l)).join('')}</div></fieldset><fieldset class="question" style="margin-top:14px"><legend>Elementul principal</legend><div class="choice-list">${radio('coverElement','character','Personajul')}${radio('coverElement','place','Locul')}${radio('coverElement','object','Obiectul misterios')}${radio('coverElement','moment','Momentul important')}${radio('coverElement','other','Altceva')}</div></fieldset></div><div class="cover-preview"><div style="font-size:3rem">${state.coverStyle === 'castel' ? '🏰' : state.coverStyle === 'spatiu' ? '🚀' : state.coverStyle === 'magic' ? '🪄' : state.coverStyle === 'fantezie' ? '🐉' : state.coverStyle === 'mister' ? '🔍' : state.coverStyle === 'natura' ? '🌲' : '📖'}</div><h3>${esc(state.title || 'Titlul poveștii')}</h3><p>${esc(state.coverAuthor || 'Numele autorului')}</p><span>${esc(styleLabel)}</span></div></div></section>`; }
  function present() { return `<section class="content-card"><p class="step-kicker">18 · Prezintă povestea</p><h2>🗣️ Ești un autor invitat</h2>${introBlock('Alege prezentarea scurtă sau citește cu voce tare un fragment. Nu trebuie să fie perfect; este creația ta.')}<div class="grid-2"><div class="writing-card"><h3>🟢 Prezentare scurtă</h3>${field('presentation.name','„Povestea mea se numește…”',state.title || 'Titlu')}${field('presentation.character','„Personajul principal este…”','Nume și detaliu')}${field('presentation.happens','„În poveste se întâmplă…”','Rezumat scurt')}${field('presentation.moment','„Cel mai interesant moment este…”','Momentul important')}${field('presentation.why','„Mi-a plăcut să scriu pentru că…”','Motivul tău')}</div><div class="writing-card"><h3>🟡 Prezentarea preferată</h3><p class="intro">Poți înregistra audio un fragment din poveste. Înregistrarea este opțională și rămâne doar pe această tabletă cât timp pagina este deschisă.</p><div class="recording"><button class="btn ${recorder ? 'danger' : 'primary'}" data-action="${recorder ? 'stop-recording' : 'start-recording'}">${recorder ? '⏹ Oprește' : '🎤 Începe înregistrarea'}</button>${recordingUrl ? `<audio controls src="${recordingUrl}"></audio>` : '<span class="status">Nicio înregistrare încă.</span>'}</div><div class="tip">Citește cel mai interesant fragment al poveștii tale.</div></div></div></section>`; }
  function valueOrDash(value) { return esc(String(value || '—').trim() || '—'); }
  function mission() { const rows = [['Titlul', state.title], ['Personajul', state.beginning.who || state.recap.characterName], ['Lumea', state.beginning.where || state.recap.setting], ['Problema', state.problem.until || state.recap.problem], ['Obstacolul', state.adventure.obstacle || state.recap.obstacle], ['Momentul important', state.key.difficult || state.recap.keyMoment], ['Soluția', state.key.chose || state.recap.solution], ['Finalul', state.ending.finally || state.recap.ending], ['Povestea completă', state.storyText]]; return `<section class="content-card"><p class="step-kicker">20 · Misiunea finală</p><h2>🏆 „Eu sunt autor!”</h2>${introBlock('Aceasta este fișa de autor a poveștii tale. Citește-o, modifică ce dorești, apoi apasă butonul pentru diplomă.')}<div class="summary">${rows.map(([label,value]) => `<div class="summary-row"><strong>${label}</strong><span>${valueOrDash(value)}</span></div>`).join('')}</div><button class="btn accent" data-action="complete" style="margin-top:18px">Am terminat povestea ✨</button></section>`; }
  function diploma() { return `<section class="content-card"><div class="diploma"><div class="badge">🏅</div><h3>FELICITĂRI!</h3><p>Ai devenit <strong>AUTOR DE POVEȘTI</strong>!</p><p>Ai învățat să găsești idei, să creezi personaje și lumi, să inventezi aventuri, probleme și soluții, să folosești emoții și dialog și să îți prezinți creația.</p><p class="quote">„Nu există o singură poveste bună. Există povestea pe care numai TU ai fi putut să o scrii.” ❤️</p><p>Păstrează-ți ideile: următoarea poveste poate începe chiar de la ele!</p></div></section>`; }

  function render() {
    const id = steps[state.current].id;
    const map = { start, recap, checklist, 'title-read': titleRead, 'title-create': titleCreate, curious, beginning, problem, adventure, key, emotion, dialogue, ending, detail, story, verify, cover, present, mission, diploma };
    app.innerHTML = shell(map[id]());
    bind();
  }

  function bind() {
    app.querySelectorAll('[data-field]').forEach(el => el.addEventListener('input', event => { setPath(event.target.dataset.field, event.target.value); save(); const count = app.querySelector('.status'); if (count && event.target.dataset.field === 'storyText') count.textContent = `${event.target.value.length} caractere · scrie în ritmul tău`; }));
    app.querySelectorAll('[data-choice]').forEach(el => el.addEventListener('change', event => { setPath(event.target.dataset.choice, event.target.value); save(); render(); }));
    app.querySelectorAll('[data-check]').forEach(el => el.addEventListener('change', event => { setPath(event.target.dataset.check, event.target.checked); save(); render(); }));
    app.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', event => {
      const action = event.currentTarget.dataset.action;
      if (action === 'next') go(state.current + 1);
      if (action === 'prev') go(state.current - 1);
      if (action === 'reset' && confirm('Ștergi progresul acestei lecții de pe tabletă?')) { state = clone(defaultState); recordingUrl = ''; recorder = null; save(); go(0, true); }
      if (action === 'finish') { state.completed = true; save(); render(); }
      if (action === 'complete') { state.completed = true; save(); go(steps.findIndex(s => s.id === 'diploma')); }
      if (action === 'jump-missing') go(1);
      if (action === 'start-recording') startRecording();
      if (action === 'stop-recording') stopRecording();
    }));
  }
  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { alert('Înregistrarea audio nu este disponibilă în acest browser. Poți scrie prezentarea în câmpurile din stânga.'); return; }
    try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); recordingChunks = []; recorder = new MediaRecorder(stream); recorder.ondataavailable = event => { if (event.data.size) recordingChunks.push(event.data); }; recorder.onstop = () => { stream.getTracks().forEach(track => track.stop()); recordingUrl = URL.createObjectURL(new Blob(recordingChunks, { type: recorder.mimeType || 'audio/webm' })); recorder = null; render(); }; recorder.start(); render(); } catch (_) { alert('Nu am putut porni microfonul. Poți continua fără înregistrare.'); recorder = null; }
  }
  function stopRecording() { if (recorder && recorder.state !== 'inactive') recorder.stop(); }

  window.addEventListener('popstate', () => { state.current = resolveStep(new URL(location.href).searchParams.get('step')); render(); });
  window.addEventListener('keydown', event => { if (event.altKey || event.ctrlKey || event.metaKey || ['TEXTAREA','INPUT','SELECT'].includes(document.activeElement?.tagName)) return; if (event.key === 'ArrowRight' && state.current < steps.length - 1) go(state.current + 1); if (event.key === 'ArrowLeft' && state.current > 0) go(state.current - 1); });
  state.current = resolveStep(new URL(location.href).searchParams.get('step'));
  if (!new URL(location.href).searchParams.get('step')) go(state.current, true); else render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
})();

