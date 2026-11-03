/* UniLife — App funcional offline */
const KEYS = {
  tasks: 'ul_tasks',
  subjects: 'ul_subjects',
  events: 'ul_events',
  savings: 'ul_savings',
  transactions: 'ul_tx',
  pet: 'ul_pet',
  myTuts: 'ul_my_tuts',
  enrolled: 'ul_enrolled',
  sessions: 'ul_sessions',
  faithFavs: 'ul_faith_favs'
};

const PET_STAGES = ['🐣', '🐥', '🐤', '🐦', '🦉', '🦅', '🐉'];
const PET_NAMES  = ['Cubby', 'Pipo', 'Nube', 'Sapo', 'Luna', 'Fénix', 'Draco'];

const TIPS = [
  'Respira profundo. Este momento pasará. Eres más fuerte de lo que crees.',
  'No tienes que hacerlo todo perfecto. El progreso vale más que la perfección.',
  'Hablar con alguien de confianza alivia una gran carga. No estás solo/a.',
  'Duerme al menos 7 horas. Tu cerebro estudia mejor cuando descansa.',
  'Camina 10 minutos. El movimiento reduce el estrés.',
  'Escribe lo que te preocupa. Sacar los pensamientos ayuda a ordenarlos.',
  'Come algo nutritivo. Cuerpo y mente trabajan juntos.',
  'Celebra las pequeñas victorias. Cada tarea terminada cuenta.',
  'Está bien pedir ayuda. Compañeros y profesores están para eso.',
  'Desconecta de redes 30 minutos. Tu atención te lo agradecerá.',
  'Bebe agua. La deshidratación aumenta la fatiga.',
  'Recuerda por qué empezaste. Tu “por qué” te da fuerza.'
];

const MONEY_TIPS = [
  'Regla 50/30/20: 50% necesidades, 30% deseos, 20% ahorro.',
  'Ahorra primero, gasta después. Incluso $5 al día suman.',
  'Lleva registro de gastos una semana. Te sorprenderás.',
  'Cocina en casa. Comer fuera se acumula rápido.',
  'Usa descuentos y precios de estudiante siempre que puedas.',
  'Evita deudas de tarjetas para gastos no esenciales.',
  'Fondo de emergencia de al menos $200–500 para imprevistos.',
  'Antes de comprar, espera 24 h. Muchas veces se pasa el impulso.',
  'Comparte libros o materiales con compañeros cuando sea posible.',
  'Busca becas y ayudas. Muchas universidades tienen recursos poco conocidos.'
];

let state = {
  tasks: [],
  subjects: [],
  events: [],
  savings: 0,
  transactions: [],
  pet: { name: 'Cubby', level: 1, xp: 0, stage: 0 },
  myTuts: [],
  enrolled: [],
  faithFavs: [],
  sessionsToday: 0,
  currentMonth: new Date(),
  selectedDate: null,
  timer: {
    mode: 'focus',
    running: false,
    secondsLeft: 25 * 60,
    totalSeconds: 25 * 60,
    interval: null,
    focus: 25,
    short: 5,
    long: 15
  }
};

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  load();
  setupTheme();
  setupNav();
  setupCalendar();
  setupSchedule();
  setupTasks();
  setupEmotional();
  setupFaith();
  setupWallet();
  setupPomodoro();
  setupTutorials();
  setupModal();
  updateDashboard();
  updatePet();
  setGreeting();
  setDailyTip();
});

/* ---------- Theme (light / dark) ---------- */
function setupTheme() {
  const btn = document.getElementById('theme-btn');
  const meta = document.getElementById('meta-theme');
  const apply = (dark) => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (btn) btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
      if (meta) meta.setAttribute('content', '#161C19');
      try { localStorage.setItem('ul_theme', 'dark'); } catch (e) {}
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (btn) btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 14.5A8.5 8.5 0 119.5 3 7 7 0 0021 14.5z"/></svg>';
      if (meta) meta.setAttribute('content', '#F6F1E9');
      try { localStorage.setItem('ul_theme', 'light'); } catch (e) {}
    }
  };
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
  apply(isDark());
  if (btn) btn.addEventListener('click', () => apply(!isDark()));
}

function load() {
  state.tasks = JSON.parse(localStorage.getItem(KEYS.tasks) || '[]');
  state.subjects = JSON.parse(localStorage.getItem(KEYS.subjects) || '[]');
  state.events = JSON.parse(localStorage.getItem(KEYS.events) || '[]');
  state.savings = parseFloat(localStorage.getItem(KEYS.savings) || '0');
  state.transactions = JSON.parse(localStorage.getItem(KEYS.transactions) || '[]');
  state.pet = JSON.parse(localStorage.getItem(KEYS.pet) || JSON.stringify(state.pet));
  state.myTuts = JSON.parse(localStorage.getItem(KEYS.myTuts) || '[]');
  state.enrolled = JSON.parse(localStorage.getItem(KEYS.enrolled) || '[]');
  state.faithFavs = JSON.parse(localStorage.getItem(KEYS.faithFavs) || '[]');
  const sd = JSON.parse(localStorage.getItem(KEYS.sessions) || '{}');
  state.sessionsToday = sd.date === new Date().toDateString() ? sd.count : 0;
}

function save(k) {
  const map = {
    tasks: () => localStorage.setItem(KEYS.tasks, JSON.stringify(state.tasks)),
    subjects: () => localStorage.setItem(KEYS.subjects, JSON.stringify(state.subjects)),
    events: () => localStorage.setItem(KEYS.events, JSON.stringify(state.events)),
    savings: () => localStorage.setItem(KEYS.savings, state.savings),
    transactions: () => localStorage.setItem(KEYS.transactions, JSON.stringify(state.transactions)),
    pet: () => localStorage.setItem(KEYS.pet, JSON.stringify(state.pet)),
    myTuts: () => localStorage.setItem(KEYS.myTuts, JSON.stringify(state.myTuts)),
    enrolled: () => localStorage.setItem(KEYS.enrolled, JSON.stringify(state.enrolled)),
    faithFavs: () => localStorage.setItem(KEYS.faithFavs, JSON.stringify(state.faithFavs)),
    sessions: () => localStorage.setItem(KEYS.sessions, JSON.stringify({
      date: new Date().toDateString(), count: state.sessionsToday
    }))
  };
  map[k]?.();
}

