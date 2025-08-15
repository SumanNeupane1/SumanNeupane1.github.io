/* Suman Neupane — final interactions: theme + reveal + bars + counters + progress */

(() => {
  // ===== Theme (uses .theme-btn and toggles body.light-mode) =====
  const btn = document.querySelector('.theme-btn');
  const KEY = 'sn-theme';

  const setTheme = (light) => {
    document.body.classList.toggle('light-mode', light);
    localStorage.setItem(KEY, light ? 'light' : 'dark');
  };

  // Apply saved preference
  const saved = localStorage.getItem(KEY);
  if (saved === 'light') setTheme(true);
  if (saved === 'dark') setTheme(false);

  // Radial color veil on toggle
  const flashVeil = (toLight, x, y) => {
    const veil = document.createElement('span');
    veil.className = 'theme-veil';
    if (toLight) veil.setAttribute('data-mode', 'light');
    veil.style.setProperty('--x', (x ?? innerWidth / 2) + 'px');
    veil.style.setProperty('--y', (y ?? innerHeight / 2) + 'px');
    document.body.appendChild(veil);
    veil.addEventListener('animationend', () => veil.remove(), { once: true });
  };

  btn?.addEventListener('click', (e) => {
    const nextLight = !document.body.classList.contains('light-mode');
    const r = e.currentTarget.getBoundingClientRect();
    flashVeil(nextLight, r.left + r.width / 2, r.top + r.height / 2);
    setTheme(nextLight);
  });

  // ===== Progress bar on scroll =====
  const bar = document.querySelector('.progress-bar');
  const onScroll = () => {
    if (!bar) return;
    const sc = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = Math.max(0, Math.min(100, (sc / max) * 100)) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Reveal on view (for .reveal elements) =====
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ===== Skill bars (for .bar .bar-fill + .bar-val[data-val]) =====
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const fill = el.querySelector('.bar-fill');
      const valEl = el.querySelector('.bar-val');
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
      barIO.unobserve(el);
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('.bar').forEach((b) => barIO.observe(b));

  // ===== Number counters (for .stat-num[data-count][data-decimals][data-suffix]) =====
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

  // ===== Optional: mobile nav toggle (if you have a .nav-toggle & .nav-links) =====
  const navToggle = document.querySelector('.nav-toggle');
  navToggle?.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    const open = links?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
