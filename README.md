Icarius white paper lead magnet

- Landing page: `pages/resources/white-paper.tsx`
- Lead capture API: `pages/api/lead-magnet.ts`
- Client analytics: `@/lib/analytics` (fires `LeadMagnetSubmit` to the data layer, Plausible, Cloudflare, and GA4 when consented)
- Attribution storage: sessionStorage key `icarius:lead-tracking` (UTM, source, referrer, landing page)
- Optional email sequences: see [`docs/lead-followup.md`](docs/lead-followup.md) for transactional automations and [`docs/deliverability.md`](docs/deliverability.md) for DNS guidance.

Configure analytics and email credentials in `.env`/Vercel as needed. The API accepts `BASE_URL`/`SITE_URL`/`NEXT_PUBLIC_SITE_URL` to build absolute download links when responding to the client or transactional emails.

## Updating the lead magnet asset

- Replace `public/assets/icarius-hr-ai-whitepaper.pdf` with your production PDF. Commit the path, not the binary, if you prefer to host the file outside the repo.
- For production we recommend hosting the PDF on S3/R2 (or another CDN) and returning a short-lived, signed URL from `pages/api/lead-magnet.ts`. The existing response object already supports overriding `downloadUrl`.
- Set `BASE_URL` (or `SITE_URL` / `NEXT_PUBLIC_SITE_URL`) in the environment so absolute download URLs resolve correctly in emails and analytics events.
- Mirror any URL changes in nurture workflows or CRM automations that reference the asset.

## Production checklist

1. Configure analytics environment variables (`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `GA4_MEASUREMENT_ID`, etc.) so attribution events fire correctly.
2. Provide SMTP/ESP credentials if you enable the optional follow-up automations.
3. Enable rate limiting or CAPTCHA upstream before making the form public.
4. Review retention policies in `lib/persistence/lead.ts` and purge local JSON storage before deploying.
