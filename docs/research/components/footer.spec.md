# FooterSection Specification

## Overview
- **Target file:** `src/components/FooterSection.tsx`
- **Screenshots:** `docs/design-references/orig-1440-s20.png` (footer), `orig-1440-s19.png` (transition)
- **Interaction model:** scroll-scrubbed reveal + mouse parallax + hover ascii scramble
- **CSS classes exist in globals.css.**

## DOM
```html
<div class="footer-transition" id="footer-transition"></div>
<footer class="footer" id="footer">
  <div class="footer-content" id="footer-content">
    <div class="footer-top">
      <div class="footer-top-col">
        <CharRoll spaceGaps className="footer-mail" text="luke.baffait@yahoo.com" href="mailto:luke.baffait@yahoo.com"/>
        <CharRoll spaceGaps className="footer-date" text="© 2026"/>
      </div>
      <nav class="footer-top-col"><CharRoll spaceGaps GitHub/LinkedIn/Behance from SOCIALS/></nav>
      <nav class="footer-top-col"><CharRoll spaceGaps Work #projects / Info #about / Contact #contact/></nav>
    </div>
    <div class="footer-ascii-wrap">
      <div class="footer-ascii left"><pre id="ascii-left"></pre></div>
      <div class="footer-ascii right"><pre id="ascii-right"></pre></div>
    </div>
    <div class="footer-name">
      <span class="footer-name-luke"><span class="first-letter">L</span>uke</span>
      <span class="footer-name-baffait-wrap"><span class="footer-name-baffait">Baffait</span><span class="footer-name-dot">.</span></span>
    </div>
  </div>
</footer>
```

## ASCII art generation (client-side, on mount)
Sources: `/assets/images/footer/left.png`, `/assets/images/footer/right.png`, 80 cols each.
- Draw image to offscreen canvas (cols × rows; rows = round(cols * imgH/imgW)); read pixels.
- Char pools by brightness (8 pools): [' ', '·.,', ':;`-~^', '=+<>?!:;', '|/\\()[]{}«»', '÷×±≈≠≤≥∞∑∏√∫', '¤†‡§¶©®™°¬', '%&#$@¥€£¢'].
- Per cell: alpha<15 → space (pool −1); brightness = (0.299r+0.587g+0.114b)/255 * (a/255); poolIdx = min(floor(brightness*(8−1)*0.8), 7); char = seeded-random pick from pool (LCG seed 42: seed=(seed*16807)%2147483647; r=seed/2147483647 — reset seed per image).
- Store poolGrid for hover effect; set pre.textContent.

## ASCII hover scramble
On pre mousemove: convert mouse to cell coords; cells within radius 2.5+noise (per-cell deterministic noise from sin hash, ±2.5) get hitTime=now; rAF loop while any active: cells with elapsed < duration (100/200ms per-cell) render as `<span style="color:#0a0a0a;background:#ff3b14">X</span>` where X random from INVERTED pool (POOLS[7−poolIdx]); others original char (escape <>&). When none active restore textContent.

## Scroll behaviors
1. Ascii panes slide in: left fromTo xPercent −100→0, right +100→0; trigger '#footer-transition', start 'top bottom+=500', end 'bottom bottom', scrub.
2. Footer top links `.ch-top`: clipPath inset(100% 0 0 0)→inset(0), stagger .015 from start, power3.out; trigger 'center bottom+=500'→'bottom bottom', scrub.
3. Giant name: rebuild chars (masked outer spans overflow hidden, padding 0.1em/0.3em trick; keep 'first-letter' class on L's outer). Order chars interleaved outside-in: rightSide = Baffait+dot chars, lukeRev = 'Luke' reversed; alternate [right[i], lukeRev[i]]. Set yPercent 110 → to 0, power3.out, stagger .04, same trigger range as (2), scrub.
4. Footer visibility: ST 'top bottom+=500'→'bottom bottom': onEnter → footer.style.visibility='visible', start mouse parallax rAF loop; onLeaveBack → hidden, stop loop.
5. Mouse parallax (desktop): normalized mouse (−1..1); lerp 0.05; left pre translate(min(0, sx*−15−15)px, sy*−10px); right pre translate(max(0, sx*15+15)px, same y).
6. **Contact exit handoff (owned here):** timeline trigger '#footer-transition', start 'top bottom+=550', end 'bottom bottom', scrub:
   - set #contact-blob-wrap {height '110vh', overflow hidden, borderRadius '0 0 0 0'} at 0; to borderRadius '0 0 50px 50px' (0.15, power2.out); to y −(vh*1.8+400) (1.0 linear, immediateRender false).
   - #contact-pin to y '-40vh', pointerEvents none (1.0 linear).
   - [#contact-socials, #contact-mail] clipPath → inset(0 0 100% 0) (0.1); #contact-title same (0.25, power2.in).
   - onUpdate: p>0.2 → #contact-bg display none + #contact pointer-events none; else restore.
7. Right ascii pane hidden ≤1200px (CSS). Mobile columns repositioned by CSS.

## Verify
`npx tsc --noEmit`. Named export `FooterSection`. Cleanup loops/STs on unmount.
