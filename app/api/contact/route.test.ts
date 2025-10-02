import { describe, expect, it } from 'vitest';
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
      company: 'Example Co',
      message: 'Hello there',
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
    });

    let sentPayload: unknown;
    const response = await handleContactRequest(request, {
      sendEmail: async (payload) => {
        sentPayload = payload;
      },
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual({ success: true });
    expect(sentPayload).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'Example Co',
      message: 'Hello there',
    });
  });
});
