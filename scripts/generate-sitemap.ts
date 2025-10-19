import fs from "node:fs";
import path from "node:path";
import { CASE_STUDIES } from "@/data/caseStudies";

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  "https://www.icarius-consulting.com"
).replace(/\/$/, "");

const resourcesPaths = ["/resources/white-paper"];
const staticPaths = ["/", "/about", "/contact", "/services", "/case-studies"];
const caseStudyPaths = Object.keys(CASE_STUDIES).map((slug) => `/case-studies/${slug}`);
const allPaths = [...staticPaths, ...resourcesPaths, ...caseStudyPaths];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
  .map(
    (p) => `
  <url>
    <loc>${BASE_URL}${p}</loc>
    <changefreq>monthly</changefreq>
    <priority>${p === "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("")}
</urlset>`.trim();

const outPath = path.join(process.cwd(), "public", "sitemap.xml");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${xml}\n`);
console.log("✅ sitemap.xml written:", outPath);