/* ---------- Navigation ---------- */
function setupNav() {
  const titles = {
    dashboard: 'Inicio',
    calendar: 'Calendario',
    emotional: 'Apoyo emocional',
    faith: 'Palabra',
    wallet: 'Billetera',
    pomodoro: 'Pomodoro',
    tutorials: 'Tutorías'
  };

  function go(section) {
    document.querySelectorAll('.nav-item, .bn-item').forEach(el => {
      el.classList.toggle('active', el.dataset.section === section);
    });
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + section).classList.add('active');
    document.getElementById('page-title').textContent = titles[section] || section;
    closeSidebar();
    if (section === 'dashboard') updateDashboard();
    if (section === 'calendar') renderCalendar();
  }

  document.querySelectorAll('.nav-item, .bn-item').forEach(btn => {
    btn.addEventListener('click', () => go(btn.dataset.section));
  });

  document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-overlay').classList.add('open');
  });
  document.getElementById('sidebar-close').addEventListener('click', closeSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

  // Segmented tabs
  document.querySelectorAll('.segmented').forEach(group => {
    group.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const parent = group.closest('.section');
        parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.getElementById(btn.dataset.tab)?.classList.add('active');
      });
    });
  });
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

/* ---------- Pet ---------- */
function addXP(n) {
  state.pet.xp += n;
  const need = state.pet.level * 100;
  if (state.pet.xp >= need) {
    state.pet.xp -= need;
    state.pet.level++;
    state.pet.stage = Math.min(state.pet.stage + 1, PET_STAGES.length - 1);
    state.pet.name = PET_NAMES[state.pet.stage] || state.pet.name;
    toast(`¡Tu mascota subió al nivel ${state.pet.level}! ${PET_STAGES[state.pet.stage]}`);
  }
  save('pet');
  updatePet();
}

function updatePet() {
  const stage = PET_STAGES[state.pet.stage] || '🐣';
  document.getElementById('pet-avatar').textContent = stage;
  document.getElementById('pet-display').textContent = stage;
  document.getElementById('pet-name').textContent = state.pet.name;
  document.getElementById('pet-level').textContent = `Nivel ${state.pet.level}`;
  document.getElementById('pet-level-big').textContent = state.pet.level;
  const need = state.pet.level * 100;
  document.getElementById('pet-xp').textContent = `${state.pet.xp} / ${need} XP`;
  document.getElementById('xp-fill').style.width = `${(state.pet.xp / need) * 100}%`;
  const mottos = [
    '¡Completa tareas para crecer!',
    '¡Vas muy bien, sigue así!',
    '¡Cada entrega me hace más fuerte!',
    '¡Eres un estudiante ejemplar!',
    '¡Juntos conquistamos el semestre!'
  ];
  document.getElementById('pet-motto').textContent = mottos[Math.min(state.pet.level - 1, mottos.length - 1)];
}

/* ---------- Dashboard ---------- */
function updateDashboard() {
  const pending = state.tasks.filter(t => !t.completed).length;
  const done = state.tasks.filter(t => t.completed).length;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-completed').textContent = done;
  document.getElementById('stat-savings').textContent = `$${state.savings.toFixed(0)}`;

  const now = new Date();
  const upcoming = state.tasks
    .filter(t => !t.completed && new Date(t.date + 'T' + (t.time || '23:59')) >= now)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const ul = document.getElementById('upcoming-list');
  ul.innerHTML = upcoming.length
    ? upcoming.map(t => `<li><span>${esc(t.title)}</span><span class="badge ${t.type}">${fmtDate(t.date)}</span></li>`).join('')
    : '<li class="empty">No hay actividades próximas</li>';

  const day = (now.getDay() + 6) % 7;
  const todayS = state.subjects.filter(s => +s.day === day).sort((a, b) => a.start.localeCompare(b.start));
  const sl = document.getElementById('today-schedule');
  sl.innerHTML = todayS.length
    ? todayS.map(s => `<li><span><strong>${esc(s.name)}</strong>${s.room ? ' · ' + esc(s.room) : ''}</span><span>${s.start}–${s.end}</span></li>`).join('')
    : '<li class="empty">Sin clases hoy</li>';
}

function setGreeting() {
  const h = new Date().getHours();
  const g = h < 12 ? '¡Buenos días!' : h < 19 ? '¡Buenas tardes!' : '¡Buenas noches!';
  document.getElementById('greeting').textContent = g + ' 👋';
}

function setDailyTip() {
  const d = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  document.getElementById('daily-tip-text').textContent = TIPS[d % TIPS.length];
}

/* ---------- Calendar ---------- */
function setupCalendar() {
  document.getElementById('prev-month').addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
    renderCalendar();
  });
  document.getElementById('next-month').addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
    renderCalendar();
  });
  document.getElementById('add-event-btn').addEventListener('click', openEventModal);
  renderCalendar();
}

