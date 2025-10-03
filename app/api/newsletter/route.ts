import { NextResponse } from 'next/server';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z
    .string({ required_error: 'Email is required.' })
    .trim()
    .min(1, 'Email is required.')
    .email('Please provide a valid email address.'),
});

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid JSON payload.' },
      { status: 400 },
    );
  }

  const result = newsletterSchema.safeParse(payload);

  if (!result.success) {
    const [firstError] = result.error.issues;
    return NextResponse.json(
      {
        ok: false,
        message: firstError?.message ?? 'Please provide a valid email address.',
      },
      { status: 400 },
    );
  }

  const { email } = result.data;

  const apiKey = process.env.MAILJET_API_KEY;
  const apiSecret = process.env.MAILJET_API_SECRET;
  const listId = process.env.MAILJET_LIST_ID;

  if (!apiKey || !apiSecret || !listId) {
    console.error('Mailjet environment variables are not fully configured.');
    return NextResponse.json(
      { ok: false, message: 'Email service is not configured.' },
      { status: 500 },
    );
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;

    const commonHeaders = {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    } satisfies Record<string, string>;

    const ensureContactResponse = await fetch('https://api.mailjet.com/v3/REST/contact', {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({ Email: email }),
    });

    if (!ensureContactResponse.ok) {
      const responseText = await ensureContactResponse.text();
      let responseBody: unknown = responseText;

      try {
        responseBody = JSON.parse(responseText);
      } catch {
        // Ignore JSON parse errors and use plain text body for logging.
      }

      const isAlreadyExistsError =
        ensureContactResponse.status === 400 &&
        ((typeof responseBody === 'object' &&
          responseBody !== null &&
          (() => {
            const details = responseBody as Record<string, unknown>;
            const message = String(
              details.ErrorMessage ??
                details.message ??
                details.ErrorIdentifier ??
                details.ErrorCode ??
                '',
            ).toLowerCase();
            return message.includes('already exist');
          })()) ||
          (typeof responseBody === 'string' &&
            responseBody.toLowerCase().includes('already exist')));

      if (!isAlreadyExistsError) {
        console.error('Mailjet contact creation failed', {
          status: ensureContactResponse.status,
          body: responseBody,
        });

        return NextResponse.json(
          { ok: false, message: 'Failed to subscribe to the newsletter.' },
          { status: 500 },
        );
      }
    }

    const manageContactResponse = await fetch(
      `https://api.mailjet.com/v3/REST/contactslist/${listId}/managecontact`,
      {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({
          Email: email,
          Action: 'addforce',
        }),
      },
    );

    if (!manageContactResponse.ok) {
      const responseText = await manageContactResponse.text();
      let responseBody: unknown = responseText;

      try {
        responseBody = JSON.parse(responseText);
      } catch {
        // Ignore JSON parse errors and use plain text body for logging.
      }

      console.error('Mailjet list subscription failed', {
        status: manageContactResponse.status,
        body: responseBody,
      });

      return NextResponse.json(
        { ok: false, message: 'Failed to subscribe to the newsletter.' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Mailjet integration request failed', { error });

    return NextResponse.json(
      { ok: false, message: 'Failed to subscribe to the newsletter.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
