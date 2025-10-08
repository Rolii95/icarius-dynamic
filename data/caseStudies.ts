export const CASE_STUDIES = {
  "hcm-migration": {
    title: "Global HCM migration",
    excerpt:
      "How Icarius unified regional HR stacks and delivered a roadmap for a single global HCM platform.",
  },
  "retail-audit-sprint": {
    title: "Retail audit sprint",
    excerpt:
      "A four-week discovery that prioritised the fixes a national retailer needed to stabilise store operations.",
  },
  "hr-ops-assistant": {
    title: "HR operations AI assistant",
    excerpt:
      "The guardrails and knowledge refresh that helped an HR shared services team cut average handle time.",
  },
} as const;

export type CaseStudies = typeof CASE_STUDIES;
export type CaseStudySlug = keyof CaseStudies;
