import type { Metadata } from "next";
import Section from "@/components/Section";
import MediaGallery from "@/components/MediaGallery";
import {
  media,
  mediaFilters,
  mediaMeta,
  mediaPage,
  mediaSections,
} from "../../../content/media";

export const metadata: Metadata = {
  title: mediaMeta.title,
  description: mediaMeta.description,
  openGraph: {
    title: mediaMeta.title,
    description: mediaMeta.description,
    type: "website",
  },
};

export default function MediaPage() {
  return (
    <>
      <Section
        id={mediaPage.id}
        eyebrow={mediaPage.eyebrow}
        title={mediaPage.title}
        subtitle={mediaPage.subtitle}
        className="pt-12"
      >
        <p className="text-lg text-muted">{mediaPage.intro}</p>
      </Section>

      <Section
        id={`${mediaPage.id}-gallery`}
        eyebrow={mediaPage.eyebrow}
        title={mediaPage.galleryTitle}
        subtitle={mediaPage.gallerySubtitle}
        className="border-b-0 pb-24"
      >
        <MediaGallery
          items={media}
          videoFallback={mediaPage.videoFallback}
          filters={mediaFilters}
          sections={mediaSections}
          filterLabel={mediaPage.filterLabel}
        />
      </Section>
    </>
  );
}
