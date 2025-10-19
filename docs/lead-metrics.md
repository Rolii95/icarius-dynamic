# Lead metrics & follow-up

This stack captures attribution metadata across the white paper flow, forwards analytics
events to Plausible and GA4, persists leads for follow-up, and exposes tooling for exports
and reporting.

## Environment variables

| Variable | Scope | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | client | Enables Plausible `plausible()` calls when present. |
| `NEXT_PUBLIC_CLOUDFLARE_BEACON_TOKEN` | client | Optional Cloudflare Web Analytics beacon token used for client beacons. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` / `NEXT_PUBLIC_GA_MEASUREMENT_ID` | client | Enables GA4 client conversion events. |
| `PLAUSIBLE_DOMAIN` | server | Required for Plausible Measurement Protocol events. |
| `PLAUSIBLE_API_KEY` | server | Bearer token for Plausible server events. |
| `PLAUSIBLE_API_URL` | server | Override for the Plausible endpoint (defaults to `https://plausible.io/api/event`). |
| `GA4_MEASUREMENT_ID` | server | GA4 Measurement ID used for Measurement Protocol. |
| `GA4_API_SECRET` | server | GA4 API secret paired with the measurement ID. |
| `LEADS_EXPORT_KEY` | server | Required for `/api/leads-export` access. Rotate regularly. |
| `ENABLE_AUTOFOLLOWUP` | server | When set to `true`/`1`, triggers `enqueueFollowUp`. |
| `LEAD_AUTOFOLLOWUP_TEMPLATE_ID` | server | Optional template identifier passed to the follow-up hook. |
| `SENDGRID_API_KEY` | server | Optional key for the commented SendGrid example. |
| `FROM_EMAIL` | server | Sender email for transactional sends. |
| `BASE_URL` / `SITE_URL` / `NEXT_PUBLIC_SITE_URL` | server | Used to generate absolute download URLs. |

Keep secrets out of client bundles—only expose `NEXT_PUBLIC_*` variables that are safe for
public consumption.

## Analytics flow

1. Client-side state tracks UTM parameters, referrers, and landing URLs using session storage.
2. On submit the client fires `LeadMagnetSubmit` via `track()` and conditionally triggers
   Plausible, Cloudflare, and GA4 conversion events (guarded by consent and env flags).
3. The API validates consent, sanitises metadata, persists via `saveLead`, then forwards
   GA4 Measurement Protocol and Plausible server events.

Example GA4 payload:

```json
{
  "client_id": "GA1.1.1234567890.1690000000",
  "non_personalized_ads": true,
  "events": [
    {
      "name": "LeadMagnetSubmit",
      "params": {
        "source": "linkedin",
        "landing_page": "https://example.com/resources/white-paper",
        "utm_campaign": "enterprise-launch"
      }
    }
  ]
}
```

Example Plausible request:

```bash
curl -X POST https://plausible.io/api/event \
  -H "Authorization: Bearer $PLAUSIBLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"LeadMagnetSubmit",
    "domain":"example.com",
    "url":"https://example.com/resources/white-paper",
    "props":{"utm_source":"linkedin"}
  }'
```

## Persistence & CRM integration

`lib/persistence/lead.ts` writes to `data/leads.json` during local development and no-ops in
production to avoid accidental file writes in serverless environments. Swap the persistence
layer to your CRM or warehouse by replacing `saveLead`—the type includes tracking metadata
for UTM/source/landing page, consent timestamps, and request meta.

Retention tip: review the leads file regularly and purge entries older than 12 months unless
explicitly required. Add rate limiting or CAPTCHA protection at the API edge before putting
this into production.

## Exports & admin tooling

* `/api/leads-export` returns a CSV when the caller provides the `LEADS_EXPORT_KEY` via
  `Authorization: Bearer ...`, `x-api-key`, or `?key=`. Protect this endpoint with edge
  firewall rules or Vercel middleware if exposed publicly.
* `pages/admin/leads.tsx` offers a lightweight UI to fetch and preview exports. Gate the
  route behind Basic Auth, Vercel password protection, or SSO. The API key is stored only in
  session storage and emails are masked in the table preview.
* Rotate `LEADS_EXPORT_KEY` often and revoke previous downloads when staff leave.

## Follow-up automations

`lib/automation/emailQueue.ts` provides a single `enqueueFollowUp` hook. By default it logs
masked emails, keeping the flow safe for development. Uncomment the SendGrid example (or add
your provider) to trigger transactional emails when `ENABLE_AUTOFOLLOWUP` is true. Metadata
passed to the hook contains source, referrer, landing page, and UTM payloads to support
templated content.

## KPI reporting

Run quick summaries with:

```bash
npx tsx scripts/export-kpis.ts --visits=1200 --window=30
```

Outputs include total leads, windowed counts, conversion rates (when visit counts are
provided), top sources, UTM campaign roll-ups, and daily velocity for the selected window.

Automate this in CI by setting `TOTAL_VISITS` or `LEAD_VISITS` environment variables and
sending the stdout to Slack/Data Studio.

## Security checklist

* Consent is mandatory—email is stored only after a checked consent box.
* Avoid logging raw PII in production logs; masking utilities cover console output.
* Add bot mitigation (rate limits, CAPTCHA) before enabling this publicly.
* Limit access to admin routes and export endpoints; rotate keys and audit access monthly.
* Define a deletion path for leads on request (e.g., add a `DELETE /api/lead` handler or link
  the persistence layer to your CRM's delete API).
