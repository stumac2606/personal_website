type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAside?: React.ReactNode;
  headerClassName?: string;
};

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
  headerAside,
  headerClassName,
}: SectionProps) {
  const sectionClasses = [
    "scroll-mt-24 border-b border-border py-16 sm:py-20 lg:py-24",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const hasHeader = eyebrow || title || subtitle;

  const headerContent = (
    <>
      {eyebrow ? (
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-muted">
          <span className="h-[1px] w-10 bg-accent" aria-hidden="true" />
          <span className="font-mono">{eyebrow}</span>
        </div>
      ) : null}
      {title ? <h2 className="text-foreground">{title}</h2> : null}
      {subtitle ? (
        <p className="max-w-2xl text-lg text-muted">{subtitle}</p>
      ) : null}
    </>
  );

  return (
    <section id={id} className={sectionClasses}>
      {hasHeader ? (
        headerAside ? (
          <header
            className={`mb-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end ${
              headerClassName ?? ""
            }`}
          >
            <div className="flex flex-col gap-3">{headerContent}</div>
            <div className="justify-self-end">{headerAside}</div>
          </header>
        ) : (
          <header
            className={`mb-8 flex flex-col gap-3 ${
              headerClassName ?? ""
            }`}
          >
            {headerContent}
          </header>
        )
      ) : null}
      <div className="grid gap-6">{children}</div>
    </section>
  );
}
