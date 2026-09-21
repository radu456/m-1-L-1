/* Lecția 6 – Construim povestea. Fără server: progresul rămâne pe tabletă. */
(() => {
  'use strict';

  const STORE = 'after-school:lectia-6:v1';
  const app = document.getElementById('app');
  const steps = [
    { id: 'start', label: 'Pornim aventura' },
    { id: 'intelegere', label: 'Înțelegerea poveștii' },
    { id: 'piese', label: 'Cele 4 piese' },
    { id: 'ordine', label: 'Ordinea evenimentelor' },
    { id: 'sortare', label: 'Început, mijloc sau final' },
    { id: 'lipseste', label: 'Ce lipsește?' },
    { id: 'moment', label: 'Momentul important' },
    { id: 'construieste', label: 'Construiește momentul' },
    { id: 'solutie', label: 'Găsește soluția' },
    { id: 'final', label: 'Recapitulare' }
  ];

  const defaultState = {
    current: 0,
    answers: {},
    order: ['A', 'B', 'C', 'D'],
    sort: {},
    build: { until: '', noticed: '', options: '', chose: '', because: '' },
    solutionChoices: [],
    solutionFree: '',
    solutionWhy: '',
    completed: false
  };

  let state = load();
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  const read = (path, fallback = '') => path.split('.').reduce((obj, key) => obj && obj[key] !== undefined ? obj[key] : fallback, state);

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      return deepMerge(structuredClone(defaultState), saved || {});
    } catch (_) { return structuredClone(defaultState); }
  }
  function deepMerge(base, extra) {
    if (!extra || typeof extra !== 'object') return base;
    Object.keys(extra).forEach(key => {
      if (extra[key] && typeof extra[key] === 'object' && !Array.isArray(extra[key]) && base[key] && typeof base[key] === 'object') deepMerge(base[key], extra[key]);
      else base[key] = extra[key];
    });
    return base;
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (_) { /* private mode: continue in memory */ }
  }
  function answer(group, value) { return state.answers[group] === value; }
  function selected(group, value) { return Array.isArray(state.answers[group]) && state.answers[group].includes(value); }
  function allSelected(group, values) { return values.every(v => selected(group, v)); }

  function resolveStep(raw) {
    if (raw === null || raw === '') return clamp(Number(state.current) || 0, 0, steps.length - 1);
    if (/^\d+$/.test(raw)) return clamp(Number(raw), 0, steps.length - 1);
    const byId = steps.findIndex(step => step.id === raw);
    return byId >= 0 ? byId : 0;
  }
  function go(index, replace = false) {
    state.current = clamp(index, 0, steps.length - 1);
    save();
    const url = new URL(location.href);
    url.searchParams.set('step', steps[state.current].id);
    history[replace ? 'replaceState' : 'pushState']({}, '', url);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const progress = () => Math.round(((state.current + 1) / steps.length) * 100);
  const field = (key, label, placeholder = '') => `
    <label class="field-label">${esc(label)}
      <textarea data-field="build.${key}" placeholder="${esc(placeholder)}">${esc(read(`build.${key}`))}</textarea>
    </label>`;
  const radio = (group, value, label, extra = '') => `<label class="choice"><input type="radio" name="${esc(group)}" data-choice="${esc(group)}" value="${esc(value)}" ${answer(group, value) ? 'checked' : ''}><span>${label}${extra}</span></label>`;
  const checkbox = (group, value, label, extra = '') => `<label class="choice"><input type="checkbox" data-multi="${esc(group)}" value="${esc(value)}" ${selected(group, value) ? 'checked' : ''}><span>${label}${extra}</span></label>`;

  function shell(content) {
    const step = steps[state.current];
    return `<div class="app-shell">
      <header class="topbar">
        <div class="brand"><div class="brand-mark" aria-hidden="true">📖</div><div><h1>Lecția 6 · Construim povestea</h1><p>De la început până la final · 8–9 ani</p></div></div>
        <div class="progress-wrap"><div class="progress-label"><span>Pasul ${state.current + 1} din ${steps.length}</span><strong>${progress()}%</strong></div><div class="progress" role="progressbar" aria-valuenow="${progress()}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progress()}%"></span></div></div>
      </header>
      ${content}
      <nav class="nav" aria-label="Navigare lecție">
        <div class="nav-group"><button class="btn ghost" data-action="prev" ${state.current === 0 ? 'disabled' : ''}>← Înapoi</button><button class="btn ghost" data-action="reset">↺ Reîncepe</button></div>
        <div class="status" role="status" aria-live="polite">${esc(step.label)}</div>
        <div class="nav-group">${state.current < steps.length - 1 ? '<button class="btn primary" data-action="next">Continuă →</button>' : '<button class="btn accent" data-action="finish">Salvează lecția ✨</button>'}</div>
      </nav>
    </div>`;
  }

  function start() {
    return `<section class="hero">
      <div class="hero-card"><p class="step-kicker">Misiunea zilei</p><h2>Construim povestea</h2><p class="lead">O poveste are un început, o aventură și un final. Astăzi îl ajutăm pe Max să treacă prin tunel și îți construiești propriul moment important.</p><div class="tip"><strong>Ține minte:</strong> ideile tale creative nu sunt greșite. Explică-le și fă-le să aibă sens!</div><button class="btn primary" data-action="next">Începem aventura 🚀</button></div>
      <div class="hero-card hero-art" aria-label="Ilustrație cu tunel misterios"><div class="tunnel"><span class="max" aria-hidden="true">🧒</span></div></div>
    </section><section class="content-card"><p class="step-kicker">Obiective</p><h2>La final vei putea...</h2><ul class="objective-list"><li>să recunoști începutul, mijlocul și finalul;</li><li>să ordonezi evenimentele unei aventuri;</li><li>să alegi un moment important și o soluție;</li><li>să îți organizezi propria poveste înainte de a o scrie.</li></ul><h3>Povestea lui Max</h3><div class="story"><p>Max intrase în tunelul misterios și ușa se închisese în urma lui.</p><p>Mergea încet, urmărind luminile verzi de pe pereți.</p><p>În fața lui apăru un pod rupt.</p><p class="quote">„Trebuie să găsesc o cale să ajung de partea cealaltă.”</p><p>Observă o frânghie prinsă de o stâncă și reuși să construiască un mic pod. După ce traversă, găsi o ușă strălucitoare. O deschise și ajunse în pădurea de unde plecase.</p><p class="quote">„Am reușit!”</p></div></section>`;
  }

  const qData = [
    ['q1', 'Unde se afla Max la începutul poveștii?', [['castel','Într-un castel'],['tunel','Într-un tunel misterios'],['scoala','Într-o școală'],['plaja','Pe o plajă']], 'tunel'],
    ['q2', 'Care era problema lui?', [['foame','Îi era foame'],['joc','Pierduse un joc'],['iesire','Trebuia să găsească o cale de ieșire'],['stop','Nu voia să meargă mai departe']], 'iesire'],
    ['q3', 'Ce obstacol întâlnește?', [['dragon','Un dragon'],['pod','Un pod rupt'],['furtuna','O furtună'],['usa','O ușă încuiată']], 'pod'],
    ['q4', 'Cum rezolvă problema?', [['intoarcere','Se întoarce din drum'],['asteapta','Așteaptă să vină cineva'],['pod','Folosește o frânghie și construiește un mic pod'],['ascunde','Se ascunde']], 'pod'],
    ['q5', 'Cum se termină povestea?', [['tunel','Max rămâne în tunel'],['comoara','Max găsește o comoară'],['padure','Max se întoarce în pădure'],['adoarme','Max adoarme']], 'padure']
  ];
  function intelegere() {
    const answered = qData.filter(q => state.answers[q[0]]).length;
    const correct = qData.filter(q => answer(q[0], q[3])).length;
    return `<section class="content-card"><p class="step-kicker">2 · Înțelegerea poveștii</p><h2>Verificăm aventura lui Max</h2><p class="intro">Alege un răspuns la fiecare întrebare. Primești feedback imediat, iar la final poți încerca din nou.</p><div class="question-grid">${qData.map(([id, text, opts, good], i) => `<fieldset class="question"><legend>Întrebarea ${i + 1}. ${esc(text)}</legend><div class="choice-list">${opts.map(([v,l]) => radio(id,v,esc(l))).join('')}</div>${state.answers[id] ? `<div class="feedback ${answer(id,good) ? 'good' : 'bad'}">${answer(id,good) ? '✅ Bravo! Ai găsit răspunsul.' : '💡 Mai citește un fragment și încearcă din nou.'}</div>` : ''}</fieldset>`).join('')}</div><div class="feedback ${answered === qData.length && correct === qData.length ? 'good' : ''}">Ai răspuns la ${answered}/${qData.length}. Corecte: ${correct}/${qData.length}.</div></section>`;
  }

  function piese() {
    return `<section class="content-card"><p class="step-kicker">3 · Puzzle-ul poveștii</p><h2>Cele 4 piese ale unei povești</h2><p class="intro">O poveste poate fi construită ca un puzzle. Fiecare piesă ne ajută să urmărim aventura.</p><div class="puzzle-grid"><article class="puzzle"><strong>🟢 1. ÎNCEPUTUL</strong><small>Îl cunoaștem pe personaj și aflăm unde este.</small></article><article class="puzzle"><strong>🟡 2. PROBLEMA</strong><small>Se întâmplă ceva și personajul are o misiune.</small></article><article class="puzzle"><strong>🟠 3. MOMENTUL IMPORTANT</strong><small>Apare obstacolul, iar personajul ia o decizie.</small></article><article class="puzzle"><strong>🔵 4. FINALUL</strong><small>Aflăm cum se termină aventura.</small></article></div><div class="tip">În povestea lui Max: tunelul este începutul, podul rupt este problema, frânghia este momentul important, iar pădurea este finalul.</div><h3>Mini-provocare</h3><p>Care piesă arată soluția sau decizia personajului?</p><div class="choice-list">${radio('piesa','inceput','🟢 Începutul')}${radio('piesa','problema','🟡 Problema')}${radio('piesa','moment','🟠 Momentul important')}${radio('piesa','final','🔵 Finalul')}</div>${state.answers.piesa ? `<div class="feedback ${answer('piesa','moment') ? 'good' : 'bad'}">${answer('piesa','moment') ? '✅ Exact! Aici personajul găsește soluția sau ia o decizie.' : '💡 Gândește-te la locul în care personajul trebuie să acționeze.'}</div>` : ''}</section>`;
  }

  const orderText = { A: 'Max găsește o cale de ieșire.', B: 'Max intră în tunel.', C: 'Max găsește un pod rupt.', D: 'Max ajunge înapoi în pădure.' };
  function ordine() {
    return `<section class="content-card"><p class="step-kicker">4 · Ordonează povestea</p><h2>Pune evenimentele în ordinea corectă</h2><p class="intro">Trage cardurile sau folosește săgețile pentru a le muta. Pe tabletă, butoanele sunt mai ușor de folosit.</p><div class="order-zone" data-order-zone>${state.order.map((letter, index) => `<div class="order-card" draggable="true" data-letter="${letter}" data-index="${index}"><span class="order-letter">${letter}</span><span>${esc(orderText[letter])}</span><button class="move-btn" data-move="up" data-index="${index}" aria-label="Mută în sus" ${index === 0 ? 'disabled' : ''}>↑</button><button class="move-btn" data-move="down" data-index="${index}" aria-label="Mută în jos" ${index === state.order.length - 1 ? 'disabled' : ''}>↓</button></div>`).join('')}</div><div class="nav-group" style="margin-top:14px"><button class="btn primary" data-action="check-order">Verifică ordinea</button></div>${state.orderChecked ? `<div class="feedback ${state.order.join('') === 'BCAD' ? 'good' : 'bad'}">${state.order.join('') === 'BCAD' ? '✅ Bravo! B → C → A → D. Cititorul poate urmări aventura.' : '💡 Mai încearcă: mai întâi Max intră în tunel, apoi vede podul rupt.'}</div>` : '<p class="status">Ordinea corectă: B → C → A → D.</p>'}</section>`;
  }

  const sortItems = [
    ['1', 'Mara locuia într-un sat aflat lângă o pădure misterioasă.', 'inceput'],
    ['2', 'Într-o zi, Mara găsi o hartă ascunsă sub o piatră.', 'inceput'],
    ['3', 'Pentru a ajunge la comoară, Mara trebuia să traverseze râul.', 'mijloc'],
    ['4', 'Râul era foarte adânc, iar podul fusese distrus.', 'mijloc'],
    ['5', 'Mara găsi o barcă și reuși să ajungă pe celălalt mal.', 'moment'],
    ['6', 'În peșteră găsi comoara și se întoarse acasă.', 'final']
  ];
  function sortare() {
    const good = sortItems.filter(([id,, answerKey]) => state.sort[id] === answerKey).length;
    return `<section class="content-card"><p class="step-kicker">5 · Sortează</p><h2>Început, mijloc sau final?</h2><p class="intro">Alege categoria pentru fiecare propoziție. „Momentul important” poate fi o soluție sau o decizie.</p><div class="sort-grid">${sortItems.map(([id,text]) => `<div class="sort-item"><p><strong>${id}.</strong> ${esc(text)}</p><select data-sort="${id}" aria-label="Categoria propoziției ${id}"><option value="">Alege categoria…</option><option value="inceput" ${state.sort[id] === 'inceput' ? 'selected' : ''}>Început</option><option value="mijloc" ${state.sort[id] === 'mijloc' ? 'selected' : ''}>Mijloc</option><option value="moment" ${state.sort[id] === 'moment' ? 'selected' : ''}>Moment important</option><option value="final" ${state.sort[id] === 'final' ? 'selected' : ''}>Final</option></select></div>`).join('')}</div><div class="feedback ${Object.keys(state.sort).length === sortItems.length && good === sortItems.length ? 'good' : ''}">${Object.keys(state.sort).length}/${sortItems.length} completate · ${good}/${sortItems.length} corecte.${good === sortItems.length ? ' ✅ Excelent!' : ''}</div></section>`;
  }

  function lipseste() {
    const correct = ['obstacol','moment','detalii'];
    const picked = state.answers.missing || [];
    const done = picked.length > 0;
    const ok = correct.every(v => picked.includes(v)) && picked.length === correct.length;
    return `<section class="content-card"><p class="step-kicker">6 · Gândește ca un autor</p><h2>Ce lipsește?</h2><div class="story"><p>„Andrei găsește o hartă misterioasă. Pleacă să caute comoara. După un timp, se întoarce acasă.”</p></div><p class="intro">Bifează toate ideile care ar face povestea mai interesantă.</p><div class="choice-list">${checkbox('missing','obstacol','O problemă sau un obstacol')}${checkbox('missing','moment','Un moment important')}${checkbox('missing','detalii','Mai multe detalii despre aventură')}${checkbox('missing','personaje','Un număr foarte mare de personaje')}</div>${done ? `<div class="feedback ${ok ? 'good' : 'warn'}">${ok ? '✅ Exact! Personajul trebuie să treacă prin ceva, nu doar să ajungă dintr-un loc în altul.' : '💡 Primele trei variante sunt cele potrivite. Poți modifica răspunsul.'}</div>` : ''}</section>`;
  }

  function moment() {
    const vals = state.answers.keyMoment || [];
    const correct = ['taken','danger','choice'];
    const ok = correct.every(v => vals.includes(v)) && vals.length === correct.length;
    return `<section class="content-card"><p class="step-kicker">7 · Alege momentul important</p><h2>Când devine aventura intensă?</h2><p class="intro">Personajul tău trebuie să găsească un obiect înainte de apus. Bifează momentele care pot fi importante.</p><div class="choice-list">${checkbox('keyMoment','taken','Găsește obiectul, dar cineva îl ia chiar înainte să ajungă la el.')}${checkbox('keyMoment','morning','Se trezește dimineața.')}${checkbox('keyMoment','shoes','Își pune pantofii.')}${checkbox('keyMoment','danger','Descoperă că obiectul se află într-un loc periculos.')}${checkbox('keyMoment','choice','Trebuie să aleagă între a continua singur sau a cere ajutor.')}</div>${vals.length ? `<div class="feedback ${ok ? 'good' : 'warn'}">${ok ? '✅ Corect: variantele 1, 4 și 5.' : '💡 Sunt corecte variantele 1, 4 și 5. Mai verifică bifele.'}</div>` : ''}</section>`;
  }

  function construieste() {
    return `<section class="content-card"><p class="step-kicker">8 · Construim momentul important</p><h2>Continuă ideea cu propriile cuvinte</h2><p class="intro">Aici nu există răspuns greșit. Scrie cât poți de clar și fă legătura între idei.</p><div class="writing-grid"><div class="writing-card">${field('until','Totul mergea bine până când…','Ce s-a schimbat?')}</div><div class="writing-card">${field('noticed','Atunci personajul meu a observat că…','Ce a văzut sau a înțeles?')}</div><div class="writing-card">${field('options','Avea două variante…','Care erau cele două alegeri?')}</div><div class="writing-card">${field('chose','A ales să…','Ce a făcut?')}</div><div class="writing-card">${field('because','Pentru că…','De ce a ales această soluție?')}</div></div><div class="tip">🌟 Scrisul tău este original. Aplicația păstrează ideea și nu o notează cu „greșit”.</div></section>`;
  }

  function solutie() {
    const picks = state.solutionChoices || [];
    return `<section class="content-card"><p class="step-kicker">9 · Găsește soluția</p><h2>Podul s-a rupt. Cum ajunge personajul la castel?</h2><p class="intro">Poți alege una sau mai multe idei. Dacă inventezi ceva, scrie ideea și explică de ce funcționează.</p><div class="choice-list">${checkbox('solution','barca','Găsește o barcă.')}${checkbox('solution','pod','Construiește un pod.')}${checkbox('solution','drum','Găsește un alt drum.')}${checkbox('solution','ajutor','Cere ajutorul cuiva.')}${checkbox('solution','magic','Folosește un obiect magic.')}${checkbox('solution','zbor','Zboară până la castel.')}${checkbox('solution','invent','Inventez eu o soluție.')}</div><label class="field-label">Soluția mea (dacă ai inventat-o)<textarea data-field="solutionFree" placeholder="Scrie soluția ta…">${esc(state.solutionFree)}</textarea></label><label class="field-label">De ce funcționează soluția ta?<textarea data-field="solutionWhy" placeholder="Explică legătura dintre problemă și rezolvare…">${esc(state.solutionWhy)}</textarea></label><div class="tip">💡 O soluție bună răspunde problemei și îl ajută pe personaj să meargă mai departe.</div></section>`;
  }

  function final() {
    const answered = qData.filter(q => state.answers[q[0]] === q[3]).length;
    const filledBuild = Object.values(state.build).filter(v => String(v).trim()).length;
    const chosen = (state.solutionChoices || []).length || state.solutionFree.trim();
    return `<section class="content-card"><p class="step-kicker">10 · Recapitulare</p><h2>Ai construit un moment de poveste!</h2><p class="intro">Verifică-ți ideile înainte de a le folosi într-o poveste completă.</p><div class="chips"><span class="chip">🧠 ${answered}/5 întrebări corecte</span><span class="chip">🧩 ${state.order.join(' → ')}</span><span class="chip">✍️ ${filledBuild}/5 idei scrise</span><span class="chip">💡 ${chosen ? 'soluție aleasă' : 'soluție de completat'}</span></div><div class="story"><p><strong>Momentul tău important:</strong></p><p>${esc(state.build.until || '—')}</p><p>${esc(state.build.noticed || '—')}</p><p>${esc(state.build.options || '—')}</p><p>${esc(state.build.chose || '—')}</p><p>${esc(state.build.because || '—')}</p><p><strong>Soluție:</strong> ${esc(state.solutionFree || (state.solutionChoices || []).join(', ') || '—')}</p><p><strong>De ce:</strong> ${esc(state.solutionWhy || '—')}</p></div>${state.completed ? '<div class="complete"><h3>🎉 Lecția este salvată!</h3><p>Poți reveni oricând; ideile tale rămân pe această tabletă.</p></div>' : '<div class="tip">Când ești gata, apasă „Salvează lecția”. Nu este un test; este schița poveștii tale.</div>'}</section>`;
  }

  function render() {
    const id = steps[state.current].id;
    let content = id === 'start' ? start() : id === 'intelegere' ? intelegere() : id === 'piese' ? piese() : id === 'ordine' ? ordine() : id === 'sortare' ? sortare() : id === 'lipseste' ? lipseste() : id === 'moment' ? moment() : id === 'construieste' ? construieste() : id === 'solutie' ? solutie() : final();
    app.innerHTML = shell(content);
    bind();
  }

  function bind() {
    app.querySelectorAll('[data-field]').forEach(el => el.addEventListener('input', event => {
      const path = event.target.dataset.field;
      const parts = path.split('.');
      if (parts.length === 2) state[parts[0]][parts[1]] = event.target.value;
      else state[path] = event.target.value;
      save();
    }));
    app.querySelectorAll('[data-choice]').forEach(el => el.addEventListener('change', event => { state.answers[event.target.dataset.choice] = event.target.value; save(); render(); }));
    app.querySelectorAll('[data-multi]').forEach(el => el.addEventListener('change', event => {
      const group = event.target.dataset.multi; const values = [...app.querySelectorAll(`[data-multi="${CSS.escape(group)}"]:checked`)].map(item => item.value); state.answers[group] = values;
      if (group === 'solution') state.solutionChoices = values;
      save(); render();
    }));
    app.querySelectorAll('[data-sort]').forEach(el => el.addEventListener('change', event => { state.sort[event.target.dataset.sort] = event.target.value; save(); render(); }));
    app.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', event => {
      const action = event.currentTarget.dataset.action;
      if (action === 'next') go(state.current + 1);
      if (action === 'prev') go(state.current - 1);
      if (action === 'reset' && confirm('Ștergi progresul acestei lecții de pe tabletă?')) { state = structuredClone(defaultState); save(); go(0, true); }
      if (action === 'finish') { state.completed = true; save(); render(); }
      if (action === 'check-order') { state.orderChecked = true; save(); render(); }
    }));
    app.querySelectorAll('[data-move]').forEach(el => el.addEventListener('click', event => {
      const from = Number(event.currentTarget.dataset.index); const to = event.currentTarget.dataset.move === 'up' ? from - 1 : from + 1;
      if (to < 0 || to >= state.order.length) return;
      [state.order[from], state.order[to]] = [state.order[to], state.order[from]]; state.orderChecked = false; save(); render();
    }));
    const zone = app.querySelector('[data-order-zone]');
    if (zone) {
      let dragging = null;
      zone.querySelectorAll('.order-card').forEach(card => {
        card.addEventListener('dragstart', () => { dragging = card.dataset.letter; card.classList.add('dragging'); });
        card.addEventListener('dragend', () => { dragging = null; card.classList.remove('dragging'); });
        card.addEventListener('dragover', event => event.preventDefault());
        card.addEventListener('drop', event => { event.preventDefault(); const target = card.dataset.letter; if (!dragging || dragging === target) return; const from = state.order.indexOf(dragging); const to = state.order.indexOf(target); state.order.splice(from, 1); state.order.splice(to, 0, dragging); state.orderChecked = false; save(); render(); });
      });
    }
  }

  window.addEventListener('popstate', () => { state.current = resolveStep(new URL(location.href).searchParams.get('step')); render(); });
  window.addEventListener('keydown', event => { if (event.altKey || event.ctrlKey || event.metaKey) return; if (event.key === 'ArrowRight' && state.current < steps.length - 1 && !['TEXTAREA','INPUT','SELECT'].includes(document.activeElement?.tagName)) go(state.current + 1); if (event.key === 'ArrowLeft' && state.current > 0 && !['TEXTAREA','INPUT','SELECT'].includes(document.activeElement?.tagName)) go(state.current - 1); });
  state.current = resolveStep(new URL(location.href).searchParams.get('step'));
  if (!new URL(location.href).searchParams.get('step')) go(state.current, true); else render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
})();

