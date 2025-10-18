// pages/api/download.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const WHITEPAPER_URL =
  process.env.WHITEPAPER_URL ||
  process.env.NEXT_PUBLIC_WHITEPAPER_URL ||
  "https://your-site.com/whitepaper.pdf";
const SIGNING_KEY = process.env.SIGNING_KEY || "replace_with_secure_key";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, expires, sig } = req.query as {
    [k: string]: string | undefined;
  };
  if (!email || !expires || !sig)
    return res.status(400).send("Missing parameters");
  const now = Math.floor(Date.now() / 1000);
  if (now > parseInt(expires)) return res.status(410).send("Link expired");
  const payload = `${email}|${expires}`;
  const expected = crypto
    .createHmac("sha256", SIGNING_KEY)
    .update(payload)
    .digest("hex");
  // timingSafeEqual requires Buffers of equal length
  const ok = crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(sig, "hex"),
  );
  if (!ok) return res.status(403).send("Invalid signature");
  // Optionally log the successful download (DB, analytics, webhook)
  return res.redirect(307, WHITEPAPER_URL);
}
