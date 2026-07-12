import type { Project, SkillGroup, Award, SocialLink } from "@/types";

/** Content extracted verbatim from lukebaffait.fr (EN i18n) — local study clone. */

export const PROJECTS: Project[] = [
  { id: "cyberdiag", name: "CyberDiag website", date: "01 2025", cover: "/assets/images/projects/Covers/cyberDiag_web.avif", coverAlt: "CyberDiag website" },
  { id: "anima", name: "Anima", date: "06 2025", cover: "/assets/images/projects/Covers/Anima.avif", coverAlt: "Anima website" },
  { id: "cyberdiag-app", name: "CyberDiag app", date: "09 2025", cover: "/assets/images/projects/Covers/CyberDiag.avif", coverAlt: "CyberDiag desktop app" },
  { id: "zenith", name: "Zenith", date: "11 2025", cover: "/assets/images/projects/Covers/Zenith.avif", coverAlt: "Zenith web browser" },
  { id: "skymcdb", name: "SkymcDB", date: "02 2026", cover: "/assets/images/projects/Covers/SkymcDB.avif", coverAlt: "SkymcDB tool" },
  { id: "chromablock", name: "ChromaBlock", date: "03 2026", cover: "/assets/images/projects/Covers/ChromaBlock.avif", coverAlt: "ChromaBlock web app" },
  { id: "symphony", name: "Symphony", date: "03 2026", cover: "/assets/images/projects/Covers/Symphony.avif", coverAlt: "Symphony music app" },
  { id: "echo", name: "Echo", date: "03 2026", cover: "/assets/images/projects/Covers/Echo.avif", coverAlt: "Echo AI chat interface" },
];

export const GALLERY_COVERS: string[] = PROJECTS.map((p) => p.cover);

export const SKILL_GROUPS: SkillGroup[] = [
  { key: "frontend", title: "Frontend", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind", "Bootstrap", "Electron"] },
  { key: "animation", title: "Animation & 3D", items: ["GSAP", "Lenis", "Barba.js", "Three.js", "WebGL", "Blender"] },
  { key: "backend", title: "Backend", items: ["Node.js", "Express.js", "Python", "Java", "PHP", "Netlify"] },
  { key: "database", title: "Databases", items: ["MySQL", "PostgreSQL", "MongoDB", "Supabase"] },
  { key: "devops", title: "DevOps & Tools", items: ["Docker", "Vercel", "Git", "GitHub", "GitLab", "Cloudflare"] },
  { key: "sysadmin", title: "System & Security", items: ["Linux", "Bash", "Shell", "Owasp", "Metasploit", "Nmap", "OpenVAS", "Ossec"] },
  { key: "design", title: "Design", items: ["Photoshop", "Canva", "Figma"] },
];

export const AWARDS: Award[] = [
  { org: "GSAP", site: "lukebaffait.fr", prize: "Site of the week", date: "17 05 2026", cursorImg: "/assets/images/projects/Covers/Portfolio.avif" },
  { org: "Awwwards", site: "lukebaffait.fr", prize: "Honorable Mention", date: "26 05 2026", cursorImg: "/assets/images/projects/Covers/Portfolio.avif" },
  { org: "Youtube", site: "lukebaffait.fr", prize: "Featured on Codegrid", date: "25 06 2026", cursorImg: "/assets/images/projects/Covers/Portfolio.avif" },
  { org: "Awwwards", site: "lukebaffait.fr", prize: "Portfolio Honors nomination", date: "01 07 2026", cursorImg: "/assets/images/projects/Covers/Portfolio.avif" },
  { org: "landing.love", site: "lukebaffait.fr", prize: "featured for the Best animations", date: "10 06 2026", cursorImg: "/assets/images/projects/Covers/Portfolio.avif" },
];

export const SOCIALS: SocialLink[] = [
  { label: "Behance", href: "https://www.behance.net/lukebaffait" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/luke-baffait/" },
  { label: "GitHub", href: "https://github.com/SkyNigh1" },
];

export const NAV_LINKS: SocialLink[] = [
  { label: "Work", href: "#projects" },
  { label: "Info", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const COPY = {
  heroTagline:
    'Quiet creator, <span class="other-accent">bringing ideas to life</span>,<br/>through motion, detail and softness.',
  revealPhrase: "Basically, I make websites.",
  aboutText:
    'As a<span class="other-accent"> creative developer</span>, I craft tailor-made web experiences, blending technical precision and <span class="other-accent">emotion</span>.',
  aboutSub:
    "My name is Luke. A passionate creator and computer science student in Vannes, I build memorable digital experiences, always seeking the symbiosis between art and information.",
  cgPhrase:
    'Each project is a chance to <span class="other-accent">learn</span>, <span class="other-accent">experiment</span> and push my limits.',
  skillsSubtitle: "Skills",
  skillsText:
    "Computer Science student in Vannes, specialized in cybersecurity, passionate about web development and design.",
  contactDispo1:
    'Looking for an <span class="other-accent">apprenticeship</span> starting September. Eager to join an innovative team and contribute to ambitious projects.',
  contactDispo2:
    'I\'m available for<span class="other-accent"> freelance missions worldwide</span>, on<span class="other-accent"> your ambitious projects</span> and international collaborations.',
  mail: "luke.baffait@yahoo.com",
};
