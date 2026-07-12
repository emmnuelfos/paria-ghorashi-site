# PAGE_TOPOLOGY.md — lukebaffait.fr

Total desktop height ≈ 17,713px @1440×900. Mobile ≈ 10,989px @390 (gallery removed).

## Layer model (z-index)

| Layer | z | Position | Notes |
|---|---|---|---|
| .intro-bg | 10000 | fixed | removed after intro |
| .transition-panel (dark+red) | 10002 | fixed | removed after intro |
| .name-layer (Luke Baffait chars) | 10005 | fixed | mix-blend difference after intro; autoAlpha 0 at scroll p=.98 |
| .reveal-image-wrap (canvas seq) | 10002 | fixed | opacity gated by hero scrub |
| .section-after (about+projects) | 20010 | relative flow | covers reveal canvas as it scrolls up |
| .circle-gallery | 20001 | relative flow | 600vh, pins inner |
| .skills / .awards | 30010 | relative flow | |
| .contact | 30015 | relative flow (sticky pin inside) | |
| .contact-bg | 5 | fixed | black, display toggled |
| .contact-blob-wrap | 30012 | fixed bottom | white circle → white sheet |
| .footer-transition | 20007 | relative flow 80vh | scrub zone for footer reveal |
| .footer | 20008 | fixed | visibility toggled |
| .proj-preview / .proj-cursor | 30005/30006 | fixed | Projects hover layer |
| .scroll-pct / .scroll-timeline | 30015 | fixed | chrome |
| .page-fade | 30012 | fixed | overlay for detail view (out of scope) |

## Flow order (desktop)

1. **scroll-wrap** (400vh) → sticky **hero** (100vh): canvas blob bg, tagline TL, line+bar bottom. Name lives in fixed name-layer above.
2. *(fixed)* **reveal-image-wrap**: statue frame-sequence canvas + corner marks + "Basically, I make websites." — scales in during scroll-wrap scrub, exits during section-after entry.
3. **section-after**:
   - **about**: big word-reveal text (66.6% wide) → sub text (28%, offset 20%) + Info btn → right-side rounded portrait (me.avif) w/ parallax → right-aligned "→V3.0".
   - **projects**: red fluid line SVG scrub-drawn behind; sticky list left (45%) of 8 projects; fixed preview card right (scroll-proximity model).
4. **circle-gallery** (600vh, desktop only): pinned stage; 8 sliced covers orbit a cylinder; phrase mid-flight.
5. **skills**: sticky left (Skills / Zirena statement / separator / Contact me + red arrow scrub) + accordion right (7 groups).
6. **awards**: 5 rows, scroll-highlight + cursor image.
7. **contact** (180vh, pin 100vh): white blob floods; "Contact" title; 2 flying framed art images + 2 texts; socials + mail bottom-left.
8. **footer-transition** (80vh) → fixed **footer**: ascii art (red), top link columns, giant "Luke Baffait." rising.

## Interaction models per section

- Intro: time-driven (once, skippable).
- Hero: scroll-scrub (name exit + reveal entry) + hover (chr links).
- Reveal: scroll-scrub canvas sequence (341 frames).
- About: scroll-scrub per-word.
- Projects: **scroll-proximity activation** + mouse (tilt card, cursor pill) + click (center/open).
- Gallery: scroll-scrub orbit (pinned).
- Skills: click accordion + scroll-scrub arrow.
- Awards: scroll-toggle highlight + hover cursor image.
- Contact: scroll-scrub flood + flights.
- Footer: scroll-scrub reveal + mouse parallax + hover ascii scramble.

## Clone scope decisions

- IN: everything above, EN content, desktop + mobile layouts, reduced-motion.
- OUT: project-detail overlay, works//info//contact/ subpages (links point to '#' equivalents), Google Analytics, i18n FR variant, bfcache/page-transition plumbing.

## Next.js component map

| Component | File | Original DOM |
|---|---|---|
| IntroOverlay | src/components/IntroOverlay.tsx | intro-bg, name-layer, transition-panel |
| Hero | src/components/Hero.tsx | scroll-wrap > hero (canvas, tagline, line, bar) |
| HeroCanvas | src/components/HeroCanvas.tsx | hero-canvas blob renderer |
| RevealSequence | src/components/RevealSequence.tsx | reveal-image-wrap |
| About | src/components/About.tsx | section-after > about |
| Projects | src/components/Projects.tsx | section-after > projects + proj-preview + proj-cursor |
| CircleGallery | src/components/CircleGallery.tsx | circle-gallery |
| Skills | src/components/Skills.tsx | skills |
| Awards | src/components/Awards.tsx | awards |
| Contact | src/components/Contact.tsx | contact + contact-bg + contact-blob-wrap |
| FooterSection | src/components/FooterSection.tsx | footer-transition + footer |
| ScrollChrome | src/components/ScrollChrome.tsx | scroll-pct + scroll-timeline |
| CharRoll | src/components/CharRoll.tsx | chr-hover shared |
| LenisProvider | src/components/LenisProvider.tsx | lenis+gsap bootstrap |
