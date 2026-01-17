type StatChipProps = {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
};

export default function StatChip({
  label,
  value,
  unit,
  className,
}: StatChipProps) {
  const chipClasses = [
    "inline-flex items-center gap-3 border border-border bg-highlight px-3 py-2 text-xs uppercase tracking-[0.3em] text-muted",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={chipClasses}>
      <span className="flex h-2 w-2 items-center justify-center border border-accent" aria-hidden="true">
        <span className="h-1 w-1 bg-accent" />
      </span>
      <span className="font-mono">{label}</span>
      <span className="text-sm font-semibold tracking-normal text-foreground">
        {value}
        {unit ? (
          <span className="ml-2 text-[0.65rem] uppercase tracking-[0.2em] text-muted">
            {unit}
          </span>
        ) : null}
      </span>
    </div>
  );
}
