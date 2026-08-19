/**
 * Approved website copy — Paria Ghorashi Website Copy Master v1.0 (July 2026).
 *
 * Copy here is VERBATIM from the client's document. Do not paraphrase, extend,
 * or invent supporting lines: anything not in the master is unapproved text on
 * a client-facing site. Items the document flags as unverified (follower counts,
 * reach figures, client logos, awards, venture counts) must stay out until Paria
 * confirms them — see PENDING_VERIFICATION at the bottom.
 */

export interface NavItem {
  label: string;
  href: string;
  cta?: boolean;
}

/**
 * Routes that actually exist. Pages ship in batches, and the navigation lists
 * the full site map, so without this gate the header and footer would surface
 * dead links (and Next would prefetch 404s) for anything not yet built.
 * Add a route here the moment its page.tsx lands.
 */
export const LIVE_ROUTES = new Set<string>([
  "/",
  "/about",
  "/work-with-paria",
  "/consultation",
  "/advisory",
  "/partnerships",
  "/services",
  "/speaking",
  "/media",
  "/ventures",
  "/pgpm",
  "/contact",
  "/privacy",
  "/terms",
]);

export const isLive = (href: string) =>
  href.startsWith("#") || href.startsWith("http") || LIVE_ROUTES.has(href);

/**
 * Primary menu. The guidelines specify a simple 7-item mobile menu; the copy
 * master lists an 11-item site map. Both are satisfied by keeping the menu
 * simple and letting "Work With Paria" act as the hub — which is that page's
 * stated purpose in the master. The full 11 live in the footer.
 */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work With Paria", href: "/work-with-paria" },
  { label: "Services", href: "/services" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
  { label: "Book Consultation", href: "/consultation", cta: true },
];

