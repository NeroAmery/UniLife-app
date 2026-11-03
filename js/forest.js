/* Bosque Pomodoro: un árbol por tramo de tiempo; si te rindes, se talan. */
window.Forest = (function () {
  const N = 7, KEY = 'ul_forest';
  const svg = document.getElementById('forest');
  if (!svg) return { update() {}, cut() {}, finish() {} };
  const msg = document.getElementById('forest-msg'), tot = document.getElementById('forest-total');
  const colors = ['#3DDC97', '#2DBE82', '#7BE0A8', '#FFB347', '#FF7A6B', '#9B83FF', '#3DDC97'];
  let html = '<circle class="sunc" cx="268" cy="26" r="16"/><path class="ground" d="M0 112 Q75 98 150 108 T300 106 V130 H0Z"/>';
  for (let i = 0; i < N; i++) {
    const x = 24 + i * 42, y = 108 - (i % 2) * 2, c = colors[i];
    const crown = i % 2
      ? `<circle class="leaf" fill="${c}" cx="${x}" cy="${y - 36}" r="17"/>`
      : `<path class="leaf" fill="${c}" d="M${x} ${y - 62} L${x + 17} ${y - 18} H${x - 17}Z"/><path class="leaf" fill="${c}" d="M${x} ${y - 48} L${x + 21} ${y - 8} H${x - 21}Z"/>`;
    html += `<g class="tree" data-i="${i}" style="transform:scale(.05)"><rect class="trunk" x="${x - 3}" y="${y - 20}" width="6" height="22" rx="2"/><g class="crown">${crown}</g></g>`;
  }
  svg.innerHTML = html;
  const trees = [...svg.querySelectorAll('.tree')];
  const total = () => { try { return +localStorage.getItem(KEY) || 0; } catch (e) { return 0; } };
  const setTotal = n => { try { localStorage.setItem(KEY, n); } catch (e) {} tot.textContent = n; };
  tot.textContent = total();
  const IDLE = 'Tu bosque crece mientras te concentras';
  msg.textContent = IDLE;
  let t0 = 0;

  function update(p) {               // p: 0 → 1 (progreso del temporizador)
    if (svg.classList.contains('cut')) return;
    trees.forEach((t, i) => {
      const s = Math.min(1, Math.max(0, p * N - i));
      t.style.transform = 'scale(' + (s > 0 ? 0.15 + 0.85 * s : 0.05) + ')';
      t.classList.toggle('grown', s > 0);
    });
    if (p <= 0) msg.textContent = IDLE;
    else if (p < 1) msg.textContent = 'Tu bosque está creciendo… no lo abandones.';
  }
  function cut() {
    if (!trees.some(t => t.classList.contains('grown'))) return;
    svg.classList.add('cut'); msg.textContent = 'Te rendiste a tiempo… y el bosque fue talado.';
    clearTimeout(t0);
    t0 = setTimeout(() => { svg.classList.remove('cut'); update(0); msg.textContent = IDLE; }, 2600);
  }
  function finish() {
    setTotal(total() + N); msg.textContent = '¡Bosque completo! +' + N + ' árboles plantados.';
  }
  return { update, cut, finish };
})();