function renderCalendar() {
  const y = state.currentMonth.getFullYear();
  const m = state.currentMonth.getMonth();
  document.getElementById('current-month').textContent =
    state.currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const first = new Date(y, m, 1);
  const start = (first.getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();

  const names = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  let html = names.map(n => `<div class="cal-day-name">${n}</div>`).join('');

  for (let i = start - 1; i >= 0; i--) {
    html += `<div class="cal-day other">${prevDays - i}</div>`;
  }

  const today = new Date();
  for (let d = 1; d <= days; d++) {
    const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
    const has = state.tasks.some(t => t.date === ds) || state.events.some(e => e.date === ds);
    const sel = state.selectedDate === ds;
    html += `<div class="cal-day${isToday ? ' today' : ''}${has ? ' has-event' : ''}${sel ? ' selected' : ''}" data-date="${ds}">${d}</div>`;
  }

  const total = start + days;
  const rem = (7 - (total % 7)) % 7;
  for (let i = 1; i <= rem; i++) html += `<div class="cal-day other">${i}</div>`;

  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = html;
  grid.querySelectorAll('.cal-day:not(.other)').forEach(el => {
    el.addEventListener('click', () => {
      state.selectedDate = el.dataset.date;
      renderCalendar();
      showDayEvents(el.dataset.date);
    });
  });
}

function showDayEvents(ds) {
  document.getElementById('day-detail-title').textContent = `Eventos · ${fmtDate(ds)}`;
  const tasks = state.tasks.filter(t => t.date === ds);
  const events = state.events.filter(e => e.date === ds);
  const all = [...tasks.map(t => ({ ...t, kind: 'task' })), ...events.map(e => ({ ...e, kind: 'event' }))];
  const list = document.getElementById('day-events-list');
  list.innerHTML = all.length
    ? all.map(i => `<li><span><strong>${esc(i.title)}</strong>${i.time ? ' · ' + i.time : ''}</span>${i.type ? `<span class="badge ${i.type}">${i.type}</span>` : ''}</li>`).join('')
    : '<li class="empty">Sin eventos este día</li>';
}

function openEventModal() {
  document.getElementById('modal-body').innerHTML = `
    <h3>Agregar fecha importante</h3>
    <form id="event-form" class="form">
      <input type="text" id="ev-title" placeholder="Título" required />
      <div class="form-row">
        <input type="date" id="ev-date" required value="${state.selectedDate || new Date().toISOString().slice(0,10)}" />
        <input type="time" id="ev-time" />
      </div>
      <textarea id="ev-notes" placeholder="Notas (opcional)" rows="2"></textarea>
      <button type="submit" class="btn btn-primary" style="width:100%">Guardar</button>
    </form>`;
  openModal();
  document.getElementById('event-form').addEventListener('submit', e => {
    e.preventDefault();
    state.events.push({
      id: Date.now().toString(),
      title: document.getElementById('ev-title').value.trim(),
      date: document.getElementById('ev-date').value,
      time: document.getElementById('ev-time').value,
      notes: document.getElementById('ev-notes').value.trim()
    });
    save('events');
    closeModal();
    renderCalendar();
    toast('Fecha agregada');
  });
}

/* ---------- Schedule ---------- */
function setupSchedule() {
  document.getElementById('subject-form').addEventListener('submit', e => {
    e.preventDefault();
    state.subjects.push({
      id: Date.now().toString(),
      name: document.getElementById('subject-name').value.trim(),
      day: document.getElementById('subject-day').value,
      start: document.getElementById('subject-start').value,
      end: document.getElementById('subject-end').value,
      room: document.getElementById('subject-room').value.trim()
    });
    save('subjects');
    e.target.reset();
    renderSubjects();
    updateDashboard();
    toast('Materia registrada');
  });
  renderSubjects();
}

function renderSubjects() {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const list = document.getElementById('subjects-list');
  if (!state.subjects.length) {
    list.innerHTML = '<li class="empty">Aún no registras materias</li>';
    return;
  }
  list.innerHTML = state.subjects
    .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start))
    .map(s => `
      <li>
        <div class="item-info">
          <div class="item-title">${esc(s.name)}</div>
          <div class="item-meta">${days[s.day]} · ${s.start}–${s.end}${s.room ? ' · ' + esc(s.room) : ''}</div>
        </div>
        <button class="btn-delete" data-id="${s.id}" aria-label="Eliminar">🗑️</button>
      </li>`).join('');

  list.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      state.subjects = state.subjects.filter(s => s.id !== btn.dataset.id);
      save('subjects');
      renderSubjects();
      updateDashboard();
    });
  });
}

/* ---------- Tasks ---------- */
function setupTasks() {
  document.getElementById('task-form').addEventListener('submit', e => {
    e.preventDefault();
    const task = {
      id: Date.now().toString(),
      title: document.getElementById('task-title').value.trim(),
      type: document.getElementById('task-type').value,
      date: document.getElementById('task-date').value,
      time: document.getElementById('task-time').value || '23:59',
      notes: document.getElementById('task-notes').value.trim(),
      completed: false
    };
    state.tasks.push(task);
    save('tasks');
    e.target.reset();
    document.getElementById('task-time').value = '23:59';
    renderTasks();
    updateDashboard();
    renderCalendar();
    toast('Actividad guardada');
  });
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('tasks-list');
  if (!state.tasks.length) {
    list.innerHTML = '<li class="empty">No hay actividades aún</li>';
    return;
  }
  list.innerHTML = state.tasks
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(t => `
      <li style="${t.completed ? 'opacity:0.5' : ''}">
        <div class="item-info">
          <div class="item-title">${t.completed ? '✅ ' : ''}${esc(t.title)}</div>
          <div class="item-meta"><span class="badge ${t.type}">${t.type}</span> ${fmtDate(t.date)}${t.time !== '23:59' ? ' · ' + t.time : ''}</div>
        </div>
        <div style="display:flex;gap:0.35rem;flex-shrink:0">
          ${!t.completed ? `<button class="btn-complete" data-id="${t.id}">Hecho</button>` : ''}
          <button class="btn-delete" data-id="${t.id}">🗑️</button>
        </div>
      </li>`).join('');

  list.querySelectorAll('.btn-complete').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = state.tasks.find(x => x.id === btn.dataset.id);
      if (t) {
        t.completed = true;
        save('tasks');
        addXP(25);
        renderTasks();
        updateDashboard();
        toast('¡Completada! +25 XP 🎉');
      }
    });
  });
  list.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      state.tasks = state.tasks.filter(t => t.id !== btn.dataset.id);
      save('tasks');
      renderTasks();
      updateDashboard();
      renderCalendar();
    });
  });
}

