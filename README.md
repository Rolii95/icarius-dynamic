Icarius white paper lead magnet

- Next.js page: pages/whitepaper.tsx
- API endpoints: pages/api/lead.ts, pages/api/download.ts
- Uses HMAC signed URLs (SIGNING_KEY) to generate one-time/time-limited download links.
- Sends the whitepaper link through PurelyMail (or any SMTP provider) via Nodemailer.
- Optionally POSTs leads to an external webhook (Airtable/Make/Zapier/etc.).

Configure the SMTP + email settings in `.env`/Vercel (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`, `NEXT_PUBLIC_APP_URL`).
Upload `public/whitepaper.pdf` or set `WHITEPAPER_URL`/`NEXT_PUBLIC_WHITEPAPER_URL` to your storage bucket/CDN.

## Updating the lead magnet asset

- Replace `public/assets/icarius-hr-ai-whitepaper.pdf` with your production PDF. Commit the path, not the binary, if you store
  the file in object storage.
- For tighter control, point the response in `pages/api/lead-magnet.ts` at a time-limited URL (for example, a presigned S3 or
  Cloudflare R2 link) instead of the public asset.
- Remember to mirror the change in any marketing automations that email the download link.

## How the signed download works

When a visitor submits the lead form, `/api/lead`:

1. Generates a signed link valid for `SIGN_EXP_SECONDS` (default 24h).
2. Sends the link via PurelyMail SMTP (Nodemailer) and returns it to the frontend for immediate download.
3. Optionally posts the lead payload (`email`, `name`, etc.) to `LEAD_WEBHOOK_URL` for CRM/Sheets automations.

The signed URL points to `/api/download?email=...&expires=...&sig=...`.

`/api/download` checks expiry and HMAC signature (using `SIGNING_KEY`) and then issues a redirect to the actual `WHITEPAPER_URL` (could be S3 presigned URL, Cloudflare Workers asset, or `/public/whitepaper.pdf`).

This prevents casual link sharing and allows you to track/limit access. For higher security, generate a presigned S3 URL on the fly (recommended if using S3).
