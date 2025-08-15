/* =========================================================
   Helpers
   ========================================================= */
const qs  = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

/* =========================================================
   Theme (uses body.light)
   ========================================================= */
const THEME_KEY = 'sn-theme';
const themeBtn  = qs('#themeToggle');

function applyTheme(mode) {
  document.body.classList.toggle('light', mode === 'light');
  if (themeBtn) {
    themeBtn.textContent = mode === 'light' ? '☀' : '☾';
    themeBtn.setAttribute('aria-pressed', mode === 'light' ? 'true' : 'false');
  }
}

(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(saved ?? (prefersLight ? 'light' : 'dark'));

  // If user hasn’t chosen a theme, follow OS changes live
  if (!saved) {
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    mql.addEventListener('change', e => applyTheme(e.matches ? 'light' : 'dark'));
  }
})();

themeBtn?.addEventListener('click', (e) => {
  const to = document.body.classList.contains('light') ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, to);
  applyTheme(to);
});

/* =========================================================
   Mobile nav
   ========================================================= */
const navToggle = qs('.nav-toggle');
const navLinks  = qs('.nav-links');

navToggle?.addEventListener('click', (e) => {
  const open = navLinks.classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', open ? 'true' : 'false');
});

navLinks?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// Close menu if you click outside it (mobile)
document.addEventListener('click', (ev) => {
  if (!navLinks || !navToggle) return;
  const clickedToggle = navToggle.contains(ev.target);
  const clickedMenu   = navLinks.contains(ev.target);
  if (!clickedToggle && !clickedMenu) navLinks.classList.remove('open');
});

/* =========================================================
   Scroll progress
   ========================================================= */
const prog = qs('.progress-bar');
function updateProgress(){
  if (!prog) return;
  const h = document.documentElement;
  const sc = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  prog.style.width = `${Math.max(0, Math.min(sc, 100))}%`;
}
updateProgress();
addEventListener('scroll', updateProgress, { passive: true });

/* =========================================================
   Reveal-on-scroll
   ========================================================= */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting) {
      ent.target.classList.add('in');
      revealIO.unobserve(ent.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

qsa('.reveal').forEach(el => revealIO.observe(el));

/* =========================================================
   Stat counters
   ========================================================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateNumber(el, to, { duration = 1100, decimals = 0, suffix = '' } = {}) {
  if (reduceMotion) {
    el.textContent = Number(to).toFixed(decimals) + suffix;
    return;
  }
  const start = performance.now();
  function frame(t) {
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

qsa('.stat-num').forEach(el => statIO.observe(el));

/* =========================================================
   Skill bars
   ========================================================= */
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (!ent.isIntersecting) return;

    const bar = ent.target;
    const valEl = bar.querySelector('.bar-val');
    const fill  = bar.querySelector('.bar-fill');
    if (!valEl || !fill) return;

    const pct = parseFloat(valEl.dataset.val || '0');

    if (reduceMotion) {
      fill.style.width = pct + '%';
      valEl.textContent = Math.round(pct) + '%';
    } else {
      const start = performance.now();
      const dur = 900;
      (function tick(t){
        const p = Math.min((t - start) / dur, 1);
        const now = pct * p;
        fill.style.width = now + '%';
        valEl.textContent = Math.round(now) + '%';
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    }

    barIO.unobserve(bar);
  });
}, { threshold: 0.4 });

qsa('.bar').forEach(b => barIO.observe(b));

/* =========================================================
   Footer year
   ========================================================= */
const yearSpan = qs('#year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
