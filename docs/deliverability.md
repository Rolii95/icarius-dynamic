# Lead Magnet Deliverability Playbook

This guide documents the operational steps required to keep the Icarius lead magnet flowing reliably in production. Share it with SalesOps / DevOps teams when onboarding new sending domains or troubleshooting.

## 1. Required DNS records

Configure these TXT records on the **sending domain** (e.g. `icarius.ai`). Set TTL to 1 hour (3600 seconds) unless your DNS provider requires a longer minimum.

### SPF

```
Type: TXT
Name: @
Value: v=spf1 include:sendgrid.net include:mailgun.org include:amazonses.com ~all
TTL: 3600
```

* **Namecheap**: Advanced DNS → Add new TXT record. Use `@` for the host. Propagation: 15–30 minutes.
* **Cloudflare**: DNS → Add record → Type TXT. Cloudflare flattens includes automatically; verify using the DNS checker script.
* **Community Fibre (ISP-managed DNS)**: File a support ticket requesting the TXT value above. Ask them to confirm propagation windows; they typically update within 4 hours.

### DKIM

Generate keys for each transactional provider you enable. Recommended selectors:

* `sg1` for SendGrid → record: `sg1._domainkey.icarius.ai`
* `mg1` for Mailgun → record: `mg1._domainkey.icarius.ai`
* `ses1` for Amazon SES → record: `ses1._domainkey.icarius.ai`

Publish each TXT value provided by the vendor. Example SendGrid record:

```
Type: TXT
Name: sg1._domainkey
Value: v=DKIM1; k=rsa; p=PUBLIC_KEY_SNIPPET
TTL: 3600
```

After creating the records:

1. Verify in the SendGrid dashboard (`Settings → Sender Authentication`) until all selectors show as validated.
2. Run `node scripts/dns-check.js --domain icarius.ai --dkim-selector sg1` to confirm the `v=DKIM1` flag is visible.

### DMARC

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:${DMARC_POLICY_EMAIL}; ruf=mailto:${DMARC_POLICY_EMAIL}; fo=1; pct=100
TTL: 3600
```

* Set `${DMARC_POLICY_EMAIL}` to a monitored inbox (e.g. `deliverability@icarius.ai`).
* After 2–3 weeks of clean reports, consider upgrading to `p=reject`.

### PTR (reverse DNS)

If you send any messages directly from a static IP (e.g. fall back SMTP relay), ensure your ISP or hosting provider maps that IP to a hostname under `icarius.ai`.

1. Request a PTR record: `203.0.113.42 → smtp.icarius.ai`.
2. Add a forward DNS A record for `smtp.icarius.ai` pointing back to the same IP.
3. Validate with `node scripts/dns-check.js --domain icarius.ai --ip 203.0.113.42`.

Community Fibre customers must open a support ticket referencing “reverse DNS for outbound SMTP” and include both the IP and desired hostname.

## 2. Automation & monitoring

### DNS check script

Run locally or in CI:

```bash
export DELIVERABILITY_DOMAIN=icarius.ai
export DKIM_SELECTOR=sg1
export SENDING_IP=203.0.113.42
./scripts/check-deliverability.sh
```

The script exits non-zero if SPF or DMARC are missing. DKIM and PTR issues produce warnings so deployments can continue while alerts are triaged.

### GitHub Actions workflow

Trigger the `Deliverability Check` workflow manually in GitHub. It pulls the domain from the `DELIVERABILITY_DOMAIN` repository secret and uploads a `deliverability-report.txt` artifact summarising the DNS status for audit trails.

### Monitoring webhook

Set `DELIVERABILITY_MONITOR_URL` (and optional `DELIVERABILITY_MONITOR_KEY`) in Vercel. When transactional email attempts fail, the API posts a payload:

```json
{
  "domain": "example.com",
  "issue": "transactional-email-failed",
  "details": {
    "provider": "sendgrid",
    "error": "SendGrid responded with status 403"
  },
  "occurredAt": "2024-06-09T12:00:00.000Z"
}
```

Point this at PagerDuty, Opsgenie, Slack, or a custom webhook worker.

## 3. Transactional email providers

Recommended providers ranked by existing integrations:

1. **SendGrid** – fully automated via the Node `fetch` API in `lib/email/transactional.ts`. Set:
   * `SENDGRID_API_KEY`
   * `SENDGRID_FROM`
   * `LEAD_MAGNET_TEMPLATE_ID` (dynamic transactional template with `downloadUrl` data field)
2. **Mailgun** – use their HTTP API via `fetch` (update `lib/email/transactional.ts` with the `api.mailgun.net` endpoint). They supply DKIM/SPF includes automatically.
3. **Amazon SES** – configure with IAM access keys and update the transactional module with the `ses.us-east-1.amazonaws.com` endpoint.

For each provider, store credentials in Vercel project environment variables. Never commit keys to git.

Example SendGrid request body (mirrors the implementation):

```json
{
  "personalizations": [
    {
      "to": [{ "email": "lead@example.com" }],
      "dynamic_template_data": {
        "downloadUrl": "https://icarius.ai/assets/icarius-hr-ai-whitepaper.pdf"
      }
    }
  ],
  "from": { "email": "insights@icarius.ai" },
  "template_id": "d-1234567890abcdef1234567890abcdef"
}
```

## 4. Lead magnet distribution options

1. **Transactional email (preferred)** – ensures double opt-in and measurable engagement.
2. **Instant download fallback** – the API always returns a signed `downloadUrl`. The current placeholder PDF lives at `public/assets/icarius-hr-ai-whitepaper.pdf` – replace it with the production asset via Vercel file upload.
3. **Signed S3 URLs** – for larger files or expiring access, generate a pre-signed URL and send it via email or display on the thank-you page:

```ts
// Example using @aws-sdk/s3-request-presigner (do not bundle by default)
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({ region: "eu-west-2" });
const command = new GetObjectCommand({
  Bucket: "icarius-lead-assets",
  Key: "whitepaper.pdf",
});
const signedUrl = await getSignedUrl(client, command, { expiresIn: 60 * 10 });
```

Expose this via an environment variable (e.g. `LEAD_MAGNET_SIGNED_URL`) if you prefer to avoid real-time signing in serverless functions.

## 5. Remediation checklist

When deliverability drops or a provider raises an alert:

1. Run `./scripts/check-deliverability.sh` to confirm DNS posture.
2. Inspect monitoring webhook notifications for provider error codes.
3. Verify sending reputation dashboards (SendGrid suppression list, bounce events, spam reports).
4. Confirm outbound IPs still have reverse DNS.
5. Rotate API keys if compromised and update Vercel environment variables.
6. Send a manual warm-up campaign (1–2% of list) using high-engagement contacts before resuming automations.

Document each remediation in the Ops runbook and update DNS TTLs to 3600 once stable.
