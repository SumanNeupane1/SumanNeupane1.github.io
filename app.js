// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// Theme toggle
const themeBtn = document.querySelector('.theme-btn');
if (themeBtn) {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.body.classList.add('light');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    themeBtn.textContent = document.body.classList.contains('light') ? '☀' : '☾';
  });
  themeBtn.textContent = document.body.classList.contains('light') ? '☀' : '☾';
}

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Stagger chips
document.querySelectorAll('[data-stagger]').forEach(group => {
  [...group.children].forEach((chip, i) => chip.style.setProperty('--d', `${i * 0.06}s`));
});

// Bars animate when visible
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar').forEach(bar => {
        const val = parseInt(bar.querySelector('.bar-val').dataset.val, 10);
        const fill = bar.querySelector('.bar-fill');
        const label = bar.querySelector('.bar-val');
        animateBar(fill, label, val);
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const barsBlock = document.querySelector('.bars');
if (barsBlock) barObserver.observe(barsBlock);

function animateBar(fill, label, target) {
  const start = performance.now();
  const dur = 1200;
  function step(t) {
    const p = Math.min((t - start) / dur, 1);
    const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    const val = Math.floor(target * eased);
    fill.style.width = `${val}%`;
    label.textContent = `${val}%`;
    if (p < 1) requestAnimationFrame(step);
    else label.textContent = `${target}%`;
  }
  requestAnimationFrame(step);
}

// Counters in stats
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const num = e.target;
      animateCount(num, parseInt(num.dataset.count || '0', 10));
      countObserver.unobserve(num);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-num[data-count]').forEach(el => countObserver.observe(el));

function animateCount(el, target) {
  const start = performance.now();
  const dur = 1200;
  function step(t) {
    const p = Math.min((t - start) / dur, 1);
    const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    el.textContent = String(Math.floor(target * (0.2 + 0.8 * eased)));
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = String(target);
  }
  requestAnimationFrame(step);
}

// Scroll progress
const bar = document.querySelector('.progress-bar');
function updateProgress() {
  const h = document.documentElement;
  const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
  bar.style.width = `${p * 100}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Smooth scroll for same-page links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
