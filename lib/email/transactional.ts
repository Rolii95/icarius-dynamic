const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";

export interface SendLeadMagnetEmailInput {
  email: string;
  downloadUrl: string;
  templateId?: string;
  metadata?: Record<string, unknown>;
}

export interface SendLeadMagnetEmailResult {
  delivered: boolean;
  skipped: boolean;
  provider?: "sendgrid" | "smtp" | "none";
  errorMessage?: string;
}

function pruneUndefined<TValue extends Record<string, unknown | undefined>>(value: TValue): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null),
  );
}

function anonymizeEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "unknown";
  const maskedLocal = local.length <= 2 ? "**" : `${local[0]}***`;
  return `${maskedLocal}@${domain}`;
}

export async function sendLeadMagnetEmail({
  email,
  downloadUrl,
  templateId,
  metadata,
}: SendLeadMagnetEmailInput): Promise<SendLeadMagnetEmailResult> {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM;

  if (sendgridKey && fromEmail) {
    try {
      const personalization: Record<string, unknown> = {
        to: [{ email }],
      };

      const dynamicTemplateData = pruneUndefined({
        downloadUrl,
        ...metadata,
      });

      if (Object.keys(dynamicTemplateData).length > 0) {
        personalization.dynamic_template_data = dynamicTemplateData;
      }

      const body = {
        personalizations: [personalization],
        from: { email: fromEmail },
        template_id: templateId,
        content: !templateId
          ? [
              {
                type: "text/plain",
                value: `Download your Icarius whitepaper here: ${downloadUrl}`,
              },
            ]
          : undefined,
      };

      const response = await fetch(SENDGRID_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("sendgrid:lead-magnet", {
          status: response.status,
          reason: errorBody.slice(0, 500),
        });
        return {
          delivered: false,
          skipped: false,
          provider: "sendgrid",
          errorMessage: `SendGrid responded with status ${response.status}`,
        };
      }

      return { delivered: true, skipped: false, provider: "sendgrid" };
    } catch (error) {
      console.error("sendgrid:lead-magnet", {
        error: error instanceof Error ? error.message : "unknown",
        recipient: anonymizeEmail(email),
      });
      return {
        delivered: false,
        skipped: false,
        provider: "sendgrid",
        errorMessage: error instanceof Error ? error.message : "unknown",
      };
    }
  }

  if (process.env.SMTP_HOST) {
    console.info("smtp:lead-magnet", {
      status: "configured",
      recipient: anonymizeEmail(email),
    });

    // Example SMTP usage when a transporter library is available:
    // import nodemailer from "nodemailer";
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST!,
    //   port: Number(process.env.SMTP_PORT || 587),
    //   secure: Number(process.env.SMTP_PORT || 587) === 465,
    //   auth: {
    //     user: process.env.SMTP_USER!,
    //     pass: process.env.SMTP_PASS!,
    //   },
    // });
    // await transporter.sendMail({
    //   to: email,
    //   from: process.env.SMTP_USER!,
    //   subject: "Your Icarius whitepaper download",
    //   text: `Download the whitepaper here: ${downloadUrl}`,
    // });

    return { delivered: false, skipped: true, provider: "smtp" };
  }

  console.warn("lead-magnet-email", {
    status: "skipped",
    reason: "No transactional provider configured",
    recipient: anonymizeEmail(email),
  });

  return { delivered: false, skipped: true, provider: "none" };
}
