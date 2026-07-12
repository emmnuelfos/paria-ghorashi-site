# Skills + Awards Specification

## Overview
- **Target files:** `src/components/Skills.tsx`, `src/components/Awards.tsx`
- **Screenshots:** `docs/design-references/orig-1440-s15.png`, `orig-1440-s16.png`, `orig-1440-s17.png`
- **Interaction models:** Skills = click accordion + scroll-scrubbed arrow; Awards = scroll-toggled highlight + hover cursor image
- **CSS classes exist in globals.css.**

## Skills DOM
```html
<section class="skills" id="skills">
  <div class="skills-inner">
    <div class="skills-left">
      <div class="skills-subtitle">Skills</div>
      <div class="skills-text"><!-- COPY.skillsText --></div>
      <div class="skills-separator"></div>
      <div><CharRoll className="skills-contact" text={"Contact me\u{1F7A3}"} href="#contact"/></div>
      <div class="skills-arrow" id="skills-arrow"><ArrowRightIcon/></div>
    </div>
    <div class="skills-right" id="skills-right">
      <!-- per SKILL_GROUPS: -->
      <div class="skill-group open?" data-group={key}>
        <div class="skill-header"><span class="skill-header-title">{title}</span><span class="skill-header-icon"></span></div>
        <div class="skill-body"><ul class="skill-body-inner"><li>…items…</li></ul></div>
      </div>
    </div>
  </div>
</section>
```
Data: `SKILL_GROUPS`, `COPY` from @/data/site. First group starts `open`, its `.skill-body` height set to scrollHeight on mount (inline style).

## Skills behaviors
1. Accordion: click header → if already open no-op; else close currently open (gsap height→0, 0.45s power3.inOut, remove 'open') and open clicked (height→scrollHeight, 0.45s, add 'open', onComplete ScrollTrigger.refresh()).
2. Arrow scrub: gsap.fromTo('#skills-arrow', {xPercent:0}, {xPercent:100, x: () => leftCol.clientWidth − paddings − arrow.offsetWidth, ease:'none', scrollTrigger {trigger '#skills', start 'top top', endTrigger '#contact', end 'top center', scrub 0.5}}).

## Awards DOM
```html
<section class="awards" id="awards">
  <div class="awards-inner">
    <div class="skills-subtitle awards-title">Awards & Misc</div>
    <div class="awards-list" id="awards-list">
      <!-- per AWARDS: -->
      <div class="award-item" data-cursor-img={cursorImg}>
        <div class="award-org">{org}</div><div class="award-site">{site}</div>
        <div class="award-prize">{prize}</div><div class="award-date">{date}</div>
      </div>
    </div>
  </div>
</section>
```

## Awards behaviors
1. Per row ScrollTrigger: start 'top center+=15%', end 'bottom center-=15%', toggleClass 'active-award' (CSS does white wipe via ::before clip-path + color #000).
2. Cursor image: one fixed <img> (250px wide, radius 5px, z 99999, pointer-events none; created in React, hidden initially with xPercent/yPercent −50, scale 0.8, opacity 0). mouseenter row → set src from data-cursor-img, gsap.set x/y at cursor, gsap.to {opacity 1, scale 1, 0.3s}; mousemove while hovered → gsap.set x/y; mouseleave → {opacity 0, scale 0.8, 0.3s}.

## Responsive
CSS handles (≤768: award-date hidden, skills stack). No JS changes.

## Verify
`npx tsc --noEmit`. Named exports `Skills`, `Awards`. Cleanup on unmount.
