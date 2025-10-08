import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const appDir = path.join(rootDir, "app");

const testimonialLinks = [
  "/case-studies/hcm-migration",
  "/case-studies/retail-audit-sprint",
  "/case-studies/hr-ops-assistant",
];

const pageFileNames = [
  "page.tsx",
  "page.ts",
  "page.jsx",
  "page.js",
  "page.mdx",
  "page.md",
];

function hasPageFile(dir: string) {
  return pageFileNames.some((file) =>
    fs.existsSync(path.join(dir, file))
  );
}

function listDirEntries(dir: string) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    return [];
  }
}

function findRoute(dir: string, segments: string[]): boolean {
  const entries = listDirEntries(dir);

  // Allow traversing through route groups, e.g. (marketing)
  for (const entry of entries) {
    if (entry.isDirectory() && /^\(.+\)$/.test(entry.name)) {
      if (findRoute(path.join(dir, entry.name), segments)) {
        return true;
      }
    }
  }

  if (segments.length === 0) {
    return hasPageFile(dir);
  }

  const [current, ...rest] = segments;

  // Exact segment match
  const exact = entries.find(
    (entry) => entry.isDirectory() && entry.name === current
  );
  if (exact && findRoute(path.join(dir, exact.name), rest)) {
    return true;
  }

  // Dynamic segment match like [slug] or [...slug]
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith("[")) {
      if (findRoute(path.join(dir, entry.name), rest)) {
        return true;
      }
    }
  }

  return false;
}

function sanitizeHref(href: string) {
  const withoutHash = href.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];
  return withoutQuery.replace(/\/+$/, "");
}

const missing: string[] = [];

for (const href of testimonialLinks) {
  const sanitized = sanitizeHref(href);
  if (!sanitized || !sanitized.startsWith("/")) {
    continue;
  }

  const segments = sanitized
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean);

  if (!findRoute(appDir, segments)) {
    missing.push(href);
  }
}

if (missing.length > 0) {
  console.error(
    "Broken internal testimonial links (no matching page found):",
    missing.join(", ")
  );
  process.exit(1);
}

console.log("All testimonial links resolve to routes.");
