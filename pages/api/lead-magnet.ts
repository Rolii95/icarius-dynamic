import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { enqueueFollowUp } from "@/lib/automation/emailQueue";
import { saveLead, type LeadPersistencePayload } from "@/lib/persistence/lead";

const DOWNLOAD_PATH = "/assets/icarius-hr-ai-whitepaper.pdf";
const GA4_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const PLAUSIBLE_ENDPOINT = "https://plausible.io/api/event";

interface LeadMagnetRequestBody {
  email?: unknown;
  consent?: unknown;
  utm?: unknown;
  referrer?: unknown;
  source?: unknown;
  landingPage?: unknown;
}

type LeadMagnetResponse =
  | { ok: true; downloadUrl: string }
  | { ok: false; error: string };

type NullableString = string | undefined;

function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 320) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sanitizeString(value: unknown, maxLength = 512): NullableString {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function sanitizeUrl(value: unknown): NullableString {
  const candidate = sanitizeString(value, 1024);
  if (!candidate) return undefined;

  if (candidate.startsWith("/")) {
    return candidate;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString().slice(0, 2048);
    }
  } catch (error) {
    return undefined;
  }

  return undefined;
}

function extractUtm(value: unknown): Record<string, string> | undefined {
  if (value === null || typeof value !== "object") {
    return undefined;
  }

  const entries = Object.entries(value).reduce<Record<string, string>>((acc, [key, raw]) => {
    if (typeof raw !== "string") return acc;
    const trimmed = raw.trim();
    if (!trimmed) return acc;
    acc[key] = trimmed;
    return acc;
  }, {});

  return Object.keys(entries).length > 0 ? entries : undefined;
}

function sanitizeTrackingUtm(params?: Record<string, string>): Record<string, string> | undefined {
  if (!params) return undefined;

  const sanitized = Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
    if (!key) return acc;
    const normalizedKey = key.trim().toLowerCase();
    if (!normalizedKey.startsWith("utm")) {
      return acc;
    }
    const sanitizedValue = sanitizeString(value, 150);
    if (!sanitizedValue) return acc;
    acc[normalizedKey] = sanitizedValue;
    return acc;
  }, {});

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

function parseHostname(input?: string): NullableString {
  if (!input) return undefined;
  try {
    const parsed = new URL(input);
    return parsed.hostname.slice(0, 150);
  } catch (error) {
    return undefined;
  }
}

function resolveSource(
  bodySource: NullableString,
  utm?: Record<string, string>,
  referrer?: NullableString,
): NullableString {
  if (bodySource) return bodySource.slice(0, 150);
  const utmSource = utm?.utm_source || utm?.source;
  if (utmSource) return utmSource.slice(0, 150);
  const hostname = parseHostname(referrer);
  if (hostname) return hostname;
  if (referrer) return referrer.slice(0, 150);
  return "direct";
}

function resolveGaClientId(request: NextApiRequest): string {
  const gaCookie = request.cookies?._ga;
  if (typeof gaCookie === "string" && gaCookie.trim().length > 0) {
    return gaCookie.trim().slice(0, 250);
  }

  return `leadmagnet.${randomUUID()}`;
}

function resolveDownloadUrl(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.BASE_URL ||
    "";

  const normalizedBase = baseUrl.replace(/\/$/, "");
  return normalizedBase ? `${normalizedBase}${DOWNLOAD_PATH}` : DOWNLOAD_PATH;
}

function pruneUndefined<TValue extends Record<string, unknown>>(value: TValue): Record<string, unknown> {
  return Object.entries(value).reduce<Record<string, unknown>>((acc, [key, entry]) => {
    if (entry === undefined || entry === null || entry === "") {
      return acc;
    }
    acc[key] = entry;
    return acc;
  }, {});
}

