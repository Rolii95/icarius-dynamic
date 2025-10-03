import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  company?: string;
  plan?: string;
};

type ValidationError = {
  field: keyof ContactPayload | 'payload';
  message: string;
};

type ContactDependencies = {
  sendEmail: (payload: ContactPayload) => Promise<void>;
};

type ValidationResult =
  | { success: true; data: ContactPayload }
  | { success: false; errors: ValidationError[] };

const INVALID_JSON_ERROR: ValidationError = {
  field: 'payload',
  message: 'Invalid JSON payload.',
};

function validatePayload(payload: unknown): ValidationResult {
  if (typeof payload !== 'object' || payload === null) {
    return { success: false, errors: [INVALID_JSON_ERROR] };
  }

  const raw = payload as Record<string, unknown>;
  const errors: ValidationError[] = [];
  const normalized: Partial<ContactPayload> = {};

  const requiredFields: (keyof ContactPayload)[] = ['name', 'email', 'message'];
  const optionalFields: (keyof ContactPayload)[] = ['company', 'plan'];

  for (const field of requiredFields) {
    const value = raw[field];
    if (typeof value !== 'string') {
      errors.push({ field, message: `${field} is required.` });
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      errors.push({ field, message: `${field} is required.` });
      continue;
    }

    (normalized as Record<string, string>)[field] = trimmed;
  }

  for (const field of optionalFields) {
    const value = raw[field];
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value !== 'string') {
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }

    (normalized as Record<string, string>)[field] = trimmed;
  }

  if (errors.length === 0) {
    const email = normalized.email!;
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.push({ field: 'email', message: 'Email must be a valid address.' });
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: normalized as ContactPayload };
}

async function sendWithResend(payload: ContactPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_RECIPIENT_EMAIL;

  if (!apiKey || !from || !to) {
    throw new Error('Contact email service is not fully configured.');
  }

  const resend = new Resend(apiKey);

  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
  ];

  if (payload.company) {
    lines.push(`Company: ${payload.company}`);
  }

  if (payload.plan) {
    lines.push(`Plan: ${payload.plan}`);
  }

  lines.push('', payload.message);

  await resend.emails.send({
    from,
    to: [to],
    replyTo: payload.email,
    subject: `New contact request from ${payload.name}`,
    text: lines.join('\n'),
  });
}

export async function handleContactRequest(
  request: Request,
  deps: ContactDependencies = { sendEmail: sendWithResend },
): Promise<Response> {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ errors: [INVALID_JSON_ERROR] }, { status: 400 });
  }

  const validation = validatePayload(rawPayload);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  try {
    await deps.sendEmail(validation.data);
  } catch (error) {
    console.error('Failed to dispatch contact email', error);
    return NextResponse.json(
      { error: 'Failed to send contact message.' },
      { status: 500 },
    );
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });
    } catch (error) {
      console.error('Failed to invoke contact webhook', error);
    }
  }

  const { email, company, plan, message } = validation.data;
  const [, domain = ''] = email.split('@');

  console.info('Contact request processed', {
    emailDomain: domain,
    companyProvided: Boolean(company),
    plan: plan ?? null,
    messageLength: message.length,
  });

  return NextResponse.json({ ok: true });
}
