import { readFile } from "fs/promises";
import path from "path";

interface LeadRecord {
  email: string;
  createdAt: string;
  consent: {
    accepted: true;
    consentedAt: string;
  };
  tracking: {
    source?: string;
    referrer?: string;
    landingPage?: string;
    campaign?: string;
    tags?: string[];
    utm?: Record<string, string>;
  };
}

const LEADS_FILE_PATH = path.join(process.cwd(), "data", "leads.json");

const parseArgs = () => {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};

  args.forEach((arg) => {
    const [key, value] = arg.replace(/^--/, "").split("=");
    if (key && value) {
      result[key] = value;
    }
  });

  return result;
};

const parseNumber = (value?: string): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const loadLeads = async (): Promise<LeadRecord[]> => {
  try {
    const raw = await readFile(LEADS_FILE_PATH, "utf-8");
    if (!raw.trim()) {
      return [];
    }

    const parsed = JSON.parse(raw) as LeadRecord[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
};

const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

const groupBy = (leads: LeadRecord[], selector: (lead: LeadRecord) => string) => {
  return leads.reduce<Record<string, number>>((acc, lead) => {
    const key = selector(lead) || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
};

const formatGroup = (group: Record<string, number>) => {
  const entries = Object.entries(group).sort((a, b) => b[1] - a[1]);
  return entries
    .map(([key, count]) => `  • ${key}: ${count}`)
    .join("\n");
};

async function main() {
  const args = parseArgs();
  const leads = await loadLeads();
  const lookbackDays = parseNumber(args.window) ?? 30;
  const visits = parseNumber(args.visits) ?? parseNumber(process.env.LEAD_VISITS) ?? parseNumber(process.env.TOTAL_VISITS);

  if (!leads.length) {
    console.log("No leads captured yet. Run the lead magnet flow to generate sample data.");
    return;
  }

  const now = Date.now();
  const windowMs = lookbackDays * 24 * 60 * 60 * 1000;

  const leadsInWindow = leads.filter((lead) => {
    const createdAt = new Date(lead.createdAt).getTime();
    return Number.isFinite(createdAt) && now - createdAt <= windowMs;
  });

  const bySource = groupBy(leads, (lead) => lead.tracking.source || lead.tracking.utm?.utm_source || "direct");
  const byCampaign = groupBy(leads, (lead) => lead.tracking.campaign || lead.tracking.utm?.utm_campaign || "none");

  const leadsByDay = leadsInWindow.reduce<Record<string, number>>((acc, lead) => {
    const day = new Date(lead.createdAt).toISOString().slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  console.log("Lead KPI Summary");
  console.log("================");
  console.log(`Total leads: ${leads.length}`);
  console.log(`Leads (last ${lookbackDays} days): ${leadsInWindow.length}`);

  if (visits && visits > 0) {
    console.log(`Conversion rate (visits=${visits}): ${formatPercent(leadsInWindow.length / visits)}`);
  } else {
    console.log("Conversion rate: (provide --visits=NUMBER to calculate)");
  }

  console.log("\nTop sources:");
  console.log(formatGroup(bySource) || "  • none");

  console.log("\nUTM campaigns:");
  console.log(formatGroup(byCampaign) || "  • none");

  console.log("\nLead velocity (last window):");
  if (Object.keys(leadsByDay).length === 0) {
    console.log("  • no leads in the selected window");
  } else {
    Object.entries(leadsByDay)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .forEach(([day, count]) => {
        console.log(`  • ${day}: ${count}`);
      });
  }

  console.log("\nTip: run with `npx tsx scripts/export-kpis.ts --visits=1234` to include conversion rate.");
}

main().catch((error) => {
  console.error("Unable to export KPIs", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
