# Selections Interiors & Design

Five-page site for selectionsdesign.com: a static [Astro](https://astro.build) project deployed to GitHub Pages.

- `src/components/motion/DrawnFilm.astro` + `Sheet.astro` + `drawn-film.js`: the full-viewport "drawing sheet" sequence (home, Work and Studio heroes). Live layers, no frame sequences: each sheet is a photograph and an ink drawing made from it.
- `src/components/motion/ProcessDrawing.astro`: the pinned four-step shop drawing on the Millwork page (hand-authored SVG).
- `tools/draw.sh <photo> <slug> <width>`: makes the registered photo + drawing pair in `public/assets/img/`.
- `tools/redraw.sh <generated.png> <slug>`: swaps a traced drawing for a cleaner one generated with Nano Banana 2 in edit mode from the same photo (`tools/kie.py image --ar 3:2 --ref <photo>`; prompt and spend are logged in `work/gen/kie.log`). The generated drawings stay registered with the photo; `kie.py` needs `requests` (`work/.venv`).
- `src/styles/selections.css`: the theme, loaded after the template stylesheet. `src/data/projects.ts` and `clients.ts`: Work page and client schedule.
- `ScrollFilm`, `ScrollScrub` and `HeroLoop` in `src/components/motion/` are unused here.
- Ships `noindex` (`src/site.config.ts` → `noindex`) until launch.

## Run it

```sh
npm install
npm run dev      # prints the local URL
npm run build    # static site in dist/
```

## Where things are

```
src/site.config.ts        brand, contact details, nav, footer, schema, noindex
src/pages/                index (home film), work/, millwork/, studio/, contact/
src/styles/               style.css (base components) + selections.css (theme)
public/assets/img/        photographs and their line drawings (<slug>.webp, <slug>-line.webp)
public/js/config.js       form endpoint and reCAPTCHA site key
.github/workflows/        build and deploy to GitHub Pages on push to main
```

Forms post to the Formspree endpoint in `public/js/config.js`; with none set they show the sent state without sending.
Photographs are the property of Selections Interiors & Design and their photographers.
