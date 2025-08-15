(function () {
    // Section switcher
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
            // nudge observers for newly shown section
            window.dispatchEvent(new Event('scroll'));
        });
    });

    // Theme toggle
    const themeBtn = document.querySelector(".theme-btn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
        });
    }

    // Reveal on scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('sn-in');
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: .15 });
    document.querySelectorAll('.sn-reveal').forEach(el => revealObserver.observe(el));

    // Count up numbers in About cards
    function animateCount(el) {
        const target = Number(el.dataset.count || 0);
        const start = 0;
        const duration = 1200;
        const t0 = performance.now();
        function step(t) {
            const p = Math.min((t - t0) / duration, 1);
            const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p; // easeInOut
            el.textContent = Math.floor(start + (target - start) * eased);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = String(target);
        }
        requestAnimationFrame(step);
    }
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateCount(e.target);
                countObserver.unobserve(e.target);
            }
        });
    }, { threshold: .6 });
    document.querySelectorAll('.about-item .large-text[data-count]').forEach(el => countObserver.observe(el));

    // Scroll progress bar
    const bar = document.querySelector('.sn-progress');
    function updateBar() {
        const h = document.documentElement;
        const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
        if (bar) bar.style.width = `${p * 100}%`;
    }
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
})();
