import { profile } from "./profile";

export type MediaSectionName =
  | "Squash"
  | "Tech"
  | "Flight"
  | "Snowboard"
  | "Life events";

export type MediaType = "image" | "video";
export type MediaMode = "fit" | "cover";

export type MediaItem = {
  id: string;
  type: MediaType;
  src: string;
  title: string;
  alt?: string;
  section: MediaSectionName;
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

export type MediaFilterId = "all" | "tech" | "snow" | "flight" | "squash";

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
    name: "Life events",
    label: "Life events",
    caption: "Endurance milestones beyond the court.",
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
  },
  {
    id: "tech-pitching",
    type: "image",
    src: "/media/images/serious_image_of_me_pitching.JPG",
    title: "Pitching Motion Dynamics",
    section: "Tech",
  },
  {
    id: "tech-serve-analysis",
    type: "video",
    src: "/media/videos/video_of_me_analysising_my_tennis_serve_using_my_designed_technology.mp4",
    title: "Tennis serve analysis",
    caption: "Video -> movement extraction -> biomechanics insights.",
    section: "Tech",
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
    section: "Life events",
  },
  {
    id: "life-iron-cycle",
    type: "image",
    src: "/media/images/Iron_cycle.JPG",
    title: "Iron cycle",
    section: "Life events",
  },
  {
    id: "life-iron-finish",
    type: "image",
    src: "/media/images/Iron_finish.JPG",
    title: "Iron finish",
    section: "Life events",
  },
  {
    id: "life-iron-swim",
    type: "image",
    src: "/media/images/Iron_swim.JPG",
    title: "Iron swim",
    section: "Life events",
  },
  {
    id: "4c7e6c7d-558a-4a16-be6a-1f977b9bb759-2026-03-16",
    type: "image",
    src: "/media/images/4c7e6c7d-558a-4a16-be6a-1f977b9bb759-2026-03-16.jpg",
    title: "Motion Dynamics Pitch at VentureFest 2026",
    alt: "Stuart MacGregor presenting Motion Dynamics' 'Helping the world move better' pitch at VentureFest 2026.",
    section: "Tech",
    caption: "Presented Motion Dynamics' core value proposition at VentureFest 2026. The objective was to articulate our systems-based approach to performance enhancement and product development.",
    sourceFilename: "4c7e6c7d-558a-4a16-be6a-1f977b9bb759.jpg",
    sourceDate: "2026-03-16",
    sourceMimeType: "image/jpeg",
  },
  {
    id: "6cd19684-2df2-4516-9ef5-0fb096a5b283-2026-03-16",
    type: "image",
    src: "/media/images/6cd19684-2df2-4516-9ef5-0fb096a5b283-2026-03-16.jpg",
    title: "Motion Dynamics Team at VentureFest 2026",
    alt: "The Motion Dynamics team posing for a photo at VentureFest 2026.",
    section: "Tech",
    caption: "Post-presentation at VentureFest 2026. Engaging with the startup ecosystem and showcasing our engineering-driven solutions.",
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
    caption: "Refining aerial control and landing mechanics in Penken Park. Consistent execution requires precise body positioning and timing, translating into measurable performance gains.",
    sourceFilename: "Snowboard_jump.MOV",
    sourceDate: "2026-03-16",
    sourceMimeType: "video/quicktime",
  },
];

export const mediaFilters: Array<{
  id: MediaFilterId;
  label: string;
  sections: MediaSectionName[];
}> = [
  {
    id: "all",
    label: "All",
    sections: ["Squash", "Tech", "Flight", "Snowboard", "Life events"],
  },
  {
    id: "tech",
    label: "Tech",
    sections: ["Tech"],
  },
  {
    id: "snow",
    label: "Snow",
    sections: ["Snowboard"],
  },
  {
    id: "flight",
    label: "Flight",
    sections: ["Flight"],
  },
  {
    id: "squash",
    label: "Squash",
    sections: ["Squash"],
  },
];

export const snowboardClips = media.filter(
  (item) => item.section === "Snowboard" && item.type === "video",
);

export const mediaMeta = {
  title: `${profile.name} - Media`,
  description:
    "A cinematic gallery of professional sport, product building, and mountain time.",
};
