# Lead Follow-up & Delivery Policy

This document explains how the lead magnet follow-up flow behaves in production and how to customise it per campaign.

## Transactional email logic

* The API saves each lead (with consent timestamp) before attempting delivery.
* `lib/email/transactional.ts` selects the best available provider:
  * **SendGrid** (preferred) – set `SENDGRID_API_KEY`, `SENDGRID_FROM`, and optionally `LEAD_MAGNET_TEMPLATE_ID` for dynamic templates. When `LEAD_MAGNET_TEMPLATE_ID` is absent, the module sends a plain-text message containing the download link.
  * **SMTP fallback** – if `SMTP_HOST` is defined but no API provider exists, the handler logs guidance so you can wire up Nodemailer or another transport. Email delivery is marked as skipped to avoid masking failures.
  * **No provider** – the lead still receives the download URL in the HTTP response; admins receive a monitoring alert (if configured) so they can intervene.
* Any failure to deliver triggers `reportDeliverabilityIssue`, which posts to `DELIVERABILITY_MONITOR_URL` for follow-up by the on-call engineer.

## API response contract

`POST /api/lead-magnet` returns:

```json
{
  "ok": true,
  "downloadUrl": "https://icarius.ai/assets/icarius-hr-ai-whitepaper.pdf",
  "emailSent": true,
  "message": null
}
```

* `emailSent` reflects the transactional provider outcome. When no provider is configured (e.g. local testing), the endpoint returns `emailSent: false` and a human-readable `message`.
* Persisted leads include `consent.accepted === true` and `consentedAt` timestamps for audit purposes.

## Follow-up automations

* Set `ENABLE_AUTOFOLLOWUP=true` and `LEAD_AUTOFOLLOWUP_TEMPLATE_ID` to enqueue additional nurture emails via `lib/automation/emailQueue`.
* The metadata posted to automation providers excludes PII (only campaign attribution, referrer, and timestamps).
* Use analytics dashboards (`LeadMagnetSubmit` event) to correlate sign-ups with nurture performance.

## Operator checklist

1. Confirm environment variables in Vercel:
   * `SENDGRID_API_KEY`
   * `SENDGRID_FROM`
   * `LEAD_MAGNET_TEMPLATE_ID`
   * `DELIVERABILITY_MONITOR_URL` (+ optional `DELIVERABILITY_MONITOR_KEY`)
   * `ENABLE_AUTOFOLLOWUP`
   * `LEAD_AUTOFOLLOWUP_TEMPLATE_ID`
2. Test end-to-end locally: `npm run dev`, submit the `/resources/white-paper` form, and inspect the API response (`emailSent` flag).
3. Run `./scripts/check-deliverability.sh` with the production domain to confirm DNS is aligned before launch.
4. Monitor the configured webhook after deployment; resolve any incidents raised by the deliverability module.
