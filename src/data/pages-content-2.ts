/**
 * Approved copy — Website Copy Master v1.0, pages 07–11
 * (Strategic Services, Speaking & Events, Media, Ventures, PGPM).
 * Verbatim from the client document. See content.ts for the shared rules.
 */

/**
 * The ten capabilities. The master prints the same descriptions twice — under
 * Strategic Services (with an INCLUDES list each) and again under PGPM's
 * "The Connected Advantage" — so they are defined once and used by both pages.
 */
export const CAPABILITIES = [
  {
    title: "Strategy & Positioning",
    body: "Defining the direction a business or brand should take and how it should be understood in the market.",
    includes: [
      "Business and brand strategy",
      "Positioning and differentiation",
      "Audience and market relevance",
      "Offer and message clarity",
      "Founder positioning",
      "Market-entry direction",
      "Growth priorities",
      "Strategic roadmaps",
    ],
  },
  {
    title: "Content & Production",
    body: "Developing content with a clear role in awareness, trust, education, demand, and brand perception.",
    includes: [
      "Campaign concepts",
      "Photography",
      "Videography",
      "Short-form content",
      "Interviews",
      "Podcasts",
      "Editorial stories",
      "Production management",
    ],
  },
  {
    title: "Social Media",
    body: "Building an active, credible platform around the right audience, message, format, and business objective.",
    includes: [
      "Platform strategy",
      "Content calendars",
      "Community engagement",
      "Founder-led content",
      "Campaign management",
      "Performance review",
      "Paid-content planning",
      "Social positioning",
    ],
  },
  {
    title: "Influence & Talent",
    body: "Connecting brands with creators, public figures, athletes, ambassadors, and communities whose credibility and audience fit the objective.",
    includes: [
      "Creator strategy",
      "Influencer sourcing",
      "Talent negotiations",
      "Campaign management",
      "Ambassador programmes",
      "Athlete partnerships",
      "Community collaborations",
      "Reporting",
    ],
  },
  {
    title: "Public Relations & Media",
    body: "Strengthening how a founder or brand is understood, trusted, remembered, and represented.",
    includes: [
      "Media relations",
      "Founder positioning",
      "Thought leadership",
      "Press stories",
      "Interview preparation",
      "Reputation management",
      "Strategic storytelling",
      "Media opportunities",
    ],
  },
  {
    title: "Events & Experiences",
    body: "Creating gatherings and activations that connect brands with the people, communities, partners, and opportunities that matter.",
    includes: [
      "Launches",
      "Private dinners",
      "Luxury events",
      "Investor gatherings",
      "Community events",
      "Brand activations",
      "Panel events",
      "End-to-end event direction",
    ],
  },
  {
    title: "Partnerships & Business Development",
    body: "Creating aligned relationships and commercial opportunities through strategy, introductions, negotiation, and follow-through.",
    includes: [
      "Partnership strategy",
      "Strategic introductions",
      "Commercial collaborations",
      "Sponsorships",
      "Cross-brand opportunities",
      "Market relationships",
      "Proposal development",
      "Business development",
    ],
  },
  {
    title: "Technology & Innovation",
    body: "Bringing a technology-first perspective shaped by experience across platforms, marketplaces, enterprise software, digital ecosystems, and emerging tools.",
    includes: [
      "Digital business models",
      "Platform strategy",
      "Marketplace thinking",
      "AI opportunity review",
      "Customer journeys",
      "Enterprise solutions",
      "Technology partnerships",
      "Innovation positioning",
    ],
  },
  {
    title: "Community & Engagement",
    body: "Building relationships that transform audiences into active communities, advocates, members, customers, and partners.",
    includes: [
      "Community strategy",
      "Membership concepts",
      "Founder communities",
      "Customer engagement",
      "Ambassador communities",
      "Events and education",
      "Partnership ecosystems",
      "Retention thinking",
    ],
  },
  {
    title: "Growth & Execution",
    body: "Turning strategy into coordinated activity, ownership, timelines, measurement, and outcomes.",
    includes: [
      "Growth planning",
      "Campaign coordination",
      "Team alignment",
      "Delivery oversight",
      "Commercial priorities",
      "Performance tracking",
      "Partner management",
      "Implementation support",
    ],
  },
];

/* ----------------------------------------------------- STRATEGIC SERVICES */

