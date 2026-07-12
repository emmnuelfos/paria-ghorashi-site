# IntroOverlay + Hero + HeroCanvas Specification

## Overview
- **Target files:** `src/components/IntroOverlay.tsx`, `src/components/Hero.tsx`, `src/components/HeroCanvas.tsx`
- **Screenshots:** `docs/design-references/orig-1440-s00.png` (hero settled), `orig-1440-s01.png`, `orig-1440-s02.png` (scroll transition out)
- **Interaction model:** time-driven intro (once) + scroll-scrubbed exit + hover letter-rolls
- **All CSS classes already exist in globals.css** — reuse exact class names/IDs. No new CSS files.

## DOM structure (IntroOverlay — rendered above everything)
```html
<div class="intro-bg" id="intro-bg"></div>
<div class="name-layer" id="name-layer">
  <div class="preloader-content" id="preloader-content">
    <div id="preloader-logo">L</div>
    <span id="preloader-luke">uke</span>
    <span id="preloader-baffait"> Baffait</span>
    <span id="preloader-dot">.</span>
  </div>
</div>
<div class="transition-panel" id="transition-panel">
  <div class="t-panel-dark" id="t-panel-dark"></div>
  <div class="t-panel-red" id="t-panel-red"></div>
</div>
```

## DOM structure (Hero)
```html
<div class="scroll-wrap" id="scroll-wrap">
  <section class="hero" id="hero">
    <h1 class="sr-only">Luke Baffait — Creative Developer…</h1>
    <div class="hero-canvas" id="hero-canvas">  <!-- HeroCanvas renders <canvas> filling this --> </div>
    <div class="hero-content">
      <div class="hero-tagline" id="hero-tagline"><!-- COPY.heroTagline via dangerouslySetInnerHTML --></div>
      <div class="hero-line" id="hero-line"></div>
      <div class="hero-bar" id="hero-bar">
        <div class="hero-bar-left"><CharRoll text="🡺V3.0" (use \u{1F87A} + "V3.0")/></div>
        <nav class="hero-bar-center" aria-label="Social links">
          <CharRoll Behance/> <span class="sep">/</span> <CharRoll LinkedIn/> <span class="sep">/</span> <CharRoll GitHub/>
        </nav>
        <nav class="hero-bar-right"><CharRoll Work #projects/> <CharRoll Info #about/> <CharRoll Contact #contact/></nav>
      </div>
    </div>
  </section>
</div>
```
Socials/hrefs from `SOCIALS`/`NAV_LINKS` in `@/data/site`.

## Intro master timeline (gsap.timeline({delay:0.2}), useEffect once)
1. Split #preloader-logo/-luke/-baffait into chars via `splitIntoChars` (@/lib/text). Set all char inners `yPercent:110`; parents opacity 1; dot opacity 0.
2. layoutNames(): position #preloader-baffait at left = (luke.offsetLeft + luke.offsetWidth + fontSize*0.55)px converted to em (top -0.06em); dot after baffait. Set pContent x = −(totalWidth/2 − logoWidth/2). totalWidth = logo+luke+gap+baffait+dot widths.
3. Chars rise: yPercent 0, 0.4s power3.out, stagger {each:.025, from:'center'}; then layoutNames() again; dot opacity 1 (0.25s).
4. Start HeroCanvas animation; pause 0.3s.
5. Scale-to-bottom step: scale = (viewportW − 2*pad)/totalW (pad 48 desktop / 20 mobile); transformOrigin = visual center; y += delta so scaled visual center sits at (vh − bottomPad − scaledH/2), bottomPad 80 desktop / max(18vh,110) mobile; 0.75s power3.inOut. onComplete: hide content, set scale 1 x 0 y 0, set fontSize of the four parts to (base*scale/vw)vw units, `name-layer` mixBlendMode 'difference', re-anchor at bottom (keep re-anchoring on resize until scroll starts).
6. Panels: t-panel-dark y 100%→0% 0.45s power3.inOut ('<+=0.05'); t-panel-red same ('-=0.3'); set intro-bg display none; set #hero opacity 1; red y→−100% 0.55s ('+=0.05'); dark →−100% 0.55s ('-=0.4').
7. Hero chrome in: #hero-tagline {opacity 1, clipPath inset(0 0 0% 0)} 1.1s power3.inOut ('-=0.2'); #hero-bar same 1.0s ('-=0.8'); #hero-line fromTo scaleX 0→1 (opacity 1) 1.0s ('<').
8. chr-hover reveal: all `.ch-top` fromTo clipPath inset(100% 0 0 0)→inset(0), 0.7s power3.out, position elIdx*0.08 + i*0.03 ('-=0.8'). (Element list: iterate document.querySelectorAll('.chr-hover') at that moment.)
9. Final add(): remove scroll locks; lenis.start(); dispatch `window.dispatchEvent(new CustomEvent('intro:done'))`; remove transition-panel + intro-bg nodes.

**Scroll locking during intro:** on mount: window.scrollTo(0,0); lenis?.stop() (lenis may arrive async — watch for it via useLenis and stop immediately while intro playing); html overflow hidden (desktop) / touchmove preventDefault (mobile).
**Reduced motion / skip:** if prefersReducedMotion() → master.progress(1) immediately.

## Hero scroll-out (own ScrollTrigger, created after intro:done)
Trigger '#scroll-wrap', start 'top top', end 'bottom bottom', scrub 0.5, timeline positions as fractions:
- 0: pContent y → 0 (from bottom anchor y) over 0.3 (x stays at settled vw offset); tagline/bar/line opacity→0 over 0.15.
- 0.3: name chars fly out over 0.7 linear: #preloader-logo & -luke x→'-55vw' (mobile '-35vw') opacity 0; -baffait & -dot x→'+55vw' opacity 0.
- 0.98: name-layer autoAlpha 0.
(The reveal canvas part is a SEPARATE component's ScrollTrigger — do not implement it here.)
Stop the bottom re-anchoring on first scroll (progress > 0.001).

## HeroCanvas (approximation of the WebGL blob — visual target: orig-1440-s00.png)
Canvas 2D filling .hero-canvas. Black bg; 3–4 large blobs drifting slowly (organic sin/cos paths, periods 8–20s), each a radial gradient core #ff1e00 → rgba(255,30,0,0) with radius 25–45% vw; composite 'lighter'; whole canvas drawn at 0.5 scale then upscaled w/ ctx filter blur(60px) (or draw to offscreen small canvas and scale up — cheaper). Slight mouse parallax: blob centers offset by (mouse−center)*0.03, lerped 0.05/frame. Subtle darker red secondary tone #7a0f00 mixed. 30fps cap. Pause when hero not in viewport (IntersectionObserver) and respect prefersReducedMotion (static frame).

## Responsive
≤768px: hero-bar-left/right hidden (CSS handles); intro pad 20px; bottomPad max(18vh,110px).

## Verify
`npx tsc --noEmit` clean. Components export named `IntroOverlay`, `Hero`, `HeroCanvas` (Hero renders HeroCanvas internally inside .hero-canvas).
