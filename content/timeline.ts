import { bestRank, bestRankDates } from "./squashRanking";

export type TimelineArea =
  | "Squash"
  | "Motion Dynamics"
  | "Snowboarding"
  | "Paragliding"
  | "Life events";

export type TimelineItem = {
  year: string;
  area: TimelineArea;
  title: string;
  meta?: string;
  description?: string;
  sourceFilename?: string;
  sourceDate?: string;
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
    area: "Life events",
    title: "4c7e6c7d 558a 4a16 Be6a 1f977b9bb759",
    meta: "2026-03-16",
    description: "VentureFest 2026 saw the PitchUp competition, a key performance indicator for emerging ventures. Motion Dynamics presented their core value proposition, demonstrating their system for improving human movement.",
    sourceFilename: "4c7e6c7d-558a-4a16-be6a-1f977b9bb759.jpg",
    sourceDate: "2026-03-16",
  },
  {
    year: "2026",
    area: "Life events",
    title: "6cd19684 2df2 4516 9ef5 0fb096a5b283",
    meta: "2026-03-16",
    description: "The Motion Dynamics team convened at VentureFest 2026, marking a milestone in their outreach and networking strategy. The event provided a platform for showcasing their precision engineering approach to biomechanics.",
    sourceFilename: "6cd19684-2df2-4516-9ef5-0fb096a5b283.jpg",
    sourceDate: "2026-03-16",
  },
];
