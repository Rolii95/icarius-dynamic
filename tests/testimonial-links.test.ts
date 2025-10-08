import { describe, it, expect } from "vitest";
import { CASE_STUDIES } from "../app/work/case-studies";
import fs from "node:fs";
import path from "node:path";

// Manually extract testimonial data to avoid importing React components
const testimonialsData = [
  {
    quote: "Icarius brought clarity and pace to a complex HCM migration.",
    href: "/work/global-hcm-replacement",
  },
  {
    quote: "The audit sprint gave us a pragmatic backlog we actually shipped.",
    href: "/work/payroll-consolidation",
  },
  {
    quote: "Our HR Ops assistant cut average handle time dramatically.",
    href: "/work/hr-ops-ai-assistant",
  },
];

describe("Testimonial Links Validation", () => {
  const validSlugs = CASE_STUDIES.map((s) => s.slug);

  it("should have testimonials with valid href paths", () => {
    testimonialsData.forEach((testimonial) => {
      expect(testimonial.href).toBeDefined();
      expect(testimonial.href).toMatch(/^\/work\/[a-z0-9-]+$/);
    });
  });

  it("should link to existing case studies", () => {
    testimonialsData.forEach((testimonial) => {
      const slug = testimonial.href.split("/").pop()!;
      expect(validSlugs).toContain(slug);
    });
  });

  it("should match testimonial quotes with case study testimonials", () => {
    testimonialsData.forEach((testimonial) => {
      const slug = testimonial.href.split("/").pop()!;
      const caseStudy = CASE_STUDIES.find((s) => s.slug === slug);

      expect(caseStudy).toBeDefined();
      expect(caseStudy?.testimonial).toBeDefined();
      expect(caseStudy?.testimonial?.quote).toBe(testimonial.quote);
    });
  });

  it("should have all case studies with testimonials represented", () => {
    const caseStudiesWithTestimonials = CASE_STUDIES.filter((s) => s.testimonial);
    const testimonialHrefs = testimonialsData.map((t) => t.href);

    caseStudiesWithTestimonials.forEach((caseStudy) => {
      const expectedHref = `/work/${caseStudy.slug}`;
      expect(testimonialHrefs).toContain(expectedHref);
    });
  });

  it("should not reference old /case-studies/ paths", () => {
    testimonialsData.forEach((testimonial) => {
      expect(testimonial.href).not.toMatch(/^\/case-studies\//);
    });
  });

  it("should have matching links in homepage testimonials", () => {
    const homepageFile = path.join(process.cwd(), "app", "page.tsx");
    const content = fs.readFileSync(homepageFile, "utf8");
    
    // Extract hrefs from homepage testimonials section
    const homepageHrefs = Array.from(
      content.matchAll(/href="(\/work\/[a-z0-9-]+)">View full case study/g)
    ).map((m) => m[1]);

    // Verify all homepage hrefs are valid
    homepageHrefs.forEach((href) => {
      const slug = href.split("/").pop()!;
      expect(validSlugs).toContain(slug);
    });

    // Verify we have the expected testimonials on homepage
    expect(homepageHrefs).toContain("/work/global-hcm-replacement");
    expect(homepageHrefs).toContain("/work/payroll-consolidation");
    expect(homepageHrefs).toContain("/work/hr-ops-ai-assistant");
  });
});
