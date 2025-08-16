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

/* ========== Theme toggle with view transition ========== */
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
btn?.addEventListener('click', () => {
  const to = document.body.classList.contains('light') ? 'dark' : 'light';
  const run = () => { localStorage.setItem(THEME_KEY, to); applyTheme(to); };
  if (document.startViewTransition) document.startViewTransition(run); else run();
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
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

/* ========== Hero 3D tilt + shine + gradual color ========== */
(() => {
  const wrap = document.querySelector('.hero-image-wrap');
  const img = wrap?.querySelector('.hero-image');
  const shine = wrap?.querySelector('.hero-shine');
  if (!wrap || !img || reduceMotion) return;

  let raf = 0;
  function onMove(e){
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width/2)) / r.width;
    const y = (e.clientY - (r.top + r.height/2)) / r.height;
    const rx = y * -8;        // tilt range
    const ry = x * 10;
    wrap.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    shine.style.setProperty('--mx', `${e.clientX - r.left}px`);
    shine.style.setProperty('--my', `${e.clientY - r.top}px`);
    raf = 0;
  }
  wrap.addEventListener('pointerenter', () => wrap.classList.add('live'));
  wrap.addEventListener('pointerleave', () => { wrap.classList.remove('live'); wrap.style.transform=''; });
  wrap.addEventListener('pointermove', (e) => { if (!raf) raf = requestAnimationFrame(() => onMove(e)); });
})();

/* ========== Parallax orbs (cheap) ========== */
(() => {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;
  let y = 0, raf = 0;
  function onScroll(){
    const s = window.scrollY || document.documentElement.scrollTop;
    y += (s - y) * 0.08;
    orbs.forEach((o, i) => {
      const k = (i % 2 ? 0.08 : 0.04);
      o.style.transform = `translateY(${y * k}px)`;
    });
    raf = 0;
  }
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive:true });
})();

/* ========== Scrollspy ========== */
(() => {
  const links = [...document.querySelectorAll('.nav-links a')];
  const targets = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const byId = Object.fromEntries(links.map(a => [a.getAttribute('href'), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      const id = '#' + ent.target.id;
      if (ent.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        byId[id]?.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.01 });
  targets.forEach(t => spy.observe(t));
})();

/* ========== Magnetic buttons ========== */
(() => {
  const els = document.querySelectorAll('.magnetic');
  const R = 18;
  els.forEach(el => {
    el.style.willChange = 'transform';
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = ((e.clientX - (r.left + r.width/2)) / (r.width/2)) * R;
      const dy = ((e.clientY - (r.top + r.height/2)) / (r.height/2)) * R;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    ['mouseleave','blur'].forEach(evt => el.addEventListener(evt, () => el.style.transform = ''));
  });
})();

/* ========== Timeline spine progress ========== */
(() => {
  const tl = document.querySelector('.timeline');
  if (!tl) return;
  const items = tl.querySelectorAll('.t-item');
  const io = new IntersectionObserver((ents) => {
    const seen = [...items].filter(i => i.querySelector('.reveal.in') || i.classList.contains('seen')).length;
    ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('seen'); });
    const pct = Math.min(100, (seen / items.length) * 100);
    tl.style.setProperty('--line', pct + '%');
  }, { threshold: 0.2 });
  items.forEach(i => io.observe(i));
})();

/* ========== Blur-up once loaded ========== */
document.querySelectorAll('img[loading="lazy"]').forEach(img=>{
  if (img.complete) img.classList.add('loaded');
  img.addEventListener('load', () => img.classList.add('loaded'), { once:true });
});

/* ========== Copy email tooltip ========== */
(() => {
  const link = document.querySelector('.contact-list a[href^="mailto:"]');
  if (!link || !navigator.clipboard) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(link.textContent.trim());
    link.classList.add('show');
    setTimeout(() => link.classList.remove('show'), 900);
  });
})();
