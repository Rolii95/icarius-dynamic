import type { NextApiRequest, NextApiResponse } from "next";

type TestResponse =
  | { ok: true; message: string; downloadUrl: string }
  | { ok: false; error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<TestResponse>,
) {
  console.log("[test-lead] Request received:", {
    method: request.method,
    body: request.body,
    timestamp: new Date().toISOString()
  });

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { email, consent } = request.body ?? {};

  if (typeof email !== "string" || !email.trim()) {
    return response.status(400).json({ ok: false, error: "Valid email required" });
  }

  if (consent !== true) {
    return response.status(400).json({ ok: false, error: "Consent required" });
  }

  try {
    // Test the download URL resolution
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      process.env.BASE_URL ||
      "";

    const downloadPath = "/assets/icarius-hr-ai-whitepaper.pdf";
    const normalizedBase = baseUrl.replace(/\/$/, "");
    const downloadUrl = normalizedBase ? `${normalizedBase}${downloadPath}` : downloadPath;

    console.log("[test-lead] Success - URL resolved:", {
      baseUrl,
      downloadUrl,
      timestamp: new Date().toISOString()
    });

    return response.status(200).json({ 
      ok: true, 
      message: "Test endpoint working", 
      downloadUrl 
    });

  } catch (error) {
    console.error("[test-lead] Error occurred:", {
      error: error instanceof Error ? error.message : "unknown",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return response.status(500).json({ ok: false, error: "Unable to process request" });
  }
}