"use client";

import { useMemo, useRef, useState } from "react";
import type { RankingPoint } from "../../content/squashRanking";

type RankingTableProps = {
  data: RankingPoint[];
  bestRank: number;
  latestRank: RankingPoint;
  labels: {
    searchLabel: string;
    searchPlaceholder: string;
    jumpLabel: string;
    jumpAll: string;
    empty: string;
  };
};

const getYear = (date: string) => date.slice(0, 4);

export default function RankingTable({
  data,
  bestRank,
  latestRank,
  labels,
}: RankingTableProps) {
  const [query, setQuery] = useState("");
  const [jumpYear, setJumpYear] = useState("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const years = useMemo(() => {
    const set = new Set(data.map((point) => getYear(point.date)));
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [data]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return data;
    }

    return data.filter((point) => {
      const year = getYear(point.date);
      const rank = String(point.rank);
      return (
        point.date.includes(needle) ||
        year.includes(needle) ||
        rank.includes(needle)
      );
    });
  }, [data, query]);

  const handleJump = (value: string) => {
    setJumpYear(value);
    if (value === "all") {
      return;
    }

    const target = containerRef.current?.querySelector(
      `[data-year-start="${value}"]`,
    );
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  let previousYear = "";
  let groupIndex = -1;

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-[1.2fr,0.8fr]">
        <label className="grid gap-2 text-xs uppercase tracking-[0.32em] text-muted">
          {labels.searchLabel}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground"
            aria-label="Search ranking history"
          />
        </label>
        <label className="grid gap-2 text-xs uppercase tracking-[0.32em] text-muted">
          {labels.jumpLabel}
          <select
            value={jumpYear}
            onChange={(event) => handleJump(event.target.value)}
            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground"
            aria-label="Jump to year in ranking table"
          >
            <option value="all">{labels.jumpAll}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        ref={containerRef}
        className="max-h-[520px] overflow-auto border border-border"
      >
        <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-background text-xs uppercase tracking-[0.32em] text-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Year</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Rank</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-sm text-muted"
                >
                  {labels.empty}
                </td>
              </tr>
            ) : (
              filtered.map((point) => {
                const year = getYear(point.date);
                const isYearStart = year !== previousYear;
                if (isYearStart) {
                  previousYear = year;
                  groupIndex += 1;
                }
                const isBest = point.rank === bestRank;
                const isLatest = point.date === latestRank.date;
                const rowTone = groupIndex % 2 === 0 ? "bg-highlight/20" : "";

                return (
                  <tr
                    key={point.date}
                    data-year-start={isYearStart ? year : undefined}
                    className={`${rowTone} ${
                      isYearStart ? "border-t border-border" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-xs uppercase tracking-[0.32em] text-muted">
                      {isYearStart ? year : ""}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted">
                      {point.date}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono ${
                        isBest || isLatest
                          ? "text-foreground"
                          : "text-muted"
                      }`}
                    >
                      {point.rank}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
