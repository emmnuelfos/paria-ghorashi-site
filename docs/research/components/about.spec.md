# About Specification

## Overview
- **Target file:** `src/components/About.tsx`
- **Screenshots:** `docs/design-references/orig-1440-s04.png`, `orig-1440-s05.png`
- **Interaction model:** scroll-scrubbed word reveals + photo parallax
- **CSS classes exist in globals.css.**

## DOM (inside parent `section.section-after` — parent rendered by page assembly; this component renders the `.about` div)
```html
<div class="about" id="about">
  <div class="about-text" id="about-text"><!-- COPY.aboutText innerHTML --></div>
  <div class="about-sub" id="about-sub"><!-- COPY.aboutSub --></div>
  <div class="about-btn"><CharRoll text="Info" href="#about"/></div>
  <div class="about-version"><ArrowRightIcon/>V3.0</div>
  <div class="about-photo-wrap" id="about-photo-wrap">
    <img class="about-photo" src="/assets/images/profile/me.avif" alt="Luke Baffait" width={2500} height={3001} decoding="async"/>
  </div>
</div>
```

## Behaviors (all scrub)
1. `wrapWords` (@/lib/text) on #about-text and .about-version (the svg icon inside about-version also gets class 'word'). `.word` initial state comes from CSS (opacity 0, blur 8px). Per word: gsap.to(word, {opacity:1, filter:'blur(0px)' desktop}, scrollTrigger {trigger: word, start 'top 75%', end 'top 60%', scrub:true}).
2. #about-sub whole block: set {opacity 0, filter blur(12px) desktop} → to {1, 0}, trigger about-sub 'top 80%'→'top 60%', scrub.
3. Photo: timeline trigger #about-photo-wrap 'top bottom'→'bottom top' scrub: fromTo y '-50%'→'50%' linear (full), + fromTo {opacity 0, blur 20px}→{1, 0} over first 0.3. Init after img decode() resolves.
4. Mobile (isMobileDevice()): strip blur filters (opacity only).

## Content
From `COPY` in @/data/site (aboutText, aboutSub). Set via dangerouslySetInnerHTML (spans use class "other-accent").

## Responsive
CSS handles ≤768 layout (full-width text, photo relative below, radius 140px 140px 0 0).

## Verify
`npx tsc --noEmit`. Named export `About`. Kill triggers on unmount (gsap.context).
