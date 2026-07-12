# CircleGallery Specification

## Overview
- **Target file:** `src/components/CircleGallery.tsx`
- **Screenshots:** `docs/design-references/orig-1440-s09.png` … `orig-1440-s14.png`
- **Interaction model:** scroll-scrubbed pinned 3D orbit (desktop only; return null markup still rendered but CSS hides ≤768 — render nothing dynamic on mobile)
- **CSS classes exist in globals.css.**

## DOM
```html
<section class="circle-gallery" id="circle-gallery">
  <div class="circle-gallery-pin" id="circle-gallery-pin">
    <!-- 8 sliced-image wrappers built imperatively (below) -->
    <p class="cg-phrase" id="cg-phrase"><!-- COPY.cgPhrase innerHTML --></p>
  </div>
</section>
```
Images: `GALLERY_COVERS` (8 covers) from @/data/site.

## Slice construction (on mount, desktop only — skip entirely if isMobileViewport())
For each cover: create `div.cg-img` containing 10 `div.cg-slice`:
- imgW = clamp(120, vw*0.14, 210); imgH = imgW*2/3; orbitR = (vw*0.34+500)/2; sliceW = imgW/10; displayW = sliceW+1.5.
- Slice s: width displayW px; left 50%; marginLeft −displayW/2; backgroundImage url(cover); backgroundSize `${imgW}px ${imgH}px`; backgroundPosition `${−s*sliceW}px 0`; transformOrigin `50% 50% ${−orbitR}px`; transform rotateY(((s−4.5) * (imgW/orbitR in deg /10))°). totalBendDeg = (imgW/orbitR)*180/π; stepDeg = totalBendDeg/10.
(React approach: build via useEffect with document.createElement OR render slices in JSX computed after mount from measured vw — either fine; must be client-only to avoid hydration mismatch.)

## Orbit ScrollTrigger
trigger '#circle-gallery', 'top top'→'bottom bottom', pin: '#circle-gallery-pin'.
Constants: rx = vw*0.34; rz = 500; tiltY = 180; stagger = 0.09; totalRange = 1+0.09*7; entryAngle = π/2; offX = vw*0.85.
onUpdate per image i: imgT = progress*totalRange − i*stagger; outside (0,1) → opacity 0.
- imgT≤0.12: p=t/0.12 → x=−offX*(1−p), y=tiltY, z=rz*p, rotY=0.
- ≤0.88: p=(t−0.12)/0.76; angle=entryAngle−p*2π; x=cos(angle)*rx; z=sin(angle)*rz; y=(z/rz)*tiltY; rotY=p*2π.
- else: p=(t−0.88)/0.12 → x=offX*p, y=tiltY, z=rz*(1−p), rotY=2π.
Apply: transform translate3d(x,y,z) rotateY(deg); opacity ramp in/out over 0.06 edges; zIndex round(z+600).

## Phrase
wrapWords on #cg-phrase. Visible progress 0.25–0.75: translateY = 200*(0.5−globalP); word reveal across first 0.4 of that window: wordT = revealP*(N+4)−wi; wP = clamp(wordT/3, 0, 1); opacity wP; blur 8*(1−wP). Fade whole: first 10% ramp in, after 75% ramp out.

## Verify
`npx tsc --noEmit`. Named export `CircleGallery`. Kill ST + unpin on unmount. Recompute slices on resize crossing breakpoints is NOT required (original doesn't).
