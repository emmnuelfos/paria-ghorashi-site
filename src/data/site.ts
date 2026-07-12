import type { Project, SkillGroup, Award, SocialLink } from "@/types";

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
];

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
];

export const SKILL_GROUPS: SkillGroup[] = [
  { key: "strategy", title: "Brand Strategy", items: ["Positioning", "Identity", "Market Relevance", "Differentiation", "Long-term Growth"] },
  { key: "growth", title: "Business Growth", items: ["Startup to Scale", "Commercial Development", "Investment-led Ventures", "International Expansion"] },
  { key: "partnerships", title: "Partnerships", items: ["Strategic Introductions", "Brand Collaborations", "Ambassadorships", "High-level Networks"] },
  { key: "media", title: "Media & Positioning", items: ["Public Relations", "Founder Positioning", "Thought Leadership", "Reputation", "Strategic Storytelling"] },
  { key: "creative", title: "Creative Direction", items: ["Campaigns", "Editorial", "Photography", "Video-first Content"] },
  { key: "speaking", title: "Speaking", items: ["Keynotes", "Panels", "Hosting", "Moderation", "Representation"] },
  { key: "industries", title: "Industries", items: ["Luxury", "Beauty", "Technology", "Media", "Hospitality", "Real Estate", "Lifestyle"] },
];

export const AWARDS: Award[] = [
  { org: "Harper's Bazaar", site: "pariaghorashi", prize: "The Watch Collector Series", date: "2016", cursorImg: "/assets/paria/press-spotlight.jpg" },
  { org: "Evening Standard", site: "bgX × Uber", prize: "The Uber blow dry", date: "2016", cursorImg: "/assets/paria/ventures/bgx.jpg" },
  { org: "Vogue", site: "bgX", prize: "A hairdresser in one click", date: "2018", cursorImg: "/assets/paria/ventures/blowoutandgo.jpg" },
  { org: "Ahlan!", site: "Hot 100", prize: "Leading social influencers of the UAE", date: "2016", cursorImg: "/assets/paria/world-redgown.jpg" },
  { org: "Hello! Middle East", site: "Cover feature", prize: "Into her world", date: "2015", cursorImg: "/assets/paria/press-bluegown.jpg" },
];

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
  heroTagline:
    'Serial entrepreneur, <span class="other-accent">building brands that matter</span>,<br/>across luxury, business &amp; culture.',
  revealPhrase: "Welcome to my world.",
  aboutText:
    'As a<span class="other-accent"> serial entrepreneur</span>, I transform brands, scale businesses, and build influential ventures — blending strategy and <span class="other-accent">emotion</span>.',
  aboutSub:
    "My name is Paria. A brand strategist and growth architect with more than twenty-five years across luxury, beauty, technology and media — always seeking the meeting point of identity and influence.",
  cgPhrase:
    'Great brands are built through <span class="other-accent">identity</span>, <span class="other-accent">emotion</span> and long-term positioning.',
  skillsSubtitle: "What She Does",
  skillsText:
    "Entrepreneur, brand partner and public figure — 25+ years across luxury, beauty, technology and media.",
  contactDispo1:
    'Open to <span class="other-accent">brand collaborations</span>, strategic partnerships and speaking engagements — worldwide.',
  contactDispo2:
    'For<span class="other-accent"> media, advisory</span> and<span class="other-accent"> business development</span> enquiries — let\'s create something exceptional.',
  mail: "paria@pgpm.ae",
};
