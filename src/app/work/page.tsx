import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import { withBasePath } from "@/lib/assetPath";
import { motionHighlights } from "../../../content/highlights";
import { workMeta, workPage } from "../../../content/projects";

export const metadata: Metadata = {
  title: workMeta.title,
  description: workMeta.description,
  openGraph: {
    title: workMeta.title,
    description: workMeta.description,
    type: "website",
  },
};

export default function WorkPage() {
  return (
    <>
      <Section
        id={workPage.id}
        eyebrow={workPage.eyebrow}
        title={workPage.title}
        subtitle={workPage.subtitle}
        className="pt-12"
        headerAside={
          <a
            href="https://motiondynamics.ai/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-end border border-border bg-highlight px-5 py-4 transition-colors hover:border-accent"
          >
            <Image
              src={withBasePath(workPage.companyLogoSrc)}
              alt={workPage.companyLogoAlt}
              width={320}
              height={96}
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 220px, 180px"
              className="h-14 w-auto object-contain sm:h-16 lg:h-20"
            />
          </a>
        }
        headerClassName="items-center"
      >
        <p className="text-lg text-muted">{workPage.intro}</p>
      </Section>

      <Section
        id={`${workPage.id}-highlights`}
        eyebrow={workPage.eyebrow}
        title={workPage.highlightsTitle}
        subtitle={workPage.highlightsSubtitle}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {motionHighlights.map((highlight) => (
            <article
              key={highlight.id}
              className="border-l-2 border-accent pl-4"
            >
              <h3 className="text-xl">{highlight.title}</h3>
              {highlight.description ? (
                <p className="text-sm text-muted">{highlight.description}</p>
              ) : null}
              {highlight.meta ? (
                <p className="text-sm text-muted">{highlight.meta}</p>
              ) : null}
            </article>
          ))}
        </div>
      </Section>

      <Section
        id={`${workPage.id}-quote`}
        eyebrow={workPage.quote.eyebrow}
        title={workPage.quote.title}
        subtitle={workPage.quote.attribution}
      >
        <blockquote className="border-l-2 border-border pl-4 text-lg text-muted">
          {workPage.quote.text}
        </blockquote>
      </Section>

      <Section
        id={`${workPage.id}-pipeline`}
        eyebrow={workPage.eyebrow}
        title={workPage.pipelineTitle}
        subtitle={workPage.pipelineSubtitle}
        className="border-b-0 pb-24"
      >
        <ol className="grid gap-4 text-sm text-muted">
          {workPage.pipelineSteps.map((step) => (
            <li key={step} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 bg-accent" aria-hidden="true" />
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
