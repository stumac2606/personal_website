import { profile } from "./profile";

export type HighlightArea =
  | "Squash"
  | "Motion Dynamics"
  | "Snowboarding"
  | "Paragliding"
  | "Hobbies";

export type HighlightTag = "qualification" | "award" | "project" | "moment";

export type Highlight = {
  id: string;
  area: HighlightArea;
  title: string;
  meta?: string;
  description?: string;
  date?: string;
  tag?: HighlightTag;
  featured?: boolean;
  sourceFilename?: string;
  sourceDate?: string;
};

export const highlights: Highlight[] = [
  {
    id: "guilfoyle-psa",
    area: "Squash",
    title: "Guilfoyle PSA Squash Classic - Champion",
    meta: "Toronto, Canada - Feb-Mar 2024",
    date: "2024-03-02",
    tag: "award",
    featured: true,
  },
  {
    id: "oban-open",
    area: "Squash",
    title: "Oban Open - Champion",
    meta: "Oban, Scotland - Oct 2023",
    date: "2023-10-29",
    tag: "award",
    featured: true,
  },
  {
    id: "nm-academy",
    area: "Squash",
    title: "NM Academy Open - Champion",
    meta: "Sheffield, England - Aug 2021",
    date: "2021-08-22",
    tag: "award",
  },
  {
    id: "psa-challenger",
    area: "Squash",
    title: "PSA Challenger titles",
    meta: "3 titles",
    description: "Consistent results across the Challenger circuit.",
    tag: "award",
  },
  {
    id: "serve-pipeline",
    area: "Motion Dynamics",
    title: "Built a tennis serve analysis pipeline",
    description:
      "Designed and built a video-based serve analysis pipeline: movement extraction + object dynamics -> multi-layer insights for performance and decision-making.",
    tag: "project",
    featured: true,
  },
  {
    id: "investment-forum",
    area: "Motion Dynamics",
    title: "Pitched Motion Dynamics at West Midlands Investment Forum",
    description:
      "It's strange getting into my squash kit for a completely different purpose now; pitching our sport tech company... Great highlight performing a bang average tennis serve on stage.",
    tag: "moment",
  },
  {
    id: "casi-level-1",
    area: "Snowboarding",
    title: "CASI Level 1 Instructor",
    description: "Certified to teach beginner-to-intermediate fundamentals.",
    tag: "qualification",
    featured: true,
  },
  {
    id: "casi-park",
    area: "Snowboarding",
    title: "CASI Level 1 Park Instructor",
    description: "Coaching park basics with safe progression.",
    tag: "qualification",
  },
  {
    id: "paragliding-level-1",
    area: "Paragliding",
    title: "Paragliding - Flight Level 1",
    description: "Another discipline where precision and judgement matter.",
    tag: "moment",
    featured: true,
  },
  {
    id: "4c7e6c7d-558a-4a16-be6a-1f977b9bb759-2026-03-16",
    area: "Motion Dynamics",
    title: "Motion Dynamics Pitch at VentureFest 2026",
    meta: "2026-03-16",
    description: "Presented Motion Dynamics' core value proposition at VentureFest 2026. The objective was to articulate our systems-based approach to performance enhancement and product development.",
    date: "2026-03-16",
    tag: "project",
    sourceFilename: "4c7e6c7d-558a-4a16-be6a-1f977b9bb759.jpg",
    sourceDate: "2026-03-16",
  },
  {
    id: "6cd19684-2df2-4516-9ef5-0fb096a5b283-2026-03-16",
    area: "Motion Dynamics",
    title: "Motion Dynamics Team at VentureFest 2026",
    meta: "2026-03-16",
    description: "Post-presentation at VentureFest 2026. Engaging with the startup ecosystem and showcasing our engineering-driven solutions.",
    date: "2026-03-16",
    tag: "project",
    sourceFilename: "6cd19684-2df2-4516-9ef5-0fb096a5b283.jpg",
    sourceDate: "2026-03-16",
  },
];

export const featuredSection = {
  id: "highlights",
  eyebrow: "Highlights",
  title: "Featured Highlights",
  subtitle: "A cross-section of sport, tech, and instruction.",
};

export const featuredHighlights = highlights.filter((item) => item.featured);

export const motionHighlights = highlights.filter(
  (item) => item.area === "Motion Dynamics",
);

export const snowboardQualifications = highlights.filter(
  (item) => item.area === "Snowboarding" && item.tag === "qualification",
);

export const snowboardPage = {
  id: "snowboard",
  navLabel: "Snowboard",
  eyebrow: "Snowboard",
  title: "Instruction and Progression",
  subtitle: "Park fundamentals, safe progression, and flow state coaching.",
  intro:
    "Snowboard instruction is about confidence, clear feedback, and the right progression at the right moment.",
  qualificationsTitle: "CASI Qualifications",
  qualificationsSubtitle:
    "Credentials that keep progression safe and consistent on snow.",
  clipsTitle: "Featured Clips",
  clipsSubtitle: "Short edits from the hill - control, speed, and style.",
};

export const snowboardMeta = {
  title: `${profile.name} - Snowboard`,
  description:
    "Snowboard instruction, CASI qualifications, and progression-focused coaching.",
};
