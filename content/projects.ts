export type Project = {
  name: string;
  summary: string;
  tags: string[];
};

export const workPage = {
  id: "work",
  navLabel: "Work",
  eyebrow: "Work",
  title: "Motion Dynamics",
  subtitle: "Video-based performance analysis built for coaches and athletes.",
  companyLogoSrc: "/media/images/company_logo.png",
  companyLogoAlt: "Motion Dynamics logo",
  intro:
    "Motion Dynamics is built to make elite movement measurable, repeatable, and coachable.",
  highlightsTitle: "Motion Dynamics Highlights",
  highlightsSubtitle:
    "Key moments and technical milestones from the platform.",
  quote: {
    eyebrow: "LinkedIn",
    title: "LinkedIn Quote",
    text:
      "It's strange getting into my squash kit for a completely different purpose now; pitching our sport tech company. Great highlight performing a bang average tennis serve on stage.",
    attribution: "LinkedIn post - West Midlands Investment Forum",
  },
  pipelineTitle: "Pipeline",
  pipelineSubtitle: "Short, punchy system flow from video to insight.",
  pipelineSteps: [
    "Capture: high-speed, high-context footage.",
    "Extract: pose, object dynamics, and timing.",
    "Interpret: biomechanical signals and intent.",
    "Deliver: coach-ready cues and progress markers.",
  ],
};

export const workMeta = {
  title: "Stuart MacGregor - Work",
  description:
    "Motion Dynamics highlights, the pipeline behind the platform, and product moments.",
};

export const projects: Project[] = [
  {
    name: "Motion Dynamics",
    summary:
      "Video-based performance analysis that turns movement into actionable coaching insight.",
    tags: ["Computer Vision", "Biomechanics", "Performance Insight"],
  },
  {
    name: "Serve Analysis Pipeline",
    summary:
      "Designed and built a video-based serve analysis pipeline: movement extraction + object dynamics -> multi-layer insights for performance and decision-making.",
    tags: ["Tennis", "Pose Tracking", "Decision Support"],
  },
  {
    name: "West Midlands Investment Forum Pitch",
    summary:
      "Presented Motion Dynamics at the West Midlands Investment Forum with an on-stage tennis serve demonstration.",
    tags: ["Pitch", "Stage Demo", "Product Story"],
  },
];