/* ---------- Emotional ---------- */
function setupEmotional() {
  let timer = null;
  let phase = 0;
  const circle = document.getElementById('breath-circle');
  const text = document.getElementById('breath-text');

  document.getElementById('start-breath').addEventListener('click', () => {
    document.getElementById('start-breath').disabled = true;
    document.getElementById('stop-breath').disabled = false;
    phase = 0;
    cycle();
  });

  document.getElementById('stop-breath').addEventListener('click', () => {
    clearTimeout(timer);
    circle.className = 'breath-circle';
    text.textContent = 'Listo';
    document.getElementById('start-breath').disabled = false;
    document.getElementById('stop-breath').disabled = true;
  });

  function cycle() {
    circle.className = 'breath-circle';
    if (phase === 0) {
      text.textContent = 'Inhala…';
      circle.classList.add('inhale');
      timer = setTimeout(() => { phase = 1; cycle(); }, 4000);
    } else if (phase === 1) {
      text.textContent = 'Sostén…';
      circle.classList.add('hold');
      timer = setTimeout(() => { phase = 2; cycle(); }, 7000);
    } else {
      text.textContent = 'Exhala…';
      circle.classList.add('exhale');
      timer = setTimeout(() => { phase = 0; cycle(); }, 8000);
    }
  }

  document.getElementById('emotional-tip').innerHTML = `<p>${TIPS[Math.floor(Math.random() * TIPS.length)]}</p>`;
  document.getElementById('new-tip-btn').addEventListener('click', () => {
    document.getElementById('emotional-tip').innerHTML = `<p>${TIPS[Math.floor(Math.random() * TIPS.length)]}</p>`;
  });

  const feedbacks = {
    great: '¡Qué bueno! Aprovecha esa energía 💪',
    good: 'Me alegra. Sigue cuidándote 🌱',
    ok: 'Está bien sentirse regular. Prueba la respiración.',
    bad: 'Lamento que te sientas así. Buscar apoyo es valiente.',
    awful: 'No estás solo/a. Habla con alguien de confianza.'
  };
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('mood-feedback').textContent = feedbacks[btn.dataset.mood];
    });
  });
}

