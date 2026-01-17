import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import StatChip from "@/components/StatChip";
import { withBasePath } from "@/lib/assetPath";
import {
  featuredHighlights,
  featuredSection,
} from "../../content/highlights";
import {
  homeBridge,
  homeCta,
  homeHero,
  homeMeta,
  homeStats,
  profile,
} from "../../content/profile";
import { bestRank, latestRanking } from "../../content/squashRanking";
import { challengerTitlesCount } from "../../content/squashTitles";

export const metadata: Metadata = {
  title: homeMeta.title,
  description: homeMeta.description,
  openGraph: {
    title: homeMeta.title,
    description: homeMeta.description,
    type: "website",
  },
};

type HomeStatId = (typeof homeStats)[number]["id"];

const homeStatValues: Record<HomeStatId, number> = {
  psaBest: bestRank,
  latestRank: latestRanking.rank,
  challengerTitles: challengerTitlesCount,
};

export default function Home() {
  return (
    <>
      <Section
        id={homeHero.id}
        eyebrow={homeHero.eyebrow}
        title={homeHero.title}
        subtitle={homeHero.subtitle}
        className="pt-12"
        headerClassName="items-start"
        headerAside={
          <div className="mt-2 flex justify-end sm:mt-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border bg-highlight sm:h-240 sm:w-24 lg:h-50 lg:w-50">
              <Image
                src={withBasePath(profile.heroImageSrc)}
                alt={profile.heroImageAlt}
                fill
                sizes="(min-width: 1024px) 112px, (min-width: 640px) 96px, 80px"
                className="object-cover object-[center_top]"
                quality={90}
                priority
              />
            </div>
          </div>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-end">
          <div className="flex flex-col gap-6">
            <p className="text-lg text-muted">{homeHero.lead}</p>
            <div className="flex flex-wrap gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-muted">
              {profile.roles.map((role) => (
                <span
                  key={role}
                  className="border border-border px-3 py-2 font-mono"
                >
                  {role}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://motiondynamics.ai/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border border-border px-4 py-2 text-xs uppercase tracking-[0.3em] text-foreground no-underline transition-colors hover:border-accent hover:text-accent"
              >
                Motion Dynamics
              </a>
              <a
                href="https://motiondynamics.ai/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border border-border px-4 py-2 text-xs uppercase tracking-[0.3em] text-foreground no-underline transition-colors hover:border-accent hover:text-accent"
              >
                Visit the Platform
              </a>
            </div>
          </div>
          <div className="flex w-full flex-wrap justify-start gap-3 lg:w-fit lg:justify-self-start">
            {homeStats.map((stat) => (
              <StatChip
                key={stat.id}
                label={stat.label}
                value={homeStatValues[stat.id]}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section
        id={homeBridge.id}
        eyebrow={homeBridge.eyebrow}
        title={homeBridge.title}
        subtitle={homeBridge.subtitle}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {homeBridge.pillars.map((pillar) => (
            <article
              key={pillar.label}
              className="border-l-2 border-accent pl-4"
            >
              <h3 className="text-xl">{pillar.label}</h3>
              <p className="text-sm text-muted">{pillar.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id={featuredSection.id}
        eyebrow={featuredSection.eyebrow}
        title={featuredSection.title}
        subtitle={featuredSection.subtitle}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {featuredHighlights.map((highlight) => (
            <article
              key={highlight.id}
              className="border border-border px-5 py-4"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-muted">
                {highlight.area}
              </p>
              <h3 className="mt-3 text-xl">{highlight.title}</h3>
              {highlight.meta ? (
                <p className="text-sm text-muted">{highlight.meta}</p>
              ) : null}
              {highlight.description ? (
                <p className="mt-3 text-sm text-muted">
                  {highlight.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </Section>

      <Section
        id={homeCta.id}
        eyebrow={homeCta.eyebrow}
        title={homeCta.title}
        subtitle={homeCta.subtitle}
        className="border-b-0 pb-24"
      >
        <div className="flex flex-col gap-6 text-lg text-muted">
          <p>{homeCta.body}</p>
          <Link
            href={homeCta.action.href}
            className="inline-flex w-fit items-center border border-border px-4 py-2 text-xs uppercase tracking-[0.3em] text-foreground no-underline transition-colors hover:border-accent hover:text-accent"
          >
            {homeCta.action.label}
          </Link>
        </div>
      </Section>
    </>
  );
}
