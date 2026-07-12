# ScrollChrome Specification

## Overview
- **Target file:** `src/components/ScrollChrome.tsx`
- **Interaction model:** scroll-driven indicators + click-to-navigate
- **CSS classes exist in globals.css.**

## DOM
```html
<div class="scroll-pct" id="scroll-pct">(0)</div>
<div class="scroll-timeline" id="scroll-timeline">
  <span class="st-label" id="st-label"></span>
  <div class="st-bar" id="st-bar"><!-- segments built dynamically --></div>
</div>
```

## Behavior (desktop only; hidden ≤768 by CSS; also skip building on mobile viewport)
Sections: [{id:'about','About'},{id:'projects','Projects'},{id:'circle-gallery','Gallery' (skip if mobile)},{id:'skills','Skills'},{id:'contact','Contact'}].
Build after 'intro:done' event + ScrollTrigger.refresh (positions need settled layout; measure with getBoundingClientRect + scrollY):
- zoneTop = top of first section; zoneBottom = bottom of last; per section ratio = height/zoneH → `.st-seg` with style flex=ratio and title=name, containing `.st-seg-fill`.
- Segment click → lenis.scrollTo('#'+id, {offset 0, duration 1.2}).
- ST trigger first section 'top bottom' … endTrigger last 'bottom bottom': onUpdate:
  - pct text = "(" + round(scrollY / (docH−vh) * 100) + ")".
  - progress ≤0 or ≥0.90 → remove 'visible' from both; else add.
  - fill heights: cumulative ratios — full for passed sections, proportional for active, 0 after; label.textContent = active name; label.style.top = progress*100 + '%'.

## Verify
`npx tsc --noEmit`. Named export `ScrollChrome`. Cleanup.