export const SERVICES = {
  headline: "Strategy, Influence and Execution, Connected.",
  body: [
    "Paria leads strategic direction across positioning, growth, partnerships, visibility, and founder-led opportunities. Where execution is required, PGPM brings together specialists across creative, content, social media, public relations, events, influencer relations, technology, community, and business development.",
  ],
  capabilities: CAPABILITIES,
  buttons: [
    { label: "Discuss Your Project", href: "/contact" },
    { label: "View PGPM", href: "/pgpm" },
  ],
};

/* -------------------------------------------------- SPEAKING & EVENTS */

export const SPEAKING = {
  headline: "Conversations That Move Ideas Forward.",
  body: [
    "Paria speaks from lived experience across entrepreneurship, technology, luxury, media, community, partnerships, and personal reinvention. Her style is direct, relevant, and grounded in the realities of building businesses and public trust.",
  ],
  engagements: {
    headline: "Engagements",
    items: [
      {
        title: "Keynote Speaking",
        body: "Business, entrepreneurship, women in leadership, innovation, brand building, partnerships, influence, community, personal brand, and founder journeys.",
      },
      {
        title: "Panel Participation",
        body: "Experienced contribution to discussions involving startups, technology, beauty, luxury, media, travel, business growth, women in business, and the UAE.",
      },
      {
        title: "Moderation",
        body: "Structured, informed conversations with founders, executives, public figures, investors, creators, and industry leaders.",
      },
      {
        title: "Hosting",
        body: "Corporate events, launches, private gatherings, awards, interviews, brand experiences, and community events.",
      },
      {
        title: "Interviews & Fireside Conversations",
        body: "One-to-one discussions designed to reveal the decisions, experiences, and stories behind a person, brand, or business.",
      },
      {
        title: "Event Advisory",
        body: "Strategic guidance on event purpose, audience, format, speakers, partners, messaging, guest experience, and commercial outcomes.",
      },
    ],
  },
  topics: {
    headline: "Suggested Topics",
    items: [
      "The Future Belongs to the Connected",
      "From Service Business to Technology Platform",
      "Why Visibility Without Credibility Has Little Value",
      "Building a Founder-Led Brand",
      "Influence Beyond Followers",
      "Why Partnerships Drive Modern Growth",
      "Women Building Across Markets and Cultures",
      "From Idea to International Business",
      "Building Communities People Value",
      "The Difference Between Attention and Trust",
    ],
  },
  requirements: {
    headline: "Speaking Enquiry Requirements",
    items: [
      "Event name and organiser",
      "Date and location",
      "Audience profile and expected attendance",
      "Requested format and duration",
      "Proposed subject",
      "Other speakers or moderator",
      "Travel and accommodation details",
      "Budget",
      "Media and recording plans",
    ],
  },
  buttons: [{ label: "Submit a Speaking Enquiry", href: "/contact" }],
};

/* -------------------------------------------------- MEDIA & RECOGNITION */

export const MEDIA = {
  headline:
    "A Story Shared Across Business, Luxury, Beauty, Technology and Culture.",
  body: [
    "Paria’s entrepreneurial work, ventures, partnerships, personal journey, and public profile have been featured across international and regional media.",
  ],
  categories: {
    headline: "Media Categories",
    items: [
      {
        title: "Press Features",
        body: "Long-form profiles, founder stories, business coverage, beauty and technology features, luxury editorial, and interviews.",
      },
      {
        title: "Television & Video",
        body: "Business interviews, panel appearances, event coverage, brand stories, and cultural conversations.",
      },
      {
        title: "Podcasts & Radio",
        body: "Entrepreneurship, leadership, women in business, technology, community, brand building, and personal journeys.",
      },
      {
        title: "Awards & Recognition",
        body: "Verified awards, honours, advisory appointments, and community recognition.",
      },
      {
        title: "Speaking & Public Appearances",
        body: "Conference appearances, panels, keynotes, launches, interviews, and moderated discussions.",
      },
    ],
  },
  /**
   * The master instructs: "Verify every logo and feature before publication. Do
   * not imply editorial endorsement where the appearance was advertising or paid
   * partnership." These render as plain wordmarks (never as publication logos,
   * which would imply endorsement) and remain subject to that check.
   */
  asSeenIn: {
    headline: "As Seen In",
    items: [
      "Harper’s Bazaar",
      "Vogue",
      "Evening Standard",
      "Ahlan!",
      "Hello! Middle East",
      "CNN",
      "Forbes Middle East",
      "Gulf News",
      "Arabian Business",
      "Cosmopolitan",
      "Grazia",
      "MBC",
      "CNBC Arabia",
      "Sky News Arabia",
      "Arab News",
      "Bloomberg Asharq",
      "Time Out Dubai",
      "Gulf Business",
    ],
  },
  enquiries:
    "For interviews, profiles, expert commentary, speaking requests, and media appearances, please include the publication, subject, deadline, format, and proposed date.",
  buttons: [{ label: "Media Enquiry", href: "/contact" }],
  /**
   * The master also lists a [Download Media Kit] button. Withheld until the
   * asset exists — a download button that 404s is worse than no button.
   */
};

