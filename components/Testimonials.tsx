import TestimonialCard, { Testimonial } from "@/components/TestimonialCard";
import { createInitialsAvatar } from "@/lib/avatar";

const testimonials: Testimonial[] = [
  {
    quote: "Icarius brought clarity and pace to a complex HCM migration.",
    author: "CIO, FTSE250",
    role: "Global HR transformation lead",
    href: "/case-studies/hcm-migration",
    avatarSrc: createInitialsAvatar("CIO FTSE250"),
  },
  {
    quote: "The audit sprint gave us a pragmatic backlog we actually shipped.",
    author: "HR Director, Retail",
    role: "National retail group",
    href: "/case-studies/retail-audit-sprint",
    avatarSrc: createInitialsAvatar("HR Director Retail"),
  },
  {
    quote: "Our HR Ops assistant cut average handle time dramatically.",
    author: "Shared Services Lead",
    role: "Global HR operations",
    href: "/case-studies/hr-ops-assistant",
    avatarSrc: createInitialsAvatar("Shared Services Lead"),
  },
];

export default function Testimonials() {
  return (
    <section aria-labelledby="what-clients-say" className="mx-auto max-w-5xl px-4">
      <h2 id="what-clients-say" className="text-2xl font-semibold mb-4">
        What clients say
      </h2>
      <ul role="list" className="grid list-none gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <li key={testimonial.href ?? testimonial.author} className="h-full">
            <TestimonialCard {...testimonial} />
          </li>
        ))}
      </ul>
    </section>
  );
}
