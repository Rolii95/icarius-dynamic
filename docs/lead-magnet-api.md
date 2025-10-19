# Lead magnet API integration

The `/api/lead-magnet` endpoint accepts `POST` requests with JSON payloads:

```json
{
  "email": "person@example.com",
  "consent": true,
  "utm": {
    "utm_source": "newsletter"
  }
}
```

On success, the API returns `{ "ok": true, "downloadUrl": "..." }`. The default download path is `/assets/icarius-hr-ai-whitepaper.pdf`. Override the absolute URL by setting `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, or `BASE_URL`.

## Persisting leads

The handler delegates storage to [`lib/persistence/lead.ts`](../lib/persistence/lead.ts). Replace the `saveLead` function with your preferred integration:

- Call a CRM or marketing automation API (HubSpot, Salesforce, Customer.io, etc.).
- Invoke a serverless queue, data warehouse, or webhook (Zapier, Make, Segment).
- Fan out to both a transactional email provider and a database record.

The stub currently logs masked emails in non-production environments only. Keep the payload shape intact (`email`, `createdAt`, `consent`, optional `utm`, and request `meta`) so downstream consumers have full context.

## Download delivery

For production, prefer short-lived signed URLs (e.g., Amazon S3 pre-signed links or Vercel Blob signed downloads) instead of static assets. Update `resolveDownloadUrl` in `pages/api/lead-magnet.ts` once you have the secure delivery mechanism in place.

## Abuse prevention

Add a CAPTCHA (hCaptcha, reCAPTCHA, Cloudflare Turnstile) or similar human verification to the form submitting to this endpoint. Pair it with rate limiting (e.g., Upstash Redis, Vercel Edge Config) to mitigate automated submissions.
