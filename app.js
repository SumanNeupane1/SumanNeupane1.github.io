// Theme, menu, scroll glass, counters, bars, reveals, progress

// Initial theme from storage/system
(function () {
  const saved = localStorage.getItem('sn-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  if (saved === 'light' || (!saved && prefersLight)) {
    document.body.classList.add('light');
    document.getElementById('themeToggle').textContent = '☀';
    document.getElementById('themeToggle').setAttribute('aria-pressed', 'true');
  }
})();

// Toggle theme + quick veil flash
document.getElementById('themeToggle').addEventListener('click', (e) => {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('sn-theme', isLight ? 'light' : 'dark');
  e.currentTarget.textContent = isLight ? '☀' : '☾';
  e.currentTarget.setAttribute('aria-pressed', isLight ? 'true' : 'false');

  // subtle veil
  const veil = document.createElement('div');
  veil.className = 'theme-veil';
  document.body.appendChild(veil);
  setTimeout(() => veil.remove(), 650);
});

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Scroll glass intensity + progress bar
const header = document.getElementById('siteHeader');
const progress = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  if (y > 6) header.classList.add('scrolled'); else header.classList.remove('scrolled');

  const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = (y / h) * 100;
  progress.style.width = pct + '%';
});

// Reveal on view
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.18 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Animated counters
const counterIO = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const dur = 1200;

    function tick(t) {
      const p = Math.min(1, (t - start) / dur);
      const val = (target * p).toFixed(decimals);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    obs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => counterIO.observe(el));

// Bars fill
const barIO = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const valEl = entry.target.querySelector('.bar-val');
    const fill  = entry.target.querySelector('.bar-fill');
    const target = parseInt(valEl.dataset.val || '0', 10);
    fill.style.width = target + '%';
    valEl.textContent = target + '%';
    obs.unobserve(entry.target);
  });
}, { threshold: 0.35 });
document.querySelectorAll('.bar').forEach(el => barIO.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
