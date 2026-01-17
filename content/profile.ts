export type Profile = {
  name: string;
  descriptor: string;
  tagline: string;
  roles: string[];
  intro: string;
  email: string;
  heroImageSrc: string;
  heroImageAlt: string;
};

export const profile: Profile = {
  name: "Stuart MacGregor",
  descriptor: "Athlete / Technologist",
  tagline:
    "Former professional athlete building sport-tech, bridging performance and engineering.",
  roles: ["Pro Squash", "Founder / Engineer", "Snowboard Instructor"],
  intro:
    "A former professional squash player building technology that turns video into performance insight. My work sits at the intersection of elite sport, biomechanics, and practical engineering - helping coaches, athletes, and teams make better decisions with objective movement data.",
  email: "stuart@motiondynamics.ai",
  heroImageSrc: "/media/images/Stu_Headshot.jpg",
  heroImageAlt: "Stuart MacGregor headshot",
};

export const siteMeta = {
  title: profile.name,
  description:
    "Professional squash athlete and sport-tech founder building performance systems that bridge sport, engineering, and instruction.",
};

export const homeMeta = {
  title: `${profile.name} - Home`,
  description:
    "Athlete and technologist bridging professional squash, sport-tech, and instruction.",
};

export const aboutMeta = {
  title: `${profile.name} - About`,
  description:
    "Story, timeline, and the disciplines that shape Stuart MacGregor's work.",
};

export const homeHero = {
  id: "home",
  navLabel: "Home",
  eyebrow: "Home",
  title: profile.name,
  subtitle: profile.tagline,
  lead: profile.intro,
};

export const homeStats = [
  { id: "psaBest", label: "PSA Best" },
  { id: "latestRank", label: "Latest Rank" },
  { id: "challengerTitles", label: "Challenger Titles" },
] as const;

export const homeBridge = {
  id: "bridge",
  eyebrow: "Bridge",
  title: "Sport <-> Tech <-> Instruction",
  subtitle: "A feedback loop of performance, analysis, and teaching.",
  pillars: [
    {
      label: "Sport",
      description:
        "Training and competition ground every decision in real performance demands.",
    },
    {
      label: "Tech",
      description:
        "Motion Dynamics turns video into measurable insight for coaches and athletes.",
    },
    {
      label: "Instruction",
      description:
        "Clear coaching frameworks keep progression safe, confident, and repeatable.",
    },
  ],
};

export const homeCta = {
  id: "cta",
  eyebrow: "CTA",
  title: "Building the Bridge between Sports and Technology",
  subtitle: "Open to collaborations, partnerships, and coaching innovation.",
  body:
    "If you are working on performance systems, athlete development, or sport-tech tools, I want to hear from you.",
  action: {
    label: "Start a conversation",
    href: "/contact",
  },
};

export const aboutPage = {
  id: "about",
  navLabel: "About",
  eyebrow: "About",
  title: "Story",
  subtitle: "Competition informs how I build. Engineering informs how I train.",
  story: [
    profile.intro,
    "I focus on performance systems that live between coaching intent and measurable output. Training blocks, recovery, and feedback loops are designed with the same care as product roadmaps.",
    "The goal is a consistent, repeatable pathway from human movement to actionable insight, grounded in real-world competition.",
  ],
};
