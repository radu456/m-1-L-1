/* Lecția 8 – Povestea din 3 imagini. Aplicație locală, optimizată pentru tabletă. */
(() => {
  'use strict';

  const STORE = 'after-school:lectia-8:v1';
  const app = document.getElementById('app');
  const steps = [
    { id: 'start', label: 'Pornim aventura' },
    { id: 'story', label: 'Povestea Dariei' },
    { id: 'quiz', label: 'Verificăm povestea' },
    { id: 'detective', label: 'Detectiv de imagini' },
    { id: 'image1', label: 'Imaginea 1 · Începutul' },
    { id: 'image2', label: 'Imaginea 2 · Ce se întâmplă?' },
    { id: 'image3', label: 'Imaginea 3 · Finalul' },
    { id: 'connect', label: 'Legăm imaginile' },
    { id: 'crazy', label: 'Ideea trăsnită' },
    { id: 'final', label: 'Recapitulare' }
  ];

  const defaultState = {
    current: 0,
    answers: {},
    detective: [],
    image1: { start: '', detail: '' },
    image1Who: [],
    image1Why: [],
    image2: { sentence: '', detail: '' },
    image2Links: [],
    image3: { sentence: '', detail: '' },
    image3Links: [],
    connect: [],
    crazy: [],
    crazyText: '',
    verified: {},
    completed: false
  };

  const clone = value => {
    try { return structuredClone(value); } catch (_) { return JSON.parse(JSON.stringify(value)); }
  };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const merge = (base, extra) => {
    if (!extra || typeof extra !== 'object') return base;
    Object.keys(extra).forEach(key => {
      if (extra[key] && typeof extra[key] === 'object' && !Array.isArray(extra[key]) && base[key] && typeof base[key] === 'object') merge(base[key], extra[key]);
      else base[key] = extra[key];
    });
    return base;
  };
  function load() {
    try { return merge(clone(defaultState), JSON.parse(localStorage.getItem(STORE) || 'null') || {}); }
    catch (_) { return clone(defaultState); }
  }
  let state = load();
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (_) {} };
  const answer = (group, value) => state.answers[group] === value;
  const selected = (group, value) => Array.isArray(state[group]) && state[group].includes(value);
  const progress = () => Math.round(((state.current + 1) / steps.length) * 100);
  const currentStep = () => steps[state.current];

  function resolveStep(raw) {
    if (raw === null || raw === '') return clamp(Number(state.current) || 0, 0, steps.length - 1);
    if (/^\d+$/.test(raw)) return clamp(Number(raw), 0, steps.length - 1);
    const index = steps.findIndex(step => step.id === raw);
    return index >= 0 ? index : 0;
  }
  function go(index, replace = false) {
    state.current = clamp(index, 0, steps.length - 1);
    save();
    const url = new URL(location.href);
    url.searchParams.set('step', currentStep().id);
    history[replace ? 'replaceState' : 'pushState']({}, '', url);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const radio = (group, value, label) => `<label class="choice"><input type="radio" name="${esc(group)}" data-choice="${esc(group)}" value="${esc(value)}" ${answer(group, value) ? 'checked' : ''}><span>${label}</span></label>`;
  const checkbox = (group, value, label) => `<label class="choice"><input type="checkbox" data-multi="${esc(group)}" value="${esc(value)}" ${selected(group, value) ? 'checked' : ''}><span>${label}</span></label>`;
  const field = (path, label, placeholder, value) => `<label class="field-label">${esc(label)}<textarea data-field="${esc(path)}" placeholder="${esc(placeholder)}">${esc(value)}</textarea></label>`;

  function shell(content) {
    const step = currentStep();
    return `<div class="app-shell">
      <header class="topbar">
        <div class="brand"><div class="brand-mark" aria-hidden="true">🗺️</div><div><h1>Lecția 8 · Povestea din 3 imagini</h1><p>Privește, leagă și inventează · 8–9 ani</p></div></div>
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
      <div class="hero-copy"><p class="step-kicker">Misiunea zilei</p><h2>Povestea din 3 imagini</h2><p class="lead">Astăzi privim trei imagini și le transformăm într-o aventură cu sens. Fiecare detaliu poate deveni o idee importantă.</p><div class="tip"><strong>Regula povestitorului:</strong> nu există o singură poveste corectă. Explică legătura dintre imaginile tale.</div><button class="btn primary" data-action="next">Începem aventura 🚀</button></div>
      <div class="hero-art" aria-label="O pădure cu un castel luminat"><div class="night"><span class="tree one"></span><span class="tree two"></span><span class="tree three"></span><span class="castle"></span></div></div>
    </section>
    <section class="content-card"><p class="step-kicker">Obiective</p><h2>La final vei putea...</h2><div class="summary"><div class="summary-row"><strong>👀 Privești</strong><span>observi detalii într-o imagine.</span></div><div class="summary-row"><strong>🔗 Legi</strong><span>faci legături între elemente aparent diferite.</span></div><div class="summary-row"><strong>🧩 Construiești</strong><span>creezi o succesiune logică de început, mijloc și final.</span></div><div class="summary-row"><strong>✨ Inventezi</strong><span>umpli golurile dintre evenimente cu imaginația ta.</span></div></div></section>`;
  }

  function story() {
    return `<section class="content-card"><p class="step-kicker">2 · Povestea-model</p><h2>Cele trei imagini</h2><p class="intro">Citește povestea cu voce tare sau în liniște. Apoi vei putea verifica ce ai observat.</p><div class="story"><p>Într-o dimineață, Daria găsi pe biroul ei trei imagini.</p><p>Prima arăta o cheie aurie.</p><p>A doua arăta o pădure în care ningea.</p><p>A treia arăta un castel luminat în depărtare.</p><p class="quote">„Dar ce legătură au între ele?” se întrebă Daria.</p><p>Se uită din nou la imagini și își imagină o poveste: cheia deschidea o ușă ascunsă în pădure, iar dincolo de ușă se afla castelul.</p><p>Daria zâmbi. <strong>„Gata! Am găsit povestea!”</strong></p><p class="tip">✨ Uneori, o poveste începe atunci când găsim legătura dintre lucruri care par să nu aibă nicio legătură.</p></div><div class="three-images" aria-label="Cele trei imagini ale lecției"><div class="image-card"><div class="visual">🗝️</div><strong>Imaginea 1<br>Cheia aurie</strong></div><div class="image-card"><div class="visual">🌲❄️</div><strong>Imaginea 2<br>Pădurea cu ninsoare</strong></div><div class="image-card"><div class="visual">🏰</div><strong>Imaginea 3<br>Castelul luminat</strong></div></div></section>`;
  }

  const qData = [
    ['q1', 'Ce a găsit Daria pe birou?', [['books','Trei cărți'],['images','Trei imagini'],['keys','Trei chei'],['maps','Trei hărți']], 'images'],
    ['q2', 'Ce apărea în prima imagine?', [['castle','Un castel'],['forest','O pădure'],['key','O cheie aurie'],['dragon','Un dragon']], 'key'],
    ['q3', 'Ce apărea în a doua imagine?', [['house','O casă'],['snow-forest','O pădure în care ningea'],['city','Un oraș'],['cave','O peșteră']], 'snow-forest'],
    ['q4', 'Ce apărea în a treia imagine?', [['ship','O corabie'],['school','O școală'],['lit-castle','Un castel luminat'],['tower','Un turn de apă']], 'lit-castle'],
    ['q5', 'Cum a legat Daria cele trei imagini?', [['beside','Le-a pus una lângă alta.'],['favorite','A ales imaginea care îi plăcea cel mai mult.'],['door','Și-a imaginat că cheia deschidea o ușă spre castel.'],['draw','A desenat o altă imagine.']], 'door']
  ];
  function quiz() {
    const answered = qData.filter(q => state.answers[q[0]]).length;
    const correct = qData.filter(q => answer(q[0], q[3])).length;
    const verified=!!state.verified.quiz;
    return `<section class="content-card"><p class="step-kicker">3 · Înțelegerea poveștii</p><h2>Ce ai observat?</h2><p class="intro">Alege un răspuns la fiecare întrebare, apoi apasă „Verifică răspunsurile”.</p><div class="question-grid">${qData.map(([id, text, opts, good], i) => `<fieldset class="question"><legend>Întrebarea ${i + 1}. ${esc(text)}</legend><div class="choice-list">${opts.map(([v,label])=>{const picked=answer(id,v),right=v===good,cls=verified&&(picked||right)?(right?'is-correct':'is-wrong'):'';return `<label class="choice ${cls} ${verified&&right&&!picked?'correct-answer':''}"><input type="radio" name="${esc(id)}" data-choice="${esc(id)}" value="${esc(v)}" ${picked?'checked':''}><span>${esc(label)}</span>${verified&&right?'<span class="answer-mark">✓</span>':verified&&picked?'<span class="answer-mark">✕</span>':''}</label>`;}).join('')}</div>${verified?`<div class="answer-explanation ${answer(id,good)?'good':'bad'}">${answer(id,good)?'✅ Corect!':`❌ Răspunsul corect este: <strong>${esc(opts.find(o=>o[0]===good)?.[1]||'')}</strong>.`}</div>`:''}</fieldset>`).join('')}</div><button class="btn primary" data-action="check-quiz">Verifică răspunsurile</button>${verified?`<div class="feedback ${correct===qData.length?'good':'bad'}">Ai răspuns la ${answered}/${qData.length}. Corecte: ${correct}/${qData.length}. ${correct===qData.length?'🎉':'Răspunsurile corecte sunt verzi, iar cele greșite au explicația.'}</div>`:''}</section>`;
  }

  function detective() {
    const visible = ['see-trees', 'see-house', 'see-leaves', 'see-road', 'see-sky', 'see-animal', 'see-other'];
    const imagined = ['imagine-person', 'imagine-object', 'imagine-animal', 'imagine-room', 'imagine-tunnel', 'imagine-other'];
    const chosen = state.detective || [];
    const hasVisible = visible.some(item => chosen.includes(item));
    const hasImagined = imagined.some(item => chosen.includes(item));
    const verified=!!state.verified.detective;
    return `<section class="content-card"><p class="step-kicker">4 · Privește ca un detectiv</p><h2>Ce vezi și ce îți imaginezi?</h2><p class="intro">În imagine este o pădure cu o casă mică în mijloc. Poți selecta mai multe variante, apoi verifică dacă ai observat ambele tipuri de indicii.</p><div class="forest-scene" aria-label="O pădure cu o casă mică în mijloc"></div><h3>👀 Ce vezi?</h3><div class="choice-list">${checkbox('detective','see-trees','Copaci')}${checkbox('detective','see-house','O casă')}${checkbox('detective','see-leaves','Frunze')}${checkbox('detective','see-road','Un drum')}${checkbox('detective','see-sky','Cerul')}${checkbox('detective','see-animal','Un animal')}${checkbox('detective','see-other','Altceva')}</div><h3>💭 Ce crezi că nu se vede, dar ar putea fi acolo?</h3><div class="choice-list">${checkbox('detective','imagine-person','Cineva ascuns în casă')}${checkbox('detective','imagine-object','Un obiect secret')}${checkbox('detective','imagine-animal','Un animal care urmărește personajul')}${checkbox('detective','imagine-room','O cameră ascunsă')}${checkbox('detective','imagine-tunnel','Un tunel sub casă')}${checkbox('detective','imagine-other','Altceva')}</div><button class="btn primary" data-action="check-detective">Verifică observațiile</button>${verified?`<div class="answer-explanation ${hasVisible&&hasImagined?'good':'bad'}">${hasVisible&&hasImagined?'✅ Foarte bine! Ai notat cel puțin un detaliu vizibil și o posibilitate imaginată.':'💡 Nu există o singură soluție. Pentru verificare, alege cel puțin un lucru văzut și o posibilitate ascunsă.'}</div>`:''}</section>`;
  }

  function image1() {
    return `<section class="content-card"><p class="step-kicker">5 · Imaginea 1 · Începutul</p><h2>Ghiozdanul abandonat</h2><p class="intro">Privește imaginea: un ghiozdan abandonat lângă o bancă. Alege ideile care pot porni povestea.</p><div class="scene-visual" aria-label="Un ghiozdan abandonat lângă o bancă">🎒</div><h3>Cine a lăsat ghiozdanul acolo?</h3><div class="choice-list">${checkbox('image1Who','child','Un copil')}${checkbox('image1Who','explorer','Un explorator')}${checkbox('image1Who','alien','Un extraterestru')}${checkbox('image1Who','mystery','Un personaj misterios')}${checkbox('image1Who','other','Altă idee')}</div><h3>De ce a fost lăsat acolo?</h3><div class="choice-list">${checkbox('image1Why','forgotten','A fost uitat.')}${checkbox('image1Why','hidden','Cineva l-a ascuns.')}${checkbox('image1Why','running','Cineva fugea și nu a avut timp să-l ia.')}${checkbox('image1Why','secret','Ghiozdanul ascunde un secret.')}${checkbox('image1Why','other','Altă idee.')}</div>${field('image1.start','Completează: „Totul a început când…”','Continuă începutul aventurii.', state.image1.start)}<div class="tip">🔎 Un detaliu mic poate deveni un indiciu mare mai târziu.</div></section>`;
  }

  function image2() {
    return `<section class="content-card"><p class="step-kicker">6 · Imaginea 2 · Ce se întâmplă?</p><h2>Cheia uriașă</h2><p class="intro">A doua imagine arată o cheie uriașă într-un loc neașteptat. Alege una sau mai multe legături cu prima imagine.</p><div class="scene-visual" aria-label="O cheie uriașă">🗝️</div><div class="choice-list">${checkbox('image2Links','bag','Era în ghiozdan.')}${checkbox('image2Links','secret','Deschide un loc secret.')}${checkbox('image2Links','belongs','Aparține personajului.')}${checkbox('image2Links','intentional','A fost lăsată intenționat.')}${checkbox('image2Links','magic','Este o cheie magică.')}${checkbox('image2Links','invent','Inventez eu legătura.')}</div>${field('image2.sentence','Completează: „Atunci personajul a descoperit că…”','Ce află personajul?', state.image2.sentence)}<div class="tip">🧭 Un obiect important trebuie să aibă un rol în aventură.</div></section>`;
  }

  function image3() {
    return `<section class="content-card"><p class="step-kicker">7 · Imaginea 3 · Finalul</p><h2>Castelul luminat</h2><p class="intro">A treia imagine arată un castel luminat în mijlocul nopții. Cum este legat de aventură?</p><div class="scene-visual" aria-label="Un castel luminat în mijlocul nopții">🏰</div><div class="choice-list">${checkbox('image3Links','arrive','Acolo trebuie să ajungă personajul.')}${checkbox('image3Links','answer','Acolo se află răspunsul.')}${checkbox('image3Links','mystery','Acolo locuiește cineva misterios.')}${checkbox('image3Links','treasure','Acolo se află comoara.')}${checkbox('image3Links','new-adventure','Acolo începe o nouă aventură.')}${checkbox('image3Links','invent','Altă idee.')}</div>${field('image3.sentence','Completează: „În cele din urmă, personajul a ajuns…”','Unde și cum ajunge?', state.image3.sentence)}<div class="tip">🏰 Un final poate deschide o nouă aventură.</div></section>`;
  }

  function connect() {
    const good = ['bag-key', 'key-castle', 'find-after-bag', 'castle-secret', 'all-ideas'];
    const chosen = state.connect || [];
    const ok = chosen.length === good.length && good.every(item => chosen.includes(item));
    const verified=!!state.verified.connect, opts=[['bag-key','Ghiozdanul conține cheia.'],['key-castle','Cheia deschide castelul.'],['find-after-bag','Personajul găsește cheia după ce descoperă ghiozdanul.'],['castle-secret','Castelul ascunde secretul ghiozdanului.'],['all-ideas','Toate pot fi idei de poveste.']];
    return `<section class="content-card"><p class="step-kicker">8 · Leagă cele trei imagini</p><h2>Construiește legătura</h2><p class="intro">Ghiozdanul, cheia și castelul pot fi unite în mai multe feluri. Toate variantele de mai jos pot deveni idei de poveste; bifează-le și apasă „Verifică legăturile”.</p><div class="link-flow"><div class="flow-card"><span class="emoji">🎒</span>Ghiozdanul</div><div class="flow-arrow">↓</div><div class="flow-card"><span class="emoji">🗝️</span>Cheia</div><div class="flow-arrow">↓</div><div class="flow-card"><span class="emoji">🏰</span>Castelul</div></div><div class="choice-list">${opts.map(([v,l])=>{const picked=chosen.includes(v),cls=verified?(picked?'is-correct':'correct-answer'):'';return `<label class="choice ${cls}"><input type="checkbox" data-multi="connect" value="${v}" ${picked?'checked':''}><span>${l}</span>${verified?'<span class="answer-mark">✓</span>':''}</label>`;}).join('')}</div><button class="btn primary" data-action="check-connect">Verifică legăturile</button>${verified?`<div class="answer-explanation ${ok?'good':'bad'}">${ok?'✅ Exact! Toate cele cinci sunt legături posibile.':'💡 Verde = idei bifate. Toate cele cinci variante pot deveni legături de poveste; bifează-le pe toate pentru feedback complet.'}</div>`:''}</section>`;
  }

  function crazy() {
    const good = ['banana', 'rocket', 'penguin'];
    const chosen = state.crazy || [];
    return `<section class="content-card"><p class="step-kicker">9 · Ideea trăsnită</p><h2>Adaugă ceva neașteptat</h2><p class="intro">Bifează elementele pe care ai vrea să le introduci în poveste și explică în câteva cuvinte cum apar.</p><div class="choice-list">${checkbox('crazy','banana','🍌 O banană care vorbește')}${checkbox('crazy','rocket','🚀 O rachetă ascunsă în castel')}${checkbox('crazy','penguin','🐧 Un pinguin care știe drumul')}</div>${field('crazyText','Continuarea mea trăsnită','Ce face Daria când apare ideea ta?', state.crazyText)}<div class="tip">✨ O idee amuzantă devine poveste când explici de ce apare și ce schimbă.</div>${chosen.length ? `<div class="feedback good">Ai ales ${chosen.length} element${chosen.length === 1 ? '' : 'e'} pentru scena ta. ${chosen.length === good.length ? 'Excelent, ai folosit toate cele trei idei!' : 'Mai poți adăuga și alte elemente.'}</div>` : ''}</section>`;
  }

  function final() {
    const correct = qData.filter(q => answer(q[0], q[3])).length;
    const written = [state.image1.start, state.image2.sentence, state.image3.sentence, state.crazyText].filter(value => String(value).trim()).length;
    return `<section class="content-card"><p class="step-kicker">10 · Recapitulare</p><h2>Ai creat o poveste din trei imagini!</h2><p class="intro">Uită-te la ideile tale și povestește-le unui coleg sau unui adult.</p><div class="summary"><div class="summary-row"><strong>🧠 Quiz</strong><span>${correct}/5 răspunsuri corecte</span></div><div class="summary-row"><strong>🔎 Indicii</strong><span>${(state.detective || []).length} idei selectate</span></div><div class="summary-row"><strong>✍️ Idei scrise</strong><span>${written} răspunsuri personale</span></div><div class="summary-row"><strong>🔗 Legături</strong><span>${(state.connect || []).length}/5 idei selectate</span></div><div class="summary-row"><strong>✨ Element trăsnit</strong><span>${(state.crazy || []).length ? 'adăugat' : 'încă de ales'}</span></div></div><h3>Firul poveștii</h3><div class="three-images"><div class="image-card"><div class="visual">🗝️</div><strong>Cheia aurie</strong></div><div class="image-card"><div class="visual">🌲❄️</div><strong>Pădurea cu ninsoare</strong></div><div class="image-card"><div class="visual">🏰</div><strong>${esc(state.image3.sentence || 'Castelul luminat')}</strong></div></div>${state.completed ? '<div class="feedback good">🎉 Lecția este salvată pe această tabletă. Poți reveni oricând.</div>' : '<div class="tip">Când ești gata, apasă „Salvează lecția”. Ideile rămân pe tabletă, chiar dacă revii mai târziu.</div>'}</section>`;
  }

  function render() {
    const id = currentStep().id;
    const content = ({ start, story, quiz, detective, image1, image2, image3, connect, crazy, final })[id]();
    app.innerHTML = shell(content);
    bind();
  }

  function setPath(path, value) {
    const parts = path.split('.');
    if (parts.length === 2 && state[parts[0]] && typeof state[parts[0]] === 'object') state[parts[0]][parts[1]] = value;
    else state[path] = value;
  }
  function bind() {
    app.querySelectorAll('[data-field]').forEach(el => el.addEventListener('input', event => { setPath(event.target.dataset.field, event.target.value); save(); }));
    app.querySelectorAll('[data-choice]').forEach(el => el.addEventListener('change', event => { state.answers[event.target.dataset.choice] = event.target.value; state.verified.quiz=false; save(); render(); }));
    app.querySelectorAll('[data-multi]').forEach(el => el.addEventListener('change', event => {
      const group = event.target.dataset.multi;
      const values = [...app.querySelectorAll(`[data-multi="${CSS.escape(group)}"]:checked`)].map(item => item.value);
      state[group] = values; if (['detective','connect'].includes(group)) state.verified[group]=false; save(); render();
    }));
    app.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', event => {
      const action = event.currentTarget.dataset.action;
      if (action === 'next') go(state.current + 1);
      if (action === 'prev') go(state.current - 1);
      if (action === 'reset' && window.confirm('Ștergi progresul acestei lecții de pe tabletă?')) { state = clone(defaultState); save(); go(0, true); }
      if (action === 'finish') { state.completed = true; save(); render(); }
      if (action === 'check-quiz') { state.verified.quiz=true; save(); render(); }
      if (action === 'check-detective') { state.verified.detective=true; save(); render(); }
      if (action === 'check-connect') { state.verified.connect=true; save(); render(); }
    }));
  }

  window.addEventListener('popstate', () => { state.current = resolveStep(new URL(location.href).searchParams.get('step')); render(); });
  window.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || ['TEXTAREA', 'INPUT', 'SELECT'].includes(document.activeElement?.tagName)) return;
    if (event.key === 'ArrowRight' && state.current < steps.length - 1) go(state.current + 1);
    if (event.key === 'ArrowLeft' && state.current > 0) go(state.current - 1);
  });
  state.current = resolveStep(new URL(location.href).searchParams.get('step'));
  if (!new URL(location.href).searchParams.get('step')) go(state.current, true); else render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
})();

