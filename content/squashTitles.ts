export type TitleWin = {
  tournament: string;
  location: string;
  dates: string;
  result: "Champion";
  year: number;
};

export const titleWins: TitleWin[] = [
  {
    tournament: "Guilfoyle PSA Squash Classic",
    location: "Toronto, Canada",
    dates: "Feb 27 - Mar 02, 2024",
    result: "Champion",
    year: 2024,
  },
  {
    tournament: "Oban Open",
    location: "Oban, Scotland",
    dates: "Oct 27 - Oct 29, 2023",
    result: "Champion",
    year: 2023,
  },
  {
    tournament: "NM Academy Open",
    location: "Sheffield, England",
    dates: "Aug 20 - Aug 22, 2021",
    result: "Champion",
    year: 2021,
  },
];

export const challengerTitlesCount = 3;

export const sportPage = {
  id: "sport",
  navLabel: "Sport",
  eyebrow: "Sport",
  title: "Professional Squash",
  subtitle: "Ranking progression, tour results, and a training-first mindset.",
  intro:
    "Every result is a data point. Every training block is a hypothesis tested under pressure.",
  heroImage: {
    src: "/media/images/Squash1.jpg",
    alt: "Stuart MacGregor with squash racquet, studio portrait",
  },
  titlesTitle: "Titles",
  titlesSubtitle: "PSA results and Challenger circuit wins.",
  titlesNote:
    "Challenger titles show consistency - winning across multiple locations and conditions.",
  titlesChipLabel: "Challenger Titles",
  rankingTitle: "Ranking History",
  rankingSubtitle: "Career trajectory from early tour years to current form.",
  rankingCalloutBest: "Best Rank",
  rankingCalloutLatest: "Latest Rank",
  rankingTableTitle: "Full Career Table",
  rankingTableSubtitle:
    "Search the full PSA ranking history or jump to a specific year.",
  rankingChartLabel:
    "Ranking history chart. Lower ranks appear higher on the chart.",
  rankingTableSearchLabel: "Search",
  rankingTableSearchPlaceholder: "Search date, year, or rank",
  rankingTableJumpLabel: "Jump to year",
  rankingTableJumpAll: "All years",
  rankingTableEmpty: "No rankings match that search.",
};

export const sportMeta = {
  title: "Stuart MacGregor - Sport",
  description:
    "Professional squash highlights, title history, and full PSA ranking trajectory.",
};
