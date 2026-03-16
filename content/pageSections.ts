export type DynamicPageKey =
  | "home"
  | "work"
  | "sport"
  | "snowboard"
  | "about"
  | "contact";

export type DynamicPageSection = {
  page: DynamicPageKey;
  key: string;
  title: string;
  intro?: string;
  order: number;
};

export const dynamicPageSections: DynamicPageSection[] = [
  {
    page: "work",
    key: "motion-dynamics",
    title: "Motion Dynamics",
    intro: "Product demos, technical milestones, and commercial proof points.",
    order: 10,
  },
  {
    page: "work",
    key: "golf-analysis",
    title: "Golf Analysis",
    intro:
      "We apply our movement-analysis approach to golf, turning swing footage into coach-ready feedback.",
    order: 20,
  },
];