/* ------------------------------------------------- VENTURES & EXPERIENCE */

export const VENTURES = {
  headline: "Built, Launched, Scaled and Reimagined.",
  body: [
    "Paria’s strategic perspective comes from building ventures across service, technology, community, media, partnerships, and brand growth. Each venture added a different layer of experience to the work she leads today.",
  ],
  items: [
    {
      title: "blowout&go",
      body: "A pioneering mobile hair and makeup service created to bring premium beauty professionals directly to customers. The business helped establish a new on-demand beauty category in the Middle East.",
    },
    {
      title: "bgX",
      body: "The evolution of a service business into a beauty-technology platform and enterprise ecosystem connecting customers, professionals, salons, and brands across international markets.",
    },
    {
      title: "Made For You Global",
      body: "A private global community connecting female entrepreneurs, executives, mentors, and investors through membership, events, education, and meaningful collaboration.",
    },
    {
      title: "PGPM",
      body: "A founder-led strategic and execution platform connecting brand positioning, content, influence, media, events, partnerships, technology, community, and growth.",
    },
    {
      title: "Advisory & Brand Building",
      body: "Ongoing work supporting startups, founders, luxury companies, technology businesses, hospitality, beauty, real estate, healthcare, and international brands.",
    },
    {
      title: "Media & Future Projects",
      body: "Original interviews, an upcoming book, public conversations, speaking, international partnerships, and new ventures shaped around business, culture, luxury, and human stories.",
    },
  ],
};

/* ------------------------------------------------------------------ PGPM */

export const PGPM = {
  eyebrow: "THE EXECUTION PLATFORM",
  headline: "The Power Behind Modern Brands, Platforms and Ventures.",
  body: [
    "PGPM is a global boutique agency connecting strategy, influence, technology, partnerships, community, creative, and execution.",
    "Founded by Paria Ghorashi, PGPM supports founders, companies, brands, and ventures that need more than disconnected marketing activity. The work begins with direction and continues through coordinated delivery.",
  ],
  why: {
    headline: "Why PGPM",
    body: [
      "Most businesses do not need more activity. They need stronger positioning, clearer commercial direction, smarter visibility, meaningful influence, better partnerships, and disciplined execution.",
      "PGPM brings these elements into one connected growth system.",
    ],
  },
  advantage: {
    headline: "The Connected Advantage",
    items: CAPABILITIES,
  },
  how: {
    headline: "How PGPM Works",
    items: [
      {
        title: "Founder-Led",
        body: "Senior strategic involvement from Paria where her experience and perspective add value.",
      },
      {
        title: "Bespoke by Design",
        body: "Every scope reflects the business, market, objective, team, and current challenge.",
      },
      {
        title: "Specialists by Need",
        body: "The right strategists, creatives, producers, media specialists, event professionals, partnership leads, talent managers, and technology partners are assembled around the brief.",
      },
      {
        title: "Strategy Connected to Execution",
        body: "The team responsible for direction stays close to delivery, reducing fragmentation and protecting the core objective.",
      },
      {
        title: "Commercially Aware",
        body: "Activity is evaluated against business relevance, market opportunity, credibility, audience, and measurable priorities.",
      },
    ],
  },
  /**
   * The master: "The 'Visit PGPM' button should open the dedicated PGPM website
   * once live. Until then, retain the PGPM section inside this website." So the
   * external link is deliberately not wired yet.
   */
  buttons: [{ label: "Discuss a Project", href: "/contact" }],
};
