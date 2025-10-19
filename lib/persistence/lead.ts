export interface LeadPersistencePayload {
  email: string;
  createdAt: string;
  consent: {
    accepted: true;
    consentedAt: string;
  };
  utm?: Record<string, string>;
  meta: {
    userAgent?: string;
    ip?: string;
    referer?: string;
  };
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const maskedLocal = local.length <= 2 ? "*".repeat(local.length) : `${local[0]}***${local.slice(-1)}`;
  return `${maskedLocal}@${domain}`;
}

export async function saveLead(_lead: LeadPersistencePayload): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[lead:persistence] received", maskEmail(_lead.email));
  }

  // Integrate your CRM, marketing automation, or data warehouse here.
  // Examples:
  // - Send data to HubSpot via their Forms API.
  // - Trigger a Zapier webhook for downstream automations.
  // - Persist to a database or data lake.
}
