import { footerSignature, socials } from "../../content/socials";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center gap-4 text-[0.7rem] uppercase tracking-[0.32em] text-muted">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="no-underline transition-colors hover:text-foreground"
            >
              {social.label}
            </a>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-muted">
          <span className="font-mono">{footerSignature.system}</span>
          <span>
            {footerSignature.copyrightPrefix} {year} {footerSignature.credit}
          </span>
        </div>
      </div>
    </footer>
  );
}
