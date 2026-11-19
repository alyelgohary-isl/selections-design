/* Drives ProcessDrawing.astro: scroll progress down the runway becomes four phase values
   (--p1 lines, --p2 dimensions, --p3 materials, --p4 the room) and the active step. */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoothScroll } from "./smooth-scroll.js";

gsap.registerPlugin(ScrollTrigger);

const span = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const PHASES = [[0.02, 0.26], [0.27, 0.49], [0.5, 0.74], [0.76, 0.95]];

document.querySelectorAll("[data-process]").forEach((runway) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { runway.classList.add("is-static"); return; }
  smoothScroll();
  const steps = [...runway.querySelectorAll("[data-step]")];
  const count = runway.querySelector(".process-count b");
  let active = -1;
  let pre = 0, last = 0;   // pre: the sheet coming up into view, before it pins. Over half the linework is drawn by then.
  const update = (p) => {
    last = p;
    runway.style.setProperty("--p", p.toFixed(4));
    PHASES.forEach(([a, b], i) => {
      const v = i === 0 ? Math.min(1, pre * 0.6 + span(p, a, b) * 0.4) : span(p, a, b);
      runway.style.setProperty(`--p${i + 1}`, v.toFixed(4));
    });
    const idx = p < PHASES[1][0] ? 0 : p < PHASES[2][0] ? 1 : p < PHASES[3][0] ? 2 : 3;
    if (idx !== active) {
      active = idx;
      steps.forEach((el, i) => el.classList.toggle("is-active", i === idx));
      if (count) count.textContent = String(idx + 1).padStart(2, "0");
    }
  };
  update(0);
  ScrollTrigger.create({ trigger: runway, start: "top 80%", end: "top top", scrub: true, onUpdate: (self) => { pre = self.progress; update(last); } });
  ScrollTrigger.create({ trigger: runway, start: "top top", end: "bottom bottom", scrub: true, onUpdate: (self) => update(self.progress) });

  // QA hook, same as the home film: ?p=0.6 jumps to that progress through the drawing
  const q = new URLSearchParams(location.search).get("p");
  if (q !== null) {
    const p = Math.min(1, Math.max(0, parseFloat(q)));
    const y = runway.getBoundingClientRect().top + window.scrollY + p * (runway.offsetHeight - window.innerHeight);
    const jump = () => { window.scrollTo(0, y); ScrollTrigger.refresh(); pre = 1; update(p); };
    if (document.readyState === "complete") jump(); else window.addEventListener("load", jump);
  }
});
