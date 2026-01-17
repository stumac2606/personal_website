import type { Metadata } from "next";
import Section from "@/components/Section";
import {
  snowboardMeta,
  snowboardPage,
  snowboardQualifications,
} from "../../../content/highlights";
import { mediaPage, snowboardClips } from "../../../content/media";

export const metadata: Metadata = {
  title: snowboardMeta.title,
  description: snowboardMeta.description,
  openGraph: {
    title: snowboardMeta.title,
    description: snowboardMeta.description,
    type: "website",
  },
};

export default function SnowboardPage() {
  return (
    <>
      <Section
        id={snowboardPage.id}
        eyebrow={snowboardPage.eyebrow}
        title={snowboardPage.title}
        subtitle={snowboardPage.subtitle}
        className="pt-12"
      >
        <p className="text-lg text-muted">{snowboardPage.intro}</p>
      </Section>

      <Section
        id={`${snowboardPage.id}-quals`}
        eyebrow={snowboardPage.eyebrow}
        title={snowboardPage.qualificationsTitle}
        subtitle={snowboardPage.qualificationsSubtitle}
      >
        <ul className="grid gap-4 text-sm text-muted">
          {snowboardQualifications.map((highlight) => (
            <li key={highlight.id} className="border-l-2 border-accent pl-4">
              <h3 className="text-xl">{highlight.title}</h3>
              {highlight.description ? (
                <p className="text-sm text-muted">{highlight.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id={`${snowboardPage.id}-clips`}
        eyebrow={snowboardPage.eyebrow}
        title={snowboardPage.clipsTitle}
        subtitle={snowboardPage.clipsSubtitle}
        className="border-b-0 pb-24"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {snowboardClips.slice(0, 2).map((clip) => (
            <figure key={clip.id} className="grid gap-3">
              <div className="relative aspect-[16/9] w-full border border-border bg-highlight">
                <video
                  className="h-full w-full object-contain"
                  controls
                  preload="metadata"
                  playsInline
                >
                  <source src={clip.src} />
                  {mediaPage.videoFallback}
                </video>
              </div>
              {clip.caption ? (
                <figcaption className="text-sm text-muted">
                  {clip.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </Section>
    </>
  );
}
