import type { Metadata } from "next";
import Image from "next/image";
import DynamicPageSections from "@/components/DynamicPageSections";
import Section from "@/components/Section";
import { withBasePath } from "@/lib/assetPath";
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
            className="flex items-center justify-end transition-opacity hover:opacity-80"
          >
            <Image
              src={withBasePath(workPage.companyLogoSrc)}
              alt={workPage.companyLogoAlt}
              width={420}
              height={126}
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 260px, 220px"
              className="h-16 w-auto object-contain sm:h-40 lg:h-36"
            />
          </a>
        }
        headerClassName="items-center"
      >
        <p className="text-lg text-muted">{workPage.intro}</p>
      </Section>

      <DynamicPageSections page="work" eyebrow={workPage.eyebrow} />

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
