export type ChatSession = {
  hasOpenedScheduler: boolean;
  awaitingContactEmail: boolean;
  pendingContactSummary?: string;
};

export type ContactForwardPayload = {
  email: string;
  summary: string;
  source: 'chat-assistant';
};

type RouteChatMessageArgs = {
  message: string | null | undefined;
  session: ChatSession;
};

const schedulerKeywords = [
  'schedule',
  'book',
  'calendar',
  'call',
  'meeting',
];

const faqResponses: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['service', 'services', 'offer'],
    reply:
      "We provide strategy, design, and engineering services focused on data-rich digital products.",
  },
  {
    keywords: ['price', 'pricing', 'cost'],
    reply:
      'Our pricing is tailored to each engagement. Share a bit about your needs and we can provide a proposal.',
  },
  {
    keywords: ['audit', 'assessment', 'review'],
    reply:
      'We offer product, data, and AI audits to uncover opportunities and roadmap next steps.',
  },
  {
    keywords: ['ai', 'artificial intelligence', 'machine learning'],
    reply:
      'AI and machine learning are core to our practice—we help teams design and ship responsible AI products.',
  },
];

const contactKeywords = [
  'contact',
  'reach out',
  'email me',
  'talk to',
  'speak with',
  'human',
  'person',
  'sales',
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export const createDefaultSession = (): ChatSession => ({
  hasOpenedScheduler: false,
  awaitingContactEmail: false,
  pendingContactSummary: undefined,
});

export const routeChatMessage = ({
  message,
  session,
}: RouteChatMessageArgs): {
  replies: string[];
  session: ChatSession;
  openScheduler?: boolean;
  forwardContact?: ContactForwardPayload;
} => {
  const text = (message ?? '').trim();
  const replies: string[] = [];
  const updatedSession: ChatSession = {
    hasOpenedScheduler: session.hasOpenedScheduler,
    awaitingContactEmail: session.awaitingContactEmail,
    pendingContactSummary: session.pendingContactSummary,
  };

  if (updatedSession.awaitingContactEmail) {
    if (!text) {
      replies.push("I'd still love to connect—could you share the best email to reach you?");
      return { replies, session: updatedSession };
    }

    if (emailRegex.test(text)) {
      const forwardContact: ContactForwardPayload = {
        email: text,
        summary: updatedSession.pendingContactSummary ?? '',
        source: 'chat-assistant',
      };

      updatedSession.awaitingContactEmail = false;
      updatedSession.pendingContactSummary = undefined;
      replies.push("Thanks! I've passed this along to the team and they'll reach out soon.");

      return {
        replies,
        session: updatedSession,
        forwardContact,
      };
    }

    replies.push("That doesn't look like a valid email. Could you try again?");
    return { replies, session: updatedSession };
  }

  if (!text) {
    replies.push("Could you share a bit more about what you're looking for?");
    return { replies, session: updatedSession };
  }

  const lower = text.toLowerCase();

  if (
    schedulerKeywords.some((keyword) =>
      lower.includes(keyword)
    )
  ) {
    const openScheduler = !updatedSession.hasOpenedScheduler;
    updatedSession.hasOpenedScheduler = true;
    replies.push('Happy to get something on the calendar! Opening our scheduler now.');

    return {
      replies,
      session: updatedSession,
      openScheduler: openScheduler ? true : undefined,
    };
  }

  if (contactKeywords.some((keyword) => lower.includes(keyword))) {
    updatedSession.awaitingContactEmail = true;
    updatedSession.pendingContactSummary = text;
    replies.push(
      "I'd be happy to connect you with the team. What's the best email to reach you?"
    );
    return { replies, session: updatedSession };
  }

  const matchedFaq = faqResponses.find((entry) =>
    entry.keywords.some((keyword) => lower.includes(keyword))
  );

  if (matchedFaq) {
    replies.push(matchedFaq.reply);
    return { replies, session: updatedSession };
  }

  replies.push(
    "Thanks for reaching out! Let me know if you're interested in our services, want to schedule a call, or need an introduction to the team."
  );

  return { replies, session: updatedSession };
};
