import { describe, expect, it } from 'vitest';
import {
  ChatSession,
  ContactForwardPayload,
  createDefaultSession,
  routeChatMessage,
} from './router';

describe('chat router', () => {
  it('creates a default session with cleared flags', () => {
    expect(createDefaultSession()).toEqual<ChatSession>({
      hasOpenedScheduler: false,
      awaitingContactEmail: false,
      pendingContactSummary: undefined,
    });
  });

  it('opens scheduler when scheduling keywords are detected', () => {
    const session = createDefaultSession();
    const result = routeChatMessage({
      message: 'Can we schedule a call next week?',
      session,
    });

    expect(result.openScheduler).toBe(true);
    expect(result.session.hasOpenedScheduler).toBe(true);
    expect(result.replies[0]).toContain('scheduler');

    const followUp = routeChatMessage({
      message: 'Schedule another one',
      session: result.session,
    });

    expect(followUp.openScheduler).toBeUndefined();
    expect(followUp.session.hasOpenedScheduler).toBe(true);
  });

  it('captures contact intent and forwards details when provided a valid email', () => {
    const initial = routeChatMessage({
      message: "I'd like to contact someone about pricing.",
      session: createDefaultSession(),
    });

    expect(initial.session.awaitingContactEmail).toBe(true);
    expect(initial.session.pendingContactSummary).toContain('pricing');
    expect(initial.forwardContact).toBeUndefined();

    const emailStep = routeChatMessage({
      message: 'user@example.com',
      session: initial.session,
    });

    const payload = emailStep.forwardContact as ContactForwardPayload;
    expect(payload.email).toBe('user@example.com');
    expect(payload.summary).toContain('pricing');
    expect(payload.source).toBe('chat-assistant');
    expect(emailStep.session.awaitingContactEmail).toBe(false);
    expect(emailStep.session.pendingContactSummary).toBeUndefined();
    expect(emailStep.replies[0]).toMatch(/Thanks!/i);
  });

  it('prompts again if email validation fails while awaiting contact email', () => {
    const initial = routeChatMessage({
      message: 'Please contact me',
      session: createDefaultSession(),
    });

    const retry = routeChatMessage({
      message: 'not-an-email',
      session: initial.session,
    });

    expect(retry.forwardContact).toBeUndefined();
    expect(retry.session.awaitingContactEmail).toBe(true);
    expect(retry.replies[0]).toMatch(/valid email/i);
  });

  it('falls back to a general assistance message when no keywords match', () => {
    const result = routeChatMessage({
      message: 'Just browsing around.',
      session: createDefaultSession(),
    });

    expect(result.replies[0]).toMatch(/Thanks for reaching out/i);
  });
});