/* ---------- Fe / Palabra (cristiano) ---------- */
const FAITH_VERSES = [
  { id: 'v1', topic: 'animo', ref: 'Josué 1:9', text: 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.', note: 'No caminas solo en el semestre: Dios va contigo a cada clase y entrega.' },
  { id: 'v2', topic: 'paz', ref: 'Filipenses 4:6-7', text: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.', note: 'La ansiedad por el examen puede volverse oración. Su paz guarda la mente.' },
  { id: 'v3', topic: 'fortaleza', ref: 'Isaías 40:31', text: 'Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.', note: 'Cuando el cansancio llega, esperar en Él renueva fuerzas reales.' },
  { id: 'v4', topic: 'estudio', ref: 'Proverbios 2:6', text: 'Porque Jehová da la sabiduría, y de su boca viene el conocimiento y la inteligencia.', note: 'Estudiar con dedicación y pedir sabiduría van de la mano.' },
  { id: 'v5', topic: 'ansiedad', ref: '1 Pedro 5:7', text: 'Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.', note: 'No tienes que cargar solo el estrés: Él se interesa por ti.' },
  { id: 'v6', topic: 'identidad', ref: 'Salmo 139:14', text: 'Te alabaré; porque formidables, maravillosas son tus obras; estoy maravillado, y mi alma lo sabe muy bien.', note: 'Tu valor no depende de la nota: fuiste creado con propósito.' },
  { id: 'v7', topic: 'animo', ref: 'Romanos 8:28', text: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.', note: 'Aun lo difícil del semestre puede obrar para bien en sus manos.' },
  { id: 'v8', topic: 'paz', ref: 'Juan 14:27', text: 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.', note: 'Su paz no depende de que todo salga perfecto.' },
  { id: 'v9', topic: 'fortaleza', ref: 'Filipenses 4:13', text: 'Todo lo puedo en Cristo que me fortalece.', note: 'La fuerza para seguir no sale solo de ti: viene de Cristo.' },
  { id: 'v10', topic: 'estudio', ref: 'Colosenses 3:23', text: 'Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.', note: 'Cada tarea puede ser un acto de fidelidad, no solo un requisito.' },
  { id: 'v11', topic: 'ansiedad', ref: 'Mateo 6:34', text: 'Así que, no os afanéis por el día de mañana, porque el día de mañana traerá su afán. Basta a cada día su propio mal.', note: 'Hoy: estudia y confía. Mañana también estará bajo su cuidado.' },
  { id: 'v12', topic: 'identidad', ref: 'Efesios 2:10', text: 'Porque somos hechura suya, creados en Cristo Jesús para buenas obras, las cuales Dios preparó de antemano para que anduviésemos en ellas.', note: 'Eres obra de Dios, con un camino preparado incluso en la universidad.' },
  { id: 'v13', topic: 'animo', ref: 'Salmo 46:1', text: 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.', note: 'En la crisis de tiempo o de ánimo, Él es refugio cercano.' },
  { id: 'v14', topic: 'paz', ref: 'Salmo 23:1-2', text: 'Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.', note: 'Él también te lleva a descanso, no solo a esfuerzo.' },
  { id: 'v15', topic: 'fortaleza', ref: '2 Corintios 12:9', text: 'Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad.', note: 'Reconocer límites no es fracaso: es espacio para su gracia.' },
  { id: 'v16', topic: 'estudio', ref: 'Santiago 1:5', text: 'Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche, y le será dada.', note: 'Antes del parcial, también puedes pedir claridad y sabiduría.' },
  { id: 'v17', topic: 'ansiedad', ref: 'Salmo 55:22', text: 'Echa sobre Jehová tu carga, y él te sustentará; no dejará para siempre caído al justo.', note: 'Suelta la carga en oración; Él sostiene.' },
  { id: 'v18', topic: 'identidad', ref: '1 Juan 3:1', text: 'Mirad cuál amor nos ha dado el Padre, para que seamos llamados hijos de Dios.', note: 'Tu identidad más profunda es ser hijo o hija amada de Dios.' },
  { id: 'v19', topic: 'animo', ref: 'Deuteronomio 31:6', text: 'Esforzaos y cobrad ánimo; no temáis, ni tengáis miedo de ellos, porque Jehová tu Dios es el que va contigo; no te dejará, ni te desamparará.', note: 'Cuando el grupo o el semestre intimiden, recuerda: Él no te abandona.' },
  { id: 'v20', topic: 'paz', ref: 'Isaías 26:3', text: 'Tú guardarás en completa paz a aquel cuyo pensamiento en ti persevera; porque en ti ha confiado.', note: 'Fijar la mente en Él trae una paz que el estrés académico no puede dar.' },
  { id: 'v21', topic: 'fortaleza', ref: 'Efesios 6:10', text: 'Por lo demás, hermanos míos, fortaleceos en el Señor, y en el poder de su fuerza.', note: 'La energía para el día no tiene que salir solo de cafeína: también de Él.' },
  { id: 'v22', topic: 'estudio', ref: 'Proverbios 16:3', text: 'Encomienda a Jehová tus obras, y tus pensamientos serán afirmados.', note: 'Entrega el plan de estudio y deja que Él afirme tus decisiones.' },
  { id: 'v23', topic: 'ansiedad', ref: 'Juan 16:33', text: 'Estas cosas os he hablado para que en mí tengáis paz. En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo.', note: 'Habrá presión, pero la última palabra no la tiene el mundo.' },
  { id: 'v24', topic: 'identidad', ref: 'Gálatas 2:20', text: 'Con Cristo estoy juntamente crucificado, y ya no vivo yo, mas vive Cristo en mí.', note: 'Tu historia no termina en el promedio: Cristo vive en ti.' },
  { id: 'v25', topic: 'animo', ref: '2 Timoteo 1:7', text: 'Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.', note: 'El miedo al fracaso no viene de Él; Él da poder y dominio propio.' },
  { id: 'v26', topic: 'paz', ref: 'Colosenses 3:15', text: 'Y la paz de Dios gobierne en vuestros corazones, a la que asimismo fuisteis llamados en un solo cuerpo; y sed agradecidos.', note: 'Deja que su paz “gobierne” el día, no solo el reloj de entregas.' },
  { id: 'v27', topic: 'fortaleza', ref: 'Salmo 28:7', text: 'Jehová es mi fortaleza y mi escudo; en él confió mi corazón, y fui ayudado.', note: 'Puedes apoyarte en Él como escudo cuando todo se acumula.' },
  { id: 'v28', topic: 'estudio', ref: 'Proverbios 4:7', text: 'Sabiduría ante todo; adquiere sabiduría; y sobre todas tus posesiones adquiere inteligencia.', note: 'Buscar entender de verdad vale más que solo memorizar para el examen.' },
  { id: 'v29', topic: 'ansiedad', ref: 'Mateo 11:28', text: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.', note: 'Él invita a los agotados. Incluye a los estudiantes en época de finales.' },
  { id: 'v30', topic: 'identidad', ref: 'Jeremías 29:11', text: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.', note: 'Hay un futuro de paz en sus planes, más allá de este parcial.' },
  { id: 'v31', topic: 'animo', ref: 'Salmo 27:1', text: 'Jehová es mi luz y mi salvación; ¿de quién temeré? Jehová es la fuerza de mi vida; ¿de quién he de atemorizarme?', note: 'La oscuridad de la incertidumbre no es más fuerte que su luz.' },
  { id: 'v32', topic: 'paz', ref: 'Romanos 15:13', text: 'Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo.', note: 'La esperanza no es ingenua: viene del Espíritu en ti.' },
  { id: 'v33', topic: 'fortaleza', ref: 'Nehemías 8:10', text: 'No os entristezcáis, porque el gozo de Jehová es vuestra fortaleza.', note: 'A veces la fuerza llega con gozo, no solo con disciplina rígida.' },
  { id: 'v34', topic: 'estudio', ref: 'Eclesiastés 9:10', text: 'Todo lo que te viniere a la mano para hacer, hazlo según tus fuerzas.', note: 'Da lo mejor con lo que tienes hoy; eso también honra a Dios.' },
  { id: 'v35', topic: 'ansiedad', ref: 'Salmo 94:19', text: 'En la multitud de mis pensamientos dentro de mí, tus consolaciones alegraban mi alma.', note: 'Cuando la mente no para, su consuelo puede alegrar el alma.' },
  { id: 'v36', topic: 'identidad', ref: 'Isaías 43:1', text: 'Ahora, así dice Jehová, Creador tuyo, oh Jacob, y Formador tuyo, oh Israel: No temas, porque yo te redimí; te puse nombre, mío eres tú.', note: 'Él te conoce por nombre. No eres solo un número de lista.' },
  { id: 'v37', topic: 'animo', ref: 'Hebreos 13:5', text: 'Contentos con lo que tenéis ahora; porque él dijo: No te desampararé, ni te dejaré.', note: 'Promesa firme para noches de estudio y temporadas difíciles.' },
  { id: 'v38', topic: 'paz', ref: '2 Tesalonicenses 3:16', text: 'Y el mismo Señor de paz os dé siempre paz en toda manera. El Señor sea con todos vosotros.', note: 'Pide paz “en toda manera”: en el aula, en casa y en el corazón.' },
  { id: 'v39', topic: 'fortaleza', ref: 'Salmo 18:32', text: 'Dios es el que me ciñe de poder, y quien hace perfecto mi camino.', note: 'Él equipa el camino, no solo el destino.' },
  { id: 'v40', topic: 'estudio', ref: 'Proverbios 18:15', text: 'El corazón del entendido adquiere sabiduría; y el oído de los sabios busca la ciencia.', note: 'Ser buen estudiante también es un oído dispuesto a aprender.' },
  { id: 'v41', topic: 'ansiedad', ref: 'Isaías 41:10', text: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.', note: 'Presencia, fuerza y ayuda: tres promesas para el estrés diario.' },
  { id: 'v42', topic: 'identidad', ref: 'Romanos 8:38-39', text: 'Por lo cual estoy seguro de que ni la muerte, ni la vida… ni ninguna otra cosa creada nos podrá separar del amor de Dios, que es en Cristo Jesús Señor nuestro.', note: 'Ni un mal semestre puede separarte de su amor.' },
  { id: 'v43', topic: 'animo', ref: 'Salmo 121:1-2', text: 'Alzaré mis ojos a los montes; ¿de dónde vendrá mi socorro? Mi socorro viene de Jehová, que hizo los cielos y la tierra.', note: 'Cuando levantes la vista del apunte, recuerda de dónde viene el socorro.' },
  { id: 'v44', topic: 'paz', ref: 'Proverbios 3:5-6', text: 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.', note: 'Confiar más que controlar: un camino a la paz en la carrera.' },
  { id: 'v45', topic: 'fortaleza', ref: 'Habacuc 3:19', text: 'Jehová el Señor es mi fortaleza, el cual hace mis pies como de ciervas, y en mis alturas me hace andar.', note: 'Él da agilidad para seguir adelante en terreno difícil.' },
  { id: 'v46', topic: 'estudio', ref: 'Daniel 1:17', text: 'A estos cuatro muchachos Dios les dio conocimiento e inteligencia en todas las letras y ciencias.', note: 'Dios también puede dar capacidad intelectual; pídele ayuda concreta.' },
  { id: 'v47', topic: 'ansiedad', ref: 'Filipenses 4:8', text: 'Por lo demás, hermanos, todo lo que es verdadero, todo lo honesto, todo lo justo… en esto pensad.', note: 'Dirigir los pensamientos hacia lo bueno calma la mente agitada.' },
  { id: 'v48', topic: 'identidad', ref: '2 Corintios 5:17', text: 'De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.', note: 'En Cristo hay un recomienzo real, también en tu vida académica.' },
  { id: 'v49', topic: 'animo', ref: 'Salmo 34:18', text: 'Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu.', note: 'Si estás caído de ánimo, Él se acerca, no se aleja.' },
  { id: 'v50', topic: 'paz', ref: 'Números 6:24-26', text: 'Jehová te bendiga, y te guarde; Jehová haga resplandecer su rostro sobre ti, y tenga de ti misericordia; Jehová alce sobre ti su rostro, y ponga en ti paz.', note: 'Una bendición antigua que aún puedes pedir sobre tu día.' },
  { id: 'v51', topic: 'fortaleza', ref: 'Isaías 41:13', text: 'Porque yo Jehová soy tu Dios, quien te sostiene de la mano derecha, y te dice: No temas, yo te ayudo.', note: 'Imagina esa mano que sostiene la tuya en la semana más pesada.' },
  { id: 'v52', topic: 'estudio', ref: 'Salmo 119:105', text: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.', note: 'Su Palabra ilumina decisiones de carrera, amistades y prioridades.' },
  { id: 'v53', topic: 'ansiedad', ref: 'Salmo 56:3', text: 'El día que temo, yo en ti confío.', note: 'El miedo puede aparecer; la confianza puede responder el mismo día.' },
  { id: 'v54', topic: 'identidad', ref: 'Sofonías 3:17', text: 'Jehová está en medio de ti, poderoso, él salvará; se gozará sobre ti con alegría, callará de amor, se regocijará sobre ti con cánticos.', note: 'Dios no solo te tolera: se goza en ti.' },
  { id: 'v55', topic: 'animo', ref: 'Lamentaciones 3:22-23', text: 'Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.', note: 'Cada mañana hay misericordia nueva para empezar de nuevo.' }
];

const FAITH_PRAYERS = [
  'Señor, en medio de tareas y preocupaciones, renueva mi mente. Dame paz y claridad para este día. Amén.',
  'Padre, te entrego mi ansiedad por los estudios. Ayúdame a ser fiel en lo pequeño y a confiar el resultado a ti. Amén.',
  'Jesús, cuando me sienta débil, sé tú mi fortaleza. Recuérdame que no camino solo. Amén.',
  'Señor, gracias por este día. Bendice mi tiempo, mis compañeros y a quienes me enseñan. Amén.',
  'Dios de paz, calma mi corazón agitado. Enséñame a descansar en tu Palabra. Amén.',
  'Padre, ayúdame a ver mi valor en Cristo, no solo en mis notas. Guíame con sabiduría. Amén.'
];

function setupFaith() {
  let currentTopic = 'all';
  let currentDaily = null;

  const dayIdx = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  currentDaily = FAITH_VERSES[dayIdx % FAITH_VERSES.length];

  function showDaily(v) {
    currentDaily = v;
    document.getElementById('daily-verse-text').textContent = '«' + v.text + '»';
    document.getElementById('daily-verse-ref').textContent = v.ref;
    document.getElementById('daily-verse-reflection').textContent = v.note;
  }

  function renderCards() {
    const list = currentTopic === 'all'
      ? FAITH_VERSES
      : FAITH_VERSES.filter(v => v.topic === currentTopic);
    const box = document.getElementById('faith-cards');
    box.innerHTML = list.map(v => `
      <div class="card">
        <p class="faith-card-verse">«${esc(v.text)}»</p>
        <p class="faith-card-ref">${esc(v.ref)}</p>
        <p class="faith-card-note">${esc(v.note)}</p>
        <button class="btn btn-ghost btn-sm fav-verse-btn" data-id="${v.id}" style="margin-top:0.5rem">♡ Guardar</button>
      </div>
    `).join('');
    box.querySelectorAll('.fav-verse-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const verse = FAITH_VERSES.find(x => x.id === btn.dataset.id);
        if (verse) addFaithFav(verse);
      });
    });
  }

  function addFaithFav(v) {
    if (state.faithFavs.some(f => f.id === v.id)) {
      toast('Ya está en favoritos');
      return;
    }
    state.faithFavs.unshift({ id: v.id, ref: v.ref, text: v.text });
    save('faithFavs');
    renderFavs();
    toast('Versículo guardado ♡');
  }

  function renderFavs() {
    const ul = document.getElementById('faith-favorites');
    if (!state.faithFavs.length) {
      ul.innerHTML = '<li class="empty">Aún no guardas versículos</li>';
      return;
    }
    ul.innerHTML = state.faithFavs.map(f => `
      <li>
        <div class="item-info">
          <div class="item-title">${esc(f.ref)}</div>
          <div class="item-meta">${esc(f.text.slice(0, 80))}${f.text.length > 80 ? '…' : ''}</div>
        </div>
        <button class="btn-delete" data-id="${f.id}" aria-label="Quitar">🗑️</button>
      </li>
    `).join('');
    ul.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        state.faithFavs = state.faithFavs.filter(f => f.id !== btn.dataset.id);
        save('faithFavs');
        renderFavs();
      });
    });
  }

  showDaily(currentDaily);
  renderCards();
  renderFavs();
  document.getElementById('prayer-text').textContent = FAITH_PRAYERS[dayIdx % FAITH_PRAYERS.length];

  document.getElementById('new-daily-verse').addEventListener('click', () => {
    const v = FAITH_VERSES[Math.floor(Math.random() * FAITH_VERSES.length)];
    showDaily(v);
  });
  document.getElementById('fav-daily-btn').addEventListener('click', () => {
    if (currentDaily) addFaithFav(currentDaily);
  });
  document.getElementById('new-prayer-btn').addEventListener('click', () => {
    document.getElementById('prayer-text').textContent =
      FAITH_PRAYERS[Math.floor(Math.random() * FAITH_PRAYERS.length)];
  });
  document.querySelectorAll('.faith-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.faith-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentTopic = chip.dataset.topic;
      renderCards();
    });
  });
}

