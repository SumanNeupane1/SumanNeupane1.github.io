/* ============================
   Toggle sections + Theme switch with color veil
   ============================ */

(function () {
  // ---- your original section toggles (unchanged) ----
  [...document.querySelectorAll(".control")].forEach((button) => {
    button.addEventListener("click", function () {
      const activeBtn = document.querySelector(".active-btn");
      if (activeBtn) activeBtn.classList.remove("active-btn");
      this.classList.add("active-btn");

      const active = document.querySelector(".active");
      if (active) active.classList.remove("active");
      const target = document.getElementById(button.dataset.id);
      if (target) target.classList.add("active");
    });
  });

  // ---- theme: uses .theme-btn and toggles .light-mode on <body> ----
  const THEME_KEY = "sn-theme";
  const btn = document.querySelector(".theme-btn");
  const isLight = () => document.body.classList.contains("light-mode");

  // Apply saved preference (if any)
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light") document.body.classList.add("light-mode");
  if (saved === "dark") document.body.classList.remove("light-mode");

  function setTheme(light) {
    document.body.classList.toggle("light-mode", light);
    localStorage.setItem(THEME_KEY, light ? "light" : "dark");
  }

  function flashVeil(nextLight, x, y) {
    const veil = document.createElement("span");
    veil.className = `theme-veil ${nextLight ? "to-light" : "to-dark"}`;
    veil.style.setProperty("--x", (x ?? innerWidth / 2) + "px");
    veil.style.setProperty("--y", (y ?? innerHeight / 2) + "px");
    document.body.appendChild(veil);
    veil.addEventListener("animationend", () => veil.remove(), { once: true });
  }

  if (btn) {
    btn.addEventListener("click", (e) => {
      const nextLight = !isLight();
      // colorful radial sweep from click position
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      flashVeil(nextLight, cx, cy);
      setTheme(nextLight);
    });
  }
})();
