import type { RankingPoint } from "../../content/squashRanking";

type RankingChartProps = {
  data: RankingPoint[];
  bestRank: number;
  ariaLabel: string;
};

const width = 1000;
const height = 280;
const padding = {
  top: 24,
  right: 24,
  bottom: 32,
  left: 48,
};

const getYear = (date: string) => date.slice(0, 4);

export default function RankingChart({
  data,
  bestRank,
  ariaLabel,
}: RankingChartProps) {
  if (data.length < 2) {
    return null;
  }

  const ranks = data.map((point) => point.rank);
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  const span = Math.max(maxRank - minRank, 1);
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const step = innerWidth / (data.length - 1);

  const points = data.map((point, index) => {
    const x = padding.left + step * index;
    const y =
      padding.top + ((point.rank - minRank) / span) * innerHeight;
    return { x, y, ...point };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");

  const firstYear = getYear(data[0].date);
  const lastYear = getYear(data[data.length - 1].date);
  const bestRankY =
    padding.top + ((bestRank - minRank) / span) * innerHeight;

  return (
    <div className="border border-border bg-background p-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={ariaLabel}
        className="h-64 w-full"
      >
        <line
          x1={padding.left}
          y1={bestRankY}
          x2={width - padding.right}
          y2={bestRankY}
          stroke="var(--accent)"
          strokeOpacity={0.5}
          strokeDasharray="6 6"
        />
        <path
          d={linePath}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={2}
        />
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={5}
          fill="var(--accent)"
        />
        <text
          x={padding.left}
          y={height - padding.bottom + 18}
          fill="var(--muted)"
          fontSize="12"
          fontFamily="var(--font-mono)"
        >
          {firstYear}
        </text>
        <text
          x={width - padding.right}
          y={height - padding.bottom + 18}
          fill="var(--muted)"
          fontSize="12"
          fontFamily="var(--font-mono)"
          textAnchor="end"
        >
          {lastYear}
        </text>
      </svg>
    </div>
  );
}
