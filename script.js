/* =====================================================================
   MOSTAFA NEGM PORTFOLIO  -  script.js
   1) Paste your links in the LINKS block below.
   2) Skill lists live in the SKILLS array.
   ===================================================================== */

/* ---------- 1. YOUR LINKS (full URLs, e.g. "https://github.com/MostafaNegm222") ---------- */
const LINKS = {
  linkedin: "https://www.linkedin.com/in/mostafa-a-negm",
  github: "https://github.com/MostafaNegm222",
  "zaytona.github": "https://github.com/MostafaNegm222/Zaytona-Restaurant",  "zaytona.live": "https://zaytona-restaurant.vercel.app/",
  "shop.github": "https://github.com/MostafaNegm222/E-commerce-summer",     "shop.live": "https://e-commerce-app-nine-ivory.vercel.app/home",
  "taskflow.github": "", "taskflow.live": "",
  "jobboard.github": "", "jobboard.live": "",
  "exam.github": "https://github.com/MostafaNegm222/Exam-System-ITI-Project",     "exam.live": "https://exam-system-iti-project.vercel.app/"
};

/* ---------- 2. SKILLS ---------- */
const SKILLS = [
  ["Front-End", ["JavaScript ES6+", "TypeScript", "React.js", "Next.js", "Angular", "RxJS", "Vue / Nuxt 3", "Redux", "HTML5", "CSS3", "SASS", "Tailwind CSS", "Bootstrap 5", "Responsive Design"]],
  ["Back-End", ["Node.js", "Express.js", "MongoDB", "REST APIs", "JWT Auth"]],
  ["UI/UX & Design", ["Figma", "FigJam", "Photoshop", "Illustrator", "Wireframing", "Prototyping", "User Research"]],
  ["Tools & Practice", ["Git", "GitHub", "Agile / Scrum", "Component Architecture", "Cross-Browser", "Web Accessibility", "Clean Code"]]
];

/* =====================================================================
   ===================================================================== */
