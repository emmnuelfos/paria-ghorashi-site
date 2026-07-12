# Projects Specification

## Overview
- **Target file:** `src/components/Projects.tsx`
- **Screenshots:** `docs/design-references/orig-1440-s06.png`, `orig-1440-s07.png`, `orig-1440-s08.png`
- **Interaction model:** SCROLL-PROXIMITY activation (NOT hover) + mouse tilt/cursor + click-to-center
- **CSS classes exist in globals.css.**

## DOM (renders `.projects` div — parent section-after in assembly — PLUS two fixed layers)
```html
<div class="projects" id="projects">
  <svg class="fluid-line-svg" id="fluid-line-svg" viewBox="0 0 1400 1400" preserveAspectRatio="xMidYMid slice">
    <path class="fluid-line" id="fluid-line" d="M -80,0 C 300,-20 600,150 540,400 C 490,650 0,655 300,1050 C 600,1385 650,1250 850,1200 C 1050,1150 1350,1250 1540,1300"/>
  </svg>
  <div class="projects-inner">
    <div class="projects-list" id="projects-list">
      <div class="proj-item" data-id={p.id}>… name …</div>  <!-- 8 items from PROJECTS -->
    </div>
  </div>
</div>
<!-- fixed: -->
<div class="proj-preview" id="proj-preview">
  <div class="proj-card" id="proj-card">
    <div class="proj-meta"><span class="proj-date" id="proj-date">01 2025</span><span class="proj-label">Preview</span></div>
    <img id="proj-cover" src={PROJECTS[0].cover} alt="" width={1333} height={1000}/>
  </div>
</div>
<div class="proj-cursor" id="proj-cursor">See project</div>
```
Data: `PROJECTS` from @/data/site.

## Behaviors
1. **Fluid line:** set strokeDasharray/offset = path.getTotalLength(); gsap.to strokeDashoffset 0, scrub 1, trigger '#projects' 'top 70%'→'bottom 20%'.
2. **Visibility window:** ST trigger '#projects' 'top 80%'→'bottom 20%': enter/enterBack → preview.classList.add('visible'), projectsVisible=true; leave/leaveBack → remove + false.
3. **Proximity activation (on every lenis scroll — useLenis().on('scroll', fn); fallback window scroll):** for each item: dist = |itemCenterY − vh/2|; drift x via gsap.quickTo(item,'x',{duration:.6, ease:'power2.out'}) to min(dist/(vh/2),1)*80. Closest item with dist < 0.45*vh → activate: swap `.active` class; card crossfade — first activation: set img+date then card opacity→1 (0.4 power2.out); change: opacity→0 (0.18 power2.in) → swap src/date → opacity→1 (0.3). No active → card opacity→0 (0.25).
4. **Card tilt:** mousemove stores target rotY=±6°, rotX=∓5° from card-center offset (clamped ±1); gsap.ticker lerp 0.12 → card.style.transform rotateY/rotateX. Only while projectsVisible.
5. **Cursor pill:** quickTo left/top (0.35 power3.out) following mouse while visible; `.active` class only while hovering the #proj-cover img (mouseenter/leave).
6. **Click item:** if active → no-op (detail overlay out of scope; keep TODO comment); else activate + lenis.scrollTo(item docTop − vh/2 + itemH/2, {duration:1.2}).
7. **Lenis lerp tighten:** per item ST 'top 52%'/'bottom 48%': enter/enterBack → lenis.options.lerp=0.04; leave/leaveBack → 0.06.

## Responsive
≤768: preview + cursor hidden (CSS); items relative list (CSS); proximity activation still runs (harmless).

## Verify
`npx tsc --noEmit`. Named export `Projects`. Cleanup: kill STs, remove lenis listener, remove ticker fn.
