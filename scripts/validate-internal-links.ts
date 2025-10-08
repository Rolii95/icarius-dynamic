import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const appDir = path.join(root, "app");

// Mirror the testimonial hrefs here (source of truth for CI)
const testimonialLinks = [
  "/case-studies/hcm-migration",
  "/case-studies/retail-audit-sprint",
  "/case-studies/hr-ops-assistant",
];

const missing: string[] = [];

for (const href of testimonialLinks) {
  const parts = href.replace(/^\//, "").split("/");
  const pagePathTSX = path.join(appDir, ...parts, "page.tsx");
  const pagePathJSX = path.join(appDir, ...parts, "page.jsx");
  if (!fs.existsSync(pagePathTSX) && !fs.existsSync(pagePathJSX)) {
    missing.push(href);
  }
}

if (missing.length) {
  console.error(
    "Broken internal testimonial links (no page.tsx found):",
    missing.join(", ")
  );
  process.exit(1);
} else {
  console.log("All testimonial links resolve to pages.");
}
