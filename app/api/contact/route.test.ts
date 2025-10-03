import { describe, expect, it, vi } from 'vitest';
import { handleContactRequest } from './handler';

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('handleContactRequest', () => {
  it('returns 400 when required fields are missing', async () => {
    const request = createRequest({ name: 'John', email: '', company: 'Acme', message: '' });

    const response = await handleContactRequest(request, {
      sendEmail: async () => {
        throw new Error('should not be called');
      },
    });

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.errors).toMatchObject([
      { field: 'email' },
      { field: 'message' },
    ]);
  });

  it('returns 500 when email sending fails', async () => {
    const request = createRequest({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello there',
      plan: 'audit-sprint',
    });

    const response = await handleContactRequest(request, {
      sendEmail: async () => {
        throw new Error('SMTP unavailable');
      },
    });

    expect(response.status).toBe(500);
    const payload = await response.json();
    expect(payload).toEqual({ error: 'Failed to send contact message.' });
  });

  it('returns 200 when email sending succeeds', async () => {
    const request = createRequest({
      name: 'Jane Doe ',
      email: 'jane@example.com',
      company: ' Example Co ',
      message: 'Hello there',
      plan: ' delivery-jumpstart ',
    });

    let sentPayload: unknown;
    const response = await handleContactRequest(request, {
      sendEmail: async (payload) => {
        sentPayload = payload;
      },
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual({ ok: true });
    expect(sentPayload).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'Example Co',
      message: 'Hello there',
      plan: 'delivery-jumpstart',
    });
  });

  it('invokes webhook before logging metadata', async () => {
    const request = createRequest({
      name: 'Amy Example',
      email: 'amy@example.com',
      message: 'Hello',
    });

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }));
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    process.env.CONTACT_WEBHOOK_URL = 'https://example.com/webhook';

    const response = await handleContactRequest(request, {
      sendEmail: async () => {},
    });

    expect(response.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.com/webhook',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(infoSpy).toHaveBeenCalledWith(
      'Contact request processed',
      expect.objectContaining({
        emailDomain: 'example.com',
        companyProvided: false,
        plan: null,
        messageLength: 5,
      }),
    );

    fetchSpy.mockRestore();
    infoSpy.mockRestore();
    errorSpy.mockRestore();
    delete process.env.CONTACT_WEBHOOK_URL;
  });
});
