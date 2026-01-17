import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import StatChip from "@/components/StatChip";
import RankingChart from "@/components/RankingChart";
import RankingTable from "@/components/RankingTable";
import { withBasePath } from "@/lib/assetPath";
import {
  challengerTitlesCount,
  sportMeta,
  sportPage,
  titleWins,
} from "../../../content/squashTitles";
import {
  bestRank,
  latestRanking,
  squashRanking,
} from "../../../content/squashRanking";

export const metadata: Metadata = {
  title: sportMeta.title,
  description: sportMeta.description,
  openGraph: {
    title: sportMeta.title,
    description: sportMeta.description,
    type: "website",
  },
};

export default function SportPage() {
  return (
    <>
      <Section
        id={sportPage.id}
        eyebrow={sportPage.eyebrow}
        title={sportPage.title}
        subtitle={sportPage.subtitle}
        className="pt-12"
        headerAside={
          <div className="mt-2 flex justify-end sm:mt-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-border bg-highlight sm:h-28 sm:w-28 lg:h-50 lg:w-50">
              <Image
                src={withBasePath(sportPage.heroImage.src)}
                alt={sportPage.heroImage.alt}
                fill
                sizes="(min-width: 1024px) 112px, (min-width: 640px) 96px, 80px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        }
      >
        <p className="text-lg text-muted">{sportPage.intro}</p>
      </Section>

      <Section
        id={`${sportPage.id}-titles`}
        eyebrow={sportPage.eyebrow}
        title={sportPage.titlesTitle}
        subtitle={sportPage.titlesSubtitle}
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <ol className="grid gap-5">
            {titleWins.map((title) => (
              <li
                key={`${title.tournament}-${title.year}`}
                className="border-l-2 border-accent pl-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-base font-semibold">{title.tournament}</p>
                  <span className="border border-accent px-2 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-accent">
                    {title.result}
                  </span>
                </div>
                <p className="text-sm text-muted">
                  {title.location} - {title.dates}
                </p>
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-4">
            <StatChip
              label={sportPage.titlesChipLabel}
              value={challengerTitlesCount}
            />
            <p className="text-sm text-muted">{sportPage.titlesNote}</p>
          </div>
        </div>
      </Section>

      <Section
        id={`${sportPage.id}-ranking`}
        eyebrow={sportPage.eyebrow}
        title={sportPage.rankingTitle}
        subtitle={sportPage.rankingSubtitle}
        className="border-b-0 pb-24"
      >
        <div className="grid gap-6">
          <div className="flex flex-wrap gap-3">
            <StatChip
              label={sportPage.rankingCalloutBest}
              value={bestRank}
            />
            <StatChip
              label={sportPage.rankingCalloutLatest}
              value={latestRanking.rank}
            />
          </div>

          <RankingChart
            data={squashRanking}
            bestRank={bestRank}
            ariaLabel={sportPage.rankingChartLabel}
          />

          <div className="grid gap-3">
            <h3 className="text-xl">{sportPage.rankingTableTitle}</h3>
            <p className="text-sm text-muted">
              {sportPage.rankingTableSubtitle}
            </p>
          </div>

          <RankingTable
            data={squashRanking}
            bestRank={bestRank}
            latestRank={latestRanking}
            labels={{
              searchLabel: sportPage.rankingTableSearchLabel,
              searchPlaceholder: sportPage.rankingTableSearchPlaceholder,
              jumpLabel: sportPage.rankingTableJumpLabel,
              jumpAll: sportPage.rankingTableJumpAll,
              empty: sportPage.rankingTableEmpty,
            }}
          />
        </div>
      </Section>
    </>
  );
}
