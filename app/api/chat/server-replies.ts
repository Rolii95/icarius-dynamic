import type { ContactForwardPayload, ChatSession } from '@/lib/chat/router'

export type ServerReplyInput = {
  message: string
  session: ChatSession
}

export type ServerReplyResult = {
  replies: string[]
  session: ChatSession
  openScheduler?: boolean
  forwardContact?: ContactForwardPayload
}

const FAQ_ENTRIES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['how quickly', 'start', 'kick off', 'timeline', 'get started'],
    answer: 'We can usually start within two weeks, and often faster for audit-style engagements.',
  },
  {
    keywords: ['work globally', 'global', 'emea', 'north america', 'international'],
    answer: 'Yes — Icarius delivers remotely across EMEA and North America with governance built for distributed teams.',
  },
  {
    keywords: ['systems', 'platforms', 'workday', 'successfactors', 'dayforce', 'oracle', 'payroll', 'ats', 'idm'],
    answer: 'Our team covers Workday, SuccessFactors, Dayforce, Oracle, plus payroll, ATS, and identity platforms.',
  },
  {
    keywords: ['case studies', 'examples', 'proof', 'results'],
    answer:
      'Recent work includes a global HCM replacement for 40k employees, payroll consolidation across 12 countries, and an HR ops assistant that cut handle time by 34%.',
  },
  {
    keywords: ['services', 'capabilities', 'what do you do', 'offer'],
    answer:
      'Icarius partners with HRIT and people teams on GTM strategy, delivery assurance, HR systems audit, and AI readiness — all with pragmatic, hands-on support.',
  },
]

const openAIApiKey = process.env.OPENAI_API_KEY
const openAIModel = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'

export async function getServerSideReplies(
  input: ServerReplyInput,
): Promise<ServerReplyResult | null> {
  const normalized = input.message.trim()
  const lower = normalized.toLowerCase()
  const session: ChatSession = {
    hasOpenedScheduler: input.session.hasOpenedScheduler,
    awaitingContactEmail: input.session.awaitingContactEmail,
    pendingContactSummary: input.session.pendingContactSummary,
  }

  if (!normalized) {
    return {
      replies: [
        'Let me know how I can help — you can ask about our services, case studies, or how to get started.',
      ],
      session,
    }
  }

  const matchedFaq = FAQ_ENTRIES.find((entry) =>
    entry.keywords.some((keyword) => lower.includes(keyword)),
  )

  if (matchedFaq) {
    return {
      replies: [matchedFaq.answer],
      session,
    }
  }

  if (!openAIApiKey) {
    return null
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: openAIModel,
        messages: [
          {
            role: 'system',
            content:
              'You are the Icarius website assistant. Answer concisely based on Icarius\'s HRIT advisory, HR systems audit, HR AI innovation, and PMO delivery services.',
          },
          { role: 'user', content: normalized },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    })

    if (!response.ok) {
      console.error('OpenAI chat completion failed', await response.text())
      return null
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const content = data.choices?.[0]?.message?.content?.trim()

    if (!content) {
      return null
    }

    return {
      replies: [content],
      session,
    }
  } catch (error) {
    console.error('OpenAI request error', error)
    return null
  }
}