async function sendGa4Event(
  request: NextApiRequest,
  tracking: LeadPersistencePayload["tracking"],
  createdAt: string,
): Promise<void> {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    return;
  }

  const params = pruneUndefined({
    engagement_time_msec: 1,
    source: tracking.source,
    referrer: tracking.referrer,
    landing_page: tracking.landingPage,
    utm_source: tracking.utm?.utm_source,
    utm_medium: tracking.utm?.utm_medium,
    utm_campaign: tracking.utm?.utm_campaign,
    utm_term: tracking.utm?.utm_term,
    utm_content: tracking.utm?.utm_content,
    lead_timestamp: createdAt,
  });

  const body = {
    client_id: resolveGaClientId(request),
    non_personalized_ads: true,
    events: [
      {
        name: "LeadMagnetSubmit",
        params,
      },
    ],
  };

  const url = `${GA4_ENDPOINT}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("GA4 event failed", await response.text());
    }
  } catch (error) {
    console.error("GA4 event error", error instanceof Error ? error.message : error);
  }
}

async function sendPlausibleEvent(
  request: NextApiRequest,
  tracking: LeadPersistencePayload["tracking"],
): Promise<void> {
  const domain = process.env.PLAUSIBLE_DOMAIN;
  const apiKey = process.env.PLAUSIBLE_API_KEY;
  const endpoint = process.env.PLAUSIBLE_API_URL || PLAUSIBLE_ENDPOINT;

  if (!domain || !apiKey) {
    return;
  }

  const url = tracking.landingPage || `${resolveDownloadUrl().replace(DOWNLOAD_PATH, "")}/resources/white-paper`;
  const referrer = tracking.referrer === "direct" ? undefined : tracking.referrer;
  const source = tracking.source === "direct" && !tracking.utm?.utm_source ? undefined : tracking.source;

  const body = pruneUndefined({
    name: "LeadMagnetSubmit",
    domain,
    url,
    referrer,
    source,
    props: pruneUndefined({
      utm_source: tracking.utm?.utm_source,
      utm_medium: tracking.utm?.utm_medium,
      utm_campaign: tracking.utm?.utm_campaign,
    }),
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const userAgent = typeof request.headers["user-agent"] === "string" ? request.headers["user-agent"].slice(0, 256) : undefined;
  if (userAgent) {
    headers["User-Agent"] = userAgent;
  }

  const forwardedFor =
    typeof request.headers["x-forwarded-for"] === "string"
      ? request.headers["x-forwarded-for"].split(",")[0]?.trim()
      : undefined;
  if (forwardedFor) {
    headers["X-Forwarded-For"] = forwardedFor;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("Plausible event failed", await response.text());
    }
  } catch (error) {
    console.error("Plausible event error", error instanceof Error ? error.message : error);
  }
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LeadMagnetResponse>,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { email, consent, utm, referrer, source, landingPage }: LeadMagnetRequestBody = request.body ?? {};

  if (!isValidEmail(email)) {
    return response.status(400).json({ ok: false, error: "Valid email required" });
  }

  if (consent !== true) {
    return response.status(400).json({ ok: false, error: "Consent required" });
  }

  const sanitizedEmail = sanitizeEmail(email);
  const utmParams = sanitizeTrackingUtm(extractUtm(utm));
  const timestamp = new Date().toISOString();
  const headerReferrer = sanitizeUrl(request.headers.referer);
  const bodyReferrer = sanitizeUrl(referrer);
  const landing = sanitizeUrl(landingPage);
  const resolvedReferrer = bodyReferrer ?? headerReferrer;
  const trackingSource = resolveSource(sanitizeString(source, 150), utmParams, resolvedReferrer);
  const downloadUrl = resolveDownloadUrl();

  const payload: LeadPersistencePayload = {
    email: sanitizedEmail,
    createdAt: timestamp,
    consent: {
      accepted: true,
      consentedAt: timestamp,
    },
    tracking: {
      utm: utmParams,
      referrer: resolvedReferrer ?? headerReferrer ?? "direct",
      source: trackingSource,
      landingPage: landing,
      campaign: utmParams?.utm_campaign,
    },
    meta: {
      userAgent: typeof request.headers["user-agent"] === "string" ? request.headers["user-agent"] : undefined,
      ip:
        typeof request.headers["x-forwarded-for"] === "string"
          ? request.headers["x-forwarded-for"].split(",")[0].trim()
          : request.socket.remoteAddress || undefined,
      referer: headerReferrer,
    },
  };

  try {
    await saveLead(payload);

    const postSaveTasks: Array<{ name: string; promise: Promise<unknown> }> = [
      { name: "ga4", promise: sendGa4Event(request, payload.tracking, timestamp) },
      { name: "plausible", promise: sendPlausibleEvent(request, payload.tracking) },
    ];

    const autoFollowUpEnabled =
      process.env.ENABLE_AUTOFOLLOWUP === "true" || process.env.ENABLE_AUTOFOLLOWUP === "1";

    if (autoFollowUpEnabled) {
      const metadata = pruneUndefined({
        source: payload.tracking.source,
        referrer: payload.tracking.referrer,
        landingPage: payload.tracking.landingPage,
        utm: payload.tracking.utm,
        consentedAt: timestamp,
      });

      postSaveTasks.push({
        name: "followUp",
        promise: enqueueFollowUp({
          email: sanitizedEmail,
          downloadUrl,
          templateId: process.env.LEAD_AUTOFOLLOWUP_TEMPLATE_ID,
          metadata: Object.keys(metadata).length ? metadata : undefined,
        }),
      });
    }

    const results = await Promise.allSettled(postSaveTasks.map((task) => task.promise));
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`[lead:post] ${postSaveTasks[index]?.name ?? "unknown"} failed`, {
          error: result.reason instanceof Error ? result.reason.message : result.reason,
        });
      }
    });

    // Example email notification using Nodemailer (not bundled by default):
    //
    // import nodemailer from "nodemailer";
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST!,
    //   port: Number(process.env.SMTP_PORT || 587),
    //   auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    // });
    // await transporter.sendMail({
    //   to: sanitizedEmail,
    //   from: process.env.FROM_EMAIL!,
    //   subject: "Your Icarius whitepaper download",
    //   text: `Download the whitepaper here: ${resolveDownloadUrl()}`,
    // });
  } catch (error) {
    const emailDomain = sanitizedEmail.split("@")[1] ?? "unknown";
    console.error("Lead magnet persistence failed", {
      error: error instanceof Error ? error.message : "unknown",
      emailDomain,
    });
    return response.status(500).json({ ok: false, error: "Unable to process request" });
  }

  return response.status(200).json({ ok: true, downloadUrl });
}
