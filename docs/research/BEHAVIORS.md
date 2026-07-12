# BEHAVIORS.md — lukebaffait.fr (source-verified)

All values below are read directly from the site's unminified `index.js` / `index.css`
(saved in `docs/research/source/`). This is the behavior bible for every component spec.

## Global

- **Smooth scroll:** Lenis `{ lerp: 0.06 }`; `lenis.on('scroll', ScrollTrigger.update)`; driven by `gsap.ticker` with `lagSmoothing(0)`. Lenis lerp tightens to **0.04** while a project list item is near viewport center (ScrollTrigger per item, start 'top 52%', end 'bottom 48%'), back to 0.06 outside.
- **Fonts:** `Breton` (woff2, weight 300/400 usage), `other` = Machine.otf (display accent), `Zirena` (800, skills/contact display), `Inter` 400/600/700 (Google).
- **Colors:** bg `#0a0a0a`, fg `#f0f0f0`, red `#ff1e00` (fluid line, dots, arrow), red-alt `#ff3b14` (ascii + hover bg), white alphas: .08 (borders), .15 (separators), .2 (inactive project items), .3 (award idle), .45 (meta text), .8 (chr-hover letters).
- **Scrollbar hidden** (`scrollbar-width:none`, webkit display none). `overflow-x: clip` on html/body.
- **Reduced motion:** all animation/transition durations forced to 0.01ms; intro skipped (`master.progress(1)`).
- **Mobile (≤768px):** circle-gallery hidden entirely; proj-preview + proj-cursor hidden; scroll-pct + scroll-timeline hidden; hero bar collapses to center socials only; word-blur reveals drop the blur filter (opacity only).
- **isMobile** = `navigator.maxTouchPoints > 1`; isSlowHardware = mobile or ≤4 cores (frame-draw throttled to 32ms, DPR capped 1 vs 1.5).

## Intro / Preloader (time-driven master timeline, delay 0.2s)

DOM: `.intro-bg` (fixed black), `.name-layer` (fixed, z 10005) containing chars of "L" + "uke" + " Baffait" + ".", `.transition-panel` with `.t-panel-dark` + `.t-panel-red` (translateY 100%).
1. Chars split into masked spans (overflow hidden wrappers, padding .15em/.3em trick). All start `yPercent: 110`.
2. Rise in: `yPercent: 0`, 0.4s, `power3.out`, stagger `{each: .025, from: 'center'}`.
3. Dot fades in 0.25s.
4. `startShader()` — hero canvas renderer boots.
5. Pause 0.3s, then name scales to full width minus 48px padding (mobile 20px), translating so its visual center lands `80px` above viewport bottom (mobile max(18vh,110px)); 0.75s `power3.inOut`. After: converted to `fontSize` in vw units, re-anchored bottom, `name-layer` gets `mix-blend-mode: difference`.
6. Panels wipe: dark up `y:0%` 0.45s power3.inOut (overlap -0.05), red up 0.45s (-=0.3); then `intro-bg` display none, `hero` opacity 1; red exits `-100%` 0.55s (+=0.05), dark exits 0.55s (-=0.4).
7. Hero tagline: `clip-path inset(0 0 100% 0) → inset(0 0 0% 0)` + opacity, 1.1s power3.inOut (-=0.2). Hero bar same 1.0s (-=0.8). Hero line `scaleX 0→1` 1.0s (<).
8. `chr-hover` letters reveal: each `.ch-top` `clip-path inset(100% 0 0 0) → inset(0)`, 0.7s power3.out, position `elIdx*0.08 + i*0.03`.
9. Scroll unlocks only now (window scroll locked + lenis stopped during intro). Skip conditions: `sessionStorage['index-return-fade']` or prefers-reduced-motion → `master.progress(1)`.

## Hero scroll phase (scrub) — `#scroll-wrap` is 400vh, hero sticky 100vh inside

ScrollTrigger: trigger `#scroll-wrap`, start 'top top', end 'bottom bottom', **scrub 0.5**, one timeline (duration used as progress fractions):
- 0–0.3: name `y` returns to center (0.3), tagline/bar/line fade out (0.15).
- 0.3: `reveal-image-wrap` opacity 0→1 (0.01), reveal canvas+frame `scale 0→1` over 0.7 (linear).
- 0.3–1.0: name chars fly out: logo+`uke` to x −55vw (mobile −35vw), `Baffait`+dot to +55vw, opacity→0, 0.7 linear.
- 0.98: name-layer `autoAlpha 0`.
- 0.62: reveal phrase chars in: opacity 1 (+blur(10px)→0 on desktop), duration .06, stagger .007 from start.
- **Canvas frames:** progress < 0.3 → frame 0. In 0.3–1.0 phase: frame = phase2 * 0.82 * (341-1). (`FRAME_PROGRESS_AT_EXIT_START = 0.82`.)

## Reveal exit (scrub) — trigger `#section-after` start 'top bottom' end 'top top'

