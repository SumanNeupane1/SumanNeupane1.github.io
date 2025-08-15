/* Suman Neupane - interactions (theme + animations) */
(() => {
  // ---------- SVG icons ----------
  const MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 1 0 21 12.79z"/></svg>';
  const SUN  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9-10v-2h-3v2h3zm-3.76-8.16l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM12 6a6 6 0 100 12A6 6 0 0012 6zm5.24 13.16l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM4.84 17.24l-1.79 1.79 1.79 1.79 1.79-1.79-1.79-1.79z"/></svg>';

  // ---------- Theme helpers ----------
  const body = document.body;
  const btn = document.getElementById('themeToggle') || document.querySelector('.theme-btn');

  // add smooth transitions for themeable elements
  body.classList.add('theme-smooth');

  const applyTheme = (mode) => {
    const light = mode === 'light';
    body.classList.toggle('light', light);
    document.documentElement.setAttribute('data-theme', light ? 'light' : 'dark');
    if (btn) {
      btn.innerHTML = light ? SUN : MOON;
      btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
      btn.setAttribute('aria-pressed', light ? 'true' : 'false');
    }
  };

  // initial mode
  const saved = localStorage.getItem('sn-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(saved || (prefersLight ? 'light' : 'dark'));

  // colorful veil animation
  const flipThemeWithVeil = (nextMode, x, y) => {
    const veil = document.createElement('span');
    veil.className = 'theme-veil';
    veil.style.setProperty('--x', (x ?? innerWidth / 2) + 'px');
    veil.style.setProperty('--y', (y ?? innerHeight / 2) + 'px');
    document.body.appendChild(veil);
    // switch theme right away so underlying UI transitions too
    applyTheme(nextMode);
    localStorage.setItem('sn-theme', nextMode);
    veil.addEventListener('animationend', () => veil.remove(), { once: true });
  };

  if (btn) {
    btn.addEventListener('click', (e) => {
      const next = body.classList.contains('light') ? 'dark' : 'light';
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      flipThemeWithVeil(next, x, y);
    });
  }

  // ---------- NAV TOGGLE ----------
  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const list = document.querySelector('.nav-links');
      const open = list.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ---------- PROGRESS BAR ----------
  const pb = document.querySelector('.progress-bar');
  const onScroll = () => {
    if (!pb) return;
    const sc = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    pb.style.width = Math.max(0, Math.min(100, (sc / max) * 100)) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- REVEAL ON VIEW ----------
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));

  // ---------- CHIPS STAGGER ----------
  document.querySelectorAll('[data-stagger] .chip').forEach((chip, i) => {
    chip.style.setProperty('--d', `${i * 0.05}s`);
  });

  // ---------- SKILL BARS ----------
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const bar = en.target;
      const fill = bar.querySelector('.bar-fill');
      const valEl = bar.querySelector('.bar-val');
      const val = parseInt(valEl?.dataset.val || '0', 10);
      if (fill) fill.style.width = val + '%';
      if (valEl) {
        let n = 0;
        const step = () => {
          n += (val - n) * 0.12;
          if (n + 0.5 < val) {
            valEl.textContent = Math.round(n) + '%';
            requestAnimationFrame(step);
          } else valEl.textContent = val + '%';
        };
        requestAnimationFrame(step);
      }
      barIO.unobserve(bar);
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('.bar').forEach((b) => barIO.observe(b));

  // ---------- STAT COUNTERS ----------
  const numIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count || '0');
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      let t0 = null;
      const dur = 1200;
      const tick = (ts) => {
        if (!t0) t0 = ts;
        const p = Math.min(1, (ts - t0) / dur);
        const v = target * p;
        el.textContent = v.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      numIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat-num').forEach((n) => numIO.observe(n));

  // ---------- FOOTER YEAR ----------
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
