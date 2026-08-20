import type { Project, SkillGroup, Award, SocialLink } from "@/types";
import { asset } from "@/lib/asset";

/** Content for Paria Ghorashi — Direction C "The Motion Study".
 *  All copy sourced from her supplied brief, brand portfolio and PGPM deck. */

export const PROJECTS: Project[] = [
  { id: "blowoutandgo", name: "Blowout&Go", date: "Est. 2012", category: "Beauty Services", cover: "/assets/paria/ventures/blowoutandgo.jpg", coverAlt: "Blowout&Go — at-home beauty services" },
  { id: "bgx", name: "bgX", date: "Est. 2016", category: "Beauty-Tech", cover: "/assets/paria/ventures/bgx.jpg", coverAlt: "bgX — beauty-tech platform with Uber and Balmain Hair Couture" },
  { id: "pgpm", name: "PGPM", date: "Est. 2016", category: "Brand Agency", cover: "/assets/paria/ventures/pgpm.jpg", coverAlt: "PGPM — global boutique agency" },
  { id: "madeforyou", name: "Made For You", date: "Est. 2022", category: "Members Club", cover: "/assets/paria/ventures/madeforyou.jpg", coverAlt: "Made For You Global — members club for female entrepreneurs" },
  { id: "book", name: "The Book", date: "In Progress", category: "Publishing", cover: "/assets/paria/ventures/book.jpg", coverAlt: "Upcoming book" },
  { id: "unscripted", name: "Unscripted", date: "Talk Show", category: "Media", cover: "/assets/paria/ventures/unscripted.jpg", coverAlt: "Unscripted with Paria — original talk show" },
  { id: "speaking", name: "Speaking", date: "Worldwide", category: "Keynotes", cover: "/assets/paria/ventures/speaking.jpg", coverAlt: "International speaking engagements" },
  { id: "partnerships", name: "Partnerships", date: "Select", category: "Collaborations", cover: "/assets/paria/ventures/partnerships.jpg", coverAlt: "Brand partnerships and collaborations" },
].map((p) => ({ ...p, cover: asset(p.cover) }));

/** 3:2 covers for the orbit gallery — her world. */
export const GALLERY_COVERS: string[] = [
  "/assets/paria/cg-450sl.jpg",
  "/assets/paria/cg-cannes.jpg",
  "/assets/paria/cg-tulle.jpg",
  "/assets/paria/cg-overwater.jpg",
  "/assets/paria/cg-redgown.jpg",
  "/assets/paria/cg-whitehat.jpg",
  "/assets/paria/cg-dock.jpg",
  "/assets/paria/cg-hatcar.jpg",
].map(asset);

export const SKILL_GROUPS: SkillGroup[] = [
  { key: "consulting", title: "Strategic Consulting", items: ["Clarity on business direction, brand positioning, growth priorities, market relevance, and the next decisions that matter."] },
  { key: "advisory", title: "Executive & Founder Advisory", items: ["Ongoing strategic guidance for founders, CEOs, leadership teams, investors, and organisations facing growth, transition, or expansion."] },
  { key: "positioning", title: "Brand Positioning", items: ["Defining how a business should be understood, differentiated, trusted, and remembered."] },
  { key: "partnerships", title: "Partnerships & Business Development", items: ["Identifying aligned partners, creating commercial opportunities, developing introductions, and building relationships with long-term value."] },
  { key: "visibility", title: "Visibility, Media & Reputation", items: ["Strengthening founder and brand presence through strategic storytelling, media positioning, thought leadership, and reputation development."] },
  { key: "representation", title: "Brand Partnerships & Representation", items: ["Representing selected brands, destinations, and organisations through campaigns, events, content, public appearances, and long-term ambassadorships."] },
  { key: "events", title: "Events & Experiences", items: ["Creating launches, private gatherings, investor events, brand activations, and experiences designed around the right audience and purpose."] },
  { key: "speaking", title: "Speaking, Hosting & Moderation", items: ["Keynotes, panel discussions, interviews, event hosting, moderation, and public representation."] },
];

