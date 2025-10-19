import type { NextApiRequest, NextApiResponse } from "next";
import { saveLead, type LeadPersistencePayload } from "@/lib/persistence/lead";

const DOWNLOAD_PATH = "/assets/icarius-hr-ai-whitepaper.pdf";

interface LeadMagnetRequestBody {
  email?: unknown;
  consent?: unknown;
  utm?: unknown;
}

type LeadMagnetResponse =
  | { ok: true; downloadUrl: string }
  | { ok: false; error: string };

function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 320) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
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

function resolveDownloadUrl(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.BASE_URL ||
    "";

  const normalizedBase = baseUrl.replace(/\/$/, "");
  return normalizedBase ? `${normalizedBase}${DOWNLOAD_PATH}` : DOWNLOAD_PATH;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LeadMagnetResponse>,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { email, consent, utm }: LeadMagnetRequestBody = request.body ?? {};

  if (!isValidEmail(email)) {
    return response.status(400).json({ ok: false, error: "Valid email required" });
  }

  if (consent !== true) {
    return response.status(400).json({ ok: false, error: "Consent required" });
  }

  const sanitizedEmail = sanitizeEmail(email);
  const utmParams = extractUtm(utm);
  const timestamp = new Date().toISOString();

  const payload: LeadPersistencePayload = {
    email: sanitizedEmail,
    createdAt: timestamp,
    consent: {
      accepted: true,
      consentedAt: timestamp,
    },
    utm: utmParams,
    meta: {
      userAgent: typeof request.headers["user-agent"] === "string" ? request.headers["user-agent"] : undefined,
      ip: typeof request.headers["x-forwarded-for"] === "string"
        ? request.headers["x-forwarded-for"].split(",")[0].trim()
        : request.socket.remoteAddress || undefined,
      referer: typeof request.headers.referer === "string" ? request.headers.referer : undefined,
    },
  };

  try {
    await saveLead(payload);

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

  return response.status(200).json({ ok: true, downloadUrl: resolveDownloadUrl() });
}