- `reveal-image-wrap` y → −50vh (linear).
- `reveal-overlay` (black) opacity 0→0.7 over 0.66.
- backdrop blur 0→16px (desktop only, if supported).
- Phrase chars out: opacity→0, dur .2, stagger .01 from 'end'.
- Canvas frames: 0.82→1.0 of 341 across this scrub.
- `section-after::before` = 30vh gradient (transparent→#0a0a0a) sitting above section top.

## About (`#about` inside `#section-after`)

- `about-text` + `about-version` split into `.word` spans: start `opacity 0, blur(8px)`; each word scrubbed individually: trigger = word, start 'top 75%', end 'top 60%', to opacity 1 blur 0.
- `about-sub`: whole block, opacity 0 + blur(12px) → 1/0, trigger start 'top 80%' end 'top 60%', scrub.
- `about-photo` (me.avif, right, radius 280px 0 0 280px, width min(55vw,780px)): parallax `y -50% → 50%` across wrap enter/exit (trigger photoWrap, 'top bottom'→'bottom top', scrub) + first 30%: opacity 0→1 blur 20→0.
- `about-version` right-aligned "→V3.0" (arrow SVG is a .word too).

## Projects (`#projects`)

- `fluid-line` SVG path (stroke #ff1e00, width 72, round caps): dasharray = pathLength; dashoffset scrubbed pathLength→0; trigger '#projects' start 'top 70%' end 'bottom 20%', scrub 1. SVG viewBox `0 0 1400 1400`, positioned top:-30vh, height calc(100%+100vh), `preserveAspectRatio="xMidYMid slice"`.
- List sticky (top 0, 100vh, width 45%, padding-left 12vw). Items: Breton clamp(2rem,4vw,4rem), color rgba(255,255,255,.2), active #f0f0f0 (transition .5s), border-bottom 1px rgba(255,255,255,.08).
- **Interaction model: scroll-proximity-driven (NOT hover).** On every Lenis scroll: item nearest viewport centerY becomes `.active` (only if dist < 45% of vh, else none). Each item also drifts `x = min(dist/halfVh,1)*80px` via `gsap.quickTo` (0.6s power2.out) — items bow away from center.
- Preview card (`.proj-preview` fixed right half, `perspective 800px`): visible class toggled by trigger '#projects' 'top 80%'→'bottom 20%'. On active change: card fades 0.18s out → swap img+date → 0.3/0.4s in. Card tilt follows mouse: targets ±6° rotY, ∓5° rotX, lerped at 0.12 per tick.
- `proj-cursor` "SEE PROJECT" pill (fixed, white bg, radius 50px, uppercase .7rem/700): follows mouse via quickTo 0.35s; `.active` (opacity 1) only while hovering the preview image; `cursor: none` on img.
- Click item: if not active → activate + lenis.scrollTo center it; if active → opens project-detail overlay (OUT OF SCOPE for clone, keep list + preview behavior only; clicking may center item).

## Circle gallery (`#circle-gallery`, 600vh, pin inner 100vh; desktop only)

- Each cover img replaced by wrapper of **10 vertical slices** (`.cg-slice`): width = imgW/10 (+1.5px overlap), backgroundPosition = −s*sliceW, transformOrigin `50% 50% −orbitR px`, each rotated `stepDeg` apart to curve around a cylinder; imgW = clamp(120, 14vw, 210), imgH = imgW*2/3; orbitR = (vw*0.34+500)/2.
- Pin: trigger '#circle-gallery' 'top top'→'bottom bottom', pin `#circle-gallery-pin`.
- Per image i of 8: `imgT = progress * totalRange − i*0.09` (totalRange = 1+0.09*7). Path (rx = vw*0.34, rz = 500, tiltY = 180 desktop):
  - t ≤ 0.12: fly in from left: x from −vw*0.85 → 0 at angle station, z 0→500, rotY 0, y = tiltY.
  - 0.12–0.88: full circle: angle = π/2 − p*2π; x = cos*rx; z = sin*rz; y = (z/rz)*tiltY; rotY = p*2π.
  - ≥0.88: fly out right: x → +vw*0.85, z 500→0.
  - opacity ramps in/out over first/last 0.06 of t; zIndex = round(z+600).
- Phrase (`#cg-phrase`): visible progress 0.25–0.75; translateY 200px*(0.5−p); words reveal in first 40% (per-word blur 8→0 window), fade out after 0.75.

## Scroll chrome

- `#scroll-pct` "(N)" = page scroll % (left 2rem, vertical center).
- `#scroll-timeline` (right 2rem, 80vh): one `.st-seg` per section {About, Projects, Gallery*, Skills, Contact} (*desktop only), flex = sectionHeight/zoneHeight; fill height % = progress within section; label text = active section name, positioned top = progress*100%; segment click → lenis.scrollTo(section, duration 1.2). Visible only while zone progress in (0, 0.90); also faded out by contact timeline (opacity 0 at 0.1–0.18 of contact tl).
- Both hidden ≤768px.

## Skills (`#skills`)

- Left column sticky (top 0, 100vh, width 60%, padding-top 15vh, padding-left 8rem).
- Accordion: first group open (height set explicitly). Click header (if not already open): close open group (height→0, 0.45s power3.inOut), open clicked (height→scrollHeight, 0.45s, then ScrollTrigger.refresh()). Icon: plus made of two 1px bars; open state rotates vertical bar 90° (0.4s cubic-bezier(.87,0,.13,1)).
- Red arrow (`#skills-arrow`, font-size clamp(8rem,14vw,12rem), color #ff1e00): scrubbed x from left edge to right edge of the left column (xPercent 0→100 plus x = colWidth − padding − arrowWidth), trigger '#skills' 'top top' → '#contact' 'top center', scrub 0.5.

## Awards (`#awards`)

- Rows (Inter, clamp(1rem,2vw,1.5rem), idle color rgba(255,255,255,.3), border rgba(255,255,255,.15), `cursor: none`).
- **Scroll-driven highlight:** per row ScrollTrigger start 'top center+=15%' end 'bottom center-=15%' toggleClass `active-award` → color #000, ::before white bg wipes in via clip-path polygon(0 0,0 0,0 100%,0 100%) → full, transition .5s cubic-bezier(.77,0,.175,1).
- **Cursor image:** fixed 250px img (radius 5px) follows mouse (gsap.set x/y, xPercent/yPercent −50), fades/scales in 0.8→1 on row hover; src = row's `data-cursor-img` (all = Portfolio.avif).

## Contact (`#contact`, min-height 180vh; pin sticky 100vh)

Master scrub trigger '#contact' 'top bottom'→'bottom bottom':
- `contact-blob` (fixed-bottom circle, 300vmax, #f0f0f0): scale 0→1 over first 0.6 — white floods screen from bottom.
- scroll timeline + pct fade out at 0.1.
- Title "Contact" (Zirena 800, clamp(5rem,13vw,12rem), color #0a0a0a): slides in from x = vw*1.1 → 0 (0.3, power3.out) at 0.18.
- Socials + mail clip-reveal (inset bottom 100%→0) at 0.28/0.36.
- Frame 1 (art/Untitled2.png, 25% wide, aspect 2/3, at left 75%/top 10%) + dispo text 1: fly from y = +1.1vh*100 → −1.4vh*100 (frames) / −1.65 (text) across 0.65 from 0.22; img inner parallax yPercent −30→30; text clip-wipes out at ~0.67. Frame 2 + dispo 2 offset +0.07. Frame corners = white crosshair marks (14px).
- `contact-bg` (fixed black) shows only while in contact zone (toggle display).

## Footer handoff (`#footer-transition` 80vh + fixed `#footer`)

Scrub trigger '#footer-transition' 'top bottom+=550' → 'bottom bottom':
- `contact-blob-wrap` becomes 110vh clipped box, borderRadius → 0 0 50px 50px (first 0.15), then whole white sheet flies up y = −(1.8vh*100+400) — revealing black footer beneath; contact pin y → −40vh; title/socials/mail clip-wipe out early.
- Footer `visibility: visible` + ascii parallax loop starts when transition enters ('top bottom+=500').
- Ascii panes: pre-rendered ASCII art from footer/left.png + right.png (80 cols, brightness → char pools, seeded rand 42), color #ff3b14, opacity .7; slide in from xPercent ∓100 (scrub); mouse-parallax (lerp .05, ±15px x, ±10px y). Hover: cells within radius ~2.5 (+noise) scramble to inverted-density pool chars with red bg `#ff3b14`/text #0a0a0a for 100/200ms.
- Footer top links: `.ch-top` clip reveal stagger .015, scrub 'center bottom+=500'→'bottom bottom'.
- Giant name "Luke Baffait.": per-char masked rise (yPercent 110→0, stagger .04 interleaved from outside-in: right side first), scrub same range; 17vw, Breton (Luke) + Machine (Baffait), red dot #ff1e00.

## chr-hover letter-roll (site-wide)

Every nav/social/mail link builds per-char `.ch-wrap` (overflow hidden) with `.ch-top` + `.ch-bot` stacked (bot at top:100%). Hover: both translateY(−100%), 0.6s cubic-bezier(.87,0,.13,1), per-char delay `var(--i) * 28ms`. Arrow glyphs 🡺/🡼/🞣 render as inline SVGs (getCharHTML).

## Hero canvas (`#hero-canvas`)

Custom WebGL renderer (core-renderer.js, 131KB engine + hero-project.js scene config) rendering a drifting red/crimson blurred blob field on black, subtly mouse-reactive; canvas 2160×1350 internal. CLONE APPROACH: approximate with a lightweight 2D canvas of 3–4 large radial-gradient blobs (red #ff1e00 core → transparent), heavy blur, slow organic drift + slight mouse parallax — visually equivalent at the blur levels used.
