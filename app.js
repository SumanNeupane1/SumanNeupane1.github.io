/* ===========================
   Suman Neupane – UI scripts
   =========================== */

// DOM helpers
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

// Sticky nav mobile toggle
(() => {
  const toggle = $('#navToggle');
  const menu   = $('#navLinks');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();

// Scroll progress
(() => {
  const bar = $('#progress');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const sc = h.scrollTop || document.body.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max ? (sc / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Reveal on scroll
(() => {
  const items = $$('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
})();

// Theme toggle with animated veil sweep
(() => {
  const btn   = $('#theme-toggle');
  const root  = document.body;
  const storeKey = 'sn-theme';
  const veilRoot = $('#theme-veil-root');

  const applyIcon = () => btn.textContent = root.classList.contains('light-mode') ? '☀️' : '🌙';

  // Load saved theme
  const saved = localStorage.getItem(storeKey);
  if (saved === 'light') root.classList.add('light-mode');
  applyIcon();

  const makeVeil = (mode, x, y) => {
    const veil = document.createElement('div');
    veil.className = 'theme-veil';
    veil.dataset.mode = mode;
    veil.style.setProperty('--x', `${x}px`);
    veil.style.setProperty('--y', `${y}px`);
    veilRoot.appendChild(veil);
    veil.addEventListener('animationend', () => veil.remove());
  };

  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top  + rect.height / 2 + window.scrollY;

    const goingLight = !root.classList.contains('light-mode');
    makeVeil(goingLight ? 'light' : 'dark', x, y);

    root.classList.toggle('light-mode');
    localStorage.setItem(storeKey, root.classList.contains('light-mode') ? 'light' : 'dark');
    applyIcon();
  });
})();
