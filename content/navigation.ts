import { snowboardPage } from "./highlights";
import { mediaPage } from "./media";
import { aboutPage, homeHero } from "./profile";
import { workPage } from "./projects";
import { contactPage } from "./socials";
import { sportPage } from "./squashTitles";

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: homeHero.navLabel, href: "/" },
  { label: aboutPage.navLabel, href: "/about" },
  { label: sportPage.navLabel, href: "/sport" },
  { label: workPage.navLabel, href: "/work" },
  { label: snowboardPage.navLabel, href: "/snowboard" },
  { label: mediaPage.navLabel, href: "/media" },
  { label: contactPage.navLabel, href: "/contact" },
];