/* ---------- Wallet ---------- */
function setupWallet() {
  updateWallet();

  document.getElementById('add-savings-btn').addEventListener('click', () => {
    amountModal('Ahorrar', amt => {
      state.savings += amt;
      save('savings');
      updateWallet();
      updateDashboard();
      toast(`+$${amt.toFixed(2)} al ahorro`);
    });
  });

  document.getElementById('withdraw-savings-btn').addEventListener('click', () => {
    amountModal('Retirar del ahorro', amt => {
      if (amt > state.savings) { toast('No hay suficiente en el ahorro'); return; }
      state.savings -= amt;
      save('savings');
      updateWallet();
      updateDashboard();
      toast(`Retiraste $${amt.toFixed(2)}`);
    });
  });

  document.getElementById('expense-form').addEventListener('submit', e => {
    e.preventDefault();
    const type = document.getElementById('tx-type').value;
    const amount = parseFloat(document.getElementById('tx-amount').value);
    state.transactions.unshift({
      id: Date.now().toString(),
      type,
      amount,
      desc: document.getElementById('tx-desc').value.trim(),
      category: document.getElementById('tx-category').value,
      date: new Date().toISOString()
    });
    save('transactions');
    e.target.reset();
    updateWallet();
    toast(type === 'expense' ? 'Gasto registrado' : 'Ingreso registrado');
  });

  document.getElementById('new-money-tip').addEventListener('click', () => {
    document.getElementById('money-tip').innerHTML = `<p>${MONEY_TIPS[Math.floor(Math.random() * MONEY_TIPS.length)]}</p>`;
  });
}

