/* ========== Year in footer ========== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ========== Mobile nav ========== */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', (e) => {
  const open = navLinks.classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navLinks?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ========== Theme toggle with sweep ========== */
const THEME_KEY = 'sn-theme';
const btn = document.getElementById('themeToggle');

function applyTheme(mode) {
  document.body.classList.toggle('light', mode === 'light');
  btn.textContent = mode === 'light' ? '☀' : '☾';
  btn.setAttribute('aria-pressed', mode === 'light' ? 'true' : 'false');
}
(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(saved ?? (prefersLight ? 'light' : 'dark'));
})();
btn?.addEventListener('click', (e) => {
  const to = document.body.classList.contains('light') ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, to);
  applyTheme(to);

  // sweep veil
  const r = e.currentTarget.getBoundingClientRect();
  const veil = document.createElement('div');
  veil.className = 'theme-veil';
  veil.dataset.mode = to;
  veil.style.setProperty('--x', `${r.left + r.width/2}px`);
  veil.style.setProperty('--y', `${r.top + r.height/2}px`);
  document.body.appendChild(veil);
  veil.addEventListener('animationend', () => veil.remove(), { once:true });
});

/* ========== Scroll progress ========== */
const prog = document.querySelector('.progress-bar');
function updateProgress(){
  const h = document.documentElement;
  const sc = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  prog.style.width = `${sc}%`;
}
updateProgress();
addEventListener('scroll', updateProgress, { passive:true });

/* ========== Reveal on scroll ========== */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting) {
      ent.target.classList.add('in');
      revealIO.unobserve(ent.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

/* ========== Stat counters ========== */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function animateNumber(el, to, {duration=1000, decimals=0, suffix='' }={}){
  if (reduceMotion) { el.textContent = (+to).toFixed(decimals) + suffix; return; }
  const start = performance.now();
  function frame(t){
    const p = Math.min((t - start) / duration, 1);
    const val = to * p;
    el.textContent = val.toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
const statIO = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting) {
      const el = ent.target;
      const to = parseFloat(el.dataset.count || '0');
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      animateNumber(el, to, { duration: 1100, decimals, suffix });
      statIO.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statIO.observe(el));

/* ========== Skill bars ========== */
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting) {
      const bar = ent.target;
      const valEl = bar.querySelector('.bar-val');
      const fill = bar.querySelector('.bar-fill');
      const pct = parseFloat(valEl.dataset.val || '0');

      if (reduceMotion) {
        fill.style.width = pct + '%';
        valEl.textContent = Math.round(pct) + '%';
      } else {
        const start = performance.now();
        const dur = 900;
        function tick(t){
          const p = Math.min((t - start) / dur, 1);
          const now = pct * p;
          fill.style.width = now + '%';
          valEl.textContent = Math.round(now) + '%';
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
      barIO.unobserve(bar);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.bar').forEach(b => barIO.observe(b));
