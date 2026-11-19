/* Site-wide pieces of the drawing-sheet language that are not part of a pinned sequence:
   - [data-drawn]: a figure that starts as its drawing and is cut to the photograph when it scrolls into view
   - [data-strip]: a project's row of photographs, which slides sideways as the page scrolls past (wide screens) */
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const drawn = document.querySelectorAll("[data-drawn]");
if (drawn.length) {
  if (reduced || !("IntersectionObserver" in window)) drawn.forEach((el) => el.classList.add("in"));
  else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -18% 0px", threshold: 0.15 });
    drawn.forEach((el) => io.observe(el));
  }
}

const strips = document.querySelectorAll("[data-strip]");
if (strips.length && !reduced && window.matchMedia("(min-width: 861px)").matches) {
  Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("../components/motion/smooth-scroll.js")]).then(([{ gsap }, { ScrollTrigger }, { smoothScroll }]) => {
    gsap.registerPlugin(ScrollTrigger);
    smoothScroll();
    strips.forEach((strip) => {
      const track = strip.querySelector(".strip-track");
      const overflow = () => Math.max(0, track.scrollWidth - strip.clientWidth);
      gsap.fromTo(track, { x: 0 }, {
        x: () => -overflow(), ease: "none",
        scrollTrigger: { trigger: strip, start: "top 82%", end: "bottom 18%", scrub: 0.6, invalidateOnRefresh: true },
      });
    });
    // filters change the page height
    document.addEventListener("work:filter", () => ScrollTrigger.refresh());
  });
}
