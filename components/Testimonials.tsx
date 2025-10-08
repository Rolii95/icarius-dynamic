import TestimonialCard, { Testimonial } from "@/components/TestimonialCard";
import { CASE_STUDIES } from "@/data/caseStudies";

const testimonials: Testimonial[] = [
  {
    quote: "Icarius brought clarity and pace to a complex HCM migration.",
    author: "CIO, FTSE250",
    role: "Global HR transformation lead",
    href: "/case-studies/hcm-migration",
    avatarSrc: "/img/testimonials/cio-ftse250",
  },
  {
    quote: "The audit sprint gave us a pragmatic backlog we actually shipped.",
    author: "HR Director, Retail",
    role: "National retail group",
    href: "/case-studies/retail-audit-sprint",
    avatarSrc: "/img/testimonials/hr-director-retail",
  },
  {
    quote: "Our HR Ops assistant cut average handle time dramatically.",
    author: "Shared Services Lead",
    role: "Global HR operations",
    href: "/case-studies/hr-ops-assistant",
    avatarSrc: "/img/testimonials/shared-services-lead",
  },
];

export default function Testimonials() {
  if (process.env.NODE_ENV !== "production") {
    for (const t of testimonials) {
      const slug = t.href?.split("/").pop() ?? "";
      if (!(slug in CASE_STUDIES)) {
        // eslint-disable-next-line no-console
        console.warn(`[Testimonials] Unknown case study slug in href: ${t.href}`);
      }
    }
  }

  return (
    <section aria-labelledby="what-clients-say" className="mx-auto max-w-5xl px-4">
      <h2 id="what-clients-say" className="text-2xl font-semibold mb-4">What clients say</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t.href ?? t.author} {...t} />
        ))}
      </div>
    </section>
  );
}