(function () {
  const root = document.documentElement;
  root.classList.add("js");
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = () => matchMedia("(hover:hover) and (min-width:981px)").matches;

  /* ----- links ----- */
  $$("[data-link]").forEach(a => {
    const url = LINKS[a.dataset.link];
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else { a.setAttribute("aria-disabled", "true"); a.title = "Link coming soon"; a.addEventListener("click", e => e.preventDefault()); }
  });

  /* ----- theme ----- */
  try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
  $("#theme").addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ----- mobile menu ----- */
  const navLinks = $("#navLinks"), menuBtn = $("#menu");
  menuBtn.addEventListener("click", () => { const o = navLinks.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); });
  navLinks.addEventListener("click", e => { if (e.target.tagName === "A") { navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });

  /* ----- tickers ----- */
  $$("[data-ticker]").forEach(el => {
    const items = el.dataset.ticker.split(",");
    const set = items.map(t => `<span>${t}</span>`).join("");
    el.innerHTML = set + set + set + set;
    // the track moves by 50% so it needs two equal halves
  });

  /* ----- skills ----- */
  $("#skills-list").innerHTML = SKILLS.map(([name, list]) =>
    `<div class="srow"><h3>${name.replace("&", "&amp;")}</h3><div class="swords">${list.map(s => `<span class="sk">${s}</span>`).join("")}</div></div>`
  ).join("");

  /* ----- kinetic headline (variable font reacts to cursor, waves when idle) ----- */
  const rows = $$(".kin-row");
  const letters = [];
  let n = 0;
  rows.forEach(row => {
    const text = row.dataset.text;
    row.setAttribute("aria-hidden", "true");
    [...text].forEach(chr => {
      const s = document.createElement("span");
      s.className = "ch"; s.textContent = chr; s.style.setProperty("--n", n++);
      row.appendChild(s);
      letters.push({ el: s, f: 0 });
    });
  });
  const kin = $("#kin");
  let mx = -9999, my = -9999, lastMove = 0, visible = true, raf;
  addEventListener("pointermove", e => { if (e.pointerType === "mouse") { mx = e.clientX; my = e.clientY; lastMove = performance.now(); } }, { passive: true });
  if ("IntersectionObserver" in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !reduce) loop(performance.now()); }).observe(kin);

  function loop(t) {
    if (!visible) return;
    const size = kin.getBoundingClientRect().height / 2;
    const mouseActive = t - lastMove < 2500;
    letters.forEach((L, i) => {
      let target;
      if (mouseActive) {
        const r = L.el.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my);
        target = clamp(1 - d / (size * 1.5), 0, 1);
      } else {
        target = (0.5 + 0.5 * Math.sin(t / 650 - i * 0.7)) * 0.75;
      }
      L.f += (target - L.f) * 0.12;
      L.el.style.fontVariationSettings = `"wght" ${Math.round(900 - 640 * L.f)}, "wdth" ${Math.round(85 + 60 * L.f)}`;
    });
    raf = requestAnimationFrame(loop);
  }
  if (!reduce) setTimeout(() => { cancelAnimationFrame(raf); loop(performance.now()); }, 1400);

  /* ----- statement: words light up as you scroll ----- */
  const st = $("#statement");
  const words = st.textContent.trim().split(/\s+/);
  st.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(" ");
  const wEls = $$(".w", st);
  function paintWords() {
    const r = st.getBoundingClientRect();
    const p = clamp((innerHeight * 0.88 - r.top) / (r.height + innerHeight * 0.3), 0, 1);
    const lit = p * wEls.length * 1.15;
    wEls.forEach((w, i) => w.classList.toggle("on", reduce || i < lit));
  }

  /* ----- counters ----- */
  const counted = new WeakSet();
  function count(el) {
    const end = +el.dataset.count, suf = el.dataset.suffix || "";
    if (reduce) { el.textContent = end + suf; return; }
    const t0 = performance.now(), dur = 1500;
    (function f(t) { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); })(t0);
  }
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting && !counted.has(en.target)) { counted.add(en.target); count(en.target); } }), { threshold: 0.6 });
    $$("[data-count]").forEach(el => co.observe(el));
  }

  /* ----- reveal on scroll ----- */
  const rv = $$(".stat, .about-cols p, .srow, .prow, .hero-foot, .clead, .mail-row, .cgrid");
  rv.forEach(el => el.classList.add("rv"));
  const showAll = () => rv.forEach(el => el.classList.add("in"));
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    rv.forEach(el => io.observe(el));
    setTimeout(showAll, 4000);
  } else showAll();

  /* ----- sticky experience cards shrink as the next one covers them ----- */
  const cards = $$(".xcard");
  function paintCards() {
    cards.forEach((c, i) => {
      let covered = 0;
      for (let j = i + 1; j < cards.length; j++) {
        const stuckTop = parseFloat(getComputedStyle(cards[j]).top);
        if (cards[j].getBoundingClientRect().top <= stuckTop + 6) covered++;
      }
      c.style.setProperty("--s", (1 - covered * 0.035).toFixed(3));
      c.style.filter = covered ? `brightness(${1 - covered * 0.07})` : "";
    });
  }

  /* ----- active nav link ----- */
  const secs = $$("main section[id]");
  const navA = $$(".nav-links a");
  function paintNav() {
    let cur = "";
    secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.45) cur = s.id; });
    navA.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + cur));
  }

  let ticking = false;
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(() => { paintWords(); paintCards(); paintNav(); ticking = false; }); }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  paintWords(); paintCards(); paintNav();

  /* ----- project preview that follows the cursor ----- */
  const fl = $("#float");
  let fx = 0, fy = 0, tx = 0, ty = 0, floatRaf = 0;
  function floatLoop() {
    fx += (tx - fx) * 0.14; fy += (ty - fy) * 0.14;
    const rot = clamp((tx - fx) * 0.08, -9, 9);
    fl.style.transform = `translate(${fx + 24}px, ${fy - 90}px) rotate(${rot}deg)`;
    floatRaf = requestAnimationFrame(floatLoop);
  }
  $$(".prow").forEach(row => {
    row.addEventListener("pointerenter", e => {
      if (!canHover()) return;
      fl.innerHTML = $(".peek", row).innerHTML;
      fx = tx = e.clientX; fy = ty = e.clientY;
      fl.classList.add("on"); cancelAnimationFrame(floatRaf); floatLoop();
    });
    row.addEventListener("pointerleave", () => { fl.classList.remove("on"); cancelAnimationFrame(floatRaf); });
    row.addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; });
  });

  /* ----- magnetic buttons ----- */
  if (canHover() && !reduce) $$(".mag").forEach(b => {
    b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`; });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; b.style.transition = "transform .4s cubic-bezier(.3,1.6,.4,1), background .25s, color .25s"; setTimeout(() => b.style.transition = "", 420); });
  });

  /* ----- copy to clipboard ----- */
  const toast = $("#toast"); let tt;
  const say = m => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 1800); };
  $$(".copy").forEach(b => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); say("Copied " + b.dataset.copy); }
    catch (e) {
      const target = b.dataset.copy.includes("@") ? $("#mail") : $("#phone");
      const r = document.createRange(); r.selectNodeContents(target);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r); say("Press Ctrl+C to copy");
    }
  }));
})();
