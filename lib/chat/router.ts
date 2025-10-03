export type ChatRole = 'assistant' | 'user'

export type ChatMessage = {
  role: ChatRole
  content: string
  createdAt: number
}

export type QuickReply = {
  id: string
  label: string
  value: string
}

export type ChatSession = {
  hasOpenedScheduler: boolean
  awaitingContactEmail: boolean
  pendingContactSummary?: string
}

export type ContactForwardPayload = {
  name: string
  email: string
  message: string
}

export type ChatRouteInput = {
  message: string
  session?: ChatSession
}

export type ChatRouteOutput = {
  replies: string[]
  session: ChatSession
  quickReplies: QuickReply[]
  openScheduler?: boolean
  forwardContact?: ContactForwardPayload
}

const BOOKING_KEYWORDS = [
  'book',
  'schedule',
  'calendly',
  'cal.com',
  'calendar',
  'meeting',
  'call',
]

const CONTACT_KEYWORDS = [
  'contact',
  'talk to',
  'reach out',
  'sales',
  'human',
  'connect me',
]

const CAPABILITIES_KEYWORDS = ['services', 'capabilities', 'what do you do', 'offer']

const CASE_STUDY_KEYWORDS = ['case study', 'case studies', 'proof', 'examples']

const EMAIL_REGEX = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/

export function createDefaultSession(): ChatSession {
  return {
    hasOpenedScheduler: false,
    awaitingContactEmail: false,
    pendingContactSummary: undefined,
  }
}

export function getQuickReplies(session: ChatSession): QuickReply[] {
  const replies: QuickReply[] = []

  if (!session.hasOpenedScheduler && !session.awaitingContactEmail) {
    replies.push({ id: 'book', label: 'Book a call', value: 'Can we book time together?' })
  }

  replies.push(
    { id: 'capabilities', label: 'What can you help with?', value: 'What does Icarius help with?' },
    { id: 'cases', label: 'Show me case studies', value: 'Do you have case studies?' },
  )

  if (!session.awaitingContactEmail) {
    replies.push({ id: 'contact', label: 'Talk to sales', value: 'Can someone reach out to me?' })
  } else {
    replies.push({ id: 'alt-book', label: 'Use the scheduler', value: 'Can I just use the scheduling link instead?' })
  }

  return replies
}

function matchKeywords(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword))
}

function summarizeForContact(message: string): string {
  if (!message) {
    return 'Chat widget visitor requested a follow-up.'
  }

  const trimmed = message.trim()
  if (trimmed.length > 280) {
    return `${trimmed.slice(0, 277)}...`
  }

  return trimmed
}

function extractNameCandidate(message: string, email: string): string | undefined {
  const lower = message.toLowerCase()
  const index = lower.indexOf(email.toLowerCase())
  const before = index >= 0 ? message.slice(0, index).trim() : ''

  if (!before) {
    return undefined
  }

  const words = before
    .split(/[,\n]/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (words.length === 0) {
    return undefined
  }

  const candidate = words[words.length - 1]
  if (!candidate) {
    return undefined
  }

  if (candidate.split(' ').length > 5) {
    return undefined
  }

  return candidate
}

export function routeChatMessage(input: ChatRouteInput): ChatRouteOutput {
  const rawMessage = input.message ?? ''
  const normalized = rawMessage.trim()
  const lower = normalized.toLowerCase()
  const currentSession = input.session ?? createDefaultSession()

  const session: ChatSession = {
    hasOpenedScheduler: currentSession.hasOpenedScheduler,
    awaitingContactEmail: currentSession.awaitingContactEmail,
    pendingContactSummary: currentSession.pendingContactSummary,
  }

  const replies: string[] = []
  let openScheduler = false
  let forwardContact: ContactForwardPayload | undefined

  if (!normalized) {
    replies.push('Let me know how I can help — you can ask about services, case studies, or booking time.')
    return {
      replies,
      session,
      quickReplies: getQuickReplies(session),
    }
  }

  if (session.awaitingContactEmail) {
    const match = normalized.match(EMAIL_REGEX)
    if (!match) {
      replies.push("I didn't spot an email address in that message. Could you share it so the team can reach you?")
      return {
        replies,
        session,
        quickReplies: getQuickReplies(session),
      }
    }

    const email = match[0]
    const nameCandidate = extractNameCandidate(normalized, email)
    const name = nameCandidate?.replace(/[^a-zA-Z\s'-]/g, '').trim() || 'Website Visitor'
    const summary = session.pendingContactSummary ?? 'Chat widget visitor requested a follow-up.'

    forwardContact = {
      name,
      email,
      message: `${summary}\n\nLatest message: ${normalized}`,
    }

    session.awaitingContactEmail = false
    session.pendingContactSummary = undefined

    replies.push(
      "Thanks! I've passed this along to the Icarius team — they'll be in touch soon.",
      'Anything else I can help you with in the meantime?',
    )

    return {
      replies,
      session,
      quickReplies: getQuickReplies(session),
      forwardContact,
    }
  }

  if (matchKeywords(lower, BOOKING_KEYWORDS)) {
    openScheduler = true
    session.hasOpenedScheduler = true
    replies.push(
      'Great! Opening the scheduler now so you can grab a slot that works best.',
      'If you need help preparing for the call, just let me know.',
    )

    return {
      replies,
      session,
      quickReplies: getQuickReplies(session),
      openScheduler,
    }
  }

  if (matchKeywords(lower, CONTACT_KEYWORDS)) {
    session.awaitingContactEmail = true
    session.pendingContactSummary = summarizeForContact(normalized)
    replies.push(
      "Happy to connect you with the team! Drop your name and email below and I'll pass it along.",
      'If you prefer, I can share the scheduler link as well.',
    )

    return {
      replies,
      session,
      quickReplies: getQuickReplies(session),
    }
  }

  if (matchKeywords(lower, CAPABILITIES_KEYWORDS)) {
    replies.push(
      'Icarius helps climate-tech founders with go-to-market strategy, customer discovery, and venture storytelling.',
      'We partner with teams on messaging, fundraising support, and building scalable growth experiments.',
      'Would you like to dive into case studies or book a call to chat live?',
    )

    return {
      replies,
      session,
      quickReplies: getQuickReplies(session),
    }
  }

  if (matchKeywords(lower, CASE_STUDY_KEYWORDS)) {
    replies.push(
      'Absolutely. Here are a few highlights:',
      '• Helped a carbon-removal startup refine investor narrative and close their seed round.\n• Partnered with a climate data platform to launch a new enterprise GTM motion.\n• Guided a battery recycling venture through customer discovery to land pilot deployments.',
      'Curious about any of these in more detail?',
    )

    return {
      replies,
      session,
      quickReplies: getQuickReplies(session),
    }
  }

  replies.push(
    "I'm here to help with Icarius services, case studies, or booking time with the team.",
    'Feel free to ask about anything specific or use the quick replies below.',
  )

  return {
    replies,
    session,
    quickReplies: getQuickReplies(session),
  }
}