function updateWallet() {
  document.getElementById('savings-amount').textContent = `$${state.savings.toFixed(2)}`;
  const now = new Date();
  const monthTx = state.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  document.getElementById('month-balance').textContent = `$${(income - expenses).toFixed(2)}`;
  document.getElementById('month-income').textContent = `Ingresos: $${income.toFixed(2)}`;
  document.getElementById('month-expenses').textContent = `Gastos: $${expenses.toFixed(2)}`;

  const list = document.getElementById('transactions-list');
  list.innerHTML = state.transactions.length
    ? state.transactions.slice(0, 20).map(t => `
      <li>
        <div class="item-info">
          <div class="item-title">${esc(t.desc)}</div>
          <div class="item-meta">${t.category} · ${fmtDate(t.date.slice(0, 10))}</div>
        </div>
        <span class="tx-amount ${t.type}">${t.type === 'expense' ? '−' : '+'}$${t.amount.toFixed(2)}</span>
      </li>`).join('')
    : '<li class="empty">Sin movimientos aún</li>';
}

function amountModal(title, cb) {
  document.getElementById('modal-body').innerHTML = `
    <h3>${title}</h3>
    <form id="amt-form" class="form">
      <input type="number" id="modal-amt" placeholder="Monto" step="0.01" min="0.01" required autofocus />
      <button type="submit" class="btn btn-primary" style="width:100%">Confirmar</button>
    </form>`;
  openModal();
  document.getElementById('amt-form').addEventListener('submit', e => {
    e.preventDefault();
    const amt = parseFloat(document.getElementById('modal-amt').value);
    closeModal();
    cb(amt);
  });
}

