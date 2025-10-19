import { timingSafeEqual } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import type { LeadPersistencePayload } from "@/lib/persistence/lead";

const LEADS_FILE_PATH = path.join(process.cwd(), "data", "leads.json");

type StoredLead = LeadPersistencePayload & { persistedAt?: string };

const CSV_COLUMNS: Array<{
  key: string;
  accessor: (lead: StoredLead) => string | string[] | undefined;
}> = [
  { key: "email", accessor: (lead) => lead.email },
  { key: "created_at", accessor: (lead) => lead.createdAt },
  { key: "consented_at", accessor: (lead) => lead.consent.consentedAt },
  { key: "source", accessor: (lead) => lead.tracking.source },
  { key: "referrer", accessor: (lead) => lead.tracking.referrer },
  { key: "landing_page", accessor: (lead) => lead.tracking.landingPage },
  { key: "utm_source", accessor: (lead) => lead.tracking.utm?.utm_source },
  { key: "utm_medium", accessor: (lead) => lead.tracking.utm?.utm_medium },
  { key: "utm_campaign", accessor: (lead) => lead.tracking.utm?.utm_campaign || lead.tracking.campaign },
  { key: "utm_term", accessor: (lead) => lead.tracking.utm?.utm_term },
  { key: "utm_content", accessor: (lead) => lead.tracking.utm?.utm_content },
  { key: "tags", accessor: (lead) => lead.tracking.tags },
  { key: "ip", accessor: (lead) => lead.meta.ip },
  { key: "user_agent", accessor: (lead) => lead.meta.userAgent },
  { key: "persisted_at", accessor: (lead) => lead.persistedAt },
];

const readLeads = async (): Promise<StoredLead[]> => {
  try {
    const raw = await readFile(LEADS_FILE_PATH, "utf-8");
    if (!raw.trim()) {
      return [];
    }

    const parsed = JSON.parse(raw) as StoredLead[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    console.error("[lead:export] read failed", error instanceof Error ? error.message : error);
    return [];
  }
};

const escapeCsv = (value: string): string => {
  const needsEscaping = /[",\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsEscaping ? `"${escaped}"` : escaped;
};

const toCsvValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    const joined = value.filter(Boolean).join("|");
    return escapeCsv(joined);
  }

  if (typeof value !== "string") {
    return "";
  }

  return escapeCsv(value);
};

const toCsv = (leads: StoredLead[]): string => {
  const rows = [CSV_COLUMNS.map((column) => column.key).join(",")];

  leads
    .slice()
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
    .forEach((lead) => {
      const row = CSV_COLUMNS.map((column) => toCsvValue(column.accessor(lead)));
      rows.push(row.join(","));
    });

  return rows.join("\n");
};

const extractKey = (request: NextApiRequest): string | undefined => {
  const authHeader = request.headers.authorization;
  if (typeof authHeader === "string") {
    const [scheme, credential] = authHeader.split(" ");
    if (scheme?.toLowerCase() === "bearer" && credential) {
      return credential.trim();
    }
  }

  const apiKeyHeader = request.headers["x-api-key"];
  if (typeof apiKeyHeader === "string") {
    return apiKeyHeader.trim();
  }

  const queryKey = request.query.key;
  if (typeof queryKey === "string") {
    return queryKey.trim();
  }

  return undefined;
};

const safeEqual = (expected: string, provided?: string): boolean => {
  if (!provided) return false;

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const expectedKey = process.env.LEADS_EXPORT_KEY;
  if (!expectedKey) {
    return response.status(503).json({ ok: false, error: "Export disabled" });
  }

  const providedKey = extractKey(request);
  if (!safeEqual(expectedKey, providedKey)) {
    return response.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const leads = await readLeads();
  const csv = toCsv(leads);

  response.setHeader("Content-Type", "text/csv; charset=utf-8");
  response.setHeader("Content-Disposition", "attachment; filename=leads-export.csv");
  response.setHeader("Cache-Control", "no-store");

  return response.status(200).send(csv);
}
