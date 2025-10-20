// pages/api/download.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const WHITEPAPER_URL = process.env.WHITEPAPER_URL || process.env.NEXT_PUBLIC_WHITEPAPER_URL || 'https://your-site.com/whitepaper.pdf';
const SIGNING_KEY = process.env.SIGNING_KEY || 'replace_with_secure_key';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, expires, sig } = req.query;
  if (
    typeof email !== 'string' ||
    typeof expires !== 'string' ||
    typeof sig !== 'string'
  ) {
    return res.status(400).send('Missing parameters');
  }

  const now = Math.floor(Date.now() / 1000);
  const expiry = Number.parseInt(expires, 10);
  if (!Number.isFinite(expiry)) return res.status(400).send('Invalid expiry timestamp');
  if (now > expiry) return res.status(410).send('Link expired');

  const payload = `${email}|${expires}`;
  const expected = crypto.createHmac('sha256', SIGNING_KEY).update(payload).digest('hex');

  const isValid = (() => {
    try {
      const expectedBuffer = Buffer.from(expected, 'hex');
      const providedBuffer = Buffer.from(sig, 'hex');

      if (expectedBuffer.length !== providedBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    } catch (error) {
      return false;
    }
  })();

  if (!isValid) return res.status(403).send('Invalid signature');

  // Optional: increment counter/analytics here (DB / external webhook)
  // Redirect to real file (S3/Cloudflare/your /public path)
  res.writeHead(307, { Location: WHITEPAPER_URL });
  res.end();
}
