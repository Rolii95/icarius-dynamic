import type { NextApiRequest, NextApiResponse } from "next";

const DOWNLOAD_URL = "/assets/icarius-hr-ai-whitepaper.pdf";

function isValidEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 320 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

type LeadMagnetResponse =
  | { ok: true; downloadUrl: string }
  | { ok: false; error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LeadMagnetResponse>,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { email, consent } = request.body ?? {};

  if (!isValidEmail(email)) {
    return response.status(400).json({ ok: false, error: "Valid email required" });
  }

  if (consent !== true) {
    return response.status(400).json({ ok: false, error: "Consent required" });
  }

  const leadPayload = {
    email,
    consentedAt: new Date().toISOString(),
    userAgent: request.headers["user-agent"] ?? null,
    ip: request.headers["x-forwarded-for"] ?? request.socket.remoteAddress ?? null,
  };

  try {
    // TODO: Persist leadPayload to your CRM of choice (Airtable, HubSpot, etc.).
    // Example email notification using Nodemailer:
    //
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST!,
    //   port: Number(process.env.SMTP_PORT || 587),
    //   auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    // });
    // await transporter.sendMail({
    //   to: process.env.LEAD_NOTIFICATION_EMAIL!,
    //   from: process.env.FROM_EMAIL!,
    //   subject: "New Icarius lead magnet download",
    //   text: JSON.stringify(leadPayload, null, 2),
    // });
  } catch (error) {
    console.error("Lead magnet handler error", error);
    return response.status(500).json({ ok: false, error: "Unable to process request" });
  }

  return response.status(200).json({ ok: true, downloadUrl: DOWNLOAD_URL });
}
