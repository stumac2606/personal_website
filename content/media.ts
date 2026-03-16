import { profile } from "./profile";
import type { DynamicPageKey } from "./pageSections";

export type MediaSectionName =
  | "Squash"
  | "Tech"
  | "Flight"
  | "Snowboard"
  | "Life in Motion";

export type MediaType = "image" | "video";
export type MediaMode = "fit" | "cover";

export type MediaItem = {
  id: string;
  type: MediaType;
  src: string;
  title: string;
  alt?: string;
  section: MediaSectionName;
  pageKey?: DynamicPageKey;
  pageSectionKey?: string;
  pageSectionTitle?: string;
  pageSectionIntro?: string;
  caption?: string;
  mode?: MediaMode;
  sourceFilename?: string;
  sourceDate?: string;
  sourceMimeType?: string;
};

export type MediaSection = {
  id: string;
  name: MediaSectionName;
  label: string;
  caption?: string;
};

export type MediaFilterId = string;

export const mediaPage = {
  id: "media",
  navLabel: "Media",
  eyebrow: "Media",
  title: "Cinematic Gallery",
  subtitle: "Training clips, pitches, and mountain time.",
  intro:
    "A cinematic edit of professional sport, product building, and life in motion.",
  galleryTitle: "Gallery",
  gallerySubtitle: "Still frames and motion sequences.",
  filterLabel: "Filter",
  videoFallback: "Your browser does not support the video tag.",
};

export const mediaSections: MediaSection[] = [
  {
    id: "squash",
    name: "Squash",
    label: "Squash",
    caption: "Tour competition and match intensity.",
  },
  {
    id: "tech",
    name: "Tech",
    label: "Tech",
    caption: "Motion Dynamics and performance storytelling.",
  },
  {
    id: "flight",
    name: "Flight",
    label: "Flight",
    caption: "Paragliding and aerial focus.",
  },
  {
    id: "snowboard",
    name: "Snowboard",
    label: "Snowboard",
    caption: "Park fundamentals and mountain time.",
  },
  {
    id: "life-events",
    name: "Life in Motion",
    label: "Life in Motion",
    caption: "Travel, endurance, and life beyond the court.",
  },
];

