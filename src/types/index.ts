export interface Project {
  id: string;
  name: string;
  date: string; // "MM YYYY" as shown in preview meta
  category: string; // short editorial tag shown in the ventures index
  cover: string; // public path to cover image
  coverAlt: string;
}

export interface SkillGroup {
  key: string;
  title: string;
  items: string[];
}

export interface Award {
  org: string;
  site: string;
  prize: string;
  date: string; // "DD MM YYYY"
  cursorImg: string;
}

export interface SocialLink {
  label: string;
  href: string;
}
