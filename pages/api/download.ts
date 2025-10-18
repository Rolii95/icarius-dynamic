// pages/api/download.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const WHITEPAPER_URL = process.env.WHITEPAPER_URL || process.env.NEXT_PUBLIC_WHITEPAPER_URL || 'https://your-site.com/whitepaper.pdf';
const SIGNING_KEY = process.env.SIGNING_KEY || 'replace_with_secure_key';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, expires, sig } = req.query;
  if (!email || !expires || !sig) return res.status(400).send('Missing parameters');

  const now = Math.floor(Date.now() / 1000);
  if (now > parseInt(String(expires), 10)) return res.status(410).send('Link expired');

  const payload = `${String(email)}|${String(expires)}`;
  const expected = crypto.createHmac('sha256', SIGNING_KEY).update(payload).digest('hex');

  // timingSafeEqual expects Buffers and same length
  const valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(sig)));
  if (!valid) return res.status(403).send('Invalid signature');

  // Optional: increment counter/analytics here (DB / external webhook)
  // Redirect to real file (S3/Cloudflare/your /public path)
  res.writeHead(307, { Location: WHITEPAPER_URL });
  res.end();
}
