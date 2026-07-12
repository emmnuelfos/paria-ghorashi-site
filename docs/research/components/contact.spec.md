# Contact Specification

## Overview
- **Target file:** `src/components/Contact.tsx`
- **Screenshots:** `docs/design-references/orig-1440-s18.png`, `orig-1440-s19.png`
- **Interaction model:** scroll-scrubbed white flood + flying frames/text
- **CSS classes exist in globals.css.**

## DOM (three siblings — component renders all)
```html
<div class="contact-bg" id="contact-bg"></div>
<div class="contact-blob-wrap" id="contact-blob-wrap"><div class="contact-blob" id="contact-blob"></div></div>
<section class="contact" id="contact">
  <div class="contact-pin" id="contact-pin">
    <div class="contact-title" id="contact-title">Contact</div>
    <div class="contact-dispo" id="contact-dispo"><p><!-- COPY.contactDispo1 --></p></div>
    <div class="contact-frame" id="contact-frame">
      <img class="contact-frame-img" id="contact-frame-img" src="/assets/images/art/Untitled2.png" alt="" loading="lazy" decoding="async"/>
      <span class="frame-corner tl"></span><span class="frame-corner tr"></span><span class="frame-corner bl"></span><span class="frame-corner br"></span>
    </div>
    <div class="contact-dispo" id="contact-dispo-2"><p><!-- COPY.contactDispo2 --></p></div>
    <div class="contact-frame" id="contact-frame-2">
      <img class="contact-frame-img" id="contact-frame-img-2" src="/assets/images/art/Untitled1.png" alt="" loading="lazy" decoding="async"/>
      <span class="frame-corner tl"></span>…(4 corners)
    </div>
    <div class="contact-bottom" id="contact-bottom">
      <nav class="contact-socials" id="contact-socials">
        <CharRoll spaceGaps text="GitHub"/><CharRoll spaceGaps text="LinkedIn"/><CharRoll spaceGaps text="Behance"/>  <!-- hrefs from SOCIALS -->
      </nav>
      <a class="contact-mail" id="contact-mail" href="mailto:luke.baffait@yahoo.com">luke.baffait@yahoo.com</a>
    </div>
  </div>
</section>
```

## Visibility gating
ST trigger '#contact', start 'top bottom', endTrigger '#footer-transition', end 'bottom bottom': enter/enterBack → blobWrap visibility visible + contact-bg display block; leave/leaveBack → hidden/none. Initial: blobWrap hidden.

## Master scrub timeline (trigger '#contact', 'top bottom'→'bottom bottom', scrub true) — fractions:
- 0: blob scale 0→1 over 0.6 linear (white circle floods up).
- 0.1: scroll-timeline + scroll-pct elements (#scroll-timeline, #scroll-pct — query by id; may be missing, guard) opacity→0 over 0.08.
- 0.18: title from x = vw*1.1 → 0, 0.3, power3.out (set initial x before).
- 0.28 / 0.36: socials then mail clipPath inset(0 0 100% 0)→inset(0 0 0% 0), 0.2 linear.
- Frames flight (pairStart 0.22, dur 0.65 linear): frame1 pre-set {yPercent:−50, y: vh*1.1} → y −(vh*1.4); img1 yPercent −30→30 (inner parallax). dispo1 pre-set {yPercent:−50, y: vh*1.1} → y −(vh*1.65); + clip-wipe out {opacity 0, clipPath inset(100% 0 0% 0)} 0.15 power2.in at pairStart+0.45.
- Frame2/dispo2: same, offset +0.07 (frame2 initial y vh*1.3; dispo2 flies to −vh*1.4 like frames).

## Footer handoff pieces owned here: NONE (FooterSection owns the exit timeline that moves #contact-blob-wrap/#contact-pin — this component only renders the DOM with correct ids).

## Verify
`npx tsc --noEmit`. Named export `Contact`. Kill STs on unmount.
