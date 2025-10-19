import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export interface LeadTrackingMetadata {
  utm?: Record<string, string>;
  referrer?: string;
  source?: string;
  landingPage?: string;
  campaign?: string;
  tags?: string[];
}

export interface LeadMeta {
  userAgent?: string;
  ip?: string;
  referer?: string;
}

export interface LeadPersistencePayload {
  email: string;
  createdAt: string;
  consent: {
    accepted: true;
    consentedAt: string;
  };
  tracking: LeadTrackingMetadata;
  meta: LeadMeta;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const maskedLocal = local.length <= 2 ? "*".repeat(local.length) : `${local[0]}***${local.slice(-1)}`;
  return `${maskedLocal}@${domain}`;
}

const STORAGE_DIR = path.join(process.cwd(), "data");
const STORAGE_FILE = path.join(STORAGE_DIR, "leads.json");

type StoredLead = LeadPersistencePayload & { persistedAt: string };

const toStoredLead = (lead: LeadPersistencePayload): StoredLead => ({
  ...lead,
  tracking: {
    ...lead.tracking,
    utm: lead.tracking.utm ? { ...lead.tracking.utm } : undefined,
    tags: lead.tracking.tags ? [...lead.tracking.tags] : undefined,
  },
  meta: { ...lead.meta },
  persistedAt: new Date().toISOString(),
});

const readExistingLeads = async (): Promise<StoredLead[]> => {
  try {
    const file = await readFile(STORAGE_FILE, "utf-8");
    if (!file.trim()) {
      return [];
    }

    const parsed = JSON.parse(file) as StoredLead[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    console.error("[lead:persistence] read failed", error instanceof Error ? error.message : error);
    return [];
  }
};

export async function saveLead(lead: LeadPersistencePayload): Promise<void> {
  const maskedEmail = maskEmail(lead.email);

  if (process.env.NODE_ENV === "production") {
    console.info("[lead:persistence] production noop", {
      email: maskedEmail,
      source: lead.tracking.source ?? "unknown",
    });
    return;
  }

  try {
    await mkdir(STORAGE_DIR, { recursive: true });

    const existing = await readExistingLeads();
    const record = toStoredLead(lead);
    existing.push(record);

    await writeFile(STORAGE_FILE, JSON.stringify(existing, null, 2));

    console.info("[lead:persistence] stored", {
      email: maskedEmail,
      source: lead.tracking.source ?? "unknown",
      utm_source: lead.tracking.utm?.utm_source,
    });
  } catch (error) {
    console.error("[lead:persistence] persist failed", {
      email: maskedEmail,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}
