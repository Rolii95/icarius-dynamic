// pages/api/lead.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Env vars (set these in Vercel)
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.purelymail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@yourdomain.com';
const WHITEPAPER_URL = process.env.WHITEPAPER_URL || process.env.NEXT_PUBLIC_WHITEPAPER_URL || 'https://your-site.com/whitepaper.pdf';
const SIGNING_KEY = process.env.SIGNING_KEY || 'replace_with_secure_key';
const SIGN_EXP_SECONDS = parseInt(process.env.SIGN_EXP_SECONDS || '86400', 10); // 24h default
const LEAD_WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL || ''; // optional: Airtable/Make/Sheets webhook

function generateSignedUrl(email: string) {
  const expires = Math.floor(Date.now() / 1000) + SIGN_EXP_SECONDS;
  const payload = `${email}|${expires}`;
  const sig = crypto.createHmac('sha256', SIGNING_KEY).update(payload).digest('hex');
  // Use absolute path if you prefer, or return a relative /api/download route which redirects to WHITEPAPER_URL
  const url = `/api/download?email=${encodeURIComponent(email)}&expires=${expires}&sig=${sig}`;
  return { url, expires, sig };
}

async function sendTransactionalEmail(toEmail: string, name = '', signedUrl: string) {
  // Create Nodemailer transporter using SMTP (PurelyMail)
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports (STARTTLS)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    tls: {
      // PurelyMail supports STARTTLS; this avoids self-signed errors in some environments
      rejectUnauthorized: false
    }
  });

  const subject = 'Your Icarius white paper — HRIS & AI readiness';
  const html = `<p>Hi ${name || 'there'},</p>
    <p>Thanks for requesting the Icarius white paper. Download it using the secure link below:</p>
    <p><a href="${signedUrl}" target="_blank" rel="noopener noreferrer">Download the white paper</a></p>
    <p>If the link does not work, reply to this email and we'll send you a copy.</p>
    <p>— Icarius Consulting</p>`;

  const text = `Hi ${name || ''},

Thanks for requesting the Icarius white paper. Download it here: ${signedUrl}

If the link does not work, reply to this email and we'll send you a copy.

— Icarius Consulting`;

  const info = await transporter.sendMail({
    from: FROM_EMAIL,
    to: toEmail,
    subject,
    text,
    html
  });

  return info;
}

async function postLeadWebhook(payload: any) {
  if (!LEAD_WEBHOOK_URL) return null;
  try {
    const res = await fetch(LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.error('lead webhook error', err);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name = '', company = '', email, title = '', consent } = req.body ?? {};

  if (!email || !consent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1) generate signed download URL
    const { url } = generateSignedUrl(email);
    const absoluteUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL) ? `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL}${url}` : url;

    // 2) attempt to send transactional email via PurelyMail SMTP (Nodemailer)
    await sendTransactionalEmail(email, name, absoluteUrl);

    // 3) optionally send lead to your webhook (Airtable, Make/MakeWebhook, Google Sheets, etc.)
    await postLeadWebhook({ email, name, company, title, consent, timestamp: new Date().toISOString() });

    // 4) return signed (relative) URL to the frontend so user can download immediately
    return res.status(200).json({ ok: true, signedUrl: absoluteUrl });
  } catch (err) {
    console.error('lead handler error', err);
    return res.status(500).json({ error: 'server_error' });
  }
}
