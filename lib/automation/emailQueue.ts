const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const maskedLocal = local.length <= 2 ? "*".repeat(local.length) : `${local[0]}***${local.slice(-1)}`;
  return `${maskedLocal}@${domain}`;
};

export interface FollowUpRequest {
  email: string;
  downloadUrl: string;
  templateId?: string;
  metadata?: Record<string, unknown>;
}

export const enqueueFollowUp = async (request: FollowUpRequest) => {
  const maskedEmail = maskEmail(request.email);

  if (process.env.NODE_ENV !== "production") {
    console.info("[lead:automation] enqueue", {
      email: maskedEmail,
      templateId: request.templateId,
      hasMetadata: Boolean(request.metadata && Object.keys(request.metadata).length > 0),
    });
  }

  // Example SendGrid integration (commented):
  // const apiKey = process.env.SENDGRID_API_KEY;
  // if (apiKey && request.templateId) {
  //   await fetch("https://api.sendgrid.com/v3/mail/send", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${apiKey}`,
  //     },
  //     body: JSON.stringify({
  //       from: { email: process.env.FROM_EMAIL },
  //       personalizations: [
  //         {
  //           to: [{ email: request.email }],
  //           dynamic_template_data: {
  //             downloadUrl: request.downloadUrl,
  //             ...request.metadata,
  //           },
  //         },
  //       ],
  //       template_id: request.templateId,
  //     }),
  //   });
  // }
};
