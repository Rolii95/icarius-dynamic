import fs from "node:fs";
import path from "node:path";
import { CASE_STUDIES } from "@/data/caseStudies";

const testimonialsFile = path.join(process.cwd(), "components", "Testimonials.tsx");
const src = fs.readFileSync(testimonialsFile, "utf8");

const hrefs = Array.from(src.matchAll(/href:\s*["'`](\/case-studies\/[a-z0-9-]+)["'`]/g)).map((m) => m[1]);

const unknown = hrefs.filter((href) => !(href.split("/").pop()! in CASE_STUDIES));
if (unknown.length) {
  console.error("❌ Testimonials reference unknown slugs:", unknown.join(", "));
  process.exit(1);
}

const hasAppRouter = fs.existsSync(path.join(process.cwd(), "app"));
if (hasAppRouter) {
  const route = path.join(process.cwd(), "app", "case-studies", "[slug]", "page.tsx");
  if (!fs.existsSync(route)) {
    console.error("❌ Missing app/case-studies/[slug]/page.tsx");
    process.exit(1);
  }
} else {
  const route = path.join(process.cwd(), "pages", "case-studies", "[slug].tsx");
  if (!fs.existsSync(route)) {
    console.error("❌ Missing pages/case-studies/[slug].tsx");
    process.exit(1);
  }
}

console.log("✅ Testimonial link validation passed");
