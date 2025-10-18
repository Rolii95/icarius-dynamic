// pages/api/lead.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const SIGNING_KEY = process.env.SIGNING_KEY || "replace_with_secure_key";
const SIGN_EXP_SECONDS = parseInt(process.env.SIGN_EXP_SECONDS || "86400");

function generateSignedUrl(email: string) {
  const expires = Math.floor(Date.now() / 1000) + SIGN_EXP_SECONDS;
  const payload = `${email}|${expires}`;
  const sig = crypto
    .createHmac("sha256", SIGNING_KEY)
    .update(payload)
    .digest("hex");
  // The download endpoint will validate and redirect to WHITEPAPER_URL
  const url = `/api/download?email=${encodeURIComponent(email)}&expires=${expires}&sig=${sig}`;
  return url;
}

async function addToMailjetContact(email: string, name?: string) {
  // Implement adding to Mailjet contacts/list here (or to your ESP)
  return true;
}

async function sendTransactional(
  email: string,
  name: string | undefined,
  signedUrl: string,
) {
  // Implement actual transactional send using Mailjet, Postmark, SendGrid etc.
  // For now, return true (the page will also show the signed URL as a backup).
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, company, email, title, consent } = req.body;
  if (!email || !consent) return res.status(400).json({ error: "missing" });

  try {
    await addToMailjetContact(email, name);
    const signedUrl = generateSignedUrl(email);
    await sendTransactional(email, name, signedUrl);
    return res.status(200).json({ ok: true, signedUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server" });
  }
}