export const media: MediaItem[] = [
  {
    id: "squash-1",
    type: "image",
    src: "/media/images/Squash1.jpg",
    title: "Tour match focus",
    section: "Squash",
  },
  {
    id: "squash-2",
    type: "image",
    src: "/media/images/Squash2.jpg",
    title: "Pressure point",
    section: "Squash",
  },
  {
    id: "tech-serve-stage",
    type: "image",
    src: "/media/images/tennis_serve_on_stage_for_pitch.JPG",
    title: "Serve demo on stage",
    section: "Tech",
    pageKey: "work",
    pageSectionKey: "motion-dynamics",
    pageSectionTitle: "Motion Dynamics",
    pageSectionIntro: "Product demos, technical milestones, and commercial proof points.",
  },
  {
    id: "tech-pitching",
    type: "image",
    src: "/media/images/serious_image_of_me_pitching.JPG",
    title: "Pitching Motion Dynamics",
    section: "Tech",
    pageKey: "work",
    pageSectionKey: "motion-dynamics",
    pageSectionTitle: "Motion Dynamics",
    pageSectionIntro: "Product demos, technical milestones, and commercial proof points.",
  },
  {
    id: "tech-serve-analysis",
    type: "video",
    src: "/media/videos/video_of_me_analysising_my_tennis_serve_using_my_designed_technology.mp4",
    title: "Tennis serve analysis",
    caption: "Video -> movement extraction -> biomechanics insights.",
    section: "Tech",
    pageKey: "work",
    pageSectionKey: "motion-dynamics",
    pageSectionTitle: "Motion Dynamics",
    pageSectionIntro: "Product demos, technical milestones, and commercial proof points.",
  },
  {
    id: "flight-paragliding",
    type: "video",
    src: "/media/videos/video_of_me_paragliding.mov",
    title: "Paragliding",
    caption: "Flight Level 1 - another way to learn flow and risk management.",
    section: "Flight",
  },
  {
    id: "snowboard-360",
    type: "video",
    src: "/media/videos/video_of_me_doing_a_360_on_a_snowboard.MOV",
    title: "Snowboard 360",
    caption: "Park fundamentals - control + style.",
    section: "Snowboard",
  },
  {
    id: "snowboard-cliff",
    type: "video",
    src: "/media/videos/video_of_me_doing_a_cliff_drop_snowboarding.mov",
    title: "Cliff drop",
    caption: "Commitment, speed, and decision-making.",
    section: "Snowboard",
  },
  {
    id: "life-iron-run",
    type: "image",
    src: "/media/images/Iron_run.JPG",
    title: "Iron run",
    section: "Life in Motion",
  },
  {
    id: "life-iron-cycle",
    type: "image",
    src: "/media/images/Iron_cycle.JPG",
    title: "Iron cycle",
    section: "Life in Motion",
  },
  {
    id: "life-iron-finish",
    type: "image",
    src: "/media/images/Iron_finish.JPG",
    title: "Iron finish",
    section: "Life in Motion",
  },
  {
    id: "life-iron-swim",
    type: "image",
    src: "/media/images/Iron_swim.JPG",
    title: "Iron swim",
    section: "Life in Motion",
  },
  {
    id: "4c7e6c7d-558a-4a16-be6a-1f977b9bb759-2026-03-16",
    type: "image",
    src: "/media/images/4c7e6c7d-558a-4a16-be6a-1f977b9bb759-2026-03-16.jpg",
    title: "VentureFest pitch",
    alt: "Stuart pitching Motion Dynamics on stage at VentureFest 2026.",
    section: "Tech",
    pageKey: "work",
    pageSectionKey: "motion-dynamics",
    pageSectionTitle: "Motion Dynamics",
    pageSectionIntro: "Product demos, technical milestones, and commercial proof points.",
    caption: "Pitched how we turn movement footage into clearer coaching decisions.",
    sourceFilename: "4c7e6c7d-558a-4a16-be6a-1f977b9bb759.jpg",
    sourceDate: "2026-03-16",
    sourceMimeType: "image/jpeg",
  },
  {
    id: "6cd19684-2df2-4516-9ef5-0fb096a5b283-2026-03-16",
    type: "image",
    src: "/media/images/6cd19684-2df2-4516-9ef5-0fb096a5b283-2026-03-16.jpg",
    title: "VentureFest team photo",
    alt: "Motion Dynamics team after the VentureFest 2026 pitch.",
    section: "Tech",
    pageKey: "work",
    pageSectionKey: "motion-dynamics",
    pageSectionTitle: "Motion Dynamics",
    pageSectionIntro: "Product demos, technical milestones, and commercial proof points.",
    caption: "A quick team photo after the pitch.",
    sourceFilename: "6cd19684-2df2-4516-9ef5-0fb096a5b283.jpg",
    sourceDate: "2026-03-16",
    sourceMimeType: "image/jpeg",
  },
  {
    id: "snowboard-jump-2026-03-16",
    type: "video",
    src: "/media/videos/snowboard-jump-2026-03-16.mov",
    title: "Penken Park Jump Progression",
    alt: "Snowboarder launching off a large jump in Penken Park.",
    section: "Snowboard",
    caption: "Working on cleaner airtime, timing, and landings in Penken Park.",
    sourceFilename: "Snowboard_jump.MOV",
    sourceDate: "2026-03-16",
    sourceMimeType: "video/quicktime",
  },
  {
    id: "384cd551-69cf-43d6-8303-1c35804f8a2c-1-105-c-2026-02-03",
    type: "image",
    src: "/media/images/384cd551-69cf-43d6-8303-1c35804f8a2c-1-105-c-2026-02-03.jpeg",
    title: "Golf Swing Analysis Setup",
    alt: "Three people in a golf simulator room, with a large screen displaying golf software.",
    section: "Tech",
    pageKey: "work",
    pageSectionKey: "golf-analysis",
    pageSectionTitle: "Golf Analysis",
    pageSectionIntro: "We apply our movement-analysis approach to golf, turning swing footage into coach-ready feedback.",
    caption: "We apply our movement analysis to golf for precise swing feedback.",
    sourceFilename: "384CD551-69CF-43D6-8303-1C35804F8A2C_1_105_c.jpeg",
    sourceDate: "2026-02-03",
    sourceMimeType: "image/jpeg",
  },
  {
    id: "3d-digital-twin-of-golf-swing-2026-03-16",
    type: "video",
    src: "/media/videos/3d-digital-twin-of-golf-swing-2026-03-16.mov",
    title: "3D Golf Swing Digital Twin",
    alt: "A video showing a 3D digital model of a golf swing.",
    section: "Tech",
    pageKey: "work",
    pageSectionKey: "golf-analysis",
    pageSectionTitle: "Golf Analysis",
    pageSectionIntro: "We apply our movement-analysis approach to golf, turning swing footage into coach-ready feedback.",
    caption: "Our 3D digital twins capture swing dynamics for detailed performance review.",
    sourceFilename: "3D_digital_twin_of_golf_swing.MOV",
    sourceDate: "2026-03-16",
    sourceMimeType: "video/quicktime",
  },
  {
    id: "f2c838a7-add9-45b1-be0d-f02c83e44c04-1-105-c-2026-02-03",
    type: "image",
    src: "/media/images/f2c838a7-add9-45b1-be0d-f02c83e44c04-1-105-c-2026-02-03.jpeg",
    title: "Golf Swing Data Visualization",
    alt: "Screens displaying golf swing analysis software with heatmaps and graphs.",
    section: "Tech",
    pageKey: "work",
    pageSectionKey: "golf-analysis",
    pageSectionTitle: "Golf Analysis",
    pageSectionIntro: "We apply our movement-analysis approach to golf, turning swing footage into coach-ready feedback.",
    caption: "We translate complex movement data into clear, actionable coaching feedback.",
    sourceFilename: "F2C838A7-ADD9-45B1-BE0D-F02C83E44C04_1_105_c.jpeg",
    sourceDate: "2026-02-03",
    sourceMimeType: "image/jpeg",
  },
  {
    id: "golf-swing-live-2026-03-16",
    type: "video",
    src: "/media/videos/golf-swing-live-2026-03-16.mov",
    title: "Live Golf Swing Analysis",
    alt: "A video showing a live golf swing analysis on a computer screen.",
    section: "Tech",
    pageKey: "work",
    pageSectionKey: "golf-analysis",
    pageSectionTitle: "Golf Analysis",
    pageSectionIntro: "We apply our movement-analysis approach to golf, turning swing footage into coach-ready feedback.",
    caption: "Real-time feedback systems enhance our golf performance analysis.",
    sourceFilename: "Golf_swing_live.MOV",
    sourceDate: "2026-03-16",
    sourceMimeType: "video/quicktime",
  },
];

export const mediaFilters: Array<{
  id: MediaFilterId;
  label: string;
  sections: MediaSectionName[];
}> = buildMediaFilters(mediaSections);

export function buildMediaFilters(
  sections: MediaSection[],
): Array<{
  id: MediaFilterId;
  label: string;
  sections: MediaSectionName[];
}> {
  return [
    {
      id: "all",
      label: "All",
      sections: sections.map((section) => section.name),
    },
    ...sections.map((section) => ({
      id: section.id,
      label: section.label,
      sections: [section.name],
    })),
  ];
}

export const snowboardClips = media.filter(
  (item) => item.section === "Snowboard" && item.type === "video",
);

export const mediaMeta = {
  title: `${profile.name} - Media`,
  description:
    "A cinematic gallery of professional sport, product building, and mountain time.",
};
