import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import MediaGallery from "@/components/MediaGallery";
import { withBasePath } from "@/lib/assetPath";
import { highlights } from "../../../content/highlights";
import { media, mediaPage, mediaSections } from "../../../content/media";
import { workMeta, workPage, workSections } from "../../../content/projects";

export const metadata: Metadata = {
  title: workMeta.title,
  description: workMeta.description,
  openGraph: {
    title: workMeta.title,
    description: workMeta.description,
    type: "website",
  },
};

const resolveHighlightWorkSection = (item: (typeof highlights)[number]) => {
  return item.workSection ?? (item.area === "Motion Dynamics" ? "motion-dynamics" : null);
};

const resolveMediaWorkSection = (item: (typeof media)[number]) => {
  return item.workSection ?? (item.section === "Tech" ? "motion-dynamics" : null);
};

export default function WorkPage() {
  const renderedSections = workSections
    .map((section) => {
      const sectionHighlights = highlights.filter(
        (item) => resolveHighlightWorkSection(item) === section.key,
      );
      const sectionMedia = media.filter(
        (item) => resolveMediaWorkSection(item) === section.key,
      );
      const sectionMediaNames = [...new Set(sectionMedia.map((item) => item.section))];
      const sectionMediaSections = mediaSections.filter((item) =>
        sectionMediaNames.includes(item.name),
      );

      return {
        ...section,
        highlights: sectionHighlights,
        media: sectionMedia,
        mediaSections: sectionMediaSections,
        mediaFilters: sectionMediaNames.map((name) => ({
          id: `${section.key}-${name.toLowerCase().replace(/\s+/g, "-")}`,
          label: name,
          sections: [name],
        })),
      };
    })
    .filter((section) => section.highlights.length > 0 || section.media.length > 0)
    .sort((left, right) => left.order - right.order);

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

      {renderedSections.map((section) => (
        <Section
          key={section.key}
          id={`${workPage.id}-${section.key}`}
          eyebrow={workPage.eyebrow}
          title={section.title}
          subtitle={section.intro ?? workPage.highlightsSubtitle}
        >
          <div className="grid gap-10">
            {section.highlights.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {section.highlights.map((highlight) => (
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
            ) : null}

            {section.media.length > 0 ? (
              <MediaGallery
                items={section.media}
                sections={section.mediaSections}
                filters={section.mediaFilters}
                filterLabel={mediaPage.filterLabel}
                videoFallback={mediaPage.videoFallback}
              />
            ) : null}
          </div>
        </Section>
      ))}

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
