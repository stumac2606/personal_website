import type { Metadata } from "next";
import Section from "@/components/Section";
import { aboutMeta, aboutPage } from "../../../content/profile";
import { timeline, timelineSection } from "../../../content/timeline";

export const metadata: Metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
  openGraph: {
    title: aboutMeta.title,
    description: aboutMeta.description,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <Section
        id={aboutPage.id}
        eyebrow={aboutPage.eyebrow}
        title={aboutPage.title}
        subtitle={aboutPage.subtitle}
        className="pt-12"
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          {aboutPage.story.map((paragraph) => (
            <p key={paragraph} className="text-lg text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section
        id={timelineSection.id}
        eyebrow={timelineSection.eyebrow}
        title={timelineSection.title}
        subtitle={timelineSection.subtitle}
        className="border-b-0 pb-24"
      >
        <ol className="grid gap-6">
          {timeline.map((item) => (
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
      </Section>
    </>
  );
}
