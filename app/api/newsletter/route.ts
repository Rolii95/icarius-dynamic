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

  // TODO: Replace this log with integration to the selected ESP provider.
  console.info('Newsletter subscription received', { email });

  return NextResponse.json({ ok: true });
}