/* ---------- Pomodoro ---------- */
function setupPomodoro() {
  const display = document.getElementById('timer-display');
  const ring = document.getElementById('progress-ring');
  const circ = 2 * Math.PI * 45;
  if (ring) ring.style.strokeDasharray = circ;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.timer.running) return;
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.timer.mode = btn.dataset.mode;
      resetTimer();
    });
  });

  document.getElementById('timer-start').addEventListener('click', () => {
    state.timer.running ? pauseTimer() : startTimer();
  });
  document.getElementById('timer-reset').addEventListener('click', () => {
    pauseTimer();
    resetTimer();
  });
  document.getElementById('apply-settings').addEventListener('click', () => {
    state.timer.focus = +document.getElementById('focus-time').value || 25;
    state.timer.short = +document.getElementById('short-time').value || 5;
    state.timer.long  = +document.getElementById('long-time').value || 15;
    if (!state.timer.running) resetTimer();
    toast('Configuración aplicada');
  });

  document.getElementById('sessions-count').textContent = state.sessionsToday;
  updateTimerUI();

  function startTimer() {
    state.timer.running = true;
    const focus = state.timer.mode === 'focus';
    document.getElementById('timer-start').textContent = focus ? 'Rendirse' : 'Pausar';
    const endAt = Date.now() + state.timer.secondsLeft * 1000;
    state.timer.interval = setInterval(() => {
      state.timer.secondsLeft = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      updateTimerUI();
      if (state.timer.secondsLeft <= 0) {
        clearInterval(state.timer.interval);
        state.timer.running = false;
        document.getElementById('timer-start').textContent = 'Iniciar';
        onComplete();
      }
    }, 250);
  }

  function pauseTimer() {
    const wasFocus = state.timer.running && state.timer.mode === 'focus';
    clearInterval(state.timer.interval);
    state.timer.running = false;
    document.getElementById('timer-start').textContent = 'Iniciar';
    if (wasFocus) {                        // rendirse en enfoque = se talan los árboles
      window.Forest && Forest.cut();
      resetTimer();
      toast('Te rendiste: el bosque fue talado');
    }
  }

  function resetTimer() {
    const mins = state.timer.mode === 'focus' ? state.timer.focus
      : state.timer.mode === 'short' ? state.timer.short : state.timer.long;
    state.timer.totalSeconds = mins * 60;
    state.timer.secondsLeft = mins * 60;
    updateTimerUI();
  }

  function updateTimerUI() {
    const m = Math.floor(state.timer.secondsLeft / 60);
    const s = state.timer.secondsLeft % 60;
    if (display) display.textContent =
      `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const p = state.timer.totalSeconds ? state.timer.secondsLeft / state.timer.totalSeconds : 1;
    if (ring) ring.style.strokeDashoffset = circ * (1 - p);
    if (window.Forest) Forest.update(state.timer.mode === 'focus' ? 1 - p : 1);
  }

  function onComplete() {
    if (state.timer.mode === 'focus') {
      state.sessionsToday++;
      save('sessions');
      const sc = document.getElementById('sessions-count');
      if (sc) sc.textContent = state.sessionsToday;
      addXP(15);
      window.Forest && Forest.finish();
      toast('¡Pomodoro listo! +15 XP');
    } else {
      toast('Descanso terminado. ¡A enfocarse!');
    }
    const next = state.timer.mode === 'focus' ? 'short' : 'focus';
    document.querySelector(`.mode-btn[data-mode="${next}"]`)?.click();
  }
}

/* ---------- Tutorials (personal only) ---------- */
function setupTutorials() {
  document.getElementById('create-tutorial-btn').addEventListener('click', () => {
    document.getElementById('modal-body').innerHTML = `
      <h3>Ofrecer tutoría</h3>
      <form id="tut-form" class="form">
        <input type="text" id="tut-title" placeholder="Título de la clase" required />
        <input type="text" id="tut-topic" placeholder="Materia / tema" required />
        <div class="form-row">
          <input type="date" id="tut-date" required />
          <input type="time" id="tut-time" required />
        </div>
        <input type="text" id="tut-place" placeholder="Lugar o enlace (opcional)" />
        <textarea id="tut-desc" placeholder="Descripción breve" rows="2"></textarea>
        <button type="submit" class="btn btn-primary" style="width:100%">Guardar</button>
      </form>`;
    openModal();
    document.getElementById('tut-form').addEventListener('submit', e => {
      e.preventDefault();
      state.myTuts.unshift({
        id: 't' + Date.now(),
        title: document.getElementById('tut-title').value.trim(),
        topic: document.getElementById('tut-topic').value.trim(),
        date: document.getElementById('tut-date').value,
        time: document.getElementById('tut-time').value,
        place: document.getElementById('tut-place').value.trim(),
        desc: document.getElementById('tut-desc').value.trim()
      });
      save('myTuts');
      closeModal();
      renderMyTuts();
      toast('Tutoría guardada');
    });
  });

  document.getElementById('enroll-form').addEventListener('submit', e => {
    e.preventDefault();
    state.enrolled.unshift({
      id: 'e' + Date.now(),
      title: document.getElementById('enroll-title').value.trim(),
      tutor: document.getElementById('enroll-tutor').value.trim(),
      date: document.getElementById('enroll-date').value,
      time: document.getElementById('enroll-time').value,
      place: document.getElementById('enroll-place').value.trim()
    });
    save('enrolled');
    e.target.reset();
    renderEnrolled();
    toast('Inscripción guardada');
  });

  renderMyTuts();
  renderEnrolled();
}

function renderMyTuts() {
  const list = document.getElementById('my-tutorials-list');
  if (!state.myTuts.length) {
    list.innerHTML = '<p class="empty" style="text-align:center;padding:1.5rem;color:var(--text-muted)">Aún no ofreces ninguna tutoría</p>';
    return;
  }
  list.innerHTML = state.myTuts.map(t => `
    <div class="tut-card">
      <h4>${esc(t.title)}</h4>
      <div class="tut-meta">📚 ${esc(t.topic)}</div>
      <div class="tut-meta">📅 ${fmtDate(t.date)} · 🕐 ${t.time}</div>
      ${t.place ? `<div class="tut-meta">📍 ${esc(t.place)}</div>` : ''}
      ${t.desc ? `<p style="font-size:0.9rem;color:var(--text-muted);margin-top:0.4rem">${esc(t.desc)}</p>` : ''}
      <div class="tut-actions">
        <button class="btn btn-ghost btn-sm del-tut" data-id="${t.id}">Eliminar</button>
      </div>
    </div>`).join('');

  list.querySelectorAll('.del-tut').forEach(btn => {
    btn.addEventListener('click', () => {
      state.myTuts = state.myTuts.filter(t => t.id !== btn.dataset.id);
      save('myTuts');
      renderMyTuts();
    });
  });
}

function renderEnrolled() {
  const list = document.getElementById('enrolled-list');
  if (!state.enrolled.length) {
    list.innerHTML = '<p class="empty" style="text-align:center;padding:1.5rem;color:var(--text-muted)">No tienes tutorías anotadas</p>';
    return;
  }
  list.innerHTML = state.enrolled.map(t => `
    <div class="tut-card">
      <h4>${esc(t.title)}</h4>
      <div class="tut-meta">👤 ${esc(t.tutor)}</div>
      <div class="tut-meta">📅 ${fmtDate(t.date)} · 🕐 ${t.time}</div>
      ${t.place ? `<div class="tut-meta">📍 ${esc(t.place)}</div>` : ''}
      <div class="tut-actions">
        <button class="btn btn-ghost btn-sm del-enr" data-id="${t.id}">Eliminar</button>
      </div>
    </div>`).join('');

  list.querySelectorAll('.del-enr').forEach(btn => {
    btn.addEventListener('click', () => {
      state.enrolled = state.enrolled.filter(t => t.id !== btn.dataset.id);
      save('enrolled');
      renderEnrolled();
    });
  });
}

/* ---------- Modal & Toast ---------- */
function setupModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-backdrop').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
}

function openModal() {
  document.getElementById('modal-backdrop').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('open');
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------- Utils ---------- */
function fmtDate(ds) {
  if (!ds) return '';
  return new Date(ds + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
