/* Drawn film engine. A sticky, full-viewport stage holds a stack of sheets; scroll progress
   down the runway is turned into a handful of 0..1 custom properties on each sheet, and the
   CSS in DrawnFilm.astro does the drawing: dimension strings, the cut from drawing to
   photograph, the next sheet arriving. No frames, no canvas: two images per sheet.

   Per sheet, with t = progress through its own stretch of the runway:
     --enter   0→1   the sheet arrives over the previous one (first sheet: always 1)
     --draw    0→1   dimension strings draw across the drawing
     --tb      0→1   the title block (the copy) settles into the corner
     --reveal  0→1   the cut: drawing becomes room
     --zoom    1.06→1  both layers settle together, so they stay registered
     --hero    1→0   first sheet only: the load copy lifts away and the linework comes up to full strength */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoothScroll } from "./smooth-scroll.js";

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const span = (t, a, b) => clamp01((t - a) / (b - a));
const smooth = (t) => t * t * (3 - 2 * t);

document.querySelectorAll("[data-drawn-film]").forEach(initDrawnFilm);

function initDrawnFilm(root) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const runway = root.querySelector(".film-runway");
  const stage = root.querySelector(".film-stage");
  const loaderEl = root.querySelector(".film-loader");
  const progressEl = root.querySelector(".film-progress");
  const cueEl = root.querySelector(".scroll-cue");

  const sheets = [...root.querySelectorAll("[data-sheet]")].map((el) => ({
    el,
    id: el.dataset.id,
    no: el.dataset.no,
    units: parseFloat(el.dataset.units || "1"),
    hero: el.classList.contains("has-hero"),
    plain: el.classList.contains("is-plain"),
    counted: false,
  }));
  {
    const total = sheets.reduce((a, s) => a + s.units, 0);
    let acc = 0;
    for (const s of sheets) { s.p0 = acc / total; acc += s.units; s.p1 = acc / total; }
  }
  const byId = Object.fromEntries(sheets.map((s) => [s.id, s]));
  if (progressEl) progressEl.querySelector(".fp-of").textContent = sheets.length > 1 ? "/ " + String(sheets[sheets.length - 1].no) : "";

  /* "wardrobe:0.5" → runway progress half way through that sheet (QA and anchors) */
  function at(ref) {
    const [id, frac] = String(ref).trim().split(":");
    const s = byId[id];
    if (!s) return 0;
    return s.p0 + parseFloat(frac ?? "0") * (s.p1 - s.p0);
  }

  /* ——— Dimension labels: the sheet is the visitor's own screen, so the strings measure it ——— */
  function measure() {
    root.querySelectorAll(".panel").forEach((panel) => {
      const r = panel.getBoundingClientRect();
      const w = panel.querySelector('[data-dim="w"]');
      const h = panel.querySelector('[data-dim="h"]');
      if (w) w.textContent = Math.round(panel.offsetWidth);
      if (h) h.textContent = Math.round(panel.offsetHeight);
      void r;
    });
  }

  /* ——— Loader: the first sheet's two images and the fonts, then lift ——— */
  function ready() {
    const first = sheets[0];
    const imgs = first ? [...first.el.querySelectorAll("img")] : [];
    let done = 0;
    const bar = loaderEl && loaderEl.querySelector(".loader-bar");
    const pct = loaderEl && loaderEl.querySelector(".loader-percent");
    const tick = () => {
      done++;
      const v = Math.round((done / (imgs.length + 1)) * 100);
      if (bar) bar.style.width = v + "%";
      if (pct) pct.textContent = v;
    };
    const one = (img) => new Promise((res) => {
      if (img.complete && img.naturalWidth) return res();
      img.addEventListener("load", res, { once: true });
      img.addEventListener("error", res, { once: true });
    }).then(tick);
    const fonts = (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(tick);
    const all = Promise.all([...imgs.map(one), fonts]);
    const timeout = new Promise((res) => setTimeout(res, 6000));
    return Promise.race([all, timeout]);
  }

  function playIntro() {
    const hero = root.querySelector(".sheet-hero");
    if (!hero || reduced) return;
    const q = (sel) => hero.querySelectorAll(sel);
    const steps = [
      [q(".eyebrow"), { y: 14, opacity: 0, duration: 0.6, ease: "power3.out" }],
      [q(".hero-heading .word"), { yPercent: 115, duration: 1.1, stagger: 0.09, ease: "power4.out" }, "-=0.3"],
      [q(".hero-tagline"), { y: 26, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6"],
      [q(".hero-ctas .btn"), { y: 20, opacity: 0, stagger: 0.09, duration: 0.7, ease: "power3.out" }, "-=0.5"],
    ];
    const tl = gsap.timeline();
    steps.forEach(([els, vars, pos]) => { if (els.length) tl.from(els, vars, pos); });
  }

  if (reduced) {
    root.classList.add("is-static");
    sheets.forEach((s) => s.el.classList.add("is-on"));
    measure();
    window.addEventListener("resize", measure);
    ready().then(() => loaderEl && loaderEl.classList.add("done"));
    window.scrollFilm = { frame: 0, frames: sheets.length, at };
    return;
  }

  const lenis = smoothScroll();

  /* ——— The scroll → sheet state mapping ——— */
  const ENTER = 0.2;      // share of a sheet's stretch spent arriving
  let current = 0;

  function fireCounters(scope) {
    scope.querySelectorAll(".stat-number[data-value]").forEach((el) => {
      if (el.hasAttribute("data-static")) return;   // years, codes: never count up
      const target = parseFloat(el.dataset.value);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: target, duration: 1.6, ease: "power1.out",
        snap: { textContent: decimals === 0 ? 1 : 0.1 },
        onUpdate() { el.textContent = parseFloat(el.textContent).toFixed(decimals); },
      });
    });
  }

  function update(p) {
    let top = 0;
    sheets.forEach((s, i) => {
      const t = (p - s.p0) / (s.p1 - s.p0);
      const first = i === 0;
      const enter = first ? 1 : smooth(span(t, 0, ENTER));
      const next = sheets[i + 1];
      const covered = !!next && (p - next.p0) / (next.p1 - next.p0) >= ENTER;
      const on = enter > 0 && !covered;
      s.el.classList.toggle("is-on", on);
      if (enter > 0.5) top = i;
      if (!on) return;

      let draw, tb, reveal, hero = 0;
      if (s.hero) {
        hero = 1 - smooth(span(t, 0.04, 0.2));
        draw = span(t, 0.1, 0.36);
        tb = smooth(span(t, 0.22, 0.32));
        reveal = smooth(span(t, 0.42, 0.84));
      } else if (s.plain) {
        draw = span(t, ENTER * 0.5, 0.55);
        tb = 1; reveal = 1;
      } else {
        draw = span(t, ENTER * 0.5, 0.44);
        tb = smooth(span(t, ENTER * 0.7, ENTER * 0.7 + 0.12));
        reveal = smooth(span(t, 0.46, 0.86));
      }
      const st = s.el.style;
      st.setProperty("--enter", enter.toFixed(4));
      st.setProperty("--draw", draw.toFixed(4));
      st.setProperty("--tb", tb.toFixed(4));
      st.setProperty("--reveal", reveal.toFixed(4));
      st.setProperty("--zoom", (1.06 - 0.06 * clamp01(t)).toFixed(4));
      st.setProperty("--hero", hero.toFixed(4));
      if (s.hero) s.el.classList.toggle("hero-gone", hero <= 0.001);

      if (s.plain && !s.counted && draw > 0.25) { s.counted = true; fireCounters(s.el); }
      if (s.plain && s.counted && enter < 0.05) s.counted = false;
    });

    current = top;
    if (progressEl) {
      progressEl.querySelector(".fp-no").textContent = sheets[top].no;
      progressEl.style.setProperty("--p", p.toFixed(4));
    }
    if (cueEl) cueEl.style.setProperty("--cue", p < 0.012 ? "1" : "0");
  }

  ScrollTrigger.create({
    trigger: runway,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => update(self.progress),
  });

  /* ——— Same-page anchors (Lenis) ——— */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href === "#") return;
      e.preventDefault();
      if (href === "#top") return lenis.scrollTo(0, { duration: 1.6 });
      const el = document.querySelector(href);
      if (el) lenis.scrollTo(el, { offset: -70, duration: 1.6 });
    });
  });

  window.addEventListener("resize", () => { measure(); ScrollTrigger.refresh(); });

  /* ——— QA hook: ?p=0.42 jumps straight to that progress once the sheet is ready ——— */
  function jumpToProgress() {
    const q = new URLSearchParams(location.search).get("p");
    if (q === null) return;
    const p = clamp01(parseFloat(q));
    const top = runway.getBoundingClientRect().top + window.scrollY;
    const y = top + p * (runway.offsetHeight - window.innerHeight);
    lenis.scrollTo(y, { immediate: true });
    window.scrollTo(0, y);
    ScrollTrigger.refresh();
    update(p);
  }

  // read by tools/shoot.mjs
  window.scrollFilm = { get frame() { return current; }, frames: sheets.length, at };

  measure();
  update(0);
  void stage;
  ready().then(() => {
    if (loaderEl) loaderEl.classList.add("done");
    playIntro();
    jumpToProgress();
  });
}