/** Footer navigation — the master's full list, in its order. */
export const FOOTER_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work With Paria", href: "/work-with-paria" },
  { label: "Consultancy", href: "/consultation" },
  { label: "Advisory", href: "/advisory" },
  { label: "Partnerships", href: "/partnerships" },
  { label: "Speaking & Events", href: "/speaking" },
  { label: "Media", href: "/media" },
  { label: "Ventures", href: "/ventures" },
  { label: "PGPM", href: "/pgpm" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER = {
  statement:
    "Building meaningful partnerships across business, luxury, technology, media, and culture.",
  email: "paria@pgpm.ae",
  instagram: { label: "Instagram", href: "https://instagram.com/pariaghorashi" },
  linkedin: { label: "LinkedIn", href: "https://linkedin.com/in/pariaghorashi" },
  copyright: "© 2026 Paria Ghorashi. All rights reserved.",
  cta: { label: "Book a Consultation", href: "/consultation" },
};

export interface PageSeo {
  title: string;
  description: string;
}

/** Per-page SEO. The master supplies these for the pages listed. */
export const SEO: Record<string, PageSeo> = {
  home: {
    title: "Paria Ghorashi | Entrepreneur, Strategic Advisor, Brand Partner",
    description:
      "Paria Ghorashi is an entrepreneur, strategic advisor, brand partner, and public figure with more than 25 years of experience across business, technology, luxury, media, hospitality, beauty, and global partnerships.",
  },
  about: {
    title: "About Paria Ghorashi | Entrepreneur and Strategic Advisor",
    description:
      "Learn about Paria Ghorashi’s journey across fashion, entrepreneurship, technology, luxury, media, global communities, strategic advisory, and brand partnerships.",
  },
  workWithParia: {
    title: "Work With Paria Ghorashi | Consulting, Advisory and Partnerships",
    description:
      "Explore consulting, executive advisory, brand partnerships, speaking, events, founder positioning, business development, and strategic growth services with Paria Ghorashi.",
  },
  consultation: {
    title: "Book a 1-Hour Consultation With Paria Ghorashi | US $300",
    description:
      "Book a private 60-minute strategic consultation with Paria Ghorashi for business direction, brand positioning, growth, partnerships, founder visibility, and market strategy.",
  },
  advisory: {
    title: "Executive and Founder Advisory | Paria Ghorashi",
    description:
      "Ongoing strategic guidance for founders, CEOs, leadership teams, investors, and organisations facing growth, transition, or expansion.",
  },
  partnerships: {
    title: "Brand Partnerships & Representation | Paria Ghorashi",
    description:
      "Brand ambassadorships, destination and hospitality campaigns, founder stories, content, events, and long-term representation with Paria Ghorashi.",
  },
  services: {
    title: "Strategic Services | Paria Ghorashi",
    description:
      "Strategy and positioning, content, social media, influence, public relations, events, partnerships, technology, community, and growth execution.",
  },
  speaking: {
    title: "Speaking, Hosting & Events | Paria Ghorashi",
    description:
      "Keynotes, panel participation, moderation, hosting, interviews, and event advisory with Paria Ghorashi.",
  },
  media: {
    title: "Media & Recognition | Paria Ghorashi",
    description:
      "Press features, television, podcasts, awards, and public appearances across business, luxury, beauty, technology, and culture.",
  },
  ventures: {
    title: "Ventures & Experience | Paria Ghorashi",
    description:
      "blowout&go, bgX, Made For You Global, PGPM, advisory work, and future projects built, launched, scaled and reimagined.",
  },
  pgpm: {
    title: "PGPM | The Execution Platform",
    description:
      "PGPM is a global boutique agency connecting strategy, influence, technology, partnerships, community, creative, and execution.",
  },
  contact: {
    title: "Contact | Paria Ghorashi",
    description:
      "For consulting, advisory, brand partnerships, speaking, events, media, strategic introductions, and PGPM projects.",
  },
};

/* ------------------------------------------------------------------ HOME */

export const HOME = {
  hero: {
    eyebrow: "ENTREPRENEUR. STRATEGIC ADVISOR. BRAND PARTNER.",
    headline: "Building Brands, Businesses and Meaningful Partnerships.",
    body: [
      "For more than twenty-five years, Paria Ghorashi has built companies, developed platforms, advised founders, represented international brands, and connected people with opportunities across business, luxury, technology, media, hospitality, and culture.",
      "Today, she works with founders, organisations, destinations, and global brands seeking stronger positioning, credible visibility, strategic partnerships, and long-term growth.",
    ],
    buttons: [
      { label: "Work With Paria", href: "/work-with-paria" },
      { label: "Book a 1-Hour Consultation", href: "/consultation" },
    ],
  },
  positioning: {
    headline: "The Future Belongs to the Connected.",
    body: [
      "Businesses no longer grow through marketing alone. Growth now sits at the intersection of strategy, technology, influence, community, partnerships, visibility, and disciplined execution.",
      "Paria brings these areas together through a founder-led perspective shaped by building ventures, entering new markets, developing global collaborations, and working closely with brands, executives, investors, and public figures.",
    ],
    pullQuote:
      "I do not look at a business through one lens. I look at what needs to connect for the business to move forward.",
  },
  howParia: {
    headline: "Clear Direction. Stronger Positioning. Meaningful Growth.",
    intro:
      "Paria works with clients at different stages, from early ideas and founder-led businesses to established companies and international brands. Every engagement starts with the client’s current position, commercial priorities, audience, and long-term ambition.",
    items: [
      {
        title: "Strategic Consulting",
        body: "Clarity on business direction, brand positioning, growth priorities, market relevance, and the next decisions that matter.",
      },
      {
        title: "Executive & Founder Advisory",
        body: "Ongoing strategic guidance for founders, CEOs, leadership teams, investors, and organisations facing growth, transition, or expansion.",
      },
      {
        title: "Brand Positioning",
        body: "Defining how a business should be understood, differentiated, trusted, and remembered.",
      },
      {
        title: "Partnerships & Business Development",
        body: "Identifying aligned partners, creating commercial opportunities, developing introductions, and building relationships with long-term value.",
      },
      {
        title: "Visibility, Media & Reputation",
        body: "Strengthening founder and brand presence through strategic storytelling, media positioning, thought leadership, and reputation development.",
      },
      {
        title: "Brand Partnerships & Representation",
        body: "Representing selected brands, destinations, and organisations through campaigns, events, content, public appearances, and long-term ambassadorships.",
      },
      {
        title: "Events & Experiences",
        body: "Creating launches, private gatherings, investor events, brand activations, and experiences designed around the right audience and purpose.",
      },
      {
        title: "Speaking, Hosting & Moderation",
        body: "Keynotes, panel discussions, interviews, event hosting, moderation, and public representation.",
      },
    ],
    buttons: [
      { label: "Explore All Services", href: "/services" },
      { label: "Start a Conversation", href: "/contact" },
    ],
  },
  experience: {
    headline: "Advice Built Through Experience.",
    body: [
      "Paria’s approach is grounded in more than observation. She has built and scaled businesses, transformed service concepts into technology platforms, developed global communities, advised emerging ventures, and worked across complex industries.",
      "Her experience includes founding blowout&go, developing bgX into a global beauty-technology platform, building Made For You Global as an international community, and leading PGPM across strategy, content, partnerships, events, influence, and business growth.",
      "This background gives her a practical understanding of what founders face, what brands need, and where good ideas lose momentum.",
    ],
    buttons: [{ label: "Read Paria’s Story", href: "/about" }],
  },
  industries: {
    headline: "A World Built Through Experience.",
    list: [
      "Technology",
      "Marketplaces",
      "Enterprise Software",
      "Luxury",
      "Beauty",
      "Hospitality",
      "Real Estate",
      "Travel",
      "Media",
      "Fashion",
      "Healthcare",
      "Communities",
      "Events",
      "Influence",
      "Partnerships",
      "Business Growth",
    ],
  },
  /**
   * Section 6 "Selected Numbers". The master instructs: verify all figures with
   * Paria and update live social numbers before publishing; do not publish
   * unverified performance claims. Only `verified` entries should render.
   */
  numbers: {
    headline: "A Journey in Numbers.",
    items: [
      {
        value: "25+",
        body: "Years across entrepreneurship, luxury, technology, media, beauty, hospitality, and business.",
        verified: true,
      },
      {
        value: "500K+",
        body: "Global community reached through entrepreneurship, lifestyle, travel, business, and authentic storytelling.",
        verified: false,
      },
      {
        value: "120+",
        body: "Brand collaborations across luxury, hospitality, beauty, technology, healthcare, travel, media, and lifestyle.",
        verified: false,
      },
      {
        value: "15+",
        body: "Countries connected through collaborations, business activity, media, speaking, and brand partnerships.",
        verified: false,
      },
      {
        value: "2.5M+",
        body: "Content reach generated across original content, campaigns, partnerships, and media activity.",
        verified: false,
      },
      {
        value: "Multiple",
        body: "Ventures founded, scaled, advised, represented, or accelerated.",
        verified: true,
      },
    ],
  },
  clients: {
    headline: "Trusted Across Industries.",
    body: "Paria and PGPM have worked with founders, ventures, global brands, hospitality groups, property companies, technology platforms, beauty businesses, healthcare organisations, and cultural institutions.",
  },
  collaborate: {
    headline: "More Than Visibility.",
    body: "Paria collaborates with selected brands and organisations where her experience, credibility, audience, and relationships support a clear business or communication objective.",
    items: [
      {
        title: "Brand Ambassador",
        body: "Long-term representation through campaigns, events, public appearances, storytelling, and trusted association.",
      },
      {
        title: "Destination & Hospitality Campaigns",
        body: "Presenting destinations, luxury hotels, resorts, tourism boards, and airlines through experience-led storytelling.",
      },
      {
        title: "Founder & Executive Stories",
        body: "Helping founders and organisations communicate vision, leadership, values, and business purpose.",
      },
      {
        title: "Content & Campaigns",
        body: "Premium photography, short-form video, interviews, editorial stories, and social-first content.",
      },
      {
        title: "Events & Public Engagements",
        body: "Hosting, moderating, attending launches, speaking, conducting interviews, and supporting brand experiences.",
      },
      {
        title: "Strategic Brand Partner",
        body: "Working beyond a campaign through ideas, introductions, partnerships, positioning, and long-term direction.",
      },
    ],
    buttons: [
      { label: "View Partnership Opportunities", href: "/partnerships" },
    ],
  },
  consultationFeature: {
    eyebrow: "PRIVATE 1-HOUR SESSION",
    headline: "Need Clarity on Your Next Move?",
    body: "Book a focused one-hour consultation with Paria to discuss your business, brand, positioning, growth, partnership strategy, public profile, market entry, or current challenge.",
    price: "US $300 for 60 minutes",
    buttons: [{ label: "Book Your Consultation", href: "/consultation" }],
  },
  media: {
    headline: "A Story Shared Globally.",
    body: "Paria’s work and entrepreneurial journey have been featured across international and regional media, including business, fashion, luxury, beauty, technology, and lifestyle platforms.",
    buttons: [{ label: "View Media & Features", href: "/media" }],
  },
  finalCta: {
    headline: "Let’s Build Something Meaningful.",
    body: "For advisory, consulting, brand partnerships, speaking, media, events, and business development enquiries, share what you are building and where you need support.",
    buttons: [
      { label: "Start a Conversation", href: "/contact" },
      { label: "Book a Consultation", href: "/consultation" },
    ],
  },
};

/* ----------------------------------------------------------------- ABOUT */

export const ABOUT = {
  headline:
    "Some People Build Businesses. Others Build Influence. Paria Has Spent More Than Twenty-Five Years Doing Both.",
  intro: [
    "Paria Ghorashi is an entrepreneur, strategic advisor, brand partner, and public figure whose career spans fashion, beauty, technology, media, hospitality, real estate, luxury, communities, and international business.",
    "Born in Iran, raised in Norway, and based in Dubai, her perspective has been shaped by different markets, cultures, and industries. Her career began in fashion and luxury retail, where she built a strong foundation in customer behaviour, brand experience, product, positioning, and commercial decision-making.",
    "She later moved into entrepreneurship, launching ventures that combined service, technology, community, and global ambition. Across each stage, the focus stayed consistent: identify what people need, build the right structure around the opportunity, and connect the people required to move it forward.",
  ],
  journey: [
    {
      title: "Norway: Where the Foundation Began",
      body: "Moving to Norway at a young age introduced Paria to a new culture, language, and way of life. The experience developed independence, adaptability, and an international outlook that would later shape her work.",
    },
    {
      title: "Fashion: Where Creativity Met Business",
      body: "After studying at ESMOD International Fashion University, Paria built her early career in fashion, buying, design, management, and luxury retail. This period established her understanding of brand identity, customers, product, and commercial relevance.",
    },
    {
      title: "Entrepreneurship: Turning Ideas Into Businesses",
      body: "Paria moved from corporate experience into entrepreneurship, building businesses focused on innovation, convenience, experience, and growth.",
    },
    {
      title: "blowout&go: Building a New Beauty Service Category",
      body: "Paria founded blowout&go as one of the Middle East’s early mobile hair and makeup service concepts. The company brought premium beauty professionals directly to customers and helped shape a new on-demand service category.",
    },
    {
      title: "bgX: From Service Business to Technology Platform",
      body: "The business evolved into bgX, a beauty-technology platform built to connect salons, professionals, brands, and customers. The venture developed international partnerships and market activity across the UAE, the UK, Europe, and the United States.",
    },
    {
      title: "Made For You Global: Building Community",
      body: "Paria later co-founded Made For You Global, a private platform designed to connect female entrepreneurs, leaders, mentors, and investors through membership, events, education, and collaboration.",
    },
    {
      title: "Advisory, Partnerships and PGPM",
      body: "Through years of working alongside startups, founders, brands, and established businesses, Paria expanded her work into strategy, positioning, partnerships, content, influence, events, media, technology, and growth. PGPM became the platform through which strategy and execution connect.",
    },
    {
      title: "Today: Building What Comes Next",
      body: "Today, Paria advises founders and organisations, represents selected brands, develops partnerships, supports commercial growth, speaks publicly, creates media, and builds initiatives at the intersection of business, culture, luxury, technology, and influence.",
    },
  ],
  approach: [
    "Paria sees businesses from the inside. She understands the pressure of building, funding, hiring, positioning, selling, adapting, and staying relevant. She also understands how quickly a business loses direction when strategy, communication, partnerships, and execution operate separately.",
    "Her role is often to see the missing connection, ask the difficult question, simplify the direction, and help the client move from ideas into coordinated action.",
  ],
  principles: [
    "Clarity before activity.",
    "Positioning before promotion.",
    "Relationships built on relevance and trust.",
    "Visibility supported by credibility.",
    "Ideas connected to execution.",
    "Long-term value over short-term attention.",
  ],
  beyondBusiness: [
    "Throughout her career, Paria has supported charitable initiatives, community programmes, fundraising efforts, awareness campaigns, inclusion, mentorship, and organisations working to improve lives across the UAE and beyond.",
    "Her contributions have included serving in advisory capacities, supporting entrepreneurship and women-led communities, raising awareness around health and early detection, and using her platform to support meaningful causes.",
  ],
  quote:
    "The strongest opportunities rarely sit inside one department. They appear when the right idea, person, brand, community, and timing come together.",
  buttons: [
    { label: "Work With Paria", href: "/work-with-paria" },
    { label: "Book a Consultation", href: "/consultation" },
  ],
};

/* -------------------------------------------------------- WORK WITH PARIA */

export const WORK_WITH_PARIA = {
  headline: "Different Goals Require Different Ways of Working.",
  body: [
    "Some clients need one focused conversation. Others need an ongoing advisor, a strategic partner, stronger market positioning, public representation, business introductions, or an experienced team to lead execution.",
    "Choose the engagement that best reflects where you are and what you need next.",
  ],
  engagements: [
    {
      title: "1-Hour Strategic Consultation",
      body: "A focused private session for clarity, challenge-solving, positioning, partnerships, growth, or next-step decisions.",
      terms: "US $300",
      button: { label: "Book a Session", href: "/consultation" },
    },
    {
      title: "Executive & Founder Advisory",
      body: "Ongoing strategic support for founders, CEOs, leadership teams, family businesses, investors, and organisations.",
      terms: "Bespoke engagement",
      button: { label: "Explore Advisory", href: "/advisory" },
    },
    {
      title: "Brand Strategy & Positioning",
      body: "Clarify your market position, brand direction, audience, relevance, differentiation, and long-term story.",
      terms: "Project or retainer",
      button: { label: "Explore Services", href: "/services" },
    },
    {
      title: "Partnerships & Business Development",
      body: "Develop strategic introductions, aligned collaborations, commercial opportunities, and market relationships.",
      terms: "Bespoke engagement",
      button: { label: "Explore Partnerships", href: "/partnerships" },
    },
    {
      title: "Brand Ambassador & Representation",
      body: "Long-term partnerships with brands, destinations, hospitality groups, and organisations seeking credible representation.",
      terms: "Campaign or retainer",
      button: { label: "Explore Brand Partnerships", href: "/partnerships" },
    },
    {
      title: "Speaking, Hosting & Events",
      body: "Keynotes, panels, moderation, interviews, hosting, appearances, and high-level event participation.",
      terms: "Per engagement",
      button: { label: "Explore Speaking", href: "/speaking" },
    },
    {
      title: "PGPM Strategy & Execution",
      body: "A connected team across strategy, creative, media, content, events, partnerships, technology, influence, and growth.",
      terms: "Project or retainer",
      button: { label: "Visit PGPM", href: "/pgpm" },
    },
  ],
  process: {
    headline: "How Engagements Begin",
    steps: [
      {
        no: "01",
        title: "Submit Your Enquiry",
        body: "Share your business, goals, current challenge, preferred service, and timing.",
      },
      {
        no: "02",
        title: "Initial Review",
        body: "Your enquiry is reviewed to determine the most suitable engagement and whether the fit is right.",
      },
      {
        no: "03",
        title: "Introductory Call or Paid Session",
        body: "Depending on the enquiry, the next step will be a short fit call or a paid strategic consultation.",
      },
      {
        no: "04",
        title: "Proposal and Scope",
        body: "For ongoing or project-based work, you receive a defined scope, timeline, responsibilities, and commercial terms.",
      },
      {
        no: "05",
        title: "Strategy and Delivery",
        body: "Paria leads the strategic direction, with PGPM or specialist partners supporting execution when required.",
      },
    ],
  },
};

/**
 * Items the master explicitly holds back pending Paria's confirmation. Nothing
 * here may be published as fact. Kept in code so the gate is visible to whoever
 * works on this next.
 */
export const PENDING_VERIFICATION = [
  "Whether 'Since 2012' remains, or the site uses '25+ years' as the primary timeline.",
  "The exact count of ventures founded and scaled (master says 'Multiple').",
  "Current follower and content-reach figures (500K+, 2.5M+).",
  "Brand collaboration and country counts (120+, 15+).",
  "Approved client and partner logos.",
  "Verified awards, advisory roles, and charity affiliations.",
  "Final consultation cancellation and refund policy.",
  "Whether consultation booking is automatic or manually approved.",
  "Whether the US $300 fee is credited toward a later engagement.",
  "Public phone number and enquiry email routing.",
  "Which future projects (book, media concepts) are ready for public mention.",
] as const;
