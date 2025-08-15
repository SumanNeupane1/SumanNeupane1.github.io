/* Suman Neupane - site interactions (final) */
(() => {
  // ---------- THEME ----------
  const body = document.body;
  const btn = document.getElementById('themeToggle') || document.querySelector('.theme-btn');

  const applyTheme = (mode) => {
    if (mode === 'light') {
      body.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
      if (btn) { btn.textContent = '☀'; btn.setAttribute('aria-pressed', 'true'); }
    } else {
      body.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
      if (btn) { btn.textContent = '☾'; btn.setAttribute('aria-pressed', 'false'); }
    }
  };

  const saved = localStorage.getItem('sn-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(saved || (prefersLight ? 'light' : 'dark'));

  if (btn) {
    btn.addEventListener('click', () => {
      const mode = body.classList.contains('light') ? 'dark' : 'light';
      applyTheme(mode);
      localStorage.setItem('sn-theme', mode);
    });
  }

  // ---------- NAV TOGGLE ----------
  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.querySelector('.nav-links')?.classList.toggle('open');
      const open = document.querySelector('.nav-links')?.classList.contains('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ---------- PROGRESS BAR ----------
  const pb = document.querySelector('.progress-bar');
  const onScroll = () => {
    if (!pb) return;
    const scrolled = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    pb.style.width = Math.max(0, Math.min(100, (scrolled / max) * 100)) + '%';
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

      // animate fill
      if (fill) fill.style.width = val + '%';

      // animate number
      if (valEl) {
        let n = 0;
        const step = () => {
          n += (val - n) * 0.12;
          if (n + 0.5 < val) {
            valEl.textContent = Math.round(n) + '%';
            requestAnimationFrame(step);
          } else {
            valEl.textContent = val + '%';
          }
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
