import type { Metadata } from "next";
import Section from "@/components/Section";
import {
  contactMeta,
  contactPage,
  socials,
} from "../../../content/socials";

export const metadata: Metadata = {
  title: contactMeta.title,
  description: contactMeta.description,
  openGraph: {
    title: contactMeta.title,
    description: contactMeta.description,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <Section
        id={contactPage.id}
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        subtitle={contactPage.subtitle}
        className="pt-12 border-b-0 pb-24"
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <p className="text-lg text-muted">{contactPage.body}</p>
          <div className="grid gap-4 text-sm text-muted">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted">
                {contactPage.emailLabel}
              </p>
              <a
                href={`mailto:${contactPage.email}`}
                className="text-base text-foreground"
              >
                {contactPage.email}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted">
                {contactPage.socialsLabel}
              </p>
              <div className="mt-2 flex flex-wrap gap-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-sm uppercase tracking-[0.3em] text-muted no-underline transition-colors hover:text-foreground"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
