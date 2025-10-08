const COLORS = ["#EEF2FF", "#ECFEFF", "#ECFDF5", "#FEF3C7", "#FCE7F3", "#F3E8FF", "#E5E7EB"];
const TEXT = "#111827";

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]!.toUpperCase())
    .join("");
}

export async function GET(_: Request, { params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name || "User");
  const bg = COLORS[hash(name) % COLORS.length];
  const text = initials(name) || "U";
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <defs><clipPath id="r"><rect x="0" y="0" width="96" height="96" rx="48"/></clipPath></defs>
  <rect width="96" height="96" fill="${bg}" rx="48"/>
  <g clip-path="url(#r)">
    <text x="50%" y="54%" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
          font-size="36" font-weight="700" fill="${TEXT}" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </g>
</svg>`.trim();

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
