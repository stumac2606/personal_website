import Section from "@/components/Section";
import MediaGallery from "@/components/MediaGallery";
import { dynamicPageSections, type DynamicPageKey } from "../../content/pageSections";
import { highlights } from "../../content/highlights";
import {
  buildMediaFilters,
  media,
  mediaPage,
  mediaSections,
} from "../../content/media";
import { timeline } from "../../content/timeline";

type DynamicPageSectionsProps = {
  page: DynamicPageKey;
  eyebrow: string;
};

export default function DynamicPageSections({
  page,
  eyebrow,
}: DynamicPageSectionsProps) {
  const discoveredSections = new Map(
    dynamicPageSections
      .filter((section) => section.page === page)
      .map((section) => [section.key, section]),
  );

  for (const item of [...highlights, ...media, ...timeline]) {
    if (
      item.pageKey !== page ||
      !item.pageSectionKey ||
      discoveredSections.has(item.pageSectionKey)
    ) {
      continue;
    }

    discoveredSections.set(item.pageSectionKey, {
      page,
      key: item.pageSectionKey,
      title: item.pageSectionTitle || humanizeSectionKey(item.pageSectionKey),
      intro: item.pageSectionIntro,
      order: 90,
    });
  }

  const sections = [...discoveredSections.values()]
    .map((section) => {
      const sectionHighlights = highlights.filter(
        (item) => item.pageKey === page && item.pageSectionKey === section.key,
      );
      const sectionMedia = media.filter(
        (item) => item.pageKey === page && item.pageSectionKey === section.key,
      );
      const sectionTimeline = timeline.filter(
        (item) => item.pageKey === page && item.pageSectionKey === section.key,
      );
      const sectionMediaNames = [...new Set(sectionMedia.map((item) => item.section))];
      const sectionMediaSections = mediaSections.filter((item) =>
        sectionMediaNames.includes(item.name),
      );

      return {
        ...section,
        title:
          section.title ||
          sectionHighlights[0]?.pageSectionTitle ||
          sectionMedia[0]?.pageSectionTitle ||
          sectionTimeline[0]?.pageSectionTitle ||
          humanizeSectionKey(section.key),
        intro:
          section.intro ||
          sectionHighlights[0]?.pageSectionIntro ||
          sectionMedia[0]?.pageSectionIntro ||
          sectionTimeline[0]?.pageSectionIntro,
        highlights: sectionHighlights,
        media: sectionMedia,
        timeline: sectionTimeline,
        mediaSections: sectionMediaSections,
        mediaFilters: buildMediaFilters(sectionMediaSections),
      };
    })
    .filter(
      (section) =>
        section.highlights.length > 0 ||
        section.media.length > 0 ||
        section.timeline.length > 0,
    )
    .sort((left, right) => left.order - right.order);

  if (sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section) => (
        <Section
          key={`${page}-${section.key}`}
          id={`${page}-${section.key}`}
          eyebrow={eyebrow}
          title={section.title}
          subtitle={section.intro}
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

            {section.timeline.length > 0 ? (
              <ol className="grid gap-6">
                {section.timeline.map((item) => (
                  <li
                    key={`${item.year}-${item.title}`}
                    className="border-l-2 border-border pl-4"
                  >
                    <div className="flex flex-wrap items-baseline gap-3 text-xs uppercase tracking-[0.32em] text-muted">
                      <span>{item.year}</span>
                      <span className="font-mono">{item.area}</span>
                    </div>
                    <h3 className="mt-3 text-xl">{item.title}</h3>
                    {item.meta ? (
                      <p className="text-sm text-muted">{item.meta}</p>
                    ) : null}
                    {item.description ? (
                      <p className="text-sm text-muted">{item.description}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
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
    </>
  );
}

function humanizeSectionKey(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
