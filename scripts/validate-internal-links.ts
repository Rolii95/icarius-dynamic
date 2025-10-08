import fs from "node:fs";
import path from "node:path";
import { CASE_STUDIES } from "@/app/work/case-studies";

const testimonialsFile = path.join(process.cwd(), "components", "Testimonials.tsx");
const src = fs.readFileSync(testimonialsFile, "utf8");

const hrefs = Array.from(src.matchAll(/href:\s*["'`](\/work\/[a-z0-9-]+)["'`]/g)).map((m) => m[1]);

const validSlugs = CASE_STUDIES.map(s => s.slug);
const unknown = hrefs.filter((href) => {
  const slug = href.split("/").pop()!;
  return !validSlugs.includes(slug);
});

if (unknown.length) {
  console.error("❌ Testimonials reference unknown slugs:", unknown.join(", "));
  process.exit(1);
}

const hasAppRouter = fs.existsSync(path.join(process.cwd(), "app"));
if (hasAppRouter) {
  const route = path.join(process.cwd(), "app", "work", "[slug]", "page.tsx");
  if (!fs.existsSync(route)) {
    console.error("❌ Missing app/work/[slug]/page.tsx");
    process.exit(1);
  }
} else {
  const route = path.join(process.cwd(), "pages", "work", "[slug].tsx");
  if (!fs.existsSync(route)) {
    console.error("❌ Missing pages/work/[slug].tsx");
    process.exit(1);
  }
}

console.log("✅ Testimonial link validation passed");
