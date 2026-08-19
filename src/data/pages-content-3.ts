/**
 * Approved copy — Website Copy Master v1.0, pages 12–13
 * (Contact, global footer, legal pages, technical copy).
 * Verbatim from the client document. See content.ts for the shared rules.
 */

/* --------------------------------------------------------------- CONTACT */

export const CONTACT = {
  headline: "Let’s Start With What You Are Building.",
  body: [
    "For consulting, advisory, brand partnerships, speaking, events, media, strategic introductions, and PGPM projects, share the opportunity, objective, and timing below.",
  ],
  routes: {
    headline: "Contact Routes",
    items: [
      {
        title: "Consultation",
        body: "For a private one-hour strategic session, use the dedicated booking page.",
        href: "/consultation",
      },
      {
        title: "Advisory",
        body: "For ongoing founder, executive, board, or organisational advisory.",
        href: "/advisory",
      },
      {
        title: "Brand Partnership",
        body: "For campaigns, ambassadorships, destination work, representation, and content collaborations.",
        href: "/partnerships",
      },
      {
        title: "Speaking & Events",
        body: "For keynote, panel, moderation, hosting, appearance, or event-advisory enquiries.",
        href: "/speaking",
      },
      {
        title: "Media",
        body: "For interviews, profiles, expert commentary, television, podcasts, and press.",
        href: "/media",
      },
      {
        title: "PGPM Project",
        body: "For strategy, content, media, events, partnerships, influence, technology, community, and growth execution.",
        href: "/pgpm",
      },
    ],
  },
  /** Enquiry types for the form's routing dropdown, from the contact routes. */
  enquiryTypes: [
    "Consultation",
    "Advisory",
    "Brand Partnership",
    "Speaking & Events",
    "Media",
    "PGPM Project",
    "Other",
  ],
  confirmation:
    "Thank you for contacting Paria Ghorashi. Your enquiry has been received and will be reviewed. The team will respond where the opportunity and requested support are aligned.",
  details: {
    email: "paria@pgpm.ae",
    instagram: "@pariaghorashi",
    linkedin: "Paria Ghorashi",
  },
  /**
   * The master: "Confirm the final public phone number before adding it."
   * Deliberately absent until confirmed.
   */
};

/** Form error messages, verbatim from the master. */
export const FORM_ERRORS = {
  required: "Please complete all required fields.",
  email: "Please enter a valid email address.",
  enquiryType: "Please select an enquiry type.",
  fileTooLarge: "Your file is too large. Please upload a smaller file.",
  generic: "Something went wrong. Please try again or email paria@pgpm.ae.",
};

/* ------------------------------------------------------------ 404 PAGE */

export const NOT_FOUND = {
  headline: "This Page Has Moved.",
  body: "The page you are looking for is no longer here or the address is incorrect.",
  buttons: [
    { label: "Return Home", href: "/" },
    { label: "Contact the Team", href: "/contact" },
  ],
};

/* -------------------------------------------------------- COOKIE BANNER */

export const COOKIE_BANNER = {
  copy: "This website uses essential cookies and, with your permission, analytics cookies to improve performance and understand how visitors use the site.",
  acceptAll: "Accept All",
  essentialOnly: "Essential Only",
  managePreferences: "Manage Preferences",
};

/* --------------------------------------------------------- LEGAL PAGES */

/**
 * The master supplies the introduction and the required headings, but NOT the
 * body text, and instructs: "A UAE-based legal professional or privacy
 * specialist should review the final policy." Body copy is therefore not
 * written here — inventing privacy or liability terms for a real business is a
 * legal risk, not a content gap. The page renders the approved structure and
 * states plainly that the text is pending legal review.
 */
export const PRIVACY = {
  title: "Privacy Policy",
  intro:
    "This Privacy Policy explains how information is collected, used, stored, and protected when you visit this website, submit an enquiry, book a consultation, upload a document, or communicate with the team.",
  headings: [
    "Information We Collect",
    "How We Use Information",
    "Payment and Booking Providers",
    "Cookies and Analytics",
    "Document Uploads",
    "Data Sharing",
    "Data Retention",
    "Data Security",
    "Your Rights",
    "International Data Transfers",
    "Children’s Privacy",
    "Policy Updates",
    "Contact",
  ],
  pendingNotice:
    "The full policy text is being prepared for review by a UAE-based legal professional before publication. For any question about your data in the meantime, contact paria@pgpm.ae.",
};

export const TERMS = {
  title: "Terms of Use",
  intro:
    "These terms govern the use of this website and any enquiry, consultation, or engagement arranged through it.",
  headings: [
    "Website use",
    "Intellectual property",
    "Information and advisory disclaimer",
    "No guarantee of results",
    "Consultation terms",
    "Payments, cancellations, and rescheduling",
    "Third-party links",
    "Limitation of liability",
    "Governing law",
    "Contact",
  ],
  pendingNotice:
    "Legal review is required before launch. The full terms are being prepared and will be published here once reviewed.",
};
