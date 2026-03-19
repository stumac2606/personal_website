import { bestRank, bestRankDates } from "./squashRanking";
import type { DynamicPageKey } from "./pageSections";

export type TimelineArea =
  | "Squash"
  | "Motion Dynamics"
  | "Snowboarding"
  | "Paragliding"
  | "Life in Motion";

export type TimelineItem = {
  year: string;
  area: TimelineArea;
  title: string;
  meta?: string;
  description?: string;
  pageKey?: DynamicPageKey;
  pageSectionKey?: string;
  pageSectionTitle?: string;
  pageSectionIntro?: string;
  sourceFilename?: string;
  sourceDate?: string;
  sourceFolder?: string;
};

export const timelineSection = {
  id: "sport",
  navLabel: "Sport",
  eyebrow: "Timeline",
  title: "Competition and Craft",
  subtitle: "Squash, Motion Dynamics, Snowboarding, and Paragliding.",
};

export const timeline: TimelineItem[] = [
  {
    year: "2024",
    area: "Squash",
    title: "Guilfoyle PSA Squash Classic - Champion",
    meta: "Toronto, Canada - Feb-Mar 2024",
  },
  {
    year: "2024",
    area: "Squash",
    title: `PSA career-best ranking (No. ${bestRank})`,
    meta: `Best rank dates: ${bestRankDates.join(", ")}`,
  },
  {
    year: "2023",
    area: "Squash",
    title: "Oban Open - Champion",
    meta: "Oban, Scotland - Oct 2023",
  },
  {
    year: "2021",
    area: "Squash",
    title: "NM Academy Open - Champion",
    meta: "Sheffield, England - Aug 2021",
  },
  {
    year: "2021",
    area: "Snowboarding",
    title: "CASI Level 1 Instructor",
    description: "Certified to teach beginner-to-intermediate fundamentals.",
  },
  {
    year: "2021",
    area: "Snowboarding",
    title: "CASI Level 1 Park Instructor",
    description: "Coaching park basics with safe progression.",
  },
  {
    year: "Ongoing",
    area: "Motion Dynamics",
    title: "Motion Dynamics",
    description:
      "Building sport-tech that turns video into actionable performance insight.",
  },
  {
    year: "Ongoing",
    area: "Paragliding",
    title: "Flight Level 1",
    description: "Precision, judgement, and flow in the air.",
  },
  {
    year: "2026",
    area: "Motion Dynamics",
    title: "Motion Dynamics at VentureFest 2026",
    meta: "2026-03-16",
    description:
      "Pitched how we turn movement footage into clearer coaching decisions.",
    sourceFilename: "4c7e6c7d-558a-4a16-be6a-1f977b9bb759.jpg",
    sourceDate: "2026-03-16",
    sourceFolder: "PitchUp competition - VentureFest 2026",
  },
  {
    year: "2026",
    area: "Snowboarding",
    title: "Penken Park Jump Progression",
    meta: "2026-03-16",
    description: "Refining aerial control and landing mechanics in Penken Park. Consistent execution requires precise body positioning and timing, translating into measurable performance gains.",
    sourceFilename: "Snowboard_jump.MOV",
    sourceDate: "2026-03-16",
  },
];
