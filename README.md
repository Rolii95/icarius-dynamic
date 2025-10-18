Icarius white paper lead magnet

- Next.js page: pages/whitepaper.tsx
- API endpoints: pages/api/lead.ts, pages/api/download.ts
- Uses HMAC signed URLs (SIGNING_KEY) to generate one-time/time-limited download links.

Replace placeholder Mailjet/send code with your ESP. Upload whitepaper to public/whitepaper.pdf or set WHITEPAPER_URL to your S3/Cloudflare storage.

## How the signed download works

When a visitor submits the lead form, `/api/lead`:

1. Adds the contact to your ESP (Mailjet placeholder in code).
2. Generates a signed link valid for `SIGN_EXP_SECONDS` (default 24h).
3. Returns the signed URL to the frontend and you should also send it by email (transactional send).

The signed URL points to `/api/download?email=...&expires=...&sig=...`.

`/api/download` checks expiry and HMAC signature (using `SIGNING_KEY`) and then issues a redirect to the actual `WHITEPAPER_URL` (could be S3 presigned URL, Cloudflare Workers asset, or `/public/whitepaper.pdf`).

This prevents casual link sharing and allows you to track/limit access. For higher security, generate a presigned S3 URL on the fly (recommended if using S3).
