interface ReportDeliverabilityIssueInput {
  domain: string;
  issue: string;
  details?: Record<string, unknown> | string;
}

export async function reportDeliverabilityIssue({
  domain,
  issue,
  details,
}: ReportDeliverabilityIssueInput): Promise<void> {
  const url = process.env.DELIVERABILITY_MONITOR_URL;
  const apiKey = process.env.DELIVERABILITY_MONITOR_KEY;

  if (!url) {
    return;
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        domain,
        issue,
        details,
        occurredAt: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("deliverability-monitor", {
      error: error instanceof Error ? error.message : "unknown",
      domain,
      issue,
    });
  }
}
