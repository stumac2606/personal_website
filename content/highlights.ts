import { profile } from "./profile";
import type { DynamicPageKey } from "./pageSections";

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
  sourcePlacement?: "primary" | "home-feature";
  pageKey?: DynamicPageKey;
  pageSectionKey?: string;
  pageSectionTitle?: string;
  pageSectionIntro?: string;
  sourceFilename?: string;
  sourceDate?: string;
  sourceFolder?: string;
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
    description: "Built a serve pipeline from video, movement extraction, and object tracking.",
    tag: "project",
    featured: true,
    pageKey: "work",
    pageSectionKey: "motion-dynamics",
    pageSectionTitle: "Motion Dynamics",
    pageSectionIntro: "Product demos, technical milestones, and commercial proof points.",
  },
  {
    id: "investment-forum",
    area: "Motion Dynamics",
    title: "Pitched Motion Dynamics at West Midlands Investment Forum",
    description:
      "It's strange getting into my squash kit for a completely different purpose now; pitching our sport tech company... Great highlight performing a bang average tennis serve on stage.",
    tag: "moment",
    pageKey: "work",
    pageSectionKey: "motion-dynamics",
    pageSectionTitle: "Motion Dynamics",
    pageSectionIntro: "Product demos, technical milestones, and commercial proof points.",
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
    id: "venturefest-2026",
    area: "Motion Dynamics",
    title: "Motion Dynamics at VentureFest 2026",
    meta: "PitchUp competition - Mar 2026",
    description:
      "Pitched how we turn movement footage into clearer coaching decisions.",
    date: "2026-03-16",
    tag: "moment",
    pageKey: "work",
    pageSectionKey: "motion-dynamics",
    pageSectionTitle: "Motion Dynamics",
    pageSectionIntro: "Product demos, technical milestones, and commercial proof points.",
    sourceFilename: "4c7e6c7d-558a-4a16-be6a-1f977b9bb759.jpg",
    sourceDate: "2026-03-16",
    sourceFolder: "PitchUp competition - VentureFest 2026",
  },
  {
    id: "snowboard-jump-2026-03-16",
    area: "Snowboarding",
    title: "Penken Park Jump Progression",
    meta: "2026-03-16",
    description: "Working on cleaner airtime, timing, and landings in Penken Park.",
    date: "2026-03-16",
    tag: "moment",
    sourceFilename: "Snowboard_jump.MOV",
    sourceDate: "2026-03-16",
  },
  {
    id: "384cd551-69cf-43d6-8303-1c35804f8a2c-1-105-c-2026-02-03",
    area: "Motion Dynamics",
    title: "Golf Swing Analysis Setup",
    meta: "2026-02-03",
    description: "We apply our movement analysis to golf for precise swing feedback.",
    date: "2026-02-03",
    tag: "project",
    pageKey: "work",
    pageSectionKey: "golf-analysis",
    pageSectionTitle: "Golf Analysis",
    pageSectionIntro: "We apply our movement-analysis approach to golf, turning swing footage into coach-ready feedback.",
    sourceFilename: "384CD551-69CF-43D6-8303-1C35804F8A2C_1_105_c.jpeg",
    sourceDate: "2026-02-03",
    sourceFolder: "PGA - Golf analysis",
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
