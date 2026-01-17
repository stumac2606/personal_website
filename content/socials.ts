import { profile } from "./profile";

export type SocialLink = {
  label: string;
  href: string;
};

export const socials: SocialLink[] = [
  { label: "Email", href: `mailto:${profile.email}` },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/stuart-macgregor-739359270/",
  },
  { label: "Instagram", href: "https://www.instagram.com/stu_macgregor/" },
];

export const contactPage = {
  id: "contact",
  navLabel: "Contact",
  eyebrow: "Contact",
  title: "Build the Next Edge",
  subtitle: "Open to collaborations, partnerships, and coaching innovation.",
  body:
    "The best conversations start with a clear problem and a willingness to measure it.",
  email: profile.email,
  emailLabel: "Email",
  socialsLabel: "Socials",
};

export const contactMeta = {
  title: `${profile.name} - Contact`,
  description:
    "Contact Stuart MacGregor for collaborations in sport, performance systems, and coaching innovation.",
};

export const footerSignature = {
  system: "Kinetic Editorial System",
  copyrightPrefix: "(c)",
  credit: profile.name,
};
