# RevealSequence Specification

## Overview
- **Target file:** `src/components/RevealSequence.tsx`
- **Screenshots:** `docs/design-references/orig-1440-s02.png`, `orig-1440-s03.png`, `orig-1440-s04.png`
- **Interaction model:** scroll-scrubbed canvas frame sequence (341 frames), two phases
- **CSS classes exist in globals.css** — reuse exactly.

## DOM
```html
<div class="reveal-image-wrap" id="reveal-image-wrap">
  <canvas class="reveal-image reveal-seq" id="reveal-canvas"></canvas>
  <div class="reveal-frame reveal-seq">
    <span class="reveal-corner tl"></span><span class="reveal-corner tr"></span>
    <span class="reveal-corner bl"></span><span class="reveal-corner br"></span>
  </div>
  <div class="reveal-overlay" id="reveal-overlay"></div>
  <p class="reveal-phrase" id="reveal-phrase">Basically, I make websites.</p>
</div>
```

## Frame loading
- URLs: `/assets/images/hero sequence/0001.jpg` … `0341.jpg` (NOTE: real space in dir name; use encodeURI or literal '%20').
- Load frame 1 first → draw immediately. Then batch frames 2–11 (parallel), measure elapsed: >4000ms → skip=3, >2000ms → skip=2, else 1 (mobile min 3). Then load remaining (from 12) with that skip, concurrency 6 (2 slow hw), retry twice, track loaded indexes sorted.
- drawFrameAtProgress(p): index into loadedFrameIdx by round(p*(loadedCount−1)) → drawFrame(sourceIdx). Draw = cover-fit (max scale) centered, clearRect first, skip if same idx. DPR = min(devicePixelRatio,1.5), 1 on slow hw; throttle 32ms on slow hw. Resize handler re-draws.

## Phrase
Split each char into `.rp-char` inline-block spans (space = nbsp). Initial: opacity 0 (+ filter blur(10px) desktop only).

## ScrollTrigger 1 — entry (trigger '#scroll-wrap', start 'top top', end 'bottom bottom', scrub 0.5)
Timeline fractions:
- 0.3: wrap opacity 0→1 (dur 0.01); `.reveal-seq` (canvas + frame div) scale 0→1 over 0.7 linear.
- 0.62: phrase chars in — opacity 1 (+blur 0 desktop), dur .06, stagger {each:.007, from:'start'}.
- onUpdate: p<0.3 → drawFrameAtProgress(0); else phase2=(p−0.3)/0.7 → drawFrameAtProgress(phase2*0.82).

## ScrollTrigger 2 — exit (trigger '#section-after', start 'top bottom', end 'top top', scrub true)
- wrap y → '-50vh' linear.
- #reveal-overlay opacity 0→0.7 over 0.66.
- backdropFilter blur(0)→blur(16px) (desktop only, if CSS.supports backdrop-filter).
- onUpdate: drawFrameAtProgress(0.82 + progress*0.18); onLeave → 1; onLeaveBack → 0.82.

## ScrollTrigger 3 — phrase exit (same trigger/range as 2)
- chars opacity→0, dur .2, stagger {each:.01, from:'end'}, immediateRender false.

## Setup timing
Create ScrollTriggers on mount but start frame loading immediately; listen for 'intro:done' → ScrollTrigger.refresh(). All triggers killed on unmount.

## Responsive / motion
Mobile: no blur filters on chars. prefersReducedMotion: skip stagger niceties (still functional scrub).

## Verify
`npx tsc --noEmit` clean. Named export `RevealSequence`.