export const AWARDS: Award[] = [
  { org: "Harper's Bazaar", site: "pariaghorashi", prize: "The Watch Collector Series", date: "2016", cursorImg: "/assets/paria/press-spotlight.jpg" },
  { org: "Evening Standard", site: "bgX × Uber", prize: "The Uber blow dry", date: "2016", cursorImg: "/assets/paria/ventures/bgx.jpg" },
  { org: "Vogue", site: "bgX", prize: "A hairdresser in one click", date: "2018", cursorImg: "/assets/paria/ventures/blowoutandgo.jpg" },
  { org: "Ahlan!", site: "Hot 100", prize: "Leading social influencers of the UAE", date: "2016", cursorImg: "/assets/paria/world-redgown.jpg" },
  { org: "Hello! Middle East", site: "Cover feature", prize: "Into her world", date: "2015", cursorImg: "/assets/paria/press-bluegown.jpg" },
].map((a) => ({ ...a, cursorImg: asset(a.cursorImg) }));

export const SOCIALS: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com/pariaghorashi" },
  { label: "LinkedIn", href: "https://linkedin.com/in/pariaghorashi" },
  { label: "PGPM", href: "mailto:paria@pgpm.ae" },
];

export const NAV_LINKS: SocialLink[] = [
  { label: "Ventures", href: "#projects" },
  { label: "Story", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const COPY = {
  /* Home Section 1 — HERO. Approved copy, Website Copy Master v1.0. */
  heroEyebrow: "ENTREPRENEUR. STRATEGIC ADVISOR. BRAND PARTNER.",
  heroTagline:
    'Building Brands, Businesses and <span class="other-accent">Meaningful Partnerships</span>.',
  heroBody: [
    "For more than twenty-five years, Paria Ghorashi has built companies, developed platforms, advised founders, represented international brands, and connected people with opportunities across business, luxury, technology, media, hospitality, and culture.",
    "Today, she works with founders, organisations, destinations, and global brands seeking stronger positioning, credible visibility, strategic partnerships, and long-term growth.",
  ],
  revealPhrase: "World full of possibilities.",

  /* Section 2 — THE POSITIONING STATEMENT. */
  manifestoKicker: "The Positioning",
  manifestoHeadline: "The Future Belongs to the Connected.",
  manifestoBody:
    "Businesses no longer grow through marketing alone. Growth now sits at the intersection of strategy, technology, influence, community, partnerships, visibility, and disciplined execution.",
  manifestoQuote:
    'I do not look at a business through <span class="mf-em">one lens</span>. I look at what needs to <span class="mf-em">connect</span> for the business to move forward.',
  manifestoCite: "Paria Ghorashi",

  /* Section 4 — BUILT FROM EXPERIENCE (the About block). */
  aboutText:
    'Advice built through <span class="other-accent">experience</span>. She has built and scaled businesses, transformed service concepts into technology platforms, developed global communities, and advised emerging ventures.',
  aboutSub:
    "Her experience includes founding blowout&go, developing bgX into a global beauty-technology platform, building Made For You Global as an international community, and leading PGPM across strategy, content, partnerships, events, influence, and business growth.",
  aboutThird:
    "This background gives her a practical understanding of what founders face, what brands need, and where good ideas lose momentum.",
  aboutButton: { label: "Read Paria’s Story", href: "/about" },

  /* Section 5 — EXPERIENCE ACROSS. */
  cgPhrase:
    'A world built through <span class="other-accent">experience</span>, across industries and international markets.',

  /* Section 3 — HOW PARIA HELPS. */
  skillsSubtitle: "How Paria Helps",
  skillsText:
    "Clear direction. Stronger positioning. Meaningful growth.",
  skillsIntro:
    "Paria works with clients at different stages, from early ideas and founder-led businesses to established companies and international brands. Every engagement starts with the client’s current position, commercial priorities, audience, and long-term ambition.",
  skillsButtons: [
    { label: "Explore All Services", href: "/services" },
    { label: "Start a Conversation", href: "/contact" },
  ],
  mediaButton: { label: "View Media & Features", href: "/media" },

  /* Section 11 — FINAL CTA (the contact block). */
  contactDispo1:
    'Let’s build something <span class="other-accent">meaningful</span>. For advisory, consulting, brand partnerships, speaking, media, events, and business development enquiries.',
  contactDispo2:
    'Share what you are <span class="other-accent">building</span> and where you need support.',
  finalCtaHeadline: "Let’s Build Something Meaningful.",
  finalCtaBody:
    "For advisory, consulting, brand partnerships, speaking, media, events, and business development enquiries, share what you are building and where you need support.",
  finalCtaButtons: [
    { label: "Start a Conversation", href: "/contact" },
    { label: "Book a Consultation", href: "/consultation" },
  ],
  mail: "paria@pgpm.ae",
};
